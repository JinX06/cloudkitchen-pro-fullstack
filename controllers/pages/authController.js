const User = require('../../models/User');
const { nextID, incrementID } = require('../../utils/id');

function getLoginPage(req, res) {
  res.render('auth/login.html', { error: null, form: {} });
}

async function postLogin(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const err = new Error('Email and password must not be blank.');
      err.status = 400;
      throw err;
    }
    const cleanedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanedEmail });
    if (!user || user.password !== password) {
      const message = 'Invalid email or password';
      return res.status(401).render('auth/login.html', { error: message, form: { email: cleanedEmail } });
    }

    // If found the user, log them in
    await User.updateOne({ _id: user._id }, { $set: { loggedIn: true } });
    return res.redirect(`/home-34076352?userId=${user.userId}`);

  } catch (err) {

    const status = err.status || 400;
    return res.status(status).render('auth/login.html', { error: err.message, form: { email: req.body.email } });
  }
}

async function getLogout(req, res, next) {
  try {
    // Set loggedIn flag to false and redirect to welcome page
    if (req.currentUser) {
      await User.updateOne({ userId: req.currentUser.userId }, { $set: { loggedIn: false } });
    }
    return res.redirect('/welcome-34076352');
  } catch (err) {
    return next(err);
  }
}

function getSignupPage(req, res) {
  res.render('auth/signup.html', { error: null, form: {} });
}

async function postSignup(req, res, next) {
  try {
    const { email, password, fullname, role, phone } = req.body;
    
    // Simple validations so users don't see raw Mongoose errors
    
    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRegex.test(password)) {
      const err = new Error('Password must be 8+ chars and include uppercase, lowercase, number, and special character.');
      err.status = 400;
      throw err;
    }

    // Full name validation
    const nameRegex = /^[A-Za-z][A-Za-z\s\-']{1,99}$/;
    if (!nameRegex.test((fullname || '').trim())) {
      const form = { fullname, phone, role, email };
      return res.status(400).render('auth/signup.html', {
        error: 'Full name must start with a letter and contain only letters, spaces, hyphens, or apostrophes (2-100 characters).',
        form,
      });
    }

    // Email validation
    // email REGEX from: https://emailregex.com/index.html
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const submittedEmail = (email || '').trim();
    if (!emailRegex.test(submittedEmail)) {
      const form = { fullname, phone, role, email: submittedEmail };
      return res.status(400).render('auth/signup.html', {
        error: 'Please provide a valid email address (e.g. mymail@gmail.com).',
        form,
      });
    }

    // Distinct/unique email check
    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) {
      const err = new Error('Email already registered');
      err.status = 400;
      throw err;
    }

    // Create the user and log them in
    const userId = await nextID('user');
    const user = await User.create({ userId, email, password, fullname, role, phone, loggedIn: false });
    
    // Increment ID and log in
    await incrementID('user');
    await User.updateOne({ _id: user._id }, { $set: { loggedIn: true } });
    return res.redirect(`/home-34076352?userId=${user.userId}`);

  } catch (err) {
    const status = err.status || 400;
    const form = {
      // ....? - optional chaining to avoid crashing if req.body is undefined or not given
      fullname: req.body?.fullname || '',
      phone: req.body?.phone || '',
      role: req.body?.role || '',
      email: req.body?.email || ''
    };
    let message = err.message;
    return res.status(status).render('auth/signup.html', { error: message, form });
  }
}

module.exports = { getLoginPage, postLogin, getLogout, getSignupPage, postSignup };
