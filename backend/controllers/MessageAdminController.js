const { MessageAdmin, MessageHopital } = require('../database/models/User');

exports.createMessageAdmin = async (req, res) => {
    try {
        const { senderAdmin, receiverHopital, content } = req.body;

        if (!senderAdmin || !receiverHopital || !content) {
            return res.status(400).json({ error: "Tous les champs sont obligatoires." });
        }

        const message = new MessageAdmin({
            content,
            senderAdmin,
            receiverHopital
        });

        await message.save();

        res.status(201).json({
            message: "Message envoyé avec succès",
            data: {
                id: message._id,
                sender: message.senderAdmin,
                receiver: message.receiverHopital,
                content: message.content,
                createdAt: message.createdAt,
                updatedAt: message.updatedAt
            }
        });
    } catch (err) {
        console.error('Erreur lors de l\'envoi du message :', err);
        res.status(500).json({ error: "Erreur lors de l'envoi du message" });
    }
};


exports.getSentMessagesByAdmin = async (req, res) => {
    try {
        const { senderAdmin } = req.query;

        const messages = await MessageAdmin.find({ senderAdmin })
            .populate('senderAdmin')
            .populate('receiverHopital');

        res.status(200).json(messages.map(message => ({
            id: message._id,
            sender: message.senderAdmin,
            receiver: message.receiverHopital,
            content: message.content,
            isRead: message.isRead,
            createdAt: message.createdAt,
            updatedAt: message.updatedAt
        })));
    } catch (err) {
        console.error('Erreur lors de la récupération des messages envoyés par l\'admin :', err);
        res.status(500).json({ error: "Erreur lors de la récupération des messages envoyés par l'admin" });
    }
};

exports.getReceivedMessagesByAdmin = async (req, res) => {
    try {
        const { receiverUser } = req.query;

        const messages = await MessageHopital.find({ receiverUser })
            .populate('senderHopital')
            .populate('receiverUser');

        res.status(200).json(messages.map(message => ({
            id: message._id,
            sender: message.senderHopital,
            receiver: message.receiverUser,
            content: message.content,
            isRead: message.isRead,
            createdAt: message.createdAt,
            updatedAt: message.updatedAt
        })));
    } catch (err) {
        console.error('Erreur lors de la récupération des messages reçus par l\'admin :', err);
        res.status(500).json({ error: "Erreur lors de la récupération des messages reçus par l'admin" });
    }
};


exports.getMessagesByReceiverHopital = async (req, res) => {
    try {
        const { receiverHopital } = req.query;

        const messages = await MessageAdmin.find({ receiverHopital })
            .populate('senderAdmin')
            .populate('receiverHopital');

        res.status(200).json(messages.map(message => ({
            id: message._id,
            sender: message.senderAdmin,
            receiver: message.receiverHopital,
            content: message.content,
            isRead: message.isRead,
            createdAt: message.createdAt,
            updatedAt: message.updatedAt
        })));
    } catch (err) {
        console.error('Erreur lors de la récupération des messages :', err);
        res.status(500).json({ error: "Erreur lors de la récupération des messages" });
    }
};

exports.getMessageHopitalById = async (req, res) => {
    try {
        const message = await MessageHopital.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        ).populate('senderHopital').populate('receiverUser');

        if (!message) {
            return res.status(404).json({ error: "Message non trouvé" });
        }

        res.status(200).json({
            id: message._id,
            sender: message.senderHopital,
            receiver: message.receiverUser,
            content: message.content,
            isRead: message.isRead,
            createdAt: message.createdAt,
            updatedAt: message.updatedAt
        });
    } catch (err) {
        console.error('Erreur lors de la récupération du message :', err);
        res.status(500).json({ error: "Erreur lors de la récupération du message" });
    }
};



exports.deleteMessageAdmin = async (req, res) => {
    try {
        const message = await MessageAdmin.findByIdAndDelete(req.params.id);

        if (!message) {
            return res.status(404).json({ error: "Message non trouvé" });
        }

        res.status(204).json({ message: "Message supprimé avec succès" });
    } catch (err) {
        console.error('Erreur lors de la suppression du message :', err);
        res.status(500).json({ error: "Erreur lors de la suppression du message" });
    }
};

