// // auth middleware
// // first we get accestoken from req.cookie or from req.header.authBearer
// // check access token have or not
// // if have acces token get user data from token update req.user to toke user
// // if no access token check for refress token
// // if not refress token call next
// // if have refress token  get user id from refress token and genrate access token send to user and add user data to req which we query from user refresstoken user id

// import { ApiError } from "../utils/ApiError.js";
// import {User} from "../models/user.model.js"
// import { asyncHandler } from "../utils/asyncHandler.js";
// import jwt from "jsonwebtoken";



// const jwtVerifyToken = async (token , secret ) => {
//   try {
//     return await jwt.verify(token, secret);
//   } catch (error) {
//     return false;
//   }
// };

//  const JWTVerifyMiddleware = asyncHandler(async (req, res, next) => {
//   if (req.user) next();
//   const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
 
//     // req.cookies("accessToken")
//     // req.header("Authorization").split("Bearer")[1]; // ("Authhorixation")?.replace("Bearer" ,"")
//     console.log(accessToken , "cheking can we get acces token or not ");
//   if (!accessToken) {
//     const refreshToken = req.cookies?.refressToken
//     console.log("checking having refresh token or not " , refreshToken );
//     if (!refreshToken) next();
//     const userid  = jwtVerifyToken(refreshToken , process.env.REFRESS_TOKEN_SECRET)
//     console.log( "checking can refreee token give id or not " , userid );
//     if (!userid) next();

//     const user = await User.findById(userid._id).select("-password , -refreshToken ")
//     console.log("finding user to genrate new access token for that " , user );
//     if(!user) next()
//     const accessToken = await user.generateAccessToken();
//   console.log("can we genrste new acces token or not " ,  accessToken );

//     const options = {
//         httpOnly: true , // if httponly and secure true the cookie is only modfidable by server only 
//         secure : true ,
    
//       }
// // res.cookie("accessToken" , accessToken , options); // comment for some work 
// next()

    

    
//   }
//   const jwtVerifyuserdata = jwtVerifyToken(accessToken , process.env.ACCESS_TOKEN_SECRET);
//   console.log("getting info from token or not  " , jwtVerifyuserdata);
//   if (!jwtVerifyuserdata) next()
//   req.user = {
//     _id: jwtVerifyuserdata._id,
//     username: jwtVerifyuserdata.username,
//     fullname: jwtVerifyuserdata.fullname,
//     email: jwtVerifyuserdata.email,
//   };
//   console.log(req.user , "checkig can we getting user or not at the end og the middleawre ! ");
//   next();
// });

// export {JWTVerifyMiddleware}

// //  my way to verfiy jwt auth

// // const authmiddleware = async(req , res , next )=>{

// //     const accessToken = req.cookie.get("accessToken")
// //     if(!accessToken){
// //         const refreshToken = req.cookie.get("refressToken")
// //         if(!refreshToken) next()
// //         accessToken = await  generateAccessToken()

// //     }

// // }

