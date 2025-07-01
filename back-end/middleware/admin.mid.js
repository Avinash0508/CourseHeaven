import jwt from "jsonwebtoken";
import config from "../config.js";


function adminMiddleware(req,res,next){
  const authHeader=req.headers.authorization;//to check whether there is any token or not
  if(!authHeader || !authHeader.startsWith("Bearer "))//Bearer is its type
  {
    return res.status(401).json({errors:"No token provided"});

  }
  const token=authHeader.split(" ")[1];
  try {
    const decoded=jwt.verify(token,config.JWT_ADMIN_PASSWORD)
    req.adminId=decoded.id;
    next();
    
  } catch (error) {
    res.status(401).json({errors:"Invalid token"});
    console.log("Invalid token or Expired token",error);
  }
}

export default adminMiddleware;