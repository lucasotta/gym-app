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

// ✅ CORS correcto para Netlify + local
const allowedOrigins = [
  "https://gimnasioregistro.netlify.app",
  "https://www.gimnasioregistro.netlify.app",
  "http://localhost:5500",
  "http://127.0.0.1:5500"
];

app.use(cors({
  origin: (origin, callback) => {
    // requests sin origin (Postman, cURL, apps móviles)
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith(".netlify.app")
    ) {
      return callback(null, true);
    }

    // importante: no tirar Error acá
    return callback(null, false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


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