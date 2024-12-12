const productOrderRoute = require("express").Router();

const productOrderController= require('../controllers/productOrderController');

const {authentication,createRoleAuth,editRoleAuth,getRoleAuth,deleteRoleAuth,Authorization}=require("../middleware/auth")


 productOrderRoute.get('/web/list', productOrderController.getProductOrderList);
 productOrderRoute.get('/web/get/:orderId', productOrderController.getProductOrderbyOrderId);


//mobile
productOrderRoute.post('/mob/create',productOrderController.createOrder);
productOrderRoute.post('/mob/payment/verify', productOrderController.paymentVerifyProductOrder);
productOrderRoute.get('/mob/list/:patientId', productOrderController.getProductOrderListbyPatientId);
productOrderRoute.get('/mob/get/:orderId/:patientId', productOrderController.getProductOrderbyOrderIdAndPatientId);
productOrderRoute.put('/mob/cancel', productOrderController.cancelOrder);


//woocommerce
productOrderRoute.post('/webhook/create', productOrderController.createOrderWebhook);
productOrderRoute.post('/webhook/update', productOrderController.updateOrderWebhook);


module.exports = productOrderRoute;
