const transactionRoute = require("express").Router();

const transactionController= require('../controllers/transactionController');

const {authentication,createRoleAuth,editRoleAuth,getRoleAuth,deleteRoleAuth,Authorization}=require("../middleware/auth")

transactionRoute.get('/web/list',getRoleAuth,transactionController.fetchAllTransaction);
transactionRoute.get('/web/view/:transactionId',getRoleAuth,transactionController.viewTransactionById);



//mobile
transactionRoute.get('/mob/history/list/',Authorization,transactionController.fetchAllTransactionForMobile);



module.exports = transactionRoute;
