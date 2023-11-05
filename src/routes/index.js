const { Router } = require('express');
const apartmentRoute = require('./apartmentRoute');
const rentRoute = require('./rentRoute');
const userRoute = require('./userRoute');
const saleRoute = require('./saleRoute');
const paymentRoute = require('./paymentRoute');

const router = Router();

router.use('/apartment', apartmentRoute);
router.use('/rent', rentRoute);
router.use('/sale', saleRoute);
router.use('/user', userRoute);
router.use('/payment', paymentRoute);

module.exports = router; 
