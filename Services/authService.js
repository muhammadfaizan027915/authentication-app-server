const Strategy = require("passport-local").Strategy;
const User = require("../Models/User");
const bcrypt = require("bcrypt");

module.exports = (passport) => {
  passport.use(
    new Strategy(
      { usernameField: "email", passwordField: "password" },
      async (email, password, done) => {
        const user = await User.findOne({ email });

        if (!user)
          return done(null, false, {
            message: "No user exists with this email!",
          });

        bcrypt
          .compare(password, user.password)
          .then((match) => {
            if (match)
              return done(null, user, { message: "Logged In Successfully!" });
            return done(null, false, {
              message: "Wrong username or password!",
            });
          })
          .catch((err) => {
            return done(null, false, { message: "Somgthing went worng!" });
          });
      }
    )
  );

  passport.serializeUser((user, done) => {
    process.nextTick(() => {
      done(null, user._id);
    });
  });

  passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
      process.nextTick(() => {
        done(null, { ...user, passowrd: null });
      });
    });
  });
};
