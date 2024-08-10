const { Infirmier } = require('../database/models/User');
const validator = require('validator');
const bcrypt = require('bcrypt');

// Créer un nouvel infirmier
exports.createInfirmier = async (req, res) => {
    try {
        const { name, email, phone, address, specialty, password, Hopital } = req.body;

        if (!name || !email || !phone || !address || !specialty || !password || !Hopital) {
            return res.status(400).json({ error: "Tous les champs sont obligatoires" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: "L'email n'est pas valide" });
        }

        if (!validator.isMobilePhone(phone, 'en-CA')) {
            return res.status(400).json({ error: "Le numéro de téléphone n'est pas valide" });
        }

        const existingInfirmier = await Infirmier.findOne({ email });
        if (existingInfirmier) {
            return res.status(400).json({ error: "L'email est déjà utilisé" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Génération de l'identifiant unique pour l'hôpital
        const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
        let identifiant_infir;
        let identifiantExists = true;

        while (identifiantExists) {
            const randomNumber = Math.floor(Math.random() * 10); // Génère un nombre aléatoire entre 0 et 9
            identifiant_infir = `${cleanName}${randomNumber}`;
            identifiantExists = await Infirmier.findOne({ identifiant: identifiant_infir });
        }

        const infirmier = new Infirmier({ name, email, phone, address, specialty, Hopital, identifiant: identifiant_infir, password: hashedPassword });
        await infirmier.save();
        res.status(201).json({ message: 'Infirmier créé avec succès', infirmier: { identifiant: identifiant_infir, password } });
    } catch (err) {
        res.status(500).json({ error: "Échec de la création de l'infirmier" });
    }
};

// Lire tous les infirmiers
exports.getAllInfirmiers = async (req, res) => {
    try {
        const infirmiers = await Infirmier.find().populate('Hopital');
        // Convert _id to id
        const formattedInfirmiers = infirmiers.map(infirmier => {
            return {
                id: infirmier._id,
                name: infirmier.name,
                email: infirmier.email,
                phone: infirmier.phone,
                address: infirmier.address,
                specialty: infirmier.specialty,
                Hopital: infirmier.Hopital,
                role: infirmier.role,
                createdAt: infirmier.createdAt,
                updatedAt: infirmier.updatedAt
            };
        });
        res.status(200).json(formattedInfirmiers);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des infirmiers" });
    }
};

// Lire un infirmier par ID
exports.getInfirmierById = async (req, res) => {
    try {
        const infirmier = await Infirmier.findById(req.params.id).populate('Hopital');
        if (!infirmier) {
            return res.status(404).json({ error: "Infirmier non trouvé" });
        }
        res.status(200).json(infirmier);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération de l'infirmier" });
    }
};

// Mettre à jour un infirmier
exports.updateInfirmier = async (req, res) => {
    try {
        const updates = req.body;
        if (updates.email && !validator.isEmail(updates.email)) {
            return res.status(400).json({ error: "L'email n'est pas valide" });
        }

        if (updates.phone && !validator.isMobilePhone(updates.phone, 'en-CA')) {
            return res.status(400).json({ error: "Le numéro de téléphone n'est pas valide" });
        }

        const infirmier = await Infirmier.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
        if (!infirmier) {
            return res.status(404).json({ error: "Infirmier non trouvé" });
        }

        res.status(200).json(infirmier);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la mise à jour de l'infirmier" });
    }
};

// Supprimer un infirmier
exports.deleteInfirmier = async (req, res) => {
    try {
        const infirmier = await Infirmier.findByIdAndDelete(req.params.id);
        if (!infirmier) {
            return res.status(404).json({ error: "Infirmier non trouvé" });
        }

        res.status(200).json({ message: "Infirmier supprimé avec succès" });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la suppression de l'infirmier" });
    }
};
