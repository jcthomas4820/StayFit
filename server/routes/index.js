var express = require('express');
var router = express.Router();
// TODO: setup mongoDB

// TODO: implmenet the routes
router.get('/', function(req, res){
  res.render('index')
});

module.exports = router;