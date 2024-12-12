
const prescriptionRoute = require("express").Router();

const settingController= require('../controllers/settingController');

prescriptionRoute.post('/configuration', settingController.settingCreateAndUpdate);
prescriptionRoute.get('/fetch', settingController.getSettings);

module.exports = prescriptionRoute;
