const ApiError = require("../functions/ApiError");
const bcrypt = require("bcryptjs");
const userModel = require("../models/userTB");
const RoleModel = require("../models/roleTB");
const clinicModel = require("../models/clinic");
const doctorModel = require("../models/doctorModel");
const caseModel = require("../models/caseModel");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const path = require("path");
const { sendNotification } = require("../utils/firebaseNotification");
const crypto = require("crypto");
const uploadImg = require("../functions/upload");
const {
  userValidSchema,
  emailAndPasswordSchema,
  ValidStatusSchema,
} = require("../validation/valid");
const { ResponceAPI } = require("../utils/ResponceAPI");
const {
  postApiAccess,
  getApiAccess,
  deleteApiAccess,
  updateApiAccess,
} = require("../utils/validAPIAccess");
const uploadFile = require("../utils/awsConfig");
const version = process.env.API_VERSION;

const registerCase = async (req, res) => {
  try {
    const {
      clinicId,
      Date,
      ExpectedDispatchDate,
      CaseType,
      PatientRefID,
      isDoctorAssigned,
      doctorId,
      HeaderID, // Assuming HeaderID is part of the request body
    } = req.body;

    if (ExpectedDispatchDate < Date) {
      return res
        .status(400)
        .send(
          ResponceAPI(
            false,
            "Case Registration Failed",
            null,
            409,
            `Expected Dispatch Date Can't Be Less Than RegistrationDate `,
            version
          )
        );
    }

    const caseData = {
      ...req.body,
      addedBy: req.user_id,
      attachment: {
        // Assuming 'attachment' is the field where 'HeaderID' needs to be added
        ...req.body.attachment,
        HeaderID: HeaderID, // Assign the value of HeaderID from the request body
      },
    };

    const caseDetails = await caseModel.create(caseData);
    const data = await caseModel
      .find({ _id: caseDetails._id })
      .populate("PatientRefID");

    return res
      .status(201)
      .send(
        ResponceAPI(true, "Case create Successfully", data, null, null, version)
      );
  } catch (error) {
    return res
      .status(500)
      .send(
        ResponceAPI(false, null, error.message, 500, "server error", version)
      );
  }
};

const editRegisteredCase = async (req, res) => {
  try {
    const caseId = req.params.caseId;
    const {
      Date,
      ExpectedDispatchDate,
      CaseType,
      Remark,
      PatientRefID,
      subSpecialization,
    } = req.body;

    if (ExpectedDispatchDate < Date) {
      return res
        .status(400)
        .send(
          ResponceAPI(
            false,
            "Case Updation Failed",
            null,
            409,
            `Expected Dispatch Date Can't Be Less Than RegistrationDate `,
            version
          )
        );
    }
    const caseData = {
      ...req.body,
    };
    const caseDetails = await caseModel.findOneAndUpdate(
      { _id: caseId },
      caseData,
      { new: true }
    );
    if (!caseDetails) {
      return res
        .status(404)
        .send(
          ResponceAPI(false, null, null, 404, "case  does not exist", version)
        );
    }
    return res
      .status(201)
      .send(
        ResponceAPI(
          true,
          "Case Details Updated Successfully ",
          caseDetails,
          null,
          null,
          version
        )
      );
  } catch (error) {
    return res
      .status(500)
      .send(
        ResponceAPI(false, null, error.message, 500, "server error", version)
      );
  }
};
const listCases = async (req, res) => {
  try {
    const { search, CaseType, status, fromDate, toDate, page, rowsPerPage } =
      req.query;

    const page1 = parseInt(page) || 1; // Current page number
    const rowsPerPage1 = parseInt(rowsPerPage) || 10; // Limit
    const filters = [{ isDeleted: false }];

    // ... existing code ...

    // Combine OR conditions
    const query = filters.length > 0 ? { $and: filters } : {};
    const offset = (page1 - 1) * rowsPerPage1; // Calculation for offset

    const caselist = await caseModel
      .find(query)
      .populate({
        path: "PatientRefID",
        model: "patientDetail",
      })
      .populate({
        path: "clinicId",
        model: "partner",
      })
      .skip(offset)
      .limit(rowsPerPage1)
      .sort({ createdAt: "desc" });
    const cnt = await caseModel.find(query).count();

    let caseCnt = Math.ceil(cnt / rowsPerPage1);
    const caseResponceData = {
      caseList: caselist,
      pageNumber: page1,
      rowsPerPage: rowsPerPage1,
      totalElement: cnt,
      totalNoOfPages: caseCnt,
    };

    return res
      .status(200)
      .send(
        ResponceAPI(true, "case list", caseResponceData, null, null, version)
      );
  } catch (error) {
    return res
      .status(500)
      .send(
        ResponceAPI(false, null, error.message, 500, "server error", version)
      );
  }
};

