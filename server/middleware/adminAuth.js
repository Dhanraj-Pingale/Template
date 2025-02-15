export const adminAuth = (req, res, next) => {
    if (req.isAuthenticated() && req.user.isAdmin) {
      return next();
    }
    res.status(403).json({ error: 'Access denied: Admins only' });
  };
  