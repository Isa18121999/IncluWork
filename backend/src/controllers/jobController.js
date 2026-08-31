const Job = require("../models/Job");

const createJob = async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: "Error creando oferta", error: error.message });
  }
};

const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo ofertas", error: error.message });
  }
};

module.exports = { createJob, getJobs };
