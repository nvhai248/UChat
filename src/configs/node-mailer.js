const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

function generateVerificationToken() {
    return uuidv4();
}

const transporter = nodemailer.createTransport({
    service: 'SMTP',
    auth: {
        user: process.env.SERVER_MAIL_URL,
        pass: process.env.SERVER_MAIL_PW
    }
});


function sendVerificationEmail(clientEmail, token) {
    const mailOptions = {
        from: process.env.SERVER_MAIL_URL,
        to: clientEmail,
        subject: 'Verify your account',
        html: `<p>Please click on the following link to verify your account:</p><p>${process.env.HOST}/verify?token=${token}</p>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = { sendVerificationEmail, generateVerificationToken };