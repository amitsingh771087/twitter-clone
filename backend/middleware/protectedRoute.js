import User from "../models/user.model.js";
import jwt from "jsonwebtoken"

export const protectedRoute = async (req , res , next)=>{
   
    try {
        
        const token = req.cookies.jwt;
        
        
        if(!token){
            return res.status(401).json({error:"Unauthorized : No token Provided"})
        }
        const decoded = jwt.verify(token , process.env.JWT_SECRET)
        

        if(!decoded){
            return res.status(401).json({error:"Unauthorized :Invalid Token"});
        }
        const user = await User.findById(decoded.userId).select("-password")
        if(!user){
            return res.status(404).json({error:"User Not Found"});
        }
        // console.log(`req.user ${req.users}`);
        req.user = user;
        next();
    } catch (error) {
        
        console.log(`Error in ProtectedRoute Middleware ${error.message}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
}