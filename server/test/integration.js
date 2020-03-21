// Import the dependencies for testing
const assert = require('assert');
const axios = require('axios').default;
const mongoose = require('mongoose');
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');
axiosCookieJarSupport(axios);

const app = require('../app');

const User = require('../models/user');
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
    // TODO: do this when test database is successfully implemented
    User.deleteMany({}, function(err) { 
      console.log('All users removed') 
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
        console.log(" The data!: " + result.data);
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

    describe('exercise-test', async () => {
      it('allows a user to save their workout record for the day');
      it('allows the user select how to organize the grid');
      it('allows a user to track their progress');
      it('saves user data after logging information');
      it('allows a user to update entries');
      it('allows user to remove rows from the grid');
    });

    // ***** //
    describe('macro-test', async () => {
      it('allows user to store personal information');
      it('calculates daily reccomendations based on personal user values');
      it('allows user to track the macros calculated');
    });

    describe('nutrition-test', async () => {
      it('allows user to input a meal');
      it('calculates the remaining nutrient daily goal after meal input');
      it('alerts the user when they are over their daily intake');
    });
  });
});