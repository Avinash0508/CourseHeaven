import React, { useEffect, useState } from 'react'
import axios from "axios"
import { FaUserCircle } from 'react-icons/fa';
import {RiHome2Fill} from "react-icons/ri";
import { FaDiscourse } from 'react-icons/fa';
import {IoMdSettings} from "react-icons/io";
import {IoLogIn,IoLogOut} from "react-icons/io5";
import {FiSearch} from "react-icons/fi";
import logo from "../../public/logo.png"
import toast from 'react-hot-toast';
import { FaDownload } from 'react-icons/fa6';
import {Link,useNavigate} from "react-router-dom";
import { BACKEND_URL } from '../utils/utils';

function Purchases() {
  const [purchases,setPurchase]=useState([]);//using this to get the recieved data from backend to diaplay it on slider below
  const [isUserLoggedin,setUserLoggedin]=useState(false);
  const [errorMessage,setErrorMessage]=useState(true);
  console.log("purchases: ",purchases);
  
  useEffect(()=>{
    const token=localStorage.getItem("user")
    if(token)
    {
      setUserLoggedin(true);
    }
    else
    {
      setUserLoggedin(false);
    }
  },[])

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;
    const fetchPurchases=async ()=>{
    if(!token){
      setErrorMessage("please LogIn to purchase the courses");
      return
    }
    try {
      const response=await axios.get(`${BACKEND_URL}/user/purchases`,{
        headers:{
          Authorization:`Bearer ${token}`
        },
        withCredentials:true,
      })
      setPurchase(response.data.courseData)   
    } catch (error) {
      setErrorMessage(error.response.data.errors || "Failed to fetch purchased data");
    }
  };
  fetchPurchases()
  },[]    
  );
  
  const handleLogout=async ()=>{
    try {
      const response=await axios.post(`${BACKEND_URL}/user/logout`,{
        withCredentials:true
      })
      toast.success(response.data.message);
      localStorage.removeItem("user");
      navigate("/")

    } catch (error) {
      console.log("error in logging out",error)
      toast.error(error.response.data.errors ||"error in logging out")      
    }

  }
  return (
    <div className='flex h-screen'>
      {/* Sidebar */}
      <div className='w-64 bg-gray-100 p-5'>
        <nav>
          <ul>
            <li className='mb-4'>
              <Link to='/' className='flex items-center'>
                <RiHome2Fill className='mr-2' /> Home
              </Link>
            </li>
            <li className='mb-4'>
              <Link to='/courses' className='flex items-center'>
                <FaDiscourse className='mr-2' /> Courses
              </Link>
            </li>
            <li className='mb-4'>
              <a href='#' className='flex items-center'>
                <FaDownload className='mr-2' /> Purchases
              </a>
            </li>
            <li className='mb-4'>
              <Link to='/settings' className='flex items-center'>
                <IoMdSettings className='mr-2' /> Settings
              </Link>
            </li>
            <li>
              {isUserLoggedin ? (
                <button onClick={handleLogout} className='flex items-center'>
                  <IoLogOut className='mr-2' /> Logout
                </button>
              ):(
                <Link to="/login" className='flex items-center'>
                  <IoLogIn className='mr-2' /> Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>
      {/*main content */}
      <div className='flex-1 p-8 bg-gray-50'>
        <h2 className='text-xl font-semibold mb-6'>My Purchases</h2>

        {/*Error message */}
        {errorMessage &&(
          <div className='text-red-500 text-center mb-4'>{errorMessage}</div>
        )}

        {/*all purchases */}
        {
          purchases.length>0 ?(
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
              {purchases.map((purchase,index)=>(
                <div key={index} className='bg-white rounded-lg shadow-md p-6 mb-6'>
                  <div className='flex flex-col items-center space-y-4'>
                    {/* Image of course */}
                    <img className='rounded-lg w-full h-48 object-cover' src={purchase.image?.url || "https://via.placeholder.com/200"} alt='purchase.title' />
                    <div className='text-center'>
                      <h3 className='text-lg font-bold'>{purchase.title}</h3>
                      <p className='text-gray-500'>
                        { purchase.description.length>100
                          ? `${purchase.description.slice(0,100)}..`
                          : purchase.description
                        } 
                      </p>
                      <span className='text-green-700 font-semibold text-sm'>
                        ${purchase.price} only
                      </span>
                    </div>
                  </div>
                </div>
              ))

              }
            </div>
          ):(
            <p className='text-gray-500'>You have not purchased anything yet</p>
          )
        }


      </div>
      
    </div>
  );
}

export default Purchases