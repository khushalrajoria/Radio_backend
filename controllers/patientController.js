// const ehrModel = require('../models/EHRDetails');
const userModel = require("../models/userTB");
const clinicModel = require("../models/clinic");
// const walletPointsModel = require("../models/walletPointsModel")
// const walletTransactionModel = require("../models/walletTransactionModel");
// const settingModel = require("../models/settingModel");
// const medicalTestModel = require("../models/medicalTest");
const mongoose = require("mongoose");
const patientModel = require("../models/patientDetail");
const ObjectId = mongoose.Types.ObjectId;
// const patientAddressModel = require("../models/patientAddressModel");
const otpModel = require("../models/otp");
const CryptoJS = require("crypto-js");
// const appointmentModel = require('../models/appointmentsModel');
// const meetJoinModel = require('../models/meetJoinModel');
// const transactionModel = require('../models/transactionDetail');
// const subscriptionModel = require("../models/subscriptionModel")
// const membershipModel = require('../models/membershipPlan');
// const appointmentsModel = require('../models/appointmentsModel')
const moment = require("moment");
const randomize = require("randomatic");
const urlModel = require("../models/urlDetails");
const jwt = require("jsonwebtoken");
const version = process.env.API_VERSION;
const _ = require("lodash");

const {
  patientValidSchemaSignIn,
  patientValidSchemaSignUp,
  uploadEHRSchema,
  patientRegisterSchema,
  addFamilyMemberSchema,
  patientAddressValidSchema,
} = require("../validation/valid");
const ApiError = require("../functions/ApiError");
const getOtp = require("../functions/GetOtp");
const uploadReport = require("../functions/uploadReport");

const uploadImg = require("../functions/upload");
const uploadFile = require("../utils/awsConfig");
const { ResponceAPI } = require("../utils/ResponceAPI");
const signedURL = require("../utils/signedURL");
const path = require("path");
const Aws = require("aws-sdk");

const isValidfiles = function (files) {
  if (files && files.length > 0) return true;
};

//Login Patient //jatin
const addPatient = async (req, res) => {
  try {
    const {
      mobile,
      patientReferenceNumber,
      email,
      clinicId,
      name,
      age,
      gender,
      referedByDoctorName,
    } = req.body;

    const patientDetail = await patientModel.findOne({
      $and: [{ mobile: mobile }, { isDeleted: false }],
    });

    // const setting = await settingModel.findOne({ name: "setting" })

    if (patientDetail) {
      // const { error, value } = patientValidSchemaSignIn.validate(req.body, {
      //   abortEarly: false,
      // });
      // if (error) {
      //   return res.status(200).send(ResponceAPI(false, null, null, 400, error.details[0].message, version))
      // }
      // if (patientDetail.isDeleted == true) {
      //   return res.status(200).send(ResponceAPI(false, null, null, 400, "patient is deleted", version))
      // }

      // const data = { mobile, fcmToken, deviceID, platform, appVersion,isActive: true }
      // const updatePatientData = await patientModel.findByIdAndUpdate(patientDetail._id, data, { new: true }).lean()

      // if (updatePatientData) {
      //   const payload = { _id: updatePatientData._id, mobile: updatePatientData.mobile, validAppCredentialKey: process.env.VALID_APP_CRENDENTIAL_KEY }
      //   const jwt_token = await jwt.sign(payload, process.env.SECRET_TOKEN_KEY)

      //   const requireData = {
      //     email: updatePatientData.email, name: updatePatientData.name, age: updatePatientData.age, gender: updatePatientData.gender, mobile: updatePatientData.mobile, deviceID: updatePatientData.deviceID, platform: updatePatientData.platform, appVersion: updatePatientData.appVersion, id: updatePatientData._id
      //   }

      //   return res.status(200).send(ResponceAPI(true, "patent SignIn successfully", { token: jwt_token, validAppCredentialKey: process.env.VALID_APP_CRENDENTIAL_KEY, ...updatePatientData }, null, null, version))
      // }
      return res
        .status(200)
        .send(
          ResponceAPI(
            false,
            null,
            null,
            400,
            "Patient with this mobile already exist.",
            version
          )
        );
    } else {
      //if patient is using the appliation first time
      // const { error, value } = patientValidSchemaSignUp.validate(req.body, {
      //   abortEarly: false,
      // });
      // if (error) {

      //   return res.status(200).send(ResponceAPI(false, null, null, 400, error.details[0].message, version))
      // }
      // let referralData = null
      // if (referralCode) {
      //   referralData = await patientModel.findOne({ referralCode: referralCode })
      //   if (referralData == null) {
      //     return res.status(200).send(ResponceAPI(false, null, null, 400, "invalid referral code", version))
      //   }
      // }

      // const num = randomize("0", 6);
      // const refNumber = num + mobile.slice(4, 10)
      const createPatient = await patientModel.create({
        patientNumber: patientReferenceNumber,
        name: name,
        age: age,
        gender: gender,
        mobile: mobile,
        email: email,
        clinicId: new mongoose.Types.ObjectId(clinicId),
        addedBy: new ObjectId("653f4340e45cd5d70d524021"),
        referedByDoctorName: referedByDoctorName,
        // fcmToken: fcmToken,
        // deviceID: deviceID,
        // platform: platform,
        // referralCode: refNumber,
        // appVersion: appVersion,
        isActive: true,
      });
      const patientGetData = await patientModel
        .findById(createPatient._id)
        .lean();

      //   if (createPatient) {
      //     const payload = { _id: createPatient._id, mobile: createPatient.mobile, validAppCredentialKey: process.env.VALID_APP_CRENDENTIAL_KEY };
      //     const jwt_token = await jwt.sign(payload, process.env.SECRET_TOKEN_KEY);
      //     if (referralData != null) {
      //       const walletPoints = await walletPointsModel.create({ patientId: createPatient._id, patientMobile: createPatient.mobile, points: setting.patientReferredCodePoint })
      //       const walletTransaction = await walletTransactionModel.create([{
      //         patientId: createPatient._id,
      //         patientMobile: createPatient.mobile,
      //         points: setting.patientReferredCodePoint,
      //         referredBy: referralData._id,
      //         transactionType: "credit",
      //         mode: "referredBy"
      //       }, {
      //         patientId: referralData._id,
      //         patientMobile: referralData.mobile,
      //         referredBy: null,
      //         points: setting.patientUseReferralCodePoint,
      //         transactionType: "credit",
      //         mode: "referredTo"
      //       }])
      //       const walletData = await walletPointsModel.findOne({ patientId: referralData._id })
      //       if (!walletData) {
      //         const walletPoints = await walletPointsModel.create({ patientId: referralData._id, patientMobile: referralData.mobile, points: setting.patientUseReferralCodePoint })
      //       } else {
      //         walletData.points = Number(walletData.points) + Number(setting.patientUseReferralCodePoint)
      //         walletData.save();
      //       }

      //     } else { await walletPointsModel.create({ patientId: createPatient._id, patientMobile: createPatient.mobile }) }

      //     return res.status(201).send(ResponceAPI(true, "patient SignUp successfully", { token: jwt_token, validAppCredentialKey: process.env.VALID_APP_CRENDENTIAL_KEY, ...patientGetData }, null, null, version))
      //   }
      return res
        .status(201)
        .send(
          ResponceAPI(
            true,
            "Patient Register Successfully.",
            patientGetData,
            null,
            null,
            version
          )
        );
    }
  } catch (err) {
    ApiError(err, "signUpAndSingIn");
    return res
      .status(500)
      .send(
        ResponceAPI(false, null, err.message, 500, "Something went wrong. Please try again.", version)
      );
  }
};

