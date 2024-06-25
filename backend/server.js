import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js"
import connectMongoDB from "./db/conectMongoDB.js";


dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000



app.use(express.json());//to parse request.body
app.use(express.urlencoded({extended:true })) //to parse from data

app.use(cookieParser());

app.use("/api/auth", authRoutes)




app.listen(PORT, ()=>{
console.log(`Server was running on Port ${PORT}`)
connectMongoDB();
})