const Joi=require("joi")
const JoiObjectId = require('joi-objectid')(Joi);

const userValidSchema = Joi.object({
    name: Joi.string().min(3).max(40).required(),
    roleID: Joi.string().min(10).max(50).required(),
    mobile: Joi.string().length(10).pattern(/[6-9]{1}[0-9]{9}/).required(),
    gender: Joi.string().valid('male','female','other').required(),
    age: Joi.number().integer(),
  }).unknown(true);

  const emailAndPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
  }).unknown(true);


  const doctorValidSchemaSignIn= Joi.object({
    mobile: Joi.string().length(10).pattern(/[6-9]{1}[0-9]{9}/).required(),
    fcmToken: Joi.string().min(2).required(),
    deviceID: Joi.string().min(1).required(),
    platform: Joi.string().min(1).required(),
    appVersion: Joi.string().min(1).required(),
  }).unknown(true);

  const doctorRatingValidSchema= Joi.object({
    doctorId: Joi.string().min(10).required(),
    rating: Joi.number().min(0).max(5).required()
  });

  const addFamilyMemberSchema = Joi.object({
    name: Joi.string().min(3).max(40).required(),
    relation: Joi.string().min(3).max(40).required(),
    age: Joi.number().integer().min(1).required(),
    gender: Joi.string().valid('male','female','other').required(),
    mobile: Joi.string().length(10).regex(/^[6-9]\d{9}$/).required(),
   }).unknown(true);


  const doctorValidSchemaSignUp = Joi.object({
    name: Joi.string().min(3).max(40).required(),
    mobile: Joi.string().length(10).pattern(/[6-9]{1}[0-9]{9}/).required(),
    gender: Joi.string().valid('male','female','other').required(),
    fcmToken: Joi.string().min(2).required(),
    deviceID: Joi.string().min(1).required(),
    platform: Joi.string().min(1).required(),
    appVersion: Joi.string().min(1).required(),
  }).unknown(true);

//patient signIn
 const patientValidSchemaSignIn = Joi.object({
  fcmToken: Joi.string().min(2).required(),
  deviceID: Joi.string().min(1).required(),
  platform: Joi.string().min(1).required(),
  appVersion: Joi.string().min(1).required(),
 }).unknown(true);
  
//patient signUp 
 const patientValidSchemaSignUp = Joi.object({
  patientNumber: Joi.string().required(),
  name: Joi.string().min(3).max(40).required(),
  age: Joi.number().integer().min(1).required(),
  gender: Joi.string().valid('male','female','other').required(),
  mobile: Joi.string().length(10).regex(/^[6-9]\d{9}$/).required(),
  email: Joi.string().email(),
  reasonOfReport: Joi.string().required(),
  clinicId: Joi.string().custom((value, helpers) => {
    if (!ObjectId.isValid(value)) {
        return helpers.error('clinicId must be a valid ObjectId');
    }
    return value;
}),
  // fcmToken: Joi.string().min(2).required(),
  // deviceID: Joi.string().min(1).required(),
  // platform: Joi.string().min(1).required(),
  // appVersion: Joi.string().min(1).required(),
}).unknown(true);

//for sympotom 
 const uploadSymptom = Joi.object({
  name: Joi.string().min(3).max(40).required(),
  description: Joi.string().min(10).required(),
 }).unknown(true);
 
 //for home screen coupon
 const bannerSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  couponId:  JoiObjectId().required(), 
  image: Joi.any().required(),
 }).unknown(true);

 //uploadEHR
 const uploadEHRSchema = Joi.object({
  relationId: Joi.string().required(),
 }).unknown(true);

  //uploadEHRforPartner
  const uploadEHRPartnerSchema = Joi.object({
    patientId: Joi.string().required(),
    orderId: Joi.string().required(),
    serviceId: Joi.string().required(),
   }).unknown(true);

