/**
 * Module dependencies.
 */
 var express = require('express');
 var router = express.Router();
 var hash = require('pbkdf2-password')();


 // dummy database
 
 var users = {
   guess: { name: 'guess' }
 };
 
 // when you create a user, generate a salt
 // and hash the password ('guesspass' is the pass here)
 
 hash({ password: 'guesspass' }, function (err, pass, salt, hash) {
   if (err) throw err;
   // store the salt & hash in the "db"
   users.guess.salt = salt;
   users.guess.hash = hash;
 });
 
 
 // Authenticate using our plain-object database of doom!
 
 function authenticate(name, pass, fn) {
   if (!module.main) console.log('authenticating %s:%s', name, pass);
   var user = users[name];
   // query the db for the given username
   if (!user) return fn(new Error('cannot find user'));
   // apply the same algorithm to the POSTed password, applying
   // the hash against the pass / salt, if there is a match we
   // found the user
   hash({ password: pass, salt: user.salt }, function (err, pass, salt, hash) {
     if (err) return fn(err);
     if (hash === user.hash) return fn(null, user)
     fn(new Error('invalid password'));
   });
 }

 router.get('/', function(req, res){
   res.render('login');
 });
 
 router.post('/', function(req, res){
   authenticate(req.body.username, req.body.password, function(err, user){
     if (user) {
       // Regenerate session when signing in
       // to prevent fixation
       req.session.regenerate(function(){
         // Store the user's primary key
         // in the session store to be retrieved,
         // or in this case the entire user object
         req.session.user = user;
         req.session.success = 'Authenticated as ' + user.name
           + ' click to <a href="/logout">logout</a>. '
           + ' You may now access <a href="/restricted">/restricted</a>.';
         res.redirect('back');
       });
     } else {
       req.session.error = 'Authentication failed, please check your '
         + ' username and password.'
         + ' (use "guess" and "guesspass")';
       res.redirect('/login');
     }
   });
 });
 
 module.exports = router;
