/* 
Hold routes for meal plan operations
  - generate meal plan
  - get meal plan
*/

const express = require('express');

const fetch = require('node-fetch');

const key = require('../config/keys.js').app_key;

const router = express.Router();
const Rec = require('../models/rec');
const Recipe = require('../models/recipe');

router.post('/generate-meal-plan', (req, res) => {
  if (!req.session.user || req.session.user === undefined) {
    return res.json({ errMsg: 'You must be logged in to do that' });
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

      async function saveMealPlan(myMeals, myUsername, myNutrients){
        await Rec.findOneAndUpdate(
          { username: myUsername},
          { $set: { meals: myMeals, mealplan_nutrients: myNutrients } },
        )
      }

      saveMealPlan(myMeals, req.session.user.toString(), myNutrients)
      console.log('Successfully Saved Meal Plan');
      return res.json({ successMsg: 'Successfully saved meal plan' });
    })
    .catch((error) => {
      console.log(error);
      return res.json({ errorMsg: 'Error when saving meal plan. Try again.' });
    });
});

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


router.post('/save-recipes', (req, res) => {
  if (!req.session.user || req.session.user === undefined) {
    return res.json({ errMsg: 'You must be logged in to do that' });
  }

  //  find user's recommended meals
  Rec.findOne({ username: req.session.user.toString() })
  .then((data) => {
    if (data.meals == null) {
      return res.json({
        errMsg: "You haven't generated your meal plan yet!",
      });
    }

    breakfastID = data.meals[0].id
    lunchID = data.meals[1].id
    dinnerID = data.meals[2].id

    //  find if a Recipe entry already exists for this id 
    async function recipeExists(myID){
      await Recipe.find({id: myID}, function(err, data) {
        if (data.length > 0){
          console.log("recipe does exist")
          //return true;
        }
        else{
          apiSaveRecipe(myID)
        }
      })
    }

    async function apiSaveRecipe(myID){

      //  make api call to get the recipe for myID
      let url = 'https://api.spoonacular.com/recipes/' + myID + `/analyzedInstructions?apiKey=${key}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()

      //  parse the api response data, save as myIngredients and steps
      let items = []
      let steps =[]
      let ingredients = []
      for (i=0; i<data.length; i++){
        items.push(data[i].steps)
      }
      for (i=0; i<items.length; i++){
        let myObj = items[i]
        for (j=0; j<myObj.length; j++){
          steps.push(myObj[j].step)
          ingredientsList = myObj[j].ingredients
          for (k=0; k<ingredientsList.length; k++){
            ingredients.push(ingredientsList[k])
          }
        }
      }
      let myIngredients = []
      for (i=0; i<ingredients.length; i++){
        if (!(myIngredients.includes(ingredients[i].name))){
          myIngredients.push(ingredients[i].name)
        }
      }

      const newRecipe = new Recipe({
        id: myID,
        ingredients: myIngredients,
        instructions: steps,
      });

      //  save in database
      await newRecipe.save()
      .catch((err) => {
        console.log(err)
      })
      console.log("saved Recipe")

    }

    async function checkIDs(breakfastID, lunchID, dinnerID){ 
      await recipeExists(breakfastID);
      await recipeExists(lunchID);
      await recipeExists(dinnerID);
    }

    checkIDs(breakfastID, lunchID, dinnerID);

    
  })
  .catch((err) => {
    console.log(err);
  });

})

async function getRecipe(mealID, res){

  await Recipe.findOne({ id: mealID }, function(err, data) {
    if (data == null){
      return res.json({errMsg: "Cannot find recipe"});
    }

    return res.json({ingredients: data.ingredients, instructions: data.instructions});
  })
}


router.get('/get-breakfast-recipe', (req, res) => {
  if (!req.session.user || req.session.user === undefined) {
    return res.json({ errMsg: 'You must be logged in to do that' });
  }

  Rec.findOne({ username: req.session.user.toString() })
  .then(async (data) => {
    let mealID = data.meals[0].id
    await getRecipe(mealID, res)
  })
  .catch((err) => {
    console.log(err);
    return res.json({errMsg: "cannot find user"})
  });
 
});


router.get('/get-lunch-recipe', (req, res) => {
  if (!req.session.user || req.session.user === undefined) {
    return res.json({ errMsg: 'You must be logged in to do that' });
  }

  Rec.findOne({ username: req.session.user.toString() })
  .then(async (data) => {
    let mealID = data.meals[1].id
    await getRecipe(mealID, res)
  })
  .catch((err) => {
    console.log(err);
    return res.json({errMsg: "cannot find user"})
  });
 
});


router.get('/get-dinner-recipe', (req, res) => {
  if (!req.session.user || req.session.user === undefined) {
    return res.json({ errMsg: 'You must be logged in to do that' });
  }

  Rec.findOne({ username: req.session.user.toString() })
  .then(async (data) => {
    let mealID = data.meals[2].id
    await getRecipe(mealID, res)
  })
  .catch((err) => {
    console.log(err);
    return res.json({errMsg: "cannot find user"})
  });
 
});



module.exports = router;