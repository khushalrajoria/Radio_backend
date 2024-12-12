const { partnerValidSchema } = require("../validation/valid");
const { ResponceAPI } = require("../utils/ResponceAPI");
const RoleModel = require("../models/roleTB");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { find } = require("lodash");
const { truncate } = require("fs/promises");
const clinicModel = require('../models/clinic');
// const partnerEarningModel = require('../models/partnerEarningModel');
const uploadImg = require('../functions/upload');
const { uploadFile } = require("../utils/awsConfig");
const path = require('path');
const version = process.env.API_VERSION
const ApiError = require('../functions/ApiError');

//jatin
const signUpPartner = async (req, res) => {
    try {

        const { name, email, mobile, licenseNo, gstNo } = req.body

       // return res.status(400).send(req.body)
        const { error, value } = partnerValidSchema.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            return res.status(400).send(ResponceAPI(false, null, null, 400, error.details[0].message, version))
        }

        const emailExist = await clinicModel.findOne({ email: email });
        if (emailExist) {
            return res.status(400).send(ResponceAPI(false, null, null, 409, "Clinic with email is already exist.", version))
        }

        const phoneExist = await clinicModel.findOne({ mobile: mobile });
        if (phoneExist) {
            return res.status(400).send(ResponceAPI(false, null, null, 409, "Clinic with phone number is already exist.", version))
        }
       


        let profileImage = null
        let licenseDocument = null
        let certificateDocument = null
        if (req.files && req.files.length > 0) {
            for (let i = 0; i < req.files.length; i++) {
                if (req.files[i].fieldname == "profileImage") {
                    profileImage = await uploadFile.uploadFile(req.files[i], "partner/profileImage")
                }
                if (req.files[i].fieldname == "licenseDocument") {
                    licenseDocument = await uploadFile.uploadFile(req.files[i], "partner/licenseDocument")
                }
                if (req.files[i].fieldname == "certificateDocument") {
                    certificateDocument = await uploadFile.uploadFile(req.files[i], "partner/certificateDocument")
                }
            }
        }


        const password = "12345678";
        const encryptedPassword = await bcrypt.hash(password, 10)
        const role = await RoleModel.findOne({ role: "clinic" })

        const partnerData = {
            name,
            email,
            mobile,
           
            roleID: role._id,
            
            password: encryptedPassword,
            licenseNo,
            "profileImage": profileImage?.location,
            "licenseDocument": licenseDocument?.location,
            "certificateDocument": certificateDocument?.location,
           gstNo,
        }
        const userDetails = await clinicModel.create(partnerData);
        return res.status(201).send(ResponceAPI(true, "Clinic register successfully.", userDetails, null, null, version))


    } catch (error) {
        return res.status(500).send(ResponceAPI(false, "Something went wrong. Please try again.", null, 500, error.message, version))
    }
}

//jatin
const activePartnerList = async (req, res) => {
    try {
        const listPartner = await clinicModel.find({isDeleted: false} );
        return res.status(200).send(ResponceAPI(true, "Clinic data found", listPartner, null, null, version))
    } catch (error) {
        return res.status(500).send(ResponceAPI(false, "Something went wrong. Please try again.", null, 500, error.message, version))
    }
};

//jatin
const allPartnerList = async (req, res) => {
    try {
        const { search,status,fromDate, toDate, page, rowsPerPage} = req.query

        const page1 = parseInt(page) || 1; // Current page number
        const rowsPerPage1 = parseInt(rowsPerPage) || 10;  //limit
        const filters = [{ isDeleted: false }];


        if (search) {
            filters.push({ $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } },{ brandName: { $regex: search, $options: 'i' } }] });
        }

        if (status) {
            filters.push({ status: status });
        }
        if (fromDate && toDate) {
            filters.push({
              createdAt: {
                $gte: new Date(fromDate),
                $lte: new Date(toDate),
              }
            });
      
          } else if (fromDate) {
            filters.push({ createdAt: { $gte: new Date(fromDate) } });
          } else if (toDate) {
            filters.push({ createdAt: { $lte: new Date(toDate) } });
          }
      
          // Combine OR conditions
          const query = filters.length > 0 ? { $and: filters } : {};
          const offset = (page1-1) * rowsPerPage1; // Calculation for offset
        const listPartner = await clinicModel.find(query).skip(offset).limit(rowsPerPage1).sort({createdAt: 'asc'})

        const cnt = await clinicModel.find(query).sort({createdAt: 'asc'}).count();
 
        let partnerCnt = Math.ceil(cnt/rowsPerPage1);
        const partnerResponceData={
          "PartnerList":listPartner,
          "pageNumber":page1,
          "rowsPerPage":rowsPerPage1,
          "totalElement":cnt,
          "totalNoOfPages":partnerCnt,
        }
        return res.status(200).send(ResponceAPI(true, "Partner List", partnerResponceData, null, null, version))
    } catch (error) {
        return res.status(500).send(ResponceAPI(false, "server error", null, 500, error.message, version))
    }
}

