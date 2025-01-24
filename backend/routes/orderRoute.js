const express = require('express');
const { 
    placeOrder, 
    paymentUpdate,
    placeOrderStripe, 
    placeOrderRazorpay, 
    allOrders, 
    userOrders, 
    updateStatus, 
    verifyStripe, 
    verifyRazorpay,
    getAllOrders
} = require('../controllers/orderController.js');
const adminAuth = require('../middleware/adminAuth.js');
const authUser = require('../middleware/auth.js');

const orderRouter = express.Router()

// Admin Features
orderRouter.post('/list',adminAuth,allOrders)
orderRouter.post('/status',adminAuth,updateStatus)

// fetch data from database
orderRouter.get('/', getAllOrders)
    
// Payment Features
orderRouter.post('/place',authUser,placeOrder)
orderRouter.post('/stripe',authUser,placeOrderStripe)
orderRouter.post('/razorpay',authUser,placeOrderRazorpay)

// User Feature 
orderRouter.post('/userorders',authUser,userOrders)

// verify payment
orderRouter.post('/verifyStripe',authUser, verifyStripe)
orderRouter.post('/verifyRazorpay',authUser, verifyRazorpay)

orderRouter.put('/paymentUpdate',authUser, paymentUpdate)

module.exports = orderRouter