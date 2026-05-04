const { Resend } = require('resend');

const sendEmail = async (options) => {
    // Initialize Resend inside the function so env vars are loaded
    const apiKey = process.env.RESEND_API_KEY;
    console.log(`RESEND_API_KEY loaded: ${apiKey ? 'Yes (' + apiKey.substring(0, 8) + '...)' : 'NO - MISSING!'}`);
    
    const resend = new Resend(apiKey);

    console.log(`Attempting to send email via Resend to ${options.email}...`);
    try {
        const { data, error } = await resend.emails.send({
            from: 'Smart Attendance <onboarding@resend.dev>',
            to: options.email,
            subject: options.subject,
            text: options.message,
        });

        if (error) {
            console.error('Resend API Error:', JSON.stringify(error));
            throw new Error(error.message || JSON.stringify(error));
        }

        console.log(`Email sent successfully via Resend. ID: ${data.id}`);
        return data;
    } catch (error) {
        console.error('Email sending failed:', error);
        throw error;
    }
};

module.exports = sendEmail;
