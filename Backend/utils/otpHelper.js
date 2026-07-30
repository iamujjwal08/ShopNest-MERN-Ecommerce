const crypto = require("crypto");

const OTP_EXPIRY_MINUTES = 5;

// Generates a 6-digit numeric OTP
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Hashes the OTP before storing it in the database (never store raw OTP)
const hashOtp = (otp) => {
    return crypto.createHash("sha256").update(otp).digest("hex");
};

// Returns a Date object OTP_EXPIRY_MINUTES from now
const getOtpExpiry = () => {
    return new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
};

module.exports = { generateOtp, hashOtp, getOtpExpiry, OTP_EXPIRY_MINUTES };