const updatePatientDetails = async (req, res) => {
  try {
    const patientId = req.params.patient_id;
    console.log(patientId);
    const data = req.body;
    const patientData = await patientModel.findOne({
      _id: patientId,
      isDeleted: false,
    });
    let picture = null;
    if (req.files && req.files.length > 0) {
      const file = req.files[0];
      picture = await uploadFile.uploadFile(file, "patientProfile");
    }
    if (picture == null) {
      const patientDetail = await patientModel.findOneAndUpdate(
        { _id: patientId, isDeleted: false },
        { ...data /*image:patientData.image*/ },
        { new: true }
      );
      if (!patientDetail) {
        return res
          .status(200)
          .send(
            ResponceAPI(false, null, null, 400, "patient is not exist", version)
          );
      }

      return res
        .status(200)
        .send(
          ResponceAPI(
            true,
            "patient update successfully",
            patientDetail,
            null,
            null,
            version
          )
        );
    } else {
      const patientData = { image: picture.location, ...data };
      const patientDetail = await patientModel.findOneAndUpdate(
        { _id: patientId, isDeleted: false },
        patientData,
        { new: true }
      );
      if (!patientDetail) {
        return res
          .status(400)
          .send(
            ResponceAPI(false, null, null, 400, "patient is not exist", version)
          );
      }

      return res
        .status(200)
        .send(
          ResponceAPI(
            true,
            "patient update successfully",
            patientDetail,
            null,
            null,
            version
          )
        );
    }
  } catch (error) {
    ApiError(error, "patient update");
    return res
      .status(500)
      .send(
        ResponceAPI(false, null, error.message, 500, "server error", version)
      );
  }
};

//Get patient by id
const getPatientById = async (req, res) => {
  try {
    const patientId = req.patient_id;

    const patientDetail = await patientModel.findOne({
      _id: patientId,
      isDeleted: false,
    });
    if (!patientDetail) {
      return res
        .status(400)
        .send(
          ResponceAPI(false, null, null, 400, "patient is not exist", version)
        );
    }

    return res
      .status(200)
      .send(
        ResponceAPI(
          true,
          "patient fetch successfully",
          patientDetail,
          null,
          null,
          version
        )
      );
  } catch (error) {
    ApiError(error, "getPatientById");
    return res
      .status(500)
      .send(
        ResponceAPI(false, null, error.message, 500, "server error", version)
      );
  }
};

//check Mobile no is exist or not
const checkMobileExist = async (req, res) => {
  try {
    const { mobile } = req.body;

    const mobileExist = await patientModel.findOne({
      mobile: mobile,
      isDeleted: false,
    });
    if (!mobileExist) {
      return res
        .status(200)
        .send(
          ResponceAPI(false, null, null, 400, "mobile is not exist", version)
        );
    }
    return res
      .status(200)
      .send(
        ResponceAPI(true, "mobile is exist", mobileExist, null, null, version)
      );
  } catch (err) {
    ApiError(err, "checkMobileExist");
    return res
      .status(500)
      .send(
        ResponceAPI(false, null, err.message, 500, "server error", version)
      );
  }
};

//update patient profile
const updatePatientProfile = async (req, res) => {
  try {
    const patientId = req.userID;
    const { name, age, gender, image } = req.body;

    // const role=await roleModel.findOne({role:"patient"});

    const patientDetail = await patientModel.findOne({
      _id: patientId,
      isDeleted: false,
    });
    if (!patientDetail) {
      return res
        .status(400)
        .send(
          ResponceAPI(false, null, null, 400, "patient is not exist", version)
        );
    }

    const data = { name, age, gender, image };
    const updateData = await patientModel.findByIdAndUpdate(patientId, data, {
      new: true,
    });
    if (!updateData) {
      return res
        .status(400)
        .send(
          ResponceAPI(
            false,
            null,
            null,
            400,
            "error in updating details",
            version
          )
        );
    }
    return res
      .status(200)
      .send(
        ResponceAPI(
          true,
          "profile update successfully",
          updateData,
          null,
          null,
          version
        )
      );
  } catch (err) {
    ApiError(err, "updatePatientProfile");
    return res
      .status(500)
      .send(
        ResponceAPI(false, null, err.message, 500, "server error", version)
      );
  }
};

//upload image
const uploadImage = async (req, res) => {
  try {
    uploadImg(req, res, async function (err) {
      if (err) {
        return res
          .status(400)
          .send(
            ResponceAPI(
              false,
              null,
              err.message,
              400,
              "something went wrong",
              version
            )
          );
      }

      let File = req.file;
      //console.log("file",File);
      if (!File) {
        return res.status(400).send({ message: "something went wrong" });
      }

      const fileExtension = path.extname(req.file.originalname);
      const image = req.file.originalname.replace(/\s/g, "_");
      const key1 = image + "/" + Date.now() + fileExtension;
      let picture = null;
      picture = await uploadFile.uploadFile(req.file, key1);
      if (picture) {
        return res
          .status(200)
          .send(
            ResponceAPI(
              true,
              "image uploaded successfully",
              picture,
              null,
              null,
              version
            )
          );
      } else {
        return res.status(400).send({ message: "something went wrong" });
      }
    });
  } catch (err) {
    ApiError(err, "uploadImage");
    return res
      .status(500)
      .send(
        ResponceAPI(false, null, err.message, 500, "server error", version)
      );
  }
};

