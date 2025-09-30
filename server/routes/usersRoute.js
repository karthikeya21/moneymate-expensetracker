const express = require("express");
const User = require("../models/User");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth");

// ---------------- Email/Password Login ----------------
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // TODO: Hash passwords with bcrypt (recommended)
    if (user.password !== req.body.password)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }, token });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- Registration ----------------
router.post("/register", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.send("User registered successfully");
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ---------------- Google OAuth ----------------
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    const userForClient = {
        name: req.user.name,
        email: req.user.email,
        _id: req.user._id
    };
    const userString = encodeURIComponent(JSON.stringify(userForClient));
    const CLIENT_URL = process.env.CLIENT_URL;
    res.redirect(`${CLIENT_URL}/oauth-success?token=${token}&user=${userString}`);

  }
);

module.exports = router;
