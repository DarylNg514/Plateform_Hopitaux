const express = require('express');
const router = express.Router();
const MessageAdminController = require('../controllers/MessageAdminController');

router.post('/admin/messages', MessageAdminController.createMessageAdmin);
router.get('/admin/messages', MessageAdminController.getMessagesByReceiverHopital);
router.get('/admin/messages/sent', MessageAdminController.getSentMessagesByAdmin);
router.get('/admin/messages/received', MessageAdminController.getReceivedMessagesByAdmin);
router.get('/admin/messages/:id', MessageAdminController.getMessageHopitalById);
router.delete('/admin/messages/:id', MessageAdminController.deleteMessageAdmin);

module.exports = router;
