// Import the dependencies for testing
const assert = require('assert');
const axios = require('axios').default;
const mongoose = require('mongoose');
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');
axiosCookieJarSupport(axios);

const app = require('../app');

const User = require('../models/user');
const Grid = require('../models/grid')
let db;
let collection;

const PORT = 3001;

describe('application', async () => {
  /* fill these in before each test */
  let server = {};
  let client = {};

  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = `http://localhost:${PORT}/`;
  axios.defaults.validateStatus = () => true;

  /* Utility functions
   */
  // Deterministic (for testing) Math.random replacement
  // https://gist.github.com/mathiasbynens/5670917

  const psrand = (() => {
    let seed = 0xaabbccd;
    return () => {
      /* eslint-disable no-bitwise */
      // Robert Jenkins’ 32 bit integer hash function
      seed = (seed + 0x7ed55d16 + (seed << 12)) & 0xffffffff;
      seed = (seed ^ 0xc761c23c ^ (seed >>> 19)) & 0xffffffff;
      seed = (seed + 0x165667b1 + (seed << 5)) & 0xffffffff;
      seed = ((seed + 0xd3a2646c) ^ (seed << 9)) & 0xffffffff;
      seed = (seed + 0xfd7046c5 + (seed << 3)) & 0xffffffff;
      seed = (seed ^ 0xb55a4f09 ^ (seed >>> 16)) & 0xffffffff;
      return (seed & 0xfffffff) / 0x10000000;
      /* eslint-enable no-bitwise */
    };
  })();

  // https://gist.github.com/6174/6062387#gistcomment-2915959
  function getRandomString(length) {
    let s = '';
    do {
      s += psrand()
        .toString(36)
        .substr(2);
    } while (s.length < length);
    s = s.substr(0, length);
    return s;
  }

  beforeEach(async () => {
    client = axios.create();
    // make a new cookie jar every time you create a new client
    client.defaults.jar = new tough.CookieJar();
    server = app.listen(PORT);

    // remove all of the users added to the database before testing
    await User.deleteMany({}, function(err) { 
      console.log('All users removed') 
    });
    await Grid.deleteMany({}, function(err) {
      console.log('All grids removed')
    });
  });

  afterEach(async () => {
    await server.close();
  });

  after(async () => {
      await User.deleteMany({}, function(err) {
        console.log('All users removed')
      });
      await Grid.deleteMany({}, function(err) {
        console.log('All grids removed')
      });
    await mongoose.connection.close();
  });

  describe('unauthenticated state', async () => {
    describe('register-test', async () => {
      it('allows a user to register', async () => {
        let result = await client.post('/api/register', {username: getRandomString(10), password: getRandomString(10)});        
        assert.equal(result.data, 'New user created');
      });

      it('does not allow duplicate usernames', async () => {
        let sampleUser = getRandomString(15);
        await client.post('/api/register', {username: sampleUser, password: getRandomString(10)});
        let result = await client.post('/api/register', {username: sampleUser, password: getRandomString(10)});
        assert.equal(result.data.regError, 'Username already exists');
      });

      it('requires a password to register', async () => {
        let result = await client.post('/api/register', {username: getRandomString(10), password: ''});
        assert.equal(result.data.regError, 'Please enter a valid password');
      });

      it('requires a username to register', async () => {
        let result = await client.post('/api/register', {username: '', password: getRandomString(10)});
        assert.equal(result.data.regError, 'Please enter a valid username');
      });
    });

    describe('login-test', async () => {
      it('allows a registered user to login', async () => {
        let user = { username: getRandomString(10), password: getRandomString(10) };
        await client.post('/api/register', user);
        let result = await client.post('/api/login', user);

        assert.equal(result.data, 'User successfully logged in');
      });

      it('requires an account with username to exist', async () => {
        let user = { username: getRandomString(10), password: getRandomString(10) };
        let result = await client.post('/api/login', user);
        assert.equal(result.data.logError, 'Username does not exist');
      });

      it('requires the correct password given a username', async () => {
        let name = getRandomString(10);
        let user = { username: name, password: getRandomString(10) };
        await client.post('/api/register', user);
        let result = await client.post('/api/login', {username: name, password: getRandomString(10)});
        assert.equal(result.data.logError, 'Incorrect password entered');
      });
    });
  });

  describe('authenticated state', async () => {
    // **** // 
    describe('logout-test', async () => {
      it('redirects a client to the loggedout main screen once logged out', async () => {
        let user = { username: getRandomString(10), password: getRandomString(10) };
        await client.post('/api/register', user);
        let result = await client.post('/api/logout');
        assert.equal(result.data, 'User logged out');
      });
    });

    describe('get-grid-data-test', async () => {
      it('correctly pulls up user exercise data', async () => {
        // login/register a user
        let user = { username: getRandomString(10), password: getRandomString(10) };
        await client.post('/api/register', user);
        await client.post('/api/save-grid-data', {exerciseNumber: 1,
                                                  exerciseName: "bicep curl",
                                                  exerciseProgress: "25lb 4s10r",
                                                  exerciseDate: "3/26/2020"});
        await client.post('/api/save-grid-data', {exerciseNumber: 2,
                                                  exerciseName: "inner bicep curl",
                                                  exerciseProgress: "25lb 4s10r",
                                                  exerciseDate: "3/27/2020"});
        await client.post('/api/save-grid-data', {exerciseNumber: 3,
                                                  exerciseName: "push ups",
                                                  exerciseProgress: "4s5r",
                                                  exerciseDate: "3/28/2020"});
        let result = await client.get('/api/get-grid-data');
        let exercise1 = ["bicep curl", "25lb 4s10r", "3/26/2020"];
        let exercise2 = ["inner bicep curl", "25lb 4s10r", "3/27/2020"];
        let exercise3 = ["push ups", "4s5r", " 3/28/2020"];
        console.log(result.data.getGridError);
        assert.equal(result.data.exercise1, exercise1);
        assert.equal(result.data.exercise2, exercise2);
        assert.equal(result.data.exercise3, exercise3);
      });
    });

    describe('save-grid-data-test', async () => {
//      it('allows a user to save their workout record for the day');
//      it('allows the user select how to organize the grid');
//      it('allows a user to track their progress');
//      it('saves user data after logging information');
//      it('allows a user to update entries');
//      it('allows user to remove rows from the grid');

      it('throws error when a user tries to save empty data', async () => {
        // login/register a user
        let user = { username: getRandomString(10), password: getRandomString(10) };
        await client.post('/api/register', user);
        let result = await client.post('/api/save-grid-data', {exerciseNumber: 1,
                                                              exerciseName: "",
                                                              exerciseProgress: "25lb 4s10r",
                                                              exerciseDate: "3/26/2020"})

        assert.equal(result.data.saveGridError, 'You must provide a name for the exercise');

        result = await client.post('/api/save-grid-data', {exerciseNumber: 1,
                                                  exerciseName: "bicep curl",
                                                  exerciseProgress: "",
                                                  exerciseDate: "3/26/2020"})

        assert.equal(result.data.saveGridError, 'You must provide the progress of the exercise');

        result = await client.post('/api/save-grid-data', {exerciseNumber: 1,
                                                  exerciseName: "bicep curl",
                                                  exerciseProgress: "30lb 4s10r",
                                                  exerciseDate: ""})

        assert.equal(result.data.saveGridError, 'You must provide a date');

      });
      it('allows a user to save their exercise progress', async () => {
        // login/register a user
        let user = { username: getRandomString(10), password: getRandomString(10) };
        await client.post('/api/register', user);
        let result = await client.post('/api/save-grid-data', {exerciseNumber: 1,
                                                              exerciseName: "bicep curl",
                                                              exerciseProgress: "25lb 4s10r",
                                                              exerciseDate: "3/26/2020"})

        assert.equal(result.data, 'Your exercise values are saved');

      });

      it('allows a user to update entries', async () => {
        // login/register a user
        let user = { username: getRandomString(10), password: getRandomString(10) };
        await client.post('/api/register', user);
        await client.post('/api/save-grid-data', {exerciseNumber: 1,
                                                  exerciseName: "bicep curl",
                                                  exerciseProgress: "25lb 4s10r",
                                                  exerciseDate: "3/26/2020"})
        await client.post('/api/logout', user);
        await client.post('/api/login', user);
        await client.post('/api/save-grid-data', {exerciseNumber: 1,
                                                  exerciseName: "bicep curl",
                                                  exerciseProgress: "30lb 4s10r",
                                                  exerciseDate: "3/26/2020"})
        await client.post('/api/save-grid-data', {exerciseNumber: 1,
                                                  exerciseName: "inner-bicep curl",
                                                  exerciseProgress: "30lb 4s10r",
                                                  exerciseDate: "3/26/2020"})
        let result = await client.get('/api/get-grid-data');
        assert.equal(result.data.exercise1, {name: "inner-bicep curl", progress: "30lb 4s10r", date: "3/26/2020" });
      });

       it('throws error if a registered user tries to track or update exercise without logging in', async () => {
           // login/register a user
           let user = { username: getRandomString(10), password: getRandomString(10) };
           await client.post('/api/register', user);
           await client.post('/api/logout', user);

           let result = await client.post('/api/save-grid-data', {exerciseNumber: 1,
                                                                  exerciseName: "bicep curl",
                                                                  exerciseProgress: "25lb 4s10r",
                                                                  exerciseDate: "3/26/2020"})

           assert.equal(result.data.saveGridError, 'You must be logged in to do that');

       });

       it('throws error if an unregistered user tries to track or update exercise', async () => {
           let result = await client.post('/api/save-grid-data', {exerciseNumber: 1,
                                                                  exerciseName: "bicep curl",
                                                                  exerciseProgress: "25lb 4s10r",
                                                                  exerciseDate: "3/26/2020"})

            assert.equal(result.data.saveGridError, 'You must be logged in to do that');

       });

    });

    // ***** //
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }

    describe('calculate-test', async () => {
      it('allows user to store their gender', async () => {

        // login a user
        let user = { username: getRandomString(10), password: getRandomString(10) };
        await client.post('/api/register', user);

        // gender err
        let result = await client.post('/api/calculate', {userGender: '',
                                                           userAge: getRandomInt(1, 101),
                                                           userHeight: getRandomInt(120, 201),
                                                           userWeight: getRandomInt(70, 181),
                                                           userActivityLevel: " Extra Active"});

        assert.equal(result.data.calcError, 'You must select a gender to calculate the macros');
      });

      it('allows user to store their age', async () => {

          // register a user
          let user = { username: getRandomString(10), password: getRandomString(10) };
          await client.post('/api/register', user);

          // age err
          let result = await client.post('/api/calculate', { userGender: "Female",
                                                             userAge: "",
                                                             userHeight: getRandomInt(120, 201),
                                                             userWeight: getRandomInt(70, 120),
                                                             userActivityLevel: " Sedentary"});
          assert.equal(result.data.calcError, 'You must enter an age to calculate the macros');

          result= await client.post('/api/calculate', { userGender: 'Female',
                                                          userAge: -50,
                                                          userHeight: getRandomInt(120, 201),
                                                          userWeight: getRandomInt(50, 130),
                                                          userActivityLevel: " Lightly Active"});
          assert.equal(result.data.calcError, 'Please enter a valid age to calculate the macros');

      });

    it('allows user to store their height', async () => {

        // register a user
        let user = { username: getRandomString(10), password: getRandomString(10) };
        await client.post('/api/register', user);
        // height err
        let result = await client.post('/api/calculate', { userGender: 'Male',
                                                       userAge: getRandomInt(10, 101),
                                                       userHeight: "",
                                                       userWeight: getRandomInt(70, 181),
                                                       userActivityLevel: " Moderately Active"});
        assert.equal(result.data.calcError, 'You must enter a height (cm) to calculate the macros');

        result = await client.post('/api/calculate', { userGender: 'Male',
                                                       userAge: getRandomInt(10, 101),
                                                       userHeight: -20,
                                                       userWeight: getRandomInt(70, 181),
                                                       userActivityLevel: " Extra Active"});
        assert.equal(result.data.calcError, 'Please enter a valid height (cm) to calculate the macros');

    });

    it('allows user to store their weight', async () => {

        // register a user
        let user = { username: getRandomString(10), password: getRandomString(10) };
        await client.post('/api/register', user);

        // weight err
        let result = await client.post('/api/calculate', {userGender: 'Male',
                                                           userAge: getRandomInt(1, 101),
                                                           userHeight: getRandomInt(120, 201),
                                                           userWeight: "",
                                                           userActivityLevel: " Lightly Active"});
        assert.equal(result.data.calcError, 'You must enter a weight (kg) to calculate the macros');

        result = await client.post('/api/calculate', {userGender: 'Female',
                                                           userAge: getRandomInt(1, 101),
                                                           userHeight: getRandomInt(120, 201),
                                                           userWeight: -90,
                                                           userActivityLevel: " Sedentary"});
        assert.equal(result.data.calcError, 'Please enter a valid weight (kg) to calculate the macros');
    });

    it('allows user to store their activity level', async () => {

        // register a user
        let user = { username: getRandomString(10), password: getRandomString(10) };
        await client.post('/api/register', user);

        // activity level err
        let result = await client.post('/api/calculate', {userGender: 'Male',
                                                           userAge: getRandomInt(1, 101),
                                                           userHeight: getRandomInt(120, 201),
                                                           userWeight: getRandomInt(70, 181),
                                                           userActivityLevel: ""});
        assert.equal(result.data.calcError, 'You must select an activity level to calculate the macros');
    });

      it('calculates daily recommendations based on personal user values for male', async () => {
            // register a user
            let user = { username: getRandomString(10), password: getRandomString(10) };
            await client.post('/api/register', user);

            // correct calculation of prot, carbs, and fats for Male
            let result = await client.post('/api/calculate', { userGender: "Male",
                                                               userAge: 25,
                                                               userWeight: 125,
                                                               userHeight: 171,
                                                               userActivityLevel: " Moderately Active"});
             // get the activity factor based on activity level
            let activityFactor = 1.55;

            // calculate macros
            let caloriesPerDay = (((10*125) + (6.25*171) - (5*25))*activityFactor) + 5;
            let expectedMacros = { prots: caloriesPerDay*0.35,
                           carbs: caloriesPerDay*0.35,
                           fats: caloriesPerDay*0.30 }
            assert.equal(result.data.macros.prots, expectedMacros.prots);
            assert.equal(result.data.macros.carbs, expectedMacros.carbs);
            assert.equal(result.data.macros.fats, expectedMacros.fats);
      });

      it('calculates daily recommendations based on personal user values for female', async () => {
            // register a user
            let user = { username: getRandomString(10), password: getRandomString(10) };

            await client.post('/api/register', user);
            // correct calculation of prot, carbs, and fats for Female
            result = await client.post('/api/calculate', { userAge: 22,
                                                           userGender: "Female",
                                                           userWeight: 50,
                                                           userHeight: 160,
                                                           userActivityLevel: " Very Active"});
             // get the activity factor based on activity level
            let activityFactor = 1.725;
            // calculate macros
            caloriesPerDay = (((10*(50)) + (6.25*160) - (5*22))*activityFactor) - 161;
            let expectedMacros = { prots: caloriesPerDay*0.35,
                       carbs: caloriesPerDay*0.35,
                       fats: caloriesPerDay*0.30 }
            assert.equal(result.data.macros.prots, expectedMacros.prots);
            assert.equal(result.data.macros.carbs, expectedMacros.carbs);
            assert.equal(result.data.macros.fats, expectedMacros.fats);

      });
      });
      describe('submit-test', async () => {
      it('allows user to track the macros calculated', async () => {

            // register a user
            let user = { username: getRandomString(10), password: getRandomString(10) };
            await client.post('/api/register', user);

            // calculate and submit macros
            let result = await client.post('/api/calculate', {userGender: 'Female',
                                                       userAge: 22,
                                                       userHeight: 160,
                                                       userWeight: 55,
                                                       userActivityLevel: " Moderately Active"});

            // submit macros
            let result2 = await client.post('/api/submit', {data: result.data.macros});
            assert.equal(result2.data, 'Your macro values are saved');
      });

      it('throws error if user tracks macros without calculating them first', async () => {

            // register a user
            let user = { username: getRandomString(10), password: getRandomString(10) };
            await client.post('/api/register', user);

            // submit macros with null values
            let macros = { prots: null,
                           carbs: null,
                           fats: null}
            result = await client.post('/api/submit', {data: macros});
            assert.equal(result.data.submitError, 'You must calculate macros before submitting');
            // submit without any data
            result = await client.post('/api/submit', {data: null});
            assert.equal(result.data.submitError, 'You must calculate macros before submitting');

      });

       it('throws error if a registered user tries to submit macros without logging in', async () => {
            // register, login, then logout a user
            let user = { username: getRandomString(10), password: getRandomString(10) };
            await client.post('/api/register', user);
            await client.post('/api/logout', user);

             // submit macros
            let macros = { prots: 100,
                           carbs: 200,
                           fats: 300}
            result = await client.post('/api/submit', {data: macros});
            assert.equal(result.data.submitError, 'You must be logged in to do that');

        });
       it('throws error if an unregistered user tries to submit macros', async () => {
            // submit macros
            let macros = { prots: 100,
                           carbs: 200,
                           fats: 300}
            result = await client.post('/api/submit', {data: macros});
            assert.equal(result.data.submitError, 'You must be logged in to do that');

        });

    });

    describe('nutrition-test', async () => {
      it('allows user to input a meal');
      it('calculates the remaining nutrient daily goal after meal input');
      it('alerts the user when they are over their daily intake');
    });
  });
});