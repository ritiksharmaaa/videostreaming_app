import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudniary } from "../utils/file_upload_cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


// note : alway check file from bottom to up 
// postman can send space also whichcreate conflict password_ _this is space which not shee but affect to access 
// use trim data when user submit data because they add some extra space 

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
     fullname : fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
   password :  password,
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

const updateUser = asyncHandler(async (req, res) => {});
const deleteUser = asyncHandler(async (req, res) => {});
const getUser = asyncHandler(async (req, res) => {
  res.end(" i am working well get method og user or form  ");
});
const loginUser = asyncHandler(async (req, res) => {});
const logoutUser = asyncHandler(async (req, res) => {});

export { registerUser, updateUser, deleteUser, getUser, logoutUser, loginUser };
