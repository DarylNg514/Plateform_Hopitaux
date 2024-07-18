const User = require('../database/models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = '52e4d52f23d204d418ad64c33c095051b2430322a2a47d8b378aede350661a21bf0c3c33991a998ff5314bc053d3ce66';
const validator = require('validator'); // Pour valider l'email et d'autres champs

exports.creer_hopital = async (req, res) => {
    try {
        const { nom_hopital, telephone, date_de_creation, adresse, codepostal, email, password, status } = req.body;

        // Validation des champs
        if (!nom_hopital || !telephone || !date_de_creation || !adresse || !codepostal || !email || !password || !status) {
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
        const existingUser = await User.findOne({ $or: [{ email }, { nom_hopital }] });
        if (existingUser) {
            return res.status(400).send({ error: "L'email ou le nom de l'hôpital est déjà utilisé" });
        }

        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Création de l'utilisateur
        const user = new User({
            nom_hopital,
            telephone,
            date_de_creation,
            adresse,
            codepostal,
            email,
            password: hashedPassword,
            status,
        });

        await user.save();
        res.status(201).send({ message: 'Utilisateur créé avec succès' });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            error: "Échec de la création de l'utilisateur en raison d'une erreur serveur"
        });
    }
};

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ identifiant: req.body.identifiant });
        if (!user) {
            return res.status(400).send({ error: 'Utilisateur non trouvé' });
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).send({ error: 'Mot de passe incorrect' });
        }

        const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '30d' });
        res.send({
            token, user
        });
    } catch (err) {
        res.status(400).send({ error: 'Échec de la connexion' });
    }
};