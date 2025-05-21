const nodemailer = require("nodemailer");

module.exports.sendMail = (email, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "testhoa8@gmail.com",
      pass: "wnha ixda hvdp fbcz",
    },
  });

  const mailOptions = {
    from: '"testhoa8@gmail.com',
    to: email,
    subject: subject,
    html: html, // HTML body
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent : " + info.response);
    }
  });
};
