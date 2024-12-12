
const ApiError = require('../functions/ApiError');
const languageModel = require('../models/languageModel');
// const appointmentsModel = require('../models/appointmentsModel');
// const walletTransactionModel = require('../models/walletTransactionModel')
// const walletPointsModel = require('../models/walletPointsModel')
// const subscriptionModel = require("../models/subscriptionModel")
// const pathologyOrderModel = require('../models/pathologyOrderModel');
// const transactionModel = require('../models/transactionDetail');
// const labTestSampleNameModel = require('../models/labTestSampleNameModel');
const { ResponceAPI } = require("../utils/ResponceAPI");

const version = process.env.API_VERSION

const createLanguages = async (req, res) => {
  try {
    const languages = await languageModel.create(req.body)
    return res.status(201).send(ResponceAPI(true, "create languages successfully", languages, null, null, version));
  } catch (error) {
    ApiError(error, "create languages");
    return res.status(500).send(ResponceAPI(false, null, error.message, 500, "server error", version))
  }
};

const getLanguages = async (req, res) => {
  try {
    const languageList = await languageModel.find();
    return res.status(200).send(ResponceAPI(true, "language list successfully", languageList, null, null, version));
  } catch (error) {
    ApiError(error, "get language list");
    return res.status(500).send(ResponceAPI(false, null, error.message, 500, "server error", version));
  }
};

const createLabTestSampleName = async (req, res) => {
  try {
    const SampleName = await labTestSampleNameModel.create(req.body)
    return res.status(201).send(ResponceAPI(true, "create sample name successfully", SampleName, null, null, version));
  } catch (error) {
    ApiError(error, "create sample name");
    return res.status(500).send(ResponceAPI(false, null, error.message, 500, "server error", version))
  }
};

const getLabTestSampleNameList = async (req, res) => {
  try {
    const SampleNameList = await labTestSampleNameModel.find();
    return res.status(200).send(ResponceAPI(true, "Sample name list successfully", SampleNameList, null, null, version));
  } catch (error) {
    ApiError(error, "Sample name list");
    return res.status(500).send(ResponceAPI(false, null, error.message, 500, "server error", version));
  }
};



