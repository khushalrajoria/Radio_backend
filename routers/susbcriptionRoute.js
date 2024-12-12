const subscriptionRoute = require("express").Router();

const subscriptionController= require('../controllers/subscriptionController');

const {getRoleAuth,Authorization}=require("../middleware/auth")

subscriptionRoute.post('/takeSubscription',subscriptionController.createAndUpdateSubscription);
subscriptionRoute.get('/active/:patientId', getRoleAuth, subscriptionController.activePlanList);
subscriptionRoute.get('/list', subscriptionController.listOfSuncriptions);
subscriptionRoute.get('/get/:subscriptionId', subscriptionController.viewSubcriptionsById
);


//mobile
subscriptionRoute.post('/mob/take/Subscription',Authorization,subscriptionController.createAndUpdateSubscription);

module.exports = subscriptionRoute;
