const Meals = require('./meals.model');
const Orders = require('./orders.model');
const Restaurants = require('./restaurants.model');
const Reviews = require('./review.model');
const Users = require('./users.model');

const initModel = () => {
  Restaurants.hasMany(Meals);
  Meals.belongsTo(Restaurants);

  Restaurants.hasMany(Reviews);
  Reviews.belongsTo(Restaurants);

  Users.hasMany(Reviews);
  Reviews.belongsTo(Users);

  Users.hasMany(Orders);
  Orders.belongsTo(Users);

  Meals.hasOne(Orders);
  Orders.belongsTo(Meals);
};

module.exports = { initModel };
