const permissionModel=require("../models/rolesAndPermissions")
const roleModel=require("../models/roleTB")
const {ResponceAPI}=require("../utils/ResponceAPI")

const createpermission=async (req,res)=>{
    try{
     const{roleID,permission,create_data,read_data,update_data,delete_data}=req.body
     
     if(!roleID || !permission || !create_data || !read_data || !update_data || !delete_data){
      console.log("hii")
        return res.status(400).send({"message":"something went wrong"})
     }

    const existPermission= await permissionModel.findOne({$and: [ { permission:permission}, { roleID:roleID } ]})


    if(!existPermission){
        const permissionData=await permissionModel.create(req.body)
        return  res.status(200).send(ResponceAPI(true,"Permission is create successfully",permissionData,null,null,req.originalurl))
    }else{
       
        const permissionData=await permissionModel.findByIdAndUpdate(existPermission.id,req.body,{new: true})
      return  res.status(200).send(ResponceAPI(true,"Permission is update successfully",permissionData,null,null,req.originalurl))
    }
    }catch(error){
       return res.status(500).send({"error":error.message})
    }

}



//jatin
const fetchpemissionList=async (req,res)=>{
  try{

  const listOfPermissions=await permissionModel.find().populate('roleID');
  return res.status(200).send({"data":listOfPermissions})
  }catch(error){
    return res.status(500).send({"error":error.message})
  }
}

//jatin
const createRole=async (req,res)=>{
  try{
   const{role,position}=req.body
   
   if(!role || !position){
      return res.status(400).send({"message":"something went wrong"})
   }

  const existRole= await roleModel.findOne({$and: [ { position:position}, { role:role } ]})


  if(!existRole){
      const roleData=await roleModel.create(req.body)
      return  res.status(201).send(ResponceAPI(true,"Role is create successfully",roleData,201,null,req.originalUrl))
  }else{
     
      const roleData=await roleModel.findByIdAndUpdate(existRole.id,req.body,{new: true})
      return  res.status(200).send(ResponceAPI(true,"Role is update successfully",roleData,200,null,req.originalUrl))
  }
  }catch(error){
     return res.status(500).send({"error":error.message})
  }

}
//jatin
const fetchRoleList=async (req,res)=>{
  try{
  //   let token="dRYLZOFnTom2Qqzx6CkgNu:APA91bGSA-DjfsnF4On_L8-3csbnLtTqOYS_y5ZJ0pOkc97sXiTCNrcTcvmOdscYDWw9wwmVfb0qXgF7rnQHw3QFoWACfYA-oHfHTennrf3iKwxIIGDxCX-oQQE4TIgrhp5yhWChfjc4"
  const listOfRoles=await roleModel.find();
  return res.status(200).send({"data":listOfRoles})
  }catch(error){
    return res.status(500).send({"error":error.message})
  }
}


const getpermissionListByID=async (req,res)=>{
  try{
    const {roleID}=req.params
  const listOfPremission=await permissionModel.find({roleID:roleID});
  return  res.status(200).send(ResponceAPI(true,"List of Permission by role Id",listOfPremission,null,null,req.originalurl))
  }catch(error){
    return res.status(500).send({"error":error.message})
  }
}




module.exports={createpermission,createRole,fetchRoleList,fetchpemissionList,getpermissionListByID}