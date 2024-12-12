const router = require("express").Router();

const  woocommerceController= require('../controllers/woocommerceController');

router.post("/add/all/products",woocommerceController.addAllProductsListInDB);
router.get("/get/all/products",woocommerceController.getAllProductsListInDB);
router.get("/products/list",woocommerceController.productsList);
router.get("/fetch/:id", woocommerceController.productById);
router.get("/category/:id",woocommerceController.productByCatoryId);


//web hooks
router.post("/hook/product/create",woocommerceController.weebHookCreateProduct);
router.post("/hook/product/update",woocommerceController.weebHookUpdateProduct);
router.post("/hook/product/delete",woocommerceController.weebHookRemoveProduct);
module.exports=router;