/*
Holds routes to Grid actions
    -   get grid data
    -   save grid data
*/

const express = require('express');

const router = express.Router();
const { check, validationResult } = require('express-validator');
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

router.post(
  '/save-grid-data',
  [
    check('name')
      .not()
      .isEmpty()
      .withMessage('You must provide a name for the exercise')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Exercise name should be at least 1 character long')
      .matches(/^[a-zA-Z]([ a-zA-Z]*?){1,}$/)
      .withMessage('Exercise can only contain letters and spaces'),
    check('desc')
      .not()
      .isEmpty()
      .withMessage('You must provide the description of the exercise')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Description should be at least 1 character long')
      .matches(/^[a-zA-Z0-9]([ a-zA-Z0-9]*?){1,}$/)
      .withMessage('Description can only contain letters, spaces and numbers'),
    check('date')
      .not()
      .isEmpty()
      .withMessage('You must provide a date')
      .trim()
      .matches(/^(0[1-9]|1[012])[/](0[1-9]|[12][0-9]|3[01])[/](19|20)\d\d$/)
      .withMessage('Date must be in the form mm/dd/yyyy'),
  ],
  (req, res) => {
    // check of user is logged in
    if (!req.session.user || req.session.user === undefined) {
      return res.json({ saveGridError: 'You must be logged in to do that' });
    }

    // get user provided data
    const { name } = req.body;
    const description = req.body.desc;
    const { date } = req.body;

    // validate the login input
    const errors = validationResult(req).array();
    const errMsg = [];
    errors.forEach((err) => errMsg.push(err.msg));

    // just send the first error thrown
    if (errMsg.length > 0) {
      return res.json({ saveGridError: errMsg[0] });
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
  },
);

router.post(
  '/edit-grid-row',
  [
    check('name')
      .not()
      .isEmpty()
      .withMessage('Please enter a valid exercise name')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Exercise name should be at least 1 character long')
      .matches(/^[a-zA-Z]([ a-zA-Z]*?){1,}$/)
      .withMessage('Exercise can only contain letters and spaces'),
    check('desc')
      .not()
      .isEmpty()
      .withMessage('You must enter a description')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Description should be at least 1 character long')
      .matches(/^[a-zA-Z0-9]([ a-zA-Z0-9]*?){1,}$/)
      .withMessage('Description can only contain letters, spaces and numbers'),
    check('date')
      .not()
      .isEmpty()
      .withMessage('You must enter a date')
      .trim()
      .matches(/^(0[1-9]|1[012])[/](0[1-9]|[12][0-9]|3[01])[/](19|20)\d\d$/)
      .withMessage('Date must be in the form mm/dd/yyyy'),
  ],
  (req, res) => {
    // check of user is logged in
    if (!req.session.user || req.session.user === undefined) {
      return res.json({ errMsg: 'You must be logged in to do that' });
    }

    // get user provided data
    const { name } = req.body;
    const description = req.body.desc;
    const { date } = req.body;
    const id = req.body.entryToDelete;

    // validate the login input
    const errors = validationResult(req).array();
    const errMsg = [];
    errors.forEach((err) => errMsg.push(err.msg));

    // just send the first error thrown
    if (errMsg.length > 0) {
      return res.json({ editErr: errMsg[0] });
    }

    // Edit data in DB
    Exercise.findOneAndUpdate(
      { username: req.session.user.toString(), _id: id },
      { name, date, progress: description },
      { new: true, useFindAndModify: false },
    )
      .then((exercise) => {
        if (exercise) {
          return res.json('The exercise is updated');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
);

router.post('/delete-grid-row', (req, res) => {
  // check of user is logged in
  if (!req.session.user || req.session.user === undefined) {
    return res.json({ errMsg: 'You must be logged in to do that' });
  }

  const id = req.body.entryToDelete;

  // check if the data contains all 3 components: name, description, and date
  if (!id || id === '') {
    return res.json({ errMsg: 'The exercise ID to delete was not provided' });
  }

  // delete data from DB
  Exercise.findOneAndDelete(
    {
      _id: id,
    },
    { useFindAndModify: false },
  )
    .then((exercise) => {
      if (exercise) {
        return res.json('The exercise is deleted');
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