//upload EHR
const uploadEHR = async (req, res) => {
  try {
    // return res.send(req.files)
    const patientId = req.patient_id;
    const { tag, reportNameTag, relationId } = req.body;
    console.log(req.files);
    console.log(req.files.length);
    const { error, value } = uploadEHRSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(200)
        .send(
          ResponceAPI(false, null, null, 400, error.details[0].message, version)
        );
    }
    let file = req.files;

    if (!isValidfiles(file)) {
      return res
        .status(200)
        .send(
          ResponceAPI(
            false,
            null,
            null,
            400,
            "Report file is required",
            version
          )
        );
    }
    // if (file.length > 1 || file[0].fieldname != "report") {
    //   return res.status(400).send(ResponceAPI(false, null, null, 400, "Report file is invalid", version));
    // }

    const patientDetail = await patientModel.findOne({
      _id: patientId,
      isDeleted: false,
    });
    if (!patientDetail) {
      return res
        .status(200)
        .send(
          ResponceAPI(false, null, null, 400, "patient is not exist", version)
        );
    }
    let documents = [];
    for (let i = 0; i < file.length; i++) {
      const originalname = file[i].originalname;
      const report = await uploadFile.uploadFile(file[i], originalname);
      documents.push({
        fieldName: file[i].fieldname,
        originalName: originalname,
        mimeType: file[i].mimetype,
        report: report.location,
      });
    }

    const ehrSaveData = await ehrModel.create({
      patientId: relationId,
      reportNameTag: reportNameTag,
      relationId: patientId,
      report: documents,
      tag: tag,
      addedBy: patientId,
    });
    console.log(ehrSaveData);
    return res
      .status(200)
      .send(
        ResponceAPI(
          true,
          "EHR uploaded successfully",
          ehrSaveData,
          null,
          null,
          version
        )
      );
  } catch (error) {
    ApiError(error, "uploadEHR");
    return res
      .status(500)
      .send(
        ResponceAPI(false, null, error.message, 500, "server error", version)
      );
  }
};

//User EHR list
const ehrList = async (req, res) => {
  try {
    const patientId = req.params.patientId;

    const patientDetail = await patientModel.findOne({
      _id: patientId,
      isDeleted: false,
    });

    if (!patientDetail) {
      return res
        .status(200)
        .send(
          ResponceAPI(false, null, null, 400, "patient is not exist", version)
        );
    }
    const familyEHR = await ehrModel
      .find({ relationId: patientId })
      .populate("patientId", ["name", "image"]);
    const patientEHR = await ehrModel
      .find({ patientId: patientId })
      .populate("patientId", ["name", "image"]);
    const data = { patientEHR: patientEHR, familyEHR: familyEHR };
    return res
      .status(200)
      .send(
        ResponceAPI(true, "List fetch successfully", data, null, null, version)
      );
  } catch (error) {
    ApiError(error, "EHRList");
    return res
      .status(500)
      .send(
        ResponceAPI(false, null, error.message, 500, "server error", version)
      );
  }
};

const s3 = new Aws.S3({
  accessKeyId: process.env.NEW_ACCESS_KEY,
  secretAccessKey: process.env.NEW_SECRET_ACESS_KEY,
  region: "ap-south-1",
});

//Delete EHR
const deleteEHR = async (req, res) => {
  try {
    const patientId = req.patient_id;
    const { path } = req.body;

    const detailExist = await patientModel.findOne({
      _id: patientId,
      isDeleted: false,
    });
    if (!detailExist) {
      return res
        .status(200)
        .send(
          ResponceAPI(false, null, null, 400, "patient is not exist", version)
        );
    }

    if (!path) {
      return res
        .status(200)
        .send(
          ResponceAPI(
            false,
            null,
            null,
            400,
            "please provide file path",
            version
          )
        );
    }
    //check the given path file is exist or not
    const fileExist = await ehrModel.findOne({
      patientId: patientId,
      report: path,
    });
    if (!fileExist) {
      return res
        .status(200)
        .send(ResponceAPI(false, null, null, 400, "invalid path", version));
    }

    var keyPath = path.split("/");

    var params = {
      Bucket: process.env.NEW_BUCKET_NAME,
      Key: keyPath[3],
    };

    s3.deleteObject(params, async (err, data) => {
      if (err) {
        console.log(err, err.stack);
        return res
          .status(400)
          .send(
            ResponceAPI(
              false,
              null,
              err.message,
              400,
              "error in deleting object",
              version
            )
          );
      } else {
        await ehrModel.deleteOne({ _id: fileExist._id });
        return res
          .status(200)
          .send(
            ResponceAPI(
              true,
              "EHR deleted successfully",
              path,
              null,
              null,
              version
            )
          );
      }
    });
  } catch (error) {
    ApiError(error, "deleteEHR");
    return res
      .status(500)
      .send(
        ResponceAPI(false, null, error.message, 500, "server error", version)
      );
  }
};
//Search EHR by tag or filename
const searchEHRByTagOrFile = async (req, res) => {
  try {
    const patientId = req.patient_id;
    console.log("id", patientId);
    const { searchData } = req.body;
    // const role = await roleModel.findOne({role:"patient"});

    const detailExist = await userModel.findOne({
      _id: patientId,
      isDeleted: false,
    });
    if (!detailExist) {
      return res
        .status(200)
        .send(
          ResponceAPI(false, null, null, 400, "patient is not exist", version)
        );
    }
    const RegTag = "^" + searchData + ".*$";
    const RegReport = "^.*" + searchData + ".*$";
    const list1 = await ehrModel.find(
      {
        $and: [
          { patientId: patientId },
          { tag: { $regex: RegTag, $options: "i" } },
        ],
      },
      { _id: 0, patientId: 1, report: 1, tag: 1 }
    );
    const list2 = await ehrModel.find(
      {
        $and: [
          { patientId: patientId },
          { report: { $regex: RegReport, $options: "i" } },
        ],
      },
      { _id: 0, patientId: 1, report: 1, tag: 1 }
    );

    //merged is a new array that contains unique value
    var ids = new Set(list1.map((d) => d.report));
    var merged = [...list1, ...list2.filter((d) => !ids.has(d.report))];

    return res
      .status(200)
      .send(
        ResponceAPI(
          true,
          "EHR list fetch successfully",
          merged,
          null,
          null,
          version
        )
      );
  } catch (error) {
    ApiError(error, "searchEHRByTagOrFile");
    return res
      .status(500)
      .send(
        ResponceAPI(false, null, error.message, 500, "server error", version)
      );
  }
};

//Logout
const signOut = async (req, res) => {
  try {
    //var token = req.headers.authorization.replace('Bearer ', '');
    return res.status(200).json("logout");
  } catch (error) {
    ApiError(error, "signOut");
    return res
      .status(500)
      .send(
        ResponceAPI(false, null, error.message, 500, "server error", version)
      );
  }
};

//search medical test list
const searchMedicalTest = async (req, res) => {
  try {
    const { searchTest } = req.body;
    const RegTest = "^.*" + searchTest + ".*$";
    const medicalList = await medicalTestModel.find({
      name: { $regex: RegTest, $options: "i" },
    });

    return res
      .status(200)
      .send(
        ResponceAPI(
          true,
          "medical test list fetch successfully",
          medicalList,
          null,
          null,
          version
        )
      );
  } catch (error) {
    ApiError(error, "searchMedicalTest");
    return res
      .status(500)
      .send(
        ResponceAPI(false, null, error.message, 500, "server error", version)
      );
  }
};

