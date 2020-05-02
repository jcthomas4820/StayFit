/* 
Hold routes for meal plan operations
  - generate meal plan
  - get meal plan
*/

const express = require('express');
const { check, validationResult } = require('express-validator');

const fetch = require('node-fetch');

require('dotenv').config();

const key = process.env.API_KEY;

const router = express.Router();
const Rec = require('../models/rec');

router.post(
  '/generate-meal-plan',
  [
    check('exclude')
      .trim()
      .isString()
      .matches(/^$|(^[a-z]([,a-z]+?)$)/)
      .withMessage('Please enter a comma separated list (ex: shellfish,olives)')
      .trim(),
  ],
  (req, res) => {
    if (!req.session.user || req.session.user === undefined) {
      return res.json({ errMsg: 'You must be logged in to do that' });
    }

    // validate the login input
    const errors = validationResult(req).array();
    const errMsg = [];
    errors.forEach((err) => errMsg.push(err.msg));

    // Display the first error
    if (errMsg.length > 0) {
      return res.json({ errMsg: errMsg[0] });
    }

    //  use find one to see if they exist in database
    Rec.findOne({ username: req.session.user.toString() })
      .then((data) => {
        //  if the user does not exist in db, they need to calculate
        if (data == null) {
          return res.json({
            errMsg: 'You need to calculate your recommended calories',
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });

    //  extract user entered data
    const data = req.body;
    const { cals } = data;
    const { timeFrame } = data;
    const { diet } = data;
    const { exclude } = data;

    let url = `https://api.spoonacular.com/mealplanner/generate?apiKey=${key}`;
    const calsUrl = `&targetCalories=${cals}`;
    const timeFrameUrl = `&timeFrame=${timeFrame}`;
    let dietUrl = '';
    let excludeUrl = '';

    //  if user enters exclude list, make sure it is comma separated
    //  clean up if necessary

    //  check if user entered optional values
    if (diet !== '') {
      dietUrl = `&diet=${diet}`;
    }
    if (exclude !== '') {
      excludeUrl = `&exclude=${exclude}`;
    }

    //  combine to create url for API call
    url = url + calsUrl + timeFrameUrl + dietUrl + excludeUrl;

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
        const myNutrients = [];
        myNutrients.push(apiResponse.nutrients.calories);
        myNutrients.push(apiResponse.nutrients.carbohydrates);
        myNutrients.push(apiResponse.nutrients.fat);
        myNutrients.push(apiResponse.nutrients.protein);

        //  save all meals from apiResponse
        const myMeals = apiResponse.meals;

        Rec.findOneAndUpdate(
          { username: req.session.user.toString() },
          { $set: { meals: myMeals, mealplan_nutrients: myNutrients } },
        ).then(() => {
          console.log('Successfully Saved Meal Plan');
          return res.json({ successMsg: 'Successfully saved meal plan' });
        });
      })
      .catch((error) => {
        console.log(error);
        return res.json({
          errorMsg: 'Error when saving meal plan. Try again.',
        });
      });
  },
);

router.get('/get-meal-plan', (req, res) => {
  if (!req.session.user || req.session.user === undefined) {
    return res.json({ errMsg: 'You must be logged in to do that' });
  }

  Rec.findOne({ username: req.session.user.toString() })
    .then((data) => {
      if (data.meals == null) {
        return res.json({
          errMsg: "You haven't generated your meal plan yet!",
        });
      }

      const bf = {
        name: data.meals[0].title,
        readyIn: data.meals[0].readyInMinutes,
        servings: data.meals[0].servings,
      };
      const lu = {
        name: data.meals[1].title,
        readyIn: data.meals[1].readyInMinutes,
        servings: data.meals[1].servings,
      };
      const din = {
        name: data.meals[2].title,
        readyIn: data.meals[2].readyInMinutes,
        servings: data.meals[2].servings,
      };
      const nutr = {
        calories: data.mealplan_nutrients[0],
        carbs: data.mealplan_nutrients[1],
        fat: data.mealplan_nutrients[2],
        protein: data.mealplan_nutrients[3],
      };
      return res.json({
        bfast: bf,
        lunch: lu,
        dinner: din,
        nutrients: nutr,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
