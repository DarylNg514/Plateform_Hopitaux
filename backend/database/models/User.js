const mongoose = require('mongoose');

// Schéma pour l'hôpital
const hopitalSchema = new mongoose.Schema({
    identifiant: { type: String, required: true },
    nom_hopital: { type: String, required: true },
    telephone: { type: String, required: true, unique: true },
    date_de_creation: { type: String, required: true },
    adresse: { type: String, required: true },
    codepostal: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: Boolean, default: false },
    role: { type: String, default: 'hopital' }
}, {
    timestamps: true
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
    isVerified: { type: Boolean, default: false },
    role: { type: String, default: 'admin' }
}, {
    timestamps: true
});

const User = mongoose.model("UserAdmin", userSchema);

const patientSchema = new mongoose.Schema({
    identifiant: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
    Hopital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hopital', required: true },
    role: { type: String, default: 'patient' }
}, {
    timestamps: true
});

const Patient = mongoose.model("Patient", patientSchema);

const medecinSchema = new mongoose.Schema({
    identifiant: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    specialty: { type: String, required: true },
    password: { type: String, required: true },
    Hopital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hopital', required: true },
    availability: [{ day: String, hours: String }],
    role: { type: String, default: 'medecin' }
}, {
    timestamps: true
});

const Medecin = mongoose.model("Medecin", medecinSchema);

const infirmierSchema = new mongoose.Schema({
    identifiant: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    specialty: { type: String, required: true },
    availability: [{ day: String, hours: String }],
    password: { type: String, required: true },
    Hopital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hopital', required: true },
    role: { type: String, default: 'infirmier' }
}, {
    timestamps: true
});

const Infirmier = mongoose.model("Infirmier", infirmierSchema);

const personnelSchema = new mongoose.Schema({
    identifiant: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    role: { type: String, required: true, default: 'personnel' },
    password: { type: String, required: true },
    Hopital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hopital', required: true }
}, {
    timestamps: true
});

const Personnel = mongoose.model("Personnel", personnelSchema);

const dossierSchema = new mongoose.Schema({
    Patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    Medecin: { type: mongoose.Schema.Types.ObjectId, ref: 'Medecin', required: true },
    Infirmier: { type: mongoose.Schema.Types.ObjectId, ref: 'Infirmier' },
    disease: { type: String, required: true },
    internal: { type: Boolean, required: true },
    openDate: { type: Date, required: true },
    status: { type: String, required: true },
    Hopital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hopital', required: true }
}, {
    timestamps: true
});

const Dossier = mongoose.model("Dossier", dossierSchema);

const litSchema = new mongoose.Schema({
    bedNumber: { type: String, required: true },
    Patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    Hopital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hopital', required: true },
    isAvailable: { type: Boolean, default: true }
}, {
    timestamps: true
});

const Lit = mongoose.model("Lit", litSchema);

const departmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    Hopital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hopital', required: true }
}, {
    timestamps: true
});

const Department = mongoose.model("Department", departmentSchema);

const consultationSchema = new mongoose.Schema({
    Medecin: { type: mongoose.Schema.Types.ObjectId, ref: 'Medecin', required: true },
    Patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    description: { type: String, required: true },
    Rendezvous: { type: mongoose.Schema.Types.ObjectId, ref: 'Rendezvous' },
    status: { type: String, required: true },
    payment: { type: Boolean, required: true },
    Hopital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hopital', required: true }
}, {
    timestamps: true
});

const Consultation = mongoose.model("Consultation", consultationSchema);

const rendezvousSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    Patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    Medecin: { type: mongoose.Schema.Types.ObjectId, ref: 'Medecin', required: true },
    Hopital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hopital', required: true }
}, {
    timestamps: true
});

const Rendezvous = mongoose.model("Rendezvous", rendezvousSchema);

// Exportation des modèles
module.exports = { Hopital, User, Patient, Medecin, Infirmier, Personnel, Dossier, Lit, Department, Consultation, Rendezvous };
