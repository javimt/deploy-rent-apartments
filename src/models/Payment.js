const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Payment", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    total: {
      type: DataTypes.FLOAT,
    },
    status: {
      type: DataTypes.ENUM("pending", "aproved", "declined"),
      defaultValue: "pending"
    },
  }, {timestamps: false});
};