//get clinic by id
const getPartnerById = async (req, res) => {
    try {
        const clinicId = req.params.clinicId

        const clinicExist = await clinicModel.findOne({ _id: clinicId, isDeleted: false })
        if (!clinicExist) {
            return res.status(404).send(ResponceAPI(false, null, doctorExist, 404, "Clinic does not exist", version))
        }
        return res.status(200).send(ResponceAPI(true, "Clinic fetch successfully", clinicExist, null, null, version))
    } catch (error) {
        return res.status(500).send(ResponceAPI(false, null, error.message, 500, "server error", version))
    }
};

const getViewById = async (req, res) => {
    try {
        const partnerId = req.params.partnerId

        const partnerExist = await partnerModel.findOne({ _id: partnerId, isDeleted: false })
        if (!partnerExist) {
            return res.status(404).send(ResponceAPI(false, null, doctorExist, 404, "partner does not exist", version))
        }
        return res.status(200).send(ResponceAPI(true, "partner fetch successfully", partnerExist, null, null, version))
    } catch (error) {
        return res.status(500).send(ResponceAPI(false, null, error.message, 500, "server error", version))
    }
};

//update clinic
const editPartnerById = async (req, res) => {
    try {
        console.log("req body",req.body)
        const clinicId = req.params.clinicId
        const details = await clinicModel.findOne({ _id: clinicId, isDeleted: false })
        if (!details) {
            return res.status(404).send(ResponceAPI(false, null, null, 404, "Clinic is not exist", version))
        }
        const data=req.body

        let profileImage = null
        let licenseDocument = null
        let certificateDocument = null
        if (req.files && req.files.length > 0) {
            for (let i = 0; i < req.files.length; i++) {
                if (req.files[0].fieldname == "profileImage") {
                    profileImage = await uploadFile.uploadFile(req.files[i], "partner/profileImage")
                }
                if (req.files[i].fieldname == "licenseDocument") {
                    licenseDocument = await uploadFile.uploadFile(req.files[i], "partner/licenseDocument")
                }
                if (req.files[i].fieldname == "certificateDocument") {
                    certificateDocument = await uploadFile.uploadFile(req.files[i], "partner/certificateDocument")
                }
            }
        }
        const clinicData = {
            ...req.body,
            "profileImage": profileImage ? profileImage.location : details.profileImage,
            "licenseDocument": licenseDocument ? licenseDocument.location : details.licenseDocument,
            "certificateDocument": certificateDocument ? certificateDocument.location : details.certificateDocument,
           
        }
        // return res.send(partnerData)
        const clinicDetails = await clinicModel.findOneAndUpdate({ _id: clinicId, isDeleted: false }, clinicData, { new: true })
        if (!clinicDetails) {
            return res.status(404).send(ResponceAPI(false, null, null, 404, "clinic does not exist", version))
        }
        else{
        return res.status(200).send(ResponceAPI(true, "Clinic data update successfully ", clinicDetails, null, null, version))}
    } catch (error) {
        return res.status(500).send(ResponceAPI(false, "server", null, 500, error.message, version))
    }
};

//delete partner //jatin
const deletePartnerById = async (req, res) => {
    try {

        const partnerId = req.params.partnerId

        const partnerDetails = await clinicModel.findOneAndUpdate({ _id: partnerId, isDeleted: false }, { isDeleted: true }, { new: true })

        if (!partnerDetails) {
            return res.status(404).send(ResponceAPI(false, null, null, 404, "Partner is not exist", version))
        }
        return res.status(200).send(ResponceAPI(true, "Deleted successfully ", partnerDetails, null, null, version))
    } catch (error) {
        return res.status(500).send(ResponceAPI(false, "server", null, 500, error.message, version))
    }
};

//change partner status
const changeStatus = async (req, res) => {
    try {
        const partnerId = req.params.id;
        const status = req.params.status;

        const partnerExist = await partnerModel.findOne({ _id: partnerId, isDeleted: "false" });
        if (!partnerExist) {
            return res.status(400).send(ResponceAPI(false, null, null, 400, "partner id is invalid", version))
        } else {
            const data = { status };
            const partnerData = await partnerModel.findByIdAndUpdate(partnerExist._id, data, { new: true });
            return res.status(200).send(ResponceAPI(true, "status changed successfully", partnerData, null, null, version))
        }
    } catch (error) {
        ApiError(error, "changeStatus");
        return res.status(500).send(ResponceAPI(false, "server error", null, 500, error.message, version))
    }
};


