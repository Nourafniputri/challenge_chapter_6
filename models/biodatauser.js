'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class biodataUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // biodataUser.belongsTo(models.user, {
      //   foreignKey: 'userId'
      // })
    }
  }
  biodataUser.init({
    username: DataTypes.STRING,
    umur: DataTypes.INTEGER,
    city: DataTypes.STRING,
    country: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'biodataUser',
    updatedAt: false,
    underscored: true
  });
  return biodataUser;
};