const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
    console.log(`Attempting to send email via Resend to ${options.email}...`);
    try {
        const { data, error } = await resend.emails.send({
            from: 'Smart Attendance <onboarding@resend.dev>',
            to: options.email,
            subject: options.subject,
            text: options.message,
        });

        if (error) {
            console.error('Resend Error:', error);
            throw new Error(error.message);
        }

        console.log(`Email sent successfully via Resend. ID: ${data.id}`);
        return data;
    } catch (error) {
        console.error('Email sending failed:', error.message);
        throw error;
    }
};

module.exports = sendEmail;
