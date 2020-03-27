const express = require('express');
const router = express.Router();
const User = require('../models/user')
const Exercise = require('../models/exercise')

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
        .catch( (err) => { console.log("4 " + err); })
    }

  });
});

// Todo: connect this to the front end code 
router.post('/logout', function(req, res) {
  if (req.session.user === undefined) {
    return res.json('There is no one logged in');
  }
      req.session.user = null;
      return res.json('User logged out');
});

router.post('/calculate', function(req, res){

    // check if user is logged in
    if (!req.session.user || req.session.user === undefined) {
        return res.json({calcError: 'You must be logged in to do that'});
    }

    // error check inputs
    if(!req.body.userGender || req.body.userGender === ''){
        return res.json({calcError: 'You must select a gender to calculate the macros'});
    }
    else if(!req.body.userAge || req.body.userAge === ""){
        return res.json({calcError: 'You must enter an age to calculate the macros'});
    }
    else if(Number.isNaN(Number(req.body.userAge)) || req.body.userAge < 0){
        return res.json({calcError: 'Please enter a valid age to calculate the macros'});
    }
    else if(!req.body.userWeight || req.body.userWeight === ''){
        return res.json({calcError: 'You must enter a weight (kg) to calculate the macros'});
    }
    else if(Number.isNaN(Number(req.body.userWeight)) || req.body.userWeight <= 0){
        return res.json({calcError: 'Please enter a valid weight (kg) to calculate the macros'});
    }
    else if(!req.body.userHeight || req.body.userHeight === ''){
        return res.json({calcError: 'You must enter a height (cm) to calculate the macros'});
    }
    else if(Number.isNaN(Number(req.body.userHeight)) || req.body.userHeight <= 0){
        return res.json({calcError: 'Please enter a valid height (cm) to calculate the macros'});
    }
    else if(!req.body.userActivityLevel || req.body.userActivityLevel === ''){
        return res.json({calcError: 'You must select an activity level to calculate the macros'});
    }

    // grab other user data values
    let gender = req.body.userGender;
    let age = req.body.userAge;
    let weight = req.body.userWeight;
    let height = req.body.userHeight;
    let activityLevel = req.body.userActivityLevel;

    // calculate the macros: https://www.healthline.com/nutrition/how-to-count-macros#step-by-step
    // get the activity factor based on activity level
    let activityFactor = 0;
    if(activityLevel === " Sedentary"){
        activityFactor = 1.2;
    }
    else if(activityLevel === " Lightly Active"){
        activityFactor = 1.375;
    }
    else if(activityLevel === " Moderately Active"){
        activityFactor = 1.55;
    }
    else if(activityLevel === " Very Active"){
        activityFactor = 1.725;
    }
    else if(activityLevel === " Extra Active"){
        activityFactor = 1.9;
    }


    // calculate caloriesPerDay based on gender
    let caloriesPerDay = ((10*weight) + (6.25*height) - (5*age))*activityFactor;
    if(gender === 'Male'){
        caloriesPerDay = caloriesPerDay + 5;
    }
    else{
        caloriesPerDay = caloriesPerDay - 161;
    }

    let macros = {  prots: caloriesPerDay*0.35,
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
    let data = req.body.data;
    // check if data sent is null
    if(!data || !data.prots || !data.carbs || !data.fats){
      return res.json({submitError: 'You must calculate macros before submitting'});
    }

    // save data to DB
    // https://mongoosejs.com/docs/tutorials/findoneandupdate.html
    User.findOneAndUpdate({_id: req.session.user}, {$set : {macros: data}}, {new: true, useFindAndModify: false}, (error, doc) => {
      if(error){
        return res.json({submitError: 'Error: Data not saved. Please try again.'});
      }
      else{
        return res.json('Your macro values are saved');
      }
    });
});

router.get('/get-grid-data', function(req, res){

    if (!req.session.user || req.session.user === undefined) {
      return res.json({getGridError: 'The user is not logged in'});
    }

    Exercise.find( {username: req.session.user} )
        .then ( (exercises) => {
            if (exercises) {
                let list = [];
                for(i = 0; i < exercises.length; i++){
                     list.push(exercises[i].name);
                     list.push(exercises[i].progress);
                     // covert date object to string:
                     // https://www.tutorialrepublic.com/faq/how-to-get-day-month-and-year-from-a-date-object-in-javascript.php
                     let date = exercises[i].date.getMonth() + 1 + "/" + exercises[i].date.getDate() + "/" +
                                exercises[i].date.getFullYear();
                     list.push(date);
                }
                return res.json({exerciseData: list});
            }
            return res.json('The user has no exercises saved yet');
        })
        .catch((err) => { console.log(err)});

});

router.post('/save-grid-data', function(req, res){
     // check of user is logged in
    if (!req.session.user || req.session.user === undefined) {
      return res.json({saveGridError: 'You must be logged in to do that'});
    }

    // get user provided data
    let name = req.body.exerciseName;
    let progress = req.body.exerciseProgress;
    let date = Date.parse(req.body.exerciseDate);
    let exerciseNumber = req.body.exerciseNumber;

    // check if exercise number is sent
    if(!exerciseNumber || Number.isNaN(Number(exerciseNumber)) || exerciseNumber < 1){
        return res.json({saveGridError: 'Invalid exercise number'});
    }
    // check if the data contains all 3 components: name, progress, and date
    if(!name || name === ""){
        return res.json({saveGridError: 'You must provide a name for the exercise'})
    }
    if(!progress || progress === ""){
        return res.json({saveGridError: 'You must provide the progress of the exercise'})
    }
    if(!date){
        return res.json({saveGridError: 'You must provide a date'});
    }

    // save data to DB
    Exercise.find({username: req.session.user})
        .then((userExercises) =>{
            if(userExercises){
                Exercise.findOneAndUpdate({username:req.session.user, exerciseNumber: exerciseNumber},
                {$set : {name: name, progress: progress, date: date}},
                {new: true, useFindAndModify: false, strict: false, upsert: true}, (error, doc) => {
                    if(error){
                        return res.json(error);
                    }
                    return res.json('Your exercise values are saved');
                });
            }
            else{
                const e = new Exercise({userId: req.session.user, exerciseNumber: exerciseNumber,
                name: name, progress: progress, date: date});
                Exercise.save();
                return res.json("Your exercise values are saved");
            }
        })
        .catch((err) => {return res.json(err)});


});
module.exports = router;