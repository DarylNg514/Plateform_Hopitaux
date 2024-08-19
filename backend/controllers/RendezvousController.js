const { Rendezvous } = require('../database/models/User');

// Créer un nouveau rendez-vous
exports.createRendezvous = async (req, res) => {
    try {
        const { date, heures, Patient, Medecin, Hopital } = req.body;

        if (!date || !heures || !Patient || !Medecin || !Hopital) {
            return res.status(400).json({ error: "Les champs date, heures, Patient, Medecin et Hopital sont obligatoires" });
        }

        const rendezvous = new Rendezvous({ date, heures, Patient, Medecin, Hopital });
        await rendezvous.save();
        res.status(201).json({ message: 'Rendez-vous créé avec succès', rendezvous });
    } catch (err) {
        res.status(500).json({ error: "Échec de la création du rendez-vous" });
    }
};


exports.getAllRendezvousByHopitalId = async (req, res) => {
    try {
        const hopitalId = req.params.hopitalId;

        if (!hopitalId) {
            return res.status(400).json({ error: "L'ID de l'hôpital est requis" });
        }

        const rendezvous = await Rendezvous.find({ Hopital: hopitalId })
            .populate('Patient')
            .populate('Medecin')
            .populate('Hopital');

        const formattedRendezvous = rendezvous.map(rdv => ({
            id: rdv._id,
            Medecin: rdv.Medecin,
            Patient: rdv.Patient,
            date: rdv.date,
            heures: rdv.heures,
            Hopital: rdv.Hopital,
            createdAt: rdv.createdAt,
            updatedAt: rdv.updatedAt
        }));

        res.status(200).json(formattedRendezvous || []);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des rendez-vous" });
    }
};



// Lire tous les rendez-vous
exports.getAllRendezvous = async (req, res) => {
    try {
        const rendezvous = await Rendezvous.find().populate('Patient').populate('Medecin').populate('Hopital');
        const formattedRendezvous = rendezvous.map(rv => ({
            id: rv._id,
            date: rv.date,
            heures: rv.heures,
            Patient: rv.Patient,
            Medecin: rv.Medecin,
            Hopital: rv.Hopital,
            createdAt: rv.createdAt,
            updatedAt: rv.updatedAt
        }));
        res.status(200).json(formattedRendezvous);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des rendez-vous" });
    }
};

// Lire un rendez-vous par ID
exports.getRendezvousById = async (req, res) => {
    try {
        const rendezvous = await Rendezvous.findById(req.params.id).populate('Patient').populate('Medecin').populate('Hopital');
        if (!rendezvous) {
            return res.status(404).json({ error: "Rendez-vous non trouvé" });
        }
        res.status(200).json(rendezvous);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération du rendez-vous" });
    }
};

// Mettre à jour un rendez-vous
exports.updateRendezvous = async (req, res) => {
    try {
        const updates = req.body;

        const rendezvous = await Rendezvous.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
        if (!rendezvous) {
            return res.status(404).json({ error: "Rendez-vous non trouvé" });
        }

        res.status(200).json(rendezvous);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la mise à jour du rendez-vous" });
    }
};

// Supprimer un rendez-vous
exports.deleteRendezvous = async (req, res) => {
    try {
        const rendezvous = await Rendezvous.findByIdAndDelete(req.params.id);
        if (!rendezvous) {
            return res.status(404).json({ error: "Rendez-vous non trouvé" });
        }

        res.status(200).json({ message: "Rendez-vous supprimé avec succès" });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la suppression du rendez-vous" });
    }
};

// Obtenir les rendez-vous par médecin
exports.getRendezvousByMedecin = async (req, res) => {
    try {
        const medecinId = req.query.medecin_id;
        if (!medecinId) {
            return res.status(400).json({ error: "L'ID du médecin est requis" });
        }

        const rendezvous = await Rendezvous.find({ Medecin: medecinId }).populate('Patient').populate('Medecin');
        if (!rendezvous) {
            return res.status(404).json({ error: "Aucun rendez-vous trouvé pour ce médecin" });
        }

        res.status(200).json(rendezvous);
    } catch (err) {
        console.error('Erreur lors de la récupération des rendez-vous :', err);  // Debugging log
        res.status(500).json({ error: "Erreur lors de la récupération des rendez-vous" });
    }
};

// Obtenir les rendez-vous par patient
exports.getRendezvousByPatient = async (req, res) => {
    try {
        const patientId = req.query.patient_id;
        if (!patientId) {
            return res.status(400).json({ error: "L'ID du patient est requis" });
        }

        const rendezvous = await Rendezvous.find({ Patient: patientId }).populate('Patient').populate('Medecin');
        if (!rendezvous) {
            return res.status(404).json({ error: "Aucun rendez-vous trouvé pour ce patient" });
        }

        res.status(200).json(rendezvous);
    } catch (err) {
        console.error('Erreur lors de la récupération des rendez-vous :', err);  // Debugging log
        res.status(500).json({ error: "Erreur lors de la récupération des rendez-vous" });
    }
};