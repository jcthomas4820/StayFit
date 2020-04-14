/*
Holds routes to Grid actions
    -   get grid data
    -   save grid data
*/

const express = require('express');
const router = express.Router();
const Exercise = require('../models/exercise')

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

module.exports = router;