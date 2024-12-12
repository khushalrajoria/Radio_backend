const ApiError = require('../functions/ApiError');
const bcrypt = require("bcryptjs");
const userModel = require("../models/userTB")
const RoleModel = require("../models/roleTB")
const clinicModel = require("../models/clinic")
const doctorModel = require("../models/doctorModel")
const forgetPasswordModel = require("../models/forgetPassword")
const fileUpload = require("../models/FileUpload")
const jwt = require("jsonwebtoken")
const _ = require('lodash');
const path = require('path');
const { sendNotification } = require('../utils/firebaseNotification');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const uploadImg = require('../functions/upload');
const { v4: uuidv4 } = require('uuid');
const { userValidSchema, emailAndPasswordSchema, ValidStatusSchema } = require("../validation/valid")
const { ResponceAPI } = require("../utils/ResponceAPI")
const { postApiAccess, getApiAccess, deleteApiAccess, updateApiAccess } = require("../utils/validAPIAccess")
const {uploadFile,deleteFile} = require('../utils/awsConfig');
const version = process.env.API_VERSION


// ----- Create Employees ---///
const createUser = async (req, res) => {
    try {
        const { name, email, roleID, gender, mobile,employeeNumber } = req.body
        const { error, value } = userValidSchema.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            return res.status(400).send(ResponceAPI(false, null, null, 400, error.details[0].message, version))
        }
        const userType = await RoleModel.findOne({ _id: roleID })

        if (!userType) {
            return res.status(404).send(ResponceAPI(false, null, null, 404, "role id is invalid", version))
        }
        const randomBytes = crypto.randomBytes(8);

        const password = "12345678";
        //randomBytes.toString('hex').slice(0, 8);
        console.log(password);
        if (userType.role != "doctor" && userType.role != "patient") {
            const { error, value } = emailAndPasswordSchema.validate(req.body, {
                abortEarly: false,
            });

            if (error) {
                return res.status(400).send(ResponceAPI(false, null, null, 400, error.details[0].message, version))
            }

            const emailExist = await userModel.findOne({ email: email }).populate("roleID");
            if (emailExist) {
                return res.status(400).send(ResponceAPI(false, null, null, 409, "Email already registred. Please try another email.", version))
            }
            encryptedPassword = await bcrypt.hash(password, 10)
        }
        const phoneExist = await userModel.findOne({ mobile: mobile });
        if (phoneExist) {
            return res.status(400).send(ResponceAPI(false, null, null, 409, "Mobile already registred. Please try another mobile", version))
        }
        console.log("req files",req.files)
        if (req.files && req.files.length > 0) {

            uploadImg(req, res, async function (err) {
                const file = req.files[0];
                let picture = null;
                picture = await uploadFile.uploadFile(file, "empProfile")
                console.log("pic location",picture.location);
                const userData = { name, email, mobile, gender,  roleID, password: encryptedPassword, image: picture.location, addedBy: req.user_id }
                const userDetails = await userModel.create(userData);
                return res.status(201).send(ResponceAPI(true, "Employee created successfully with default password.", userDetails, null, null, version))
            })
        } else {
            const userData = { name, email, mobile, gender,roleID, password: encryptedPassword,employeeNumber, addedBy: req.user_id }
            const userDetails = await userModel.create(userData);
            return res.status(201).send(ResponceAPI(true, "Employee created successfully with default password. Unable to upload document.", userDetails, null, null, version))
        }
    } catch (error) {
        return res.status(500).send(ResponceAPI(false, "Something went wrong. Please try after sometime.", null, 500, error.message, version))
    }
};
//jatin
const loginUser = async (req, res) => {

    try {
        const { email, mobile, password, token } = req.body

        if (email && password) {
            let userDetails = null
            let userDate = await userModel.findOne({ $and: [{ email: email }, { isDeleted: false }] }).populate('roleID');
            //let partnerData = await partnerModel.findOne({ $and: [{ email: email }, { status: "Approved" }, { isDeleted: false }] }).populate('roleID');
            let clinicData = await clinicModel.findOne({ $and: [{ email: email }, { isDeleted: false }] }).populate('roleID');
            let doctorData = await doctorModel.findOne({ $and: [{email:email},{isDeleted: false}]}).populate('roleID')
            if (userDate) {
                userDetails = userDate
            }
            if (clinicData) {
                userDetails = clinicData
            }
            if(doctorData) {
                userDetails = doctorData
            }
            
            if (!userDetails) {
                return res.status(400).send(ResponceAPI(false, null, null, 400, "Invalid user email or password", version))
            }
            if(userDetails.isBlocked){
                return res.status(400).send(ResponceAPI(false, null, null, 400, "You have been blocked by admin. Please contact admin for further support", version))
            }
            const decryptPassword = await bcrypt.compare(password, userDetails.password)

            if (!decryptPassword) {
                return res.status(400).send(ResponceAPI(false, null, null, 400, "password is incorrect", version))

            }
            const roleID = userDetails.roleID
            let payload = { _id: userDetails._id, email: userDetails.email, mobile: userDetails.mobile, roleID: roleID }

            let generatedToken = jwt.sign(payload, process.env.SECRET_TOKEN_KEY, { expiresIn: '6000m' })
            const userData = {
                uuid: userDetails._id,
                role: "admin",
                data: {
                    displayName: userDetails.name,
                    photoURL: userDetails.image,
                    email: userDetails.email,
                    shortcuts: ['apps.calendar', 'apps.mailbox', 'apps.contacts', 'apps.tasks']
                }
            }
            // return res.status(200).send({ "user": userData, "access_token": generatedToken })
            userDetails.fcmToken = token
            userDetails.save()

            return res.status(200).send({ "message": "login successfully ", "access_token": generatedToken, "user": userDetails })

        } else if (mobile && password) {

            let userDetails = await userModel.findOne({ $and: [{ mobile: mobile }, { status: "Approved" }, { isDeleted: false }] }).populate('roleID');



            if (!userDetails) {
                return res.status(400).send(ResponceAPI(false, null, null, 400, "Invalid user email", version))
            }

            const decryptPassword = await bcrypt.compare(password, userDetails.password)

            if (!decryptPassword) {
                return res.status(400).send(ResponceAPI(false, null, null, 400, "password is incorrect", version))

            }
            const roleID = userDetails.roleID
            let payload = { _id: userDetails._id, email: userDetails.email, mobile: userDetails.mobile, roleID: roleID }

            let generatedToken = jwt.sign(payload, process.env.SECRET_TOKEN_KEY, { expiresIn: '6000m' })

            return res.status(200).send({ "message": "login successfully ", "user": userDetails, "access_token": generatedToken })


        } else {
            return res.status(400).send(ResponceAPI(false, null, null, 400, "must contain email and password", version))
        }

    } catch (error) {
        return res.status(500).send(ResponceAPI(false, "Something went wrong. Please try after sometime.", null, 500, error.message, version))
    }
};
//jatin
const deleteUser = async (req, res) => {
    try {

        const userId = req.params.userId

        const userDetails = await userModel.findOneAndUpdate({ _id: userId, isDeleted: false }, { isDeleted: true, deletedBy: req.user_id }, { new: true })

        if (!userDetails) {
            return res.status(404).send(ResponceAPI(false, null, null, 404, "User does not exist", version))
        }
        return res.status(200).send(ResponceAPI(true, "Deleted successfully ", userDetails, null, null, version))
    } catch (error) {
        return res.status(500).send(ResponceAPI(false, "server", null, 500, error.message, version))
    }
}

