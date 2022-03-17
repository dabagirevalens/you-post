const nodemailer = require('nodemailer')
require('dotenv').config('../.env')

function sendEmail(options) {

    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: `${process.env.USER_EMAIL}`, // add any email with enabled less secure apps
            pass: `${process.env.USER_PASS}` // provide corresponding password
        }
    })
    const mailOptions = {
        from: options.from,
        to: options.to,
        subject: options.subject,
        html: options.text,
        attachments: options.data
    }
    transport.sendMail(mailOptions, (err, info) => {
        if (err)
            console.log(err);
    })
    // console.log('Email sent')
}

module.exports = sendEmail;