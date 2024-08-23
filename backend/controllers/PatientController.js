const { Patient, Consultation, Dossier, Rendezvous, Hopital } = require('../database/models/User');
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


// Lire tous les patients d'un hôpital par ID d'hôpital
exports.getAllPatientsByHopitalId = async (req, res) => {
    try {
        const hopitalId = req.params.hopitalId;

        if (!hopitalId) {
            return res.status(400).json({ error: "L'ID de l'hôpital est requis" });
        }

        const patients = await Patient.find({ Hopital: hopitalId }).populate('Hopital');

        const formattedPatients = patients.map(patient => ({
            id: patient._id,
            name: patient.name,
            email: patient.email,
            phone: patient.phone,
            address: patient.address,
            Hopital: patient.Hopital,
            role: patient.role,
            createdAt: patient.createdAt,
            updatedAt: patient.updatedAt
        }));

        res.status(200).json(formattedPatients || []);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des patients" });
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

// Lire les consultations d'un patient par ID
exports.getConsultationByPatient = async (req, res) => {
    try {
        const patientId = req.params.id;
        const consultations = await Consultation.find({ Patient: patientId }).populate('Medecin').populate('Rendezvous').populate('Hopital');

        if (!consultations) {
            return res.status(404).json({ error: "Aucune consultation trouvée pour ce patient" });
        }

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

        res.status(200).json(formattedConsultations);
    } catch (err) {
        console.error('Erreur lors de la récupération des consultations :', err);  // Debugging log
        res.status(500).json({ error: "Erreur lors de la récupération des consultations" });
    }
};

// Lire les dossiers d'un patient par ID
exports.getDossierByPatient = async (req, res) => {
    try {
        const patientId = req.params.id;
        const dossiers = await Dossier.find({ Patient: patientId }).populate('Medecin').populate('Infirmier').populate('Hopital');

        if (!dossiers) {
            return res.status(404).json({ error: "Aucun dossier trouvé pour ce patient" });
        }

        const formattedDossiers = dossiers.map(dossier => ({
            id: dossier._id,
            Patient: dossier.Patient,
            Medecin: dossier.Medecin,
            Infirmier: dossier.Infirmier,
            disease: dossier.disease,
            internal: dossier.internal,
            openDate: dossier.openDate,
            status: dossier.status,
            Hopital: dossier.Hopital,
            createdAt: dossier.createdAt,
            updatedAt: dossier.updatedAt
        }));

        res.status(200).json(formattedDossiers);
    } catch (err) {
        console.error('Erreur lors de la récupération des dossiers :', err);  // Debugging log
        res.status(500).json({ error: "Erreur lors de la récupération des dossiers" });
    }
};

// Lire les rendez-vous d'un patient par ID
exports.getRendezvousByPatient = async (req, res) => {
    try {
        const patientId = req.params.id;
        const rendezvous = await Rendezvous.find({ Patient: patientId }).populate('Patient').populate('Medecin');

        if (!rendezvous) {
            return res.status(404).json({ error: "Aucun rendez-vous trouvé pour ce patient" });
        }

        const formattedRendezvous = rendezvous.map(rdv => ({
            id: rdv._id,
            Medecin: rdv.Medecin,
            Patient: rdv.Patient,
            date: rdv.date,
            heures: rdv.heures,
            description: rdv.description,
            createdAt: rdv.createdAt,
            updatedAt: rdv.updatedAt
        }));

        res.status(200).json(formattedRendezvous);
    } catch (err) {
        console.error('Erreur lors de la récupération des rendez-vous :', err);  // Debugging log
        res.status(500).json({ error: "Erreur lors de la récupération des rendez-vous" });
    }
};

// Déplacer un patient vers un nouvel hôpital
exports.deplacerPatient = async (req, res) => {
    try {
        const { patientId, newHopitalId } = req.body;

        if (!patientId || !newHopitalId) {
            return res.status(400).json({ error: "Les champs patientId et newHopitalId sont obligatoires" });
        }

        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ error: "Patient non trouvé" });
        }

        patient.Hopital = newHopitalId;
        await patient.save();

        res.status(200).json({ message: "Patient déplacé avec succès" });
    } catch (err) {
        console.error('Erreur lors du déplacement du patient :', err);
        res.status(500).json({ error: "Erreur lors du déplacement du patient" });
    }
};