import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../utils/utils';

function OurCourses() {
  const [courses,setCourses]=useState([]);
  const [loading,setLoading]=useState(true);
  const admin = JSON.parse(localStorage.getItem("admin"));
  const token = admin?.token;
  const navigate=useNavigate();

  if(!token)
  {
    toast.error("please Login to continue");
    navigate("/admin/login")
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
        setLoading(false);
      } catch (error) {
        console.log("error in fetch courses",error)
      }
    };
    fetchCourses();
  },[]);

  //delete courses code
  const handleDelete=async (id)=>{
    try {
      const response=await axios.delete(`${BACKEND_URL}/course/delete/${id}`,
        {
          headers:{
            Authorization:`Bearer ${token}`
          },
          withCredentials:true,
        }
      );
      toast.success(response.data.message);
      const updatedCourses=courses.filter((course)=> course._id!==id);//this will delete and update the course based on that id 
      setCourses(updatedCourses)
      
    } catch (error) {
      console.log("error in deleting courses",error);
      toast.error("Error in deleting courses" || error.response.data.errors);
    }
  };

  if(loading)
  {
    return <p className='text-center text-gray-500'>Loading...</p>
  }


  return (
    <div className='bg-gray-100 p-8 space-y-4'>
      <h1 className='text-3xl font-bold text-center mb-8'>Our Courses</h1>
      <Link className="bg-orange-500 py-2 px-4 rounded-lg text-white hover:bg-orange-800 duration-100" to={"/admin/dashboard"}>
        Go to DashBoard
      </Link>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {courses.map((course)=>(
          <div key={course._id} className='bg-white shadow-md rounded-lg p-4'>
            <img
              src={course?.image?.url}
              alt={course.title}
              className='h-40 w-40 object-cover rounded-t-lg'
             />
             <h2 className='text-xl font-semibold mt-4 text-gray-800'>
              {course.title}
             </h2>
             <p className='text-gray-600 mt-2 text-sm'>
              {course.description.length > 200
                ? `${course.description.slice(0,200)}...`:course.description
              }
             </p>
             <div className='flex justify-between mt-4 text-gray-800 font-bold'>
                <div>
                  {" "}
                  ₹{course.price}{" "}
                  <span className='line-through text-gray-500'>₹300</span>
                </div>
                <div className='text-green-600 text-sm mt-2'>
                  10% off
                </div>
             </div>
             <div className='flex justify-between'>
                <Link to={`/admin/updatecourse/${course._id}`} className='bg-orange-500 text-white py-2 px-4 mt-4 rounded hover:bg-blue-800'>
                  Update
                </Link>
                <button onClick={()=> handleDelete(course._id)} className='bg-red-500 text-white py-2 px-4 mt-4 rounded hover:bg-red-800'>Delete</button>
             </div>

          </div>
        ))}

      </div>
    </div>
  )
}

export default OurCourses