const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendEmail");

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

        const user =  await User.create({ name, email, password: hashedPassword });
        if(user) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const message = `welcome to shopNest, your otp is ${otp}`;
            await sendMail(email, 'welcome to shopnest - your otp for verification is', message);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        }
        else {
            res.status(400).json({ message: "Invalid user" });
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
        if (user && await bcrypt.compare(password, user.password)) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } 
        else {
            res.status(400).json({ message: "Invalid Credentials" });
        }
    } 
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};


const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
        res.json(users);
    } 
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
module.exports = { registerUser, loginUser, getUsers };