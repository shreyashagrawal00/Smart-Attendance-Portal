const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create a transporter using Gmail
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS, // This MUST be an App Password, not a regular password
        },
    });

    const mailOptions = {
        from: `"e-हाज़री Support" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    console.log(`Attempting to send Gmail to ${options.email}...`);
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully via Gmail. ID: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error('Gmail sending failed:', error);
        throw error;
    }
};

module.exports = sendEmail;
