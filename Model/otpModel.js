const mongoose = require("mongoose");
const otpSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    otp: { type: String, required: true },
    createdAt: {type: Date, required: true},
    expireAt: {type: Date, required: true}
}, {
    timestamps: true
});

otpSchema.index({"expireAt": 1}, {expireAfterSeconds: 0});
const Otps = mongoose.model('otps', otpSchema);

module.exports = Otps;