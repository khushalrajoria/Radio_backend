const doctorRoute = require("express").Router();
const doctorController=require("../controllers/docterController")
const {authentication,createRoleAuth,editRoleAuth,getRoleAuth,deleteRoleAuth,Authorization}=require("../middleware/auth")


doctorRoute.post("/RegisterDoctor",createRoleAuth,doctorController.createDoctor)
doctorRoute.get("/ListDoctors",getRoleAuth,doctorController.getDoctorList)



 doctorRoute.delete("/DeleteDoctor/:doctorId",deleteRoleAuth,doctorController.deleteDoctorById)
 doctorRoute.put("/EditDoctor/:doctorId",editRoleAuth,doctorController.editDoctorById)
 doctorRoute.put("/BlockDoctor/:doctorId",Authorization,doctorController.blockDoctor);


doctorRoute.post("/AddQualification",createRoleAuth,doctorController.addQualification);
doctorRoute.get("/QualificationList",authentication,doctorController.getQualificationList);


doctorRoute.get("/GetDoctorDetails/:doctorId",doctorController.getDoctorById)




module.exports= doctorRoute;