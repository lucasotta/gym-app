const express = require("express");
const cors = require("cors");
require("dotenv").config();
const conectarDB = require("./config/db");

const authRoutes = require("./routes/auth");
const musculoRoutes = require("./routes/musculos");
const entrenamientoRoutes = require("./routes/entrenamientos");

const app = express();

// conectar DB
conectarDB();

// middlewares
app.use(cors());
app.use(express.json());

// rutas
app.use("/auth", authRoutes);
app.use("/musculos", musculoRoutes);
app.use("/entrenamientos", entrenamientoRoutes);

// 🔥 IMPORTANTE PARA RAILWAY
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});