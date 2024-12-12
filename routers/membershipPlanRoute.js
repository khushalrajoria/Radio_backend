const membershipRoute = require("express").Router();
const membershipController= require('../controllers/membershipPlanController');

const {authentication,createRoleAuth,editRoleAuth,getRoleAuth,deleteRoleAuth}=require("../middleware/auth")


membershipRoute.post('/create',createRoleAuth,membershipController.createPlan);
membershipRoute.get('/list',authentication, membershipController.getPlan);
membershipRoute.put('/edit/:planId',editRoleAuth, membershipController.editPlan);
membershipRoute.delete('/delete/:planId',deleteRoleAuth, membershipController.deletePlan);
membershipRoute.get('/activePlan', authentication, membershipController.activePlan);
membershipRoute.get('/planById/:planId',getRoleAuth, membershipController.planById);
membershipRoute.put("/changeStatus/:id/:status",editRoleAuth,membershipController.changeStatus);


//mobile
membershipRoute.get('/mob/active/plan', membershipController.activePlan);

module.exports=membershipRoute;