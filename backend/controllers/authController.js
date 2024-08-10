const { Hopital, User } = require('../database/models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = '52e4d52f23d204d418ad64c33c095051b2430322a2a47d8b378aede350661a21bf0c3c33991a998ff5314bc053d3ce66';
const validator = require('validator'); // Pour valider l'email et d'autres champs

exports.login = async (req, res) => {
    try {
        const { identifiant, password, type } = req.body;
        let user;

        if (type === 'admin') {
            user = await User.findOne({ identifiant });
        } else if (type === 'hopital') {
            user = await Hopital.findOne({ identifiant });
        } else {
            return res.status(400).send({ error: 'Type de connexion non valide' });
        }

        if (!user) {
            return res.status(400).send({ error: 'Identifiant non trouvé' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).send({ error: 'Mot de passe incorrect' });
        }

        const token = jwt.sign({ id: user._id, type }, SECRET_KEY, { expiresIn: '30d' });
        res.send({ token, user });
    } catch (err) {
        res.status(400).send({ error: 'Échec de la connexion' });
    }
};

exports.creer_hopital = async (req, res) => {
    try {
        const { nom_hopital, telephone, date_de_creation, adresse, codepostal, email, password } = req.body;

        // Validation des champs
        if (!nom_hopital || !telephone || !date_de_creation || !adresse || !codepostal || !email || !password) {
            return res.status(400).send({ error: "Tous les champs sont obligatoires" });
        }

        // Validation de l'email
        if (!validator.isEmail(email)) {
            return res.status(400).send({ error: "L'email n'est pas valide" });
        }

        // Validation du téléphone (exemple pour un téléphone canadien)
        if (!validator.isMobilePhone(telephone, 'en-CA')) {
            return res.status(400).send({ error: "Le numéro de téléphone n'est pas valide" });
        }

        // Validation du code postal canadien
        if (!validator.isPostalCode(codepostal, 'CA')) {
            return res.status(400).send({ error: "Le code postal n'est pas valide" });
        }

        // Vérification des doublons d'email et de nom de l'hôpital
        const existingHopital = await Hopital.findOne({ $or: [{ email }, { telephone }] });
        if (existingHopital) {
            return res.status(400).send({ error: "L'email ou le numéro de téléphone est déjà utilisé" });
        }

        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Génération de l'identifiant unique pour l'hôpital
        const cleanName = nom_hopital.toLowerCase().replace(/[^a-z0-9]/g, '');
        let identifiant_hopital;
        let identifiantExists = true;

        while (identifiantExists) {
            const randomNumber = Math.floor(Math.random() * 10); // Génère un nombre aléatoire entre 0 et 9
            identifiant_hopital = `${cleanName}${randomNumber}`;
            identifiantExists = await Hopital.findOne({ identifiant: identifiant_hopital });
        }

        // Création de l'hôpital
        const hopital = new Hopital({
            nom_hopital,
            identifiant: identifiant_hopital,
            telephone,
            date_de_creation,
            adresse,
            codepostal,
            email,
            password: hashedPassword
        });

        await hopital.save();
        res.status(201).send({ message: 'Hôpital créé avec succès', hopital });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            error: "Échec de la création de l'hôpital en raison d'une erreur serveur"
        });
    }
};

// Fonction de récupération de tous les hôpitaux
exports.lister_hopitaux = async (req, res) => {
    try {
        const hopitaux = await Hopital.find();
        console.log('Je suis dans la fonction hopitaux: ', hopitaux)
        res.status(200).send(hopitaux);
    } catch (err) {
        res.status(500).send({ error: "Erreur lors de la récupération des hôpitaux" });
    }
};

// Fonction de récupération d'un hôpital par son ID
exports.get_hopital = async (req, res) => {
    try {
        const hopital = await Hopital.findById(req.params.id);
        if (!hopital) {
            return res.status(404).send({ error: "Hôpital non trouvé" });
        }
        res.status(200).send(hopital);
    } catch (err) {
        res.status(500).send({ error: "Erreur lors de la récupération de l'hôpital" });
    }
};

// Fonction de mise à jour d'un hôpital
exports.update_hopital = async (req, res) => {
    try {
        const updates = req.body;
        if (updates.email && !validator.isEmail(updates.email)) {
            return res.status(400).send({ error: "L'email n'est pas valide" });
        }

        if (updates.telephone && !validator.isMobilePhone(updates.telephone, 'en-CA')) {
            return res.status(400).send({ error: "Le numéro de téléphone n'est pas valide" });
        }

        if (updates.codepostal && !validator.isPostalCode(updates.codepostal, 'CA')) {
            return res.status(400).send({ error: "Le code postal n'est pas valide" });
        }

        const hopital = await Hopital.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
        if (!hopital) {
            return res.status(404).send({ error: "Hôpital non trouvé" });
        }

        res.status(200).send(hopital);
    } catch (err) {
        res.status(500).send({ error: "Erreur lors de la mise à jour de l'hôpital" });
    }
};

// Fonction de suppression d'un hôpital
exports.delete_hopital = async (req, res) => {
    try {
        const hopital = await Hopital.findByIdAndDelete(req.params.id);
        if (!hopital) {
            return res.status(404).send({ error: "Hôpital non trouvé" });
        }

        res.status(200).send({ message: "Hôpital supprimé avec succès" });
    } catch (err) {
        res.status(500).send({ error: "Erreur lors de la suppression de l'hôpital" });
    }
};