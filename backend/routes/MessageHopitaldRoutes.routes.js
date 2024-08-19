const express = require('express');
const router = express.Router();
const MessageHopitalController = require('../controllers/MessageHopitalController');

router.post('/hopital/messages', MessageHopitalController.createMessageHopital);
router.get('/hopital/messages', MessageHopitalController.getMessagesByReceiverUser);
router.get('/hopital/messages/sent', MessageHopitalController.getSentMessagesByHopital);
router.get('/hopital/messages/received', MessageHopitalController.getReceivedMessagesByHopital);
router.get('/hopital/messages/:id', MessageHopitalController.getMessageAdminById);
router.delete('/hopital/messages/:id', MessageHopitalController.deleteMessageHopital);

module.exports = router;
