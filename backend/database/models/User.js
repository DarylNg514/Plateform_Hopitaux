const mongoose = require('mongoose');

// Schéma pour l'hôpital
const hopitalSchema = new mongoose.Schema({
    identifiant: { type: String, required: true },
    nom_hopital: { type: String, required: true },
    telephone: { type: String, required: true, unique: true },
    date_de_creation: { type: Date, required: true },
    adresse: { type: String, required: true },
    codepostal: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: Boolean, default: false }
});

// Modèle pour l'hôpital
const Hopital = mongoose.model("Hopital", hopitalSchema);

// Schéma pour l'utilisateur
const userSchema = new mongoose.Schema({
    identifiant: { type: String, required: true },
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    telephone: { type: String, required: true, unique: true },
    date_de_naissance: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false }
});

// Modèle pour l'utilisateur
const User = mongoose.model("UserAdmin", userSchema);

// Exportation des modèles
module.exports = { Hopital, User };
