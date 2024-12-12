const productRoute = require("express").Router();

const productController= require('../controllers/productController');
const woocommerceController= require('../controllers/woocommerceController');

productRoute.get('/list', productController.getProductList);
productRoute.get('/get/:productId', productController.getProductById);
productRoute.get('/top/data', productController.getTopProductList);

//mobile
productRoute.get('/mob/list', productController.getProductMobileList);
productRoute.post('/mob/get', productController.getProductByIdForMobile);
productRoute.get('/mob/get/related/:productId', productController.getRelatedProduct);
productRoute.post('/review', woocommerceController.addProductRating);

module.exports = productRoute;
