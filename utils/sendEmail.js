const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
   user: process.env.EMAIL_USERNAME,
pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"SVRYN" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
};

module.exports = sendEmail;
