const express = require('express');
const router = express.Router();
const User = require('../models/user')

// Password encryption 
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get('/', function(req, res){
  // TODO ** I don't know what to put here yet
  console.log('on main page');
});

router.post('/login', function(req, res) {
  console.log("implement login");
  res.json("login");
});

router.post('/register', async (req, res) => {
  // Check that the user entered a username
  if (!req.body.username) {
    return res.json( {regError : 'Please enter a valid username'} );
  } 

  // Check that the user entered a password
  if (!req.body.password) {
    return res.json( {regError : 'Please enter a valid password'} );
  }

  // All is good - proceed week registration 
  const usernameIn = req.body.username;
  const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);

  try {
    let newUser = new User ({usernameIn, hashedPassword});
    await newUser.save();

    let arr = User.find({username: usernameIn});
    console.log(arr);

    return res.json('registered');
  }
  catch(err) {
    if (err.name === 'MongoError' && err.code == 11000) {
      return res.json({regError: 'username in use'});
    }
  }

  // return res.json( 'New user registered' );
});

router.post('/logout', function(req, res) {
  console.log("logout");

  // to do: set up sessions so that I can logout the user who is on the current session
  // const sessionUser = req.session.user.username;
  // req.session.user = null;

  // OnlineUser.deleteOne({username: sessionUser }, function(err, result) {
  //   if (err) {
  //     res.json({ error: err});
  //   }
  // });
});

module.exports = router;