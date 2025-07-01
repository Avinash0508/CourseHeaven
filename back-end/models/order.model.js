import mongoose from "mongoose";

const orderSchema= new mongoose.Schema({
  email:{
    type:String
  },
  userId:String,
  courseId:String,
  paymentId:String,
  amount:Number,
  status:String,  
})


export const Order=mongoose.model("Order",orderSchema)