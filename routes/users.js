const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//Update user

router.put("/:id", async (req, res) => {
  //Userid matches to the registered userId then only this condition will run
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    //Updating password : If user might want to change their password
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;
      } catch (error) {
        return res.status(500).json(error);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account Updated Succesfully");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res
      .status(403)
      .json("You are not authorize to update someone else account");
  }
});

//Delete a user

router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account deleted Succesfully");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    return res.status(403).send("You can delete only your account");
  }
});

//get a User

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    //In this line we don't want user password so we are just taking that part from user object which we need for website
    const { password, updatedAt, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Follow a user

router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        //It will check if user is not folllowed then it will update
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { following: req.body.userId } });
        res.status(200).json("You Followed successfully");
      } else {
        res.status(403).json("You already followed him");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You cannot follow yourself");
  }
});

//Unfollow user

router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { following: req.body.userId } });
        res.status(200).json("You unfollowed him successfully");
      } else {
        res.status(403).json("You can't unfollow userSelf ");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You can't unfollow him");
  }
});

module.exports = router;
