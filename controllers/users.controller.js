const Users = require('../models/users.model');
const bcrypt = require('bcryptjs');
const generateJWT = require('../utils/jwt');
const catchAsync = require('../utils/catchAsync');
const Orders = require('../models/orders.model');
const Meals = require('../models/meals.model');
const Restaurants = require('../models/restaurants.model');

exports.createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = new Users({
    name: name.toLowerCase(),
    email: email.toLowerCase(),
    password,
    role,
  });

  const salt = await bcrypt.genSalt(10);

  user.password = await bcrypt.hash(password, salt);

  const token = await generateJWT(user.id);

  await user.save();

  res.status(201).json({
    status: 'active',
    message: 'user created successfully',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { user } = req;

  const token = await generateJWT(user.id);

  res.json({
    status: 'success',
    token,
    user: {
      id: user.id,
      name: user.name,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { name, email } = req.body;

  const updatedUser = await user.update({ name, email });

  res.status(200).json({
    status: 'success',
    message: 'The user was updated successfully',
    updatedUser: {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: false });

  res.status(200).json({
    status: 'success',
    message: 'The user was deleted successfully',
  });
});

exports.getOrders = catchAsync(async (req, res, next) => {
  const { user } = req;

  const orders = await Orders.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    where: {
      userId: user.id,
    },
    include: [
      {
        model: Meals,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where: { status: 'active' },
        include: [
          {
            model: Restaurants,
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            where: { status: 'active' },
          },
        ],
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    message: 'Orders were found successfully',
    orders,
  });
});

exports.getOrdersById = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { id } = req.params;

  const order = await Orders.findOne({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    where: {
      id,
      userId: user.id,
    },
    include: [
      {
        model: Meals,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where: { status: 'active' },
        include: [
          {
            model: Restaurants,
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            where: { status: 'active' },
          },
        ],
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    message: 'Order was found successfully',
    order,
  });
});