const razorpayPaymentWebhook = async (req, res) => {
  try {
    const hookData = req.body
    const entity = hookData.payload.payment.entity



    console.log({
      hookData:hookData,
      entity:hookData.payload.payment.entity
    })
    // pathology  order
    if (entity.notes.orderType == "pathology") {
      const pathologyOrderData = await pathologyOrderModel.findOne({ _id: hookData.payload.payment.entity.notes.orderId })

      if (!pathologyOrderData) {
        return res.status(200).send(ResponceAPI(false, null, null, 404, `Invalid order`, version))
      }


      if (pathologyOrderData.pathologyStatus == entity.status) {
        return res.status(200).send(ResponceAPI(false, null, null, 404, `same status`, version))
      }
      console.log(hookData.payload.payment.entity.status)

      if (entity.status == "failed") {
        if (pathologyOrderData.wallet) {
          const points = await walletPointsModel.findOne({ patientId: pathologyOrderData.patientId })
          await walletPointsModel.findOneAndUpdate({ patientId: pathologyOrderData.patientId }, { points: points.points + pathologyOrderData.wallet.applyPoints }, { new: true })
          const walletTransaction = await walletTransactionModel.create({
            transactionNumber: "",
            patientId: pathologyOrderData.patientId,
            patientMobile: pathologyOrderData.patientMobile,
            points: pathologyOrderData.wallet.applyPoints,
            transactionType: "credit",
            mode: "labtest",
            remark: pathologyOrderData.wallet.remark,
          })
        
        }
        const ids = Object.values(pathologyOrderData.transactions)
        const t1 = await transactionModel.updateMany({ _id: { $in: ids } }, { status: "failed", })
        const t2 = await transactionModel.findByIdAndUpdate({ _id: pathologyOrderData.transactions.gateway }, { status: "failed", paymentMode: entity.method, transactionGatewayId: entity.id, razorpayOrderId: entity.id }, { new: true })
        const history = pathologyOrderData.statusHistory
        history.push({
          "status": "failed",
          "dateAndTime": new Date()
        })


        const pathologyOrderdData = await pathologyOrderModel.findByIdAndUpdate({ _id: pathologyOrderData._id }, { isPayment: true, transactionGatewayId: null, statusHistory: history, pathologyStatus: "failed", adminStatus: "failed" }, { new: true })
        const log = { t1, t2, pathologyOrderdData }
        console.log(log)
        return res.status(200).send(ResponceAPI(true, "Order place failed", "failed", null, null, version))

      } else if (entity.status == "captured") {

        if (pathologyOrderData.wallet) {
          const walletTransaction = await walletTransactionModel.create({
            transactionNumber: "",
            patientId: pathologyOrderData.patientId,
            patientMobile: pathologyOrderData.patientMobile,
            points: pathologyOrderData.wallet.applyPoints,
            transactionType: "debit",
            mode: "labtest",
            remark: pathologyOrderData.wallet.remark,
          })
        }

        const history = pathologyOrderData.statusHistory
        history.push({
          "status": "captured",
          "dateAndTime": new Date()
        })
        const ids = Object.values(pathologyOrderData.transactions)
        await transactionModel.updateMany({ _id: { $in: ids } }, { status: "captured" })
        await transactionModel.findByIdAndUpdate({ _id: pathologyOrderData.transactions.gateway }, { status: "captured", paymentMode: entity.method, transactionGatewayId: entity.id, razorpayOrderId: entity.id }, { new: true })
        const pathologyOrder = await pathologyOrderModel.findByIdAndUpdate({ _id: pathologyOrderData._id }, { isPayment: true, transactionGatewayId: entity.id, pathologyStatus: "captured", adminStatus: "captured", statusHistory: history, razorpayPaymentId: entity.id }, { new: true })
        console.log(pathologyOrder)
        return res.status(200).send(ResponceAPI(true, "Order place successfully", " Done other captured", null, null, version))

      } else if (hookData.payload.payment.entity.status == "refunded") {

      } else {
        const ids = Object.values(pathologyOrderData.transactions)
        await transactionModel.updateMany({ _id: { $in: ids } }, { status: entity.status })
        await transactionModel.findByIdAndUpdate({ _id: pathologyOrderData.transactions.gateway }, { status: entity.status, paymentMode: entity.method, transactionGatewayId: entity.id, razorpayOrderId: entity.id }, { new: true })
        const pathologyOrder = await pathologyOrderModel.findByIdAndUpdate({ _id: pathologyOrderData._id }, { isPayment: true, transactionGatewayId: entity.id, razorpayPaymentId: entity.id }, { new: true })
        console.log(pathologyOrder)
        return res.status(200).send(ResponceAPI(true, "Order place successfully", pathologyOrder, null, null, version))
        
      }

      
      return res.status(200).send(ResponceAPI(true, "Done", "Done other status", null, null, version));



    }

    else if (entity.notes.orderType == "appointment") {
      const appointmentData = await appointmentsModel.findOne({ _id: hookData.payload.payment.entity.notes.orderId })

      if (!appointmentData) {
        return res.status(200).send(ResponceAPI(false, null, null, 404, `Invalid appointment`, version))
      }


      if (appointmentData.gatewayStatus == entity.status) {
        return res.status(200).send(ResponceAPI(false, null, null, 404, `same status`, version))
      }

      if (entity.status == "failed") {

        if (appointmentData.checkout.wallet) {
          const points = await walletPointsModel.findOne({ patientId: appointmentData.patientId })
          await walletPointsModel.findOneAndUpdate({ patientId: appointmentData.patientId }, { points: points.points + appointmentData.checkout.wallet.applyPoints }, { new: true })
          const walletTransaction = await walletTransactionModel.create({
            transactionNumber: "",
            patientId: appointmentData.patientId,
            patientMobile: appointmentData.patientMobile,
            points: appointmentData.checkout.wallet.applyPoints,
            transactionType: "credit",
            mode: "appointment",
            remark: appointmentData.checkout.wallet.remark
          })
        }
        const ids = Object.values(appointmentData.transactions)
        await transactionModel.findOneAndUpdate({ _id: appointmentData.transactions.gateway }, { status: "failed", transactionGatewayId: entity.id, razorpayOrderId: entity.id, paymentMode: entity.method })
        const transaction = await transactionModel.updateMany({ _id: { $in: ids } }, { status: "failed", })
        const appointment = await appointmentsModel.findOneAndUpdate({ _id: appointmentData._id }, { isPayment: true, gatewayStatus:entity.status, status: "rejected", transactionGatewayId: entity.id, razorpayPaymentId: entity.id }, { new: true })
        return res.status(200).send(ResponceAPI(true, "Appointment failed", appointment, null, null, version))


      } else if (entity.status == "captured") {
    
        if(appointmentData.applyMembership){
          const subscription = await subscriptionModel.findOneAndUpdate({ _id: appointmentData.applyMembership._id }, { status: entity.status, transactionGatewayId: entity.id, razorpayPaymentId: entity.id, isPayment: true }, { new: true, session })
           const plan = await membershipModel.findOne({ _id: subscription.membershipPlanId })
           const subscribedData = { freeAppointment: Number(plan.appointmentSlot) - 1, status: "subscribed", subscriptionId: subscription._id, membershipPlanId: subscription.membershipPlanId, membershipPlanName: subscription.membershipPlanName }
           const addPatientSlot = await patientModel.findOneAndUpdate({_id:appointmentData.patientId}, subscribedData, { new: true });
        }

        if (appointmentData.checkout.wallet) {

          const walletTransaction = await walletTransactionModel.create({
            transactionNumber: "",
            patientId: appointmentData.patientId,
            patientMobile: appointmentData.patientMobile,
            points: appointmentData.checkout.wallet.applyPoints,
            transactionType: "debit",
            mode: "appointment",
            remark: appointmentData.checkout.wallet.remark
          })

        }
        const ids = Object.values(appointmentData.transactions)
        const transaction = await transactionModel.updateMany({ _id: { $in: ids } }, { status: "captured" })
        await transactionModel.findOneAndUpdate({ _id: appointmentData.transactions.gateway }, { status: "captured", transactionGatewayId: entity.id, razorpayOrderId: entity.id, paymentMode: entity.method })
        const appointment = await appointmentsModel.findOneAndUpdate({ _id: appointmentData._id }, { isPayment: true, gatewayStatus:entity.status, status: "confirmed", transactionGatewayId: entity.id, razorpayPaymentId: entity.id }, { new: true })
        return res.status(200).send(ResponceAPI(true, "Appointment Booked", appointment, null, null, version))

      } else if (hookData.payload.payment.entity.status == "refunded") {

      } else {

        const ids = Object.values(appointmentData.transactions)
        await transactionModel.findOneAndUpdate({ _id: appointmentData.transactions.gateway }, { status: entity.status, transactionGatewayId: entity.id, razorpayOrderId: entity.id, paymentMode: entity.method })
        const transaction = await transactionModel.updateMany({ _id: { $in: ids } }, { status: entity.status })
        const appointment = await appointmentsModel.findOneAndUpdate({ _id: appointmentData._id }, { isPayment: true, gatewayStatus: entity.status, transactionGatewayId: entity.id, razorpayPaymentId: entity.id }, { new: true })
        return res.status(200).send(ResponceAPI(true, "Appointment Booked", appointment, null, null, version))
      }

    } else if (hookData.payload.payment.entity.notes.orderType == "medicine") {
    }




  } catch (error) {
    ApiError(error, "Sample name list");
    return res.status(500).send(ResponceAPI(false, null, error.message, 500, "server error", version));
  }
};
module.exports = {
  createLanguages,
  getLanguages,
  // createLabTestSampleName,
  // getLabTestSampleNameList,
  // razorpayPaymentWebhook,
}
