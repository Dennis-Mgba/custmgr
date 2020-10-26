const express = require('express');
const bodyParser = require('body-parser');  // to parse require from the app
const path = require('path');   // used to define the path of file
const { check, validationResult } = require('express-validator');
const mongojs = require('mongojs'); // is a mongodb database ORM
const db = mongojs('custmgr', ['users']);
var ObjectId = mongojs.ObjectId;

const app = express();

/*
// define a middleware - should be placed before the route handlers
let logger = function(req, res, next) {
    console.log('logging...');
    next();
}
// to be able to use the middleware do
app.use(logger);
*/

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: false} ));


// define ejs view template engine
app.set('view engine', 'ejs');
// specify the folder that we want place our views in
app.set('views', path.join(__dirname, 'views'));
// set path for static items - like css file, img etc
app.use(express.static(path.join(__dirname, 'public', )));



// let users = [ check the user.js file for the hard coded collections ];

/*
*   routes handlers for the app
*/
app.get('/', function(req, res) {
    // query db and get all collections
    db.users.find(function (err, data) {
        // docs is an array of all the documents in mycollection
        // console.log(data);
        res.render('index', {
            title: 'Customer Management App',
            users: data
        });
    });
});

// post/ create/ add a new collections
app.post('/users/add',[
  check('first_name', 'Must be 3+ characters long').exists().isLength({min: 3}),
  check('last_name', 'Must be 3+ characters long').exists().isLength({min: 3}),
  check('email', 'Must be a valid email').exists().isEmail().normalizeEmail(),
  check('number').exists(),
], function(req, res) {
    // Finds the validation errors in this request and wrap them in an object with handy functions
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      // let alert = errors.array();
      // res.render('index', {
      //    alert
      // });

      res.redirect('/');
    } else {

          let newUser = {
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              email: req.body.email,
              number: req.body.number
          }

          // console.log(newUser);
          // res.json(newUser);

          db.users.insert(newUser, function(err, res) {
              if(err) {
                  console.log(err);
              }
          });
          res.redirect('/');
      }
});

// delete request
app.delete('/users/delete/:id', function(req, res) {
    db.users.remove({ _id: ObjectId(req.params.id) }, function(err, res) {
        if (err) {
            console.log(err);
        }
    });
    res.redirect('/');
});


// server and port listerner
const PORT = process.env.PORT || 5000;
app.listen(PORT, '127.0.0.1',function() {
    console.log(`Server listening on http://127.0.0.1:${PORT}`)
});
