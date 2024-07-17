import {User} from "../models/user.model.js"
import {asyncHandler } from "../utils/asyncHandler.js"

const registerUser =  asyncHandler(async(req , res)=>{
     res.status(200).json({
        message : "user created succefully "
    })

})

const updateUser = asyncHandler( async(req , res)=>{})
const deleteUser = asyncHandler(async (req , res)=>{})
const getUser = asyncHandler( async (req , res)=>{})
const loginUser =  asyncHandler(async (req , res)=>{})
const logoutUser = asyncHandler(async (req ,res)=>{})


export {
    registerUser ,
    updateUser ,
    deleteUser ,
    getUser ,
    logoutUser,
    loginUser
};