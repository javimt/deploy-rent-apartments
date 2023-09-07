const { Sequelize } = require("sequelize");

require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
});

const models = [];
const modelFiles = ["user.js", "apartment.js", "rent.js"]; // Lista de archivos de modelos

modelFiles.forEach((file) => {
  const model = require(`./src/models/${file}`);
  model(sequelize, Sequelize.DataTypes); // Pasar Sequelize.DataTypes como segundo argumento
  models.push(model);
});

const { Apartment, Rent, User } = sequelize.models;

// Define relaciones aquí
User.hasMany(Apartment, { foreignKey: "userId" });
Apartment.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Rent, { foreignKey: "userId" });
Rent.belongsTo(User, { foreignKey: "userId" });

Apartment.hasMany(Rent, { foreignKey: "apartmentId" });
Rent.belongsTo(Apartment, { foreignKey: "apartmentId" });

module.exports = {
  sequelize,
  models,
};
