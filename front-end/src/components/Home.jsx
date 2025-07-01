import React, { useEffect, useState } from "react";
import logo from "../../public/logo.png"
import { Link, useNavigate } from "react-router-dom";
import { FaFacebookSquare } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../utils/utils";

function Home() {//http server ki http request frontend nunchi backend send chesthadi("axios" package)
  const [courses,setCourses]=useState([]);//using this to get the recieved data from backend to diaplay it on slider below
  const [isUserLoggedin,setUserLoggedin]=useState(false);
  const navigate=useNavigate()
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

  const handleLogout=async ()=>{
    try {
      const response=await axios.post(`${BACKEND_URL}/user/logout`,{
        withCredentials:true
      })
      toast.success(response.data.message)
      setUserLoggedin(false)
    } catch (error) {
      console.log("error in logging out",error)
      toast.error(error.response.data.errors ||"error in logging out")      
    }

  }

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
      } catch (error) {
        console.log("error in fetch courses",error)
      }
    };
    fetchCourses();
  },[])
  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay:true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  
  return (
    <div className='min-h-screen bg-gradient-to-r from-black to-blue-950 overflow-x-hidden'>
      <div className='text-white  max-w-screen-lg mx-auto '>
        {/*header */}
        <header className='flex items-center justify-between p-6'>
          <div className="flex items-center space-x-2">
            <img src={logo} alt="" className="w-10 h-10 rounded-full" />
            <h1 className="text-2xl text-orange-500 font-bold">CourseHeaven</h1>
          </div>
          <div className="space-x-4">
          {isUserLoggedin? (
            <button onClick={handleLogout} to={"/logout"} className="bg-transparent text-white py-2 px-4 border border-white rounded">
              Logout
            </button>
          ):(<>
          <Link to={"/login"} className="bg-transparent text-white py-2 px-4 border border-white rounded">
            Login
          </Link>
          <Link to={"/signup"} className="bg-transparent text-white py-2 px-4 border border-white rounded "> 
            Signup
          </Link>
          </>
          )}
          </div>
        </header>

        {/* Main Section */}
        <section className="text-center py-20">
          <h1 className="text-4xl text-orange-500 font-semibold">CourseHeaven</h1>
          <br />
          <p className="text-gray-500">Sharpen your skills with courses crafted by experts</p>
          <div className="space-x-4 mt-8">
            <Link to={"/courses"} className="bg-green-500 text-white py-3 px-6 rounded font-semibold hover:bg-white duration-300 hover:text-black">
              Explore Courses
            </Link>
            <Link to={"https://www.youtube.com/@LearnCodingOfficial/playlists"} className="bg-green-500 text-white py-3 px-6 rounded font-semibold hover:bg-white hover:text-black duration-300 ">
              Courses videos
            </Link>
          </div>
        </section>
        <section>
          <Slider {...settings}>
            {courses.map((course)=>(
              <div key={course._id} className="p-4">
                <div className="relative flex-shrink-0 w-92 transition-transform duration-300 transform hover:scale-105">
                  <div className="bg-gray-900 rounded-lg overflow-hidden">
                    <img className="h-32 w-full object-contain" src={course.image.url} alt="" />
                    <div className="p-6 text-center">
                      <h2 className="text-xl font-bold text-white">
                        {course.title}
                      </h2>
                      <button className="bg-orange-500 mt-5 text-white py-2 px-4 rounded-full hover:bg-blue-600 duration-300">Enroll Now</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>          
          
        </section>


        <hr />
        {/* Footer */}
        <footer className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center space-x-2">
                <img src={logo} alt="" className="w-10 h-10 rounded-full" />
                <h1 className="text-2xl text-orange-500 font-bold">CourseHeaven</h1>
              </div>
              <div className="mt-3 ml-2 md:ml-8">
                <p className="mb-2">Follow us</p>
                <div className="flex space-x-4">
                  <a href=""><FaFacebookSquare className="hover:text-blue-400 text-2xl duration-200" /></a>
                  <a href=""><FaInstagram className="hover:text-pink-600 text-2xl duration-200" /></a>
                  <a href=""><FaTwitter className="hover:text-blue-600 text-2xl duration-200" /></a>
                </div>
              </div>
            </div>
            <div className="items-center flex flex-col">
              <h3 className="text-lg font-semibold mb-4">
                Connect us
              </h3>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white duration-200 cursor-pointer">Instagram</li>
                <li className="hover:text-white duration-200 cursor-pointer">Facebook</li>
                <li className="hover:text-white duration-200 cursor-pointer">GitHub</li>
              </ul>
            </div>
            <div className="items-center flex flex-col">
              <h3 className="text-lg font-semibold mb-4">
                CopyRights &#169; 2025
              </h3>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white duration-200 cursor-pointer">Terms and Conditions</li>
                <li className="hover:text-white duration-200 cursor-pointer">Privacy Policy</li>
                <li className="hover:text-white duration-200 cursor-pointer">Refund and Cancellation</li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}



export default Home;