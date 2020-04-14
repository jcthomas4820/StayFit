/*
Holds routes for loging in and registering users
*/

const bcrypt = require('bcrypt');
const express = require('express');
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

router.post('/login', (req, res) => {
  // if the user exists, compare the password and determine if it matches
  // if yes -> update the session and send successful response
  // if no -> send an error response
  // if the user doesn't exist -> send an error response
  User.findOne({ username: req.body.username }).then((user) => {
    if (user) {
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.json({ logError: 'Incorrect password entered' });
      }

      req.session.user = user._id;
      return res.json('User successfully logged in');
    }

    return res.json({ logError: 'Username does not exist' });
  });
});

router.post('/register', (req, res) => {
  // Check that the user entered a username
  if (!req.body.username) {
    return res.json({ regError: 'Please enter a valid username' });
  }

  // Check that the user entered a password
  if (!req.body.password) {
    return res.json({ regError: 'Please enter a valid password' });
  }

  // Entries are valid - save them
  const usernameIn = req.body.username;
  const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);

  // Check if the user exists
  // If yes -> send an error response
  // If no -> register the user and send a successful response
  User.findOne({ username: usernameIn }).then((user) => {
    if (user) {
      return res.json({ regError: 'Username already exists' });
    }
    const newUser = new User({
      username: usernameIn,
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
});

module.exports = router;
