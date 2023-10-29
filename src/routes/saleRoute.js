const { Router } = require("express");
const {
  getAllSales,
  createSale,
  updateSale,
  deleteSale,
  getSaleById,
} = require("../controllers/saleController");

const router = Router(); 

router.get("/", getAllSales);
router.get("/:id", getSaleById);
router.post("/", createSale);
router.put("/:id", updateSale);
router.delete("/:id", deleteSale);

module.exports = router;