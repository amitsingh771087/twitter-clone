import bcrypt from "bcryptjs";
import {v2 as cloudinary} from 'cloudinary';


import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(`Error in UserPorfile COntroller ${error.message}`);
  }
};

export const followUnfollowUser = async (req, res) => {
  const { id } = req.params;
  try {
    const userModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You Can't follow and Unfollow Yourself" });
    }

    if (!userModify || !currentUser) {
      return res.status(400).json({ error: "User Not Found" });
    }

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      // unFollow the user
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      res.status(200).json({ message: "User unFollow Successfully" });
    } else {
      // follow the user

      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

      // send Notification to user
      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: userModify._id,
      });
      await newNotification.save();
      // return a id of a user as a response
      res.status(200).json({ message: "User Follow Successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(`Error in followUnfollow Controller ${error.message}`);
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const UserId = req.user._id;
    console.log(req.user._id);
    const userFollowedByMe = await User.findById(UserId).select("following");

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: UserId },
        },
      },
      { $sample: { size: 10 } },
    ]);

    const filteredUser = users.filter(
      (user) => !userFollowedByMe.following.includes(user._id)
    );
    const suggestedUsers = filteredUser.slice(0, 4);

    suggestedUsers.forEach((user) => (user.password = null));

    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log(`Error in getSuggested user ${error.message}`);
    req.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { fullName, email, username, currentPassword, newPassword, bio, link } =
    req.body;
  let { profileImg, coverImg } = req.body;
  const userId = req.user._id;
  try {
    let user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User Not Found" });

    if (
      (!newPassword && currentPassword) ||
      (!currentPassword && newPassword)
    ) {
      return res
        .status(404)
        .json({
          error: "Please Provide both current password and new password",
        });
    }

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ mess: "current Password is incorrect" });
      }
      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ error: "password must be at least 6 character long " });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword , salt)

    }
    if(profileImg){
      if(user.profileImg){
        await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0])
      }
     const uploadedResponse =  await cloudinary.uploader.upload(profileImg);
     profileImg = uploadedResponse.secure_url;

    }
    if(coverImg){
      if(user.coverImg){
        await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0])
      }
      const uploadedResponse =  await cloudinary.uploader.upload(coverImg);
      coverImg = uploadedResponse.secure_url;
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;
    

    user = await user.save()
    user.password = null
    return res.status(200).json(user)

  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(`Error in updateUser Controller ${error.message}`);
  }

  
};
