const { Router } = require('express');
const { createPayment, getAllPayment, getPaymentById } = require('../controllers/paymentController');

const router = Router();

router.get('/', getAllPayment); 
router.get('/:id', getPaymentById);
router.post('/', createPayment); 

module.exports = router;