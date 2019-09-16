// Import required packages
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');

// Other config
const port = 3000;

// Configure Middleware
app.use(bodyParser.urlencoded({ extended: true }));

const signupFailures = ({location, msg, param, value, nestedErrors}) => {
  return {
      type: "Error",
      name: "Signup Failure",
      location: location,
      message: msg,
      param: param,
      value: value,
      nestedErrors: nestedErrors
  }
};

app.post('/validateMe',
  check('username')
      .isLength({ min:1 }).withMessage('Login is a required field.')
      .isAlphanumeric().withMessage('Login must be alphanumeric.'),

  check('password')
      .isLength({ min:8 }).withMessage('Password must be at least 8 characters in length.')
      .matches('[0-9]').withMessage('Password must contain at least 1 number.')
      .matches('[a-z]').withMessage('Password must contain at least 1 lowercase letter.')
      .matches('[A-Z]').withMessage('Password must contain at least 1 uppercase letter.')
      .custom((value, {req, loc, path}) => {
          if (value !== req.body.confirmPassword) {
              return false;
          } else {
              return value;
          }
      }).withMessage("Passwords don't match."),
  function(req, res) {

  console.log(req.body);
  var errors = validationResult(req).formatWith(signupFailures);

  if (!errors.isEmpty()) {
      res.status(400).json(errors);
  } else {
      res.sendStatus(200);
  }
});

// Launch App
app.listen(port, function(req, res){
 console.log('Server is running on port: ',port);
});