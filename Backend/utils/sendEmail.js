const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.PASSWORD,
            },
        });

        await transporter.verify();
        console.log("SMTP Connected");

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        });

        console.log("Mail Sent:", info.response);
    } catch (error) {
        console.error("EMAIL ERROR:");
        console.error(error);
    }
};

module.exports = sendEmail;