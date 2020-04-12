const express = require('express');
const router = express.Router();
const User = require('../models/user')
const Exercise = require('../models/exercise')
const fetch = require('node-fetch')


// Password encryption 
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get('/', function(req, res){
  // If the user is already logged it, it will immediately route them
  // to the selection page instead of the login page
  if (!req.session.user || req.session.user === undefined) {
    return res.json({status: 'Not logged in'});
  }

  return res.json({status: 'Logged in'});
});

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
        .catch( (err) => { console.log(err); })
    }

  });
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
    if(activityLevel === "sedentary"){
      activityFactor = 1.2;
    }
    else if(activityLevel === "lightly active"){ 
      activityFactor = 1.375;
    }
    else if(activityLevel === "moderately active"){
        activityFactor = 1.55;
    }
    else if(activityLevel === "very active"){
      activityFactor = 1.725;
    }
    else if(activityLevel === "extra active"){
      activityFactor = 1.9;
    }


    // calculate caloriesPerDay based on gender
    let caloriesPerDay = ((10*weight) + (6.25*height) - (5*age))*activityFactor;
    if(gender === 'male'){
        caloriesPerDay = caloriesPerDay + 5;
    }
    else{
        caloriesPerDay = caloriesPerDay - 161;
    }


    let macros = {  prot: Math.round(caloriesPerDay*0.35),
                    carbs: Math.round(caloriesPerDay*0.35),
                    fats: Math.round(caloriesPerDay*0.30) }

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

    Exercise.find( {username: (req.session.user).toString()} )
        .then ( (exercises) => {
            if (exercises.length === 0) {
              return res.json({getGridError: 'You have no exercises saved yet!'});
            }

            let data = [];
            for(i = 0; i < exercises.length; i++){
              let entry = { name: exercises[i].name, date: exercises[i].date, description: exercises[i].progress };
              data.push(entry);
            }
            return res.json({exerciseData: data});
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
    let description = req.body.exerciseDescription;
    let date = req.body.exerciseDate;
 
    // check if the data contains all 3 components: name, description, and date
    if(!name || name === ""){
        return res.json({saveGridError: 'You must provide a name for the exercise'})
    }
    if(!date){
        return res.json({saveGridError: 'You must provide a date'});
    }
    if(!description || description === ""){
      return res.json({saveGridError: 'You must provide the description of the exercise'})
    }

    // save data to DB
    const newExercise = new Exercise (
      {username: (req.session.user).toString(), 
       name: name, progress: description, date: date}
    );
    newExercise.save()
        .then( (exercise) => {
          return res.json('Your exercise values are saved');
        })
        .catch( (err) => { console.log(err); });
});



router.post('/get-calorie-rec', function(req, res){

  //  error check, check if empty req
  if (req.body == null){
    return res.json({errorMsg: "Server received an empty request..."})
  }

  //  extract user variables
  let gender = req.body.gender
  let weight = req.body.weight
  let height = req.body.height
  let age = req.body.age
  let activity_level = req.body.activity_level
  let BMR = 0

  //  error check for weight, height, age
  if (weight == null || weight <= 0){
    return res.json({errorMsg: "Invalid weight entered"})
  }
  else if (height == null || height <= 0){
    return res.json({errorMsg: "Invalid height entered"})
  }
  else if (age == null || age <= 0){
    return res.json({errorMsg: "Invalid age entered"})
  }

  //  calculate BMR
  if (gender === "male"){
    BMR = 66 + (6.3*weight) + (12.9*height) - (6.8*age)
  }
  else if (gender === "female"){
    BMR = 655 + (4.3*weight) + (4.7*height) - (4.7*age)
  }
  else{
    //  return error message
    return res.json({errorMsg: "Invalid gender entered"})
  }


  let factor = 0

  switch(activity_level){

    case "sedentary":
      factor = 1.2
      break;
    case "lightly active":
      factor = 1.375
      break;
    case "moderatively active":
      factor = 1.55
      break;
    case "very active":
      factor = 1.725
      break;
    case "extra active":
      factor = 1.9
      break;
    default:
      //  return error message
      return res.json({errorMsg: "Invalid activity level entered"})
  }

  let calorie_rec = BMR*factor
  
  //  return the caloric need back to the user
  return res.json({caloric_need: calorie_rec})

})


router.post('/get-meals', function(req, res){

  /*
  //  error check, make sure calories calculated before
  if (req.body == null){
    return res.json({errorMsg: "Calculate your calories to use the meal planner!"})
  }
  */

  //  need to send null if diet or exclude?????


  //  extract user data
  let _timeFrame = req.body.timeFrame
  let _targetCalories = req.body.targetCalories
  let _diet = req.body.diet
  let _exclude = req.body.exclude

  //  check validity of user data (e.g. comma sep list for _exclude)

  _timeFrame = "day"
  _targetCalories = 2000
  _diet = "vegetarian"
  _exclude = "shellfish, olives"


  //  url of the api
    //  edit for null values
  const url = "https://api.spoonacular.com/mealplanner/generate?apiKey="
  

  //  send request to API
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then((response) => response.json())
  .then((data) => {
    console.log('Success:', data);
  

  })
  .catch((error) => {
    console.error('Error:', error);
  
  
    
  
  });



})




module.exports = router;