const orderModel = require("../models/orderModel.js");
const userModel = require("../models/userModel.js");
const Stripe = require('stripe');
const razorpay = require('razorpay');
const axios = require('axios');
const qs = require('qs');


// global variables
const currency = 'tsh'
const deliveryCharge = 5000

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
//const zenopay = new ZenoPay(process.env.ZENOPAY_SECRET_KEY)


const razorpayInstance = new razorpay({
    key_id : process.env.RAZORPAY_KEY_ID,
    key_secret : process.env.RAZORPAY_KEY_SECRET,
})

const getAllOrders = async (req, res) => {
        try {
         const orders = await orderModel.find({})
         return res.json(orders)
        }catch (err){
         console.error(err)
         return res.status(500).json({error: 'Something went wrong'})
        }
    }

// Placing orders using ZenoPay Method
const placeOrder = async (req,res) => {
    try {       
       const { userId, items, amount, address} = req.body;

       const paymentResponse = await axios.post('http://localhost:4000/api/payments/make', {
            amount,
            name : address.firstName,
            email: address.email,
            phone: address.phone        
        })

        if(paymentResponse.data.status.toLowerCase() === 'success'){
            const orderData = {
                userId,
                items,
                address,
                amount,
                order_id: paymentResponse.data.order_id,
                paymentMethod:"cod",
                payment:false,
                date: Date.now()
            }

            const newOrder = new orderModel(orderData)
            await newOrder.save()

            await userModel.findByIdAndUpdate(userId,{cartData:{}})

            res.json({success:true, message:"Order Placed"})
        } else {
            return res.json({success:false, message:"Payment Failed"})
        }
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// Placing orders using Stripe Method
const placeOrderStripe = async (req,res) => {
    try {
        
        const { userId, items, amount, address} = req.body
        const { origin } = req.headers;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod:"Stripe",
            payment:false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        const line_items = items.map((item) => ({
            price_data: {
                currency:currency,
                product_data: {
                    name:item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency:currency,
                product_data: {
                    name:'Delivery Charges'
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url:  `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        })

        res.json({success:true,session_url:session.url});

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// Verify Stripe 
const verifyStripe = async (req,res) => {

    const { orderId, success, userId } = req.body

    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, {payment:true});
            await userModel.findByIdAndUpdate(userId, {cartData: {}})
            res.json({success: true});
        } else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({success:false})
        }
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// Placing orders using Razorpay Method
const placeOrderRazorpay = async (req,res) => {
    try {
        
        const { userId, items, amount, address} = req.body

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod:"Razorpay",
            payment:false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        const options = {
            amount: amount * 100,
            currency: currency.toUpperCase(),
            receipt : newOrder._id.toString()
        }

        await razorpayInstance.orders.create(options, (error,order)=>{
            if (error) {
                console.log(error)
                return res.json({success:false, message: error})
            }
            res.json({success:true,order})
        })

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// verify Razorpay 

const verifyRazorpay = async (req,res) => {
    try {
        
        const { userId, razorpay_order_id  } = req.body

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        if (orderInfo.status === 'paid') {
            await orderModel.findByIdAndUpdate(orderInfo.receipt,{payment:true});
            await userModel.findByIdAndUpdate(userId,{cartData:{}})
            res.json({ success: true, message: "Payment Successful" })
        } else {
             res.json({ success: false, message: 'Payment Failed' });
        }

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}


// All Orders data for Admin Panel
const allOrders = async (req,res) => {

    try {
        
        const orders = await orderModel.find({})
        res.json({success:true,orders})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// User Order Data For Forntend
const userOrders = async (req,res) => {
    try {
        
        const { userId } = req.body

        const orders = await orderModel.find({ userId })
        res.json({success:true,orders})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// update order status from Admin Panel
const updateStatus = async (req,res) => {
    try {
        
        const { orderId, status } = req.body

        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({success:true,message:'Status Updated'})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// check if paid or not

const paymentUpdate = async (req,res) => {
    const { orderId, _id} = req.body
    console.log(orderId, _id)

    await axios.post('http://localhost:4000/api/payments/status',{
        order_id: orderId
    })
    .then(
        async resp => {
            if(resp.data.payment_status.toUpperCase() === 'COMPLETED'){
                await orderModel.findByIdAndUpdate(_id, {status: "Order Placed" ,payment:true})
                console.log({ success: true, message: "Payment Successful",})
            } else {
                console.log({ success: false, message: 'Payment Not Made Yet!' });
            }
        }
         )
    .catch(error => {
        console.log(error)
        res.json({ success: false, message: error.message })
    })}


module.exports = {verifyRazorpay, paymentUpdate, verifyStripe, getAllOrders ,placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus}