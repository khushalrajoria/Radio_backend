const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AttachmentSchema = new Schema(
  {
    caseType: {
      type: String,
      // ref:"subspecialization"
    },
    documentName: {
      type: String,
      required: true,
    },
    documentType: {
      type: String,
      required: true,
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const AttachmentModel = mongoose.model("attachment", AttachmentSchema);

module.exports = AttachmentModel;
