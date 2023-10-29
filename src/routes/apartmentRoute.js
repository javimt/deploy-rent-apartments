const { Router } = require("express");
const {
  getAllRentApartments,
  getAllSaleApartments,
  createApartment,
  updateApartment,
  deleteApartment,
  getApartmentById,
  rentApartment,
  saleApartment,
} = require("../controllers/apartmentController");

const router = Router();

router.get("/rent", getAllRentApartments);
router.get("/sale", getAllSaleApartments);
router.get("/:id", getApartmentById);
router.post("/", createApartment);
router.put("/:id", updateApartment);
router.delete("/:id", deleteApartment);
router.post("/:id/rent", rentApartment);
router.post("/:id/sale", saleApartment);

module.exports = router;