//search medicine on the basis of slug
const searchMedicine = async (req, res) => {
  try {
    const { searchMedicine } = req.body;
    var base_url = process.env.BASE_URL;
    //console.log(base_url);
    let url =
      base_url +
      `products?consumer_key=${process.env.consumerKey}&consumer_secret=${process.env.consumerSecret}` +
      `&attributes&${searchMedicine}`;
    //+`&tags&name=${searchMedicine}`;
    const response = await fetch(url);

    const result = await response.json();
    console.log(result.length);
    return res
      .status(200)
      .send(
        ResponceAPI(
          true,
          "products list fetch successfully",
          result,
          null,
          null,
          version
        )
      );
  } catch (error) {
    ApiError(error, "searchMedicine");
    return res
      .status(500)
      .send(
        ResponceAPI(false, null, error.message, 500, "server error", version)
      );
  }
};

//Add family member
const addFamilyMember = async (req, res) => {
  try {
    const patientId = req.patient_id;
    const { name, relation, age, gender, mobile } = req.body;

    const { error, value } = addFamilyMemberSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(200)
        .send(
          ResponceAPI(false, null, null, 400, error.details[0].message, version)
        );
    }

    const patientExist = await patientModel.findOne({
      $and: [{ _id: patientId }, { isDeleted: false }],
    });

    if (!patientExist) {
      return res
        .status(200)
        .send(
          ResponceAPI(false, null, null, 400, "patient is not exist", version)
        );
    }

    const phoneExist = await patientModel.findOne({ mobile: mobile });
    if (phoneExist) {
      return res
        .status(200)
        .send(
          ResponceAPI(
            false,
            null,
            null,
            400,
            "mobile no. is already exist",
            version
          )
        );
    }

    let picture = null;
    if (req.files && req.files.length > 0) {
      uploadImg(req, res, async function (err) {
        const file = req.files[0];
        picture = await uploadFile.uploadFile(file, "patientProfile");
      });
    }
    if (picture == null) {
      const familyData = new patientModel({
        name: name,
        relation: relation,
        age: age,
        image: null,
        gender: gender,
        mobile: mobile,
        patientAddedBy: patientId,
        addedBy: patientId,
      });
      const familyDetails = await familyData.save();

      return res
        .status(201)
        .send(
          ResponceAPI(
            true,
            "family member added successfully",
            familyDetails,
            null,
            null,
            version
          )
        );
    } else {
      const familyData = new patientModel({
        name: name,
        relation: relation,
        age: age,
        image: picture.location,
        gender: gender,
        mobile: mobile,
        patientAddedBy: patientId,
        addedBy: patientId,
      });
      const familyDetails = await familyData.save();

      return res
        .status(201)
        .send(
          ResponceAPI(
            true,
            "family member added successfully",
            familyDetails,
            null,
            null,
            version
          )
        );
    }
  } catch (error) {
    ApiError(error, "addFamilyMember");
    return res
      .status(500)
      .send(
        ResponceAPI(false, null, error.message, 500, "server error", version)
      );
  }
};

const updateFamilyMember = async (req, res) => {
  try {
    const patientId = req.patient_id;
    const { memberId, mobile } = req.params;

    const patientExist = await patientModel.findOne({
      $and: [{ _id: patientId }, { isDeleted: false }],
    });

    if (!patientExist) {
      return res
        .status(200)
        .send(
          ResponceAPI(false, null, null, 400, "patient is not exist", version)
        );
    }

    if (mobile) {
      const phoneExist = await patientModel.findOne({ mobile: mobile });
      if (phoneExist) {
        return res
          .status(200)
          .send(
            ResponceAPI(
              false,
              null,
              null,
              400,
              "mobile no. is already exist",
              version
            )
          );
      }
    }

    let picture = null;
    if (req.files && req.files.length > 0) {
      uploadImg(req, res, async function (err) {
        const file = req.files[0];
        picture = await uploadFile.uploadFile(file, "patientProfile");
      });
    }
    if (picture == null) {
      const familyData = {
        ...req.body,
        patientAddedBy: patientId,
        addedBy: patientId,
      };
      const UpdatefamilyDetails = await patientModel.findByIdAndUpdate(
        { _id: memberId, patientAddedBy: patientId },
        familyData,
        { new: true }
      );

      return res
        .status(200)
        .send(
          ResponceAPI(
            true,
            "family member update successfully",
            UpdatefamilyDetails,
            null,
            null,
            version
          )
        );
    } else {
      const familyData = {
        ...req.body,
        image: picture.location,
        patientAddedBy: patientId,
        addedBy: patientId,
      };
      const UpdatefamilyDetails = await patientModel.findByIdAndUpdate(
        { _id: memberId, patientAddedBy: patientId },
        familyData,
        { new: true }
      );
      return res
        .status(200)
        .send(
          ResponceAPI(
            true,
            "family member update successfully",
            UpdatefamilyDetails,
            null,
            null,
            version
          )
        );
    }
  } catch (error) {
    ApiError(error, "addFamilyMember");
    return res
      .status(500)
      .send(
        ResponceAPI(false, null, error.message, 500, "server error", version)
      );
  }
};

//get list of family memer
const familyMemberList = async (req, res) => {
  try {
    const patientId = req.patient_id;
    const patientExist = await patientModel.findOne({
      $and: [{ _id: patientId }, { isDeleted: false }],
    });

    if (!patientExist) {
      return res
        .status(200)
        .send(
          ResponceAPI(false, null, null, 400, "patient is not exist", version)
        );
    }

    const membersList = await patientModel.find({
      patientAddedBy: patientId,
      isDeleted: false,
    });
    return res
      .status(200)
      .send(
        ResponceAPI(
          true,
          "family member list fetch successfully",
          membersList,
          null,
          null,
          version
        )
      );
  } catch (error) {
    ApiError(error, "familyMemberList");
    return res
      .status(500)
      .send(
        ResponceAPI(false, null, error.message, 500, "server error", version)
      );
  }
};

// api for admin side
const patientRegister = async (req, res) => {
  try {
    const { name, mobile, isActive } = req.body;

    const { error, value } = patientRegisterSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(200)
        .send(
          ResponceAPI(false, null, null, 400, error.details[0].message, version)
        );
    }

    const phoneExist = await patientModel.findOne({ mobile: mobile });
    if (phoneExist) {
      return res
        .status(200)
        .send(
          ResponceAPI(
            false,
            null,
            null,
            409,
            "phone number is already exist",
            version
          )
        );
    }
    const num = randomize("0", 6);
    const refNumber = num + mobile.slice(4, 10);
    const patientData = { name, mobile, isActive, referralCode: refNumber };

    const patientDetails = await patientModel.create(patientData);
    if (!patientDetails) {
      return res
        .status(200)
        .send(
          ResponceAPI(
            false,
            null,
            null,
            409,
            "inavlid patients details",
            version
          )
        );
    }

    await walletPointsModel.create({
      patientId: patientDetails._id,
      patientMobile: patientDetails.mobile,
    });

    return res
      .status(201)
      .send(
        ResponceAPI(
          true,
          "patient create successfully",
          patientDetails,
          null,
          null,
          version
        )
      );
  } catch (error) {
    ApiError(error, "patientRegister");
    return res
      .status(500)
      .send(
        ResponceAPI(false, null, error.message, 500, "server error", version)
      );
  }
};

