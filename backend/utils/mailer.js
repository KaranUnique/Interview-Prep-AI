const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 465,
    secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports usually 587
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const sendVerificationEmail = async (email, token) => {
    try {
        const mailOptions = {
            from: process.env.SUPPROT_EMAIL || process.env.SMTP_USER || "noreply@interviewprepai.com",
            to: email,
            subject: "Verify Your Email - Interview Prep AI",
            html: `
                <h1>Email Verification</h1>
                <p>Thank you for registering! Please click the link below to verify your email address:</p>
                <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/verify-email/${token}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
                <p>This link will expire in 24 hours.</p>
                <p>If you didn't request this, please ignore this email.</p>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Verification email sent:", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw error;
    }
};

module.exports = {
    sendVerificationEmail,
};
