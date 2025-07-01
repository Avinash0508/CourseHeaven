import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs"
import {z} from "zod"
import jwt  from "jsonwebtoken";
import config from "../config.js";
import { Purchase } from "../models/purchase.model.js";
import { Course } from "../models/course.model.js";


export const signup=async (req,res)=>{
  const {firstName,lastName,email,password}=req.body;

  ///to validate the data we use zod here we can refer documentation from zod website
  const userSchema=z.object({
    firstName: z.string().min(4,{message:"firstname must be 4 char long"}),
    lastName: z.string().min(4,{message:"lastname must 4 char long"}),
    email: z.string().email(),
    password: z.string().min(6,{message:"password must be 6 char long"}),
  })

  const validateData=userSchema.safeParse(req.body); //ikkada body nunchi em vasthundho adhi safeparse adhi kuda userSchema tho use chesi cheymani chepthunnam
  if(!validateData.success)
  {
    return res.status(404).json({errors : validateData.error.issues.map(err=>err.message)})
  }

  const hashedPassword=await bcrypt.hash(password,10);


  try {
    const existingUser= await User.findOne({email:email});
    if(existingUser){
      return res.status(400).json({errors:"User already exists"});
    }
    const newUser= new User({firstName,lastName,email,password:hashedPassword});
    await newUser.save();
    res.status(201).json({message:"Signup succeeded"})
  } catch (error) {
    console.log("error in signup",error);
  }
}

export const login= async (req,res)=>{
  const {email,password}=req.body;
  try {
    const user=await User.findOne({email:email});
    const isPasswordcorrect = await bcrypt.compare(password,user.password);
    if(!isPasswordcorrect || !user)
    {
      res.status(400).json({errors :"invalid Credatials"});
    }

    //after the login we will send the jwt so that we will know what this user can do or what rights he have on this thing
    const token=jwt.sign({id:user._id},config.JWT_USER_PASSWORD,{expiresIn:"1d"});
    const cookieOptions={
      expires: new Date(Date.now() + 24*60*60*1000),
      httpOnly:true,//can't be accessed through JS directly 
      secure:process.env.NODE_ENV==="production",//manam production ani pettadam valla idhi false avthadi (true anaedhi https(means production) lo maatrame )development lo http
      sameSite:"Strict"//CSRF attacks
    }
    res.cookie('jwt',token,cookieOptions);
    res.status(202).json({message:"login successfull",user,token});
    
  } catch (error) {
    res.status(500).json({errors:"error in login"});
    console.log("error while logging in",error)
  }
};

export const purchases=async (req,res)=>{
  const userId=req.userId;//middleware of userid vaadem kabbatti manam routes lo middleware ni use chestham
  try {
    const purchased=await Purchase.find({userId});
    let purchasedCourseId=[];
    for(let i=0;i<purchased.length;i++)
    {
      purchasedCourseId.push(purchased[i].courseId);
      
    }
    const courseData= await Course.find({
      _id:{$in:purchasedCourseId}
    })
    res.status(200).json({purchased,courseData});
  } catch (error) {
    res.status(404).json({errors:"purchases not found"});
    console.log("purchases not found",error);
  }

}


export const logout=async (req,res)=>{
  try {
    res.clearCookie("jwt");
    res.status(200).json({message:"logout successful"});

  } catch (error) {
    res.status(404).json({errors:"error in logging out"});
    console.log("error in logout",error);
  }
}




