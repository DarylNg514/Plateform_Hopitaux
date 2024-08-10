const express = require('express');
const router = express.Router();
const consultationController = require('../controllers/ConsultationController');
const authMiddleware = require('../middleware/auth');

router.post('/consultations', consultationController.createConsultation);
router.get('/consultations', consultationController.getAllConsultations);
router.get('/consultations/:id', consultationController.getConsultationById);
router.put('/consultations/:id', consultationController.updateConsultation);
router.delete('/consultations/:id', consultationController.deleteConsultation);

module.exports = router;
