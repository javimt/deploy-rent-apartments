const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { connection } = require("./db");
const router = require("./src/routes/index");
const {Apartment} = require('./db')
const cron = require("node-cron");
const { checkExpiredRents } = require("./src/controllers/rentExpiration");

const port = process.env.PORT || 3000

/* process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
}); */

const startServer = async () => {
  const app = express();
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(cors());

  app.use("/", router);

  app.get("apartment", async (req, res) => {
    const apartments = await Apartment.findAll();
    res.status(200).json(apartments);
  });

  app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || err;
    res.status(status).json({ status: "error", message });
    next();
  });

  /* try {*/
    await connection.sync({ force: false });
    console.info(`Server is listening on port ${port}`);
    app.listen(port);
 /*  } catch (error) {
    console.error("Error starting the server:", error);
  } */
  
  cron.schedule("34 21 * * *", async () => {
    try {
      const expiredRents = await checkExpiredRents();
      console.log("Verifying expired rentals...", expiredRents);
    } catch (error) {
      console.error("Error verifying expired rentals:", error);
    }
  });

};

startServer();