//verify OTP
const otpVerify = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res
        .status(400)
        .send(
          ResponceAPI(
            false,
            null,
            null,
            400,
            "please provide mobile and otp",
            version
          )
        );
    }
    let data = await otpModel.findOne({ mobile: mobile }).lean().exec();
    if (data) {
      if (data.Otp != otp) {
        return res
          .status(400)
          .send(ResponceAPI(false, null, null, 409, "otp is invalid", version));
      } else if (data.Otp == otp) {
        await otpModel.deleteOne({ _id: data._id });
        return res
          .status(200)
          .send(
            ResponceAPI(
              true,
              "otp verify successfully",
              true,
              null,
              null,
              version
            )
          );
      }
    } else {
      return res
        .status(400)
        .send(ResponceAPI(false, null, null, 409, "otp is expired", version));
    }
  } catch (error) {
    ApiError(error, "Otpverify");
    return res
      .status(500)
      .send(
        ResponceAPI(false, null, error.message, 500, "server error", version)
      );
  }
};

//send OTP
const sendOTP = async (req, res) => {
  try {
    const { mobile } = req.query;
    if (!mobile) {
      return res
        .status(400)
        .send(
          ResponceAPI(false, null, null, 409, "Please provide otp", version)
        );
    }
    const mobileExist = await otpModel.findOne({ mobile: mobile });
    if (mobileExist) {
      await otpModel.deleteOne({ _id: mobileExist._id });
    }

    const data = await getOtp(mobile);

    if (data != null) {
      await data.save();
      const d = {
        message:
          "OTP send to user mobile number and it will expires in 5 minutes",
        otp: data,
      };
      return res
        .status(200)
        .send(ResponceAPI(true, "otp send", d, null, null, version));
    } else {
      return res
        .status(400)
        .send(ResponceAPI(false, null, null, 409, "OTP error", version));
    }
  } catch (error) {
    ApiError(error, "sendOTP");
    return res
      .status(500)
      .send(
        ResponceAPI(false, null, error.message, 500, "server error", version)
      );
  }
};

//get list of all patient //jatin
const getPatientList = async (req, res) => {
  try {
    const { page, search, rowsPerPage, status, fromDate, toDate } = req.query;
    const page1 = parseInt(page) || 1; // Current page number
    const rowsPerPage1 = parseInt(rowsPerPage) || 10; //limit
    let queryData = {};
    if (search) {
      queryData["mobile"] = { $regex: search, $options: "i" };
    }
    if (status) {
      queryData["status"] = status;
    }
    // if (planName) {
    //   queryData["membershipPlanName"] = planName
    // }
    if (fromDate) {
      queryData["createdAt"] = { $gte: new Date(fromDate) };
    }

    if (toDate) {
      queryData["createdAt"] = {
        ...queryData["createdAt"],
        $lte: new Date(toDate),
      };
    }
    queryData["isDeleted"] = 0;

    const offset = (page1 - 1) * rowsPerPage1; // Calculation for offset

    const patientList = await patientModel
      .find(queryData)
      .populate("clinicId")
      .skip(offset)
      .limit(rowsPerPage1)
      .sort({ createdAt: "asc" });
    const cnt = await patientModel.find().sort({ createdAt: "asc" }).count();

    let patientCnt = Math.ceil(cnt / rowsPerPage);
    const data = {
      patientList: patientList,
      totalElement: cnt,
      pageNumber: page1,
      rowsPerPage: rowsPerPage1,
      totalNoOfPages: patientCnt,
    };
    return res
      .status(200)
      .send(
        ResponceAPI(
          true,
          "fetch patient list successfully",
          data,
          null,
          null,
          version
        )
      );
  } catch (error) {
    ApiError(error, "getPatientList");
    return res
      .status(500)
      .send(
        ResponceAPI(false, null, error.message, 500, "server error", version)
      );
  }
};


const getPatientListForClinic = async (req, res) => {
  try {
    const clinicId = req.params.clinicId;

    if (clinicId) {
      const patientList = await patientModel.find({ clinicId: clinicId });
      
      if (patientList.length > 0) {
        res.status(200).send(
          ResponceAPI(
            true,
            "Patient List Fetch Success",
            patientList,
            null,
            null,
            version
          )
        );
      } else {
        return res.status(404).send(
          ResponseAPI(false, "No patients found for this clinic", null, 404, null, version)
        );
      }
    } else {
      return res.status(400).send(
        ResponseAPI(false, "Please select a clinic", null, 400, null, version)
      );
    }
  } catch (error) {
    ApiError(error, "getPatientListForClinic");
    return res.status(500).send(
      ResponceAPI(false, null, error.message, 500, "Server error", version)
    );
  }
};

// const getPatientListForClinic = async (req, res) => {
//   try {
//     const clinicId = req.params.clinicId;

//     if (clinicId) {
//       const patientList = await patientModel.find(
//         { clinicId: clinicId },
//         { _id: 1, name: 1 }
//       );
//       res
//         .status(200)
//         .send(
//           ResponceAPI(
//             true,
//             "Patient List Fetch Success",
//             patientList,
//             null,
//             null,
//             version
//           )
//         );
//     } else {
//       return res
//         .status(400)
//         .send(
//           ResponseAPI(false, "please Select a clinic", null, 409, null, version)
//         );
//     }
//   } catch (error) {
//     ApiError(error, "getPatientListForClinic");
//     return res
//       .status(500)
//       .send(
//         ResponceAPI(false, null, error.message, 500, "server error", version)
//       );
//   }
// };





// get patient by Id
const getPatient = async (req, res) => {
  try {
    const userID = req.params.patientId;
    const todayDate = moment().format("YYYY-MM-DD");
    const userDetails = await patientModel
      .findOne({ _id: userID, isDeleted: "false" })
      .populate("clinicId");

    if (!userDetails) {
      return res
        .status(400)
        .send(
          ResponceAPI(false, null, null, 400, "user id is invalid", version)
        );
    }

    return res
      .status(200)
      .send(
        ResponceAPI(
          true,
          "details fetch successfully",
          userDetails,
          null,
          null,
          version
        )
      );
  } catch (error) {
    ApiError(error, "getPatient");
    return res
      .status(500)
      .send(
        ResponceAPI(false, "server error", null, 500, error.message, version)
      );
  }
};

