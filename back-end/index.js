import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import courseRoute from "./routes/course.route.js";
import { v2 as cloudinary } from 'cloudinary';
import fileUpload from 'express-fileupload';
import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";
import cookieParser from 'cookie-parser';
import cors from "cors";
import orderRoute from "./routes/order.route.js";

const app= express();
dotenv.config();

//midllewares
app.use(express.json());
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
app.use(cookieParser());
app.use(cors({
  origin: [
      "http://localhost:5173", // for local dev
      "https://courseheaven-front.onrender.com", // ✅ your deployed frontend
    ],//mana backend ki kevalam idhi oka frontend ee access chesthadi
  credentials:true,//it handels cookies and erorrs like (CORS)
  methods:["GET","POST","PUT","DELETE"],
  allowedHeaders:["Content-Type","Authorization"],

}))


const port=process.env.PORT || 3000;
const DB_URL=process.env.MONGO_URL;

try {
  await mongoose.connect(DB_URL)
  console.log("database is connected")
} catch (error) {
  console.log(error)
}

///defing ours routes
app.use("/api/v1/course",courseRoute);
app.use("/api/v1/user",userRoute);
app.use("/api/v1/admin",adminRoute);
app.use("/api/v1/order",orderRoute);

///cloudinary config code
cloudinary.config({
  cloud_name: process.env.cloud_name, 
  api_key: process.env.api_key, 
  api_secret:process.env.api_secret
});


app.listen(port);