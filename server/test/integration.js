// Import the dependencies for testing
const assert = require('assert');
const axios = require('axios').default;
const mongoose = require('mongoose');
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');

axiosCookieJarSupport(axios);

const app = require('../app');

const PORT = 3000;
axios.defaults.withCredentials = true;
axios.defaults.validateStatus = () => true;
axios.defaults.baseURL = `http://localhost:${PORT}`;

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

  async function createRandomUser(axiosClient) {
    const newUser = {
      username: getRandomString(10),
      password: getRandomString(10)
    };
    const response = await axiosClient.post('/register', newUser);
    return { newUser, response };
  }

  beforeEach(async () => {
    client = axios.create();
    // make a new cookie jar every time you create a new client
    client.defaults.jar = new tough.CookieJar();

    server = app.listen(PORT);
  });

  afterEach(async () => {
    await server.close();
  });

  after(async () => {
    await mongoose.disconnect();
  });

  describe('unauthenticated state', async () => {
    describe('register-test', async () => {
      it('allows a user to register');
      it('does not allow duplicate usernames');
      it('requires a password to register');
    });

    describe('login-test', async () => {
      it('allows a registered user to login');
      it('requires an account with username to exist');
      it('requires the correct password given a username');
    });
  });

  describe('authenticated state', async () => {
    // **** // 
    describe('logout-test', async () => {
      it('redirects a client to the loggedout main screen once logged out');
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