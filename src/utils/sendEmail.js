const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // If SMTP details are available, build an actual transport
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const transporter = nodemailer.createTransport({
            service: 'gmail', // or configure host/port for generic SMTP
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `Platform <${process.env.EMAIL_USER}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html
        };

        await transporter.sendMail(mailOptions);
    } else {
        // Fallback fake logger for development without SMTP provided
        console.log('===== EMAIL MOCK =====');
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Body:\n${options.message}`);
        console.log('======================');
    }
};

module.exports = sendEmail;
