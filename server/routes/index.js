const express = require('express');
const router = express.Router();
const User = require('../models/user')

// Password encryption 
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get('/', function(req, res){
  if (req.session.user == undefined) {
    return res.json({loggedIn: 'false'});
  }

  return res.json({loggedIn: 'true'});
});

router.post('/login', function(req, res) {
    // if the user exists, compare the password and detemrine if it matches
      // if yes -> update the session and send successful mresponse
      // if no -> send an error response
    // if the user doesn't exist -> send an error response
  User.findOne( {username: req.body.username} ).then ( (user) => {
    if (user) {
      if (!bcrypt.compareSync(req.body.password, user.password)){
        return res.json( {logError: 'Incorrect password entered'});
      }
      req.session.user = user._id;
      return res.json('User successfully logged in');
    }
    else {
      return res.json( {logError: 'Username does not exist'});
    }
  });
});

router.post('/register', function (req, res) {
  // Check that the user entered a username
  if (!req.body.username) {
    return res.json( {regError : 'Please enter a valid username'} );
  } 

  // Check that the user entered a password
  if (!req.body.password) {
    return res.json( {regError : 'Please enter a valid password'} );
  }

  // Entries are valid - save them
  const usernameIn = req.body.username;
  const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);

  // Check if the user exists
    // If yes -> send an error response 
    // If no -> register the user and send a successful response 
  User.findOne( {username: usernameIn} ).then ( (user) => {
    if (user) {
      return res.json( {regError : 'Username already exists'} );
    }
    else {
      const newUser = new User ({username: usernameIn, password: hashedPassword});
      newUser.save()
        .then( (user) => {
          req.session.user = user._id;
          return res.json('New user created'); 
        })
        .catch( (err) => { console.log(err); })
    }
  })
});

// Todo: connect this to the front end code 
router.post('/logout', function(req, res) {
  if (req.session.user == undefined) {
    return res.json('There is no one logged in');
  }

  req.session.user = null;
  return res.json('User logged out');
});

module.exports = router;