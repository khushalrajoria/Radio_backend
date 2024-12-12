const userRoute = require("express").Router();
const userController=require("../controllers/userController")
const {authentication,editRoleAuth,deleteRoleAuth,Authorization}=require("../middleware/auth")



 userRoute.post("/RegisterEmployee",userController.createUser)
 userRoute.post("/Login", userController.loginUser);
  userRoute.delete("/DeleteEmployee/:userId",deleteRoleAuth,userController.deleteUser)
 userRoute.put("/BlockUser/:userId",Authorization,userController.blockUser)
 userRoute.get("/ListEmployees",authentication,userController.fetchUserList)
userRoute.get("/fetch",authentication,userController.getSingleUser)
userRoute.put("/EditUser/:userId",editRoleAuth,userController.updateUser)
userRoute.get("/GetEmployeeDetails/:userId"/*getRoleAuth*/,userController.getUser);
userRoute.post("/ForgetPassword",userController.forgotPassword);
userRoute.post("/ResetPassword",userController.resetPassword);
userRoute.post("/UploadSingleFile",userController.uploadSingleFile);

 
module.exports= userRoute;