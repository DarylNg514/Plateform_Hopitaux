const router = require("express").Router();
const authRouter = require('./authRoutes.routes');

router.get("/", (req, res) => {
  res.end("Coucou !");
});

router.use("/auth", authRouter);
module.exports = router;
