const { Hopital, User, Medecin, Infirmier, Personnel, Patient } = require('../database/models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = 'DIICC';
const validator = require('validator');

exports.login = async (req, res) => {
    try {
        const { identifiant, password } = req.body;
        let user;
        let role;

        user = await User.findOne({ identifiant });
        if (user) role = 'admin';

        if (!user) {
            user = await Hopital.findOne({ identifiant });
            if (user) role = 'hopital';
        }

        if (!user) {
            user = await Medecin.findOne({ identifiant });
            if (user) role = 'medecin';
        }

        if (!user) {
            user = await Infirmier.findOne({ identifiant });
            if (user) role = 'infirmier';
        }

        if (!user) {
            user = await Personnel.findOne({ identifiant });
            if (user) role = 'personnel';
        }

        if (!user) {
            user = await Patient.findOne({ identifiant });
            if (user) role = 'patient';
        }

        if (!user) {
            return res.status(400).send({ error: 'Identifiant non trouvé' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).send({ error: 'Mot de passe incorrect' });
        }

        const token = jwt.sign({ id: user._id, role }, SECRET_KEY, { expiresIn: '30d' });
        res.send({ token, user });
    } catch (err) {
        console.log(err)
        res.status(400).send({ error: 'Échec de la connexion' });
    }
};

exports.creer_hopital = async (req, res) => {
    try {
        const { nom_hopital, telephone, date_de_creation, adresse, codepostal, email, password, status } = req.body;

        if (!nom_hopital || !telephone || !date_de_creation || !adresse || !codepostal || !email || !password || status === undefined) {
            return res.status(400).send({ error: "Tous les champs sont obligatoires" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).send({ error: "L'email n'est pas valide" });
        }

        if (!validator.isMobilePhone(telephone, 'en-CA')) {
            return res.status(400).send({ error: "Le numéro de téléphone n'est pas valide" });
        }

        if (!validator.isPostalCode(codepostal, 'CA')) {
            return res.status(400).send({ error: "Le code postal n'est pas valide" });
        }

        const existingHopital = await Hopital.findOne({ $or: [{ email }, { telephone }] });
        if (existingHopital) {
            return res.status(400).send({ error: "L'email ou le numéro de téléphone est déjà utilisé" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const cleanName = nom_hopital.toLowerCase().replace(/[^a-z0-9]/g, '');
        let identifiant_hopital;
        let identifiantExists = true;

        while (identifiantExists) {
            const randomNumber = Math.floor(Math.random() * 10); // Génère un nombre aléatoire entre 0 et 9
            identifiant_hopital = `${cleanName}${randomNumber}`;
            identifiantExists = await Hopital.findOne({ identifiant: identifiant_hopital });
        }

        const hopital = new Hopital({
            nom_hopital,
            identifiant: identifiant_hopital,
            telephone,
            date_de_creation,
            adresse,
            codepostal,
            email,
            password: hashedPassword,
            status
        });

        await hopital.save();
        res.status(201).send({ message: 'Hôpital créé avec succès', hopital: { identifiant: identifiant_hopital, password } });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            error: "Échec de la création de l'hôpital en raison d'une erreur serveur"
        });
    }
};

exports.lister_hopitaux = async (req, res) => {
    try {
        const hopitaux = await Hopital.find();
        res.status(200).send(hopitaux.map(hopital => ({
            id: hopital._id,
            nom_hopital: hopital.nom_hopital,
            telephone: hopital.telephone,
            date_de_creation: hopital.date_de_creation,
            adresse: hopital.adresse,
            codepostal: hopital.codepostal,
            email: hopital.email,
            status: hopital.status
        })));
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Erreur lors de la récupération des hôpitaux" });
    }
};

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

exports.update_hopital = async (req, res) => {
    try {
        const updates = req.body;

        if (updates.email && !validator.isEmail(updates.email)) {
            return res.status(400).json({ error: "L'email n'est pas valide" });
        }

        if (updates.telephone && !validator.isMobilePhone(updates.telephone, 'en-CA')) {
            return res.status(400).json({ error: "Le numéro de téléphone n'est pas valide" });
        }

        if (updates.codepostal && !validator.isPostalCode(updates.codepostal, 'CA')) {
            return res.status(400).json({ error: "Le code postal n'est pas valide" });
        }

        const hopital = await Hopital.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
        if (!hopital) {
            return res.status(404).json({ error: "Hôpital non trouvé" });
        }

        res.status(200).json(hopital);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la mise à jour de l'hôpital" });
    }
};

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

// Create a new user
exports.creer_user = async (req, res) => {
    try {
        const { nom, prenom, telephone, date_de_naissance, adresse, codepostal, email, password, role } = req.body;

        if (!nom || !prenom || !telephone || !date_de_naissance || !adresse || !codepostal || !email || !password || role === undefined) {
            return res.status(400).send({ error: "Tous les champs sont obligatoires" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).send({ error: "L'email n'est pas valide" });
        }

        if (!validator.isMobilePhone(telephone, 'en-CA')) {
            return res.status(400).send({ error: "Le numéro de téléphone n'est pas valide" });
        }

        if (!validator.isPostalCode(codepostal, 'CA')) {
            return res.status(400).send({ error: "Le code postal n'est pas valide" });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { telephone }] });
        if (existingUser) {
            return res.status(400).send({ error: "L'email ou le numéro de téléphone est déjà utilisé" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const cleanName = nom.toLowerCase().replace(/[^a-z0-9]/g, '');
        let identifiant_user;
        let identifiantExists = true;

        while (identifiantExists) {
            const randomNumber = Math.floor(Math.random() * 10); // Génère un nombre aléatoire entre 0 et 9
            identifiant_user = `${cleanName}${randomNumber}`;
            identifiantExists = await User.findOne({ identifiant: identifiant_user });
        }

        const user = new User({
            nom,
            prenom,
            identifiant: identifiant_user,
            telephone,
            date_de_naissance,
            adresse,
            codepostal,
            email,
            password: hashedPassword,
            role
        });

        await user.save();
        res.status(201).send({ message: 'Utilisateur créé avec succès', user: { identifiant: identifiant_user, password } });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            error: "Échec de la création de l'utilisateur en raison d'une erreur serveur"
        });
    }
};

// List all users
exports.lister_users = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send(users.map(user => ({
            id: user._id,
            nom: user.nom,
            prenom: user.prenom,
            telephone: user.telephone,
            date_de_naissance: user.date_de_naissance,
            adresse: user.adresse,
            codepostal: user.codepostal,
            email: user.email,
            role: user.role
        })));
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Erreur lors de la récupération des utilisateurs" });
    }
};

// Get a user by ID
exports.get_user = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send({ error: "Utilisateur non trouvé" });
        }
        res.status(200).send(user);
    } catch (err) {
        res.status(500).send({ error: "Erreur lors de la récupération de l'utilisateur" });
    }
};

// Update a user
exports.update_user = async (req, res) => {
    try {
        const updates = req.body;

        if (updates.email && !validator.isEmail(updates.email)) {
            return res.status(400).json({ error: "L'email n'est pas valide" });
        }

        if (updates.telephone && !validator.isMobilePhone(updates.telephone, 'en-CA')) {
            return res.status(400).json({ error: "Le numéro de téléphone n'est pas valide" });
        }

        if (updates.codepostal && !validator.isPostalCode(updates.codepostal, 'CA')) {
            return res.status(400).json({ error: "Le code postal n'est pas valide" });
        }

        const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }

        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la mise à jour de l'utilisateur" });
    }
};

// Delete a user
exports.delete_user = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send({ error: "Utilisateur non trouvé" });
        }

        res.status(200).send({ message: "Utilisateur supprimé avec succès" });
    } catch (err) {
        res.status(500).send({ error: "Erreur lors de la suppression de l'utilisateur" });
    }
};