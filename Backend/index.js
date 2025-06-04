import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors"

import userRouter from "./routes/user.route.js";
import promptRouter from "./routes/prompt.route.js"


dotenv.config();

const app = express()
const port = process.env.PORT || 4001
const MONGO_URL=process.env.MONGO_URI


//midleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin:process.env.FRONTEND_URL,
  credentials:true,
  methods:["GET","POST","PUT","DELETE"],
  allowedHeaders:["Content-Type","Authorization"]
}));

//db connection
mongoose.connect(MONGO_URL)
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((error)=>{
    console.log("MongoDB connection Error: ",error)
})


//routes
app.use("/api/v1/user",userRouter)
app.use("/api/v1/deepseekai",promptRouter)



app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
