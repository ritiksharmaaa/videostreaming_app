import mongoose from "mongoose";

const subscriptionSchema = mongoose.Schema({
    subscriber : {
        type : mongoose.Schema.Types.ObjectId, // one who subscribe chanel 
        ref : "User" 
    },
    channel : {
        type : mongoose.Schema.Types.ObjectId, //one who is subscribing is subscribing 
        ref : "User"
    }


},{Timestamps : true })






export const Subscription = mongoose.model("Subscription" , subscriptionSchema )