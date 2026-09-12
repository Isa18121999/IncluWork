const Job = require("../models/Job");
const Company = require("../models/Company");

const createJob = async (req, res) => {
  try {
    const company = await Company.findOne({ userId: req.user.id });
    if (!company) return res.status(404).json({ message: "Perfil de empresa no encontrado" });

    const experienceRequired = Number(req.body.experienceRequired);
    const job = await Job.create({
      title: req.body.title,
      area: req.body.area || "",
      modality: req.body.modality || "",
      experienceRequired: Number.isFinite(experienceRequired) && experienceRequired >= 0 ? experienceRequired : 0,
      educationRequired: req.body.educationRequired || "",
      requirements: Array.isArray(req.body.requirements) ? req.body.requirements : [],
      accessibility: Array.isArray(req.body.accessibility) ? req.body.accessibility : [],
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