const userstatus = async (req, res) => {
    try {

        if (!updateApiAccess(req.permission)) {
            return res.status(401).send(ResponceAPI(false, null, null, 401, "unauthorized request", version))
        }
        const status = req.body.status
        const userId = req.params.userId
        if (['approved', 'rejected', 'pending'].indexOf(status)) {
            return res.status(404).send(ResponceAPI(false, null, null, 404, "enter valid status", version))
        }

        const userDetails = await userModel.findOneAndUpdate({ _id: userId, isDeleted: false }, { status: status }, { new: true })

        if (!userDetails) {
            return res.status(404).send(ResponceAPI(false, null, null, 404, "user in not exist", version))
        }
        sendNotification({
            "token": userDetails.fcmToken,
            "title": `Account update`,
            "body": `Your account now ${status}`,
            "userId": userDetails._id,
            "sendType": "admin"
        })
        return res.status(200).send(ResponceAPI(true, "status set successfully ", userDetails, null, null, version))
    } catch (error) {
        return res.status(500).send(ResponceAPI(false, "server error", null, 500, error.message, version))
    }
}

//jatin
const fetchUserList = async (req, res) => {
    try {
        const userList = await userModel.find({ isDeleted: false }).populate("roleID")
        const userIdsToRemove = [req.userID,process.env.AdminID];

const modifiedUserList = userList
  .map(user => user.toObject())
  .filter(user => !userIdsToRemove.includes(user._id.toString()));
        if(modifiedUserList.length > 0){
            return res.status(200).send(ResponceAPI(true, "Employee Data Found.", modifiedUserList, null, null, version))
        }else{
            return res.status(200).send(ResponceAPI(true, "No Data Found.", modifiedUserList, null, null, version))
        }
        
    } catch (error) {
        return res.status(500).send(ResponceAPI(false, "server error", null, 500, error.message, version))
    }
}