//patient register schema
 const patientRegisterSchema = Joi.object({
  name: Joi.string().min(3).max(40).required(),
  mobile: Joi.string().length(10).regex(/^[6-9]\d{9}$/).required(),
  isActive: Joi.boolean().required()
}).unknown(true);

const partnerValidSchema = Joi.object({
  name: Joi.string().min(3).max(40).required(),
  mobile: Joi.string().length(10).pattern(/[6-9]{1}[0-9]{9}/).required(),
  email: Joi.string().email().required(),
  gstNo: Joi.string().required().regex(
    /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/
  ),
  // organizationName: Joi.string().min(3).max(80).required(),
  // brandName: Joi.string().min(1).max(80).required(),
  licenseNo:  Joi.string().min(3).max(40).required(),
}).unknown(true);

const doctorAdminSchema = Joi.object({
  name: Joi.string().min(3).max(40).required(),
  mobile: Joi.string().length(10).pattern(/[6-9]{1}[0-9]{9}/).required(),
}).unknown(true);


// specialization schema
const specializationSchema =Joi.object({
  specialization: Joi.string().min(3).max(40).required(),
}).unknown(true);

//symptom schema
const symptomSchema = Joi.object({
  symptom: Joi.string().min(3).max(40).required(),
}).unknown(true);


//specialization and symptom schema
 const specializationSymptomSchema = Joi.object({
  specialization: Joi.string().min(3).max(40).required(),
  // symptom: Joi.array().items(Joi.string()),
  symptom: Joi.string().min(3).max(40).required(),
 }).unknown(true);

 //membershipSchema
 const membershipPlanSchema = Joi.object({
  planName: Joi.string().min(3).max(40).required(),
  priceWithGst: Joi.number().integer().min(1).required(),
  appointmentSlot:Joi.number().integer().min(0),
   
  offPercentMedicine: Joi.number().min(0),
  maxOffAmountMedicine:Joi.number().integer().min(0),
  offPercentTest:Joi.number().min(0),
  maxOffAmountTest:Joi.number().integer().min(0),
  expiryMonth: Joi.number().integer().min(0),
 }).unknown(true);


//appointmet trans schema
const transactionSchema=Joi.object({
 patientId:  JoiObjectId().required(),
 transactionType: Joi.string().min(5).max(6).required(),
 patientMobile: Joi.string().length(10).pattern(/[6-9]{1}[0-9]{9}/).required(), 
 userRemark: Joi.string(),
 transactionId: Joi.string().min(3).max(50).required(),
 paymentMode: Joi.string().min(3).max(20).required(),
 price:    Joi.number().min(0),
 referenceId:   JoiObjectId().required(), 
}).unknown(true);

const doctorPaymentSchema=Joi.object({
  patientId:  JoiObjectId().required(),
  transactionId: Joi.string().min(3).max(50).required(),
  paymentMode: Joi.string().min(3).max(20).required(),
  price:    Joi.number().min(0),
  referenceId:   JoiObjectId().required(),
 }).unknown(true);

 const ValidStatusSchema=Joi.object({
  status:Joi.string().valid('Approved','Rejected','Pending','InActive','Active','Blocked'),
 }).unknown(true);
 
 //coupon validation schema
const couponValidSchema= Joi.object({
  name: Joi.string().min(3).max(20).required(),
  code: Joi.string().min(6).max(15).required(), 
  startDate:Joi.string().min(10).max(20).required(),
  endDate: Joi.string().min(10).max(20).required(),
  couponType: Joi.string().required(),
  price:  Joi.number().min(0),
  offType: Joi.string().required(),
  maxOffPercent: Joi.number().min(0),
  minimumOffPrice: Joi.number().min(0),
  description: Joi.string()
}).unknown(true);

const ValidStatusCouponSchema=Joi.object({
  status:Joi.string().valid('Inactive','Active'),
 }).unknown(true);

 const pathologyValidSchema= Joi.object({
  serviceName: Joi.string().min(3).required(),
  price: Joi.number().required(), 
  sampleType:Joi.string().required(),
}).unknown(true);

