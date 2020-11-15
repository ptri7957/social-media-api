const express = require("express");
const auth = require("../../middleware/auth");
const uploads = require("../../middleware/multer");
const Profile = require("../../models/Profile");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      "username"
    );
    return res.json(profile);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/img/:imgName", (req, res) => {
  res.sendFile(req.app.get("currentdir") + "/uploads/" + req.params.imgName);
});

router.post("/", [
  auth, uploads.single("image")
], async (req, res) => {
  try {
    const profilePic = req.file.filename || "";
    const { bio, location } = req.body;
    const profile = new Profile({
      user: req.user.id,
      bio,
      location,
      profilePic
    });

    await profile.save((err, doc) => {
      if (err) {
        throw err;
      } else {
        Profile.populate(
          doc,
          {
            path: "user",
            select: "-password -email",
          },
          (err, populatedDoc) => {
            return res.json(populatedDoc);
          }
        );
      }
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
