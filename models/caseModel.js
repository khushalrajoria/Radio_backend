const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AttachmentSchema = new Schema({
  documentName: {
    type: String,
    required: true,
  },
  documentUrl: {
    type: String,
    required: true,
  },
  HeaderID: {
    type: String,
  },
});

const CaseTypeSchema = new Schema({
  subSpecialization: {
    type: String,
    required: true,
  },
  attachments: {
    type: [AttachmentSchema],
    default: [],
  },
  remark: {
    type: String,
  },
});

const CaseSchema = new Schema(
  {
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "partner",
    },
    ReferenceNo: {
      type: String,
    },
    Date: {
      type: String,
    },
    ExpectedDispatchDate: {
      type: String,
    },
   
    CaseTypes: {
      type: [CaseTypeSchema],
      default: [],
    },
    PatientRefID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "patientDetail",
      required: true,
    },
    isDoctorAssigned: {
      type: Boolean,
      default: false,
    },
    doctorId: {
      type: String,
      default: "",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "New",
      enum: [
        "New",
        "SendForReportGeneration",
        "Accepted",
        "InProgress",
        "SendForApproval",
        "Rejected",
        "Generated",
        "Deleted",
      ],
    },
    AddedBy: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("case", CaseSchema);
