const { User, Apartment, Rent } = require("../../db");

const checkAvailability = (apartment) => {
  return apartment.availability ? "Available" : "Not Available";
}; 

module.exports = {
  getAllApartments: async (req, res) => {
    try {
      const apartments = await Apartment.findAll({
        include: { model: User },
      });
      res.status(200).json(apartments);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
    
  },

  getApartmentById: async (req, res) => {
    const { id } = req.params;
    try {
      const apartment = await Apartment.findOne({
        where: { id },
        include: { model: User },
      });
      if (!apartment) {
        return res.status(404).json({ error: "Apartment not found" });
      }
      const availability = checkAvailability(apartment);
      res.status(200).json({ ...apartment.toJSON(), availability });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createApartment: async (req, res) => {
    try {
      const {
        images,
        ubication,
        availability,
        price,
        description,
        bedrooms,
        bathrooms,
        apartmentNumber,
        id,
        lat,
        lon
      } = req.body;
      const newApartment = await Apartment.create({
        images,
        ubication,
        availability,
        price,
        description,
        bedrooms,
        bathrooms,
        apartmentNumber,
        id,
        lat,
        lon
      });
      res.status(201).json(newApartment);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  updateApartment: async (req, res) => {
    const { id } = req.params;
    try {
      const apartment = await Apartment.findByPk(id);
      if (!apartment) {
        return res.status(404).send({ error: "Apartment not found" });
      }
      const updatedApartment = await apartment.update(req.body);
      res.status(200).json({ message: "Apartment updated successfully", updatedApartment });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  deleteApartment: async (req, res) => {
    const { id } = req.params;
    try {
      const apartment = await Apartment.findByPk(id);
      if (!apartment) {
        return res.status(404).send({ error: "Apartment not found" });
      }
      await apartment.destroy();
      res.status(200).send({ message: "Apartment deleted successfully" });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  rentApartment: async (req, res) => {
    const { id } = req.params;
    try {
      if (!req.body.userId) {
        return res.status(400).send({ error: "User ID is missing in the request body" });
      }
      const apartment = await Apartment.findByPk(id);
      if (!apartment) {
        return res.status(404).send({ error: "Apartment not found" });
      }
      if (!apartment.availability) {
        return res.status(400).send({ error: "Apartment is not available for rent" });
      }
      const currentDate = new Date();
      currentDate.setHours(currentDate.getHours() - 5);

      const startDate = new Date(req.body.startDate);
      startDate.setHours(startDate.getHours() + 15);
      startDate.setDate(startDate.getDate());

      const endDate = new Date(req.body.endDate);
      endDate.setDate(endDate.getDate());
      endDate.setHours(endDate.getHours() + 15);
      
      if (!startDate || !endDate) {
        return res.status(400).send("no se pueden generar rentas sin fecha de inicio y finalizacion");
      }
      if(startDate < currentDate) {
        return res.status(400).send("la fecha de inicio debe ser mayor a la actual")
      }
      if(startDate > endDate) {
        return res.status(400).send("la fecha de inicio no puede ser igual a la de finalizacion")
      }
      if(endDate < currentDate) {
        return res.status(400).send("la fecha de finalizacion no puede ser menor a la actual")
      }
      /* if(startDate < currentDate && endDate > startDate) {
        return res.status(400).send("no se puede generar la renta, error en las fechas")
      } */
      try {
        const rent = await Rent.create({
          apartmentId: apartment.id,
          userId: req.body.userId,
          startDate: startDate,
          endDate: req.body.endDate,
          totalPrice: req.body.totalPrice,
          status: req.body.status,
        });
        apartment.availability = false;
        await apartment.save();
        res.status(200).json({ message: "Apartment rented successfully", rent });
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },
};
