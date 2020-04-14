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
          username: getRandomString(10),
          password: getRandomString(10),
        });
        assert.equal(result.data, 'New user created');
      });

      it('does not allow duplicate usernames', async () => {
        const sampleUser = getRandomString(15);
        await client.post('/api/register', {
          username: sampleUser,
          password: getRandomString(10),
        });
        const result = await client.post('/api/register', {
          username: sampleUser,
          password: getRandomString(10),
        });
        assert.equal(result.data.regError, 'Username already exists');
      });

      it('requires a password to register', async () => {
        const result = await client.post('/api/register', {
          username: getRandomString(10),
          password: '',
        });
        assert.equal(result.data.regError, 'Please enter a valid password');
      });

      it('requires a username to register', async () => {
        const result = await client.post('/api/register', {
          username: '',
          password: getRandomString(10),
        });
        assert.equal(result.data.regError, 'Please enter a valid username');
      });
    });

    describe('login-test', async () => {
      it('allows a registered user to login', async () => {
        const user = {
          username: getRandomString(10),
          password: getRandomString(10),
        };
        await client.post('/api/register', user);
        const result = await client.post('/api/login', user);

        assert.equal(result.data, 'User successfully logged in');
      });

      it('requires an account with username to exist', async () => {
        const user = {
          username: getRandomString(10),
          password: getRandomString(10),
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
          username: getRandomString(10),
          password: getRandomString(10),
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

    describe('get-grid-data-test', async () => {
      it('correctly pulls up user exercise data from database', async () => {
        // register a user
        const user = {
          username: getRandomString(10),
          password: getRandomString(10),
        };
        await client.post('/api/register', user);

        // save some exercises
        await client.post('/api/save-grid-data', {
          exerciseName: 'bicep curl',
          exerciseDescription: '25lb 4s10r',
          exerciseDate: '3/26/2020',
        });
        await client.post('/api/save-grid-data', {
          exerciseName: 'inner bicep curl',
          exerciseDescription: '25lb 4s10r',
          exerciseDate: '3/27/2020',
        });

        // get exercise data from database
        let result = await client.get('/api/get-grid-data');

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
        await client.post('/api/save-grid-data', {
          exerciseName: 'sit ups',
          exerciseDescription: '4s5r',
          exerciseDate: '3/30/2020',
        });

        const subList = {
          name: 'sit ups',
          date: '3/30/2020',
          description: '4s5r',
        };
        list.push(subList);

        // get exercise data from database again
        result = await client.get('/api/get-grid-data');
        assert.deepEqual(result.data.exerciseData, list);
      });
    });

    describe('save-grid-data-test', async () => {
      it('allows the user select how to organize the grid');
      it('allows user to remove rows from the grid');
      it('does not allow for a user to save an exercise without a name, progress or date', async () => {
        // register a user
        const user = {
          username: getRandomString(10),
          password: getRandomString(10),
        };
        await client.post('/api/register', user);

        // save an exercise with no name
        const resultNoName = await client.post('/api/save-grid-data', {
          exerciseName: '',
          exerciseDescription: '25lb 4s10r',
          exerciseDate: '3/26/2020',
        });
        assert.equal(
          resultNoName.data.saveGridError,
          'You must provide a name for the exercise',
        );

        // save an exercise with no progress
        const resultNoDesc = await client.post('/api/save-grid-data', {
          exerciseName: 'bicep curl',
          exerciseDescription: '',
          exerciseDate: '3/26/2020',
        });
        assert.equal(
          resultNoDesc.data.saveGridError,
          'You must provide the description of the exercise',
        );

        // save an exercise with no date
        const resultNoDate = await client.post('/api/save-grid-data', {
          exerciseName: 'bicep curl',
          exerciseDescription: '30lb 4s10r',
          exerciseDate: '',
        });
        assert.equal(
          resultNoDate.data.saveGridError,
          'You must provide a date',
        );
      });

      it('allows the user to track their exercise name, progress, and date', async () => {
        // register a user
        const user = {
          username: getRandomString(10),
          password: getRandomString(10),
        };
        await client.post('/api/register', user);

        // save an exercise with name, progress, and date
        const result = await client.post('/api/save-grid-data', {
          exerciseName: 'bicep curl',
          exerciseDescription: '30lb 4s10r',
          exerciseDate: '3/20/2020',
        });
        assert.equal(result.data, 'Your exercise values are saved');
      });

      // todo: allow users to edit and delete exercises

      it('throws error if a registered user tries to track or update exercise without logging in', async () => {
        // register a user
        const user = {
          username: getRandomString(10),
          password: getRandomString(10),
        };
        await client.post('/api/register', user);
        await client.post('/api/logout', user);

        const result = await client.post('/api/save-grid-data', {
          exerciseName: 'bicep curl',
          exerciseDescription: '25lb 4s10r',
          exerciseDate: '3/26/2020',
        });

        assert.equal(
          result.data.saveGridError,
          'You must be logged in to do that',
        );
      });

      it('throws error if an unregistered user tries to track or update exercise', async () => {
        // save exercise without logging in
        const result = await client.post('/api/save-grid-data', {
          exerciseName: 'bicep curl',
          exerciseDescription: '25lb 4s10r',
          exerciseDate: '3/26/2020',
        });
        assert.equal(
          result.data.saveGridError,
          'You must be logged in to do that',
        );
      });
    });

    // ***** //
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    function getRandomInt(min, max) {
      const minC = Math.ceil(min);
      const maxF = Math.floor(max);

      // The maximum is exclusive and the minimum is inclusive
      return Math.floor(Math.random() * (maxF - minC)) + minC;
    }


    describe('delete_grid_row-test', async () => {

      it('rejects operation if user is not logged in')
      it('does not allow a user to delete a non-existent row')
      it('properly deletes an existing row')

    })


    describe('calorie_calculation-test', async () => {
      
      it('rejects input if user is not logged in', async()=>{
        const user = {
          username: getRandomString(10),
          password: getRandomString(10),
        };
        await client.post('/api/register', user);
        await client.post('/api/logout', user);

        const userData = {}

        const result = await client.post('/api/save-cal-rec', userData);
        assert.equal(
          result.data.errMsg,
          'You must be logged in to do that',
        );

      })
      
      it('rejects blank inputs', async()=>{

        const user = {
          username: getRandomString(10),
          password: getRandomString(10),
        };
        await client.post('/api/register', user);

        const userData1 = {
          userGender: '',
          userAge: '',
          userWeight: 100,
          userHeight: 68,
          userActivityLevel: ''
        }

        const userData2 = {
          userGender: 'male',
          userAge: 56,
          userWeight: '',
          userHeight: 68,
          userActivityLevel: 'Extra Active'
        }

        const userData3 = {
          userGender: '',
          userAge: '',
          userWeight: 100,
          userHeight: '',
          userActivityLevel: ''
        }

        const result = await client.post('/api/save-cal-rec', userData1);
        assert.equal(
          result.data.errMsg,
          'Please enter all fields',
        );

        const result2 = await client.post('/api/save-cal-rec', userData2);
        assert.equal(
          result2.data.errMsg,
          'Please enter all fields',
        );

        const result3 = await client.post('/api/save-cal-rec', userData3);
        assert.equal(
          result3.data.errMsg,
          'Please enter all fields',
        );


      });
      it('rejects invalid number inputs', async() =>{

        const user = {
          username: getRandomString(10),
          password: getRandomString(10),
        };
        await client.post('/api/register', user);

        const userData1 = {
          userGender: 'male',
          userAge: -13,
          userWeight: 100,
          userHeight: 0,
          userActivityLevel: 'extra active'
        }

        const userData2 = {
          userGender: 'male',
          userAge: 11,
          userWeight: -100,
          userHeight: 0,
          userActivityLevel: 'extra active'
        }

        const userData3 = {
          userGender: 'female',
          userAge: 90,
          userWeight: 100,
          userHeight: -40,
          userActivityLevel: 'extra active'
        }

        const result1 = await client.post('/api/save-cal-rec', userData1);
        assert.equal(
          result1.data.errMsg,
          'Please enter a valid age',
        );
        const result2 = await client.post('/api/save-cal-rec', userData2);
        assert.equal(
          result2.data.errMsg,
          'Please enter a valid weight',
        );
        const result3 = await client.post('/api/save-cal-rec', userData3);
        assert.equal(
          result3.data.errMsg,
          'Please enter a valid height',
        );

      });


      it('returns the proper calorie recommendation', async()=>{

        const user = {
          username: getRandomString(10),
          password: getRandomString(10),
        };
        await client.post('/api/register', user);

        const userData = {
          userGender: 'male',
          userAge: 23,
          userWeight: 150,
          userHeight: 70,
          userActivityLevel: 'extra active'
        }
        let ans1 = 1.9*( 66+(6.3*150)+(12.9*70)-(6.8*23))
        const userData2 = {
          userGender: 'female',
          userAge: 10,
          userWeight: 130,
          userHeight: 60,
          userActivityLevel: 'lightly active'
        }
        ans2 = 1.375*(655 + (4.3*130) + (4.7*60) - (4.7*10))

        const result1 = await client.post('/api/save-cal-rec', userData);
        assert.equal(
          result1.data.cals,
          Math.round(ans1)
        );
        const result2 = await client.post('/api/save-cal-rec', userData2);
        assert.equal(
          result2.data.cals,
          Math.round(ans2)
        );

      })
    });

    describe('get_calories-test', async () => {
      it('rejects if user is not logged in', async()=>{
        const user = {
          username: getRandomString(10),
          password: getRandomString(10),
        };
        await client.post('/api/register', user);
        await client.post('/api/logout', user);

        const result = await client.get('/api/get-cal-rec');
        assert.equal(
          result.data.errMsg,
          'You must be logged in to do that',
        );

      })
      
      it('returns an error if calories were not calculated')

      it('correctly pulls up calculated calories')


    });

    describe('meal_generator-test', async () => {
      it('rejects input if user is not logged in', async()=>{
        const user = {
          username: getRandomString(10),
          password: getRandomString(10),
        };
        await client.post('/api/register', user);
        await client.post('/api/logout', user);

        const userData = {}

        const result = await client.post('/api/generate-meal-plan', userData);
        assert.equal(
          result.data.errMsg,
          'You must be logged in to do that',
        );

      })
      
      it('does not allow generation without calorie calculation')

      
      //  test for external api
        //  limit number of times call to external api

    });

    describe('get_mealplan-test', async () => {
      it('rejects input if user is not logged in', async()=>{
        const user = {
          username: getRandomString(10),
          password: getRandomString(10),
        };
        await client.post('/api/register', user);
        await client.post('/api/logout', user);

        const userData = {}

        const result = await client.get('/api/get-meal-plan');
        assert.equal(
          result.data.errMsg,
          'You must be logged in to do that',
        );

      })
      
      it('does not pull up meal plan if one is not saved')

      it('does pull up a meal plan if one is saved')
    });


    describe('get_recipe-test', async() => {

      it('returns error if user is not logged in')
      it('returns error for an invalid recipe')
      it('returns correct recipe for a valid recipe')

    })




  });
});
