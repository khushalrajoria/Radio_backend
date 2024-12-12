


function ResponceAPI(status,message,data,error_code,error_message,version){
   return {
    status,message,data,error_code,error_message,version
   }
}

module.exports={ResponceAPI}