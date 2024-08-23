const { MessageHopital, MessageAdmin } = require('../database/models/User');

exports.createMessageHopital = async (req, res) => {
    try {
        const { senderHopital, receiverUser, content } = req.body;

        if (!senderHopital || !receiverUser || !content) {
            return res.status(400).json({ error: "Tous les champs sont obligatoires." });
        }

        const message = new MessageHopital({
            content,
            senderHopital,
            receiverUser
        });

        await message.save();

        res.status(201).json({
            message: "Message envoyé avec succès",
            data: {
                id: message._id,
                sender: message.senderHopital,
                receiver: message.receiverUser,
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


exports.getSentMessagesByHopital = async (req, res) => {
    try {
        const { senderHopital } = req.query;

        const messages = await MessageHopital.find({ senderHopital })
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
        console.error('Erreur lors de la récupération des messages envoyés par l\'hôpital :', err);
        res.status(500).json({ error: "Erreur lors de la récupération des messages envoyés par l'hôpital" });
    }
};

exports.getReceivedMessagesByHopital = async (req, res) => {
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
        console.error('Erreur lors de la récupération des messages reçus par l\'hôpital :', err);
        res.status(500).json({ error: "Erreur lors de la récupération des messages reçus par l'hôpital" });
    }
};



exports.getMessagesByReceiverUser = async (req, res) => {
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
        console.error('Erreur lors de la récupération des messages :', err);
        res.status(500).json({ error: "Erreur lors de la récupération des messages" });
    }
};

exports.getMessageAdminById = async (req, res) => {
    try {
        const message = await MessageAdmin.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        ).populate('senderAdmin').populate('receiverHopital');

        if (!message) {
            return res.status(404).json({ error: "Message non trouvé" });
        }

        res.status(200).json({
            id: message._id,
            sender: message.senderAdmin,
            receiver: message.receiverHopital,
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

exports.deleteMessageHopital = async (req, res) => {
    try {
        const message = await MessageHopital.findByIdAndDelete(req.params.id);

        if (!message) {
            return res.status(404).json({ error: "Message non trouvé" });
        }

        res.status(204).json({ message: "Message supprimé avec succès" });
    } catch (err) {
        console.error('Erreur lors de la suppression du message :', err);
        res.status(500).json({ error: "Erreur lors de la suppression du message" });
    }
};

