import express from "express"
import { protectedRoute } from "../middleware/protectedRoute.js";

import {getUserProfile , followUnfollowUser , getSuggestedUsers , updateUser} from "../controllers/user.controller.js"

const routes = express.Router();

routes.get("/profile/:username" ,protectedRoute, getUserProfile)
routes.get("/suggestion" ,protectedRoute, getSuggestedUsers)
routes.post("/follow/:id" ,protectedRoute , followUnfollowUser)
routes.post("/update" ,protectedRoute, updateUser)

export default routes;