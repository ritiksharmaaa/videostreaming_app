// require("dotenv").config({path : './env'})
import dotenv from "dotenv";
import connectDB   from "./db/index.js";
import {app} from "./app.js"
    
dotenv.config({path : './.env'});

connectDB().then(()=>{
    console.log("Db connected succfully in db callable file   ....")
    app.listen(process.env.PORT , "localhost" , ()=>{
        console.log("server is listen on port 3000 : http://localhost:3000")
    })
    

}).catch((err)=>{
    console.log(err , " erro from DB calling give promise ! ")
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
