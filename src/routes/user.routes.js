import {
  registerUser,
  getUser,
  updateUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  updateUserDetail,
  getCurrentUser,
  changeCurrentPassword,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getUserWatchHistory
} from "../controllers/user.controller.js";
import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middelware.js";
import multer from "multer";

const router = express.Router();

router.route("user/get-current-user").get( verifyJWT ,getCurrentUser)
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
router.route("/user/logout").post(verifyJWT, logoutUser);

router.route("/user/refresstoken").get(refreshAccessToken);
router
  .route("/user/update") // here this work if we are doing server side rendring so we send a html form which render in client machine .
  .patch(verifyJWT, updateUserDetail);
  router.route("user/change-current-password").patch(verifyJWT , changeCurrentPassword )
  
router.route("/user/update-user-avatar").patch(verifyJWT , multer.upload.single("avatar") , updateUserAvatar)
router.route("/user/update-user-cover-image").patch(verifyJWT , multer.upload.single("coverImage") , updateUserCoverImage )
router.route("/c/:username").get(verifyJWT , getUserChannelProfile)
route.route("/history").get(verifyJWT , getUserWatchHistory)
export default router;