const partnerEarning = async (req, res) => {
    try {
        const {partnerId} = req.params
        const { search,fromDate, toDate, page, rowsPerPage } = req.query

    const page1 = parseInt(page) || 1; // Current page number
    const rowsPerPage1 = parseInt(rowsPerPage) || 10;  //limit
    const filters = [{ partnerId: partnerId }];


    if (search) {
      filters.push({ $or: [{ orderNumber: { $regex: search, $options: 'i' } }, { patientMobile: { $regex: search, $options: 'i' } }] });
    }

    if (fromDate && toDate) {
      filters.push({
        createdAt: {
          $gte: new Date(fromDate),
          $lte: new Date(toDate),
        }
      });

    } else if (fromDate) {
      filters.push({ createdAt: { $gte: new Date(fromDate) } });
    } else if (toDate) {
      filters.push({ createdAt: { $lte: new Date(toDate) } });
    }

    // Combine OR conditions
    const query = filters.length > 0 ? { $and: filters } : {};
    const offset = (page1-1) * rowsPerPage1; // Calculation for offset
    const partnerEarningList = await partnerEarningModel.find(query).skip(offset).limit(rowsPerPage1).sort({createdAt: 'asc'}).select({ slots: 0 })
    const cnt = await partnerEarningModel.find(query).sort({createdAt: 'asc'}).count();
 
    let partnerEarningtCnt = Math.ceil(cnt/rowsPerPage1);
    const doctorEarningResponceData={
      "partnerEarningList":partnerEarningList,
      "pageNumber":page1,
      "rowsPerPage":rowsPerPage1,
      "totalElement":cnt,
      "totalNoOfPages":partnerEarningtCnt,
    }
    return res.status(200).send(ResponceAPI(true, "Doctor Earning list", doctorEarningResponceData, null, null, version))
  } catch (error) {
    return res.status(500).send(ResponceAPI(false, null, error.message, 500, "server error", version))
  }
};


const activePartnerListForMeet = async (req, res) => {
    try {
        const {search}=req.query
        const filters = [{ status: "Published" }, { isDeleted: false }]

        if (search) {
          filters.push({ $or: [{ name: { $regex: search, $options: 'i' } }, { mobile: { $regex: search, $options: 'i' } }] });
        }
        const query = filters.length > 0 ? { $and: filters } : {};
        const listPartner = await partnerModel.find(query);
        return res.status(200).send(ResponceAPI(true, "Active partner List", listPartner, null, null, version))
    } catch (error) {
        return res.status(500).send(ResponceAPI(false, "server error", null, 500, error.message, version))
    }
};


const brandNameList=async (req, res) => {
    try {
        const listPartner = await partnerModel.find({ status: "Published" ,isDeleted: false }).select(["brandName"])
        return res.status(200).send(ResponceAPI(true, "Brand Name List", listPartner, null, null, version))
    } catch (error) {
        return res.status(500).send(ResponceAPI(false, "server error", null, 500, error.message, version))
    }
};
const blockClinic = async(req,res) =>{
    try{
    const clinicId = req.params.clinicId 

    const userDetails = await clinicModel.findOne({_id:clinicId});
    
    if(!userDetails){
        return res.status(400).send(ResponceAPI(false, null, null, 400, "user not exist", version))
    }
    else{
        const updateData = await clinicModel.updateOne({_id:clinicId},{ $set: { isBlocked: !userDetails.isBlocked }})
        const clinicData = await clinicModel.findOne({_id:clinicId})
        if(!clinicData.isBlocked){
            return res.status(200).send(ResponceAPI(true, "Unblocked successfully",updateData, null, null, version))
          }
          else{
            return res.status(200).send(ResponceAPI(true, "blocked successfully",updateData, null, null, version))
            
          } 
    }
}catch(error){
    ApiError(error, "blockUser");
    return res.status(500).send(ResponceAPI(false, "server error", null, 500, error.message, version))
}
}
module.exports = {
    signUpPartner,
     activePartnerList,
     allPartnerList,
    getPartnerById,
    editPartnerById,
     deletePartnerById,
     blockClinic,
    // changeStatus,
    // getViewById,
    // partnerEarning,
    // activePartnerListForMeet,
    // brandNameList,
}