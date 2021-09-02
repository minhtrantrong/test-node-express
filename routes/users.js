const { query } = require('express');
var express = require('express');
var router = express.Router();
var pg_conn = require('../models/pg_config');

/* GET users page. */
router.get('/', function(req, res, next) {
  res.render('users', {title: "User page", message: "Authorized users"});
});
/* GET the EDIT page*/
router.get('/edit/:name', function(req, res) {
  var prod_name = req.params.name;
  const product_query = 
    {
        text: 'SELECT * FROM product WHERE product_name = $1',
        values: [prod_name]
    };
  pg_conn.query(product_query, function(err, data){
    if (err) throw err;
    res.render('edit_form', {title: "Edit page", 
                             h1_title: "Edit form, input carefully", 
                             edit_data: data.rows[0]}
    );
  });  
});
/* Process the POST EDIT submission */
router.post('/edit/:name', function(req, res) {
  //var prod_name = req.params.name;
  const update_query = 
    {
      text: 'UPDATE product SET product_name=$1, price=$2, amount=$3, shop_name=$4 WHERE product_name=$5;',
      values: [req.body.product_name, 
               req.body.price, 
               req.body.amount, 
               req.body.shop_name, 
               req.params.name]
    };  
  pg_conn.query(update_query, function(err, data){
    if (err) {
      throw err;
      res.render('error',  {message: "Update database got an error", error: err});
    } else {
      var product_query = 'SELECT * FROM product';
      pg_conn.query(product_query, function(err, query_data){
        if (err) throw err;
        res.render('users_fe', {title: "Userpage", 
                                h1_title: "Welcome to userpage",
                                h2_title: "Updated Database successfully!",
                                userData: query_data});
      });      
    };
  }); 
});

/* GET the delete */
router.get('/delete/:name', function(req, res) {
  var prod_name = req.params.name;
  const delete_query = 
    {
        text: 'DELETE FROM product WHERE product_name = $1',
        values: [prod_name]
    };
  var pg_conn = require('../models/pg_config');
  pg_conn.query(delete_query, function(err, data){
    if (err) {
      throw err;
      res.render('error',  {message: "Update database got an error", error: err});
    } else {
      var product_query = 'SELECT * FROM product';
      pg_conn.query(product_query, function(err, query_data){
        if (err) throw err;
        res.render('users_fe', {title: "Userpage", 
                                h1_title: "Welcome to userpage",
                                h2_title: "Deleted a row successfully!",
                                userData: query_data});
      });      
    };
  });  
});

/* GET the INSERT */
router.get('/insert', function(req, res) {
  res.render('insert_form', { 
                              title: "Insert page", 
                              h1_title: "Insert form, input carefully"
                            }
  );  
});

/* POST from INSERT form*/
router.post('/insert', function(req, res) {
  const insert_query = 
    {
        text: 'INSERT INTO product VALUES ($1, $2, $3, $4)',
        values: [req.body.product_name, 
                 req.body.price, 
                 req.body.amount, 
                 req.body.shop_name]
    };
  pg_conn.query(insert_query, function(err, data){
    if (err) {
      throw err;
      res.render('error',  {message: "Update database got an error", error: err});
    } else {
      var product_query = 'SELECT * FROM product';
      pg_conn.query(product_query, function(err, query_data){
        if (err) throw err;
        res.render('users_fe', {title: "Userpage", 
                                h1_title: "Welcome to userpage",
                                h2_title: "Inserted a row successfully!",
                                userData: query_data});
      });      
    };
  });  
});
module.exports = router;
