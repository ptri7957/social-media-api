const express = require("express");
const auth = require("../../middleware/auth");
const Like = require("../../models/Like");
const Post = require("../../models/Post");
const router = express.Router();

router.get("/:postId", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(400).json({
        msg: "Post not found",
      });
    }
    const likes = await Like.find({ post: req.params.postId });
    return res.json(likes);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.post("/:postId", auth, async (req, res) => {
  try {
    const likes = await Like.findOne({
      post: req.params.postId,
    });

    if (!likes) {
      return res.status(404).json({
        msg: "Post does not exist",
      });
    }

    const checkLike = likes.likes.filter(
      (like) => like.user.toString() === req.user.id
    ).length;

    if (checkLike > 0) {
      return res.status(400).json({
        msg: "User already liked post",
      });
    }

    likes.likes.unshift({ user: req.user.id });

    await likes.save();

    return res.json(likes);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.put("/:postId", auth, async (req, res) => {
  try {
    const likes = await Like.findOne({
      post: req.params.postId,
    });

    if (!likes) {
      return res.status(404).json({
        msg: "Post does not exist",
      });
    }

    const checkLike = likes.likes.filter(
      (like) => like.user.toString() === req.user.id
    ).length;

    if (checkLike < 1) {
      return res.status(400).json({
        msg: "User has not liked post",
      });
    }

    likes.likes = likes.likes.filter(
      (like) => like.user.toString() !== req.user.id
    );
    await likes.save();

    return res.json("Post unliked");
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
