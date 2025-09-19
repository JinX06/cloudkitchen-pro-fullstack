const User = require('../models/User');

// Middleware to attach current user to req and res.locals if userId is in query string
async function attachCurrentUser(req, res, next) {
  try {
    const userId = req.query.userId;
    if (!userId) {
      res.locals.currentUser = null;
      return next();
    }
    const user = await User.findOne({ userId, loggedIn: true });
    if (user) {
      req.currentUser = user;
      res.locals.currentUser = user;
    } else {
      res.locals.currentUser = null;
    }
    return next();
  } catch (err) {
    return next(err);
  }
}

// Middleware to require authentication
function requireAuth(req, res, next) {
  if (!req.currentUser) {
    return res.redirect('/login-34076352?notice=login-required');
  }
  return next();
}

// Middleware to require specific user role
function requireRole(role) {
  return (req, res, next) => {
    if (!req.currentUser) return res.redirect('/login-34076352?notice=login-required');
    if (req.currentUser.role !== role) {
      const err = new Error('Forbidden: insufficient permissions');
      err.status = 403;
      return next(err);
    }
    return next();
  };
}

module.exports = { attachCurrentUser, requireAuth, requireRole };

