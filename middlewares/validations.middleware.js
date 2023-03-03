const { check } = require('express-validator');
const catchAsync = require('../utils/catchAsync');

exports.validations = catchAsync(async (req, res, next) => {
  [
    //User SignUp & User Update
    check('name', 'name cannot be empty').not().isEmpty(),
    check('email', 'email must be mandatory').not().isEmpty(),
    check('email', 'email must have a correct format').isEmail(),
    check('password', 'password is required').not().isEmpty(),
    //Create & Update Meal
    check('name', 'name cannot be a number').not().isNumeric(),
    check('price', 'price is mandatory').not().isEmpty(),
    check('price', 'price must be a number').isNumeric(),
    //Create & Patch Restaurant
    check('address', 'address must be mandatory').not().isEmpty(),
    check('rating', 'rating cannot be empty').not().isEmpty(),
    check('rating', 'rating must be a number').isNumeric(),
    check('rating', 'rating only accepts integer numbers from 1 to 5').isLength(
      {
        min: 1,
        max: 5,
      }
    ),
  ],
    next();
});
