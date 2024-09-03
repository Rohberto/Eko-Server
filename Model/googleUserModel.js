const mongoose = require('mongoose');
const googleUserSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    userid: {
        type: String,
        required: true,
        trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      enum: ['Admin', 'User'],
      default: "User"
    }
  });
  const googleUser = mongoose.model('googleUser', googleUserSchema);
 module.exports = googleUser;