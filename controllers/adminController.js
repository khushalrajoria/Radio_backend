const validator = require("email-validator");
const RoleTB = require('../models/roleTB');
const UserTB = require('../models/userTB');
const Doctor = require('../models/doctorsDetail');
const LoginDetail = require('../models/loginDetail');
const Key= require('../models/key');
const Otp = require('../models/otp');
const SymptomByQualification= require('../models/specialization-symptom');
const Qualification = require('../models/qualification');

const bcrypt = require("bcryptjs");
const uuid = require('uuid');
const getOtp = require('../functions/GetOtp');
const ApiError = require('../functions/ApiError');

//Add roles
const AddRole= async(req,res)=>{
     try{
         const{Name}=req.body;
         if(!Name)
         {
            return res.status(200).json({
                status: 400,
                errorcode: "104",
                message: "Please provide name",
                data: {},
              });
         }
         const Role=new RoleTB({
            Name:Name,
            AddedOn: new Date()
         });

         await Role.save();
         return res.status(200).json({
            status:201,
            errorcode:"000",
            message:"Role added successsfully",
         });
     }catch(error)
     {
        ApiError(err,"AddRole");
        return res.status(200).json({ status: 500, errorcode: "103", message: err.message });
     }
};

//Getting Role list
const GetRoleList= async(req,res)=>{
    try{
        const RoleData = await RoleTB.find();
  
         return res.status(200).json({
            status:200,
            errorcode:"000",
            data:RoleData
         });
    }catch(error)
    {
       ApiError(err,"GetRoleList");
       return res.status(200).json({ status: 500, errorcode: "103", message: err.message });
    }
};


//SignUp for gives roles
const Signup= async(req,res)=>{
   try{
      var ID ;//for storing userID
       const{Name, Email, RoleID, Mobile, Password, FcmToken, DeviceID, AddedBy,Platform,Appversion}=req.body;
       if(!Name || !Email || !RoleID || !Mobile || !Password || !FcmToken || !DeviceID){
         return res.status(200).json({
            status: 400,
            errorcode: "104",
            message: "Please fill all the field.",
            data: {},
          });
       }
       const email=Email.toLowerCase();
       if (!validator.validate(email)) {
          return res.status(200) .json({
             status: 401,
             errorcode: "101",
             message: "Email id is not valid",
           });
        }
        const EmailExist = await UserTB.find({Email:email}).count();
        
        if(EmailExist>0){
           return res.status(200).json({
              status: 402,
              errorcode: "100",
              message: "Email id is already exist",
              });
        }
        
        const MobileExist = await UserTB.find({Mobile:Mobile}).count();
        if(MobileExist>0)
        {
         return res.status(200).json({
            status: 402,
            errorcode: "100",
            message: "Mobile no is already exist",
            });
        }

        

       //only Admin and super Admin can add other role user.(AddedBy=="" if anyone sign from mobile application)
       if(AddedBy ==="644237bb86c46c12c1339998" || AddedBy ==="644237c086c46c12c133999a" || AddedBy==""){
         const User = new UserTB({
              Name: Name,
              Email: email, 
              RoleID: RoleID, 
              Mobile: Mobile, 
              Password: Password, 
              FcmToken: FcmToken, 
              DeviceID: DeviceID, 
              AddedBy: AddedBy?AddedBy:null,
              AddedOn: new Date(),
              Platform: Platform?Platform:'',
              Appversion : Appversion?Appversion:'',
           });
           await User.save();
           ID=User._id;
           if(RoleID == "644237c786c46c12c133999c") //using doctor roleID
           {
            const Data = new Doctor({
               DoctorID:ID,
               Name: User.Name,
               Email: User.Email,
               MobileNo: User.Mobile,
               AddedBy: User.AddedBy,
               AddedOn: User.AddedOn,
               DoctorType:'Hired By Kapeefit',
            });

            await Data.save();   
            }

            //storing details in login table an key
            const LoginData = new LoginDetail({
               UserId: ID,
            });
            await LoginData.save();
    
             const KeyData = new Key({
                UserId:ID
             });
            await KeyData.save();

            return res.status(200).json({
               status:201,
               errorcode:"000",
               message:"User Sign up successfully."
             });

          }else{
         return res.status(200).json({
            status:408 , 
            errorcode:"109",
            message:"You are not authorized person to register other user."
         });
        }
   }catch(error){
      ApiError(error,"Signup");
      return res.status(200).json({ status: 500, errorcode: "103", message: error.message });
   }
};


