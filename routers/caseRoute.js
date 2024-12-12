const caseRoute= require("express").Router();

const caseController=require("../controllers/caseController")
const {createRoleAuth,editRoleAuth,getRoleAuth,deleteRoleAuth}=require("../middleware/auth")

caseRoute.post('/RegisterCase',createRoleAuth,caseController.registerCase)
caseRoute.put('/EditRegisteredCase/:caseId',editRoleAuth,caseController.editRegisteredCase)
caseRoute.get('/ListCases',getRoleAuth,caseController.listCases)
caseRoute.get('/GetSingleCase/:caseId',getRoleAuth,caseController.getSingleCase)
caseRoute.delete("/DeleteSingleCase/:caseId",deleteRoleAuth,caseController.deleteSingleCase)
module.exports= caseRoute;