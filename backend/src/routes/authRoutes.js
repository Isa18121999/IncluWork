const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");
const Candidate = require("../models/Candidate");
const Company = require("../models/Company");
const { validateName, validateEmail, validatePhone, validatePassword } = require("../validation");

const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, active: user.active });
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
    const { name, email, phone, password, role, country, accreditationType, accreditationNumber } = req.body;
    const normalizedName = String(name || "").trim();
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedPhone = String(phone || "").trim();

    if (!normalizedName || !normalizedEmail || !normalizedPhone || !password) {
      return res.status(400).json({ message: "Nombre, email, teléfono y contraseña son obligatorios" });
    }
    if (role !== "company" && !validateName(normalizedName)) {
      return res.status(400).json({ message: "El nombre solo puede contener letras, espacios, apóstrofes o guiones" });
    }
    if (!validateEmail(normalizedEmail)) {
      return res.status(400).json({ message: "Ingresa un email válido" });
    }
    if (!validatePhone(normalizedPhone)) {
      return res.status(400).json({ message: "El teléfono debe contener solo números y tener entre 7 y 15 dígitos" });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial" });
    }

    if (await User.findOne({ email: normalizedEmail })) {
      return res.status(409).json({ message: "El email ya está registrado" });
    }

    const normalizedRole = role === "company" ? "company" : "candidate";
    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      phone: normalizedPhone,
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
        phone: user.phone,
        country: country || "",
        accreditationType: accreditationType || "",
        accreditationNumber: accreditationNumber || ""
      });
    } else {
      profile = await Company.create({ userId: user._id, name: user.name, email: user.email, phone: user.phone });
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
