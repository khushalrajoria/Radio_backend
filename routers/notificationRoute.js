const notificationRoute= require("express").Router();

const notificationController=require("../controllers/notificationController")
const {editRoleAuth,getRoleAuth,Authorization}=require("../middleware/auth")


notificationRoute.post("/create",notificationController.createNotifications);
notificationRoute.get("/list",getRoleAuth,notificationController.getNotificationsbyId);
notificationRoute.put("/view/:notificationId",editRoleAuth,notificationController.viewsNotifications);
notificationRoute.put("/view/all",editRoleAuth,notificationController.dismissAllNotifications);

//mobile

notificationRoute.get("/mob/list",Authorization,notificationController.getNotificationsbyIdForMobile);
//notificationRoute.put("/view/:notificationId",editRoleAuth,notificationController.viewsNotifications);


module.exports= notificationRoute;

