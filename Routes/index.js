const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../Models/User");
const router = require("express").Router();
const emailer = require("../Services/emailService");
const scheduleEvents = require("../Services/scheduleEvents");

// Email route
router.post("/send-email", (req, res) => {
  const { from, to, subject, name, role, message } = req.body;

  if (!from || !to || !subject || !message)
    return res
      .status(400)
      .json({ message: "Please provide all the required fields!" });

  emailer(from, to, subject, name, role, message)
    .then((info) => {
      res.status(200).json({
        message: "Eamil sent successfully!",
        messageId: info.messageId,
      });
    })
    .catch((error) => {
      res.status(400).json({ message: error.message });
    });
});

// Schedule Name print
router.post("/print-name", (req, res) => {
  const { name } = req.body;

  if (!name)
    return res
      .status(400)
      .json({ message: "Please fill all the required fileds!" });

  const schedule = scheduleEvents(name);

  if (!schedule)
    return res.status(500).json({ message: "Internal server error!" });

  res.status(200).json({ message: "Schedule successfully executed!" });
});

// Sign up User
router.post("/signup", (req, res) => {
  const { email, password, confirmpassword } = req.body;

  if (!email || !password || !confirmpassword)
    return res
      .status(400)
      .json({ message: "Please fill all the required fields! " });

  if (password !== confirmpassword)
    return res.status(400).json({ message: "Confirm password doesnot match!" });

  bcrypt
    .hash(password, 10)
    .then((hash) => {
      const user = new User({ email, password: hash });
      user
        .save()
        .then((user) => {
          req.login(user, (err) => {
            if (err) return;
            return res.status(200).json({ message: "Signed In Successfully!" });
          });
        })
        .catch((err) => {
          console.log(err);
          return res.status(401).json({ message: "Failed to sign in!" });
        });
    })
    .catch((err) => res.status(500).json({ message: "Something went wrong!" }));
});

// Login User
router.post("/login", (req, res) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return res.status(500).json({ message: info.message });
    if (!user) return res.status(404).json({ message: info.message });

    req.logIn(user, (err) => {
      if (err)
        return res.status(500).json({ message: "Internal Server Error!" });
      return res.status(200).json({ message: info.message });
    });
  })(req, res);
});

// User
router.get("/user", (req, res) => {
  if (!req.user) return res.status(403).json({ message: "Unauthorized!" });
  return res.status(200).json({
    user: {
      email: req.user._doc.email,
      id: req.user._doc._id,
    },
  });
});

// Logout User
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Internal Server Error" });
    return res.status(200).json({ message: "Logged out successfuly!" });
  });
});

module.exports = router;
