const { Consultation } = require('../database/models/User');

// Créer une nouvelle consultation
exports.createConsultation = async (req, res) => {
    try {
        const { Medecin, Patient, description, Rendezvous, status, payment, Hopital } = req.body;

        if (!Medecin || !Patient || !description || !status || payment === undefined || !Hopital) {
            return res.status(400).send({ error: "Les champs Medecin, Patient, description, status, payment et Hopital sont obligatoires" });
        }

        const consultation = new Consultation({ Medecin, Patient, description, Rendezvous, status, payment, Hopital });
        await consultation.save();
        res.status(201).send({ message: 'Consultation créée avec succès', consultation });
    } catch (err) {
        res.status(500).send({ error: "Échec de la création de la consultation" });
    }
};

// Lire toutes les consultations
exports.getAllConsultations = async (req, res) => {
    try {
        const consultations = await Consultation.find().populate('Medecin').populate('Patient').populate('Rendezvous').populate('Hopital');
        res.status(200).send(consultations);
    } catch (err) {
        res.status(500).send({ error: "Erreur lors de la récupération des consultations" });
    }
};

// Lire une consultation par ID
exports.getConsultationById = async (req, res) => {
    try {
        const consultation = await Consultation.findById(req.params.id).populate('Medecin').populate('Patient').populate('Rendezvous').populate('Hopital');
        if (!consultation) {
            return res.status(404).send({ error: "Consultation non trouvée" });
        }
        res.status(200).send(consultation);
    } catch (err) {
        res.status(500).send({ error: "Erreur lors de la récupération de la consultation" });
    }
};

// Mettre à jour une consultation
exports.updateConsultation = async (req, res) => {
    try {
        const updates = req.body;

        const consultation = await Consultation.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
        if (!consultation) {
            return res.status(404).send({ error: "Consultation non trouvée" });
        }

        res.status(200).send(consultation);
    } catch (err) {
        res.status(500).send({ error: "Erreur lors de la mise à jour de la consultation" });
    }
};

// Supprimer une consultation
exports.deleteConsultation = async (req, res) => {
    try {
        const consultation = await Consultation.findByIdAndDelete(req.params.id);
        if (!consultation) {
            return res.status(404).send({ error: "Consultation non trouvée" });
        }

        res.status(200).send({ message: "Consultation supprimée avec succès" });
    } catch (err) {
        res.status(500).send({ error: "Erreur lors de la suppression de la consultation" });
    }
};
