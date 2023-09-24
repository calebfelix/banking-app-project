'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      transaction.belongsTo(models.account)
    }
  }
  transaction.init({
    senderAccountId: DataTypes.INTEGER,
    receverAccountId: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    currentBalance: DataTypes.INTEGER,
    type: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'transaction',
    underscored: true
  });
  return transaction;
};