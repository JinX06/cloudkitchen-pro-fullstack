const User = require("../../models/User");
const { peekNextID, incrementID } = require("../../utils/id");

async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const err = new Error("Email and password must not be blank.");
      err.status = 400;
      throw err;
    }
    const cleanedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanedEmail });
    if (!user || user.password !== password) {
      const err = new Error("Invalid credentials");
      err.status = 401;
      throw err;
    }

    // If found the user, log them in
    await User.updateOne({ _id: user._id }, { $set: { loggedIn: true } });
    return res.status(200).json({
      user: {
        userId: user.userId,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        role: user.role,
      }
    });

  } catch (err) {
    const status = err.status || 400;
    return res.status(status).json({ error: err.message });
  }
}

async function logoutUser(req, res, next) {
  try {
    // Set loggedIn flag to false
    const userId = req.query.userId;
    if (userId) {
      await User.updateOne({ userId }, { $set: { loggedIn: false } });
    }
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

async function registerUser(req, res, next) {
  try {
    const { email, password, fullname, role, phone } = req.body;
    
    // Simple validations so users do not see raw Mongoose errors
    
    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRegex.test(password)) {
      const err = new Error("Password must be 8+ chars and include uppercase, lowercase, number, and special character.");
      err.status = 400;
      throw err;
    }

    // Full name validation
    const nameRegex = /^[A-Za-z][A-Za-z\s\-']{1,99}$/;
    if (!nameRegex.test((fullname || "").trim())) {
      const err = new Error("Full name must start with a letter and contain only letters, spaces, hyphens, or apostrophes (2-100 characters).");
      err.status = 400;
      throw err;
    }

    // Email validation
    // email REGEX from: https://emailregex.com/index.html
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const submittedEmail = (email || "").trim();
    if (!emailRegex.test(submittedEmail)) {
      const err = new Error("Please provide a valid email address (e.g. mymail@gmail.com).");
      err.status = 400;
      throw err;
    }

    // Distinct/unique email check
    const normalizedEmail = submittedEmail.toLowerCase();
    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) {
      const err = new Error("Email already registered");
      err.status = 400;
      throw err;
    }

    const phoneRegex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
    if (!phoneRegex.test((phone || "").trim())) {
      const err = new Error("Please provide a valid international phone number (e.g. +61-123-456-789).");
      err.status = 400;
      throw err;
    }

    const allowedRoles = ["admin", "chef", "manager"];
    if (!allowedRoles.includes(role)) {
      const err = new Error("Role must be one of admin, chef, or manager.");
      err.status = 400;
      throw err;
    }

    // Create the user and log them in
    const userId = await peekNextID("user");
    const user = await User.create({
      userId,
      email: normalizedEmail,
      password,
      fullname: fullname.trim(),
      role,
      phone: phone.trim(),
      loggedIn: true,
    });
    
    // Increment ID for the next user
    await incrementID("user");
    return res.status(201).json({
      user: {
        userId: user.userId,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        role: user.role,
      }
    });

  } catch (err) {
    const status = err.status || 400;
    return res.status(status).json({ error: err.message });
  }
}

module.exports = { registerUser, loginUser, logoutUser };
