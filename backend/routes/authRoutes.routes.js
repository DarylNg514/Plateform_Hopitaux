const authController = require('../controllers/authController');
const router = require("express").Router();
const authMiddleware = require('../middleware/auth');

// Route pour créer un hôpital
router.post('/creer_hopital', authController.creer_hopital);

// Route pour la connexion
router.post('/login', authController.login);

// Route pour lister tous les hôpitaux
router.get('/hopitaux', authMiddleware, authController.lister_hopitaux);

// Route pour récupérer un hôpital par son ID
router.get('/hopital/:id', authMiddleware, authController.get_hopital);

// Route pour mettre à jour un hôpital par son ID
router.put('/hopital/:id', authMiddleware, authController.update_hopital);

// Route pour supprimer un hôpital par son ID
router.delete('/hopital/:id', authMiddleware, authController.delete_hopital);

module.exports = router;
