const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const User = require("../models/User");
const Candidate = require("../models/Candidate");

const hashPassword = (password, salt = crypto.randomBytes(16).toString("hex")) => {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
};

const verifyPassword = (password, storedPassword) => {
  const [salt, storedHash] = String(storedPassword || "").split(":");
  if (!salt || !storedHash) return false;
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  const expected = Buffer.from(storedHash, "hex");
  const actual = Buffer.from(hash, "hex");
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
};

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, country, accreditationType, accreditationNumber } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Nombre, email y contraseña son obligatorios" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    if (await User.findOne({ email: normalizedEmail })) {
      return res.status(409).json({ message: "El email ya está registrado" });
    }

    const normalizedRole = role === "company" ? "company" : "candidate";
    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password: hashPassword(password),
      role: normalizedRole,
      active: true
    });

    if (normalizedRole === "candidate") {
      await Candidate.create({
        userId: user._id,
        name: user.name,
        email: user.email,
        country: country || "",
        accreditationType: accreditationType || "",
        accreditationNumber: accreditationNumber || ""
      });
    }

    res.status(201).json({
      message: "Registro correcto",
      user: { id: user._id, name: user.name, email: user.email, role: user.role, active: user.active }
    });
  } catch (error) {
    res.status(500).json({ message: "Error registrando usuario", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user || !user.active || !verifyPassword(password, user.password)) {
      return res.status(401).json({ message: "Email o contraseña incorrectos" });
    }

    res.json({
      message: "Login correcto",
      user: { id: user._id, name: user.name, email: user.email, role: user.role, active: user.active }
    });
  } catch (error) {
    res.status(500).json({ message: "Error iniciando sesión", error: error.message });
  }
});

module.exports = router;
