import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const getNotifications  = async (req , res)=>{
    try {

        const userId = req.user._id;

        const notification = await Notification.find({to:userId}).populate({
            path:'from',
            select: " username  profileImg"
        })

        await Notification.updateMany({to:userId} , {read:true})

        res.status(200).json(notification)

        
        
    } catch (error) {
        console.log(`Error in getNotifications Controller ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
    }
}
export const deleteNotifications  = async (req , res)=>{
try {
    const userId = req.user._id;

    await Notification.deleteMany({to:userId})

    res.status(200).json({message : 'Notification deleted Successfully '})

    
} catch (error) {
    console.log(`Error in deleteNotifications Controller ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
}
}

// export const deleteNotification  = async (req , res)=>{
// try {
//     const notificationId = req.param._id;
//     const userId = req.user._id;
//     const notification = await Notification.findById(notificationId);
//     if(!notification){
//         res.status(404).json({error : 'Notification not Found '})
//     } 

//     if(notification.to.toString() !== userId.toString){
//         res.status(403).json({error : 'You are Not authorised to delete this notification '})
//     }

//     await Notification.findByIdAndDelete(notificationId);

//     res.status(200).json({message : 'Notification deleted Successfully '})
    
// } catch (error) {
//     console.log(`Error in deleteNotification Controller ${error}`);
//     res.status(500).json({ error: "Internal Server Error" });
// }
// }