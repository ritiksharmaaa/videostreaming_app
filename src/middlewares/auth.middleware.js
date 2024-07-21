// auth middleware
// first we get accestoken from req.cookie or from req.header.authBearer
// check access token have or not
// if have acces token get user data from token update req.user to toke user
// if no access token check for refress token
// if not refress token call next
// if have refress token  get user id from refress token and genrate access token send to user and add user data to req which we query from user refresstoken user id

import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const jwtVerifyToken = async (token , secret ) => {
  try {
    return await jwt.verify(token, secret);
  } catch (error) {
    return false;
  }
};

const JWTVerifyMiddleware = asyncHandler(async (res, res, next) => {
  const accessToken =
    req.cookie.get("accessToken") ||
    req.header("Authorization").split("Bearer")[1]; // ("Authhorixation")?.replace("Bearer" ,"")
  if (!accessToken) {
    const refreshToken = req.cookies.get("refressToken");
    if (!refreshToken) next();
    const userid  = jwtVerifyToken(refreshToken , process.env.REFRESS_TOKEN_SECRET)
    if (!userid) next();

    const user = await User.findById(userid._id).select("-password , -refreshToken ")
    if(!user) next()
    const accessToken = await user.generateAccessToken();

    const options = {
        httpOnly: true , // if httponly and secure true the cookie is only modfidable by server only 
        secure : true ,
    
      }
res.cookie("accessToken" , accessToken , option);
next()

    

    
  }
  const jwtVerifyuserdata = jwtVerifyToken(accessToken , process.env.ACCESS_TOKEN_SECRET);
  if (!jwtVerifyuserdata) next()
  req.user = {
    _id: jwtVerifyuserdata._id,
    username: jwtVerifyuserdata.username,
    fullname: jwtVerifyuserdata.fullname,
    email: jwtVerifyuserdata.email,
  };
  next();
});

//  my way to verfiy jwt auth

// const authmiddleware = async(req , res , next )=>{

//     const accessToken = req.cookie.get("accessToken")
//     if(!accessToken){
//         const refreshToken = req.cookie.get("refressToken")
//         if(!refreshToken) next()
//         accessToken = await  generateAccessToken()

//     }

// }
