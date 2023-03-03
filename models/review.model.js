const { DataTypes } = require('sequelize');
const { db } = require('../database/db');

const Reviews = db.define('review', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  comment: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  restaurantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

module.exports = Reviews;

// check('rating').exists().custom
// ((value,{req})=>{    if (value >5 || value < 1)
//   {      throw new AppError('you must enter a rating from 1 to 5', 400);
//
//   }    return true  }),
