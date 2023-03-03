const { Router } = require('express');
const { check } = require('express-validator');
const {
  createMeal,
  findMeals,
  findMeal,
  updateMeal,
  deleteMeal,
} = require('../controllers/meals.controller');
const { validateMealById } = require('../middlewares/meal.middleware');
const { validIfExistRest } = require('../middlewares/restaurant.middleware');
const { protect, restrictTo } = require('../middlewares/user.middleware');
const { validateFields } = require('../middlewares/validateFields.middleware');
const { validations } = require('../middlewares/validations.middleware');

const router = Router();

router.get('/', findMeals);
router.get('/:id', validateMealById, findMeal);
router.use(protect);
router.post(
  '/:id',
  restrictTo('admin'),
  validations,
  validateFields,
  validIfExistRest,
  createMeal
);

router.patch(
  '/:id',
  restrictTo('admin'),
  validations,
  validateFields,
  validateMealById,
  updateMeal
);
router.delete('/:id', restrictTo('admin'), validateMealById, deleteMeal);

module.exports = {
  mealRouter: router,
};
