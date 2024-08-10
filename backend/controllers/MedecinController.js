const { Medecin } = require('../database/models/User');
const validator = require('validator');
const bcrypt = require('bcrypt');

// Créer un nouveau médecin
exports.createMedecin = async (req, res) => {
    try {
        const { name, email, phone, address, specialty, password, Hopital, availability } = req.body;

        if (!name || !email || !phone || !address || !specialty || !password || !Hopital) {
            return res.status(400).json({ error: "Tous les champs sont obligatoires" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: "L'email n'est pas valide" });
        }

        if (!validator.isMobilePhone(phone, 'en-CA')) {
            return res.status(400).json({ error: "Le numéro de téléphone n'est pas valide" });
        }

        const existingMedecin = await Medecin.findOne({ email });
        if (existingMedecin) {
            return res.status(400).json({ error: "L'email est déjà utilisé" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Génération de l'identifiant unique pour l'hôpital
        const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
        let identifiant_med;
        let identifiantExists = true;

        while (identifiantExists) {
            const randomNumber = Math.floor(Math.random() * 10); // Génère un nombre aléatoire entre 0 et 9
            identifiant_med = `${cleanName}${randomNumber}`;
            identifiantExists = await Medecin.findOne({ identifiant: identifiant_med });
        }

        const medecin = new Medecin({ name, email, phone, address, specialty, Hopital, availability, identifiant: identifiant_med, password: hashedPassword });
        await medecin.save();
        res.status(201).json({ message: 'Médecin créé avec succès', medecin: { identifiant: identifiant_med, password } });
    } catch (err) {
        res.status(500).json({ error: "Échec de la création du médecin" });
    }
};

// Lire tous les médecins
exports.getAllMedecins = async (req, res) => {
    try {
        const medecins = await Medecin.find().populate('Hopital');
        // Convert _id to id
        const formattedMedecins = medecins.map(medecin => {
            return {
                id: medecin._id,
                name: medecin.name,
                email: medecin.email,
                phone: medecin.phone,
                address: medecin.address,
                specialty: medecin.specialty,
                availability: medecin.availability,
                Hopital: medecin.Hopital,
                role: medecin.role,
                createdAt: medecin.createdAt,
                updatedAt: medecin.updatedAt
            };
        });
        res.status(200).json(formattedMedecins);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des médecins" });
    }
};

// Lire un médecin par ID
exports.getMedecinById = async (req, res) => {
    try {
        const medecin = await Medecin.findById(req.params.id).populate('Hopital');
        if (!medecin) {
            return res.status(404).json({ error: "Médecin non trouvé" });
        }
        res.status(200).json(medecin);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération du médecin" });
    }
};

// Mettre à jour un médecin
exports.updateMedecin = async (req, res) => {
    try {
        const updates = req.body;
        if (updates.email && !validator.isEmail(updates.email)) {
            return res.status(400).json({ error: "L'email n'est pas valide" });
        }

        if (updates.phone && !validator.isMobilePhone(updates.phone, 'en-CA')) {
            return res.status(400).json({ error: "Le numéro de téléphone n'est pas valide" });
        }

        const medecin = await Medecin.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
        if (!medecin) {
            return res.status(404).json({ error: "Médecin non trouvé" });
        }

        res.status(200).json(medecin);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la mise à jour du médecin" });
    }
};

// Supprimer un médecin
exports.deleteMedecin = async (req, res) => {
    try {
        const medecin = await Medecin.findByIdAndDelete(req.params.id);
        if (!medecin) {
            return res.status(404).json({ error: "Médecin non trouvé" });
        }

        res.status(200).json({ message: "Médecin supprimé avec succès" });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la suppression du médecin" });
    }
};
