const express=require("express")
const route=express();
const permissionRoute=require("./permissionRoute")
const userRoute=require("../routers/userRoute")
const doctorRoute=require("../routers/doctorRoute")
const patientRoute= require("../routers/patientRoute");
const clinicRoute=require('../routers/clinicRoute')
const caseRoute = require('../routers/caseRoute')
const attachmentRoute = require('../routers/attachmentRoute');
const specializationSymptomRoute = require('../routers/specializationSymptomRoute');
const notificationRoute=require('../routers/notificationRoute')
const pdfRouter=require('../routers/pdfRoute')
const uploadImageRouter = require("./uploadImage")

// route.use('/pay',paymentRoute);
route.use("/role",permissionRoute)
route.use("/user",userRoute)
route.use("/doctor",doctorRoute)
route.use("/patient",patientRoute);
route.use("/clinic",clinicRoute);
route.use("/case",caseRoute);
route.use("/attachment",attachmentRoute);
// route.use("/appointment",appointmentRoute);
route.use("/specialization",specializationSymptomRoute);
route.use('/notification', notificationRoute);
// route.use('/util', utiilRoute);
route.use('/pdf', pdfRouter);
route.use("/image", uploadImageRouter);



module.exports=route