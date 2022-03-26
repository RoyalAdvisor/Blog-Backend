const router = require("express").Router();
const nodemailer = require("nodemailer");

router.post("/", async (req, res) => {
  let { email, message } = req.body;
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.email,
      pass: process.env.pass,
    },
  });

  let mailOptions = {
    from: process.env.email,
    to: process.env.email,
    subject: `You have a new message from your blog!`,
    html: `
        <h3>${message}</h3>
        <h4>Email them back using the following ${email}</h4>
      `,
  };
  try {
    transporter.sendMail(mailOptions, function (error, data) {
      if (error) {
        res.status(400).send({ message: "Email could not be sent." });
      } else {
        res.status(200).send({ message: "Email sent successfully." });
      }
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
