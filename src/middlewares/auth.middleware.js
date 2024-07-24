import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async(req, _, next) => {
    console.log("middleware trigger " , req );
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        console.log( typeof token , "checkign token is comming or not ");
        
        // console.log(token);
        if (!token || typeof token !== 'string') {
            console.log("i token not getting ");
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(JSON.stringify(token), process.env.ACCESS_TOKEN_SECRET)
        console.log(decodedToken);
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        console.log(error , "commig in logout ");
        throw new ApiError(401, error?.message || "Invalid access token")
    }
    
})

