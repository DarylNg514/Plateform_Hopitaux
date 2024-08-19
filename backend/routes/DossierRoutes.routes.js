const express = require('express');
const router = express.Router();
const dossierController = require('../controllers/DossierController');

router.post('/dossiers', dossierController.createDossier);
router.get('/dossiers', dossierController.getAllDossiers);
router.get('/dossiers/hopital/:hopitalId', dossierController.getAllDossiersByHopitalId);
router.get('/dossiers/:id', dossierController.getDossierById);
router.put('/dossiers/:id', dossierController.updateDossier);
router.delete('/dossiers/:id', dossierController.deleteDossier);

module.exports = router;
