const pdfRouter = require("express").Router();
const pdfController = require('../controllers/pdfController');



//mobile
pdfRouter.post('/invoice', pdfController.creteOrderInvoice);
pdfRouter.post('/precipitation/:orderId', pdfController.createPrecipitation);
pdfRouter.post('/report/:orderId', pdfController.createReport);


module.exports = pdfRouter;