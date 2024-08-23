// Créer une nouvelle consultation
const { Consultation, Rendezvous } = require('../database/models/User');

// Créer une nouvelle consultation
exports.createConsultation = async (req, res) => {
    try {
        const { Medecin, Patient, description, Rendezvous: rendezvousId, status, payment, Hopital } = req.body;

        if (!Medecin || !Patient || !description || !status || payment === undefined || !Hopital || !rendezvousId) {
            return res.status(400).json({ error: "Les champs Medecin, Patient, description, status, payment, Hopital et Rendezvous sont obligatoires" });
        }

        const rendezvous = await Rendezvous.findById(rendezvousId);
        if (!rendezvous) {
            return res.status(404).json({ error: "Rendez-vous non trouvé" });
        }

        const consultation = new Consultation({ Medecin, Patient, description, Rendezvous: rendezvousId, status, payment, Hopital });
        await consultation.save();

        const formattedConsultation = {
            id: consultation._id,
            Medecin: consultation.Medecin,
            Patient: consultation.Patient,
            description: consultation.description,
            Rendezvous: consultation.Rendezvous,
            status: consultation.status,
            payment: consultation.payment,
            Hopital: consultation.Hopital,
            createdAt: consultation.createdAt,
            updatedAt: consultation.updatedAt
        };

        res.status(201).json({ message: 'Consultation créée avec succès', consultation: formattedConsultation });
    } catch (err) {
        console.error('Erreur lors de la création de la consultation :', err);  // Debugging log
        res.status(500).json({ error: "Échec de la création de la consultation" });
    }
};

exports.getAllConsultationsByHopitalId = async (req, res) => {
    try {
        const hopitalId = req.params.hopitalId;

        if (!hopitalId) {
            return res.status(400).json({ error: "L'ID de l'hôpital est requis" });
        }

        const consultations = await Consultation.find({ Hopital: hopitalId })
            .populate('Medecin')
            .populate('Patient')
            .populate('Rendezvous')
            .populate('Hopital');

        const formattedConsultations = consultations.map(consultation => ({
            id: consultation._id,
            Medecin: consultation.Medecin,
            Patient: consultation.Patient,
            description: consultation.description,
            Rendezvous: consultation.Rendezvous,
            status: consultation.status,
            payment: consultation.payment,
            Hopital: consultation.Hopital,
            createdAt: consultation.createdAt,
            updatedAt: consultation.updatedAt
        }));

        res.status(200).json(formattedConsultations || []);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des consultations" });
    }
};


// Lire toutes les consultations
exports.getAllConsultations = async (req, res) => {
    try {
        const consultations = await Consultation.find().populate('Medecin').populate('Patient').populate('Rendezvous').populate('Hopital');
        const formattedConsultations = consultations.map(cons => ({
            id: cons._id,
            Medecin: cons.Medecin,
            Patient: cons.Patient,
            description: cons.description,
            Rendezvous: cons.Rendezvous,
            status: cons.status,
            payment: cons.payment,
            Hopital: cons.Hopital,
            createdAt: cons.createdAt,
            updatedAt: cons.updatedAt
        }));
        res.status(200).json(formattedConsultations);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des consultations" });
    }
};

// Lire une consultation par ID
exports.getConsultationById = async (req, res) => {
    try {
        const consultation = await Consultation.findById(req.params.id).populate('Medecin').populate('Patient').populate('Rendezvous').populate('Hopital');
        if (!consultation) {
            return res.status(404).json({ error: "Consultation non trouvée" });
        }
        res.status(200).json(consultation);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération de la consultation" });
    }
};

// Mettre à jour une consultation
// Mettre à jour une consultation
exports.updateConsultation = async (req, res) => {
    try {
        const { Medecin, Patient, description, Rendezvous: rendezvousId, status, payment, Hopital } = req.body;

        if (!Medecin || !Patient || !description || !status || payment === undefined || !Hopital || !rendezvousId) {
            return res.status(400).json({ error: "Les champs Medecin, Patient, description, status, payment, Hopital et Rendezvous sont obligatoires" });
        }

        const rendezvous = await Rendezvous.findById(rendezvousId);
        if (!rendezvous) {
            return res.status(404).json({ error: "Rendez-vous non trouvé" });
        }

        const updates = { Medecin, Patient, description, Rendezvous: rendezvousId, status, payment, Hopital };

        const consultation = await Consultation.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
        if (!consultation) {
            return res.status(404).json({ error: "Consultation non trouvée" });
        }

        const formattedConsultation = {
            id: consultation._id,
            Medecin: consultation.Medecin,
            Patient: consultation.Patient,
            description: consultation.description,
            Rendezvous: consultation.Rendezvous,
            status: consultation.status,
            payment: consultation.payment,
            Hopital: consultation.Hopital,
            createdAt: consultation.createdAt,
            updatedAt: consultation.updatedAt
        };

        res.status(200).json(formattedConsultation);
    } catch (err) {
        console.error('Erreur lors de la mise à jour de la consultation :', err);  // Debugging log
        res.status(500).json({ error: "Erreur lors de la mise à jour de la consultation" });
    }
};


// Supprimer une consultation
exports.deleteConsultation = async (req, res) => {
    try {
        const consultation = await Consultation.findByIdAndDelete(req.params.id);
        if (!consultation) {
            return res.status(404).json({ error: "Consultation non trouvée" });
        }

        res.status(200).json({ message: "Consultation supprimée avec succès" });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la suppression de la consultation" });
    }
};
