const express = require('express');
const router = express.Router();
const User = require('../models/user')

// Password encryption 
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get('/', function(req, res){
  if (req.session.user === undefined) {
    return res.json({loggedIn: 'false'});
  }

  return res.json({loggedIn: 'true'});
});

router.post('/login', function(req, res) {
    // if the user exists, compare the password and determine if it matches
      // if yes -> update the session and send successful response
      // if no -> send an error response
    // if the user doesn't exist -> send an error response
  User.findOne( {username: req.body.username} ).then ( (user) => {
    if (user) {
      if (!bcrypt.compareSync(req.body.password, user.password)){
        return res.json( {logError: 'Incorrect password entered'});
      }
      req.session.user = user._id;
      console.log("login: " + req.session.user);
      console.log(req.session);
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
      const newUser = new User ({username: usernameIn, password: hashedPassword, loggedIn: true});
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
  if (!req.session.user || req.session.user === undefined) {
    return res.json({logoutErr: 'There is no one logged in'});
  }

  req.session.destroy((err) => {
    if (err) {
      return res.json({logoutErr: err});
    }
    return res.json('User logged out');
  });
});

router.post('/calculate', function(req, res){
    // check if user is logged in
    if (!req.session.user || req.session.user === undefined) {
        return res.json({calcError: 'You must be logged in to do that'});
    }

    // error check inputs
    if(!req.body.userAge || Number.isNaN(Number(req.body.userAge)) || req.body.userAge <= 0){
        return res.json({calcError: 'Please enter a valid age in years'});
    }
    if(!req.body.userGender || req.body.userGender === ''){
        return res.json({calcError: 'Please enter a valid gender (M/F)'});
    }
    if(!req.body.userHeight || Number.isNaN(Number(req.body.userHeight)) || req.body.userHeight < 0){
        return res.json({calcError: 'Please enter a valid height in centimeters'});
    }
    if(!req.body.userWeight || Number.isNaN(Number(req.body.userWeight)) || req.body.userWeight < 0){
        return res.json({calcError: 'Please enter a valid Weight in pounds'});
    }
    if(!req.body.userActivityLevel){
        return res.json({calcError: 'Please enter a valid activity level from range(1-5)'});
    }

    // grab and convert userAge from pounds to kilograms
    let weight = req.body.userWeight/2.2046;

    // grab other user data values
    let age = req.body.userAge;
    let height = req.body.userHeight;
    let activityLevel = req.body.userActivityLevel;
    let gender = req.body.userGender;

    // calculate caloriesPerDay based on gender
    let caloriesPerDay = (10*weight) + (6.25*height) - (5*age);
    if(gender === 'M'|| gender === 'm'){
        caloriesPerDay = caloriesPerDay + 5;
    }
    else{
        caloriesPerDay = caloriesPerDay - 161;
    }

    // calculate macros for the user
    let macros = {  prot: caloriesPerDay*0.35,
                    carbs: caloriesPerDay*0.35,
                    fats: caloriesPerDay*0.30 }

    // respond with macros
    return res.json({macros: macros});
});

router.post('/submit', function(req, res){

     // check of user is logged in
    if (!req.session.user || req.session.user === undefined) {
      return res.json({submitError: 'You must be logged in to do that'});
    }

    // get user provided data
    let data = req.body;

    // check if data sent is null
    if(!data || !data.prot || !data.carbs || !data.fats){
      return res.json({submitError: 'Data sent for submission is null. Try again'});
    }

    // save data to DB
    // https://mongoosejs.com/docs/tutorials/findoneandupdate.html
    User.findOneAndUpdate({_id: req.session.user}, {$set : {macros: data}}, {new: true, useFindAndModify: false}, (error, doc) => {
      if(error){
        return res.json({submitError: 'Error: Data not saved'});
      }
      else{
        return res.json('Data saved');
      }
    });
});
module.exports = router;