//edit patient data //jatin
const updatePatient = async (req, res) => {
  try {
    const userID = req.params.patientId;

    console.log("req.body", req.body);
    const obj = JSON.parse(JSON.stringify(req.body));
    const userDetails = await patientModel
      .findOne({ _id: userID, isDeleted: "false" })
      .lean();

    if (!userDetails) {
      return res
        .status(400)
        .send(
          ResponceAPI(false, null, null, 400, "user id is invalid", version)
        );
    }
    //  if()
    const data = _.merge(userDetails, obj);
    console.log("data", data);
    const updateData = await patientModel.updateOne({ _id: userID }, data);

    return res
      .status(200)
      .send(ResponceAPI(true, "update data", updateData, null, null, version));
  } catch (error) {
    ApiError(error, "updatePatient");
    return res
      .status(500)
      .send(
        ResponceAPI(false, "server error", null, 500, error.message, version)
      );
  }
};

//get patient by mobile no
const getPatientByMobile = async (req, res) => {
  try {
    const mobile = req.params.mobile;
    const todayDate = moment().format("YYYY-MM-DD");
    if (!mobile) {
      return res
        .status(400)
        .send(
          ResponceAPI(false, null, null, 400, "mobile no is required", version)
        );
    }
    if (mobile.length == 0 || mobile.length > 10) {
      return res
        .status(400)
        .send(
          ResponceAPI(
            false,
            null,
            null,
            400,
            "mobile no is should be 10 digit",
            version
          )
        );
    }
    const patientExist = await patientModel
      .findOne({
        $and: [{ mobile: mobile }, { isDeleted: false }, { isActive: true }],
      })
      .populate("membershipPlanId")
      .populate("subscriptionId");

    if (patientExist) {
      if (patientExist.subscriptionId != null) {
        if (patientExist.subscriptionId.expireDate < todayDate) {
          patientExist.status = "expire";
          patientExist.save();
        }
      }

      return res
        .status(200)
        .send(
          ResponceAPI(
            true,
            "patient detail fetch successfuly",
            patientExist,
            null,
            null,
            version
          )
        );
    } else {
      return res
        .status(400)
        .send(
          ResponceAPI(false, null, null, 400, "mobile no is not exist", version)
        );
    }
  } catch (error) {
    ApiError(error, "getPatientByMobile");
    return res
      .status(500)
      .send(
        ResponceAPI(false, "server error", null, 500, error.message, version)
      );
  }
};

//get patient full profile
const getPatientProfile = async (req, res) => {
  try {
    const todayDate = moment().format("YYYY-MM-DD");
    const id = req.params.patientId;

    const selectMemberShipFields = [
      "_id",
      "planName",
      "priceWithGst",
      "appointmentSlot",
      "offPercentMedicine",
      "maxOffAmountMedicine",
      "offPercentTest",
      "maxOffAmountTest",
      "expiryMonth",
      "description",
    ];

    const idExist = await patientModel
      .findOne({ _id: id, isDeleted: "false" })
      .populate("membershipPlanId", selectMemberShipFields)
      .populate("subscriptionId");
    if (!idExist) {
      return res
        .status(400)
        .send(
          ResponceAPI(false, null, null, 400, "patient is not exist", version)
        );
    } else {
      if (idExist.subscriptionId != null) {
        if (idExist.subscriptionId.expireDate < todayDate) {
          console.log(idExist.subscriptionId.expireDate + "    " + todayDate);

          idExist.status = "expire";
          idExist.save();
        }
      }
      const familyD = await patientModel.find({ patientAddedBy: id });
      const transactionHistory = await transactionModel.find({
        $and: [{ patientId: id }, { orderType: "subscription" }],
      });
      const scriptionHistory = await subscriptionModel.find({ patientId: id });
      const walletData = await walletPointsModel.findOne({ patientId: id });
      const responcePatientData = {
        patient: idExist,
        points: walletData?.points || null,
        family: familyD,
        transactionHistory: transactionHistory,
        scriptionHistory: scriptionHistory,
      };
      return res
        .status(200)
        .send(
          ResponceAPI(
            true,
            "patient detail fetch successfulyy",
            responcePatientData,
            null,
            null,
            version
          )
        );
    }
  } catch (error) {
    ApiError(error, "getPatientProfile");
    return res
      .status(500)
      .send(
        ResponceAPI(false, "server error", null, 500, error.message, version)
      );
  }
};

//patient all subscription plan history
const planHistory = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const historyData = await transactionModel.find({
      $and: [{ patientId: patientId }, { orderType: "subscription" }],
    });

    return res
      .status(200)
      .send(
        ResponceAPI(
          true,
          "patient subscription history fetch successfully",
          historyData,
          null,
          null,
          version
        )
      );
  } catch (error) {
    ApiError(error, "planHistory");
    return res
      .status(500)
      .send(
        ResponceAPI(false, "server error", null, 500, error.message, version)
      );
  }
};

//update Appointment
const updateAppointment = async (req, res) => {
  try {
    const patientID = req.params.patientId;

    const patientExist = await patientModel.findOne({
      $and: [{ _id: patientID }, { isDeleted: false }, { isActive: true }],
    });
    if (!patientExist) {
      return res
        .status(400)
        .send(
          ResponceAPI(false, null, null, 400, "patient is not exist", version)
        );
    } else {
      const a = patientExist.freeAppointment - 1;
      const data = { freeAppointment: a };
      const updateData = await patientModel.findByIdAndUpdate(
        patientExist._id,
        data,
        { new: true }
      );
      return res
        .status(200)
        .send(
          ResponceAPI(
            true,
            " appoinement update successfully",
            updateData,
            null,
            null,
            version
          )
        );
    }
  } catch (error) {
    ApiError(error, "updateAppointment");
    return res
      .status(500)
      .send(
        ResponceAPI(false, "server error", null, 500, error.message, version)
      );
  }
};

// appointment list
const appointmentList = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const appointmentData = await appointmentModel.find({
      patientId: patientId,
    });
    return res
      .status(200)
      .send(
        ResponceAPI(
          true,
          " appoinement list fetch successfully",
          appointmentData,
          null,
          null,
          version
        )
      );
  } catch (error) {
    ApiError(error, "appointmentList");
    return res
      .status(500)
      .send(
        ResponceAPI(false, "server error", null, 500, error.message, version)
      );
  }
};

// signed url
const generateURL = async (req, res) => {
  try {
    const { url } = req.body;
    const urlData = await urlModel.findOne({ url: url });
    if (urlData) {
      return res
        .status(200)
        .send(
          ResponceAPI(
            true,
            " url fetch successfully",
            urlData.generateUrl,
            null,
            null,
            version
          )
        );
    } else {
      const newURL = await signedURL(url);

      const data = { url: url, generateUrl: newURL };
      // console.log("data",data);
      const urlD = await urlModel.create(data);
      return res
        .status(200)
        .send(
          ResponceAPI(
            true,
            " url fetch successfully",
            urlD.generateUrl,
            null,
            null,
            version
          )
        );
    }
  } catch (error) {
    ApiError(error, "generateURL");
    return res
      .status(500)
      .send(
        ResponceAPI(false, "server error", null, 500, error.message, version)
      );
  }
};

