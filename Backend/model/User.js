const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    // User email verified or not
    verified: {
      type: Boolean,
      default: false,
    },

    // Stores hashed OTP
    otp: {
      type: String,
      default: null,
    },

    // OTP expiry time
    otpExpire: {
      type: Date,
      default: null,
    },

    // Why OTP was generated
    otpPurpose: {
      type: String,
      enum: ["register", "login"],
      default: null,
    },

    // Optional: Count wrong OTP attempts
    otpAttempts: {
      type: Number,
      default: 0,
    },

    // Optional: Prevent OTP spam
    otpLastSent: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);