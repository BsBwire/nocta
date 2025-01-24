const express = require('express');
const { addToCart, getUserCart, updateCart } = require('../controllers/cartController.js');
const authUser = require('../middleware/auth.js');

const cartRouter = express.Router()

cartRouter.post('/get',authUser, getUserCart)
cartRouter.post('/add',authUser, addToCart)
cartRouter.post('/update',authUser, updateCart)

module.exports = cartRouter