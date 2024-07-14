// require("dotenv").config({path : './env'})
import dotenv from "dotenv";
import express  from "express";
import connectDB   from "./db/index.js";
  
dotenv.config({path : './env'});

connectDB()


const app = express()

app.listen(process.env.PORT , "localhost" , ()=>{
    console.log("server is listen on port 3000 : http://localhost:3000")
})

















//  this is on way to workig with db connection 


// ;(async ()=>{
//     try {
//         await mongoose.connect(process.env.DB_URL)
//         app.on("error" , ()=>{
//             console.log("ErrR :" , error )
//             throw error
//         })
//         app.listen(8000 , "localhost" , ()=>{
//             console.log(" server is listen on port 8000 : http://locahost:8000 ")
//         })
        
//     } catch (error) {
//         console.log("db connection error ")
        
//     }
// })()
