const { Router } = require("express");
const {
  getAllApartments,
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

router.get("/", getAllApartments);
router.get("/rent", getAllRentApartments);
router.get("/sale", getAllSaleApartments);
router.get("/:id", getApartmentById);
router.post("/", createApartment);
router.post("/:id/rent", rentApartment);
router.post("/:id/sale", saleApartment);
router.put("/:id", updateApartment);
router.delete("/:id", deleteApartment);

module.exports = router;
