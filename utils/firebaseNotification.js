
const FCM = require('fcm-node')
const {saveNotification} = require('../controllers/notificationController')

const serverKey = process.env.FCM_SERVER_KEY   
const fcm = new FCM(serverKey)


const sendNotification = async (token, title, body,userId,sendType) => {
   console.log(serverKey)
  let message = {
    to: token,
    collapse_key: 'your_collapse_key',

    notification: {
      title: title,
      body: body,
      //icon :"https://kapeefit.s3.ap-south-1.amazonaws.com/avatar2.png1687772304375.png",
     //"android_channel_id": "pushnotificationapp",
     imageUrl:"https://cdn2.vectorstock.com/i/1000x1000/23/91/small-size-emoticon-vector-9852391.jpg",
    sound: false
    },

    // data: {  //you can send only notification or only data(or include both)
    //   my_key: 'my value',
    //   my_another_key: 'my another value'
    // }
  }

  fcm.send(message, function (err, response) {
    if (err) {
      console.log("Something has gone wrong!", err);
    } else {
      console.log("Push notification sent.", response);
    }
  });
 await saveNotification(userId,sendType,title,body,token)
}


module.exports={sendNotification}