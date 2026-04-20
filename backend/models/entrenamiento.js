const mongoose = require("mongoose");

const SerieSchema = new mongoose.Schema({
  serie: Number,
  reps: Number,
  peso: Number,
  rir: Number,
  fecha: { type: Date, default: Date.now }
});

const EntrenamientoSchema = new mongoose.Schema({
  ejercicio: String,
  musculo: String,
  series: [SerieSchema],
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }  
});

module.exports = mongoose.model("Entrenamiento", EntrenamientoSchema);