const Restaurants = require('../models/restaurants.model');
const Reviews = require('../models/review.model');
const catchAsync = require('../utils/catchAsync');

exports.createRestaurant = catchAsync(async (req, res, next) => {
  const { name, address, rating } = req.body;

  const restaurant = await Restaurants.create({
    name,
    address,
    rating,
    status: 'active',
  });

  res.status(200).json({
    status: 'success',
    message: 'Restaurant created successfully',
    restaurant: {
      name: restaurant.name,
      address: restaurant.address,
      rating: restaurant.rating,
      status: 'active',
    },
  });
});

exports.findRestaurants = catchAsync(async (req, res, next) => {
  const restaurants = await Restaurants.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    where: {
      status: 'active',
    },
    include: [
      {
        model: Reviews,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    message: 'Restaurants found successfully',
    restaurants,
  });
});

exports.findRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant } = req;

  res.status(200).json({
    status: 'success',
    message: 'Restaurants found successfully',
    restaurant,
  });
});

exports.updateRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant } = req;
  const { name, address } = req.body;

  const updatedRestaurant = await restaurant.update({ name, address });

  res.status(200).json({
    status: 'success',
    message: 'Restaurant updated successfully',
    updatedRestaurant,
  });
});

exports.deleteRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant } = req;

  const deletedRestaurant = await restaurant.update({ status: 'inactive' });

  res.status(200).json({
    status: 'success',
    message: 'Restaurant deleted successfully',
    deletedRestaurant,
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const { comment, rating } = req.body;
  const { restaurant, sessionUser } = req;

  const review = await Reviews.create({
    userId: sessionUser.id,
    comment,
    restaurantId: restaurant.id,
    rating,
  });

  res.status(200).json({
    status: 'success',
    message: 'Review created successfully',
    review,
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const { review } = req;
  const { comment, rating } = req.body;

  await review.update({
    comment,
    rating,
  });

  res.status(200).json({
    status: 'success',
    message: 'Review updated successfully',
    review,
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const { review } = req;

  await review.update({
    status: false,
  });

  res.status(200).json({
    status: 'success',
    message: 'Review deleted successfully',
  });
});
