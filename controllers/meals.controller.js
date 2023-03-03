const Meals = require('../models/meals.model');
const Restaurants = require('../models/restaurants.model');
const catchAsync = require('../utils/catchAsync');

exports.createMeal = catchAsync(async (req, res, next) => {
  const { name, price } = req.body;
  const { restaurant } = req;

  const newMeal = await Meals.create({
    restaurantId: restaurant.id,
    name,
    price,
  });

  res.status(200).json({
    status: 'success',
    message: 'Meal created successfully',
    newMeal,
  });
});

exports.findMeals = catchAsync(async (req, res, next) => {
  const meals = await Meals.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    where: {
      status: 'active',
    },
    include: [
      {
        model: Restaurants,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where: {
          status: 'active',
        },
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    message: 'Meals found successfully',
    meals,
  });
});

exports.findMeal = catchAsync(async (req, res, next) => {
  const { meal } = req;

  res.status(200).json({
    status: 'success',
    message: 'Meal found successfully',
    meal,
  });
});

exports.updateMeal = catchAsync(async (req, res, next) => {
  const { meal } = req;
  const { name, price } = req.body;

  const updatedMeal = await meal.update({ name, price });

  res.status(200).json({
    status: 'success',
    message: 'Meal updated successfully',
    updatedMeal,
  });
});

exports.deleteMeal = catchAsync(async (req, res, next) => {
  const { meal } = req;
  const { name, price } = req.body;

  const deletedMeal = await meal.update({ name, price });

  res.status(200).json({
    status: 'success',
    message: 'Meal deleted successfully',
    deletedMeal,
  });
});
