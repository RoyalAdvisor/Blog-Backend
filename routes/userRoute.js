const dotenv = require("dotenv");
dotenv.config();
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const user = require("../models/userModel");
const verify = require("../middleware/verify");
const { retrieveUser } = require("../middleware/retriever.js");
const verifyAcc = require("../middleware/authJWT");
const nodemailer = require("nodemailer");

//Register

router.post("/signup", verify, async (req, res) => {
  try {
    const passEncryption = bcrypt.hashSync(req.body.password, 8);
    const newUser = new user({
      username: req.body.username,
      email: req.body.email,
      password: passEncryption,
      profile: req.body.profile,
    });
    await newUser.save();
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.email,
        pass: process.env.pass,
      },
    });
    let mailOptions = {
      from: process.env.email,
      to: req.body.email,
      subject: "Welcome to The Mental Mind!",
      html: `
        <h2>Thank you for signing up with us ${req.body.username}.</h2>
        <h4>We're really glad that you chose to join out family and hope that you enjoy blogging with us!</h4>

        <h4>Click the link below to go directly to the sign up page.</h4>
        <a href="https://thementalmind-c60dd.web.app/signin">Click here!</a>
      `,
    };
    transporter.sendMail(mailOptions, function (err, success) {
      if (error) {
        res.status(400).send({ message: err.message });
      } else {
        res.status(200).send({ message: "Email was sent successfully." });
      }
    });
    res.status(200).send({ message: "Successfully created new user" });
  } catch (error) {
    res.status(500).send({ message: "Error creating new user" });
  }
});

//Login

router.post("/signin", async (req, res) => {
  try {
    const verifyEmail = user.findOne({ email: req.body.email }, (err, user) => {
      if (!verifyEmail) return res.status(401).send({ message: err.message });
      if (!user) return res.sendStatus(404);
      const passMatch = bcrypt.compareSync(req.body.password, user.password);
      if (!passMatch) return res.sendStatus(404);
      const authToken = jwt.sign({ _id: user._id }, process.env.access);
      if (!authToken) return res.sendStatus(401);
      res.header("auth-token", authToken).send({
        _id: user._id,
        username: user.username,
        email: user.email,
        access: authToken,
        profile: user.profile,
      });
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

//Update

router.put("/:id", [verifyAcc, retrieveUser], async (req, res) => {
  if (req.body.username != null) res.user.username = req.body.username;
  if (req.body.email != null) res.user.email = req.body.email;
  if (req.body.profile != null) res.user.profile = req.body.profile;
  if (req.body.password != null)
    res.user.password = bcrypt.hashSync(req.body.password, 8);
  try {
    const updateUser = await res.user.save();
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.email,
        pass: process.env.pass,
      },
    });
    let mailOptions = {
      from: process.env.email,
      to: res.user.email,
      subject: "Your profile has been updated.",
      html: `
        <h2>Hello, ${res.user.username}.</h2>
        <h4>We've noticed that you have changed your profile.</h4>

        <h4>Click the link below to go directly to the sign up page.</h4>
        <a href="https://thementalmind-c60dd.web.app/signin">Click here!</a>
      `,
    };
    transporter.sendMail(mailOptions, function (err, success) {
      if (error) {
        res.status(400).send({ message: err.message });
      } else {
        res.status(200).send({ message: "Email was sent successfully." });
      }
    });
    res.status(200).send(updateUser);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

//Delete

router.delete("/:id", [verifyAcc, retrieveUser], async (req, res) => {
  try {
    await res.user.remove();
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.email,
        pass: process.env.pass,
      },
    });
    let mailOptions = {
      from: process.env.email,
      to: res.user.email,
      subject: "Your account has been deleted.",
      html: `
        <h2>We really hate to see you go, ${res.user.username}.</h2>
        <h4>However, we know all good things eventually come to an end. We wish you prosperity moving forward. Thank you for blogging with us!</h4>
      `,
    };
    transporter.sendMail(mailOptions, function (err, success) {
      if (error) {
        res.status(400).send({ message: err.message });
      } else {
        res.status(200).send({ message: "Email was sent successfully." });
      }
    });
    res.status(200).send({ message: "User deleted successfully." });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
