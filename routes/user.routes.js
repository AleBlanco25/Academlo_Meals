const { Router } = require('express');
const { check } = require('express-validator');
const {
  getOrdersById,
  getOrders,
  deleteUser,
  updateUser,
  login,
  createUser,
} = require('../controllers/users.controller');
const {
  validatePassword,
  validateUserByEmail,
  validateUserById,

  protect,
  protectAccountOwner,
} = require('../middlewares/user.middleware');
const { validateFields } = require('../middlewares/validateFields.middleware');
const { validations } = require('../middlewares/validations.middleware');

const router = Router();

router.post('/signup', validations, validateFields, createUser);
router.post('/login', validateUserByEmail, validatePassword, login);
router.use(protect);
router.patch(
  '/:id',
  validations,
  validateUserById,
  protectAccountOwner,
  validateFields,
  updateUser
);
router.delete('/:id', validateUserById, protectAccountOwner, deleteUser);
router.get('/orders', validateUserById, protectAccountOwner, getOrders);
router.get('/orders/:id', validateUserById, protectAccountOwner, getOrdersById);

module.exports = {
  userRouter: router,
};
