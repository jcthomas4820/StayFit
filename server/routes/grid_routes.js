/*
Holds routes to Grid actions
    -   get grid data
    -   save grid data
*/

const express = require('express');

const router = express.Router();
const Exercise = require('../models/exercise');

/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

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
      const ids = [];
      for (let i = 0; i < exercises.length; i += 1) {
        const entry = {
          name: exercises[i].name,
          date: exercises[i].date,
          description: exercises[i].progress,
        };
        data.push(entry);
        ids.push(exercises[i]._id);
      }
      return res.json({ exerciseData: data, exerciseIds: ids });
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