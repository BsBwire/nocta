const axios = require('axios');
const qs = require('qs');
require('dotenv').config();

const makePayment = async (req, res) => {
    const { name, phone, email, amount } = req.body;

    const data = {
        buyer_name: name,
        buyer_phone: phone,
        buyer_email: email,
        amount: amount,
        account_id: process.env.ZENOPAY_ACCOUNT_ID,
        secret_key: "",
        api_key: "",
        webhook_url: ""
    };

    const formattedData = qs.stringify(data);
    console.log("Payment Data:", data);

    try {
        const response = await axios.post('https://api.zeno.africa', formattedData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        console.log('Payment Response:', response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Payment Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: error.response ? error.response.data : error.message });
    }
};

const paymentStatusCheck = async (req,res) => {
    const {order_id} = req.body;
    console.log(order_id)
    const formData = new FormData();
     formData.append('check_status', 1);
     formData.append('order_id', order_id);
     formData.append('api_key', '');
     formData.append('secret_key', '');
 
    try{
     const response = await axios.post('https://api.zeno.africa/status', formData)
       .then(
         response => {
           res.status(200).json(response.data);
         }
       )
    } catch(error) {
       console.log('Payment status check error:',error);
       res.status(500).json({error: 'Failed to check the status of the payment'})
    }
 }

module.exports = { makePayment, paymentStatusCheck };
