const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validatePassword } = require("../utils/passwordValidator");
const { sendSuccess, sendError } = require("../utils/apiResponse");
const { ERROR_CODES } = require("../utils/errorCodes");

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc Register a new user
// @route POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, profileImageUrl } = req.body;

        // Validate password strength and policy
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            const errorMessages = passwordValidation.policyValidation.errors || [];
            return sendError(
                res,
                ERROR_CODES.PASSWORD_TOO_WEAK,
                400,
                "Password does not meet security requirements",
                { requirements: errorMessages, strengthScore: passwordValidation.strengthValidation?.score || 0 }
            );
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return sendError(res, ERROR_CODES.EMAIL_ALREADY_REGISTERED);
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

        // Return user data with JWT
        return sendSuccess(
            res,
            {
                _id: user._id,
                name: user.name,
                email: user.email,
                profileImageUrl: user.profileImageUrl,
                token: generateToken(user._id),
            },
            "User registered successfully",
            201
        );
    } catch (error) {
        console.error('Register error:', error.message, error.stack);
        return sendError(
            res,
            ERROR_CODES.DATABASE_ERROR,
            500,
            "Registration failed",
            process.env.NODE_ENV === 'development' ? error.message : undefined
        );
    }
};

// @desc Login user
// @route POST /api/auth/login
// @access Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return sendError(res, ERROR_CODES.MISSING_REQUIRED_FIELD, 400, "Email and password are required");
        }

        const user = await User.findOne({ email });
        if (!user) {
            return sendError(res, ERROR_CODES.INVALID_CREDENTIALS);
        }

        // compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return sendError(res, ERROR_CODES.INVALID_CREDENTIALS);
        }

        // return user data with JWT
        return sendSuccess(
            res,
            {
                _id: user._id,
                name: user.name,
                email: user.email,
                profileImageUrl: user.profileImageUrl,
                token: generateToken(user._id),
            },
            "Login successful"
        );
    } catch (error) {
        sendError(
            res,
            ERROR_CODES.DATABASE_ERROR,
            500,
            "Login failed",
            process.env.NODE_ENV === 'development' ? error.message : undefined
        );
    }
};

// @desc Get user profile
// @route GET /api/auth/profile
// @access Private (Require JWT)
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return sendError(res, ERROR_CODES.USER_NOT_FOUND);
        }
        return sendSuccess(res, user, "User profile retrieved successfully");
    } catch (error) {
        sendError(
            res,
            ERROR_CODES.DATABASE_ERROR,
            500,
            "Failed to retrieve profile",
            process.env.NODE_ENV === 'development' ? error.message : undefined
        );
    }
};

module.exports = { registerUser, loginUser, getUserProfile };