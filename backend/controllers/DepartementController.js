const { Department } = require('../database/models/User');

// Créer un nouveau département
exports.createDepartment = async (req, res) => {
    try {
        const { name, Hopital } = req.body;

        if (!name || !Hopital) {
            return res.status(400).send({ error: "Les champs name et Hopital sont obligatoires" });
        }

        const department = new Department({ name, Hopital });
        await department.save();
        res.status(201).send({ message: 'Département créé avec succès', department });
    } catch (err) {
        res.status(500).send({ error: "Échec de la création du département" });
    }
};

// Lire tous les départements
exports.getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.find().populate('Hopital');
        res.status(200).send(departments);
    } catch (err) {
        res.status(500).send({ error: "Erreur lors de la récupération des départements" });
    }
};

// Lire un département par ID
exports.getDepartmentById = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id).populate('Hopital');
        if (!department) {
            return res.status(404).send({ error: "Département non trouvé" });
        }
        res.status(200).send(department);
    } catch (err) {
        res.status(500).send({ error: "Erreur lors de la récupération du département" });
    }
};

// Mettre à jour un département
exports.updateDepartment = async (req, res) => {
    try {
        const updates = req.body;

        const department = await Department.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
        if (!department) {
            return res.status(404).send({ error: "Département non trouvé" });
        }

        res.status(200).send(department);
    } catch (err) {
        res.status(500).send({ error: "Erreur lors de la mise à jour du département" });
    }
};

// Supprimer un département
exports.deleteDepartment = async (req, res) => {
    try {
        const department = await Department.findByIdAndDelete(req.params.id);
        if (!department) {
            return res.status(404).send({ error: "Département non trouvé" });
        }

        res.status(200).send({ message: "Département supprimé avec succès" });
    } catch (err) {
        res.status(500).send({ error: "Erreur lors de la suppression du département" });
    }
};
