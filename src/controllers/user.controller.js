import { User  } from "../models/user.model.js";
import {Subscription} from "../models/subscription.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudniary } from "../utils/file_upload_cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { json } from "express";

// note : alway check file from bottom to up
// postman can send space also whichcreate conflict password_ _this is space which not shee but affect to access
// use trim data when user submit data because they add some extra space

// srp follow based code for login

const generateAccessAndRefreshToken = async (userid) => {
  try {
    // Find the user by ID
    const user = await User.findById(userid);
    if (!user) {
      throw new Error("User not found");
    }

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Assign the refresh token to the user
    user.refreshToken = refreshToken;

    // Save the user with the new refresh token
    await user.save({ validateBeforeSave: false });

    // Return the tokens
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error generating tokens:", error);
    throw error; // You may want to handle this more gracefully
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // console.log("login user data in req " , req );
  // first we have to get data from user who post data
  // than we chexk body is not null if null retrun else
  // check the user existed or not via user name and email
  // check img have or not it on condition you build api or rendring in redring you give another page to update user detail .
  // uplord to cloudnary or aws s3 and get file location
  // check awaiter uplord or not if uplord continue
  // create user Object - entry in db
  // remove password and reffrees tocken field fronm creted user because we crete at the time of login
  // check if user is creted or not
  // return response

  const { fullName, email, username, password } = req.body;
  // console.log(req.body, "checking password is comming or not ");

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All field are required ");
  }
  // also check email patter in valid or not using  another if conditon
  // normal way to manully check each file  to validate
  // if (!fullName |  fullName === ""){
  //     throw new ApiError(400 , "fullname is required " ,)
  // }

  const existedUser = await User.findOne({
    // username // or email by which you can find user bu uniquely
    $or: [{ username }, { email }],
  });
  // console.log("checking existed user have or not user : " ,existedUser )
  if (existedUser) {
    throw new ApiError(
      409,
      "User with username and email  is already exists  "
    );
  }
  // req.body  have all this middleware addign data but when we use multer middleware we have diffrent access called req.fileS? which have lot of detail
  // console.log("checking req file " , req.files)
  const avatarFile = req.files?.avatar[0]?.path; //log file to chekc what data cam ein files
  let coverImageFile;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageFile = req.files.coverImage[0].path;
  }

  //   ------------------------------------------------------

  if (!avatarFile) new ApiError(400, "avatar image is required  ! ");
  // console.log(" checking what file location img a/re uploaded : " , avatarFile ,"-----------" , coverImageFile );

  const avatar = await uploadOnCloudniary(avatarFile);
  const coverImage = await uploadOnCloudniary(coverImageFile);
  // console.log("checking what cloundary return when we pass path to cloudanry : " , avatar , "------------" , coverImage  );

  if (!avatar) {
    throw new ApiError(500, "avatar file is required");
  }

  const user = await User.create({
    fullname: fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password: password,
    username: username.toLowerCase(),
  });

  // console.log("checking what data is created in out db : " , user , "----------------");
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  ); // select use for remove the field which we dont want in string with - sing

  if (!createdUser)
    throw new ApiError(
      500,
      "something went wrong while registring the user please try after sometime  "
    );

  // console.log("checking what response we are sending to server  : "  , res);

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user created succefully "));
  // try ith my self login
  // try {
  //     const userdata = req.body ; //
  //     if (!userdata ) return null ;
  //     const User = new User({

  //     })

  //      return res.status(200).json({
  //         message : "user created succefully "
  //     })
  // } catch (error) {
  //     console.log(error , "message not saved ! ")

  // }
});

// ----------------------------------------------login --------------------------------------------------

//  login user
//  get username and password
// check can this both field have in our req.body or not if null any of the object return api error
// check can user have in our db or not if not return redirect id ssr  or throu error in api res
// finduser from db
// check password is correct or not
// if correct than create acces token and refress token
// save token to user res.cookie , req.header.auth return  response token in json

