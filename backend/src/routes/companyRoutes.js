const express = require("express");
const router = express.Router();

const companyController = require("../controllers/companyController");

const jobs = [];

router.get("/jobs", (req, res) => {
  res.json(jobs);
});

router.post("/jobs", (req, res) => {
  const job = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date()
  };

  jobs.push(job);
  res.status(201).json(job);
});

router.get("/candidates/:jobId", companyController.getRecommendedCandidates);

module.exports = router;
