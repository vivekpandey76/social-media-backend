const router = require("express").Router();
const Post = require("../models/Post");
//create a post

router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    res.status(500).json(error);
  }
});
//update a post
//Delete a post
//Liked a post
//Get a post
//get all post of user following

module.exports = router;
