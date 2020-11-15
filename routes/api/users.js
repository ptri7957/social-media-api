const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const User = require("../../models/Users");
const router = express.Router();

router.post(
  "/",
  [
    check("username", "Username cannot be empty").not().isEmpty(),
    check("email", "Email must be in the correct format").isEmail(),
    check("password", "Password must contain at least 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }
      const { username, email, password } = req.body;
      const hashPassword = await bcrypt.hash(password, 10);
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({
          errors: [
            {
              msg: "User already exists",
            },
          ],
        });
      }
      user = new User({
        username,
        email,
        password: hashPassword,
      });

      await user.save();

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
            console.log("Hello")
            return res.json({ token });
          }
        }
      );
    } catch (error) {
      return res.status(500).json(error);
    }
  }
);

module.exports = router;
