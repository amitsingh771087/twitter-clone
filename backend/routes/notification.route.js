import express from 'express';
import { protectedRoute } from '../middleware/protectedRoute.js';
import {getNotifications ,deleteNotifications } from '../controllers/notification.controller.js'
// import { deleteNotification } from '../controllers/notification.controller.js'

const routes = express.Router();


routes.get('/' , protectedRoute , getNotifications)
routes.delete('/' , protectedRoute , deleteNotifications)

// routes.delete('/:id' , protectedRoute , deleteNotification)


export default routes;