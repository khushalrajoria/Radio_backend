const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Attachments = new Schema({
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
});
const SubspecializationSchema = new Schema(
  {
    Subspecialization: {
      type: String,
      unique: true,
    },
    attachments: {
      type: [Attachments],
    },
    remarkRequired: {
      type: Boolean,
      defaut: false,
    },
  },
  {
    timestamps: true,
  }
);

const Subspecialization = mongoose.model(
  "subspecialization",
  SubspecializationSchema
);

module.exports = Subspecialization;
