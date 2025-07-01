import { Course } from "../models/course.model.js";
import { v2 as cloudinary } from 'cloudinary';

import { Purchase } from "../models/purchase.model.js";

export const createCourse=async (req,res)=>{
  const adminId=req.adminId;
  const {title,description,price}=req.body;
  try {
    if(!title || !description || !price)
    {
      return res.status(400).json({errors: "All Fields are required"})
    }
    const {image}=req.files
    if(!req.files || Object.keys(req.files).length===0)
    {
      return res.status(400).json({errors: "No files uploaded"});
    }

    const allowFormat=["image/jpeg","image/png"]
    if(!allowFormat.includes(image.mimetype))////Gives what is the type of the image that has been uploaded
    {
      return res.status(400).json({errors: "Inavlid file format "});
    }


    ///code for cloudinary (for this we use await )
    const cloud_response=await cloudinary.uploader.upload(image.tempFilePath)///tempfilepath is the midlleware used for cloudinary(it is like a syntax)
    if(!cloud_response || cloud_response.error)
    {
      return res.status(400).json({errors: "Error while uploading file"})
    }


    const courseData={
      title,
      description,
      price,
      image:{
        public_id:cloud_response.public_id,
        url:cloud_response.url,
      },
      creatorId:adminId,
    }
    const course=await Course.create(courseData);
    res.json({
      message: "course created successfully",
      course,
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({error:"Errors while creating course"});
  }
};

export const updateCourse=async (req,res)=>{
  const adminId=req.adminId;
  const {courseId}=req.params;
  const {title,description,price,image}=req.body;
  try {
    const courseSearch=await Course.findById(courseId);
    if(!courseSearch)
    {
      return res.status(400).json({errors:"course not found to update"});
    }
    const course=await Course.findOneAndUpdate({_id:courseId,creatorId:adminId},{
      title,
      description,
      price,
      image:{
        public_id: image?.public_id ,
        url: image?.url,
      }
    });
    if(!course)
    {
      return res.status(404).json({errors:"can't Update course ,created by another Admin"})
    }
    res.status(201).json({message:"course updated successfully",course});
  } catch (error) {
    console.log("Error in updating",error);
  }
};


export const deleteCourse=async (req,res)=>{
  const adminId=req.adminId;
  const {courseId}=req.params;
  try {
    const course=await Course.findOneAndDelete({_id:courseId,creatorId:adminId})
    if(!course)
    {
      return res.status(404).json({errors:"Course can't be deleted cause created by an other admin"})
    }
    return res.status(201).json({message:"Course successfully Deleted"})

  } catch (error) {
    res.status(500).json({errors:"error in deleting course"})
    console.log("Error in deleting course",error)
  }
};


export const getCourses=async (req,res)=>{
  try {
    const courses=await Course.find({})
    res.status(202).json({courses})
  } catch (error) {
    res.status(404).json({errors:"Error in getting courses"})
    console.log("error to get courses",error)
    
  }
}

export const courseDetails=async (req,res)=>{
  const {courseId}=req.params;
  try {
    const course=await Course.findById(courseId);
    if(!course)
    {
      return res.status(404).json({errors:"No course found"})
    }
    return res.status(200).json({course})
    
  } catch (error) {
    res.status(500).json({errors:"Error in fetching courseDetails "})
    console.log("error in courseDetails",error)
  }
}

import Stripe from "stripe"
import config from "../config.js";
const stripe=new Stripe(config.STRIPE_SECRET_KEY);
console.log(config.STRIPE_SECRET_KEY);

export const buyCourses=async (req,res)=>{
  const {userId}=req;
  const {courseId}=req.params;
  try {
    const course=await Course.findById(courseId);
    if(!course)
    {
      return res.status(404).json({errors :"course not found "});
    }
    const existingPurchse=await Purchase.findOne({userId,courseId});
    if(existingPurchse)
    {
      return res.status(401).json({errors:"Already purchased this course"})
    }


    //payment gateway code

    const amount=course.price;
    const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
    payment_method_types:["card"]
   });    

    
    res.status(201).json({
      message:"Course purchased Successfully",
      course,
      clientSecret: paymentIntent.client_secret
    });

  } catch (error) {
    res.status(401).json({errors:"error in buying course"});
    console.log("error while buying course",error);
  }

}
