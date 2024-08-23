const { Department } = require('../database/models/User');

// Créer un nouveau département
exports.createDepartment = async (req, res) => {
    try {
        const { name, Hopital } = req.body;

        if (!name || !Hopital) {
            return res.status(400).json({ error: "Les champs name et Hopital sont obligatoires" });
        }

        const department = new Department({ name, Hopital });
        await department.save();
        res.status(201).json({ message: 'Département créé avec succès', department });
    } catch (err) {
        res.status(500).json({ error: "Échec de la création du département" });
    }
};

// Lire tous les départements
exports.getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.find().populate('Hopital');
        const formattedDepartments = departments.map(dept => ({
            id: dept._id,
            name: dept.name,
            Hopital: dept.Hopital,
            createdAt: dept.createdAt,
            updatedAt: dept.updatedAt
        }));
        res.status(200).json(formattedDepartments);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des départements" });
    }
};


exports.getAllDepartmentsByHopitalId = async (req, res) => {
    try {
        const hopitalId = req.params.hopitalId;

        if (!hopitalId) {
            return res.status(400).json({ error: "L'ID de l'hôpital est requis" });
        }

        const departments = await Department.find({ Hopital: hopitalId }).populate('Hopital');

        const formattedDepartments = departments.map(department => ({
            id: department._id,
            name: department.name,
            Hopital: department.Hopital,
            createdAt: department.createdAt,
            updatedAt: department.updatedAt
        }));

        res.status(200).json(formattedDepartments || []);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des départements" });
    }
};



// Lire un département par ID
exports.getDepartmentById = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id).populate('Hopital');
        if (!department) {
            return res.status(404).json({ error: "Département non trouvé" });
        }
        res.status(200).json(department);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération du département" });
    }
};

// Mettre à jour un département
exports.updateDepartment = async (req, res) => {
    try {
        const updates = req.body;

        const department = await Department.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
        if (!department) {
            return res.status(404).json({ error: "Département non trouvé" });
        }

        res.status(200).json(department);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la mise à jour du département" });
    }
};

// Supprimer un département
exports.deleteDepartment = async (req, res) => {
    try {
        const department = await Department.findByIdAndDelete(req.params.id);
        if (!department) {
            return res.status(404).json({ error: "Département non trouvé" });
        }

        res.status(200).json({ message: "Département supprimé avec succès" });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la suppression du département" });
    }
};
