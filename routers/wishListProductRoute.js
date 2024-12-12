const WishListrouter = require("express").Router();

const  wishListProductController= require('../controllers/wishListProductController');
const {authentication,createRoleAuth,editRoleAuth,getRoleAuth,deleteRoleAuth,Authorization}=require("../middleware/auth")

WishListrouter.post("/add/products",Authorization,wishListProductController.addWishListProduct);
WishListrouter.get("/get/patient",Authorization,wishListProductController.getWishListProductByPatientId);
WishListrouter.get("/get/device/:deviceId",Authorization,wishListProductController.getWishListProductByDeviceId);
WishListrouter.put("/remove/one/:wishlistId",Authorization, wishListProductController.removeProductInWishLIstByID);
WishListrouter.put("/remove/all/:wishlistId",Authorization, wishListProductController.removeAllProductInWishList);
module.exports=WishListrouter;