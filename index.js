const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { conn } = require("./db");
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

const server = express();
server.use(morgan("dev"));
server.use(express.json());
server.use(cors());

server.use("/", router);

server.get("/", (req, res) => {
  res.status(200).send("Welcome to Furnished Apartments Medellin")
})

server.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  res.status(status).json({ status: "error", message });
  next();
});

server.listen(
  port,
  conn
    .sync({ force: false })
    .then(() =>
      console.info(
        `server listen on port ${port}`
      )
    )
);
