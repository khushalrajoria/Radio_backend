const jwt=require("jsonwebtoken")
const userModel=require("../models/userTB")
const roleAndPermissionModel=require("../models/rolesAndPermissions")
const clinicModel=require("../models/clinic")
const doctorModel = require("../models/doctorModel")
const version = process.env.API_VERSION
const { ResponceAPI } = require("../utils/ResponceAPI")
const patientModel = require('../models/patientDetail');
const ApiError = require('../functions/ApiError');

const authentication=async (req,res,next)=>{
    try{
        const bearertoken=req.headers["authorization"]
     
        if(!bearertoken){
            return res.status(401).send(ResponceAPI(false, null, null, 401, "Token is missing in request body.", version))
        }
    
      const token =bearertoken.split(" ")[1]
     
       let tokenData=null

        jwt.verify(token,process.env.SECRET_TOKEN_KEY,(err,tkn)=>{
          if(err){
             // return res.status(401).send({"error":"invalid token"})
              return res.status(401).send(ResponceAPI(false, null, null, 401, "invalid token", version))
          }
          req.userID=tkn._id
          req.token=token
          next();
           
        })
         

    }catch(error){
      return res.status(500).send(ResponceAPI(false, "server", null, 500, error.message, version))
}
}
//jatin
const createRoleAuth=async (req,res,next)=>{
  try{
      const bearertoken=req.headers["authorization"]
      //console.log("bearertoken"    +bearertoken)
      if(!bearertoken){
        return res.status(401).send(ResponceAPI(false, null, null, 401, "invalid request", version))
      }
    const token =bearertoken.split(" ")[1]
      
     let tokenData=null
       jwt.verify(token,process.env.SECRET_TOKEN_KEY,(err,tkn)=>{
        if(err){
          return res.status(401).send(ResponceAPI(false, null, null, 401, "invalid token", version))
        }else{
        tokenData=tkn
        }
      })
        if(!tokenData){
          return res.status(401).send(ResponceAPI(false, null, null, 401, "invalid token", version))
        }
      let userData=null
      const userData1= await userModel.findOne({_id:tokenData._id}).populate("roleID") 
      if(userData1){
        userData=userData1
      }
      const partnerData=await clinicModel.findOne({_id:tokenData._id}).populate("roleID")  
      if(partnerData){
        userData=partnerData
      }                            
      if(!userData){
        return res.status(401).send(ResponceAPI(false, null, null, 401, "invalid user", version))
        }
      const url= req.originalUrl.split("/")[2]
      //console.log("url",url)
      const permissionRequest=await roleAndPermissionModel.findOne({$and:[{permission:url},{roleID:userData.roleID._id}]})
       console.log("permissionRequest"+permissionRequest)
      if(!permissionRequest){

          return res.status(401).send(ResponceAPI(false, null, null, 401, "unauthorized access", version))
        }
       if(permissionRequest.create_data==false){
       // return res.status(401).send({"message":"access denied !"})
        return res.status(401).send(ResponceAPI(false, null, null, 401, "access denied !", version))
       }
      req.user_id=userData._id

      next();
  }catch(error){
    return res.status(500).send(ResponceAPI(false, "server", null, 500, error.message, version))
  }
}

const editRoleAuth=async (req,res,next)=>{
  try{
      const bearertoken=req.headers["authorization"]
     // console.log("bearertoken"    +bearertoken)
      if(!bearertoken){
        return res.status(401).send(ResponceAPI(false, null, null, 401, "invalid request", version))
      }
    const token =bearertoken.split(" ")[1]
      
     let tokenData=null
       jwt.verify(token,process.env.SECRET_TOKEN_KEY,(err,tkn)=>{
        if(err){
          return res.status(401).send(ResponceAPI(false, null, null, 401, "invalid token", version))
        }else{
        tokenData=tkn
        }
      })
        if(!tokenData){
          return res.status(401).send(ResponceAPI(false, null, null, 401, "invalid token", version))
        }
    
        let userData=null
        const userData1= await userModel.findOne({_id:tokenData._id}).populate("roleID") 
        if(userData1){
          userData=userData1
        }
        const partnerData=await clinicModel.findOne({_id:tokenData._id}).populate("roleID")  
        if(partnerData){
          userData=partnerData
        }                              
      if(!userData){
        return res.status(401).send(ResponceAPI(false, null, null, 401, "invalid user", version))
        }
      const url= req.originalUrl.split("/")[2]
    
      const permissionRequest=await roleAndPermissionModel.findOne({$and:[{permission:url},{roleID:userData.roleID._id}]})
      
      if(!permissionRequest){
          //return res.status(401).send({"message":"unauthorized access"})
          return res.status(401).send(ResponceAPI(false, null, null, 401, "unauthorized access!", version))
        }
       if(permissionRequest.update_data==false){
        return res.status(401).send(ResponceAPI(false, null, null, 401, "access denied !", version))
       }
      //  const {userId}=req.params
      //  if(userId){
      //   if(userId==userData._id){
      //     return res.status(401).send(ResponceAPI(false, null, null, 401, "access denied !", version)) 
      //   }
      //  }
      req.user_id=userData._id
      req.role_id=userData.roleID._id

      next();
  }catch(error){
    return res.status(500).send(ResponceAPI(false, "server", null, 500, error.message, version))
  }
};


