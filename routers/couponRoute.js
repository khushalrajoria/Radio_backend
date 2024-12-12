const router = require('express').Router();

const {authentication,createRoleAuth,editRoleAuth,getRoleAuth,deleteRoleAuth}=require("../middleware/auth")

const {
    createCoupon,
    couponList,
    deleteCoupon,
    editCoupon,
    activeList,
    couponById,
    changeStatus,
    VerifiyCouponCode,
    WebHookCreateCoupon
}= require('../controllers/couponController');

router.post('/createCoupon', createCoupon);
router.get('/list',authentication, couponList);
router.delete('/delete/:couponId',deleteRoleAuth, deleteCoupon);
router.put('/edit/:couponId',editRoleAuth, editCoupon);
router.get('/active/list',authentication, activeList);
router.get('/fetch/:couponId', getRoleAuth, couponById);
router.put("/changeStatus/:id/:status",editRoleAuth, changeStatus);
router.get("/Verifiy/:couponCode/:couponType", VerifiyCouponCode);

//Woocommerce webHook apis
router.post("/webhook/create", WebHookCreateCoupon);

module.exports = router;