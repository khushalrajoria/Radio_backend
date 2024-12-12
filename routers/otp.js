const otpRoute = require("express").Router();
const admin = require("firebase-admin");

const serviceAccount = require("../utils/sample-services-61e53-firebase-adminsdk-8g5wv-1b18280d13.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

otpRoute.post("/send", (req, res) => {
  try {
    const phoneNumber = "+1234567890"; // Replace with the user's phone number

    admin
      .auth()
      .createCustomToken(phoneNumber)
      .then((userCredential) => {
        return res.status(200).send(userCredential);
      })
      .catch((error) => {
        return res.status(400).send(error);
      });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

otpRoute.post("/verify", (req, res) => {
  try {
    admin
      .auth()
      .verifyIdToken(req.body.token)
      .then((decodedToken) => {
        return res.status(200).send(decodedToken.uid);
        const uid = decodedToken.uid;
        // ...
      })
      .catch((error) => {
        return res.status(400).send(error);
        // Token is invalid
        // ...
      });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

module.exports = otpRoute;
