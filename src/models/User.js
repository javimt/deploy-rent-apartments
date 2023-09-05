const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("User", {

    email: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING
    },
    image: {
      type: DataTypes.STRING
    },
    role: {
      type: DataTypes.ENUM("user", "admin", "superAdmin"),
      defaultValue: "user"
    }
  });
}
