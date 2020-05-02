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
const Recipe = require('../models/recipe');

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

  function callAPI() {
    console.log('calling api to generate mealplan');

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

        async function saveMealPlan(mymeals, myUsername, mynutrients) {
          await Rec.findOneAndUpdate(
            { username: myUsername },
            { $set: { meals: mymeals, mealplan_nutrients: mynutrients } },
          );
        }

        saveMealPlan(myMeals, req.session.user.toString(), myNutrients);
        console.log('Successfully Saved Meal Plan');
        return res.json({ successMsg: 'Successfully saved meal plan' });
      })
      .catch((error) => {
        console.log(error);
        return res.json({
          errorMsg: 'Error when saving meal plan. Try again.',
        });
      });
  }

  //  use find one to see if they exist in database
  Rec.findOne({ username: req.session.user.toString() })
    .then((data) => {
      //  if the user does not exist in db, they need to calculate
      if (data == null) {
        return res.json({
          errorMsg: 'Error when saving meal plan. Try again.',
        });
      }

      callAPI();
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get('/get-meal-plan', (req, res) => {
  if (!req.session.user || req.session.user === undefined) {
    return res.json({ errMsg: 'You must be logged in to do that' });
  }

  Rec.findOne({ username: req.session.user.toString() })
    .then((data) => {
      if (data == null || data.meals == null) {
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

router.post('/save-recipes', (req, res) => {
  if (!req.session.user || req.session.user === undefined) {
    return res.json({ errMsg: 'You must be logged in to do that' });
  }

  //  find user's recommended meals
  Rec.findOne({ username: req.session.user.toString() })
    .then((data) => {
      if (data == null || data.meals == null) {
        return res.json({
          errMsg: "You haven't generated your meal plan yet!",
        });
      }

      const breakfastID = data.meals[0].id;
      const lunchID = data.meals[1].id;
      const dinnerID = data.meals[2].id;

      async function apiSaveRecipe(myID) {
        //  make api call to get the recipe for myID
        const url = `https://api.spoonacular.com/recipes/${myID}/analyzedInstructions?apiKey=${key}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const apiData = await response.json();

        //  parse the api response data, save as myIngredients and steps
        const items = [];
        const steps = [];
        const ingredients = [];
        for (let i = 0; i < apiData.length; i += 1) {
          items.push(apiData[i].steps);
        }
        for (let i = 0; i < items.length; i += 1) {
          const myObj = items[i];
          for (let j = 0; j < myObj.length; j += 1) {
            steps.push(myObj[j].step);
            const ingredientsList = myObj[j].ingredients;
            for (let k = 0; k < ingredientsList.length; k += 1) {
              ingredients.push(ingredientsList[k]);
            }
          }
        }
        const myIngredients = [];
        for (let i = 0; i < ingredients.length; i += 1) {
          if (!myIngredients.includes(ingredients[i].name)) {
            myIngredients.push(ingredients[i].name);
          }
        }

        const newRecipe = new Recipe({
          id: myID,
          ingredients: myIngredients,
          instructions: steps,
        });

        //  save in database
        await newRecipe.save().catch((err) => {
          console.log(err);
        });
        console.log('saved Recipe');
      }

      //  find if a Recipe entry already exists for this id
      async function recipeExists(myID) {
        await Recipe.find({ id: myID }, function recipeFunction(err, myData) {
          if (myData.length > 0) {
            console.log('recipe does exist. save route must have failed');
          } else {
            apiSaveRecipe(myID);
          }
        });
      }

      async function checkIDs(myBreakfastID, myLunchID, myDinnerID) {
        await recipeExists(myBreakfastID);
        await recipeExists(myLunchID);
        await recipeExists(myDinnerID);
      }

      checkIDs(breakfastID, lunchID, dinnerID);
    })
    .catch((err) => {
      console.log(err);
    });
});

async function getRecipe(mealID, res) {
  await Recipe.findOne({ id: mealID }, function recipeFunction2(err, data) {
    if (data == null) {
      return res.json({ errMsg: 'Recipe has not been saved' });
    }

    return res.json({
      ingredients: data.ingredients,
      instructions: data.instructions,
    });
  });
}

router.get('/get-breakfast-recipe', (req, res) => {
  if (!req.session.user || req.session.user === undefined) {
    return res.json({ errMsg: 'You must be logged in to do that' });
  }

  Rec.findOne({ username: req.session.user.toString() })
    .then(async (data) => {
      if (data == null || data.meals == null) {
        return res.json({ errMsg: 'You have not generated your meal plan!' });
      }
      const mealID = data.meals[0].id;
      await getRecipe(mealID, res);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get('/get-lunch-recipe', (req, res) => {
  if (!req.session.user || req.session.user === undefined) {
    return res.json({ errMsg: 'You must be logged in to do that' });
  }

  Rec.findOne({ username: req.session.user.toString() })
    .then(async (data) => {
      if (data == null || data.meals == null) {
        return res.json({ errMsg: 'You have not generated your meal plan!' });
      }
      const mealID = data.meals[1].id;
      await getRecipe(mealID, res);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get('/get-dinner-recipe', (req, res) => {
  if (!req.session.user || req.session.user === undefined) {
    return res.json({ errMsg: 'You must be logged in to do that' });
  }

  Rec.findOne({ username: req.session.user.toString() })
    .then(async (data) => {
      if (data == null || data.meals == null) {
        return res.json({ errMsg: 'You have not generated your meal plan!' });
      }
      const mealID = data.meals[2].id;
      await getRecipe(mealID, res);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
