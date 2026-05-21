const express = require("express");
const cors = require("cors");
require("dotenv").config();
const conectarDB = require("./config/db");

const authRoutes = require("./routes/auth");
const musculoRoutes = require("./routes/musculos");
const entrenamientoRoutes = require("./routes/entrenamientos");

const app = express();

conectarDB();

const allowedOrigins = [
  "https://gimnasioregistro.netlify.app",
  "https://www.gimnasioregistro.netlify.app",
  "http://localhost:5500",
  "http://127.0.0.1:5500"
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.endsWith(".netlify.app")) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions)); // Express 5 compatible preflight

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/musculos", musculoRoutes);
app.use("/entrenamientos", entrenamientoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});