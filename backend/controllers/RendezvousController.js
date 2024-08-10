const { Rendezvous } = require('../database/models/User');

// Créer un nouveau rendez-vous
exports.createRendezvous = async (req, res) => {
    try {
        const { date, Patient, Medecin, Hopital } = req.body;

        if (!date || !Patient || !Medecin || !Hopital) {
            return res.status(400).send({ error: "Les champs date, Patient, Medecin et Hopital sont obligatoires" });
        }

        const rendezvous = new Rendezvous({ date, Patient, Medecin, Hopital });
        await rendezvous.save();
        res.status(201).send({ message: 'Rendez-vous créé avec succès', rendezvous });
    } catch (err) {
        res.status(500).send({ error: "Échec de la création du rendez-vous" });
    }
};

// Lire tous les rendez-vous
exports.getAllRendezvous = async (req, res) => {
    try {
        const rendezvous = await Rendezvous.find().populate('Patient').populate('Medecin').populate('Hopital');
        res.status(200).send(rendezvous);
    } catch (err) {
        res.status(500).send({ error: "Erreur lors de la récupération des rendez-vous" });
    }
};

// Lire un rendez-vous par ID
exports.getRendezvousById = async (req, res) => {
    try {
        const rendezvous = await Rendezvous.findById(req.params.id).populate('Patient').populate('Medecin').populate('Hopital');
        if (!rendezvous) {
            return res.status(404).send({ error: "Rendez-vous non trouvé" });
        }
        res.status(200).send(rendezvous);
    } catch (err) {
        res.status(500).send({ error: "Erreur lors de la récupération du rendez-vous" });
    }
};

// Mettre à jour un rendez-vous
exports.updateRendezvous = async (req, res) => {
    try {
        const updates = req.body;

        const rendezvous = await Rendezvous.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
        if (!rendezvous) {
            return res.status(404).send({ error: "Rendez-vous non trouvé" });
        }

        res.status(200).send(rendezvous);
    } catch (err) {
        res.status(500).send({ error: "Erreur lors de la mise à jour du rendez-vous" });
    }
};

// Supprimer un rendez-vous
exports.deleteRendezvous = async (req, res) => {
    try {
        const rendezvous = await Rendezvous.findByIdAndDelete(req.params.id);
        if (!rendezvous) {
            return res.status(404).send({ error: "Rendez-vous non trouvé" });
        }

        res.status(200).send({ message: "Rendez-vous supprimé avec succès" });
    } catch (err) {
        res.status(500).send({ error: "Erreur lors de la suppression du rendez-vous" });
    }
};
