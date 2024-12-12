const specializationRoute= require("express").Router();

const specializationController=require("../controllers/specializationController")
const {authentication,createRoleAuth}=require("../middleware/auth")

specializationRoute.post('/AddSpecialization',createRoleAuth,specializationController.addSpecialization);
specializationRoute.post('/AddSubSpecialization',createRoleAuth,specializationController.addSubspecialization);

specializationRoute.get('/specializationList',authentication,specializationController.specializationList);
specializationRoute.get('/SubspecializationList',authentication,specializationController.SubspecializationList);
module.exports = specializationRoute;