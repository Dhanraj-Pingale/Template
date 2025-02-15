import express from 'express';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router();

// ===== Register User =====
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
      isAdmin: false,
    });
    await user.save();
    res.status(201).json({ message: 'User registered successfully', userId: user._id });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ===== Login User (No Admin Allowed) =====
router.post('/logindb', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    if (user.isAdmin) {
      return res.status(403).json({ message: 'Access denied: Users only' });
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      req.session.save(() => {
        res.json({
          message: 'Logged in successfully',
          user: { email: user.email, name: user.name, isAdmin: user.isAdmin },
        });
      });
    });
  })(req, res, next);
});

// ===== Check User Session =====
router.get('/session', (req, res) => {
  res.json({ isAuthenticated: req.isAuthenticated(), user: req.user || null });
});

// ===== Logout User =====
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ message: 'Error destroying session' });
      res.clearCookie('connect.sid');
      res.status(200).json({ message: 'Logged out successfully' });
    });
  });
});

export default router;