const Signin= async(req,res)=>{
   try{
      const{email, password, fcmToken, deviceID, platform, appversion}=req.body;

      if(!email || !Password ||  !DeviceID || !Platform || !Appversion)
      {
        return res.status(200).json({status: 400,errorcode: "104", message: "Please provide required field."});
      }
      
      const EmailExist = await UserTB.findOne({Email:email.toLowerCase()});

      if(EmailExist!=null){
         const IsMatch = await bcrypt.compare(Password,EmailExist.Password);

         if (!IsMatch){
             return res.status(200).json({
              status: 406,
              errorode: "105",
              message: "Incorrect Password",
          });
         }

         await LoginDetail.updateOne({UserId:EmailExist._id},{$set:{AddedOn: new Date()}});
         await UserTB.updateOne({_id:EmailExist._id},{$set:{FcmToken:FcmToken, DeviceID:DeviceID, Platform:Platform, Appversion:Appversion}},{multi:true});
         
         const data = await getOtp(EmailExist.Mobile,EmailExist._id);
       
        if (data != null) {
           await data.save();
           return res.status(200).json({status: 200,errorcode: "000",
           message:"OTP send to user mobile number and it will expires in 2 minutes",
           userId:EmailExist._id
         });
         } else {
           return res.status(200).send({ status: 406, message: "Error" });
        }
      }else{
         return res.status(200).json({status: 400,errorcode: "102", message: "Record not found."});
      }
    
   }catch(error)
   {
      ApiError(error,"Signin");
      return res.status(200).json({ status: 500, errorcode: "103", message: error.message });
   }
};

//verify OTP for doctors and other person
const otpverify= async (req, res) => {
   try {
     const { userId,otp} = req.body;
 
     if (!userId || !otp) {
       return res.status(200).json({
           status: 400,
           errorcode: "104",
           message: "Please fill all the field properly",
           data: {},
         });
     }
         let data = await Otp.findOne({$and:[{ UserID: userId,Otp: otp }]}).lean().exec();
         if (!data) {
           return res.status(200).json({ 
              status: 400, 
              errorcode: "104", 
              error: "OTP is expired" });
          } else {
             await Otp.deleteOne({UserID:userId});
             await LoginDetail.updateOne({UserId: userId},{$set:{IsVerified:1,AddedOn: new Date()}},{multi:true});
            
            const ID = uuid.v4();        
            await Key.updateOne({UserId: userId},{$set:{KeyID:ID, IsActive:1,AddedOn:new Date()}},{multi:true});
 
             res.status(200).json({
               status: 200,
               errorcode: "000",
               message: "Otp verify successfully",
               keyId: ID
         });
      }
   } catch (error) {
     ApiError(error,"Otpverify");
     return res.status(200).json({ 
        status: 500, 
        errorcode: "103", 
        message: error.message });
   }
};
 
//Get profile
const GetProfile=async(req,res)=>{
   try{
      const{KeyId}=req.body;
      if(!KeyId)
      {
        return res.status(200).json({status: 400,errorcode: "104", message: "Please provide key."});
      }

      let KeyExist = await Key.findOne({$and:[{KeyID:KeyId},{IsActive:1}]});
     
     
      if(KeyExist === null)
      {
        return res.status(200).json({
          status:400,
          errorcode:"102",
          message:"Record not found",
          body:{}
         }); 
           
      }else
      {
        const projection = { Name:1, Email:1, Mobile:1 };
        const data = await UserTB.findOne({_id:KeyExist.UserId},projection);
 
        //if user is a doctor then data comes from doctor table
        if(data.RoleID =="644237c786c46c12c133999c")
        {
         //show only specific field
         const Projection = { Name:1, Email:1, MobileNo:1, Qualifications:1, Specializations:1, Experience:1, Availability:1, Photo:1 };
          const DoctorData = await Doctor.findOne({ DoctorID:data._id},Projection);
          return res.status(200).json({
            status:200,
            errorcode:"000",
            body:DoctorData});
        }else{
           return res.status(200).json({
              status:200,
              errorcode:"000",
              body:data});
         }
      }
   }catch(error)
   {
      ApiError(error,"GetProfile");
      return res.status(200).json({ status: 500, errorcode: "103", message: error.message });
   }
};

//Update profile
const UpdateProfile=async(req,res)=>{
   try{
     const{KeyId,Name,Email,Mobile}=req.body;
      if(!KeyId)
      {
        return res.status(200).json({status: 400,errorcode: "104", message: "Please provide key."});
      }

      const KeyExist = await Key.findOne({$and:[{KeyID:KeyId},{IsActive:1}]});
       if(KeyExist === null){
        return res.status(200).json({
           status:400,
           errorcode:"102",
           message:"Record not found",
           body:{} 
         });      
      }else{
          const UserData = await UserTB.findOne({_id:KeyExist.UserId});

          await UserTB.updateOne({_id:KeyExist.UserId},{$set:{
            Name: Name?Name:UserData.Name,
            Email: Email?Email:UserData.Email,
            Mobile: Mobile?Mobile:UserData.Mobile,
            AddedOn: new Date() 
           }},{multi:true});

          return res.status(200).json({
            status:200,
            errorcode:"000",
            message:"User profile is Updated."
         });
      }

   }catch(error){
      ApiError(error,"UpdateProfile");
      return res.status(200).json({ status: 500, errorcode: "103", message: error.message });
   }
};

