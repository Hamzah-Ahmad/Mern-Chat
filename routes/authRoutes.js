const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();
const User = require("../models/User");
const HTTPError = require("../models/http-error");

router.post("/register", async (req, res, next) => {
  const { name, email, password } = req.body;
  let emailVar = email.toLowerCase();
  let newUser = await User.findOne({ email: emailVar });

  if (newUser) return res.status(400).json({ msg: "User already exists" }); //returning a status of 400 will trigger the catch statement in axios in the front end
  // if (newUser) {
  //   return next(new HTTPError("A user with this email already exists.", 409));
  // }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    console.log(err);
    return next(new HTTPError("Could not create user. Please try again", 500));
  }

  newUser = await User.create({
    name,
    email: emailVar,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    // console.log(typeof newUser.id, typeof newser._id); //prints: string object
  } catch (err) {
    return next(new HTTPError("Signing up filed. Please try again", 500));
  }

  let token;
  try {
    token = jwt.sign(
      { _id: newUser._id, name: newUser.name, email: newUser.email },
      "jwt-secret"
    );
  } catch (err) {
    return next(new HTTPError("Signing up filed. Please try again", 500));
  }

  res.status(201).json({
    user: {
      _id: newUser._id,
      email: newUser.email,
      name: newUser.name,
    },
    token: token,
  });
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  let emailVar = email.toLowerCase();

  let user = await User.findOne({ email: emailVar });
  if (!user) return next(new HTTPError("Invalid credentials", 401));

  //Validate password
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, user.password);
  } catch (err) {
    //this code will not run for invalid credentials. It will only run if something goes wrong during the comparison
    return next(new HTTPError("Could not log you in. Please try again", 400));
  }
  if (!isValidPassword) return next(new HTTPError("Invalid credentials", 401));

  //Creating token
  let token;
  try {
    token = jwt.sign(
      { _id: user._id, name: user.name, email: user.email },
      "jwt-secret"
    );
  } catch (err) {
    console.log(err);
    return next(new HTTPError("Logging up filed. Please try again", 500));
  }

  res.status(200).json({
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
    },
    token: token,
  });
});

module.exports = router;
