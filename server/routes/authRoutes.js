import express from 'express';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router();

// Register user route
router.post('/registerdb', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user instance
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save user to the database
    await user.save();
    res.status(201).json({
      message: 'User registered successfully',
      userId: user._id,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Login route with Passport authentication
router.post("/logindb", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      // Check if authentication failed
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Log in the user and initiate the session
    req.logIn(user, (err) => {
      if (err) return next(err);

      // After login, save session and respond with user data
      req.session.save(() => {
        res.json({
          message: "Logged in successfully",
          user: {
            email: user.email,
            name: user.name,
          },
        });
      });
    });
  })(req, res, next);
});

// Session route to check if user is authenticated
router.get("/session", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({
      isAuthenticated: true,
      user: req.user, // Send user info if authenticated
    });
  } else {
    return res.json({
      isAuthenticated: false,
    });
  }
});

// In your authRoutes.js (or equivalent file)
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Error destroying session' });
      }
      
      res.clearCookie('connect.sid'); // Clear the session cookie
      return res.status(200).json({ message: 'Logged out successfully' });
    });
  });
});


export default router;
