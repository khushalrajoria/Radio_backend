const settingRoute = require("express").Router();

const settingController= require('../controllers/settingController');


settingRoute.post('/configuration', settingController.settingCreateAndUpdate);
settingRoute.get('/fetch', settingController.getSettings);

module.exports = settingRoute;
