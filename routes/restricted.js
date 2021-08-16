var express = require('express');
 var router = express.Router();

 function restrict(req, res, next) {
    if (req.session.user) {
      next();
    } else {
      req.session.error = 'Access denied!';
      res.redirect('/login');
    }
  }
   
  router.get('/', restrict, function(req, res){
    res.send('Welcome! restricted area, click to <a href="/logout">logout</a>');
  });

  module.exports = router;