// const getRoleAuth=async (req,res,next)=>{
//   try{
//       const bearertoken=req.headers["authorization"]
     
//       if(!bearertoken){
//         return res.status(401).send(ResponceAPI(false, null, null, 401, "invalid request", version))
//       }
//     const token =bearertoken.split(" ")[1]
      
//      let tokenData=null
//       jwt.verify(token,process.env.SECRET_TOKEN_KEY,(err,tkn)=>{
//         if(err){
//           return res.status(401).send(ResponceAPI(false, null, null, 401, "invalid token", version))
//         }else{
//         tokenData=tkn
//         }
//       })
//         if(!tokenData){
//           return res.status(401).send(ResponceAPI(false, null, null, 401, "invalid token", version))
//         }
    
//         let userData=null
//         const userData1= await userModel.findOne({_id:tokenData._id}).populate("roleID") 
//         if(userData1){
//           userData=userData1
//         }
//         const partnerData=await partnerModel.findOne({_id:tokenData._id}).populate("roleID")  
//         if(partnerData){
//           userData=partnerData
//         }                                
//       if(!userData){
//         return res.status(401).send(ResponceAPI(false, null, null, 401, "invalid user", version))
//         }
//       const url= req.originalUrl.split("/")[2]
    
//       const permissionRequest=await roleAndPermissionModel.findOne({$and:[{permission:url},{roleID:userData.roleID._id}]})

//       if(!permissionRequest){
//         return res.status(401).send(ResponceAPI(false, null, null, 401, "unauthorized access!", version))
//         }
//       if(permissionRequest.read_data==false){
//         return res.status(401).send(ResponceAPI(false, null, null, 401, "access denied !", version))
//       }
//       req.user_id=userData._id
//       req.role_id=userData.roleID._id

