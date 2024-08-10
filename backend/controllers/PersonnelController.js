const { Personnel } = require('../database/models/User');
const validator = require('validator');

// Créer un nouveau personnel
exports.createPersonnel = async (req, res) => {
    try {
        const { name, email, phone, address, role, password, Hopital } = req.body;

        if (!name || !email || !phone || !address || !role || !password || !Hopital) {
            return res.status(400).send({ error: "Tous les champs sont obligatoires" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).send({ error: "L'email n'est pas valide" });
        }

        if (!validator.isMobilePhone(phone, 'en-CA')) {
            return res.status(400).send({ error: "Le numéro de téléphone n'est pas valide" });
        }

        const existingPersonnel = await Personnel.findOne({ email });
        if (existingPersonnel) {
            return res.status(400).send({ error: "L'email est déjà utilisé" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Génération de l'identifiant unique pour l'hôpital
        const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
        let identifiant_pers;
        let identifiantExists = true;

        while (identifiantExists) {
            const randomNumber = Math.floor(Math.random() * 10); // Génère un nombre aléatoire entre 0 et 9
            identifiant_pers = `${cleanName}${randomNumber}`;
            identifiantExists = await Medecin.findOne({ identifiant: identifiant_pers });
        }


        const personnel = new Personnel({ name, email, phone, address, role, Hopital, identifiant: identifiant_pers, password: hashedPassword });
        await personnel.save();
        res.status(201).send({ message: 'Personnel créé avec succès', personnel });
    } catch (err) {
        res.status(500).send({ error: "Échec de la création du personnel" });
    }
};

// Lire tous les personnels
exports.getAllPersonnels = async (req, res) => {
    try {
        const personnels = await Personnel.find().populate('Hopital');
        res.status(200).send(personnels);
    } catch (err) {
        res.status(500).send({ error: "Erreur lors de la récupération des personnels" });
    }
};

// Lire un personnel par ID
exports.getPersonnelById = async (req, res) => {
    try {
        const personnel = await Personnel.findById(req.params.id).populate('Hopital');
        if (!personnel) {
            return res.status(404).send({ error: "Personnel non trouvé" });
        }
        res.status(200).send(personnel);
    } catch (err) {
        res.status(500).send({ error: "Erreur lors de la récupération du personnel" });
    }
};

// Mettre à jour un personnel
exports.updatePersonnel = async (req, res) => {
    try {
        const updates = req.body;
        if (updates.email && !validator.isEmail(updates.email)) {
            return res.status(400).send({ error: "L'email n'est pas valide" });
        }

        if (updates.phone && !validator.isMobilePhone(updates.phone, 'en-CA')) {
            return res.status(400).send({ error: "Le numéro de téléphone n'est pas valide" });
        }

        const personnel = await Personnel.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
        if (!personnel) {
            return res.status(404).send({ error: "Personnel non trouvé" });
        }

        res.status(200).send(personnel);
    } catch (err) {
        res.status(500).send({ error: "Erreur lors de la mise à jour du personnel" });
    }
};

// Supprimer un personnel
exports.deletePersonnel = async (req, res) => {
    try {
        const personnel = await Personnel.findByIdAndDelete(req.params.id);
        if (!personnel) {
            return res.status(404).send({ error: "Personnel non trouvé" });
        }

        res.status(200).send({ message: "Personnel supprimé avec succès" });
    } catch (err) {
        res.status(500).send({ error: "Erreur lors de la suppression du personnel" });
    }
};
