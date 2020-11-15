const express = require("express");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Post = require("../../models/Post");
const Comment = require("../../models/Comment");
const Like = require("../../models/Like");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const query = req.query.userId;
    const posts = await Post.find({ user: query }).populate("user", "username");
    return res.json(posts);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.get("/following", auth, async (req, res) => {
  try {
    await Post.aggregate([
      {
        $lookup: {
          from: "Follow",
          localField: "user",
          foreignField: "followee",
          as: "followingPosts"
        }
      },
      {
        $match: {
          "followingPosts.follower": mongoose.Types.ObjectId(req.user.id)
        }
      }
    ]).exec((err, docs) => {
      Post.populate(docs, {
        path: "user",
        select: "username"
      }, (err, posts) => {
        return res.json(posts);
      });
    });
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.get("/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      res.status(400).send("Post Not Found");
    }
    return res.json(post).populate("user", "username");
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.post(
  "/",
  [auth, [check("body", "Post body cannot be empty").not().isEmpty()]],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }

      const { body } = req.body;

      const post = new Post({
        user: req.user.id,
        body,
      });

      const likes = new Like({
        post: post.id,
        likes: []
      });

      const comments = new Comment({
        post: post.id,
        comments: []
      });

      await post.save();
      await likes.save();
      await comments.save();

      return res.json(post);
      
    } catch (error) {
      return res.status(500).json(error);
    }
  }
);

router.delete("/:postId", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(400).json({
        msg: "Cannot find post",
      });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({
        msg: "Post does not belong to this user.",
      });
    }

    await Post.findByIdAndRemove(req.params.postId);
    await Comment.findOneAndRemove(req.params.postId);
    await Like.findOneAndRemove(req.params.postId);

    return res.json({
      msg: "Post removed",
    });

  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
