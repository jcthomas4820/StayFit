const express = require('express');
const router = express.Router();
const User = require('../models/user')
const Exercise = require('../models/exercise')
const Rec = require('../models/rec')
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


router.post('/save-cal-rec', function(req, res){

  //  check if user is logged in
  if (!req.session.user || req.session.user === undefined) {
    return res.json({errMsg: 'You must be logged in to do that'});
  }

  //  get user entered data
  let data = req.body
  let gender = data.userGender
  let age = data.userAge
  let weight = data.userWeight
  let height = data.userHeight
  let activity_level = data.userActivityLevel

  //  if any value not entered, return error
  if (!data || gender==='' || age==='' || weight==='' || height==='' || activity_level===''){
    return res.json({errMsg: 'Please enter all fields'});
  }

  age = Number(age)
  weight = Number(weight)
  height = Number(height)

  //  check each number value
  if (Number.isNaN(age) || age<=0){
    return res.json({errMsg: 'Please enter a valid age'});
  }
  if (Number.isNaN(weight) || weight<=0){
    return res.json({errMsg: 'Please enter a valid weight'});
  }
  if (Number.isNaN(height) || height<=0){
    return res.json({errMsg: 'Please enter a valid height'});
  }


  //  values are all valid, begin calorie calculation
  let BMR = 0

  if (gender === "male"){
    BMR = 66 + (6.3*weight) + (12.9*height) - (6.8*age)
  }
  else if (gender === "female"){
    BMR = 655 + (4.3*weight) + (4.7*height) - (4.7*age)
  }
  else{
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
    case "moderately active":
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

  async function updateDoc(filter, update){
    let doc = await Rec.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true
    })
  }

  //  save to DB
  const filter = {username: (req.session.user).toString()}
  const update = {cal_rec: calorie_rec}
  updateDoc(filter, update)

  //  return the caloric need back to the user
  return res.json({cals: Math.round(calorie_rec)})

})


router.get('/get-cal-rec', function(req,res){

  if (!req.session.user || req.session.user === undefined) {
    return res.json({errMsg: 'You must be logged in to do that'});
  }

  Rec.findOne( {username: (req.session.user).toString()} )
    .then((data) => {
      if (data == null){
        return res.json({errMsg: "You need to calculate your recommended calories"})
      }
      let calorie_recommendation = data.cal_rec
      return res.json({userCals: calorie_recommendation})
    })
    .catch((err) => { console.log("error when retrieving calories") });

})



router.post('/generate-meal-plan', function(req, res){

  if (!req.session.user || req.session.user === undefined) {
    return res.json({errMsg: 'You must be logged in to do that'});
  }

  //  use find one to see if they exist in database
  Rec.findOne( {username: (req.session.user).toString()} )
    .then((data) => {
      //  if the user does not exist in db, they need to calculate 
      if (data == null){
        return res.json({errMsg: "You need to calculate your recommended calories"})
      }
    })
    .catch((err) => { console.log("error during check of calories in generate-meal-plan") });


  //  extract user entered data
  let data = req.body
  let cals = data.cals
  let timeFrame = data.timeFrame
  let diet = data.diet
  let exclude = data.exclude

  let url = 'https://api.spoonacular.com/mealplanner/generate?apiKey='+(require('../config/keys.js').app_key)

  let calsUrl = '&targetCalories=' + cals
  let timeFrameUrl = '&timeFrame=' + timeFrame
  let dietUrl = ''
  let excludeUrl = ''

  //  if user enters exclude list, make sure it is comma separated
  //  clean up if necessary

  //  check if user entered optional values
  if (diet !== ''){
    dietUrl = '&diet='+diet
  }
  if (exclude !== ''){
    excludeUrl = '&exclude='+exclude
  }

  //  combine to create url for API call
  url = url + calsUrl + timeFrameUrl + dietUrl + excludeUrl

  /*
  THIS IS A MOCK API RESPONSE
    - use if testing API functionality, without needing to call API

  let apiResponse = {
    "meals": [
        {
            "id": 655219,
            "title": "Peanut Butter And Chocolate Oatmeal",
            "image": "Peanut-Butter-And-Chocolate-Oatmeal-655219.jpg",
            "imageUrls": [
                "Peanut-Butter-And-Chocolate-Oatmeal-655219.jpg"
            ],
            "readyInMinutes": 45,
            "servings": 1
        },
        {
            "id": 649931,
            "title": "Lentil Salad With Vegetables",
            "image": "Lentil-Salad-With-Vegetables-649931.jpg",
            "imageUrls": [
                "Lentil-Salad-With-Vegetables-649931.jpg"
            ],
            "readyInMinutes": 45,
            "servings": 4
        },
        {
            "id": 632854,
            "title": "Asian Noodles",
            "image": "Asian-Noodles-632854.jpg",
            "imageUrls": [
                "Asian-Noodles-632854.jpg"
            ],
            "readyInMinutes": 45,
            "servings": 4
        }
    ],
    "nutrients": {
        "calories": 1735.81,
        "carbohydrates": 235.17,
        "fat": 69.22,
        "protein": 55.43
    }
}
*/
  //  send request to API
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then((response) => response.json())
  .then((apiResponse) => {
    
      //  save nutrients from apiResponse
    let _nutrients = []
    _nutrients.push((apiResponse.nutrients).calories)
    _nutrients.push((apiResponse.nutrients).carbohydrates)
    _nutrients.push((apiResponse.nutrients).fat)
    _nutrients.push((apiResponse.nutrients).protein)

    //  save all meals from apiResponse
    let _meals = apiResponse.meals

    Rec.findOneAndUpdate( {username: (req.session.user).toString()}, 
      { "$set": { meals: _meals, mealplan_nutrients: _nutrients}}
    ).then((returnData)=>{
        console.log("Successfully Saved Meal Plan")
        return res.json({successMsg: 'Successfully saved meal plan'});
      }
    )
  })
  .catch((error) => {
    console.log('Error when saving meal plan. Try again.');
    return res.json({errorMsg: 'Error when saving meal plan. Try again.'});
  });
  
})


router.get('/get-meal-plan', function(req, res){

  if (!req.session.user || req.session.user === undefined) {
    return res.json({errMsg: 'You must be logged in to do that'});
  }

  Rec.findOne( {username: (req.session.user).toString()} )
    .then((data) => {
      if (data.meals == null){
        return res.json({errMsg: "You haven't generated your meal plan yet!"})
      }
      
      let _bfast = {name: ((data.meals[0]).title), readyIn: ((data.meals[0]).readyInMinutes), servings: ((data.meals[0]).servings)};
      let _lunch = {name: ((data.meals[1]).title), readyIn: ((data.meals[1]).readyInMinutes), servings: ((data.meals[1]).servings)};
      let _dinner = {name: ((data.meals[2]).title), readyIn: ((data.meals[2]).readyInMinutes), servings: ((data.meals[2]).servings)};
      let _nutrients = {calories: ((data.mealplan_nutrients)[0]), carbs: ((data.mealplan_nutrients)[1]), fat: ((data.mealplan_nutrients)[2]), protein: ((data.mealplan_nutrients)[3])}
      return res.json({bfast: _bfast, lunch: _lunch, dinner: _dinner, nutrients: _nutrients})
    })
    .catch((err) => { console.log("error when getting meal plan") });

})



module.exports = router;