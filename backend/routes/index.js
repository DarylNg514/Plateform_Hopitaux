const router = require("express").Router();
const authRouter = require('./authRoutes.routes');
const patientRoutes = require('./PatientRoutes.routes');
const medecinRoutes = require('./MedecinRoutes.routes');
const infirmierRoutes = require('./InfirmierRoutes.routes');
const dossierRoutes = require('./DossierRoutes.routes');
const personnelRoutes = require('./PersonnelRoutes.routes');
const consultationRoutes = require('./ConsultationRoutes.routes');
const DepartementRoutes = require('./DepartementRoutes.routes');
const LitRoutes = require('./LitRoutes.routes');
const RendezvousRoutes = require('./RendezvousRoutes.routes');
const HoraireRoutes = require('./HoraireRoutes.routes');
const messageAdminRoutes = require('./MessageAdminRoutes.routes');
const messageHopitalRoutes = require('./MessageHopitaldRoutes.routes');









router.get("/", (req, res) => {
  res.end("Coucou !");
});

router.use("/auth", authRouter);
router.use("/patient", patientRoutes);
router.use("/medecin", medecinRoutes);
router.use("/infirmier", infirmierRoutes);
router.use("/dossier", dossierRoutes);
router.use("/personnel", personnelRoutes);
router.use("/consultation", consultationRoutes);
router.use("/departement", DepartementRoutes);
router.use("/lit", LitRoutes);
router.use("/rendezvous", RendezvousRoutes);
router.use("/horaire", HoraireRoutes);
router.use("/message", messageAdminRoutes);
router.use("/message", messageHopitalRoutes);




module.exports = router;
