const attachmentModel = require("../models/Attachments");
const { ResponceAPI } = require("../utils/ResponceAPI");

const version = process.env.API_VERSION;

const addAttachemnt = async (req, res) => {
  try {
    const { caseType, documentName } = req.body;
    const attachment = await attachmentModel.findOne({
      caseType: caseType,
      documentName: documentName,
    });

    if (attachment) {
      return res
        .status(400)
        .send(
          ResponceAPI(
            false,
            null,
            attachment,
            409,
            "Attachment already exists",
            version
          )
        );
    }

    const data = {
      ...req.body,
    };

    const attachmentData = await attachmentModel.create(data);
    return res
      .status(201)
      .send(
        ResponceAPI(
          true,
          "Attachment created successfully",
          attachmentData,
          null,
          null,
          version
        )
      );
  } catch (error) {
    console.error("Error in addAttachemnt:", error);

    return res
      .status(500)
      .send(
        ResponceAPI(false, null, error.message, 500, "Server error", version)
      );
  }
};

const editAttachment = async (req, res) => {
  try {
    const attachmentId = req.params.attachmentId;
    const data = {
      ...req.body,
    };
    const attachmentData = await attachmentModel.findById(
      { _id: attachmentId },
      data,
      { new: true }
    );
    if (!attachmentData) {
      return res
        .status(404)
        .send(
          ResponceAPI(
            false,
            null,
            null,
            404,
            "Attachment does not exist",
            version
          )
        );
    }
    return res
      .status(201)
      .send(
        ResponceAPI(
          true,
          "Attachment updated Successfully ",
          attachmentData,
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

const listAttachments = async (req, res) => {
  try {
    const attachmentData = await attachmentModel.find({ isDeleted: false });
    return res
      .status(200)
      .send(
        ResponceAPI(
          true,
          "Attachment List ",
          attachmentData,
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
const getAttachmentByCaseId = async (req, res) => {
  try {
    const caseTypeArray = req.body.caseType;

    const attachmentdata = await attachmentModel.find({
      caseType: { $in: caseTypeArray },
      isDeleted: false,
    });
    if (!attachmentdata) {
      return res
        .status(400)
        .send(
          ResponceAPI(
            fasle,
            null,
            null,
            409,
            "No Attachment Registered For This Case",
            version
          )
        );
    }
    const uniqueCaseTypes = new Set(attachmentdata.map((item) => item));

    return res
      .status(200)
      .send(
        ResponceAPI(
          true,
          "Attachment List",
          [...uniqueCaseTypes],
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

const deleteAttachmentById = async (req, res) => {
  try {
    const attachmentId = req.params.attachmentId;
    const attachmentdata = await attachmentModel.findOneAndUpdate(
      { _id: attachmentId },
      { isDeleted: true }
    );
    if (!attachmentdata) {
      return res
        .status(400)
        .send(
          ResponceAPI(false, null, null, 409, "Invalid Attachement Id", version)
        );
    }
    return res
      .status(201)
      .send(
        ResponceAPI(
          true,
          "Attachment Deleted Successfully ",
          attachmentdata,
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

module.exports = {
  addAttachemnt,
  editAttachment,
  getAttachmentByCaseId,
  deleteAttachmentById,
  listAttachments,
};
