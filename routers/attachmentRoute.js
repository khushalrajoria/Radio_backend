const attachmentRoute = require('express').Router();

const attachmentController=require("../controllers/attachmentController")

const {createRoleAuth,editRoleAuth,getRoleAuth,deleteRoleAuth}=require("../middleware/auth")

attachmentRoute.post('/addAttachment',createRoleAuth,attachmentController.addAttachemnt)
attachmentRoute.get('/getAttachmentByCaseType',getRoleAuth,attachmentController.getAttachmentByCaseId)
attachmentRoute.put('/editAttachment/:attachmentId',editRoleAuth,attachmentController.editAttachment);
attachmentRoute.delete('/deleteAttachment/:attachmentId',deleteRoleAuth,attachmentController.deleteAttachmentById)
attachmentRoute.get('/attachmentList',getRoleAuth,attachmentController.listAttachments)

module.exports = attachmentRoute