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
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

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
router.post('/logindb', passport.authenticate('local'), (req, res) => {
  res.json({
    message: 'Logged in successfully',
    user: {
      email: req.user.email,
      name: req.user.name,
    },
  });
});

export default router;
