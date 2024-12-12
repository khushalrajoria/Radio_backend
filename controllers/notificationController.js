// const { partnerValidSchema } = require("../validation/valid")
const { ResponceAPI } = require("../utils/ResponceAPI")
const clinicModel = require('../models/clinic');
const notificationModel = require('../models/notificationModel');
const path = require('path');
// const version = process.env.API_VERSION
const ApiError = require('../functions/ApiError');



const saveNotification=async (userId,sendType,title,bodyData,fcmToken)=>{
    try {
        const data={
            userId:userId,
            sendType:sendType,
            title:title,
            body:bodyData,
            fcmToken:fcmToken
        }
        const saveNotificationData = await notificationModel.create(data)
        return saveNotificationData
    
    } catch (error) {
        return res.status(500).send(ResponceAPI(false, null, error.message, 500, "server error", version))
    }
}


const getNotificationsbyId=async (req,res)=>{
    try {
        const partnerId = req.user_id
        const notificationList = await notificationModel.find({userId:partnerId,isView:false})
        return res.status(200).send(ResponceAPI(true, "Notification List", notificationList, null, null, version))
    } catch (error) {
        return res.status(500).send(ResponceAPI(false, null, error.message, 500, "server error", version))
    }
}

const createNotifications=async (req,res)=>{
    try {
        const partnerId = req.user_id
        const{
            userId,
            sendType,
            title,
           bodyData,
            fcmToken
        }=req.body
        const notificationList = await saveNotification(userId,sendType,title,bodyData,fcmToken)
        return res.status(200).send(ResponceAPI(true, "Notification List", notificationList, null, null, version))
    } catch (error) {
        return res.status(500).send(ResponceAPI(false, null, error.message, 500, "server error", version))
    }
}

const viewsNotifications=async (req,res)=>{
    try {
        const partnerId = req.user_id
        const {notificationId}=req.params
        const notification = await notificationModel.findByIdAndUpdate({_id:notificationId,userId:partnerId,isView:false},{isView:true},{new:true})
        return res.status(200).send(ResponceAPI(true, "Notification List", notification, null, null, version))
    } catch (error) {
        return res.status(500).send(ResponceAPI(false, null, error.message, 500, "server error", version))
    }
}
const dismissAllNotifications=async (req,res)=>{
    try {
        const partnerId = req.user_id
        console.log(partnerId)
        const notification = await notificationModel.updateMany({userId:partnerId,isView:false},{isView:true})
        return res.status(200).send(ResponceAPI(true, "Dismiss All", notification, null, null, version))
    } catch (error) {
        return res.status(500).send(ResponceAPI(false, null, error.message, 500, "server error", version))
    }
}

const getNotificationsbyIdForMobile=async (req,res)=>{
    try {
        const partnerId = req.patient_id
        console.log(partnerId)
        const notificationList = await notificationModel.find({userId:partnerId,isView:false})
        return res.status(200).send(ResponceAPI(true, "Notification List", notificationList, null, null, version))
    } catch (error) {
        return res.status(500).send(ResponceAPI(false, null, error.message, 500, "server error", version))
    }
}

module.exports = {
    getNotificationsbyId,
    createNotifications,
    viewsNotifications,
    saveNotification,
    dismissAllNotifications,
    getNotificationsbyIdForMobile
}