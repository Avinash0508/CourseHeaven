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

function Courses() {
  const [courses,setCourses]=useState([]);//using this to get the recieved data from backend to diaplay it on slider below
  const [isUserLoggedin,setUserLoggedin]=useState(false);
  const [loading,setLoading]=useState(true);
  console.log("courses: ",courses);
  
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
  
  // for fectching courses
  useEffect(()=>{
    const fetchCourses=async ()=>
    {
      try {
        const response=await axios.get(`${BACKEND_URL}/course/courses`,
        {
          withCredentials :true
        });
        console.log(response.data);
        console.log(response.data.courses);    
        setCourses(response.data.courses);
        setLoading(false);
      } catch (error) {
        console.log("error in fetch courses",error)
      }
    };
    fetchCourses();
  },[])
  
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
    <div className="flex">
      {/* Sidebar */}
      <aside className='w-64 bg-gray-100 h-screen p-5 fixed'>
        <div className="flex items-center mb-10 ">
          <img src={logo} alt="Profile" className="rounded-full h-12 w-12" />
        </div>
        <nav>
          <ul>
            <li className="mb-4">
              <a href="/" className="flex items-center">
              <span className='material-icons mr-2'>
                <RiHome2Fill />
              </span>{" "}
              Home
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="flex items-center text-blue-500">
                <span className='material-icons mr-2'>
                  <FaDiscourse/>
                </span>{" "}
                Courses
              </a>
            </li>
            <li className="mb-4">
              <a href="/purchases" className="flex items-center">
              <span className='material-icons mr-2'>
                <FaDownload/>
              </span>{" "}
              Purchases
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="flex items-center">
                <span className='material-icons mr-2'>
                  <IoMdSettings/> 
                </span>{" "}
                Settings
              </a>
            </li>
            <li>
              {isUserLoggedin ? (
                <a href='/' className='flex items-center' onClick={handleLogout}>
                  <span className='mr-2'>
                    <IoLogOut/>
                  </span>{" "}
                  Logout
                </a>
              ) : (
                <>
                  <a href='/login' className='flex items-center'>
                    <span className='mr-2'>
                      <IoLogIn/>
                    </span>{" "}
                    Login
                  </a>
                </>
                
              )}
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-[20%] w-[80%] bg-white p-10">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-xl font-bold">Courses</h1>
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Type here to search..."
                className="border border-gray-300 rounded-l-full px-4 py-2 h-10 focus:outline-none"
              />
              <button className="h-10 border border-gray-300 rounded-r-full px-4 flex items-center justify-center">
                <FiSearch className="text-xl text-gray-600" />
              </button>
            </div>

            <FaUserCircle className="text-4xl text-blue-600" />
          </div>
        </header>

        {/* Vertically Scrollable Courses Section */}
        <div className="overflow-y-auto h-[75vh]">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : courses.length === 0 ? (
            // Check if courses array is empty
            <p className="text-center text-gray-500">
              No course posted yet by admin
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                  <img
                    src={course.image.url}
                    alt={course.title}
                    className="rounded mb-4"
                  />
                  <h2 className="font-bold text-lg mb-2">{course.title}</h2>
                  <p className="text-gray-600 mb-4">
                    {course.description.length > 100
                      ? `${course.description.slice(0, 100)}...`
                      : course.description}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-xl">
                      ₹{course.price}{" "}
                      <span className="text-gray-500 line-through">5999</span>
                    </span>
                    <span className="text-green-600">20% off</span>
                  </div>

                  {/* Buy page */}
                  <Link
                    to={`/buy/${course._id}`} // Pass courseId in URL
                    className="bg-orange-500 w-full text-white px-4 py-2 rounded-lg hover:bg-blue-900 duration-300"
                  >
                    Buy Now
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Courses;