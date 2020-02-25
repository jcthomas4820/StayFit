// Import the dependencies for testing
const assert = require('assert');
const axios = require('axios').default;

const app = require('../app');

const PORT = 3000;
axios.defaults.withCredentials = true;
axios.defaults.validateStatus = () => true;
axios.defaults.baseURL = `http://localhost:${PORT}`;

describe('application', async () => {
  /* fill these in before each test */
  let server = {};
  const client = axios.create();

  before(async () => {
    server = app.listen(PORT);
  });

  after(async () => {
    await server.close();
  });

  describe('sanity', async () => {
    it('can successfully send an index', async () => {
      const result = await client.get('/');
      assert.strictEqual(result.status, 200);
    });

    it("doesn't send files that don't exist", async () => {
      const result = await client.get('doesnotexist');
      assert.strictEqual(result.status, 404);
    });

    it('sends the raw index.html', async () => {
      const result = await client.get('/');
      assert(result.data.includes('Welcome to Express!'));
    });
  });

  describe('unauthenticated state', async () => {
    describe('registration', async () => {
      it('allows a user to register');
      it('does not allow duplicate usernames');
      it('requires a password to register');
    });

    describe('login', async () => {
      it('allows a registered user to login');
      it('requires an account with username to exist');
      it('requires the correct password given a username');
    });
  });

  describe('authenticated state', async () => {
    // **** // 
    describe('logging out', async () => {
      it('redirects a client to the loggedout main screen once logged out');
    });

    describe('using exercise grid', async () => {
      it('allows a user to save their workout record for the day');
      it('allows the user select how to organize the grid');
      it('allows a user to track their progress');
      it('saves user data after logging information');
      it('allows a user to update entries');
      it('allows user to remove rows from the grid');
    });

    // ***** //
    describe('using macro calcualator', async () => {
      it('allows user to store personal information');
      it('calculates daily reccomendations based on personal user values');
      it('allows user to track the macros calculated');
    });

    describe('using nutrition tracker', async () => {
      it('allows user to input a meal');
      it('calculates the remaining nutrient daily goal after meal input');
      it('alerts the user when they are over their daily intake');
    });
  });
});