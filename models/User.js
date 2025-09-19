const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    // email REGEX from: https://emailregex.com/index.html
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  },

  password: {
    type: String,
    required: true,
    validate: {
      // password REGEX from: https://ihateregex.io/expr/password/
      validator: (v) => /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/.test(v),
      message: 'Password must be 8+ chars and include uppercase, lowercase, number, and special character.'
    }
  },

  fullname: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
    match: [/^[A-Za-z][A-Za-z\s\-']{1,99}$/, "Full name must start with a letter and contain only letters, spaces, hyphens, or apostrophes (2-100 characters)."],
  },

  role: { type: String, enum: ['admin', 'chef', 'manager'], required: true },

  phone: {
    type: String,
    required: true,
    trim: true,
    match: /^\+(?:[0-9] ?){6,14}[0-9]$/
    // International Phone number REGEX From:
    // https://www.oreilly.com/library/view/regular-expressions-cookbook/9781449327453/ch04s03.html

  },

  loggedIn: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
