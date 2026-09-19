const Job = require("../models/Job");
const Company = require("../models/Company");

const MODALITIES = ["remoto", "híbrido", "hibrido", "presencial"];
const MAX_TEXT = 300;

const createJob = async (req, res) => {
  try {
    const company = await Company.findOne({ userId: req.user.id });
    if (!company) return res.status(404).json({ message: "Perfil de empresa no encontrado" });

    const title = String(req.body.title || "").trim();
    const area = String(req.body.area || "").trim();
    const modality = String(req.body.modality || "").trim().toLowerCase();
    const educationRequired = String(req.body.educationRequired || "").trim();
    const experienceRequired = Number(req.body.experienceRequired);
    const requirements = req.body.requirements;
    const accessibility = req.body.accessibility;

    if (title.length < 2 || title.length > MAX_TEXT) return res.status(400).json({ message: "El cargo debe tener entre 2 y 300 caracteres" });
    if (area.length < 2 || area.length > MAX_TEXT) return res.status(400).json({ message: "El área profesional debe tener entre 2 y 300 caracteres" });
    if (modality && !MODALITIES.includes(modality)) return res.status(400).json({ message: "La modalidad debe ser remoto, híbrido o presencial" });
    if (!Number.isFinite(experienceRequired) || experienceRequired < 0 || experienceRequired > 60) return res.status(400).json({ message: "La experiencia requerida debe ser un número entre 0 y 60 años" });
    if (educationRequired.length > MAX_TEXT) return res.status(400).json({ message: "La formación requerida supera el máximo permitido" });
    if (!Array.isArray(requirements) || requirements.length > 30 || requirements.some((item) => typeof item !== "string" || !item.trim() || item.trim().length > 100)) return res.status(400).json({ message: "Los requisitos deben ser una lista válida de hasta 30 elementos" });
    if (!Array.isArray(accessibility) || accessibility.length > 30 || accessibility.some((item) => typeof item !== "string" || !item.trim() || item.trim().length > 100)) return res.status(400).json({ message: "La accesibilidad debe ser una lista válida de hasta 30 elementos" });

    const job = await Job.create({
      title,
      area,
      modality,
      experienceRequired,
      educationRequired,
      requirements: requirements.map((item) => item.trim()),
      accessibility: accessibility.map((item) => item.trim()),
      companyId: company._id
    });
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: "Error creando oferta", error: error.message });
  }
};

const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("companyId", "name").sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo ofertas", error: error.message });
  }
};

const getMyJobs = async (req, res) => {
  try {
    const company = await Company.findOne({ userId: req.user.id });
    const jobs = await Job.find({ companyId: company?._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo ofertas", error: error.message });
  }
};

module.exports = { createJob, getJobs, getMyJobs };
