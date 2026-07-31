const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendEmail");
const {
    generateOtp,
    hashOtp,
    getOtpExpiry,
} = require("../utils/otpHelper");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};
// register user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({name,email,password: hashedPassword,});
        if(user) {
                    const otp = generateOtp();
                    const hashedOtp = hashOtp(otp);
                    user.otp = hashedOtp;
                    user.otpExpire = getOtpExpiry();
                    user.otpPurpose = "register";
                    user.otpAttempts = 0;
                    user.otpLastSent = new Date();

                    await user.save();
                    console.log("User saved:", user.email);
                    const message = `Welcome to ShopNest. Your OTP is ${otp}`;
                    console.log("Sending OTP to:", user.email);
                    console.log("OTP:", otp);

                    await sendMail(
                        user.email,
                        "Welcome to ShopNest - Verify Your Email",message
                    );

                console.log("Email sent successfully");
                    return res.status(201).json({
                    success: true,
                    message: "Registration successful. OTP sent to your email.",
                    email: user.email,
                });
            }
            else {
                return res.status(400).json({ message: "Invalid user" });
            }
    } 
    catch (error) {
    console.log(error);
    res.status(500).json({
        message: error.message
    });
}
};


// login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid Credentials",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid Credentials",
            });
        }

        // Check email verification
        if (!user.verified) {
            return res.status(403).json({
                message: "Please verify your email first.",
            });
        }

        // Generate OTP
        const otp = generateOtp();
        const hashedOtp = hashOtp(otp);

        // Save OTP
        user.otp = hashedOtp;
        user.otpExpire = getOtpExpiry();
        user.otpPurpose = "login";
        user.otpAttempts = 0;
        user.otpLastSent = new Date();

        await user.save();

        // Send OTP Email
        const message = `Your ShopNest login OTP is ${otp}. It is valid for 5 minutes.`;

        await sendMail(
            user.email,
            "ShopNest Login OTP",
            message
        );

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            email: user.email,
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: error.message,
        });
    }
};
// verify OTP
const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (!user.otp) {
            return res.status(400).json({
                message: "No OTP found. Please request a new OTP.",
            });
        }

        if (!user.otpExpire || user.otpExpire.getTime() < Date.now()) {
        return res.status(410).json({
            message: "OTP expired. Please request a new OTP.",
        });
    }
    if (user.otpAttempts >= 5) {
    return res.status(429).json({
        message: "Too many invalid OTP attempts. Please request a new OTP.",
    });
}

        const hashedOtp = hashOtp(otp);

        if (user.otp !== hashedOtp) {
    user.otpAttempts += 1;
    await user.save();

    return res.status(400).json({
        message: "Invalid OTP",
    });
}
        

        // If OTP was for registration
        if (user.otpPurpose === "register") {
            user.verified = true;
        }

        // Clear OTP
        user.otp = null;
        user.otpExpire = null;
        user.otpPurpose = null;
        user.otpAttempts = 0;
        user.otpLastSent = null;

        await user.save();

        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: error.message,
        });
    }
};

const resendOtp = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        if (
        user.otpLastSent &&
        Date.now() - new Date(user.otpLastSent).getTime() < 60 * 1000
        ) 
        {
            return res.status(429).json({
                message: "Please wait 60 seconds before requesting another OTP.",
            }); 
        }

        const otp = generateOtp();

        user.otp = hashOtp(otp);
        user.otpExpire = getOtpExpiry();
        user.otpAttempts = 0;
        user.otpLastSent = new Date();

        await user.save();

        await sendMail(
            user.email,
            "ShopNest OTP",
            `Your OTP is ${otp}. It is valid for 5 minutes.`
        );

        return res.status(200).json({
            success: true,
            message: "OTP resent successfully",
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: error.message,
        });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
        return res.json(users);
    } 
    catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
};
module.exports = {
    registerUser,
    loginUser,
    verifyOtp,
    resendOtp,
    getUsers,
};