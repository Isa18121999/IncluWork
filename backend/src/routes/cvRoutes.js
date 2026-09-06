const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Candidate = require("../models/Candidate");

const storage = multer.diskStorage({
  destination: "uploads/cv",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
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

    res.json({ message: "CV actualizado", candidate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
