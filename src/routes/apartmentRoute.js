const { Router } = require("express");
const {
  getAllApartments,
  createApartment,
  updateApartment,
  deleteApartment,
  getApartmentById,
  rentApartment,
} = require("../controllers/apartmentController");

const router = Router();

router.get("/", getAllApartments);
router.get("/:id", getApartmentById);
router.post("/", createApartment);
router.put("/:id", updateApartment);
router.delete("/:id", deleteApartment);
router.post("/:id/rent", rentApartment);

module.exports = router;
