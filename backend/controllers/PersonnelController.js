const { Personnel } = require('../database/models/User');
const validator = require('validator');
const bcrypt = require('bcrypt');

// Créer un nouveau personnel
exports.createPersonnel = async (req, res) => {
    try {
        const { name, email, phone, address, availability, poste, password, Hopital } = req.body;

        if (!name || !email || !phone || !address || !password || !availability || !poste || !Hopital) {
            return res.status(400).json({ error: "Tous les champs sont obligatoires" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: "L'email n'est pas valide" });
        }

        if (!validator.isMobilePhone(phone, 'en-CA')) {
            return res.status(400).json({ error: "Le numéro de téléphone n'est pas valide" });
        }

        const existingPersonnel = await Personnel.findOne({ email });
        if (existingPersonnel) {
            return res.status(400).json({ error: "L'email est déjà utilisé" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Génération de l'identifiant unique pour l'hôpital
        const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
        let identifiant_pers;
        let identifiantExists = true;

        while (identifiantExists) {
            const randomNumber = Math.floor(Math.random() * 10); // Génère un nombre aléatoire entre 0 et 9
            identifiant_pers = `${cleanName}${randomNumber}`;
            identifiantExists = await Personnel.findOne({ identifiant: identifiant_pers });
        }

        const personnel = new Personnel({ name, email, phone, address, poste, availability, Hopital, identifiant: identifiant_pers, password: hashedPassword });
        await personnel.save();
        res.status(201).json({ message: 'Personnel créé avec succès', personnel: { id: personnel._id, identifiant: identifiant_pers, password } });
    } catch (err) {
        console.error('Erreur lors de la création du personnel :', err);  // Debugging log
        res.status(500).json({ error: "Échec de la création du personnel" });
    }
};

// Lire tous les personnels
exports.getAllPersonnels = async (req, res) => {
    try {
        const personnels = await Personnel.find().populate('Hopital');
        const formattedPersonnels = personnels.map(personnel => ({
            id: personnel._id,
            name: personnel.name,
            email: personnel.email,
            phone: personnel.phone,
            address: personnel.address,
            availability: personnel.availability,
            poste: personnel.poste,
            role: personnel.role,
            Hopital: personnel.Hopital,
            createdAt: personnel.createdAt,
            updatedAt: personnel.updatedAt
        }));
        res.status(200).json(formattedPersonnels);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des personnels" });
    }
};

exports.getAllPersonnelsByHopitalId = async (req, res) => {
    try {
        const hopitalId = req.params.hopitalId;

        if (!hopitalId) {
            return res.status(400).json({ error: "L'ID de l'hôpital est requis" });
        }

        const personnels = await Personnel.find({ Hopital: hopitalId }).populate('Hopital');

        const formattedPersonnels = personnels.map(personnel => ({
            id: personnel._id,
            name: personnel.name,
            email: personnel.email,
            phone: personnel.phone,
            address: personnel.address,
            poste: personnel.poste,
            availability: personnel.availability,
            Hopital: personnel.Hopital,
            role: personnel.role,
            createdAt: personnel.createdAt,
            updatedAt: personnel.updatedAt
        }));

        res.status(200).json(formattedPersonnels || []);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération du personnel" });
    }
};



// Lire un personnel par ID
exports.getPersonnelById = async (req, res) => {
    try {
        const personnel = await Personnel.findById(req.params.id).populate('Hopital');
        if (!personnel) {
            return res.status(404).json({ error: "Personnel non trouvé" });
        }
        res.status(200).json({
            id: personnel._id,
            name: personnel.name,
            email: personnel.email,
            phone: personnel.phone,
            address: personnel.address,
            role: personnel.role,
            availability: personnel.availability,
            poste: personnel.poste,
            Hopital: personnel.Hopital,
            createdAt: personnel.createdAt,
            updatedAt: personnel.updatedAt
        });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération du personnel" });
    }
};

// Mettre à jour un personnel
exports.updatePersonnel = async (req, res) => {
    try {
        const updates = req.body;
        if (updates.email && !validator.isEmail(updates.email)) {
            return res.status(400).json({ error: "L'email n'est pas valide" });
        }

        if (updates.phone && !validator.isMobilePhone(updates.phone, 'en-CA')) {
            return res.status(400).json({ error: "Le numéro de téléphone n'est pas valide" });
        }

        const personnel = await Personnel.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
        if (!personnel) {
            return res.status(404).json({ error: "Personnel non trouvé" });
        }

        res.status(200).json({
            id: personnel._id,
            name: personnel.name,
            email: personnel.email,
            phone: personnel.phone,
            address: personnel.address,
            availability: personnel.availability,
            poste: personnel.poste,
            Hopital: personnel.Hopital,
            createdAt: personnel.createdAt,
            updatedAt: personnel.updatedAt
        });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la mise à jour du personnel" });
    }
};

// Supprimer un personnel
exports.deletePersonnel = async (req, res) => {
    try {
        const personnel = await Personnel.findByIdAndDelete(req.params.id);
        if (!personnel) {
            return res.status(404).json({ error: "Personnel non trouvé" });
        }

        res.status(200).json({ message: "Personnel supprimé avec succès" });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la suppression du personnel" });
    }
};
