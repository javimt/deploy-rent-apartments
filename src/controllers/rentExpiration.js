const { Rent, Apartment } = require("../../db");
const { Op } = require("sequelize");

module.exports = {
  checkExpiredRents: async () => {
    try {
      const currentDate = new Date();
      const expiredRents = await Rent.findAll({ 
        where: {
          status: "not available",
          endDate: {
            [Op.lte]: currentDate, 
          },
        },
      });
  console.log("rentas expiradas", expiredRents);

    for (const rent of expiredRents) {
      let apartment = await Apartment.findByPk(rent.apartmentId);
      if (apartment) {
        apartment.availability = true;
        await apartment.save();
        rent.status = "available";
        await rent.save();
      }
console.log("apartments", apartment);
    }
      return expiredRents;
    } catch (error) {
      console.error("Error al verificar los alquileres vencidos:", error);
      throw error;
    }
  },
};
