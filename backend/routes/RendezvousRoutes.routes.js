const express = require('express');
const router = express.Router();
const rendezvousController = require('../controllers/RendezvousController');

router.post('/rendezvous', rendezvousController.createRendezvous);
router.get('/rendezvous', rendezvousController.getAllRendezvous);
router.get('/rendezvous/hopital/:hopitalId', rendezvousController.getAllRendezvousByHopitalId);
router.get('/rendezvous/:id/medecins', rendezvousController.getRendezvousByMedecin);
router.get('/rendezvous/:id/patients', rendezvousController.getRendezvousByPatient);
router.get('/rendezvous/:id', rendezvousController.getRendezvousById);
router.put('/rendezvous/:id', rendezvousController.updateRendezvous);
router.delete('/rendezvous/:id', rendezvousController.deleteRendezvous);

module.exports = router;
