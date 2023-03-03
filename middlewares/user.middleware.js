const Users = require('../models/users.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const Orders = require('../models/orders.model');
const Meals = require('../models/meals.model');
const Restaurants = require('../models/restaurants.model');

exports.validateUserByEmail = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await Users.findOne({
    where: {
      email,
      status: true,
    },
  });
  if (!user) {
    return next(new AppError('The user is not registered', 401));
  }

  req.user = user;
  next();
});

exports.validatePassword = catchAsync(async (req, res, next) => {
  const { password } = req.body;
  const { user } = req;

  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Invalid password', 401));
  }
  next();
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('Not authorized, you must log in to get access', 401)
    );
  }

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.SECRET_JWT_SEED
  );

  const user = await Users.findOne({
    where: {
      id: decoded.id,
      status: true,
    },
  });

  if (!user) {
    return next(
      new AppError('The owner of this token it not longer available', 401)
    );
  }
  req.sessionUser = user;

  next();
});

exports.validateUserById = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const user = await Users.findOne({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    where: {
      id: sessionUser.id,
    },
  });

  if (!user) {
    return next(new AppError('User not found', 401));
  }

  req.user = user;
  next();
});

exports.protectAccountOwner = catchAsync(async (req, res, next) => {
  const { user, sessionUser } = req;

  if (user.id !== sessionUser.id) {
    return next(new AppError('You do not own this account.', 401));
  }

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.sessionUser.role)) {
      return next(
        new AppError(
          'You do not have permission to perform this action(forbidden)',
          403
        )
      );
    }
    next();
  };
};