const pathologyServiceStatus= Joi.object({
  serviceId: Joi.string().min(3).required(),
  status:Joi.string().valid('Approved', 'Rejected', 'Pending', 'Blocked', 'Published').required()
}).unknown(true);

const appointmentMembershipValidSchema= Joi.object({
  doctorId: Joi.string().min(10).required(),
  date: Joi.string().min(5).required(), 
  slot: Joi.string().min(4).required(),
}).unknown(true);



const appointmentDirectBookingCheckout= Joi.object({
  memberId: Joi.string().min(10).required(),
  date: Joi.string().min(5).required(), 
  slot: Joi.string().min(4).required(),
  isWallet:Joi.boolean().required(),
  isUseSlot:Joi.boolean().required(),
}).unknown(true);

const appointmentDirectBooking= Joi.object({
  checkoutId: Joi.string().min(10).required(),
  deviceId: Joi.string().required(), 
  platform:Joi.string().required(), 
  appVersion:Joi.string().required(), 
  symptom:Joi.array().required(), 
}).unknown(true);





const appointmentPaidValidSchema= Joi.object({
  transactionGatewayId: Joi.string().required(),
  paymentMode: Joi.string().required(),
  price: Joi.string().required(), 
}).unknown(true);



const patientAddressValidSchema= Joi.object({
  name: Joi.string().required(),
  mobile: Joi.string().required(),
  email: Joi.string().required(), 
  house_flat_no: Joi.string().required(),
  area_street: Joi.string().required(), 
  address1: Joi.string().required(),
  country: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  pincode: Joi.string().required(),
}).unknown(true);

const pathologyOrderValidSchema= Joi.object({
  patientId: Joi.string().required(),
  addressId: Joi.string().required(),
  partnerId: Joi.string().required(), 
  cartId: Joi.string().required(),
  sampleCollectTime: Joi.string().required(),
  contectName:Joi.string().required(),
  contectNumber: Joi.string().required(),
}).unknown(true);
const updateOrderValidSchema= Joi.object({
  contectName: Joi.string().required(),
  contectNumber: Joi.string().required(),
  sampleCollectTime: Joi.string().required()
})
const pathologyOrderVerifyValidSchema= Joi.object({
  patientId: Joi.string().required(),
  orderId: Joi.string().required(),
  timeOut: Joi.boolean().required(),
  status: Joi.string().required(),
}).unknown(true);


const productOrderValidSchema= Joi.object({
  patientId: Joi.string().required(),
  addressId: Joi.string().required(),
  cartId: Joi.string().required(),
}).unknown(true);


module.exports={
  userValidSchema,
  emailAndPasswordSchema,
  doctorValidSchemaSignIn,
  doctorAdminSchema,
  doctorValidSchemaSignUp,
  patientValidSchemaSignIn,
  patientValidSchemaSignUp,
  doctorAdminSchema,
  uploadSymptom,
  partnerValidSchema,
  bannerSchema,
  uploadEHRSchema,
  patientRegisterSchema,
  addFamilyMemberSchema,
  specializationSchema,
  symptomSchema,
  specializationSymptomSchema,
  membershipPlanSchema,
  transactionSchema,
  doctorPaymentSchema,
  ValidStatusSchema,
  couponValidSchema,
  ValidStatusCouponSchema,
  pathologyValidSchema,
  appointmentMembershipValidSchema,
  appointmentPaidValidSchema,
  patientAddressValidSchema,
  pathologyOrderValidSchema,
  productOrderValidSchema,
  uploadEHRPartnerSchema,
  pathologyServiceStatus,
  doctorRatingValidSchema,
  pathologyOrderVerifyValidSchema,
  updateOrderValidSchema,
  appointmentDirectBookingCheckout,
  appointmentDirectBooking
}