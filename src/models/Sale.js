const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Sale", {

    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.FLOAT,
    },
    status: {
      type: DataTypes.ENUM("sale", "available"),
      defaultValue: "available"
    },
  }, {timestamps: false});
};