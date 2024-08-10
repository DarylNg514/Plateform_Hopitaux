const { Lit } = require('../database/models/User');
const validator = require('validator');

// Créer un nouveau lit
exports.createLit = async (req, res) => {
    try {
        const { bedNumber, Patient, department, Hopital, isAvailable } = req.body;

        if (!bedNumber || !department || !Hopital) {
            return res.status(400).send({ error: "Les champs bedNumber, department et Hopital sont obligatoires" });
        }

        const lit = new Lit({ bedNumber, Patient, department, Hopital, isAvailable });
        await lit.save();
        res.status(201).send({ message: 'Lit créé avec succès', lit });
    } catch (err) {
        res.status(500).send({ error: "Échec de la création du lit" });
    }
};

// Lire tous les lits
exports.getAllLits = async (req, res) => {
    try {
        const lits = await Lit.find().populate('Patient').populate('department').populate('Hopital');
        res.status(200).send(lits);
    } catch (err) {
        res.status(500).send({ error: "Erreur lors de la récupération des lits" });
    }
};

// Lire un lit par ID
exports.getLitById = async (req, res) => {
    try {
        const lit = await Lit.findById(req.params.id).populate('Patient').populate('department').populate('Hopital');
        if (!lit) {
            return res.status(404).send({ error: "Lit non trouvé" });
        }
        res.status(200).send(lit);
    } catch (err) {
        res.status(500).send({ error: "Erreur lors de la récupération du lit" });
    }
};

// Mettre à jour un lit
exports.updateLit = async (req, res) => {
    try {
        const updates = req.body;

        const lit = await Lit.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
        if (!lit) {
            return res.status(404).send({ error: "Lit non trouvé" });
        }

        res.status(200).send(lit);
    } catch (err) {
        res.status(500).send({ error: "Erreur lors de la mise à jour du lit" });
    }
};

// Supprimer un lit
exports.deleteLit = async (req, res) => {
    try {
        const lit = await Lit.findByIdAndDelete(req.params.id);
        if (!lit) {
            return res.status(404).send({ error: "Lit non trouvé" });
        }

        res.status(200).send({ message: "Lit supprimé avec succès" });
    } catch (err) {
        res.status(500).send({ error: "Erreur lors de la suppression du lit" });
    }
};
