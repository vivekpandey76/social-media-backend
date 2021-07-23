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

module.exports = router;
