const { Router } = require('express');
const { createSession } = require('../controllers/paymentController');

const router = Router();

router.get('/session', createSession); 
router.get('/:id', ); 
router.post('/', );
router.put('/:id', ); 
router.delete('/:id', ); 
router.put('/:id/admin', );

module.exports = router;