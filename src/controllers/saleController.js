const { Sale, Apartment } = require("../../db");

module.exports = {
  getAllSales: async (req, res) => {
    try {
      const sales = await Sale.findAll();
      res.status(200).json(sales);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  getSaleById: async (req, res) => {
    const id = req.params.id;
    try {
      const sale = await Sale.findByPk(id);
      if (!sale) {
        return res.status(404).send({ error: "Sale not found" });
      }
      res.status(200).json(sale);
    } catch (error) {
      res.status(500).send({error: error.message});
    }
  },

  createSale: async (req, res) => {
    try {
      const { apartmentId, startDate, endDate, totalPrice, status } = req.body;
      const apartment = await Apartment.findByPk(apartmentId);
      if (!apartment) {
        return res.status(404).send({ error: "Apartment not found" });
      }
      if (!apartment.availability) {
        return res.status(400).send({ error: "Apartment is not available for Sale" });
      }
      const newSale = await Sale.create({
        apartmentId,
        startDate,
        endDate,
        totalPrice,
        status,
      });
      apartment.availability = false;
      await apartment.save();
      res.status(201).json(newSale);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  updateSale: async (req, res) => {
    const { id } = req.params;
    const { 
      startDate,
      endDate,
      totalPrice,
      status } = req.body;
    try {
      const sale = await Sale.findByPk(id);
      if (!sale) {
        return res.status(404).send({ error: "Sale not found" });
      }
      const updatedSale = await sale.update({ 
        startDate,
        endDate,
        totalPrice,
        status 
      });
      res.status(200).json({ message: "Sale updated successfully", updatedSale });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  deleteSale: async (req, res) => {
    const { id } = req.params;
    try {
      await Sale.destroy({ where: { id } });
      res.status(200).send({ message: "sale deleted successfully" });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },
};
