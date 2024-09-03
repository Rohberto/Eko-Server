const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    verified: {
      type: Boolean,
      required: true
    },
    role: {
      type: String,
      enum: ['Admin', 'User']
    },
    authType: {
      type: String,
      enum: ["custom", "google"],
      default: "custom"
    }
  });
  const User = mongoose.model('User', userSchema);
 module.exports = User;