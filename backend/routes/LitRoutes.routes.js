const express = require('express');
const router = express.Router();
const litController = require('../controllers/LitController');

router.post('/lits', litController.createLit);
router.get('/lits', litController.getAllLits);
router.get('/lits/hopital/:hopitalId', litController.getAllLitsByHopitalId);
router.get('/lits/:id', litController.getLitById);
router.put('/lits/:id', litController.updateLit);
router.delete('/lits/:id', litController.deleteLit);

module.exports = router;
