import mongoose from "mongoose";

// use index name to import easily

// when ever communcate with db use try catch an dasy await alway
// way to connect three way
// direct connect  2 inside EFIE fucntion and in another function

//  note asyncy always give promise 

const connectDB = async () => {
  try {
    // make sure to store connection in a var so you get more detail instead usign promise method
    await mongoose
      .connect(process.env.MONGO_URL)
      .then((data) => {
        // data have bulk information so make sure use variable store .
        console.log("db connected successfull in db file  ....." ,);
      })
      .catch((error) => {
        console.log(error, " error from db connection");
      });
    //  console.log(process.env.MONGO_URL , "and" , db.connection.host
  } catch (error) {
    console.log(error, "error from db connect");
    process.exit(1); // mean os process killing
  }
};


// module.exports = db_connect; this use in common js

export default connectDB;
