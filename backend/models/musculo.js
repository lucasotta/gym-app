const mongoose = require("mongoose");

const MusculoSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  ejercicios: [{ type: String }]
});

module.exports = mongoose.model("Musculo", MusculoSchema);
