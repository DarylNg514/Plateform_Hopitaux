const express = require('express');
const router = express.Router();
const HoraireController = require('../controllers/HoraireController');

router.post('/horaires', HoraireController.createHoraire);
router.get('/horaires', HoraireController.getAllHoraires);
router.get('/horaires/:id', HoraireController.getHoraireById);
router.put('/horaires/:id', HoraireController.updateHoraire);
router.delete('/horaires/:id', HoraireController.deleteHoraire);

module.exports = router;
