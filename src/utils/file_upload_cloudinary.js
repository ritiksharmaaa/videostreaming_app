import { v2 as cloudinary  } from "cloudinary";
import fs from "fs";
import process from "process";

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET 
})

const uploadOnCloudniary = async (localFilePath)=>{
    try {
        if(!localFilePath) return null 
        //upload the file on cloudanary 
        const res = await cloudinary.v2.uploader(localFilePath  , {resource_type : "auto"})

        //file uploaded succeffuly 
        console.log("file is uploaded on cloudinary " , res.url);
        return res
        
    } catch (error) {
        // remove local file in our server because we dont wan to failde or corupted data have on our server 
        fs.unlinkSync(localFilePath)
        
    }

}

export {uploadOnCloudniary };