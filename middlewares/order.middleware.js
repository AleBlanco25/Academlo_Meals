const Orders = require('../models/orders.model');
const Users = require('../models/users.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.validOrderById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const order = await Orders.findOne({
    where: {
      id,
      status: 'active',
    },
    include: [
      {
        model: Users,
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
      },
    ],
  });

  if (!order) {
    return next(new AppError('The order does not exist', 401));
  }

  req.order = order;
  req.user = order.user;
  next();
});