//patitent by mobile usinf findOne
const getPatientByMob = async (req, res) => {
  try {
    const mobile = req.params.mobile;
    if (!mobile) {
      return res
        .status(400)
        .send(
          ResponceAPI(false, null, null, 400, "mobile no is required", version)
        );
    }
    const patientData = await patientModel.findOne({
      $and: [{ mobile: mobile }, { isDeleted: false }, { isActive: true }],
    });

    return res
      .status(200)
      .send(
        ResponceAPI(
          true,
          "patient detail fetch successfuly",
          patientData,
          null,
          null,
          version
        )
      );
  } catch (error) {
    ApiError(error, "getPatientByMob");
    return res
      .status(500)
      .send(
        ResponceAPI(false, "server error", null, 500, error.message, version)
      );
  }
};

const addPatientAddress = async (req, res) => {
  try {
    //const   req.patient_id
    const patientId = req.patient_id;

    const { error, value } = patientAddressValidSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .send(
          ResponceAPI(false, null, null, 400, error.details[0].message, version)
        );
    }
    const { email } = req.body;

    const patientData = await patientModel.findOne({
      $and: [{ _id: patientId }, { isDeleted: false }, { isActive: true }],
    });
    if (!patientData) {
      return res
        .status(400)
        .send(
          ResponceAPI(false, null, null, 400, "Patient not exist", version)
        );
    }
    if (email) {
      patientData.email = email;
      patientData.save();
    }
    const patentSaveData = { patientId, ...req.body };
    const addAddress = await patientAddressModel.create(patentSaveData);
    return res
      .status(201)
      .send(
        ResponceAPI(
          true,
          "Address save successfuly",
          addAddress,
          null,
          null,
          version
        )
      );
  } catch (error) {
    ApiError(error, "Address save");
    return res
      .status(500)
      .send(
        ResponceAPI(false, "server error", null, 500, error.message, version)
      );
  }
};

const updatePatientAddress = async (req, res) => {
  try {
    //const   req.patient_id
    const patientId = req.patient_id;
    const {} = req.params;
    const patientData = await patientModel.findOne({
      $and: [{ _id: patientId }, { isDeleted: false }, { isActive: true }],
    });
    if (!patientData) {
      return res
        .status(400)
        .send(
          ResponceAPI(false, null, null, 400, "Patient not exist", version)
        );
    }

    const patentSaveData = { patientId, ...req.body };
    const addAddress = await patientAddressModel.findOneAndDelete(
      { _id: "", patientId: patientId },
      patentSaveData,
      { new: true }
    );
    return res
      .status(201)
      .send(
        ResponceAPI(
          true,
          "Address save successfuly",
          addAddress,
          null,
          null,
          version
        )
      );
  } catch (error) {
    ApiError(error, "Address save");
    return res
      .status(500)
      .send(
        ResponceAPI(false, "server error", null, 500, error.message, version)
      );
  }
};

const fetchPatientAddress = async (req, res) => {
  try {
    const patientId = req.patient_id;
    const patientData = await patientModel.findOne({
      $and: [{ _id: patientId }, { isDeleted: false }, { isActive: true }],
    });
    if (!patientData) {
      return res
        .status(400)
        .send(
          ResponceAPI(false, null, null, 400, "Patient not exist", version)
        );
    }
    const addressList = await patientAddressModel.find({
      patientId,
      isDeleted: false,
    });
    return res
      .status(200)
      .send(
        ResponceAPI(
          true,
          "Fetch all addresssuccessfuly",
          addressList,
          null,
          null,
          version
        )
      );
  } catch (error) {
    ApiError(error, "Address list fetch");
    return res
      .status(500)
      .send(
        ResponceAPI(false, "server error", null, 500, error.message, version)
      );
  }
};

const getPatientAddressByAddressId = async (req, res) => {
  try {
    const { addressId } = req.params;
    const patientId = req.patient_id;
    const getAddress = await patientAddressModel.find({
      _id: addressId,
      patientId,
      isDeleted: false,
    });

    if (!getAddress) {
      return res
        .status(400)
        .send(
          ResponceAPI(false, null, null, 400, "Address Id not exist", version)
        );
    }
    return res
      .status(200)
      .send(
        ResponceAPI(
          true,
          "Get address successfuly",
          getAddress,
          null,
          null,
          version
        )
      );
  } catch (error) {
    ApiError(error, "Address Delete");
    return res
      .status(500)
      .send(
        ResponceAPI(false, "server error", null, 500, error.message, version)
      );
  }
};

