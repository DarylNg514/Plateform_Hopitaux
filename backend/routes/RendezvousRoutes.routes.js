const express = require('express');
const router = express.Router();
const rendezvousController = require('../controllers/RendezvousController');

router.post('/rendezvous', rendezvousController.createRendezvous);
router.get('/rendezvous', rendezvousController.getAllRendezvous);
router.get('/rendezvous/:id', rendezvousController.getRendezvousById);
router.put('/rendezvous/:id', rendezvousController.updateRendezvous);
router.delete('/rendezvous/:id', rendezvousController.deleteRendezvous);

module.exports = router;
