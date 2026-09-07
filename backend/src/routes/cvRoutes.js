const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Candidate = require("../models/Candidate");

const uploadDirectory = path.join(__dirname, "..", "..", "uploads", "cv");
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [".pdf", ".doc", ".docx"];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(allowed.includes(ext) ? null : new Error("Formato no permitido"), allowed.includes(ext));
  }
});

router.post("/:candidateId", upload.single("cv"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "CV requerido" });

    const candidate = await Candidate.findByIdAndUpdate(
      req.params.candidateId,
      { cvUrl: `/uploads/cv/${req.file.filename}` },
      { new: true }
    );

    if (!candidate) {
      fs.unlink(req.file.path, () => {});
      return res.status(404).json({ message: "Candidato no encontrado" });
    }

    res.json({ message: "CV actualizado", candidate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