const loginUser = asyncHandler(async (req, res) => {
  const { username, password, email } = req.body; //you can take email as well
  console.log(
    username,
    password,
    email,
    " checking data is comming or not ",
    req.body
  );
  if (!(username || email & password))
    throw new ApiError(400, "username and password is required ...");
  if (
    [username || email, password].some((field) => {
      field?.trim() == "";
    })
  ) {
    throw new ApiError(400, "username and password is required ...");
  }
  const user = await User.findOne({
    $or: [{ username: username }, { email: email }],
  });
  // console.log(user , "checking can we get user from db ir not  ");
  if (!user) throw new ApiError(400, "User Does not exist..");
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  console.log(isPasswordCorrect);
  if (!isPasswordCorrect)
    throw new ApiError(401, "User password is incorrect ....");
  // follow srp of design pricipal not create token there intead create a function who gerate it and code segrigate ..
  // const accessToken = await user.generateAccessToken() // send to user
  // const refressToken = await user.generateRefreshToken() //save to db this token and send to user
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  console.log(accessToken, "and", refreshToken);
  // option in appwrite when we login it send back user object so we can furthure do userbased operation --in api when you login you are login than next time when  you call get user detail to save in our state
  // so you can send user detail from here we use sign token data for server side requesting
  // send this user data so frontend can request base on user .
  const loggedInUser = await User.findById(user._id).select(
    " -password -refreshToken"
  );
  // console.log("checking which user is login " , loggedInUser);
  const options = {
    httpOnly: true, // if httponly and secure true the cookie is only modfidable by server only
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refressToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
          // why we send this data of user ans refress and acces token  when we send this data in cookie so , here we take case of mobile developer in mobile cookie not work so may we user can store this refress and accesstoken to user so next time is send this data manualyy in header .
        },
        "user logedIn User Succefully...."
      )
    );
});

// -------------------------------------------------logout user -------------------------------
// first if user login they have someable to acces user id and send to server in front end in backend we have a req thre we add user data in req by auth middleware so we can access user id from there
// find user based  user id
// or use condition shwowing logoout button in front end // in server side we have attach a middleawre which check only login user call logout
// fetch data from db and update refreee token filed to be  null or empty
// we have to delete the cookie from user browser .

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

//  refress token  if user acces token expire we check if it hase refress token we get id from there than check can refress token is match with there db or not if match redirect to new endpoint which refress the access token as well refress token

