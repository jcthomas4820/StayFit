/*
Holds routes for loging in and registering users
*/

const bcrypt = require('bcrypt');
const express = require('express');
const { check, validationResult } = require('express-validator');
const User = require('../models/user');

const router = express.Router();

const saltRounds = 10;

/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

router.get('/', (req, res) => {
  // If the user is already logged it, it will immediately route them
  // to the selection page instead of the login page
  if (!req.session.user || req.session.user === undefined) {
    return res.json({ status: 'Not logged in' });
  }

  return res.json({ status: 'Logged in' });
});

router.post('/logout', (req, res) => {
  if (!req.session.user || req.session.user === undefined) {
    return res.json({ logoutErr: 'There is no one logged in' });
  }

  req.session.destroy((err) => {
    if (err) {
      return res.json({ logoutErr: err });
    }
    return res.json('User logged out');
  });
});

router.post(
  '/login',
  [
    check('username')
      .not()
      .isEmpty()
      .withMessage('You must enter a username')
      .isString()
      .withMessage('You must enter a valid username')
      .trim(),
    check('password')
      .not()
      .isEmpty()
      .withMessage('You must enter a password')
      .isString()
      .withMessage('You must enter a valid password')
      .trim(),
  ],
  (req, res) => {
    const { username } = req.body;
    const { password } = req.body;

    // validate the login input
    const errors = validationResult(req).array();
    const errMsg = [];
    errors.forEach((err) => errMsg.push(err.msg));

    if (errors.length > 0) {
      return res.json({ logError: errMsg });
    }

    // if the user exists, compare the password and determine if it matches
    // if yes -> update the session and send successful response
    // if no -> send an error response
    // if the user doesn't exist -> send an error response
    User.findOne({ username }).then((user) => {
      if (user) {
        if (!bcrypt.compareSync(password, user.password)) {
          return res.json({ logError: ['Incorrect password entered'] });
        }

        console.log(user.username);

        req.session.user = user._id;
        return res.json('User successfully logged in');
      }

      return res.json({ logError: ['Username does not exist'] });
    });
  },
);

router.post(
  '/register',
  [
    check('username')
      .not()
      .isEmpty()
      .withMessage('Please enter a valid username')
      .trim()
      .isLength({ min: 5 })
      .withMessage('Username should be at least 3 characters long')
      .matches(/^[a-zA-Z](([-_a-zA-Z0-9]*)?)[a-zA-Z0-9]{3,}$/)
      .withMessage(
        'Username should consist of letters and numbers and not begin or end with - or _',
      ),
    check('password')
      .not()
      .isEmpty()
      .withMessage('Please enter a valid password')
      .trim()
      .isLength({ min: 8 })
      .withMessage('Password should be at least 8 characters long')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      )
      .withMessage(
        'Password should contain at least one uppercase letter, one lowercase letter, one number and one special character (@$!%*?&)',
      ),
  ],
  (req, res) => {
    const { username } = req.body;
    const { password } = req.body;

    // validate the login input
    const errors = validationResult(req).array();
    const errMsg = [];
    errors.forEach((err) => errMsg.push(err.msg));

    if (errors.length > 0) {
      return res.json({ regError: errMsg });
    }
    // Entries are valid - save them
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    // Check if the user exists
    // If yes -> send an error response
    // If no -> register the user and send a successful response
    User.findOne({ username }).then((user) => {
      if (user) {
        return res.json({ regError: ['Username already exists'] });
      }
      const newUser = new User({
        username,
        password: hashedPassword,
      });
      newUser
        .save()
        .then((newU) => {
          req.session.user = newU._id;
          return res.json('New user created');
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
);

module.exports = router;
