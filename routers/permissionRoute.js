const express=require("express")
const permissionRoute=express.Router();
const permissionController=require("../controllers/permissionController")

permissionRoute.post("/permission",permissionController.createpermission)
permissionRoute.get("/permission",permissionController.fetchpemissionList)
permissionRoute.post("/create",permissionController.createRole)
permissionRoute.get("/list",permissionController.fetchRoleList)
permissionRoute.get("/list/permission/:roleID",permissionController.getpermissionListByID)

permissionRoute.get("/list", (req, res) => {
    res.send(data);
  });
permissionRoute.post("/create", (req, res) => {
    res.send(data);
  });

module.exports=permissionRoute 