import {asyncHandler} from "utils/asyncHandler.js"
import {ApiResponse} from "utils/ApiResponse.js"
import { ApiError} from "utils/ApiError.js";
import {Videos} from "../models/video.model";
import { uploadOnCloudniary }  from "../utils/file_upload_cloudinary"

// what we have to save 
   // we areg etting two file a video and a thubnail 
    // get tittle and description 
    // owner who create  


const publishVideo = asyncHandler(async(req , res)=>{
    // first we check can we have both two file  in req.files or not if not throw api error 
    // also check title desrption   in req.body if not throw errro 
    // get current user from req . 
    // uppload thumbnail and video on cloudinary
    // get the url from output of clodnary 
    // check can url have or not if not 
    // create video call in db 
    const user = req.user._id ;
    const { title , description  } = req.body;
    if([title , description].some((field)=> field?.trim() === "")){
        throw new ApiError(400, "all field are required ");
    }
    const videofilepath = req.files?.videofile[0].path ; //aslo get req.duration you will get 
    const thumbnaipath = req.files?.thumbnail[0].path ;
    if (!(videofilepath & thumbnailpath)){
        throw new ApiError(500 , "server Errror while uploading")
    }
    const videocloudinary = await uploadOnCloudniary(videofilepath) // we are getting objectbecauseourclodinru sdk parsemand return this object data .
    const thumbnailclodinary = await uploadOnCloudniary(thumbnaipath)
    if (!(videocloudinary & thumbnailclodinary )){
        throw new ApiError(500 , "server is getting problem to upload video on cloudinary")
    }
    const videocreate = await  Videos.create({
        videofile : videocloudinary.url ,
        thumbnail : thumbnailclodinary.url ,
        owner : user ,
        title : title ,
        description : description,
        duration : parseFloat(videocloudinary?.duration),
        isPublished : req.body?.ispublish

        

    }) 

    if (!videocreate){
        throw new ApiError(500 , "fail to uplod data on video db ")
    }
    const data = await Videos.findById(videocreate._id).select("-views -isPublished")
    if (!data) {
    throw new ApiError(500 , "we save data in db but unable to get to confir can dat ahave or not")
    }
    return res.status(200).json(new ApiResponse(200 , data , "video uploded succefully " ))




 

});

const deleteVideo = asyncHandler((req ,res)=>{

});

const  updateVideo = asyncHandler((req ,res)=>{

});
const getVideoById = asyncHandler((req , res)=>{

});
const getAllVideo = asyncHandler((req, res)=>{

});
const toggleIspublishVideo = asyncHandler((req, res)=>{

})


const searchVideoByTitle = asyncHandler(
    (req , res)=>{

});


export {
    publishVideo,
    deleteVideo,
    updateVideo,
    searchVideoByTitle,
    getAllVideo,
    getVideoById,
    toggleIspublishVideo
}