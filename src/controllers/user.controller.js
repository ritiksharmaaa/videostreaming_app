import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudniary } from "../utils/file_upload_cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


// note : alway check file from bottom to up 
// postman can send space also whichcreate conflict password_ _this is space which not shee but affect to access 
// use trim data when user submit data because they add some extra space


// srp follow based code for login 

const generateAccessAndRefereshToken = async (userid)=>{
  try {
     const user = await User.findById(userid)
     const accessToken =  user.generateAccessToken()
     const refreshToken = user.generateRefreshToken()
     user.refreshToken = refreshToken
     await user.save({validateBeforeSave : false })// it say to shama dont ask about required fiedl just save this which i want to save . 
   return { accessToken , refreshToken }

    
  } catch (error) {
    console.log(error , " something went wrong while genrating ");
  }

}



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
  const {username , password , email  } = req.body ; //you can take email as well 
  if([username || email , password].some((field)=>{
    field?.trim() == ""
  })){
    throw ApiError(400 , "username and password is required ...");
  }
  const user = await User.findOne({
    $or: [{username : username} , {email : email }]  });
  if(!user) throw ApiError(400 , "User Does not exist..");
  const isPasswordCorrect = await user.isPasswordCorrect(password)
  if(!isPasswordCorrect) throw new ApiError(401 , "User password is incorrect ....");
  // follow srp of design pricipal not create token there intead create a function who gerate it and code segrigate .. 
  // const accessToken = await user.generateAccessToken() // send to user 
  // const refressToken = await user.generateRefreshToken() //save to db this token and send to user
  const {accessToken , refreshToken } = await generateAccessAndRefereshToken(user._id) 
  // option in appwrite when we login it send back user object so we can furthure do userbased operation --in api when you login you are login than next time when  you call get user detail to save in our state 
  // so you can send user detail from here we use sign token data for server side requesting 
  // send this user data so frontend can request base on user . 
  const loggedInUser = await User.findById(user._id).select(" -password -refreshToken ")
  const options = {
    httpOnly: true , // if httponly and secure true the cookie is only modfidable by server only 
    secure : true ,

  }
  
  return res.status(200).cookie("accessToken" , accessToken , option ).cookie("refressToken" , refreshToken , options)
  .json( new ApiResponse(200 , {
    user : loggedInUser , accessToken , refreshToken
    // why we send this data of user ans refress and acces token  when we send this data in cookie so , here we take case of mobile developer in mobile cookie not work so may we user can store this refress and accesstoken to user so next time is send this data manualyy in header .
  } , "user logedIn User Succefully...."))


});

// -------------------------------------------------logout user -------------------------------
// first if user login they have someable to acces user id and send to server in front end in backend we have a req thre we add user data in req by auth middleware so we can access user id from there 
// find user based  user id 
// or use condition shwowing logoout button in front end // in server side we have attach a middleawre which check only login user call logout 
// fetch data from db and update refreee token filed to be  null or empty 
// we have to delete the cookie from user browser .


const logoutUser = asyncHandler(async (req, res) => {
  // const user = req.user // this came from auth middleware because it check jwt token and add a user object in req 
  if (!req.user) return null ;
  const user = User.findByIdAndUpdate(
    req.user._id , {
    $set :{ refreshToken : undefined} 
  },
  {
    new : true // mean after this you will get updated refresstoken 
  }
)
const options = {
  httpOnly: true , // if httponly and secure true the cookie is only modfidable by server only 
  secure : true ,

}

res.status(200).clearCookie("accessToken").clearCookie("refreshToken").json(ApiResponse(200 , {} , "user logout succefully ...."))

});

// update User 


const updateUser = asyncHandler(async (req, res) => {});

// delete user 


const deleteUser = asyncHandler(async (req, res) => {});

// get User
const getUser = asyncHandler(async (req, res) => {
  res.end(" i am working well get method og user or form  ");
});

// logout User 


export { registerUser, updateUser, deleteUser, getUser, logoutUser, loginUser };