const getSingleCase = async (req, res) => {
  try {
    const caseId = req.params.caseId;

    const caseData = await caseModel
      .findById({ _id: caseId })
      .populate("clinicId")
      .populate("PatientRefID");

    if (!caseData) {
      return res
        .status(400)
        .send(ResponceAPI(false, "Case Not Found", null, 409, null, version));
    } else {
      let responseData = caseData.toObject();

      // Check if Attachments exist before mapping
      if (responseData.Attachments && responseData.Attachments.length > 0) {
        responseData.Attachments = responseData.Attachments.map(
          (attachment) => ({
            ...attachment.toObject(),
            HeaderID: attachment.HeaderID,
          })
        );
      }

      return res
        .status(200)
        .send(
          ResponceAPI(
            true,
            "Case Details Found",
            responseData,
            null,
            null,
            version
          )
        );
    }
  } catch (error) {
    return res
      .status(500)
      .send(
        ResponceAPI(false, null, error.message, 500, "server error", version)
      );
  }
};

const deleteSingleCase = async (req, res) => {
  try {
    const caseId = req.params.caseId;

    const caseDetails = await caseModel.findOneAndUpdate(
      { _id: caseId, status: "Active" },
      { isDeleted: true, status: "Deleted" },
      { new: true }
    );

    if (!caseDetails) {
      return res
        .status(200)
        .send(
          ResponceAPI(
            true,
            "Case can not be deleted. Accepted by a doctor",
            null,
            404,
            null,
            version
          )
        );
    }
    return res
      .status(200)
      .send(
        ResponceAPI(
          true,
          "Deleted successfully ",
          caseDetails,
          null,
          null,
          version
        )
      );
  } catch (error) {
    return res
      .status(500)
      .send(ResponceAPI(false, "server", null, 500, error.message, version));
  }
};
const caseListForDoctor = async (req, res) => {
  try {
    const doctorId = req.user_id;
    const doctorData = await doctorModel.findOne({
      _id: doctorId,
      isBlocked: false,
    });

    const caseList = await caseModel.find({
      subSpecialization: { $in: doctorData.subSpecialization },
      status: "Active",
    });
    const caseResponceData = {
      caseList: caseList,
    };
    return res
      .status(200)
      .send(
        ResponceAPI(true, "case list", caseResponceData, null, null, version)
      );
  } catch (error) {
    return res
      .status(500)
      .send(ResponceAPI(false, "server", null, 500, error.message, version));
  }
};
// const deleteSingleCase = async(req,res) =>{
//   try{
//   const caseId = req.params.caseId;

//   const caseData = await caseModel.findOneAndUpdate({_id:caseId,status:"Active"},{isDeleted:true,status:"Deleted"});
//   if(!caseData){
//     return res.status(400).send(ResponceAPI(false, "Case can not be deleted. Accepted by a doctor", null, 409, null, version))
//   }
//   return res.status(200).send(ResponceAPI(true, "CaseDeleted Successfully", caseData, null, null, version))
//   }catch(error){
//     return res.status(500).send(ResponceAPI(false, null, error.message, 500, "server error", version))
//   }
// }
module.exports = {
  registerCase,
  editRegisteredCase,
  listCases,
  getSingleCase,
  deleteSingleCase,
  caseListForDoctor,
};