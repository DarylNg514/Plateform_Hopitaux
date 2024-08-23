const { Lit } = require('../database/models/User');
const validator = require('validator');

// Créer un nouveau lit
exports.createLit = async (req, res) => {
    try {
        const { bedNumber, Patient, department, Hopital, isAvailable } = req.body;

        if (!bedNumber || !department || !Hopital) {
            return res.status(400).json({ error: "Les champs bedNumber, department et Hopital sont obligatoires" });
        }

        const lit = new Lit({ bedNumber, Patient, department, Hopital, isAvailable });
        await lit.save();
        res.status(201).json({ message: 'Lit créé avec succès', lit });
    } catch (err) {
        console.error('Erreur lors de la création du lit :', err);  // Debugging log

        res.status(500).json({ error: "Échec de la création du lit" });
    }
};

exports.getAllLitsByHopitalId = async (req, res) => {
    try {
        const hopitalId = req.params.hopitalId;

        if (!hopitalId) {
            return res.status(400).json({ error: "L'ID de l'hôpital est requis" });
        }

        const lits = await Lit.find({ Hopital: hopitalId }).populate('Hopital').populate('Patient').populate('department');

        const formattedLits = lits.map(lit => ({
            id: lit._id,
            bedNumber: lit.bedNumber,
            Patient: lit.Patient,
            department: lit.department,
            isAvailable: lit.isAvailable,
            Hopital: lit.Hopital,
            createdAt: lit.createdAt,
            updatedAt: lit.updatedAt
        }));

        res.status(200).json(formattedLits || []);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des lits" });
    }
};



// Lire tous les lits
exports.getAllLits = async (req, res) => {
    try {
        const lits = await Lit.find().populate('Patient').populate('department').populate('Hopital');
        const formattedLits = lits.map(lit => ({
            id: lit._id,
            bedNumber: lit.bedNumber,
            Patient: lit.Patient,
            department: lit.department,
            Hopital: lit.Hopital,
            isAvailable: lit.isAvailable,
            createdAt: lit.createdAt,
            updatedAt: lit.updatedAt
        }));
        res.status(200).json(formattedLits);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des lits" });
    }
};

// Lire un lit par ID
exports.getLitById = async (req, res) => {
    try {
        const lit = await Lit.findById(req.params.id).populate('Patient').populate('department').populate('Hopital');
        if (!lit) {
            return res.status(404).json({ error: "Lit non trouvé" });
        }
        res.status(200).json(lit);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération du lit" });
    }
};

// Mettre à jour un lit
exports.updateLit = async (req, res) => {
    try {
        const updates = req.body;

        const lit = await Lit.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
        if (!lit) {
            return res.status(404).json({ error: "Lit non trouvé" });
        }

        res.status(200).json(lit);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la mise à jour du lit" });
    }
};

// Supprimer un lit
exports.deleteLit = async (req, res) => {
    try {
        const lit = await Lit.findByIdAndDelete(req.params.id);
        if (!lit) {
            return res.status(404).json({ error: "Lit non trouvé" });
        }

        res.status(200).json({ message: "Lit supprimé avec succès" });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la suppression du lit" });
    }
};
