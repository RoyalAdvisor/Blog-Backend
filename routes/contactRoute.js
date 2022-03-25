const router = require("express").Router();
const nodemailer = require("nodemailer");

router.post("/", (req, res) => {
  const { email, name, message } = req.body;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.email,
      pass: process.env.pass,
    },
  });
  const mailOptions = {
    from: process.env.email,
    to: process.env.email,
    subject: `${name} has sent you a message!`,
    text: `
        <h1>Here is what they wanted you to know.</h1>
        <p>${message}</p>

        <h3>Don't forget to contact ${name} back at the following email address ${email}.</h3>
      `,
  };

  transporter.sendMail(mailOptions, function (error, data) {
    if (error) {
      res.status(400).send({ message: "Email could not be sent." });
    } else {
      res.status(200).send({ message: "Email sent successfully." });
    }
  });
});

module.exports = router;