//       next();
//   }catch(error){
//   return res.status(500).send(ResponceAPI(false, "server", null, 500, error.message, version))
//   }
// }
const getRoleAuth=async (req,res,next)=>{
  try{
      const bearertoken=req.headers["authorization"]
     
      if(!bearertoken){
        return res.status(401).send(ResponceAPI(false, null, null, 401, "invalid request", version))
      }
    const token =bearertoken.split(" ")[1]
      
     let tokenData=null
       jwt.verify(token,process.env.SECRET_TOKEN_KEY,(err,tkn)=>{
        if(err){
          return res.status(401).send(ResponceAPI(false, null, null, 401, "invalid token", version))
        }else{
        tokenData=tkn
        }
      })
        if(!tokenData){
          return res.status(401).send(ResponceAPI(false, null, null, 401, "invalid token", version))
        }
    
        let userData=null
        const userData1= await userModel.findOne({_id:tokenData._id}).populate("roleID") 
        if(userData1){
          userData=userData1
        }
        const partnerData=await clinicModel.findOne({_id:tokenData._id}).populate("roleID")  
        if(partnerData){
          userData=partnerData
        }  
        const doctorData=await doctorModel.findOne({_id:tokenData._id}).populate("roleID")  
        if(doctorData){
          userData=doctorData
        } 
      if(!userData){
        return res.status(401).send(ResponceAPI(false, null, null, 401, "invalid user", version))
        }
      const url= req.originalUrl.split("/")[2]
    
      const permissionRequest=await roleAndPermissionModel.findOne({$and:[{permission:url},{roleID:userData.roleID._id}]})

      if(!permissionRequest){
        return res.status(401).send(ResponceAPI(false, null, null, 401, "unauthorized access!", version))
        }
       if(permissionRequest.read_data==false){
        return res.status(401).send(ResponceAPI(false, null, null, 401, "access denied !", version))
       }
      req.user_id=userData._id
      req.role_id=userData.roleID._id

      next();
  }catch(error){
   return res.status(500).send(ResponceAPI(false, "server", null, 500, error.message, version))
  }
}
const deleteRoleAuth=async (req,res,next)=>{
  try{
      const bearertoken=req.headers["authorization"]
     // console.log("bearertoken"    +bearertoken)
      if(!bearertoken){
        return res.status(401).send(ResponceAPI(false, null, null, 401, "invalid request", version))
      }
    const token =bearertoken.split(" ")[1]
      
     let tokenData=null
       jwt.verify(token,process.env.SECRET_TOKEN_KEY,(err,tkn)=>{
        if(err){
          return res.status(401).send(ResponceAPI(false, null, null, 401, "invalid token", version))
        }else{
        tokenData=tkn
        }
      })
        if(!tokenData){
          return res.status(401).send(ResponceAPI(false, null, null, 401, "invalid token", version))
        }
    
        let userData=null
        const userData1= await userModel.findOne({_id:tokenData._id}).populate("roleID") 
        if(userData1){
          userData=userData1
        }
        const partnerData=await clinicModel.findOne({_id:tokenData._id}).populate("roleID")  
        if(partnerData){
          userData=partnerData
        }
        const doctorData = await doctorModel.findOne({_id:tokenData._id}).populate("roleID")
        if(doctorData){
          userData = doctorData
        }                               
       if(!userData){
         return res.status(401).send(ResponceAPI(false, null, null, 401, "invalid user", version))
        }
      const url= req.originalUrl.split("/")[2]
      const permissionRequest=await roleAndPermissionModel.findOne({$and:[{permission:url},{roleID:userData.roleID._id}]})
      if(!permissionRequest){
        return res.status(401).send(ResponceAPI(false, null, null, 401, "unauthorized access!", version))
        }
       if(permissionRequest.delete_data==false){
        return res.status(401).send(ResponceAPI(false, null, null, 401, "access denied !", version))
       }

      //  const {userId}=req.params
      //  if(userId){
      //   if(userId==userData._id){
      //     return res.status(401).send(ResponceAPI(false, null, null, 401, "access denied !", version)) 
      //   }
      //  }
      req.user_id=userData._id
      req.role_id=userData.roleID._id
      
      next();
  }catch(error){
    return res.status(500).send(ResponceAPI(false, "server", null, 500, error.message, version))
  }
};


// Authorization for patient
const Authorization = async (req, res, next) => {
  try {
    const bearertoken=req.headers["authorization"]
    if(!bearertoken){
        return res.status(404).send(ResponceAPI(false, null, null, 401, "request is invalid", version))
    }
    const token =bearertoken.split(" ")[1]
     
    // let tokenData=null

     jwt.verify(token,process.env.SECRET_TOKEN_KEY, async(err,tkn)=>{
       if(err){  
           return res.status(401).send(ResponceAPI(false, null, null, 401, "invalid token", version))
       }else{
        console.log(tkn)
        const userDetail = await userModel.findOne({ _id: tkn._id });
        if (!userDetail) {
        return res
          .status(401)
          .json({ success: false, message: 'Invalid user.' });
      }
       
      next();
       }  
    })

  } catch (err) {
    ApiError(err, "Patient Authorization");
    res.status(500).send(ResponceAPI(false, "server", null, 500, err.message, version))
  }
};
// const Authorization = async (req, res, next) => {
//   try {
//     const bearertoken=req.headers["authorization"]
//     if(!bearertoken){
//         return res.status(404).send(ResponceAPI(false, null, null, 401, "request is invalid", version))
//     }
//     const token =bearertoken.split(" ")[1]
     
//     // let tokenData=null

//      jwt.verify(token,process.env.SECRET_TOKEN_KEY, async(err,tkn)=>{
//       if(err){  
//           return res.status(401).send(ResponceAPI(false, null, null, 401, "invalid token", version))
//       }else{
//         console.log(tkn)
//         const clinicDetail = await clinicModel.findOne({ _id: tkn._id });
//         if (!clinicDetail) {
//         return res
//           .status(401)
//           .json({ success: false, message: 'Invalid user.' });
//       }
       
//       next();
//       }  
//     })

//   } catch (err) {
//     ApiError(err, "Patient Authorization");
//     res.status(500).send(ResponceAPI(false, "server", null, 500, err.message, version))
//   }
// };
module.exports={authentication,createRoleAuth,editRoleAuth,getRoleAuth,deleteRoleAuth,Authorization}