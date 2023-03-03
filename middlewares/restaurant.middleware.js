const Restaurants = require('../models/restaurants.model');
const Reviews = require('../models/review.model');
const Users = require('../models/users.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.validIfExistRest = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const restaurant = await Restaurants.findOne({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    where: {
      id,
      status: 'active',
    },
    include: [
      {
        model: Reviews,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
    ],
  });

  if (!restaurant) {
    return next(new AppError('restaurant does not exist', 404));
  }

  req.restaurant = restaurant;
  next();
});

exports.validReviewByRestId = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.params;

  const restaurant = await Restaurants.findOne({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    where: {
      id: restaurantId,
      status: 'active',
    },
    include: [
      {
        model: Reviews,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
    ],
  });

  if (!restaurant) {
    return next(new AppError('restaurant does not exist', 404));
  }

  req.restaurant = restaurant;
  next();
});

exports.validIfExistReview = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const review = await Reviews.findOne({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    where: {
      id,
      status: true,
    },
    include: [
      {
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
        model: Users,
      },
    ],
  });

  if (!review) {
    return next(new AppError('review does not exist', 404));
  }

  req.review = review;
  req.user = review.user;
  next();
});
