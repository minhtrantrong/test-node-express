var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
  // destroy the user's session to log them out
  // will be re-created next request
  req.session.destroy(function(){
    res.redirect('/');
  });
});

module.exports = router;