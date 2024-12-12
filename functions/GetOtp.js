const { json } = require("express");
const otp = require('../models/otp');
const OtpGenerator = require('otp-generator');
const OTP_CONFIG =  { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false,digits:true } ;

//get otp function
async function getotp(Mobile) {
  console.log('mobile',Mobile)
  let NewOTP = OtpGenerator.generate(6,OTP_CONFIG);
		let url= `http://cloud.smsindiahub.in/api/mt/SendSMS?DCS=0&flashsms=0&user=ediquesolutions&password=Sms@45678&senderid=BMCATT&channel=Trans&number=91${Mobile}&text=Your OTP for registration on Artifie Lite is ${NewOTP}. Please do not share your OTP with anyone.&DLTTemplateId=1001234025109537915##&route=##&PEId=##`;
    const response = await fetch(url);

		const result = await response.json();
    if (result.ErrorCode == "000") {
			let data = await otp.create({
         mobile:Mobile,
				 Otp: NewOTP
			});
      console.log("otp is",data.Otp);
      return data;
    }else
    {
      return null;
    }
};


  
module.exports = getotp;