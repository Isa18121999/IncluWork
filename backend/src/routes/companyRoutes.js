const express = require("express");
const router = express.Router();

const companyController = require("../controllers/companyController");
const jobController = require("../controllers/jobController");

router.get("/jobs", jobController.getJobs);

router.post("/jobs", jobController.createJob);

router.get("/candidates/:jobId", companyController.getRecommendedCandidates);

module.exports = router;
