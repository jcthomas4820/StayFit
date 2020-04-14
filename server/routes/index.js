const bcrypt = require('bcrypt');
const express = require('express');
const Exercise = require('../models/exercise');
const User = require('../models/user');

const router = express.Router();

const saltRounds = 10;

/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

router.get('/', (req, res) => {
  // If the user is already logged it, it will immediately route them
  // to the selection page instead of the login page
  if (!req.session.user || req.session.user === undefined) {
    return res.json({ status: 'Not logged in' });
  }

  return res.json({ status: 'Logged in' });
});

router.post('/logout', (req, res) => {
  if (!req.session.user || req.session.user === undefined) {
    return res.json({ logoutErr: 'There is no one logged in' });
  }

  req.session.destroy((err) => {
    if (err) {
      return res.json({ logoutErr: err });
    }
    return res.json('User logged out');
  });
});

router.post('/login', (req, res) => {
  // if the user exists, compare the password and determine if it matches
  // if yes -> update the session and send successful response
  // if no -> send an error response
  // if the user doesn't exist -> send an error response
  User.findOne({ username: req.body.username }).then((user) => {
    if (user) {
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.json({ logError: 'Incorrect password entered' });
      }

      req.session.user = user._id;
      return res.json('User successfully logged in');
    }

    return res.json({ logError: 'Username does not exist' });
  });
});

router.post('/register', (req, res) => {
  // Check that the user entered a username
  if (!req.body.username) {
    return res.json({ regError: 'Please enter a valid username' });
  }

  // Check that the user entered a password
  if (!req.body.password) {
    return res.json({ regError: 'Please enter a valid password' });
  }

  // Entries are valid - save them
  const usernameIn = req.body.username;
  const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);

  // Check if the user exists
  // If yes -> send an error response
  // If no -> register the user and send a successful response
  User.findOne({ username: usernameIn }).then((user) => {
    if (user) {
      return res.json({ regError: 'Username already exists' });
    }
    const newUser = new User({
      username: usernameIn,
      password: hashedPassword,
    });
    newUser
      .save()
      .then((newU) => {
        req.session.user = newU._id;
        return res.json('New user created');
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

router.post('/calculate', (req, res) => {
  // check if user is logged in
  if (!req.session.user || req.session.user === undefined) {
    return res.json({ calcError: 'You must be logged in to do that' });
  }

  // error check inputs
  if (!req.body.userGender || req.body.userGender === '') {
    return res.json({
      calcError: 'You must select a gender to calculate the macros',
    });
  }
  if (!req.body.userAge || req.body.userAge === '') {
    return res.json({
      calcError: 'You must enter an age to calculate the macros',
    });
  }
  if (Number.isNaN(Number(req.body.userAge)) || req.body.userAge < 0) {
    return res.json({
      calcError: 'Please enter a valid age to calculate the macros',
    });
  }
  if (!req.body.userWeight || req.body.userWeight === '') {
    return res.json({
      calcError: 'You must enter a weight (kg) to calculate the macros',
    });
  }
  if (Number.isNaN(Number(req.body.userWeight)) || req.body.userWeight <= 0) {
    return res.json({
      calcError: 'Please enter a valid weight (kg) to calculate the macros',
    });
  }
  if (!req.body.userHeight || req.body.userHeight === '') {
    return res.json({
      calcError: 'You must enter a height (cm) to calculate the macros',
    });
  }
  if (Number.isNaN(Number(req.body.userHeight)) || req.body.userHeight <= 0) {
    return res.json({
      calcError: 'Please enter a valid height (cm) to calculate the macros',
    });
  }
  if (!req.body.userActivityLevel || req.body.userActivityLevel === '') {
    return res.json({
      calcError: 'You must select an activity level to calculate the macros',
    });
  }

  // grab other user data values
  const gender = req.body.userGender;
  const age = req.body.userAge;
  const weight = req.body.userWeight;
  const height = req.body.userHeight;
  const activityLevel = req.body.userActivityLevel;

  // calculate the macros: https://www.healthline.com/nutrition/how-to-count-macros#step-by-step
  // get the activity factor based on activity level
  let activityFactor = 0;
  if (activityLevel === 'sedentary') {
    activityFactor = 1.2;
  } else if (activityLevel === 'lightly active') {
    activityFactor = 1.375;
  } else if (activityLevel === 'moderately active') {
    activityFactor = 1.55;
  } else if (activityLevel === 'very active') {
    activityFactor = 1.725;
  } else if (activityLevel === 'extra active') {
    activityFactor = 1.9;
  }

  // calculate caloriesPerDay based on gender
  let caloriesPerDay = (10 * weight + 6.25 * height - 5 * age) * activityFactor;
  if (gender === 'male') {
    caloriesPerDay += 5;
  } else {
    caloriesPerDay -= 161;
  }

  const macros = {
    prot: Math.round(caloriesPerDay * 0.35),
    carbs: Math.round(caloriesPerDay * 0.35),
    fats: Math.round(caloriesPerDay * 0.3),
  };

  // respond with macros
  return res.json({ macros });
});

router.post('/submit', (req, res) => {
  // check of user is logged in
  if (!req.session.user || req.session.user === undefined) {
    return res.json({ submitError: 'You must be logged in to do that' });
  }

  // get user provided data
  const data = req.body;

  // check if data sent is null
  if (!data || !data.prot || !data.carbs || !data.fats) {
    return res.json({
      submitError: 'You must calculate macros before submitting',
    });
  }

  // save data to DB
  // https://mongoosejs.com/docs/tutorials/findoneandupdate.html
  User.findOneAndUpdate(
    { _id: req.session.user },
    { $set: { macros: data } },
    { new: true, useFindAndModify: false },
    (error) => {
      if (error) {
        return res.json({
          submitError: 'Error: Data not saved. Please try again.',
        });
      }
      return res.json('Your macro values are saved');
    },
  );
});

router.get('/get-grid-data', (req, res) => {
  if (!req.session.user || req.session.user === undefined) {
    return res.json({ getGridError: 'The user is not logged in' });
  }

  Exercise.find({ username: req.session.user.toString() })
    .then((exercises) => {
      if (exercises.length === 0) {
        return res.json({ getGridError: 'You have no exercises saved yet!' });
      }

      const data = [];
      for (let i = 0; i < exercises.length; i += 1) {
        const entry = {
          name: exercises[i].name,
          date: exercises[i].date,
          description: exercises[i].progress,
        };
        data.push(entry);
      }
      return res.json({ exerciseData: data });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/save-grid-data', (req, res) => {
  // check of user is logged in
  if (!req.session.user || req.session.user === undefined) {
    return res.json({ saveGridError: 'You must be logged in to do that' });
  }

  // get user provided data
  const name = req.body.exerciseName;
  const description = req.body.exerciseDescription;
  const date = req.body.exerciseDate;

  // check if the data contains all 3 components: name, description, and date
  if (!name || name === '') {
    return res.json({
      saveGridError: 'You must provide a name for the exercise',
    });
  }
  if (!date) {
    return res.json({ saveGridError: 'You must provide a date' });
  }
  if (!description || description === '') {
    return res.json({
      saveGridError: 'You must provide the description of the exercise',
    });
  }

  // save data to DB
  const newExercise = new Exercise({
    username: req.session.user.toString(),
    name,
    progress: description,
    date,
  });
  newExercise
    .save()
    .then(() => {
      return res.json('Your exercise values are saved');
    })
    .catch((err) => {
      console.log(err);
    });
});
module.exports = router;