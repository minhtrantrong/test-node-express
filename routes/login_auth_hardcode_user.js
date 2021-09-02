var express = require('express');
var router = express.Router();
const TEST_USER = {username: "guess", password: "guesspass"};
/* GET login page */
router.get('/', function(req, res, next) {
  res.render('login',  {message: "Please input your credential!"});
});
/* Route for POST request from login form */
router.post('/', function(req, res){
  if (req.body.username == TEST_USER.username && req.body.password == TEST_USER.password)
  {
    res.render('users',  {title: "Welcome to userpage", message: `Hello ${req.body.username}!`});
  }
  else
  {
    res.render('login',  {message: "Wrong username or password. Please input your credential again!"});
  };  
});
module.exports = router;
