const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Patient, Medecin, Infirmier, Personnel } = require('./User'); // Assurez-vous que les modèles sont correctement importés

const uri = 'mongodb+srv://daryl:dada@cluster0.hv8hpda.mongodb.net/test?retryWrites=true&w=majority'; // Ajoutez le nom de la base de données

mongoose.connect(uri)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error('MongoDB connection error:', err));

const saltRounds = 10;

async function createUsers() {
    try {
        const hashedPassword = await bcrypt.hash('0000', saltRounds);

        const medecin = new Medecin({
            identifiant: 'medecin1',
            name: 'Dr.Smith',
            email: 'medecin1@gmail.com',
            phone: '1234567890',
            address: '123 Doctor St',
            specialty: 'Cardiology',
            Hopital: new mongoose.Types.ObjectId('66b535aafdff2361ea8326e9'),
            availability: [{ day: 'Monday', hours: '9-5' }],
            password: hashedPassword,
            role: 'medecin'
        });

        const infirmier = new Infirmier({
            identifiant: 'infirmier1',
            name: 'Nurse',
            email: 'nursejane@example.com',
            phone: '1234567890',
            address: '123 Nurse St',
            specialty: 'Pediatrics',
            Hopital: new mongoose.Types.ObjectId('66b535aafdff2361ea8326e9'),
            availability: [{ day: 'Tuesday', hours: '10-6' }],
            password: hashedPassword,
            role: 'infirmier'
        });

        const patient = new Patient({
            identifiant: 'patient1',
            name: 'John Doe',
            email: 'johndoe@example.com',
            phone: '1234567890',
            address: '123 Patient St',
            Hopital: new mongoose.Types.ObjectId('66b535aafdff2361ea8326e9'),
            password: hashedPassword,
            role: 'patient'
        });

        const personnel = new Personnel({
            identifiant: 'personnel1',
            name: 'Staff Member',
            email: 'staff@example.com',
            phone: '1234567890',
            address: '123 Staff St',
            Hopital: new mongoose.Types.ObjectId('66b535aafdff2361ea8326e9'),
            password: hashedPassword,
            role: 'personnel'
        });

        await medecin.save();
        await infirmier.save();
        await patient.save();
        await personnel.save();

        console.log('Users created successfully');
    } catch (err) {
        console.error('Error creating users:', err);
    } finally {
        mongoose.connection.close();
    }
}

createUsers();
