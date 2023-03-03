const { Router } = require('express');
const { check } = require('express-validator');
const {
  createRestaurant,
  findRestaurants,
  deleteRestaurant,
  updateRestaurant,
  findRestaurant,
  updateReview,
  deleteReview,
  createReview,
} = require('../controllers/restaurants.controller');
const {
  validIfExistRest,
  validReviewByRestId,
  validIfExistReview,
} = require('../middlewares/restaurant.middleware');
const {
  protect,
  restrictTo,
  protectAccountOwner,
} = require('../middlewares/user.middleware');
const { validateFields } = require('../middlewares/validateFields.middleware');
const { validations } = require('../middlewares/validations.middleware');

const router = Router();

router.get('/', findRestaurants);
router.get('/:id', validIfExistRest, findRestaurant);
router.use(protect);
router.post(
  '/',
  restrictTo('admin'),
  validations,
  validateFields,
  createRestaurant
);
router.patch(
  '/:id',
  restrictTo('admin'),
  validations,
  validateFields,
  validIfExistRest,
  updateRestaurant
);

router.delete('/:id', restrictTo('admin'), validIfExistRest, deleteRestaurant);
router.post('/reviews/:id', validIfExistRest, createReview);
router.patch(
  '/reviews/:restaurantId/:id',
  validReviewByRestId,
  validIfExistReview,
  protectAccountOwner,
  updateReview
);
router.delete(
  '/reviews/:restaurantId/:id',
  validReviewByRestId,
  validIfExistReview,
  protectAccountOwner,
  deleteReview
);

module.exports = {
  restaurantRouter: router,
};
