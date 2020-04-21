/*
Holds routes for Calorie calculations
    - save cal rec
    - get cal rec
*/

const express = require('express');

const router = express.Router();
const Rec = require('../models/rec');

router.post('/save-cal-rec', function(req, res) {
  //  check if user is logged in
  if (!req.session.user || req.session.user === undefined) {
    return res.json({ errMsg: 'You must be logged in to do that' });
  }

  //  get user entered data
  const data = req.body;
  const gender = data.userGender;
  let age = data.userAge;
  let weight = data.userWeight;
  let height = data.userHeight;
  const activity_level = data.userActivityLevel;

  //  if any value not entered, return error
  if (
    !data ||
    gender === '' ||
    age === '' ||
    weight === '' ||
    height === '' ||
    activity_level === ''
  ) {
    return res.json({ errMsg: 'Please enter all fields' });
  }

  age = Number(age);
  weight = Number(weight);
  height = Number(height);

  //  check each number value
  if (Number.isNaN(age) || age <= 0) {
    return res.json({ errMsg: 'Please enter a valid age' });
  }
  if (Number.isNaN(weight) || weight <= 0) {
    return res.json({ errMsg: 'Please enter a valid weight' });
  }
  if (Number.isNaN(height) || height <= 0) {
    return res.json({ errMsg: 'Please enter a valid height' });
  }

  //  values are all valid, begin calorie calculation
  let BMR = 0;

  if (gender === 'male') {
    BMR = 66 + 6.3 * weight + 12.9 * height - 6.8 * age;
  } else if (gender === 'female') {
    BMR = 655 + 4.3 * weight + 4.7 * height - 4.7 * age;
  } else {
    return res.json({ errorMsg: 'Invalid gender entered' });
  }

  let factor = 0;

  switch (activity_level) {
    case 'sedentary':
      factor = 1.2;
      break;
    case 'lightly active':
      factor = 1.375;
      break;
    case 'moderately active':
      factor = 1.55;
      break;
    case 'very active':
      factor = 1.725;
      break;
    case 'extra active':
      factor = 1.9;
      break;
    default:
      //  return error message
      return res.json({ errorMsg: 'Invalid activity level entered' });
  }

  const calorie_rec = BMR * factor;

  async function updateDoc(filter, update) {
    const doc = await Rec.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true,
    });
  }

  //  save to DB
  const filter = { username: req.session.user.toString() };
  const update = { cal_rec: calorie_rec };
  updateDoc(filter, update);

  //  return the caloric need back to the user
  return res.json({ cals: Math.round(calorie_rec) });
});

router.get('/get-cal-rec', function(req, res) {
  if (!req.session.user || req.session.user === undefined) {
    return res.json({ errMsg: 'You must be logged in to do that' });
  }

  Rec.findOne({ username: req.session.user.toString() })
    .then((data) => {
      if (data == null) {
        return res.json({
          errMsg: 'You need to calculate your recommended calories',
        });
      }
      const calorie_recommendation = data.cal_rec;
      return res.json({ userCals: calorie_recommendation });
    })
    .catch((err) => {
      console.log('error when retrieving calories');
    });
});

module.exports = router;