const removePatientAddressByAddressId = async (req, res) => {
  try {
    const { addressId } = req.params;
    const patientId = req.patient_id;
    console.log(addressId + "    " + patientId);
    const deleteAddress = await patientAddressModel.findOneAndUpdate(
      { _id: addressId, patientId, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!deleteAddress) {
      return res
        .status(400)
        .send(
          ResponceAPI(false, null, null, 400, "Address Id not exist", version)
        );
    }
    return res
      .status(200)
      .send(
        ResponceAPI(
          true,
          "Delete address successfuly",
          deleteAddress,
          null,
          null,
          version
        )
      );
  } catch (error) {
    ApiError(error, "Address get");
    return res
      .status(500)
      .send(
        ResponceAPI(false, "server error", null, 500, error.message, version)
      );
  }
};

const updatePatientAddressByAddressId = async (req, res) => {
  try {
    const { addressId } = req.params;
    const patientId = req.patient_id;
    const updateAddress = await patientAddressModel.findOneAndUpdate(
      { _id: addressId, patientId, isDeleted: false },
      req.body,
      { new: true }
    );

    if (!updateAddress) {
      return res
        .status(400)
        .send(
          ResponceAPI(false, null, null, 400, "Address not exist", version)
        );
    }
    return res
      .status(200)
      .send(
        ResponceAPI(
          true,
          "Update address successfuly",
          updateAddress,
          null,
          null,
          version
        )
      );
  } catch (error) {
    ApiError(error, "Address get");
    return res
      .status(500)
      .send(
        ResponceAPI(false, "server error", null, 500, error.message, version)
      );
  }
};

const selectPatientAddressByAddressId = async (req, res) => {
  try {
    const { addressId } = req.params;
    const patientId = req.patient_id;
    await patientAddressModel.updateMany(
      { patientId, isDeleted: false },
      { isSelect: false }
    );

    const updateAddress = await patientAddressModel.findOneAndUpdate(
      { _id: addressId, patientId, isDeleted: false },
      { isSelect: true },
      { new: true }
    );

    if (!updateAddress) {
      return res
        .status(200)
        .send(
          ResponceAPI(false, null, null, 400, "Address not exist", version)
        );
    }
    return res
      .status(200)
      .send(
        ResponceAPI(
          true,
          "Select address successfuly",
          updateAddress,
          null,
          null,
          version
        )
      );
  } catch (error) {
    ApiError(error, "Address Select");
    return res
      .status(500)
      .send(
        ResponceAPI(false, "server error", null, 500, error.message, version)
      );
  }
};

const VerifiyMeetPatientMeet = async (req, res) => {
  try {
    const { payload } = req.body;
    const data = CryptoJS.AES.decrypt(
      payload,
      "U2FsdGVkX18vqOyplGjOToHHKIXovVz3Q1QE8zY93W1QhJnUfF7aU094t4YdhUKZ"
    ).toString(CryptoJS.enc.Utf8);
    const { appointmentId, userId } = JSON.parse(data);
    const today = moment().format("YYYY-MM-DD");

    const patientExist = await patientModel.findOne({ _id: userId });
    if (!patientExist) {
      return res
        .status(400)
        .send(
          ResponceAPI(false, null, null, 400, "patient id is invalid", version)
        );
    }
    const patientData = ["name", "email", "mobile", "age"];
    const doctorData = [
      "name",
      "email",
      "mobile",
      "qualifications",
      "specialization",
      "subSpecialization",
      "experience",
    ];
    const appointmentData = await appointmentsModel
      .findOne({
        appointmentNo: appointmentId,
        patientId: userId,
        date: today,
        status: { $ne: "cancel" },
      })
      .lean();
    if (!appointmentData) {
      return res
        .status(400)
        .send(
          ResponceAPI(
            false,
            null,
            null,
            400,
            "Appointment number is invalid",
            version
          )
        );
    }

    const joinMeet = await meetJoinModel.findOne({
      appointmentNo: appointmentId,
      joinType: "patient",
      patientId: userId,
    });
    if (joinMeet) {
      return res
        .status(200)
        .send(
          ResponceAPI(
            true,
            "Room create successfully",
            joinMeet,
            null,
            null,
            version
          )
        );
    } else {
      const addData = {
        appointmentNo: appointmentId,
        joinType: "patient",
        doctorId: appointmentData.doctorId,
        doctorMobile: appointmentData.doctorMobile,
        doctorName: appointmentData.doctorName,
        patientId: appointmentData.patientId,
        patientName: patientExist.name,
        patientMobile: appointmentData.patientMobile,
        date: appointmentData.date,
        day: appointmentData.day,
        slot: appointmentData.slot,
        slotEnd: appointmentData.slotEnd,
      };
      const joinMeet = await meetJoinModel.create(addData);
      const responseMeet = await meetJoinModel
        .findOne({ _id: joinMeet._id })
        .populate("doctorId", doctorData)
        .populate("patientId", patientData)
        .lean();
      return res
        .status(201)
        .send(
          ResponceAPI(
            true,
            "Room create successfully",
            responseMeet,
            null,
            null,
            version
          )
        );
    }
  } catch (error) {
    ApiError(error, "Appointment Data");
    return res
      .status(500)
      .send(
        ResponceAPI(false, "server error", null, 500, error.message, version)
      );
  }
};
const getPatientProfileforMobile = async (req, res) => {
  try {
    const patientId = req.patient_id;
    console.log(patientId);
    const patentData = await patientModel
      .findOne({ _id: patientId, isDeleted: false, isActive: true })
      .populate("membershipPlanId")
      .populate("subscriptionId");
    return res
      .status(200)
      .send(
        ResponceAPI(
          true,
          "patient detail fetch successfulyy",
          patentData,
          null,
          null,
          version
        )
      );
  } catch (error) {
    ApiError(error, "getPatientProfileMobile");
    return res
      .status(500)
      .send(
        ResponceAPI(false, "server error", null, 500, error.message, version)
      );
  }
};

const deletePatienAccountforMobile = async (req, res) => {
  try {
    const patientId = req.patient_id;
    const { id, type } = req.params;
    if (type == "self") {
      if (patientId != id) {
        return res
          .status(200)
          .send(
            ResponceAPI(false, null, null, 400, "Invalid User Id", version)
          );
      }
      const patentData = await patientModel.findOneAndUpdate(
        { _id: patientId, isDeleted: false },
        { isDeleted: true, isActive: false },
        { new: true }
      );
      if (!patentData) {
        return res
          .status(200)
          .send(ResponceAPI(false, null, null, 400, "User not exist", version));
      }
      return res
        .status(200)
        .send(
          ResponceAPI(
            true,
            "User account delete successfully",
            "User account delete successfully",
            null,
            null,
            version
          )
        );
    } else if (type == "family") {
      const patentData = await patientModel.findOneAndUpdate(
        { _id: id, patientAddedBy: patientId, isDeleted: false },
        { isDeleted: true, isActive: false },
        { new: true }
      );
      if (!patentData) {
        return res
          .status(200)
          .send(ResponceAPI(false, null, null, 400, "User not exist", version));
      }
      return res
        .status(200)
        .send(
          ResponceAPI(
            true,
            "User family account delete successfully",
            "User account delete successfully",
            null,
            null,
            version
          )
        );
    } else {
      return res
        .status(200)
        .send(
          ResponceAPI(
            false,
            null,
            null,
            400,
            "Enter valid delete account type [self,family]",
            version
          )
        );
    }
  } catch (error) {
    ApiError(error, "delete Patient account");
    return res
      .status(500)
      .send(
        ResponceAPI(false, "server error", null, 500, error.message, version)
      );
  }
};
// when user subscription is expire then mark patient status as unsubscribed and assign 0 to free Appointment respect patient
module.exports = {
  addPatient,
  // getPatientById,
  // checkMobileExist,
  // updatePatientProfile,
  // uploadImage,
  // uploadEHR,
  // ehrList,
  // deleteEHR,
  // searchEHRByTagOrFile,
  // signOut,
  // searchMedicalTest,
  // searchMedicine,
  // addFamilyMember,
  // familyMemberList,
  // patientRegister,
  getPatientList,
  getPatient,
  updatePatient,
  // getPatientByMobile,
  // getPatientProfile,
  // planHistory,
  // updateAppointment,
  // appointmentList,
  // generateURL,
  // otpVerify,
  // getPatientByMob,
  // sendOTP,
  // addPatientAddress,
  // fetchPatientAddress,
  // getPatientAddressByAddressId,
  // removePatientAddressByAddressId,
  // updatePatientAddressByAddressId,
  // selectPatientAddressByAddressId,
  // updatePatientDetails,
  // VerifiyMeetPatientMeet,
  // getPatientProfileforMobile,
  // deletePatienAccountforMobile,
  // updateFamilyMember
  getPatientListForClinic,
};

// const collection1 = database.collection('collection1');
// const collection2 = database.collection('collection2');
// const aggregationPipeline = [{ $lookup: { from: 'collection2',
//  let: { commonField: '$commonField' },
//   pipeline: [{ $match: { $expr: { $and: [{ $eq: ['$commonField', '$$commonField'] },
//    // The condition between the two arrays // Additional conditions can be added here if needed ] } } } ], as: 'joinedData' } } ]; const result = await collection1.aggregate(aggregationPipeline).toArray(); console.log(result);
