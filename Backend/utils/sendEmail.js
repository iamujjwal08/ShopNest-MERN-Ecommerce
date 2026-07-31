const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.PASSWORD,
    },
});

// Verify only once when the server starts
transporter.verify((error) => {
    if (error) {
        console.log("SMTP Error:", error);
    } else {
        console.log("SMTP Connected");
    }
});

const sendEmail = async (to, subject, text) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        });

        console.log("Mail Sent:", info.response);
    } catch (error) {
        console.error("EMAIL ERROR:", error);
        throw error;
    }
};

module.exports = sendEmail;