const express = require('express');
const router = express.Router();
const medecinController = require('../controllers/MedecinController');

router.post('/medecins', medecinController.createMedecin);
router.get('/medecins', medecinController.getAllMedecins);
router.get('/medecins/:id', medecinController.getMedecinById);
router.put('/medecins/:id', medecinController.updateMedecin);
router.delete('/medecins/:id', medecinController.deleteMedecin);

module.exports = router;
