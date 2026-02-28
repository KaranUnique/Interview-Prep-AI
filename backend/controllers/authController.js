const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const VerificationToken = require("../models/VerificationToken");
const { sendVerificationEmail } = require("../utils/mailer");

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc Register a new user
// @route POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, profileImageUrl } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profileImageUrl,
        });

        // create verification token
        const emailToken = crypto.randomBytes(32).toString("hex");
        await VerificationToken.create({
            userId: user._id,
            token: emailToken,
        });

        // send verification email
        try {
            await sendVerificationEmail(user.email, emailToken);
        } catch (emailError) {
            console.error("Failed to send verification email:", emailError);
            // We still return success but maybe could alert the user
        }

        // Return user data with JWT
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            isVerified: user.isVerified,
            token: generateToken(user._id),
            message: "Registration successful. Please check your email to verify your account."
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Login user
// @route POST /api/auth/login
// @access Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(500).json({ message: "Invalid email or password" })
        }

        // compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(500).json({ message: "Invalid email or password" });
        }

        // return user data with JWT
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            isVerified: user.isVerified,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Get user profile
// @route GET /api/auth/profile
// @access Private (Require JWT)
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
// @desc Verify user email
// @route GET /api/auth/verify-email/:token
// @access Public
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const verificationToken = await VerificationToken.findOne({ token });

        if (!verificationToken) {
            return res.status(400).json({ message: "Invalid or expired verification token" });
        }

        const user = await User.findById(verificationToken.userId);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "User is already verified" });
        }

        user.isVerified = true;
        await user.save();

        await VerificationToken.findByIdAndDelete(verificationToken._id);

        res.json({ message: "Email verified successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { registerUser, loginUser, getUserProfile, verifyEmail };