import express from 'express';
import { buyCourses, courseDetails, createCourse, deleteCourse, getCourses, updateCourse } from '../controllers/course.controller.js';
import userMiddleware from '../middleware/user.mid.js';
import adminMiddleware from '../middleware/admin.mid.js';



const router=express.Router();

router.post('/create',adminMiddleware,createCourse,(req,res)=>{

})

router.put('/update/:courseId',adminMiddleware,updateCourse,(req,res)=>{
  
})

router.delete('/delete/:courseId',adminMiddleware,deleteCourse,(req,res)=>{

})

router.get('/courses',getCourses,(req,res)=>{

})

router.get('/:courseId',courseDetails,(req,res)=>{
  
})

router.post('/buy/:courseId',userMiddleware,buyCourses);

export default router;