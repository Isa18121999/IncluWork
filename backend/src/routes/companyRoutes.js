const express = require("express");
const router = express.Router();

const companyController = require("../controllers/companyController");
const jobController = require("../controllers/jobController");
const { requireAuth, requireRole } = require("../middleware/auth");

router.get("/jobs", jobController.getJobs);
router.get("/my-jobs", requireAuth, requireRole("company"), jobController.getMyJobs);

router.post("/jobs", requireAuth, requireRole("company"), jobController.createJob);

router.get("/candidates/:jobId", requireAuth, requireRole("company"), companyController.getRecommendedCandidates);

module.exports = router;
