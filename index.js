const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { checkExpiredRents } = require("./src/controllers/rentExpiration");
const cron = require("node-cron");
const router = require("./src/routes/index");
const { sequelize } = require("./db");

const app = express();
const port = process.env.PORT || 3001;

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.use("/", router);

app.get("/", (req, res) => {
  res.status(200).send("Welcome to Furnished Apartments Medellin");
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  res.status(status).json({ status: "error", message });
  next();
});

async function startServer() {
  try {
    await sequelize.authenticate();
    console.info("Database connection has been established successfully.");
    await sequelize.sync({ force: false });
    console.info("Database synchronized.");
    app.listen(port, () => {
      console.info(`Server listening on port ${port}`);
    });

    cron.schedule("0 12 * * *", () => {
      console.log("Verifying expired rentals...");
      checkExpiredRents();
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

startServer();
