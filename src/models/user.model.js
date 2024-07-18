import mongoose, { Schema }  from "mongoose";
import jwt  from "jsonwebtoken";
// import {bcryptjs } from "bcryptjs"
import bcrypt  from "bcrypt"
import process from "process"


const userSchema = mongoose.Schema(
    {
    username : {
        type : String ,
        required : true ,
        unique : true ,
        lowercase : true,
        trim : true ,
        index : true 

    },
    email : {
        type : String ,
        required : true ,
        unique : true ,
        lowercase : true , 
        trim : true 
    },
    fullname : {
        type : String ,
        required : true ,
        trim : true ,
        index : true 
    },
     avatar  : {
        type : String ,
        required : false

    },
    coverImage : {
        type : String // using cloudnary 
    },
    watchHistory: [{
        type : Schema.Types.ObjectId,
        ref : "Video"

    }],
    password :{
        type : String ,
        required : [true  , "Password is Required ! "],


    },
    refreshToken : {
        type: String 
    },



} , {
    timestamps : true 
})

userSchema.pre("save" , async function (next){
    //  we have use this as well update time so we have to write like so it can work with update 
    if(!this.isModified("password")) return next();
    this.password =  await bcrypt.hash(this.password , 10 ) // it hash data 10 round 
    next()


})

userSchema.methods.isPasswordCorrect = async function(password){
    return await  bcrypt.compare(password , this.password)

}
userSchema.methods.generateAccessToken =  async function(){
    return  await jwt.sign(
        {
            _id : this._id,
            username : this.username,
            fullname : this.fullname,
            email : this.email


        } , 
        process.env.ACCESS_TOKEN_SECRET ,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }

    )

}
userSchema.methods.generateRefreshToken = async function(){
    return  await jwt.sign(
        {
            _id : this._id,
        } , 
        process.env.REFRESS_TOKEN_SECRET ,
        {
            expiresIn : process.env.REFRESS_TOKEN_EXPIRY
        }

    )


}
const User = mongoose.model('User' , userSchema )

export {User} ;
