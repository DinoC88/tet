const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const keys = require("../config/keys").secretOrKey;

// Load User model
const User = require("../models/User");

// Load input validation
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

// Register
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    }

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });
    // Hash password before saving in database
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(newUser.password, salt, function(err, hash) {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then(user => {
            res.json({ status: user.email + " Registered!" });
          })
          .catch(err => console.log(err));
      });
    });
  });
});

//Login
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { email, password } = req.body;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      errors.email = "Email not found";
      return res.status(404).json(errors);
    }

    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = { id: user.id, name: user.name, isAdmin: user.role };

        jwt.sign(payload, keys, { expiresIn: 3600 }, (err, token) => {
          res.json({
            success: true,
            token: "Bearer " + token,
            userInfo: payload
          });
        });
      } else {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

//@route GET /users/current
//@desc Return current user
//@access Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      city: req.user.city,
      zipcode: req.user.zipcode,
      email: req.user.email,
      phone: req.user.phone,
      address: req.user.address,
      orderHistory: req.user.orderHistory
    });
  }
);

//@route POST api/profile
//@desc Create or edit user profile
//@access Private
router.post(
  "/edit",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //Get fields
    const profileFields = {};
    if (req.body.name) profileFields.name = req.body.name;
    if (req.body.email) profileFields.email = req.body.email;
    if (req.body.address) profileFields.address = req.body.address;
    if (req.body.phone) profileFields.phone = req.body.phone;
    if (req.body.firstName) profileFields.firstName = req.body.firstName;
    if (req.body.lastName) profileFields.lastName = req.body.lastName;
    if (req.body.city) profileFields.city = req.body.city;
    if (req.body.zipcode) profileFields.zipcode = req.body.zipcode;

    //Update
    User.update(
      { _id: req.body.userid },
      { $set: profileFields },
      { new: true }
    )
      .then(profile => {
        res.json(profile);
      })
      .catch(errors => res.status(400).json(errors));
  }
);
//@route Delete user
//@desc Delete current user
//@access Private
router.delete(
  "/delete",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOneAndDelete({ userid: req.user.userid })
      .then(() => {
        res.json({ success: true, msg: "deleted" });
      })
      .catch(err => console.log(err));
  }
);

module.exports = router;
