const express = require("express");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Post = require("../../models/Post");
const Comment = require("../../models/Comment");
const router = express.Router();

router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId });
    return res.json(comments);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.post(
  "/:postId",
  [auth, [check("comment", "Comment cannot be empty").not().isEmpty()]],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }

      const { comment } = req.body;
      
      const comments = await Comment.findOne({post: req.params.postId});

      if(!comments){
        return res.status(404).json({
          msg: "Post does not exist"
        });
      }
      comments.comments.unshift({
        user: req.user.id,
        comment: comment
      });

      await comments.save();

      return res.json(comments);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
);

router.delete("/:postId/:commentId", auth, async (req, res) => {
  try {

    const comments = await Comment.findOne({ post: req.params.postId });
    const comment = comments.comments.find( comment => comment.id.toString() === req.params.commentId );

    if(!comment){
      return res.status(404).json({
        msg: "Comment does not exist"
      });
    }

    if(comment.user.toString() !== req.user.id){
      return res.status(401).json({
        msg: "Unauthorised."
      });
    }
    comments.comments = comments.comments.filter(comment => comment.id.toString() !== req.params.commentId);
    await comments.save();

    return res.json({
      msg: "Comment removed",
    });

  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
