import mongoose  from "mongoose";

const playlistSchema = mongoose.Schema({
    name : {
        type : String ,
        required : true 
    },
    description : {
        type : String ,
        required : true 
    },
    videos : [
        {
            type : mongoose.Schema.ObjectId,
            ref : "Video",
        }
    ],
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
} , {Timestamps : true });
export const Playlist = mongoose.model("Playlist" , playlistSchema);