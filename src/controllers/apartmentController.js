const { User, Apartment, Rent, Sale, Payment } = require("../../db");

const checkAvailability = (apartment) => {
  return apartment.availability ? "Available" : "Not Available";
}; 

const checkPaymentStatus = async (userId) => {
  try {
    const userPayments = await Payment.findAll({ where: { userId } });
    const lastPayment = userPayments[userPayments.length - 1];
    return lastPayment.status; 
  } catch (error) {
    throw new Error("Error fetching payment status");
  }
};

module.exports = {
  getAllApartments: async (req, res) => {
    try {
      const apartments = await Apartment.findAll(); 
      res.status(200).json(apartments);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  getAllRentApartments: async (req, res) => {
    try {
      const rentalApartments = await Apartment.findAll({ where: { status: 'rent' } });
      res.status(200).json(rentalApartments);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  getAllSaleApartments: async (req, res) => {
    try {
      const saleApartments = await Apartment.findAll({ where: { status: 'sale' } });
      res.status(200).json(saleApartments);
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
      if(apartment.status === "rent") {
        const availability = checkAvailability(apartment);
        res.status(200).json({ ...apartment.toJSON(), availability });
      } else {
        res.status(200).json(apartment)
      }
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
        status,
        id,
        lat,
        lon
      } = req.body;/* 
      const cleanImages = images.map((image) => {
        if (image.startsWith("blob:")) {
          return image.slice("blob:".length);
        }
        return image;
      }); */
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
        status,
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

      const paymentStatus = await checkPaymentStatus(req.body.userId);
      if (paymentStatus !== "approved") {
        return res.status(400).send({ error: "Payment not approved. Cannot proceed with renting the apartment" });
      }

      const currentDate = new Date();
      currentDate.setHours(currentDate.getHours() - 5);

      const startDate = new Date(req.body.startDate);
      startDate.setHours(startDate.getHours());
      startDate.setDate(startDate.getDate());

      const endDate = new Date(req.body.endDate);
      endDate.setHours(endDate.getHours());
      endDate.setDate(endDate.getDate());
      
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
      try {
        const rent = await Rent.create({
          apartmentId: apartment.id,
          userId: req.body.userId,
          startDate: startDate,
          endDate: endDate,
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

  saleApartment: async(req, res) => {
    const { id } = req.params;
    try {
      if (!req.body.userId) {
        return res.status(400).send({ error: "User ID is missing in the request body" });
      }
      const apartment = await Apartment.findByPk(id);
      if (!apartment) {
        return res.status(404).send({ error: "Apartment not found" });
      }

      const paymentStatus = await checkPaymentStatus(req.body.userId);
      if (paymentStatus !== "approved") {
        return res.status(400).send({ error: "Payment not approved. Cannot proceed with selling the apartment" });
      }

      const date = new Date(req.body.date);
      date.setHours(date.getHours());
      date.setDate(date.getDate());

      try {
        const sale = await Sale.create({
          apartmentId: apartment.id,
          userId: req.body.userId,
          date: date,
          totalPrice: req.body.totalPrice,
          status: req.body.status,
        });
        apartment.status = "sold";
        await apartment.save();
        res.status(201).json({ message: "Apartment sold successfully", sale });
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  } 

};
