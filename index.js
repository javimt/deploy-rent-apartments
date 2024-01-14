const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { connection } = require("./db");
const router = require("./src/routes/index");
const cron = require("node-cron");
const { checkExpiredRents } = require("./src/controllers/rentExpiration");

const port = process.env.PORT || 3000

const startServer = async () => {
  const app = express();
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(cors());

  app.use("/", router);

  app.get("/", async (req, res) => {
    res.status(200).send("Welcome to furnished apartments medellin");
  });

  app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || err;
    res.status(status).json({ status: "error", message });
    next();
  });

  connection.sync({ force: false });
    console.info(`Server is listening on port ${port}`);
  app.listen(port);
  
  cron.schedule("53 11 * * *", async () => {
    try {
      const expiredRents = await checkExpiredRents();
      console.log("Verifying expired rentals...", expiredRents);
    } catch (error) {
      console.error("Error verifying expired rentals:", error);
    }
  });

};

startServer();
