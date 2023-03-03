const Meals = require('../models/meals.model');
const Restaurants = require('../models/restaurants.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.validateMealById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const meal = await Meals.findOne({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    where: {
      id,
      status: 'active',
    },
    include: [
      {
        model: Restaurants,
        where: {
          status: 'active',
        },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
    ],
  });

  if (!meal) {
    return next(new AppError('restaurant does not exist', 404));
  }

  req.meal = meal;
  next();
});
