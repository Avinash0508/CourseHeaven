import React from 'react'
import { useNavigate,Navigate, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import {Toaster} from 'react-hot-toast'
import Courses from './components/Courses'
import Buy from './components/Buy'
import Purchases from './components/Purchases'
import AdminSignup from './admin/AdminSignup'
import AdminLogin from './admin/AdminLogin'
import Dashboard from "./admin/Dashboard"
import CourseCreate from "./admin/CourseCreate"
import UpdateCourse from "./admin/UpdateCourse"
import OurCourses from "./admin/OurCourses"

function App() {

  const user=JSON.parse(localStorage.getItem("user"));
  const admin=JSON.parse(localStorage.getItem("admin"));
  
  return (
    <div> {/* to define different routes we use react-router-dom */}
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />

      
      {/* Inpages Routes */}
      <Route path='/courses' element={<Courses />} />
      <Route path='/buy/:courseId' element={<Buy />} />
      <Route path='/purchases' element={user? <Purchases />:<Navigate to={"/login"} />} />

      {/*Admin routes */}
      <Route path='/admin/signup' element={<AdminSignup />} />
      <Route path='/admin/login' element={<AdminLogin />} />
      <Route path='/admin/dashboard' element={admin ? <Dashboard /> : <Navigate to={"/admin/login"} />} />
      <Route path='/admin/createcourse' element={<CourseCreate />} />
      <Route path='/admin/updatecourse/:id' element={<UpdateCourse />} />
      <Route path='/admin/ourcourses' element={<OurCourses />} />


    </Routes>
    <Toaster />

    </div>
  )
}

export default App