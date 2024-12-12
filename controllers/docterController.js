const doctorModel = require("../models/doctorModel");
const qualificationModel = require("../models/qualification");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { ResponceAPI } = require("../utils/ResponceAPI");
const bcrypt = require("bcryptjs");
const version = process.env.API_VERSION;
const ApiError = require("../functions/ApiError");
const moment = require("moment");
const { uploadFile } = require("../utils/awsConfig");

const getDoctorById = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const doctorDetail = await doctorModel.findOne({
      _id: doctorId,
      isDeleted: false,
    });
    if (!doctorDetail) {
      return res
        .status(400)
        .send(
          ResponceAPI(false, null, null, 400, "doctor is not exist", version)
        );
    }
    return res
      .status(200)
      .send(
        ResponceAPI(
          true,
          "doctor fetch successfully",
          doctorDetail,
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

const getDoctorList = async (req, res) => {
  try {
    const {
      search,
      specialization,
      category,
      status,
      doctorType,
      fromDate,
      toDate,
      page,
      rowsPerPage,
      symptoms,
    } = req.query;

    const page1 = parseInt(page) || 1; // Current page number
    const rowsPerPage1 = parseInt(rowsPerPage) || 10; //limit
    const filters = [{ isDeleted: false }];

    if (search) {
      filters.push({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { mobile: { $regex: search, $options: "i" } },
        ],
      });
    }

    if (specialization) {
      filters.push({ specialization: specialization });
    }
    if (symptoms) {
      filters.push({ subSpecialization: symptoms });
    }
    if (category) {
      filters.push({ category: category });
    }
    if (status) {
      filters.push({ status: status });
    }
    if (doctorType) {
      filters.push({ doctorType: doctorType });
    }
    if (fromDate && toDate) {
      filters.push({
        createdAt: {
          $gte: new Date(fromDate),
          $lte: new Date(toDate),
        },
      });
    } else if (fromDate) {
      filters.push({ createdAt: { $gte: new Date(fromDate) } });
    } else if (toDate) {
      filters.push({ createdAt: { $lte: new Date(toDate) } });
    }

    // Combine OR conditions
    const query = filters.length > 0 ? { $and: filters } : {};
    const offset = (page1 - 1) * rowsPerPage1; // Calculation for offset
    const doctorlist = await doctorModel
      .find(query)
      .skip(offset)
      .limit(rowsPerPage1)
      .sort({ createdAt: "asc" })
      .select({ slots: 0 });
    const cnt = await doctorModel
      .find(query)
      .sort({ createdAt: "asc" })
      .count();

    let doctortCnt = Math.ceil(cnt / rowsPerPage1);
    const doctorResponceData = {
      doctorList: doctorlist,
      pageNumber: page1,
      rowsPerPage: rowsPerPage1,
      totalElement: cnt,
      totalNoOfPages: doctortCnt,
    };
    return res
      .status(200)
      .send(
        ResponceAPI(
          true,
          "doctor list",
          doctorResponceData,
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

const getSinlgeDoctorById = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const doctorExist = await doctorModel
      .findOne({ _id: doctorId, isDeleted: false })
      .lean();
    if (!doctorExist) {
      return res
        .status(404)
        .send(
          ResponceAPI(
            false,
            null,
            doctorExist,
            404,
            "doctor does not exist",
            version
          )
        );
    }

    return res
      .status(200)
      .send(
        ResponceAPI(true, "doctor exist", doctorExist, null, null, version)
      );
  } catch (error) {
    return res
      .status(500)
      .send(
        ResponceAPI(false, null, error.message, 500, "server error", version)
      );
  }
};
//jatin

const createDoctor = async (req, res) => {
  try {
    // const { error, value } = doctorAdminSchema.validate(req.body, {
    //   abortEarly: false,
    // });
    // if (error) {
    //   return res.status(400).send(ResponceAPI(false, null, null, 400, error.details[0].message, version))
    // }
    const {
      mobile,
      subSpecialization,
    } = req.body;
    const phoneExist = await doctorModel.findOne({
      $and: [{ mobile: mobile }, { isdeleted: false }],
    });
    if (phoneExist) {
      return res
        .status(400)
        .send(
          ResponceAPI(
            false,
            null,
            null,
            409,
            "Mobile no already exist",
            version
          )
        );
    }
    const subSpecializationArr = subSpecialization;
    let profileImage = null;
    let licenseDocument = null;
    let certificateDocument = null;
    //uploadFile
    console.log("Before Uploading the Files");
    /*
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        if (req.files[i].fieldname == "profileImage") {
            console.log("Profile Uploading the Files")
          profileImage = await uploadFile.uploadFile(req.files[i], "profileImage")
        }
        if (req.files[i].fieldname == "licenseDocument") {
            console.log("Profile Uploading the Files")
          licenseDocument = await uploadFile.uploadFile(req.files[i], "licenseDocument")
        }
        if (req.files[i].fieldname == "certificateDocument") {
            console.log("Profile Uploading the Files")
          certificateDocument = await uploadFile.uploadFile(req.files[i], "certificateDocument")
        }
      }
    }
    */

    //  const timedata = JSON.parse(timeList)
    // let slotData = null
    // let schedulerData;
    // if (slotTime) {
    //   schedulerData = JSON.parse(scheduler)
    //   slotData = {
    //     monday: timeToSlot(schedulerData.monday, slotTime),
    //     tuesday: timeToSlot(schedulerData.tuesday, slotTime),
    //     wednesday: timeToSlot(schedulerData.wednesday, slotTime),
    //     thursday: timeToSlot(schedulerData.thursday, slotTime),
    //     friday: timeToSlot(schedulerData.friday, slotTime),
    //     saturday: timeToSlot(schedulerData.saturday, slotTime),
    //     sunday: timeToSlot(schedulerData.sunday, slotTime),

    //   }
    // }
    // console.log("slotData"+slotData)

    const password = "12345678";
    const encryptedPassword = await bcrypt.hash(password, 10);
    const docterData = {
      ...req.body,
      roleID: new ObjectId("6540b4f712421017ed06c478"),
      password: encryptedPassword,
      // "scheduler": schedulerData,
      // "slots": slotData,
      // "slotTime": slotTime,
      // bankDetails: (bankDetails) ? JSON.parse(bankDetails) : null,
      //subSpecialization: subSpecializationArr,
      profileImage: profileImage?.location,
      licenseDocument: licenseDocument?.location,
      certificateDocument: certificateDocument?.location,
    };

    //   return res.status(400).send(docterData)
    const doctorDetalils = await doctorModel.create(docterData);
    console.log("Hii");
    return res
      .status(201)
      .send(
        ResponceAPI(
          true,
          "Doctor create Successfully ",
          doctorDetalils,
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

//jatin
const deleteDoctorById = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;

    const doctorDetails = await doctorModel.findOneAndUpdate(
      { _id: doctorId, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!doctorDetails) {
      return res
        .status(404)
        .send(
          ResponceAPI(false, null, null, 404, "Doctor is not exist", version)
        );
    }
    return res
      .status(200)
      .send(
        ResponceAPI(
          true,
          "Deleted successfully ",
          doctorDetails,
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

const doctorExist = async (req, res) => {
  try {
    const number = req.params.number;
    const doctorExist = await doctorModel
      .findOne({ mobile: number })
      .select({ _id: 1, mobile: 1, name: 1 });
    if (!doctorExist) {
      return res
        .status(404)
        .send(
          ResponceAPI(
            false,
            null,
            doctorExist,
            404,
            "doctor does not exist",
            version
          )
        );
    }
    return res
      .status(200)
      .send(
        ResponceAPI(true, "doctor exist", doctorExist, null, null, version)
      );
  } catch (error) {
    return res
      .status(500)
      .send(
        ResponceAPI(false, null, error.message, 500, "server error", version)
      );
  }
};

//jatin
const editDoctorById = async (req, res) => {
  try {
    const doctorId = new ObjectId(req.params.doctorId);
    console.log(doctorId);
    const {
      name,
      email,
      mobile,
      dob,
      gender,
      qualifications,
      specialization,
      experience,
      supervisorId,
      subSpecialization,
    } = req.body;
    let profileImage = null;
    let licenseDocument = null;
    let certificateDocument = null;
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        if (req.files[i].fieldname == "profileImage") {
          profileImage = await uploadFile.uploadFile(
            req.files[i],
            "profileImage"
          );
        }
        if (req.files[i].fieldname == "licenseDocument") {
          licenseDocument = await uploadFile.uploadFile(
            req.files[i],
            "licenseDocument"
          );
        }
        if (req.files[i].fieldname == "certificateDocument") {
          certificateDocument = await uploadFile.uploadFile(
            req.files[i],
            "certificateDocument"
          );
        }
      }
    }
    const docterData = {
      ...req.body,

      profileImage: profileImage?.location,
      licenseDocument: licenseDocument?.location,
      certificateDocument: certificateDocument?.location,
    };

    const doctorDetails = await doctorModel.findOneAndUpdate(
      { _id: doctorId, isDeleted: false },
      docterData,
      { new: true }
    );

    if (!doctorDetails) {
      return res
        .status(404)
        .send(
          ResponceAPI(false, null, null, 404, "Doctor is not exist", version)
        );
    }
    return res
      .status(200)
      .send(
        ResponceAPI(
          true,
          "Doctor update successfully ",
          doctorDetails,
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

const addQualification = async (req, res) => {
  try {
    const { qualification } = req.body;
    if (!qualification) {
      return res
        .status(200)
        .json({
          status: 400,
          errorcode: "104",
          message: "Please provide qualification.",
        });
    }

    const data = new qualificationModel({
      qualification: qualification,
    });
    const qualificationData = await data.save();
    return res
      .status(201)
      .send(
        ResponceAPI(
          true,
          "Qualification added successfully ",
          qualificationData,
          null,
          null,
          version
        )
      );
  } catch (error) {
    ApiError(error, "addQualification");
    return res
      .status(500)
      .send(ResponceAPI(false, "server", null, 500, error.message, version));
  }
};

//Get Qualification List
const getQualificationList = async (req, res) => {
  try {
    const data = await qualificationModel.find(
      {},
      { qualification: 1, _id: 0 }
    );
    return res
      .status(201)
      .send(
        ResponceAPI(
          true,
          "Qualification fetch successfully ",
          data,
          null,
          null,
          version
        )
      );
  } catch (error) {
    ApiError(error, "getQualificationList");
    return res
      .status(500)
      .send(ResponceAPI(false, "server", null, 500, error.message, version));
  }
};




const doctorEarningList = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const doctorExist = await doctorModel.findOne({
      _id: doctorId,
      isDeleted: "false",
    });
    if (!doctorExist) {
      return res
        .status(400)
        .send(
          ResponceAPI(false, null, null, 400, "doctor id is invalid", version)
        );
    }

    const { search, fromDate, toDate, page, rowsPerPage } = req.query;

    const page1 = parseInt(page) || 1; // Current page number
    const rowsPerPage1 = parseInt(rowsPerPage) || 10; //limit
    const filters = [{ doctorId: doctorId }];

    if (search) {
      filters.push({
        $or: [
          { transactionId: { $regex: search, $options: "i" } },
          { appointmentNumber: { $regex: search, $options: "i" } },
        ],
      });
    }
    if (fromDate && toDate) {
      filters.push({
        createdAt: {
          $gte: new Date(fromDate),
          $lte: new Date(toDate),
        },
      });
    } else if (fromDate) {
      filters.push({ createdAt: { $gte: new Date(fromDate) } });
    } else if (toDate) {
      filters.push({ createdAt: { $lte: new Date(toDate) } });
    }

    const query = filters.length > 0 ? { $and: filters } : {};
    const offset = (page1 - 1) * rowsPerPage1;

    const doctorEarning = await doctorEarningModel
      .find()
      .skip(offset)
      .limit(rowsPerPage1)
      .sort({ createdAt: "asc" })
      .select({ slots: 0 })
      .populate({
        path: "patientId",
        select: "name",
      })
      .populate({
        path: "appointmentId",
        select: "appointmentNo",
      });
    const cnt = await doctorModel
      .find(query)
      .sort({ createdAt: "asc" })
      .count();

    let doctortCnt = Math.ceil(cnt / rowsPerPage1);
    const doctorEarningResponceData = {
      doctorEarningList: doctorEarning,
      pageNumber: page1,
      rowsPerPage: rowsPerPage1,
      totalElement: cnt,
      totalNoOfPages: doctortCnt,
    };

    return res
      .status(201)
      .send(
        ResponceAPI(
          true,
          "Doctor Earning Responce Data successfully",
          doctorEarningResponceData,
          null,
          null,
          version
        )
      );
  } catch (error) {
    ApiError(error, "doctorEarningResponceData");
    return res
      .status(500)
      .send(
        ResponceAPI(false, "server error", null, 500, error.message, version)
      );
  }
};

const activeDoctorList = async (req, res) => {
  try {
    const {
      search,
      specialization,
      experience,
      availability,
      fees,
      gender,
      language,
      doctorType,
      page,
      rowsPerPage,
      symptoms,
      sort,
    } = req.body;

    const page1 = parseInt(page) || 1;
    const rowsPerPage1 = parseInt(rowsPerPage) || 10;
    const sortData = sort || { createdAt: -1 };
    const filters = [{ status: "Published" }, { isDeleted: false }];

    if (doctorType == "partner") {
      filters.push({ doctorType: { $in: ["Kapeefit_Partner"] } });
    } else {
      let levelNumber = "Level1";
      const level1 = await appointmentsModel
        .find({
          doctorType: {
            $in: [
              "Kapeefit_Doctor_Membership",
              "Kapeefit_Doctor_Paid_And_Membership",
            ],
          },
          category: "Level1",
          isBook: true,
        })
        .count();
      const level2 = await appointmentsModel
        .find({
          doctorType: {
            $in: [
              "Kapeefit_Doctor_Membership",
              "Kapeefit_Doctor_Paid_And_Membership",
            ],
          },
          category: "Level2",
          isBook: true,
        })
        .count();
      const level3 = await appointmentsModel
        .find({
          doctorType: {
            $in: [
              "Kapeefit_Doctor_Membership",
              "Kapeefit_Doctor_Paid_And_Membership",
            ],
          },
          category: "Level3",
          isBook: true,
        })
        .count();
      const settingData = await settingModel({ name: "setting" });

      if (level3 == settingData.doctorAppointmentLever3) {
        await appointmentsModel.updateMany({ isBook: true }, { isBook: false });
      }

      if (level1 <= settingData.doctorAppointmentLever1) {
        levelNumber = "Level1";
      } else if (level2 <= settingData.doctorAppointmentLever2) {
        levelNumber = "Level2";
      } else if (level3 <= settingData.doctorAppointmentLever3) {
        levelNumber = "Level3";
      }
      let query = {
        category: levelNumber,
        doctorType: { $ne: "Kapeefit_Partner" },
      };
      if (doctorType != "kapeefit") {
        query = {
          $or: [
            { doctorType: "Kapeefit_Partner" },
            { category: levelNumber, doctorType: { $ne: "Kapeefit_Partner" } },
          ],
        };
      }
      filters.push(query);
    }

    if (search) {
      filters.push({ $or: [{ name: { $regex: search, $options: "i" } }] });
    }

    if (specialization) {
      filters.push({ specialization: { $in: specialization } });
    }
    if (symptoms) {
      filters.push({ subSpecialization: { $in: symptoms } });
    }
    if (experience) {
      const modifiedExp = experience.map((obj) => ({
        experience: {
          $gte: obj.gt,
          $lte: obj.lt,
        },
      }));

      filters.push({ $or: modifiedExp });
    }
    if (availability) {
      filters.push({ subSpecialization: { $in: symptoms } });
    }

    if (fees) {
      const modifiedExp = fees.map((obj) => ({
        publishedFee: {
          $gte: obj.gt,
          $lte: obj.lt,
        },
      }));

      filters.push({ $or: modifiedExp });
    }
    if (gender) {
      filters.push({ gender: { $in: gender } });
    }
    if (language) {
      filters.push({ language: { $in: language } });
    }

    const query = filters.length > 0 ? { $and: filters } : {};
    const offset = (page1 - 1) * rowsPerPage1; // Calculation for offset
    const selectFields = {
      _id: 1,
      name: 1,
      qualifications: 1,
      specialization: 1,
      publishedFee: 1,
      profileImage: 1,
      status: 1,
      doctorType: 1,
      experience: 1,
      gender: 1,
      rating: 1,
      category: 1,
    };

    const doctorlist = await doctorModel.aggregate([
      { $match: query },
      { $project: selectFields },
      {
        $lookup: {
          from: "appointments",
          let: { dId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$doctorId", "$$dId"] },
                status: "complete",
              },
            },
            { $count: "total" },
          ],
          as: "appointmentCount",
        },
      },
      {
        $lookup: {
          from: "ratings",
          let: { dId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$doctorId", "$$dId"] },
              },
            },
            { $count: "totle" },
          ],
          as: "reviewerCount",
        },
      },

      { $sort: sortData },
      { $skip: offset },
      { $limit: rowsPerPage1 },
    ]);

    const cnt = await doctorModel
      .find(query)
      .sort({ createdAt: "asc" })
      .count();

    let doctortCnt = Math.ceil(cnt / rowsPerPage1);
    const activeDoctorList = {
      doctorList: doctorlist,
      pageNumber: page1,
      rowsPerPage: rowsPerPage1,
      totalElement: cnt,
      totalNoOfPages: doctortCnt,
    };

    return res
      .status(200)
      .send(
        ResponceAPI(
          true,
          "Active Doctor List",
          activeDoctorList,
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

const blockDoctor = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;

    const userDetails = await doctorModel.findOne({ _id: doctorId });

    if (!userDetails) {
      return res
        .status(400)
        .send(ResponceAPI(false, null, null, 400, "Doctor not exist", version));
    } else {
      const updateData = await doctorModel.updateOne(
        { _id: doctorId },
        { $set: { isBlocked: !userDetails.isBlocked } }
      );
      const doctorData = await doctorModel.findOne({ _id: doctorId });
      if (doctorData.isBlocked) {
        return res
          .status(200)
          .send(
            ResponceAPI(
              true,
              "blocked successfully",
              updateData,
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
              true,
              "Unblocked successfully",
              updateData,
              null,
              null,
              version
            )
          );
      }
    }
  } catch (error) {
    ApiError(error, "blockUser");
    return res
      .status(500)
      .send(
        ResponceAPI(false, "server error", null, 500, error.message, version)
      );
  }
};

module.exports = {
  getDoctorById,
  getDoctorList,
  createDoctor,
  deleteDoctorById,
  editDoctorById,
  addQualification,
  getQualificationList,
  blockDoctor,
};
