import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "20kb",
  })
);
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static(path.resolve("/public")));
app.use(cookieParser());

//  application route ;

import userRoute from "./routes/user.routes.js"


// route declaration ;

app.use( "/account" , userRoute);

app.get("/", (req, res) => {
  res.end("we are working ! ");
});

export { app };
