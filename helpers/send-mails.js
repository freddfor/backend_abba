
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");

var transporter = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: "abbaconsultora07@gmail.com",
      pass: "4bb4consultor407",
    },
  })
);

// var mailOptions = {
//   from: "abbaconsultora07@gmail.com",
//   to: "dcopalupe@gmail.com",
//   subject: "Sending Email using Node.js[nodemailer]",
//   text: "That was easy!",
// };

const sendEmail = (mailOptions) => {
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

module.exports = {
  sendEmail
}