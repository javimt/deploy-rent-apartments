const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Apartment", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
    },
    ubication: {
      type: DataTypes.STRING,
    },
    availability: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    price: {
      type: DataTypes.FLOAT,
    },
    description: {
      type: DataTypes.STRING,
    },
    bedrooms: {
      type: DataTypes.INTEGER
    },
    bathrooms: {
      type: DataTypes.INTEGER
    },
    apartmentNumber: {
      type: DataTypes.STRING
    },
    lat: {
      type: DataTypes.DECIMAL(10, 8)
    },
    lon: {
      type: DataTypes.DECIMAL(10, 8)
    },
    status: {
      type: DataTypes.ENUM("rent", "sale"),
      allowNull: false,
    },
  },{timestamps: false});
};
