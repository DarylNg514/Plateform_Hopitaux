const express = require('express');
const router = express.Router();
const infirmierController = require('../controllers/InfirmierController');

router.post('/infirmiers', infirmierController.createInfirmier);
router.get('/infirmiers', infirmierController.getAllInfirmiers);
router.get('/infirmiers/hopital/:hopitalId', infirmierController.getAllInfirmiersByHopitalId);
router.get('/infirmiers/:id', infirmierController.getInfirmierById);
router.get('/infirmiers/:id/dossiers', infirmierController.getDossierByInfirmier);
router.put('/infirmiers/:id', infirmierController.updateInfirmier);
router.delete('/infirmiers/:id', infirmierController.deleteInfirmier);

module.exports = router;
