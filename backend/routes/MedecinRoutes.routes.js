const express = require('express');
const router = express.Router();
const medecinController = require('../controllers/MedecinController');

router.post('/medecins', medecinController.createMedecin);
router.get('/medecins', medecinController.getAllMedecins);
router.get('/medecins/hopital/:hopitalId', medecinController.getAllMedecinsByHopitalId);
router.get('/medecins/:id/consultations', medecinController.getConsultationsByMedecin);
router.get('/medecins/:id/dossiers', medecinController.getDossierByMedecin);
router.get('/medecins/:id/rendezvous', medecinController.getRendezvousByMedecin);
router.get('/medecins/:id', medecinController.getMedecinById);
router.put('/medecins/:id', medecinController.updateMedecin);
router.delete('/medecins/:id', medecinController.deleteMedecin);

module.exports = router;
