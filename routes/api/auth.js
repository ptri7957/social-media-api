const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../../middleware/auth");
const User = require("../../models/Users");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    return res.json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        errors: [
          {
            msg: "User does not exist",
          },
        ],
      });
    }

    const correctPassword = await bcrypt.compare(password, user.password);

    if (!correctPassword) {
      return res.status(401).json({
        errors: [
          {
            msg: "Password incorrect",
          },
        ],
      });
    } else {
      const payload = {
        user: {
          id: user.id,
          username: user.username,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000000 },
        (err, token) => {
          if (err) {
            throw err;
          } else {
            return res.json({ token });
          }
        }
      );
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
