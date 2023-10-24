const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Shopping", {

    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    description: {
      type: DataTypes.STRING,
    },
    transaction_amount: {
      type: DataTypes.FLOAT,
    },
    payment_method_id: {
      type: DataTypes.STRING,
    },
    date: {
      type: DataTypes.DATEONLY,
    },
    status_detail: {
      type: DataTypes.ENUM('completed', 'pending', 'rejected'),
      defaultValue: 'pending'
    },
    
  });
};
