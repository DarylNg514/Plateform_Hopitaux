const express = require('express');
const router = express.Router();
const infirmierController = require('../controllers/InfirmierController');

router.post('/infirmiers', infirmierController.createInfirmier);
router.get('/infirmiers', infirmierController.getAllInfirmiers);
router.get('/infirmiers/:id', infirmierController.getInfirmierById);
router.put('/infirmiers/:id', infirmierController.updateInfirmier);
router.delete('/infirmiers/:id', infirmierController.deleteInfirmier);

module.exports = router;
