const { Router } = require('express');
const { createOrder, rejectOrder, cancelOrder } = require('../controllers/paymentController');

const router = Router();

router.get('/reject-order', rejectOrder); 
router.get('/cancel-order', cancelOrder);
router.post('/create-order', createOrder); 

module.exports = router;