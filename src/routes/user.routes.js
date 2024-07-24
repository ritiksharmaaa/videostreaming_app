import {
  registerUser,
  getUser,
  updateUser,
  loginUser,
  logoutUser,
} from "../controllers/user.controller.js";
import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middelware.js";

const router = express.Router();

router
  .route("/user/register")
  .get(getUser)
  .post(
    upload.fields([
      { name: "avatar", maxCount: 1 },
      {
        name: "coverImage",
        maxCount: 1,
      },
    ]),
    // after middleware this can run 
    registerUser
  );
router
  .route("/user/login")
  .get((req, res) => {
    console.log("user login form rendered ! ");
  })
  .post(loginUser);
router.route("/user/logout",).post( verifyJWT ,  logoutUser);
router
  .post("/user/update")
  .get((req, res) => {})
  .post(updateUser);

export default router;
