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
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("Post has been updated");
    } else {
      res.status(403).json("You cannot update someoneElse id");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//Delete a post

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("Post has been deleted");
    } else {
      res.status(403).json("You cannot Delete someonelse post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//Liked a post
//Get a post
//get all post of user following

module.exports = router;
