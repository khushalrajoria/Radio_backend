const Razorpay = require('razorpay');

const instance = new Razorpay({ key_id: 'rzp_test_ZcTxTJachf6EH9', key_secret: 'wRuWRMUQuvGs6JrX0xOeM5hv' })


const orderInstance = async (amount, orderId, orderType) => {
    try {
        return await instance.orders.create({
            amount: amount,
            currency: "INR",
            receipt: "receipt#1",
            notes: {
                orderId: orderId,
                orderType: orderType
            }
        })
    } catch (error) {
        return error
    }
}

const getorderInstance = async (paymentId) => {
    try {
        return await instance.payments.fetch(paymentId);
    } catch (error) {
        return error
    }
}


const paymentsRefund = async (paymentId, amount) => {
    try {
        return await instance.payments.refund(paymentId, {
            "amount": amount,
            "speed": "normal",
        })
    } catch (error) {
        return error
    }

}



module.exports = { orderInstance, getorderInstance, paymentsRefund }

