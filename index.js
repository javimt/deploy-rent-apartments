const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { connection } = require("./db");
const router = require("./src/routes/index");
const cron = require("node-cron");
const { checkExpiredRents } = require("./src/controllers/rentExpiration");

const PORT = process.env.PORT;

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

//console.log("Ejecutando verificación de alquileres vencidos...");
//checkExpiredRents();

cron.schedule("0 12 * * *", () => {
  console.log("Verificando alquileres vencidos...");
  checkExpiredRents();
});

const server = express();
server.use(morgan("dev"));
server.use(express.json());
server.use(cors());

server.use("/", router);

server.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  res.status(status).json({ status: "error", message });
  next();
});

server.listen(
  PORT,
  connection
    .sync({ force: false })
    .then(() =>
      console.info(
        `the port is listen in port ${PORT}`
      )
    )
);
