// Import the dependencies for testing
const assert = require('assert');
const axios = require('axios').default;
const mongoose = require('mongoose');
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');

axiosCookieJarSupport(axios);

const app = require('../app');

const User = require('../models/user');

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
    await User.deleteMany({}, () => {
      console.log('All test users removed');
    });
  });

  afterEach(async () => {
    await server.close();
  });

  after(async () => {
    await mongoose.connection.close();
  });

  describe('unauthenticated state', async () => {
    describe('register-test', async () => {
      it('allows a user to register', async () => {
        const result = await client.post('/api/register', {
          username: 'sampleuser',
          password: 'RandomPassword01234!',
        });
        assert.equal(result.data, 'New user created');
      });

      it('does not allow duplicate usernames', async () => {
        await client.post('/api/register', {
          username: 'sampleuser',
          password: 'RandomPassword01234!',
        });
        const result = await client.post('/api/register', {
          username: 'sampleuser',
          password: 'RandomPassword01234!',
        });
        assert.equal(result.data.regError, 'Username already exists');
      });

      it('requires a password to register', async () => {
        const result = await client.post('/api/register', {
          username: 'RandomPassword01234!',
          password: '',
        });
        assert.equal(result.data.regError, 'Please enter a valid password');
      });

      it('requires a username to register', async () => {
        const result = await client.post('/api/register', {
          username: '',
          password: 'RandomPassword01234!',
        });
        assert.equal(result.data.regError, 'Please enter a valid username');
      });
    });

    describe('login-test', async () => {
      it('allows a registered user to login', async () => {
        const user = {
          username: 'sampleuser',
          password: 'RandomPassword01234!',
        };
        await client.post('/api/register', user);
        const result = await client.post('/api/login', user);

        assert.equal(result.data, 'User successfully logged in');
      });

      it('requires an account with username to exist', async () => {
        const user = {
          username: 'sampleuser',
          password: 'RandomPassword01234!',
        };
        const result = await client.post('/api/login', user);
        assert.equal(result.data.logError, 'Username does not exist');
      });

      it('requires the correct password given a username', async () => {
        const name = getRandomString(10);
        const user = { username: name, password: getRandomString(10) };
        await client.post('/api/register', user);
        const result = await client.post('/api/login', {
          username: name,
          password: getRandomString(10),
        });
        assert.equal(result.data.logError, 'Incorrect password entered');
      });
    });
  });

  describe('authenticated state', async () => {
    describe('logout-test', async () => {
      it('logs out a loggedin user', async () => {
        const user = {
          username: 'sampleuser',
          password: 'RandomPassword01234!',
        };
        await client.post('/api/register', user);
        const result = await client.post('/api/logout');
        assert.equal(result.data, 'User logged out');
      });

      it('sends an error for a not loggedin user', async () => {
        const result = await client.post('/api/logout');
        assert.equal(result.data.logoutErr, 'There is no one logged in');
      });
    });

    describe('get_grid_data-test', async () => {
      it('correctly pulls up user exercise data from database', async () => {
        // register a user
        const user = {
          username: 'sampleuser',
          password: 'RandomPassword01234!',
        };
        await client.post('/api/register', user);

        // save some exercises
        await client.post('/grid/save-grid-data', {
          name: 'bicep curl',
          desc: '25lb 4s10r',
          date: '3/26/2020',
        });
        await client.post('/grid/save-grid-data', {
          name: 'inner bicep curl',
          desc: '25lb 4s10r',
          date: '3/27/2020',
        });

        // get exercise data from database
        let result = await client.get('/grid/get-grid-data');

        const list = [
          { name: 'bicep curl', date: '3/26/2020', description: '25lb 4s10r' },
          {
            name: 'inner bicep curl',
            date: '3/27/2020',
            description: '25lb 4s10r',
          },
        ];

        assert.deepEqual(result.data.exerciseData, list);

        // save more exercises
        await client.post('/grid/save-grid-data', {
          name: 'sit ups',
          desc: '4s5r',
          date: '3/30/2020',
        });

        const subList = {
          name: 'sit ups',
          date: '3/30/2020',
          description: '4s5r',
        };
        list.push(subList);

        // get exercise data from database again
        result = await client.get('/grid/get-grid-data');
        assert.deepEqual(result.data.exerciseData, list);
      });
    });

    describe('save_grid_data-test', async () => {
      it('does not allow for a user to save an exercise without a name, progress or date', async () => {
        // register a user
        const user = {
          username: 'sampleuser',
          password: 'RandomPassword01234!',
        };
        await client.post('/api/register', user);

        // save an exercise with no name
        const resultNoName = await client.post('/grid/save-grid-data', {
          name: '',
          desc: '25lb 4s10r',
          date: '3/26/2020',
        });
        assert.equal(
          resultNoName.data.saveGridError,
          'You must provide a name for the exercise',
        );

        // save an exercise with no progress
        const resultNoDesc = await client.post('/grid/save-grid-data', {
          name: 'bicep curl',
          desc: '',
          date: '3/26/2020',
        });
        assert.equal(
          resultNoDesc.data.saveGridError,
          'You must provide the description of the exercise',
        );

        // save an exercise with no date
        const resultNoDate = await client.post('/grid/save-grid-data', {
          name: 'bicep curl',
          desc: '30lb 4s10r',
          date: '',
        });
        assert.equal(
          resultNoDate.data.saveGridError,
          'You must provide a date',
        );
      });

      it('allows the user to track their exercise name, progress, and date', async () => {
        // register a user
        const user = {
          username: 'sampleuser',
          password: 'RandomPassword01234!',
        };
        await client.post('/api/register', user);

        // save an exercise with name, progress, and date
        const result = await client.post('/grid/save-grid-data', {
          name: 'bicep curl',
          desc: '30lb 4s10r',
          date: '3/20/2020',
        });

        assert.equal(result.data, 'Your exercise values are saved');
      });

      // todo: allow users to edit and delete exercises

      it('throws error if a registered user tries to track or update exercise without logging in', async () => {
        // register a user
        const user = {
          username: 'sampleuser',
          password: 'RandomPassword01234!',
        };
        await client.post('/api/register', user);
        await client.post('/api/logout', user);

        const result = await client.post('/grid/save-grid-data', {
          name: 'bicep curl',
          desc: '25lb 4s10r',
          date: '3/26/2020',
        });

        assert.equal(
          result.data.saveGridError,
          'You must be logged in to do that',
        );
      });

      it('throws error if an unregistered user tries to track or update exercise', async () => {
        // save exercise without logging in
        const result = await client.post('/grid/save-grid-data', {
          name: 'bicep curl',
          desc: '25lb 4s10r',
          date: '3/26/2020',
        });
        assert.equal(
          result.data.saveGridError,
          'You must be logged in to do that',
        );
      });
    });

    /*
    // ***** //
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    function getRandomInt(min, max) {
      const minC = Math.ceil(min);
      const maxF = Math.floor(max);
      // The maximum is exclusive and the minimum is inclusive
      return Math.floor(Math.random() * (maxF - minC)) + minC;
    }
    */
    describe('edit_grid_row-test', async () => {
      it('rejects operation if user is not logged in', async () => {
        const user = {
          username: 'sampleuser',
          password: 'RandomPassword01234!',
        };
        await client.post('/api/register', user);

        await client.post('/grid/save-grid-data', {
          name: 'bicep curl',
          desc: '25lb 4s10r',
          date: '3/26/2020',
        });

        const resultForID = await client.get('/grid/get-grid-data');
        const id = resultForID.data.exerciseIds[0];
        await client.post('/api/logout', user);

        const result = await client.post('/grid/edit-grid-row', {
          name: 'bicep curl',
          desc: '35lb 4s10r',
          date: '3/26/2020',
          entryToDelete: id,
        });

        assert.equal(result.data.errMsg, 'You must be logged in to do that');
      });

      it('properly edits an existing row', async () => {
        const user = {
          username: 'sampleuser',
          password: 'RandomPassword01234!',
        };
        await client.post('/api/register', user);

        await client.post('/grid/save-grid-data', {
          name: 'bicep curl',
          desc: '25lb 4s10r',
          date: '3/26/2020',
        });

        const resultForID = await client.get('/grid/get-grid-data');
        const id = resultForID.data.exerciseIds[0];

        const result = await client.post('/grid/edit-grid-row', {
          name: 'bicep curl',
          desc: '35lb 4s10r',
          date: '3/26/2020',
          entryToDelete: id,
        });

        assert.equal(result.data, 'The exercise is updated');

        const result2 = await client.get('/grid/get-grid-data');
        const list = [
          { date: '3/26/2020', description: '35lb 4s10r', name: 'bicep curl' },
        ];
        assert.deepEqual(result2.data.exerciseData, list);
      });
    });

    describe('delete_grid_row-test', async () => {
      it('rejects operation if user is not logged in', async () => {
        const user = {
          username: 'sampleuser',
          password: 'RandomPassword01234!',
        };
        await client.post('/api/register', user);

        await client.post('/grid/save-grid-data', {
          name: 'bicep curl',
          desc: '25lb 4s10r',
          date: '3/26/2020',
        });

        const resultForID = await client.get('/grid/get-grid-data');
        const id = resultForID.data.exerciseIds[0];
        await client.post('/api/logout', user);

        const result = await client.post('/grid/delete-grid-row', {
          entryToDelete: id,
        });

        assert.equal(result.data.errMsg, 'You must be logged in to do that');
      });

      it('properly deletes an existing row', async () => {
        const user = {
          username: 'sampleuser',
          password: 'RandomPassword01234!',
        };
        await client.post('/api/register', user);

        await client.post('/grid/save-grid-data', {
          name: 'bicep curl',
          desc: '25lb 4s10r',
          date: '3/26/2020',
        });

        const resultForID = await client.get('/grid/get-grid-data');
        const id = resultForID.data.exerciseIds[0];

        const result = await client.post('/grid/delete-grid-row', {
          entryToDelete: id,
        });

        assert.equal(result.data, 'The exercise is deleted');

        const result2 = await client.get('/grid/get-grid-data');
        const list = null;
        assert.deepEqual(result2.data.exerciseData, list);
      });
    });

    describe('calorie_calculation-test', async () => {
      it('rejects input if user is not logged in', async () => {
        const user = {
          username: 'sampleuser',
          password: 'RandomPassword01234!',
        };
        await client.post('/api/register', user);
        await client.post('/api/logout', user);

        const userData = {};

        const result = await client.post('/cal/save-cal-rec', userData);
        assert.equal(result.data.errMsg, 'You must be logged in to do that');
      });

      it('rejects blank inputs', async () => {
        const user = {
          username: 'sampleuser',
          password: 'RandomPassword01234!',
        };
        await client.post('/api/register', user);

        const userData1 = {
          userGender: '',
          userAge: '',
          userWeight: 100,
          userHeight: 68,
          userActivityLevel: '',
        };

        const userData2 = {
          userGender: 'male',
          userAge: 56,
          userWeight: '',
          userHeight: 68,
          userActivityLevel: 'Extra Active',
        };

        const userData3 = {
          userGender: '',
          userAge: '',
          userWeight: 100,
          userHeight: '',
          userActivityLevel: '',
        };

        const result = await client.post('/cal/save-cal-rec', userData1);
        assert.equal(result.data.errMsg, 'Please enter all fields');

        const result2 = await client.post('/cal/save-cal-rec', userData2);
        assert.equal(result2.data.errMsg, 'Please enter all fields');

        const result3 = await client.post('/cal/save-cal-rec', userData3);
        assert.equal(result3.data.errMsg, 'Please enter all fields');
      });
      it('rejects invalid number inputs', async () => {
        const user = {
          username: 'sampleuser',
          password: 'RandomPassword01234!',
        };
        await client.post('/api/register', user);

        const userData1 = {
          userGender: 'male',
          userAge: -13,
          userWeight: 100,
          userHeight: 0,
          userActivityLevel: 'extra active',
        };

        const userData2 = {
          userGender: 'male',
          userAge: 11,
          userWeight: -100,
          userHeight: 0,
          userActivityLevel: 'extra active',
        };

        const userData3 = {
          userGender: 'female',
          userAge: 90,
          userWeight: 100,
          userHeight: -40,
          userActivityLevel: 'extra active',
        };

        const result1 = await client.post('/cal/save-cal-rec', userData1);
        assert.equal(result1.data.errMsg, 'Please enter a valid age');
        const result2 = await client.post('/cal/save-cal-rec', userData2);
        assert.equal(result2.data.errMsg, 'Please enter a valid weight');
        const result3 = await client.post('/cal/save-cal-rec', userData3);
        assert.equal(result3.data.errMsg, 'Please enter a valid height');
      });

      it('returns the proper calorie recommendation', async () => {
        const user = {
          username: 'sampleuser',
          password: 'RandomPassword01234!',
        };
        await client.post('/api/register', user);

        const userData = {
          userGender: 'male',
          userAge: 23,
          userWeight: 150,
          userHeight: 70,
          userActivityLevel: 'extra active',
        };
        const ans1 = 1.9 * (66 + 6.3 * 150 + 12.9 * 70 - 6.8 * 23);
        const userData2 = {
          userGender: 'female',
          userAge: 10,
          userWeight: 130,
          userHeight: 60,
          userActivityLevel: 'lightly active',
        };
        const ans2 = 1.375 * (655 + 4.3 * 130 + 4.7 * 60 - 4.7 * 10);

        const result1 = await client.post('/cal/save-cal-rec', userData);
        assert.equal(result1.data.cals, Math.round(ans1));
        const result2 = await client.post('/cal/save-cal-rec', userData2);
        assert.equal(result2.data.cals, Math.round(ans2));
      });
    });

    describe('get_calories-test', async () => {
      it('rejects if user is not logged in', async () => {
        const user = {
          username: 'sampleuser',
          password: 'RandomPassword01234!',
        };
        await client.post('/api/register', user);
        await client.post('/api/logout', user);

        const result = await client.get('/cal/get-cal-rec');
        assert.equal(result.data.errMsg, 'You must be logged in to do that');
      });

      it('returns an error if calories were not calculated', async () => {
        const user = {
          username: 'sampleuser',
          password: 'RandomPassword01234!',
        };
        await client.post('/api/register', user);

        const result = await client.get('/cal/get-cal-rec');
        assert.equal(
          result.data.errMsg,
          'You need to calculate your recommended calories',
        );
      });

      it('correctly pulls up calculated calories', async () => {
        const user = {
          username: 'sampleuser',
          password: 'RandomPassword01234!',
        };
        await client.post('/api/register', user);

        const userData = {
          userGender: 'male',
          userAge: 23,
          userWeight: 150,
          userHeight: 70,
          userActivityLevel: 'extra active',
        };
        const ans = 1.9 * (66 + 6.3 * 150 + 12.9 * 70 - 6.8 * 23);

        await client.post('/cal/save-cal-rec', userData);
        const result = await client.get('/cal/get-cal-rec');

        assert.equal(result.data.userCals, Math.round(ans));
      });
    });

    describe('meal_generator-test', async () => {
      it('rejects input if user is not logged in', async () => {
        const user = {
          username: 'sampleuser',
          password: 'RandomPassword01234!',
        };
        await client.post('/api/register', user);
        await client.post('/api/logout', user);

        const userData = {};

        const result = await client.post('/meal/generate-meal-plan', userData);
        assert.equal(result.data.errMsg, 'You must be logged in to do that');
      });

      it('does not allow generation without calorie calculation', async () => {
        const user = {
          username: 'sampleuser',
          password: 'RandomPassword01234!',
        };
        await client.post('/api/register', user);

        const userData = {};

        const result = await client.post('/meal/generate-meal-plan', userData);
        assert.equal(
          result.data.errMsg,
          'You need to calculate your recommended calories',
        );
      });
    });

    describe('get_mealplan-test', async () => {
      it('rejects input if user is not logged in', async () => {
        const user = {
          username: 'sampleuser',
          password: 'RandomPassword01234!',
        };
        await client.post('/api/register', user);
        await client.post('/api/logout', user);

        const result = await client.get('/meal/get-meal-plan');
        assert.equal(result.data.errMsg, 'You must be logged in to do that');
      });

      it('does not pull up meal plan if one is not saved', async () => {
        const user = {
          username: 'sampleuser',
          password: 'RandomPassword01234!',
        };
        await client.post('/api/register', user);

        const result = await client.get('/meal/get-meal-plan');
        assert.equal(
          result.data.errMsg,
          "You haven't generated your meal plan yet!",
        );
      });
    });

    describe('save-recipes-test', async () => {
      it('returns error if user is not logged in', async () => {
        const user = {
          username: 'sampleuser',
          password: 'RandomPassword01234!',
        };
        await client.post('/api/register', user);
        await client.post('/api/logout', user);

        const result = await client.post('/meal/save-recipes');
        assert.equal(result.data.errMsg, 'You must be logged in to do that');
      });

      it('returns error if mealplan is not generated', async () => {
        const user = {
          username: 'sampleuser',
          password: 'RandomPassword01234!',
        };
        await client.post('/api/register', user);

        const result = await client.post('/meal/save-recipes');
        assert.equal(
          result.data.errMsg,
          "You haven't generated your meal plan yet!",
        );
      });
    });

    describe('get_recipe-test', async () => {
      it('returns error if user is not logged in', async () => {
        const user = {
          username: 'sampleuser',
          password: 'RandomPassword01234!',
        };
        await client.post('/api/register', user);
        await client.post('/api/logout', user);

        let result = await client.get('/meal/get-breakfast-recipe');
        assert.equal(result.data.errMsg, 'You must be logged in to do that');
        result = await client.get('/meal/get-lunch-recipe');
        assert.equal(result.data.errMsg, 'You must be logged in to do that');
        result = await client.get('/meal/get-dinner-recipe');
        assert.equal(result.data.errMsg, 'You must be logged in to do that');
      });

      it('returns error if user has not generated a meal plan', async () => {
        const user = {
          username: 'sampleuser',
          password: 'RandomPassword01234!',
        };
        await client.post('/api/register', user);

        let result = await client.get('/meal/get-breakfast-recipe');
        assert.equal(
          result.data.errMsg,
          'You have not generated your meal plan!',
        );
        result = await client.get('/meal/get-lunch-recipe');
        assert.equal(
          result.data.errMsg,
          'You have not generated your meal plan!',
        );
        result = await client.get('/meal/get-dinner-recipe');
        assert.equal(
          result.data.errMsg,
          'You have not generated your meal plan!',
        );
      });
    });
  });
});