//Doctor profile
const UpdateDoctorProfile=async(req,res)=>{
   try{
     const{KeyId,Name, Email, MobileNo, Qualifications, Specializations, Experience, Availability, Photo}=req.body;
      if(!KeyId)
      {
        return res.status(200).json({status: 400,errorcode: "104", message: "Please provide key."});
      }

      const KeyExist = await Key.findOne({$and:[{KeyID:KeyId},{IsActive:1}]});
       if(KeyExist === null){
        return res.status(200).json({
           status:400,
           errorcode:"102",
           message:"Record not found",
           body:{} 
         });      
      }else{
         
          const UserData = await UserTB.findOne({_id:KeyExist.UserId});
          
          await UserTB.updateOne({_id:KeyExist.UserId},{$set:{
            Name: Name?Name:UserData.Name,
            Email: Email?Email:UserData.Email,
            Mobile: MobileNo?MobileNo:UserData.Mobile,
            AddedOn: new Date() 
           }},{multi:true});
           
           const DoctorData = await Doctor.findOne({ DoctorID:KeyExist.UserId}); //check isApproved?
           await Doctor.updateOne({ DoctorID:KeyExist.UserId},{$set:{
              Name: Name?Name: DoctorData.Name,
              Email: Email?Email: DoctorData.Email,
              MobileNo: MobileNo?MobileNo: DoctorData.MobileNo,
              Qualifications: Qualifications?Qualifications: DoctorData.Qualifications,
              Specializations: Specializations?Specializations: DoctorData.Specializations,
              Experience: Experience?Experience: DoctorData.Experience, 
              Availability: Availability?Availability: DoctorData.Availability,
              AddedOn: new Date() 
             // Photo
             }},{multi:true});
          return res.status(200).json({
            status:200,
            errorcode:"000",
            body: UserData 
         });
      }

   }catch(error){
      ApiError(error,"UpdateDoctorProfile");
      return res.status(200).json({ status: 500, errorcode: "103", message: error.message });
   }
};


const IsDoctor=async(req,res)=>{
   try{
      
      const{KeyId}=req.body;

      if(!KeyId)
      {
        return res.status(200).json({status: 400,errorcode: "104", message: "Please provide key."});
      }

      const KeyExist = await Key.findOne({$and:[{KeyID:KeyId},{IsActive:1}]});
      if(KeyExist === null){
       return res.status(200).json({
          status:400,
          errorcode:"102",
          message:"Record not found",
          body:{} 
        });      
      }
      
      const Data= await UserTB.findOne({_id:KeyExist.UserId});
      if(Data.RoleID =="644237c786c46c12c133999c"){
         return res.status(200).json({
            status:200,
            errorcode:"000",
            message:"UserType is dcotor"});
      }else{
         return res.status(200).json({
            status:200,
            errorcode:"000",
            message:"UserType is not dcotor"});
      }       
   }catch(error){
      ApiError(error,"IsDoctor");
      return res.status(200).json({ status: 500, errorcode: "103", message: error.message });
   }
};

const AddSymptomByQualification=async(req,res)=>{
   try{
       const{Qualification,Symptom}=req.body;

       if(!Qualification || !Symptom){
         return res.status(200).json({status: 400,errorcode: "104", message: "Please provide qualification and Symptom."});
       }

       const data= new SymptomByQualification({
         Qualification: Qualification,
         Symptom: Symptom
       });
       await data.save();
       return res.status(200).json({
         status:201,
         errorcode:"000",
         message:"Record added successfully"});

   }catch(error){
      ApiError(error,"AddSymptomByQualification");
      return res.status(200).json({ status: 500, errorcode: "103", message: error.message });
   }
};


const AddQualification=async(req,res)=>{
  try{
       const{qualification}=req.body;
       if(!qualification)
       {
         return res.status(200).json({status: 400,errorcode: "104", message: "Please provide qualification."});
       }

       const data= new Qualification({
         Qualification:qualification
       });
       await data.save();
       return res.status(200).json({
         status:201,
         errorcode:"000",
         message:"Qualification added successfully"});
  }catch(error){
    ApiError(error,"AddQualification");
    return res.status(200).json({ status: 500, errorcode: "103", message: error.message });
  }
};

const GetQualificationList=async(req,res)=>{
   try{

      //fetch only qualification and id fields
      const data= await Qualification.find({},{_id:1,Qualification:1});
      return res.status(200).json({
         status:200,
         errorcode:"000",
         body:data
      });
   }catch(error){
      ApiError(error,"GetQualificationList");
      return res.status(200).json({ status: 500, errorcode: "103", message: error.message });
   }
};




module.exports={
    AddRole,
    GetRoleList,
    Signup,
    Signin,
    otpverify,
    GetProfile,
    UpdateProfile,
    UpdateDoctorProfile,
    IsDoctor,
    AddSymptomByQualification,
    AddQualification,
    GetQualificationList
}