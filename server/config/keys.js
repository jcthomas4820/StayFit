module.exports = {
    MONGO_URI: 'mongodb://127.0.0.1:27017/user',                // connecting to mongodb using docker
    MONGO_URI_TEST: 'mongodb://127.0.0.1:27017/test',       // connect locally for any tests (requires mongod running)
    SESSION_SECRET: 'ThisIsMySecret'
};