import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const VideoSchema =new mongoose.Schema({
    videofile : {
        type : String ,
        required : [true , "video file is must ! "]
    },
    thumbnail : {
        type : String ,
        required : true 

    },
    owner : {
        type : Schema.Types.ObjectId,
        ref : User ,
        required : true 
    },
    title : {
        type : String,
        required : true 
    },
    description : {
        type : String ,
        required : true 
    },
    duration : {
        type : Number ,// this number is provide by cloudnary or like s3 
        required : true 
    },
     views : {
        type : Number ,
        default : 0 

    },
    isPublished : {
        type : Boolean ,
        default : true 
    }

} , { timestamps : true })


VideoSchema.plugin(mongooseAggregatePaginate)

const Videos = mongoose.model("Video" , VideoSchema )





export {Videos};

