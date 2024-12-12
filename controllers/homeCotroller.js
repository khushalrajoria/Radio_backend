// // const Aws = require('aws-sdk');  
// // require('aws-sdk/lib/maintenance_mode_message').suppress = true;     

// const ApiError = require('../functions/ApiError');
// // const symptomModel = require('../models/symptoms');
// // const medicalModel = require('../models/medicalTest');
// // const bannerModel = require('../models/bannerDetail');
// // const couponModel = require('../models/couponDetail')
// const uploadImg = require('../functions/upload');
// // const woocommerce= require('../functions/woocommerce');

// // const {uploadSymptom, couponValidSchema} = require('../validation/valid');
// const {ResponceAPI}=require("../utils/ResponceAPI");
// const uploadFile = require("../utils/awsConfig");
// // const deleteAWSFile = require("../utils/deleteAWSFile");
// // const version = process.env.API_VERSION;




// // Upload medical test 
// const uploadMedicalList= async(req,res)=>{
//     try{

//       uploadImg(req, res, async function (err) {
//         if (err) {
//           return res.status(400).send(ResponceAPI(false, null,err.message, 400, "something went wrong", version));
//        }
//         const{name,description} = req.body;
//         const image = req.file;
//         //console.log(req.body);
//         const data={name,image,description};
//         const { error, value } = uploadSymptom.validate(data, {
//           abortEarly: false,
//         });
//         if (error) {
//           return res.status(400).send(ResponceAPI(false, null, null, 400, error.details[0].message, version))
//         }
              
//         const Key="MedicalTest/" + req.file.originalname;              
//         let picture=null;
//         picture = await uploadFile.uploadFile(req.file,Key);
//         if(picture){
             
//           const Data = new medicalModel({
//              name:name,
//              image:picture,
//              description:description
//            })
//            await Data.save();
//            return res.status(200).send(ResponceAPI(true, "symptom added successfully",Data, null, null, version));
//         }else{
//           return res.status(400).send(ResponceAPI(false, null,error.message, 400, "medical list not uploaded", version)) 
//         } 
//         });     
//     } catch(error)
//     {
//       ApiError(error,"uploadMedicalList");
//       return res.status(500).send(ResponceAPI(false, null,error.message, 500, "server error", version))
//     }
// };

// //get medical test list
// const getMedicalTestList= async(req,res)=>{
//   try{
 
//     const medicalTestList = await medicalModel.find();
//     return res.status(200).send(ResponceAPI(true, "medical test list fetch successfully",medicalTestList, null, null, version));

//   }catch(error){
//     ApiError(error,"getMedicalTestList");
//     return res.status(500).send(ResponceAPI(false, null,error.message, 500, "server error", version))
//  }
// };

 


// //Home Screen Listing (before hit this api,please hit this `productsLst`  )
// const homeScreenAllList= async(req,res)=>{
//   try{

//     var List1 = await symptomModel.find();
//     var List2 = await bannerModel.find().sort({createdAt:-1});
//     var List4 = await medicalModel.find();

    
//     const data={symptom: List1, banner:List2, medicalTest: List4};
    
//     return res.status(200).send(ResponceAPI(true, "all items list of home page fetch successfully",data, null, null, version));
//   }catch(error){
   
//     ApiError(error,"homeScreenAllList");
//     return res.status(500).send(ResponceAPI(false, null,error.message, 500, "server error", version))
//   }
// };



// module.exports = {
//     uploadMedicalList,
//     getMedicalTestList,
//     homeScreenAllList,
 
//   };
