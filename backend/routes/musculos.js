const express = require("express");
const router = express.Router();
const Musculo = require("../models/Musculo");
const auth = require("../middleware/auth");

// GET /musculos
router.get("/", auth, async (req, res) => {
  try {
    const data = await Musculo.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: "Error servidor" });
  }
});

// POST /musculos
router.post("/", auth, async (req, res) => {
  try {
    const musculo = new Musculo({
      nombre: req.body.nombre,
      ejercicios: []
    });
    await musculo.save();
    res.json(musculo);
  } catch (err) {
    res.status(500).json({ msg: "Error servidor" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const musculos = await Musculo.find();
    res.json(musculos);
  } catch (error) {
    console.error("🔥 ERROR MUSCULOS:", error);
    res.status(500).json({ msg: "Error servidor" });
  }
});

module.exports = router;

