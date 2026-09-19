const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Candidate = require("../models/Candidate");
const { requireAuth, requireRole } = require("../middleware/auth");
const { removeLocalCv } = require("../storage/cvStorage");
const { parseCv } = require("../services/cvParser");

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

router.post("/me", requireAuth, requireRole("candidate"), upload.single("cv"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "CV requerido" });

    const candidate = await Candidate.findOne({ userId: req.user.id });

    if (!candidate) {
      fs.unlink(req.file.path, () => {});
      return res.status(404).json({ message: "Candidato no encontrado" });
    }

    let extraction = { extracted: false, textLength: 0, profile: {} };
    try {
      extraction = parseCv(req.file.path);
    } catch (parseError) {
      console.warn("No se pudo extraer el perfil del CV:", parseError.message);
    }

    removeLocalCv(candidate.cvUrl);
    candidate.cvUrl = `/uploads/cv/${req.file.filename}`;

    const profile = extraction.profile || {};
    if (profile.experience !== undefined) candidate.experience = profile.experience;
    if (profile.education) candidate.education = profile.education;
    if (profile.modality) candidate.modality = profile.modality;
    if (profile.skills?.length) candidate.skills = profile.skills;
    if (profile.accessibility?.length) candidate.accessibility = profile.accessibility;

    await candidate.save();

    res.json({
      message: "CV actualizado",
      extracted: extraction.extracted,
      extractedFields: Object.keys(profile),
      candidate
    });
  } catch (error) {
    if (req.file?.path) fs.unlink(req.file.path, () => {});
    res.status(500).json({ message: error.message });
  }
});

router.get("/application/:applicationId", requireAuth, requireRole("company"), async (req, res) => {
  try {
    const Application = require("../models/Application");
    const Job = require("../models/Job");
    const Company = require("../models/Company");

    const application = await Application.findById(req.params.applicationId);
    if (!application) return res.status(404).json({ message: "Postulación no encontrada" });

    const job = await Job.findById(application.jobId);
    if (!job) return res.status(404).json({ message: "Oferta no encontrada" });

    const company = await Company.findOne({ userId: req.user.id });
    if (!company || job.companyId.toString() !== company._id.toString()) {
      return res.status(403).json({ message: "No puedes acceder al CV de esta postulación" });
    }

    const candidate = await Candidate.findById(application.candidateId).select("cvUrl");
    if (!candidate?.cvUrl || !candidate.cvUrl.startsWith("/uploads/cv/")) {
      return res.status(404).json({ message: "El candidato no tiene un CV disponible" });
    }

    const filename = path.basename(candidate.cvUrl);
    const filePath = path.join(uploadDirectory, filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "El archivo CV no está disponible" });
    }

    return res.sendFile(filePath, {
      headers: {
        "Content-Disposition": "inline; filename=\"" + filename + "\""
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Error accediendo al CV" });
  }
});

module.exports = router;
