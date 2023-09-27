const { Rent, Apartment } = require("../../db");

module.exports = {
  getAllRents: async (req, res) => {
    try {
      const rents = await Rent.findAll();
      res.status(200).json(rents);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  getRentById: async (req, res) => {
    const id = req.params.id;
    try {
      const rent = await Rent.findByPk(id);
      if (!rent) {
        return res.status(404).send({ error: "Rent not found" });
      }
      res.status(200).json(rent);
    } catch (error) {
      res.status(500).send({error: error.message});
    }
  },

  createRent: async (req, res) => {
    try {
      const { apartmentId, startDate, endDate, totalPrice, status } = req.body;
      const apartment = await Apartment.findByPk(apartmentId);
      if (!apartment) {
        return res.status(404).send({ error: "Apartment not found" });
      }
      if (!apartment.availability) {
        return res.status(400).send({ error: "Apartment is not available for rent" });
      }
      const newRent = await Rent.create({
        apartmentId,
        startDate,
        endDate,
        totalPrice,
        status,
      });
      apartment.availability = false;
      await apartment.save();
      res.status(201).json(newRent);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  updateRent: async (req, res) => {
    const { id } = req.params;
    const { 
      startDate,
      endDate,
      totalPrice,
      status } = req.body;
    try {
      const rent = await Rent.findByPk(id);
      if (!rent) {
        return res.status(404).send({ error: "Rent not found" });
      }
      const updatedRent = await rent.update({ 
        startDate,
        endDate,
        totalPrice,
        status 
      });
      res.status(200).json({ message: "Rent updated successfully", updatedRent });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  deleteRent: async (req, res) => {
    const { id } = req.params;
    try {
      await Rent.destroy({ where: { id } });
      res.status(200).send({ message: "Rent deleted successfully" });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },
};
