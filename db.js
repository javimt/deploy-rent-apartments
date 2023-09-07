require("dotenv").config();
const { Sequelize } = require("sequelize");
const path = require("path");
const fs = require("fs");
const { DB_USER, DB_PASSWORD, DB_HOST, } = process.env;

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/rentapartment`, {
  native: false,
  dialect: "postgres",
  protocol: "postgres",
  logging: false,
});

const models = [];
fs.readdirSync(path.join(__dirname, "src", "models"))
  .filter((dir) => dir.indexOf(".") != 0 && dir.slice(-3) === ".js")
  .forEach((dir) =>
    models.push(require(path.join(__dirname, "src", "models", dir)))
);

models.forEach((model) => model(sequelize));

const {Apartment, Rent, User} = sequelize.models;

// relaciones

User.hasMany(Apartment, { foreignKey: 'userId' });
Apartment.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Rent, { foreignKey: 'userId' });
Rent.belongsTo(User, { foreignKey: 'userId' }); 

Apartment.hasMany(Rent, { foreignKey: 'apartmentId' });
Rent.belongsTo(Apartment, { foreignKey: 'apartmentId' });

// Manejo de cierre de conexión
process.on('SIGINT', async () => {
  try {
    await sequelize.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error closing database connection:', error);
    process.exit(1);
  }
});

module.exports = {
  ...sequelize.models,
  connection: sequelize,
};
