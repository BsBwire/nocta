import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import axios from 'axios';
import { toast } from 'react-toastify';

const Orders = () => {

  const { backendUrl, token , currency} = useContext(ShopContext);

  const [orderData,setOrderData] = useState([])

  const checkpayment = async (order_id, _id) => {
     console.log(orderData)
    try {
      const response = await axios.put(backendUrl + '/api/order/paymentUpdate',{orderId:order_id, _id},{headers:{token}})
      if (response.data.success) {
        toast.success('Payment Successful')
        loadOrderData()
      }
    } catch (error) {
      toast.error('Payment Failed')
    }
  };

  const fetchOrderData = async () => {
    try{
      if (!token) {
        return null
      }
      const response = await axios.get(backendUrl + '/api/order')  
      console.log(response.data)  
      setOrderData(response.data.reverse())
    } catch (error){
      console.log(error)
      toast.error(error)
    }
  }

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null
      }

      const response = await axios.post(backendUrl + '/api/order/userorders',{},{headers:{token}})
      if (response.data.success) {
        let allOrdersItem = []
        response.data.orders.map((order)=>{
          order.items.map((item)=>{
            item['status'] = order.status
            item['payment'] = order.payment
            item['paymentMethod'] = order.paymentMethod
            item['date'] = order.date
            allOrdersItem.push(item)
          })
        })
      }
      
    } catch (error) {
      console.log(error)
      toast.error(error)
    }
  }

  useEffect(()=>{
    loadOrderData()
    fetchOrderData()
  },[token])

  return (
    <div className='border-t pt-16'>

        <div className='text-2xl'>
            <Title text1={'MY'} text2={'ORDERS'}/>
        </div>

        <div>
            {
              orderData.map((item) => (
                item.items.map((i,c) => (
                <div key={c} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                    <div className='flex items-start gap-6 text-sm'>
                        <img className='w-16 sm:w-20' src={i.image[0]} alt="" />
                        <div>
                          <p className='sm:text-base font-medium'>{i.name}</p>
                          <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                            <p>{currency}{i.price}</p>
                            <p>Quantity: {i.quantity}</p>
                            <p>colours: {i.colour}</p>
                          </div>
                          <p className='mt-1'>Date: <span className=' text-gray-400'>{new Date(item.date).toDateString()}</span></p>
                          <p className='mt-1'>Payment: <span className=' text-gray-400'>{item.paymentMethod}</span></p>
                        </div>
                    </div>
                    <div className='md:w-1/2 flex justify-between'>
                        <div className='flex items-center gap-2'>
                            <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                            <p className='text-sm md:text-base'>{item.status}</p>
                        </div>
                        <button onClick={() => checkpayment(item.order_id, item._id)} className='border px-4 py-2 text-sm font-medium rounded-sm'>Track Order</button>
                    </div>
                </div>
                ))
              ))
            }
        </div>
    </div>
  )
}

export default Orders
