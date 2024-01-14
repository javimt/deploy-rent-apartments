const { Router } = require('express');
const { createOrder, rejectOrder, cancelOrder } = require('../controllers/paymentController');

const router = Router();

router.get('/:id', rejectOrder); 
router.get('/', cancelOrder);
router.post('/', createOrder); 

module.exports = router;