const getSingleUser = async (req, res) => {
    try {
        const user_id = req.userID
        const token = req.token
        let userDetails = null

        const userData = await userModel.findOne({ _id: user_id, status: "Approved", isDeleted: false }).populate("roleID")
        if (userData) {
            userDetails = userData
        }
        const partnerData = await clinicModel.findOne({ _id: user_id, status: { $in: ["Approved", "Published"] }, isDeleted: false }).populate("roleID")
        if (partnerData) {
            userDetails = partnerData
        }
        const doctorData = await doctorModel.findOne({_id: user_id,  isDeleted: false }).populate("roleID")
        if(doctorData){
            userDetails=doctorData;
        }
        if (!userDetails) {
            return res.status(404).send(ResponceAPI(false, null, null, 404, "user dose not exist", version))
        }
        return res.status(200).send(ResponceAPI(true, "Employee details", { userDetails, "access_token": token }, null, null, version))
    } catch (error) {
        return res.status(500).send(ResponceAPI(false, "server error", null, 500, error.message, version))
    }
}

const updateUser = async (req, res) => {
    try {
        const userID = req.params.userId
        const data = req.body
        const userDetails = await userModel.findOne({ _id: userID, isDeleted: "false",isBlocked:false })

        if (!userDetails) {
            return res.status(400).send(ResponceAPI(false, null, null, 400, "user id is invalid", version))
        }
        if (req.files && req.files.length > 0) {
            uploadImg(req, res, async function (err) {
                const file = req.files[0];
                let picture = null;
                picture = await uploadFile.uploadFile(file, "empProfile")
                let empData = { image: picture.location, ...data }
                const updateData = await userModel.updateOne({ _id: userID }, empData);
                return res.status(200).send(ResponceAPI(true, "update data", updateData, null, null, version))
            })
        } else {
            const updateData = await userModel.updateOne({ _id: userID }, data);
            return res.status(200).send(ResponceAPI(true, "update data", updateData, null, null, version))
        }






    } catch (error) {
        return res.status(500).send(ResponceAPI(false, "server error", null, 500, error.message, version))
    }
}

//getuserbyID
const getUser = async (req, res) => {
    try {
        const userID = req.params.userId

    let userDetails = null
        const userData = await userModel.findOne({ _id: userID, isDeleted: "false" })
         let clinicData = await clinicModel.findOne({ _id: userID, isDeleted: "false" })
            let doctorData = await doctorModel.findOne({ _id: userID, isDeleted: "false" })
            if (userData) {
                userDetails = userData
            }
            if (clinicData) {
                userDetails = clinicData
            }
            if(doctorData) {
                userDetails = doctorData
            }
            

        return res.status(200).send(ResponceAPI(true, "details fetch successfully", userDetails, null, null, version))

    } catch (error) {
        ApiError(error, "getUser");
        return res.status(500).send(ResponceAPI(false, "server error", null, 500, error.message, version))
    }
}

//change employee status
const changeStatus = async (req, res) => {
    try {
        const empId = req.params.userId;
        const status = req.params.status;

        const { error, value } = ValidStatusSchema.validate(req.params, {
            abortEarly: false,
        });
        if (error) {
            return res.status(400).send(ResponceAPI(false, null, null, 400, error.details[0].message, version))
        }
        const empExist = await userModel.findOne({ _id: empId, isDeleted: "false" });
        if (!empExist) {
            return res.status(400).send(ResponceAPI(false, null, null, 400, "user id is invalid", version))
        } else {
            const data = { status };
            const empData = await userModel.findByIdAndUpdate(empExist._id, data, { new: true });
            return res.status(200).send(ResponceAPI(true, "status changed successfully", empData, null, null, version))
        }
    } catch (error) {
        ApiError(error, "changeStatus");
        return res.status(500).send(ResponceAPI(false, "server error", null, 500, error.message, version))
    }
};
const blockUser = async(req,res) =>{
    try{
    const userId = req.params.userId 

    const userDetails = await userModel.findOne({_id:userId});
    
    if(!userDetails){
        return res.status(400).send(ResponceAPI(false, null, null, 400, "user not exist", version))
    }
    else{
        const updateData = await userModel.updateOne({_id:userId},{ $set: { isBlocked: !userDetails.isBlocked }})
        const userData = await userModel.findOne({_id:userId});
        if(userData.isBlocked){
            return res.status(200).send(ResponceAPI(true, "blocked successfully",updateData, null, null, version))
          }
          else{
            return res.status(200).send(ResponceAPI(true, "Unblocked successfully",updateData, null, null, version))
          } 
    }
}catch(error){
    ApiError(error, "blockUser");
    return res.status(500).send(ResponceAPI(false, "server error", null, 500, error.message, version))
}
}

