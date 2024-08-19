const express = require('express');
const router = express.Router();
const patientController = require('../controllers/PatientController');

router.post('/patients', patientController.createPatient);
router.post('/deplacer', patientController.deplacerPatient);
router.get('/patients', patientController.getAllPatients);
router.get('/patients/:id', patientController.getPatientById);
router.get('/patients/hopital/:hopitalId', patientController.getAllPatientsByHopitalId);
router.get('/patients/:id/dossiers', patientController.getDossierByPatient);
router.get('/patients/:id/consultations', patientController.getConsultationByPatient);
router.get('/patients/:id/rendezvous', patientController.getRendezvousByPatient);
router.put('/patients/:id', patientController.updatePatient);
router.delete('/patients/:id', patientController.deletePatient);

module.exports = router;
