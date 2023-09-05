const { Router } = require('express');
const apartmentRoute = require('./apartmentRoute');
const rentRoute = require('./rentRoute');
const userRoute = require('./userRoute');

const router = Router();

router.use('/apartment', apartmentRoute);
router.use('/rent', rentRoute);
router.use('/user', userRoute);

module.exports = router; 
