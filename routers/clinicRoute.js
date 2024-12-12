const clinicRoute= require("express").Router();

const partnerController=require("../controllers/partnerController")
const {authentication,createRoleAuth,editRoleAuth,getRoleAuth,deleteRoleAuth,Authorization}=require("../middleware/auth")


clinicRoute.post("/RegisterClinic",createRoleAuth,partnerController.signUpPartner);
 clinicRoute.get("/ListClinics",partnerController.allPartnerList);
 clinicRoute.get("/list/active",authentication,partnerController.activePartnerList);
clinicRoute.get("/GetClinicDetails/:clinicId",getRoleAuth,partnerController.getPartnerById);
clinicRoute.put("/BlockClinic/:clinicId",Authorization,partnerController.blockClinic);


clinicRoute.put("/EditClinic/:clinicId",editRoleAuth,partnerController.editPartnerById);


 clinicRoute.delete("/DeleteClinic/:partnerId",deleteRoleAuth,partnerController.deletePartnerById);

module.exports= clinicRoute;

