const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const header = req.header("Authorization");
  if (!header) return res.status(401).json({ msg: "Sin token" });

  const token = header.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, "secret123");
    req.user = { id: decoded.id };
    next();
  } catch {
    res.status(401).json({ msg: "Token inválido" });
  }
};
