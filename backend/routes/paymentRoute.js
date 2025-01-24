const express = require('express');
const authUser = require('../middleware/auth.js');
const { makePayment, paymentStatusCheck } = require('../controllers/paymentController.js');


const paymentRouter = express.Router();

paymentRouter.post('/make', makePayment);
paymentRouter.post('/status', paymentStatusCheck);

module.exports = paymentRouter;