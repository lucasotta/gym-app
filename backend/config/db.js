const mongoose = require("mongoose");

let conectado = false;

const conectarDB = async () => {
  if (conectado) {
    console.log("⚠️ Mongo ya estaba conectado");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    conectado = true;
    console.log("✅ MongoDB conectado");
  } catch (error) {
    console.error("❌ Error MongoDB:", error);
    process.exit(1);
  }
};

module.exports = conectarDB;