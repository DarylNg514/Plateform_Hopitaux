const { Patient } = require('../database/models/User');
const validator = require('validator');
const bcrypt = require('bcrypt');  // Assurez-vous que bcrypt est bien importé

// Créer un nouveau patient
exports.createPatient = async (req, res) => {
    try {
        const { name, email, phone, address, password, Hopital } = req.body;

        if (!name || !email || !phone || !address || !password || !Hopital) {
            return res.status(400).json({ error: "Tous les champs sont obligatoires" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: "L'email n'est pas valide" });
        }

        if (!validator.isMobilePhone(phone, 'en-CA')) {
            return res.status(400).json({ error: "Le numéro de téléphone n'est pas valide" });
        }

        const existingPatient = await Patient.findOne({ email });
        if (existingPatient) {
            return res.status(400).json({ error: "L'email est déjà utilisé" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Génération de l'identifiant unique pour l'hôpital
        const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
        let identifiant_pat;
        let identifiantExists = true;

        while (identifiantExists) {
            const randomNumber = Math.floor(Math.random() * 10); // Génère un nombre aléatoire entre 0 et 9
            identifiant_pat = `${cleanName}${randomNumber}`;
            identifiantExists = await Patient.findOne({ identifiant: identifiant_pat });  // Corrigé pour vérifier les patients
        }

        const patient = new Patient({ name, email, phone, address, Hopital, identifiant: identifiant_pat, password: hashedPassword });
        await patient.save();
        res.status(201).json({ message: 'Patient créé avec succès', patient: { identifiant: identifiant_pat, password } });
    } catch (err) {
        res.status(500).json({ error: "Échec de la création du patient" });
    }
};

// Lire tous les patients
exports.getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.find().populate('Hopital');
        // Convert _id to id
        const formattedPatients = patients.map(patient => {
            return {
                id: patient._id,
                name: patient.name,
                email: patient.email,
                phone: patient.phone,
                address: patient.address,
                password: patient.password,
                Hopital: patient.Hopital,
                role: patient.role,
                createdAt: patient.createdAt,
                updatedAt: patient.updatedAt
            };
        });
        res.status(200).json(formattedPatients);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des patients" });
    }
};


// Lire un patient par ID
exports.getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id).populate('Hopital');
        if (!patient) {
            return res.status(404).json({ error: "Patient non trouvé" });
        }
        res.status(200).json(patient);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération du patient" });
    }
};

// Mettre à jour un patient
exports.updatePatient = async (req, res) => {
    try {
        const updates = req.body;
        if (updates.email && !validator.isEmail(updates.email)) {
            return res.status(400).json({ error: "L'email n'est pas valide" });
        }

        if (updates.phone && !validator.isMobilePhone(updates.phone, 'en-CA')) {
            return res.status(400).json({ error: "Le numéro de téléphone n'est pas valide" });
        }

        const patient = await Patient.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
        if (!patient) {
            return res.status(404).json({ error: "Patient non trouvé" });
        }

        res.status(200).json(patient);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la mise à jour du patient" });
    }
};

// Supprimer un patient
exports.deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);
        if (!patient) {
            return res.status(404).json({ error: "Patient non trouvé" });
        }

        res.status(200).json({ message: "Patient supprimé avec succès" });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la suppression du patient" });
    }
};
