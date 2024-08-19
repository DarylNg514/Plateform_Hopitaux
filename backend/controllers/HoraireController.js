const Horaire = require('../database/models/User');

// Créer un nouvel horaire
exports.createHoraire = async (req, res) => {
    try {
        const { day, start_hour, end_hour, type } = req.body;

        if (!day || !start_hour || !end_hour || !type) {
            return res.status(400).json({ error: "Tous les champs sont obligatoires" });
        }

        const horaire = new Horaire({ day, start_hour, end_hour, type });
        await horaire.save();

        res.status(201).json({ message: 'Horaire créé avec succès', horaire: { id: horaire._id, day, start_hour, end_hour, type } });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la création de l'horaire", details: err.message });
    }
};

// Lire tous les horaires
exports.getAllHoraires = async (req, res) => {
    try {
        const horaires = await Horaire.find().populate('referenceId');
        // Convert _id to id
        const formattedHoraires = horaires.map(horaire => {
            return {
                id: horaire._id,
                day: horaire.day,
                start_hour: horaire.start_hour,
                end_hour: horaire.end_hour,
                type: horaire.type,
                createdAt: horaire.createdAt,
                updatedAt: horaire.updatedAt
            };
        });
        res.status(200).json(formattedHoraires);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des horaires", details: err.message });
    }
};

// Lire un horaire par ID
exports.getHoraireById = async (req, res) => {
    try {
        const horaire = await Horaire.findById(req.params.id).populate('referenceId');
        if (!horaire) {
            return res.status(404).json({ error: "Horaire non trouvé" });
        }
        res.status(200).json({
            id: horaire._id,
            day: horaire.day,
            start_hour: horaire.start_hour,
            end_hour: horaire.end_hour,
            type: horaire.type,
            createdAt: horaire.createdAt,
            updatedAt: horaire.updatedAt
        });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération de l'horaire", details: err.message });
    }
};

// Mettre à jour un horaire
exports.updateHoraire = async (req, res) => {
    try {
        const updates = req.body;

        const horaire = await Horaire.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).populate('referenceId');
        if (!horaire) {
            return res.status(404).json({ error: "Horaire non trouvé" });
        }

        res.status(200).json({
            id: horaire._id,
            day: horaire.day,
            start_hour: horaire.start_hour,
            end_hour: horaire.end_hour,
            type: horaire.type,
            createdAt: horaire.createdAt,
            updatedAt: horaire.updatedAt
        });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la mise à jour de l'horaire", details: err.message });
    }
};

// Supprimer un horaire
exports.deleteHoraire = async (req, res) => {
    try {
        const horaire = await Horaire.findByIdAndDelete(req.params.id);
        if (!horaire) {
            return res.status(404).json({ error: "Horaire non trouvé" });
        }

        res.status(200).json({ message: "Horaire supprimé avec succès" });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la suppression de l'horaire", details: err.message });
    }
};