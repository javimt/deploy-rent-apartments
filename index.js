const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { connection } = require("./db");
const router = require("./src/routes/index");
const cron = require("node-cron");
const { checkExpiredRents } = require("./src/controllers/rentExpiration");

const port = process.env.PORT || 3001;

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

cron.schedule("0 12 * * *", () => {
  console.log("Verificando alquileres vencidos...");
  checkExpiredRents();
});

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.use("/", router);

app.get("/", (req, res) => {
  res.status(200).send("Welcome to Furnished Apartments Medellin")
})

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  res.status(status).json({ status: "error", message });
  next();
});

connection.sync({ force: false })
  .then(() => {
    app.listen(port, () => {
      console.info(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });
