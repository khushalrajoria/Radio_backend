const utilRouter = require("express").Router();

const  utilController= require('../controllers/utilController');
const {authentication,createRoleAuth,editRoleAuth,getRoleAuth,deleteRoleAuth,Authorization}=require("../middleware/auth")

utilRouter.post("/languages",utilController.createLanguages);
utilRouter.get("/languages",utilController.getLanguages);
utilRouter.post("/lab/test/sample",utilController.createLabTestSampleName);
utilRouter.get("/lab/test/sample",utilController.getLabTestSampleNameList);
utilRouter.post("/payment/web/hook",utilController.razorpayPaymentWebhook);
module.exports=utilRouter;