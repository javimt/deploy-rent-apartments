const { User, Apartment, Payment } = require("../../db");

module.exports = {
  getAllPayment: async (req, res) => {
    try {
      const payments = await Payment.findAll();
      res.status(200).json(payments);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error.message });
    }
  },

  getPaymentById: async (req, res) => {
    const id = req.params.id;
    try {
      const payment = await Payment.findByPk(id);
      if (!payment) {
        return res.status(404).send({ error: "Payment not found" });
      }
      res.status(200).json(payment);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error.message });
    }
  },

  createPayment: async (req, res) => {
    const { date, total, status, userId, apartmentId } = req.body;
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }

      const apartment = await Apartment.findByPk(apartmentId);
      if (!apartment) {
        return res.status(404).send({ error: "Apartment not found" });
      }

      const newPayment = await Payment.create({
        date,
        total,
        status,
        userId,
        apartmentId,
      });
      await newPayment.update({ status: "aproved" }, { where: { id: newPayment.id } });
      res.status(201).json(newPayment);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error.message });
    }
  },

}