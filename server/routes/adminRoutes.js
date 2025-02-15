import express from 'express';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import User from '../models/User.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

// ===== Admin Registration =====
router.post('/adminregister', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin: true,
    });

    await admin.save();
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ===== Admin Login =====
router.post('/adminlogin', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) return next(err);
    if (!user || !user.isAdmin) {
      return res.status(401).json({ error: 'Unauthorized: Admin only' });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      req.session.save(() => {
        res.json({
          message: 'Admin logged in successfully',
          admin: {
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
          },
        });
      });
    });
  })(req, res, next);
});

// ===== View All Users (Admin Only) =====
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// ===== Check Admin Session =====
router.get('/session', (req, res) => {
  if (req.isAuthenticated() && req.user?.isAdmin) {
    res.json({
      isAdminAuthenticated: true,
      user: {
        name: req.user.name,
        email: req.user.email,
        isAdmin: req.user.isAdmin,
      },
    });
  } else {
    res.json({ isAdminAuthenticated: false, user: null });
  }
});



// ===== Admin Logout =====
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });

    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.status(200).json({ message: 'Admin logged out successfully' });
    });
  });
});

export default router;
