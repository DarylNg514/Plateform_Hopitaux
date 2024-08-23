const express = require('express');
const router = express.Router();
const personnelController = require('../controllers/PersonnelController');

router.post('/personnels', personnelController.createPersonnel);
router.get('/personnels', personnelController.getAllPersonnels);
router.get('/personnels/hopital/:hopitalId', personnelController.getAllPersonnelsByHopitalId);
router.get('/personnels/:id', personnelController.getPersonnelById);
router.put('/personnels/:id', personnelController.updatePersonnel);
router.delete('/personnels/:id', personnelController.deletePersonnel);

module.exports = router;
