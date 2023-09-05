const { Router } = require("express");
const {
  getAllRents,
  createRent,
  updateRent,
  deleteRent,
  getRentById,
} = require("../controllers/rentController");

const router = Router(); 

router.get("/", getAllRents);
router.get("/:id", getRentById);
router.post("/", createRent);
router.put("/:id", updateRent);
router.delete("/:id", deleteRent);

module.exports = router;
