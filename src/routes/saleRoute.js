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
router.get("/:id", createSale);
router.post("/", updateSale);
router.put("/:id", deleteSale);
router.delete("/:id", getSaleById);

module.exports = router;