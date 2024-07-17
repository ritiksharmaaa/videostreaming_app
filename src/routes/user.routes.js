import { registerUser  , getUser  , updateUser , loginUser , logoutUser } from "../controllers/user.controller.js";
import  express from "express"

const router  = express.Router()

router.route("/user/register").get(getUser).post(registerUser)
router.route("/user/login").get((req , res)=>{
    console.log("user login form rendered ! ")
}).post(loginUser)
router.post("/user/logout" , logoutUser )
router.post("/user/update").get((req ,res)=>{}).post(updateUser)


export default router;