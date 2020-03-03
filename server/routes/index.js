var express = require('express');
var router = express.Router();
// TODO: setup mongoDB

// TODO: implmenet the routes
router.get('/', function(req, res){
  res.render('index')
});

router.post('/login', function(req, res) {
  console.log('logged in');
});

router.post('/register', function(req, res) {
  console.log("register");
});

// router.route('/login').post(function(req, res) {
//   console.log("login");
//   res.send("Success");
// });

module.exports = router;