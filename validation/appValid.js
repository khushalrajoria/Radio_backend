const Joi=require("joi")

const validCreateProductCart = Joi.object({
    productId: Joi.string().min(10).max(50).required(),
    patientId: Joi.string().min(3).max(50).required(),
    quantity:Joi.number().min(1).required(),
  }).unknown(true);

  const validCreateLabTestCart = Joi.object({
    labTestId: Joi.string().min(10).max(50).required(),
    patientId: Joi.string().min(3).max(50).required(),
  }).unknown(true);

  const validRemoveProductCart = Joi.object({
    productId: Joi.string().min(10).max(50).required(),
    cartId: Joi.string().min(10).max(50).required(),
    removeType: Joi.string().valid('all','one').required(),
  }).unknown(true);

  const validwishListProductCart = Joi.object({
    productId: Joi.string().min(10).max(50).required(),
    type: Joi.string().valid('product','service').required(),

  }).unknown(true);

  module.exports={
    validCreateProductCart,
    validRemoveProductCart,
    validwishListProductCart,
    validCreateLabTestCart
  }