const refressAccessToken = asyncHandler(async (req, res) => {
  try {
    const incommingrefreshToken = req.cookies?.refreshToken;
    if (!incommingrefreshToken)
      throw new ApiError(
        400,
        "refresh token is reuired to generate new access token ! "
      );
    const isvalid = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (!isvalid) throw new Error(400, "Refresh token is invalid ");
    const user = User.findById(isvalid._id).select(
      "-passwword -fullname -email -username"
    );
    if (!user) throw new ApiError(400, "token is not valid");
    if (user?.refreshToken !== incommingrefreshToken) {
      throw new ApiError(401, "refress token is expired or used");
    }
    const { newAccessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);
    options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .cookie("accessToken", newAccessToken, options)
      .cookie("refressToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken: newAccessToken, refreshToken: newRefreshToken },
          "Access Token Refresh"
        )
      );
  } catch (error) {
    console.log(error, "error while refreshing token ");
    throw new ApiError(401, error?.message || "invalid refresh token ");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  // no need to chekc use have or not we put middleware in url
  const { oldPassword, newPassword, confPassword } = req.body; //you can also get againnewpassword for checking passwor dis correct or not but thi stype of thing happening in frontend
  if (newPassword === confPassword)
    throw new ApiError(400, "password and confirm passsword is not matched ! "); // this thing we have do in frontend site so we have to utilize client processor not our server process .
  const user = await User.findById(req.user?._id);
  const isoldPasswordTrue = await user.isPasswordCorrect(oldPassword);
  if (!isoldPasswordTrue)
    throw new ApiError(400, "old password is incorrect....");
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiError(200, {}, "password change succefully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "current user fetched succefullly "));
});

// update User
// this thing which have in our user model 
// username email email ---  avatar coverImage  nee anoher url to update --- watchHistory watch history , refreshToken are edit by server only 

const updateUserDetail = asyncHandler(async (req, res) => {
  const { email , fullname } = req.body ; // geting data fro user to update in user detail if you working with file make sure you have anohter end point just like in text we update from form but for img we click on that than uplod new get thst new image 
  if(!(fullname || email)){
    throw new ApiError(400 , "All fiel are required ! ")
  }
  const user = User.findByIdAndUpdate(req.user?._id ,{
    $set : {
      fullname : fullname ,
      email : email 
    }
  }, {new : true})
}).select("-password")

res.status(200).json(new ApiResponse(200 , user , "account details update successfully"))


// ------------------------------------------update user avatar -----------------------------------
// here we ar enot use request.files because in user creationtime we are getting array of file so we use uplod.files here we upload single upload 
const updateUserAvatar = asyncHandler(async(req , res)=>{
const avatarFile = req.file?.avatar 
if (!avatarFile){ throw new ApiError(400 ,  "please upload valid profile avatar is required ! ")}
const avatar = await uploadOnCloudniary(avatarFile);
if (!avatar.url) {throw new ApiError(500 , "please try after something server error ")}
const user = await User.findByIdAndUpdate(req.user?._id , { 
  $set : {
    avatar : avatar.url
  }
} , {new : true }).select("-password")

return res.status(200).json(new ApiResponse(200 , user , "user avatar update successfully"))






})
// --------------------------------------------update cover image of user detail ---------

const updateUserCoverImage = asyncHandler(async(req , res)=>{
  const coverImage  = req.file?.coverImage 
  if (!coverImage){ throw new ApiError(400 ,  "please upload valid profile avatar is required ! ")}
  const avatar = await uploadOnCloudniary(coverImage);
  if (!coverImage.url) {throw new ApiError(500 , "please try after something server error ")}
  const user = await User.findByIdAndUpdate(req.user?._id , { 
    $set : {
      coverImage : coverImage.url
    }
  } , {new : true }).select("-password")
  
  return res.status(200).json(new ApiResponse(200 , user , "user avatar update successfully"))
  
  
  
  
  
  
  })

  // ---------------------------------------------------------getuserchanel profile ----

  const getUserChannelProfile  = asyncHandler (async(req , res)=>{
    const {username} = req.params
    if (!username?.trim()){
      throw new ApiError(200 , "username is missing ")

    }
    // User.find({username}) // here you have get id than do aggragation means multiple query we dont we can direclty do aggregation 
    const channel = await  User.aggregate([{
      $match : {
        username: username?.toLowerCase()
      }
      
    }, {
      $lookup: {
        from : "Subscription",
        localField : "_id",
        foreignField : "channel",
        as : "subscribers"
      }
    },
    {
      $lookup : {
        from : "Subscription",
        localField : "_id",
        foreignField : "subscriber",
        as : "subscribeTo"
      }
    },
    {
      $addFields : {
        subscriberCount : {
          $size : "$subscribers"
        },
        subscriberToCount :{
          $size : "$subscribeTo"
        },
        isSubscribed : {
          $cond : {
            if : {$in : [req.user?._id , "subscribers.subscriber"]}, // $in work bith both array and object 
            then : true ,
            else : false
          }
        }
      },
      

    },
    {
      $project : {
        // in projected we want to decide what we have to pass in final object we just put 1  to clarify. 
        fullName : 1, 
        username : 1 ,
        subscriberCount : 1 ,
        subscriberToCount : 1 ,
        isSubscribed : 1 ,
        avatar : 1 ,
        coverImage : 1 ,
        email : 1 

        
      }

    }
  
  
  ])
console.log(channel ,"checking what type of data we are gettin gfrom channel aggregration");

  })
  if(!channel?.length) {
    throw new ApiError(404 , "channel does not exists ..")
  }

  return res.status(200).json(new ApiResponse(200 , channel[0] , "user Channel fetched succefully " ))
   


//------------------------------------------------ delete user

const deleteUser = asyncHandler(async (req, res) => {});

// get User
const getUser = asyncHandler(async (req, res) => {
  res.end(" i am working well get method og user or form  ");
});

// logout User

export {
  refressAccessToken,
  registerUser,
  updateUserDetail,
  updateUserAvatar,
  updateUserCoverImage,
  deleteUser,
  getUser,
  logoutUser,
  loginUser,
  changeCurrentPassword,
  getCurrentUser,
  getUserChannelProfile,

};
