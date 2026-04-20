const express = require("express");
const router = express.Router();
const Entrenamiento = require("../models/entrenamiento");
const auth = require("../middleware/auth");

// ======================================
// HISTORIAL (IMPORTANTE: VA PRIMERO)
// ======================================
router.get("/historial", auth, async (req, res) => {
  try {

    const entrenamientos = await Entrenamiento.find({
      usuarioId: req.user.id
    });

    let historial = [];

    entrenamientos.forEach(e => {
      e.series.forEach(s => {
        if (s.fecha) {
          historial.push({ fecha: s.fecha });
        }
      });
    });

    res.json(historial);

  } catch (error) {
    console.log("ERROR HISTORIAL:", error);
    res.status(500).json({ msg: "Error historial" });
  }
});
// =============================
// DASHBOARD PROFESIONAL
// =============================
router.get("/dashboard", auth, async (req, res) => {
  try {

    const usuarioId = req.user.id;

    const entrenamientos = await Entrenamiento.find({ usuarioId });

    let totalEntrenamientos = entrenamientos.length;
    let totalSeries = 0;
    let sumaReps = 0;
    let sumaPeso = 0;
    let pesoMaximo = 0;

    let topEjerciciosMap = {};
    let musculoMap = {};
    let progresoMap = {};

    entrenamientos.forEach(entreno => {

      musculoMap[entreno.musculo] =
        (musculoMap[entreno.musculo] || 0);

      entreno.series.forEach(s => {

        totalSeries++;
        sumaReps += s.reps;
        sumaPeso += s.peso;

        if (s.peso > pesoMaximo) pesoMaximo = s.peso;

        // Top ejercicios
        topEjerciciosMap[entreno.ejercicio] =
          (topEjerciciosMap[entreno.ejercicio] || 0) + 1;

        // Distribución músculo
        musculoMap[entreno.musculo]++;

        // Progreso por fecha
        const fecha = new Date(s.fecha).toISOString().split("T")[0];

        progresoMap[fecha] =
          (progresoMap[fecha] || 0) + (s.peso * s.reps);
      });

    });

    const repsPromedio = totalSeries ? sumaReps / totalSeries : 0;
    const pesoPromedio = totalSeries ? sumaPeso / totalSeries : 0;

    const topEjercicios = Object.entries(topEjerciciosMap)
      .sort((a,b)=>b[1]-a[1])
      .slice(0,4)
      .map(e => ({ nombre:e[0], total:e[1] }));

    const distribucionMusculo = musculoMap;

    const progresoPeso = Object.entries(progresoMap)
      .sort()
      .map(e => ({
        fecha:e[0],
        total:e[1]
      }));

    res.json({
      totalEntrenamientos,
      totalSeries,
      repsPromedio,
      pesoPromedio,
      pesoMaximo,
      topEjercicios,
      distribucionMusculo,
      progresoPeso
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error dashboard" });
  }
});

// =====================
// CREAR EJERCICIO
// =====================
router.post("/", auth, async (req, res) => {
  try {
    const { ejercicio, musculo } = req.body;

    const nuevo = new Entrenamiento({
      usuarioId: req.user.id,
      ejercicio,
      musculo,
      series: []
    });

    await nuevo.save();
    res.json(nuevo);

  } catch (err) {
    res.status(500).json({ msg: "Error servidor" });
  }
});

// =====================
// OBTENER EJERCICIOS POR MUSCULO
// =====================
router.get("/musculo/:musculo", auth, async (req, res) => {
  try {
    const ejercicios = await Entrenamiento.find({
      usuarioId: req.user.id,
      musculo: req.params.musculo
    });

    res.json(ejercicios);

  } catch (err) {
    console.error("❌ MUSCULO:", err);
    res.status(500).json({ msg: "Error servidor" });
  }
});

// =====================
// OBTENER EJERCICIO POR ID
// =====================
router.get("/:id", auth, async (req, res) => {
  try {

    // evitar que "historial" se interprete como ID
    if (req.params.id === "historial") {
      return res.status(400).json({ msg: "Ruta inválida" });
    }

    const entrenamiento = await Entrenamiento.findOne({
      _id: req.params.id,
      usuarioId: req.user.id
    });

    if (!entrenamiento) {
      return res.status(404).json({ msg: "No encontrado" });
    }

    res.json(entrenamiento);

  } catch (err) {
    console.error("❌ GET ID:", err);
    res.status(500).json({ msg: "Error servidor" });
  }
});

// =====================
// EDITAR NOMBRE
// =====================
router.put("/:id", auth, async (req, res) => {
  try {
    const { ejercicio } = req.body;

    const entrenamiento = await Entrenamiento.findOneAndUpdate(
      { _id: req.params.id, usuarioId: req.user.id },
      { ejercicio },
      { new: true }
    );

    res.json(entrenamiento);

  } catch (err) {
    console.error("❌ EDITAR:", err);
    res.status(500).json({ msg: "Error servidor" });
  }
});

// =====================
// AGREGAR SERIE
// =====================
router.post("/:id/serie", auth, async (req, res) => {
  try {
    const { reps, peso, rir } = req.body;

    const entrenamiento = await Entrenamiento.findOne({
      _id: req.params.id,
      usuarioId: req.user.id
    });

    if (!entrenamiento)
      return res.status(404).json({ msg: "No encontrado" });

    entrenamiento.series.push({
      serie: entrenamiento.series.length + 1,
      reps,
      peso,
      rir,
      fecha: new Date() // 👈 necesario para calendario
    });

    await entrenamiento.save();
    res.json(entrenamiento);

  } catch (error) {
    console.error("🔥 SERIE:", error);
    res.status(500).json({ msg: "Error servidor" });
  }
});

// =====================
// EDITAR CAMPO DE SERIE
// =====================
router.put("/:id/serie/:serieId", auth, async (req, res) => {
  try {
    const { campo, valor } = req.body;

    const entrenamiento = await Entrenamiento.findOne({
      _id: req.params.id,
      usuarioId: req.user.id
    });

    if (!entrenamiento)
      return res.status(404).json({ msg: "No encontrado" });

    const serie = entrenamiento.series.id(req.params.serieId);

    if (!serie)
      return res.status(404).json({ msg: "Serie no encontrada" });

    serie[campo] = valor;

    await entrenamiento.save();
    res.json({ ok: true });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error servidor" });
  }
});

// =====================
// ELIMINAR SERIE
// =====================
router.delete("/:id/serie/:serieId", auth, async (req, res) => {
  try {
    const entrenamiento = await Entrenamiento.findOne({
      _id: req.params.id,
      usuarioId: req.user.id
    });

    if (!entrenamiento)
      return res.status(404).json({ msg: "No encontrado" });

    entrenamiento.series = entrenamiento.series.filter(
      s => s._id.toString() !== req.params.serieId
    );

    entrenamiento.series.forEach((s, i) => {
      s.serie = i + 1;
    });

    await entrenamiento.save();
    res.json(entrenamiento);

  } catch (error) {
    console.error("❌ ELIMINAR:", error);
    res.status(500).json({ msg: "Error servidor" });
  }
});

// =====================
// ELIMINAR EJERCICIO COMPLETO
// =====================
router.delete("/:id", auth, async (req, res) => {
  try {
    await Entrenamiento.deleteOne({
      _id: req.params.id,
      usuarioId: req.user.id
    });

    res.json({ ok: true });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error servidor" });
  }
});

module.exports = router;