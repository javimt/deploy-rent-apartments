require("dotenv").config();
const { Sequelize } = require("sequelize");
const path = require("path");
const fs = require("fs");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  native: false,
  dialect: "postgres",
  protocol: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

const models = [];
fs.readdirSync(path.join(__dirname, "src", "models"))
  .filter((dir) => dir.indexOf(".") != 0 && dir.slice(-3) === ".js")
  .forEach((dir) =>
    models.push(require(path.join(__dirname, "src", "models", dir)))
);

models.forEach((model) => model(sequelize));

const {Apartment, Rent, User, Sale, Payment} = sequelize.models;

// relaciones

User.hasMany(Apartment, { foreignKey: 'userId' });
Apartment.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Rent, { foreignKey: 'userId' });
Rent.belongsTo(User, { foreignKey: 'userId' }); 

User.hasMany(Sale, { foreignKey: 'userId' });
Sale.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Payment, { foreignKey: 'userId' });
Payment.belongsTo(User, { foreignKey: 'userId' });

Apartment.hasMany(Rent, { foreignKey: 'apartmentId' });
Rent.belongsTo(Apartment, { foreignKey: 'apartmentId' });

Apartment.hasMany(Sale, { foreignKey: 'apartmentId' });
Sale.belongsTo(Apartment, { foreignKey: 'apartmentId' });

module.exports = {
  ...sequelize.models,
  connection: sequelize,
};
