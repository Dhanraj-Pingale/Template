import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const initializePassport = () => {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });

          if (!user) {
            console.log("User not found");
            return done(null, false, { message: "Incorrect email." });
          }

          // Compare the password using bcrypt
          const isValidPassword = await bcrypt.compare(password, user.password);

          if (!isValidPassword) {
            console.log("Password does not match");
            return done(null, false, { message: "Incorrect password." });
          }

          console.log("Login successful");
          return done(null, user);
        } catch (error) {
          console.error("Error during login:", error);
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

export default initializePassport;