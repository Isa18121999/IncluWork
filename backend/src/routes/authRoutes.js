const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");
const Candidate = require("../models/Candidate");
const Company = require("../models/Company");

const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email, role: user.role, active: user.active });
const issueToken = (user) => jwt.sign({ id: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

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
    if (!name || !email || !password || String(password).length < 8) {
      return res.status(400).json({ message: "Nombre, email y una contraseña de al menos 8 caracteres son obligatorios" });
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

    let profile;
    if (normalizedRole === "candidate") {
      profile = await Candidate.create({
        userId: user._id,
        name: user.name,
        email: user.email,
        country: country || "",
        accreditationType: accreditationType || "",
        accreditationNumber: accreditationNumber || ""
      });
    } else {
      profile = await Company.create({ userId: user._id, name: user.name, email: user.email });
    }

    res.status(201).json({
      message: "Registro correcto",
      user: publicUser(user), token: issueToken(user), profileId: profile._id
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
      user: publicUser(user), token: issueToken(user)
    });
  } catch (error) {
    res.status(500).json({ message: "Error iniciando sesión", error: error.message });
  }
});

module.exports = router;