const forgotPassword = async(req,res)=>{
    try{
        const { email } = req.body;

        const user = await userModel.findOne({email:email});

        const doctor = await doctorModel.findOne({email:email});

        const clinic = await clinicModel.findOne({email:email});
        let userDetails = null;

        if(user){
            userDetails = user
        }
        if(doctor){
            userDetails = doctor
        }
        if(clinic){
            userDetails = clinic
        }

        if(!userDetails){
            return res.status(400).send(ResponceAPI(false, null, null, 400, "Invalid user email", version))
        }
        const token = crypto.randomBytes(32).toString('hex');
        await forgetPasswordModel.create({
            userId: userDetails._id,
            token,
            expirationTime: Date.now() + 3600000, 
            used: false,
          });

          const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
		port: 465,
 		secure: true,  //true only for port 465
		auth: {
			user:'bharatdarshan1509@gmail.com',
			pass:'ypivkkepiysotfbm',
		},
		 tls: {
        rejectUnauthorized: false, // Disables certificate validation
    },
          });
        
          const resetLink = `http://localhost:5423/resetpassword?token=${token}`;
        
          const mailOptions = {
            from: 'bharatdarshan1509@gmail.com',
            to: email,
            subject: 'Password Reset Request',
            html: `Click <a href="${resetLink}">here</a> to reset your password.`,
          };
        
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
              return res.status(200).send(ResponceAPI(false, null, null, 409, error.message, version))
            } else {
              console.log(`Password reset email sent: ${info.response}`);
              return res.status(200).send(ResponceAPI(true, "reset email sent", token, null, null, version))
            }
          });

    }catch(error){
        return res.status(500).send(ResponceAPI(false, "server error", null, 500, error.message, version))
    }
};

const resetPassword = async(req,res)=>{
    try{
        const { token, newPassword } = req.body;

        const request = await forgetPasswordModel.findOne({ token, used: false, expirationTime: { $gt: Date.now() } });

        if (!request) {
            return res.status(400).send(ResponceAPI(false, null, null, 400, "Token Expired or Invalid Token", version))
          }

          const user = await userModel.findById(request.userId);
          const doctor = await doctorModel.findById(request.userId)
          const clinic = await clinicModel.findById(request.userId)

          let userDetails = null;

        if(user){
            userDetails = user
        }
        if(doctor){
            userDetails = doctor
        }
        if(clinic){
            userDetails = clinic
        }
        encryptedPassword = await bcrypt.hash(password, 10)
        userDetails.password = encryptedPassword;
        await userDetails.save();

  request.used = true;
  await request.save();
  return res.status(200).send(ResponceAPI(true, "Password Updated successfully ", null, null, null, version))
    }catch(error){
        return res.status(500).send(ResponceAPI(false, "server", null, 500, error.message, version))
    }
}
const uploadSingleFile = async (req, res) => {
    try {
        const { HeaderId } = req.body;
        if (HeaderId) {
            const FilePath = await fileUpload.findOne({ HeaderId: HeaderId }, { Location: 1 });
            if (FilePath) {
                const msg = await uploadFile.deleteFile(FilePath.Location);
                console.log(msg);
                const deletedFile = await fileUpload.deleteOne({ HeaderId: HeaderId });
                console.log("deletedFile", deletedFile);
            }
        }
        let fileUrl =null;
        if (req.files && req.files.length > 0) {
            for (let i = 0; i < req.files.length; i++) {
              if (req.files[i].fieldname == "file") {
                fileUrl = await uploadFile.uploadFile(req.files[i], "attachments")
              }
            }
          }
           else{
            return res.status(400).send(ResponceAPI(false, null, null, 400, "Please Upload a File", version))
          }
        const id = uuidv4();
        console.log("id", id);
        // const fileUrl = await uploadFile.uploadFile(req.file, 'attachments');
        const File = await fileUpload.create({ HeaderId: id, Location: fileUrl?.location });

        res.status(200).send(ResponceAPI(true, "File Uploaded successfully", File, null, null, version));
    } catch (error) {
        return res.status(500).send(ResponceAPI(false, "server", null, 500, error.message, version));
    }
};

module.exports = {
    createUser,
     loginUser,
     deleteUser,
    // userstatus,
     fetchUserList,
    getSingleUser,
    updateUser,
    getUser,
    forgotPassword,
    resetPassword,
    // changeStatus
    blockUser,
    uploadSingleFile,
}
