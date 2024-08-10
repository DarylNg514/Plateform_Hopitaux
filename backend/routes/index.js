const router = require("express").Router();
const authRouter = require('./authRoutes.routes');
const patientRoutes = require('./PatientRoutes.routes');
const medecinRoutes = require('./MedecinRoutes.routes');
const infirmierRoutes = require('./InfirmierRoutes.routes');
const dossierRoutes = require('./DossierRoutes.routes');


router.get("/", (req, res) => {
  res.end("Coucou !");
});

router.use("/auth", authRouter);
router.use("/patient", patientRoutes);
router.use("/medecin", medecinRoutes);
router.use("/infirmier", infirmierRoutes);
router.use("/dossier", dossierRoutes);

module.exports = router;
