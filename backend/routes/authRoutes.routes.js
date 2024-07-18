const authController = require('../controllers/authController');
const router = require("express").Router();

router.post('/creer_hopital', authController.creer_hopital);
router.post('/login', authController.login);

module.exports = router;
