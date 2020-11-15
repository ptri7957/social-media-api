const express = require("express");
const auth = require("../../middleware/auth");
const Follow = require("../../models/Follow");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const followee = req.query.followee;
    const followers = await Follow.find({ followee })
      .populate("follower", "username")
      .select("follower");
    return res.json(followers);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const followee = req.query.user;
    let follow = await Follow.findOne({
      followee: followee,
      follower: req.user.id,
    });
    if (follow) {
      return res.status(400).json({
        msg: "Cannot follow the same user twice",
      });
    }

    follow = new Follow({
      followee: followee,
      follower: req.user.id,
    });

    await follow.save((err, doc) => {
      if (err) {
        throw err;
      } else {
        Follow.populate(
          doc,
          {
            path: "follower followee",
            select: "username",
          },
          (err, populatedDoc) => {
            return res.json(populatedDoc);
          }
        );
      }
    });
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.delete("/", auth, async (req, res) => {
  try {
    // Find followee based on query and follower (me)
    const follow = await Follow.findOne({
      followee: req.query.userId,
      follower: req.user.id,
    });

    if (!follow) {
      return res.status(400).json({
        msg: "You are not following this user",
      });
    }

    await Follow.findOneAndRemove({
      followee: req.query.userId,
      follower: req.user.id,
    });

    return res.json({
      msg: "Unfollowed user",
    });
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
