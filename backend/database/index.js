const mongoose = require("mongoose");

mongoose
  .connect("mongodb+srv://daryl:dada@cluster0.hv8hpda.mongodb.net/?retryWrites=true&w=majority")
  .then(() => console.log("Connexion DB établie !"))
  .catch((e) => console.log(e));
