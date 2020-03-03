var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');

const saltRounds = 10;
let User = require('../models/user.model');
let OnlineUser = require('../models/onlineusers.model');

// TODO: setup mongoDB

// get a list of all of the users in the database
router.get('/', function(req, res){
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.post('/login', function(req, res) {
  console.log('logged in');

  const usernameIn = req.body.username;
  const passwordIn = req.body.password;

  // will return the user if one is found
  User.findOne({ usernameIn }).then(user => {
    // Check if user exists
    if (!user) {
      return res.json({ error: "Username not found" });
    }
  });

  bcrypt.compare(passwordIn, user.password).then(matches => {
    if (!matches) {
      return res.json({ error: "Incorrect password" });
    }
  });
  
  const newUser = new OnlineUser({usernameIn});
  
  const sessionUser = {
    username: usernameIn
  }
  req.session.user = sessionUser; // update the session user

  newUser.save()
    .then(() => res.json({ username: usernameIn}));
});

router.post('/register', function(req, res) {
  console.log("register");
  const usernameIn = req.body.username;
  const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);

  const newUser = new User({usernameIn, hashedPassword});
  const newUserOn = new OnlineUser({usernameIn});

  const sessionUser = {
    username: usernameIn
  }
  req.session.user = sessionUser; // update the session user

  newUserOn.save();
  newUser.save()
  .then(() => res.json({ username: usernameIn , password: hashedPassword}))
});

router.post('/logout', function(req, res) {
  console.log("logout");

  // to do: set up sessions so that I can logout the user who is on the current session
  const sessionUser = req.session.user.username;
  req.session.user = null;

  OnlineUser.deleteOne({username: sessionUser }, function(err, result) {
    if (err) {
      res.json({ error: err});
    }
  });
});

module.exports = router;