const { Router } = require('express');
const { check } = require('express-validator');
const {
  createOrder,
  findOrders,
  updateOrder,
  deleteOrder,
} = require('../controllers/orders.controller');
const { validOrderById } = require('../middlewares/order.middleware');
const {
  protect,
  protectAccountOwner,
} = require('../middlewares/user.middleware');

const router = Router();
router.use(protect);
router.post('/', createOrder);
router.get('/me', findOrders);
router.patch('/:id', validOrderById, protectAccountOwner, updateOrder);
router.delete('/:id', validOrderById, protectAccountOwner, deleteOrder);

module.exports = {
  orderRouter: router,
};
