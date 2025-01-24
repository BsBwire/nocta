const express = require('express');
const { listProducts, addProduct, removeProduct, singleProduct } = require('../controllers/productController.js');
const upload = require('../middleware/multer.js');
const adminAuth = require('../middleware/adminAuth.js');

const productRouter = express.Router();

productRouter.post('/add',adminAuth,upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1}]),addProduct);
productRouter.post('/remove',adminAuth,removeProduct);
productRouter.post('/single',singleProduct);
productRouter.get('/list',listProducts)

module.exports = productRouter