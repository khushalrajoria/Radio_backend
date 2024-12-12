
const Otp = require('../models/otp');
const Errorlog = require('../models/errorlogDetails');


function ApiError(err,api){
    // console.log(api)
     const Data = new Errorlog({
        Error_message:err,
        Added_on: new Date(),
        EndPoint_Name:api
     });
     Data.save();
  };

  module.exports = ApiError;
