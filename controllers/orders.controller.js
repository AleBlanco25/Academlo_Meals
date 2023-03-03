const Meals = require('../models/meals.model');
const Orders = require('../models/orders.model');
const Restaurants = require('../models/restaurants.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createOrder = catchAsync(async (req, res, next) => {
  const { quantity, mealId } = req.body;
  const { sessionUser } = req;

  const meal = await Meals.findOne({
    where: {
      id: mealId,
      status: 'active',
    },
  });

  console.log(meal);
  if (!meal) {
    return next(new AppError('Meal not found', 404));
  }

  const totalPrice = quantity * meal.price;

  const order = await Orders.create({
    quantity,
    mealId: meal.id,
    totalPrice,
    userId: sessionUser.id,
  });

  res.status(201).json({
    status: 'success',
    message: 'the order was created successfully',
    order,
  });
});

exports.findOrders = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const orders = await Orders.findAll({
    where: {
      status: 'active',
      userId: sessionUser.id,
    },
    include: [
      {
        model: Meals,
        where: {
          status: 'active',
        },
        include: [
          {
            model: Restaurants,
            where: {
              status: 'active',
            },
          },
        ],
      },
    ],
  });
  res.status(200).json({
    status: 'success',
    message: 'All the orders were found successfully',
    orders,
  });
});

exports.updateOrder = catchAsync(async (req, res, next) => {
  const { order } = req;

  await order.update({ status: 'completed' });

  res.status(200).json({
    status: 'success',
    message: 'The order was updated successfully',
    order,
  });
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
  const { order } = req;

  await order.update({ status: 'cancelled' });

  res.status(200).json({
    status: 'success',
    message: 'The order was deleted successfully',
  });
});
