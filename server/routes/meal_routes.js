/* 
Hold routes for meal plan operations
  - generate meal plan
  - get meal plan
*/

const express = require('express');
const router = express.Router();
const Rec = require('../models/rec')
const fetch = require('node-fetch')

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