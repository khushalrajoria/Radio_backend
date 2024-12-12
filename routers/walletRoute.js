const Walletrouter = require("express").Router();

const  walletController= require('../controllers/walletController');
const {authentication,createRoleAuth,editRoleAuth,getRoleAuth,deleteRoleAuth,Authorization}=require("../middleware/auth")

//Admin
Walletrouter.post("/web/point",walletController.addOrMinWalletPoints);
Walletrouter.get("/web/get/account/:patientId",getRoleAuth,walletController.walletAccount);
Walletrouter.get("/fetch/transaction/:patientId",getRoleAuth,walletController.walletTransaction);

//mobile
Walletrouter.get("/get/account/",Authorization,walletController.walletAccountForMobile);
Walletrouter.get("/get/account/:patientId",Authorization,walletController.walletAccount);
Walletrouter.get("/mob/fetch/transaction",Authorization,walletController.walletTransactionForMobile);

module.exports=Walletrouter;