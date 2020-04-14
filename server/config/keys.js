module.exports = {
  MONGO_URI: 'mongodb://mongo:27017/user', // connecting to mongodb using docker
  MONGO_URI_TEST: 'mongodb://localhost:27017/test', // connect locally for any tests (requires mongod running)
  SESSION_SECRET: 'ThisIsMySecret',
  app_key: 'fe018186f98a4236b46286e507ac061a',
};

