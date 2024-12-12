const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

const WooCommerce = new WooCommerceRestApi({
  url: process.env.BASE_URL,
  consumerKey: process.env.consumerKey,
  consumerSecret: process.env.consumerSecret,
  version: "wc/v3",
 // queryStringAuth: true 
});


module.exports = WooCommerce;