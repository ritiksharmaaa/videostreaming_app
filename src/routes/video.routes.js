import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middelware.js";
import {publishVideo } from "../controllers/video.controller.js"


const route = express.Router();


route.route("/user/createvideo").post(verifyJWT , upload.fields([
    { name: "videofile", maxCount: 1 },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]) , publishVideo )