const { Sequelize } = require("sequelize");
const path = require("path");
const fs = require("fs");

const sequelize = new Sequelize(process.env.SEQUELIZE_URL, { 
  native: false,
  protocol: "postgres",
  dialect: "postgres",
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

module.exports = {
  ...sequelize.models,
  connection: sequelize,
};
