const express = require('express');
const cors = require('cors');
const connectDB = require('./config/mongodb.js');
const connectCloudinary = require('./config/cloudinary.js');
require('dotenv').config();

// These are the route imports
const userRouter = require('./routes/userRoute.js');
const productRouter = require('./routes/productRoute.js');
const cartRouter = require('./routes/cartRoute.js');
const orderRouter = require('./routes/orderRoute.js');
const paymentRouter = require('./routes/paymentRoute.js');

// App Config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)
app.use('/api/payments',paymentRouter)

app.get('/',(req,res)=>{
    res.send("API Working")
})

app.listen(port, ()=> console.log('Server started on PORT : '+ port))