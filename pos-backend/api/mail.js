require('dotenv').config();
const nodemailer = require('nodemailer');

// Function to send email, accepts 'to', 'subject', and 'text' as parameters
function sendEmail(to, subject, text,htmlContent) {
  // Create transporter object using Gmail SMTP
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.CLIENT_ID, 
      pass: process.env.CLIENT_SECRET,
    },
  });

  // Define email options
  const mailOptions = {
    from: process.env.CLIENT_ID,
    to: to,
    subject: subject,
    text: text,
    html: htmlContent
  };

  return transporter.sendMail(mailOptions);
}

module.exports = sendEmail; 
