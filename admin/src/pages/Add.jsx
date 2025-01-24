import React, { useState } from 'react'
import {assets} from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Add = ({token}) => {

  const [image1,setImage1] = useState(false)
  const [image2,setImage2] = useState(false)
  const [image3,setImage3] = useState(false)
  const [image4,setImage4] = useState(false)

   const [name, setName] = useState("");
   const [description, setDescription] = useState("");
   const [price, setPrice] = useState("");
   const [category, setCategory] = useState("Brand new");
   const [subCategory, setSubCategory] = useState("accesory");
   const [bestseller, setBestseller] = useState(false);
   const [colours, setcolours] = useState([]);

   const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      
      const formData = new FormData()

      formData.append("name",name)
      formData.append("description",description)
      formData.append("price",price)
      formData.append("category",category)
      formData.append("subCategory",subCategory)
      formData.append("bestseller",bestseller)
      formData.append("colours",JSON.stringify(colours))

      image1 && formData.append("image1",image1)
      image2 && formData.append("image2",image2)
      image3 && formData.append("image3",image3)
      image4 && formData.append("image4",image4)

      const response = await axios.post(backendUrl + "/api/product/add",formData,{headers:{token}})

      if (response.data.success) {
        toast.success(response.data.message)
        setName('')
        setDescription('')
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setPrice('')
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
   }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
        <div>
          <p className='mb-2'>Upload Image</p>

          <div className='flex gap-2'>
            <label htmlFor="image1">
              <img className='w-20' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
              <input onChange={(e)=>setImage1(e.target.files[0])} type="file" id="image1" hidden/>
            </label>
            <label htmlFor="image2">
              <img className='w-20' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="" />
              <input onChange={(e)=>setImage2(e.target.files[0])} type="file" id="image2" hidden/>
            </label>
            <label htmlFor="image3">
              <img className='w-20' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="" />
              <input onChange={(e)=>setImage3(e.target.files[0])} type="file" id="image3" hidden/>
            </label>
            <label htmlFor="image4">
              <img className='w-20' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="" />
              <input onChange={(e)=>setImage4(e.target.files[0])} type="file" id="image4" hidden/>
            </label>
          </div>
        </div>

        <div className='w-full'>
          <p className='mb-2'>Product name</p>
          <input onChange={(e)=>setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Type here' required/>
        </div>

        <div className='w-full'>
          <p className='mb-2'>Product description</p>
          <textarea onChange={(e)=>setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Write content here' required/>
        </div>

        <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>

            <div>
              <p className='mb-2'>Product category</p>
              <select onChange={(e) => setCategory(e.target.value)} className='w-full px-3 py-2'>
                  <option value="Brand New">Brand New</option>
                  <option value="Refurbished">Refurbished</option>
                  <option value="Used">Used</option>
              </select>
            </div>

            <div>
              <p className='mb-2'>Sub category</p>
              <select onChange={(e) => setSubCategory(e.target.value)} className='w-full px-3 py-2'>
                  <option value="Accesory">Accesory</option>
                  <option value="Consumer electrinics">Consumer electronics</option>
                  <option value="Sound">Sound</option>
                  <option value="Display">Display</option>
                  <option value="Network">Network</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Home devices">Home devices</option>
              </select>
            </div>

            <div>
              <p className='mb-2'>Product Price</p>
              <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-[120px]' type="Number" placeholder='25' />
            </div>

        </div>

        <div>
          <p className='mb-2'>Product colours</p>
          <div className='flex gap-3'>
            <div onClick={()=>setcolours(prev => prev.includes("grey") ? prev.filter( item => item !== "grey") : [...prev,"grey"])}>
              <p className={`${colours.includes("grey") ? "bg-pink-100" : "bg-slate-200" } px-3 py-1 cursor-pointer`}>Grey</p>
            </div>
            
            <div onClick={()=>setcolours(prev => prev.includes("black") ? prev.filter( item => item !== "black") : [...prev,"black"])}>
              <p className={`${colours.includes("black") ? "bg-pink-100" : "bg-slate-200" } px-3 py-1 cursor-pointer`}>Black</p>
            </div>

            <div onClick={()=>setcolours(prev => prev.includes("pink") ? prev.filter( item => item !== "pink") : [...prev,"pink"])}>
              <p className={`${colours.includes("pink") ? "bg-pink-100" : "bg-slate-200" } px-3 py-1 cursor-pointer`}>Pink</p>
            </div>

            <div onClick={()=>setcolours(prev => prev.includes("white") ? prev.filter( item => item !== "white") : [...prev,"white"])}>
              <p className={`${colours.includes("white") ? "bg-pink-100" : "bg-slate-200" } px-3 py-1 cursor-pointer`}>white</p>
            </div>

            <div onClick={()=>setcolours(prev => prev.includes("blue") ? prev.filter( item => item !== "blue") : [...prev,"blue"])}>
              <p className={`${colours.includes("blue") ? "bg-pink-100" : "bg-slate-200" } px-3 py-1 cursor-pointer`}>Blue</p>
            </div>
          </div>
        </div>

        <div className='flex gap-2 mt-2'>
          <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id='bestseller' />
          <label className='cursor-pointer' htmlFor="bestseller">Add to bestseller</label>
        </div>

        <button type="submit" className='w-28 py-3 mt-4 bg-black text-white'>ADD</button>

    </form>
  )
}

export default Add