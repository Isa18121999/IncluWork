const express = require("express");
const router = express.Router();

const applications = [];

router.get("/", (req, res) => {
  res.json(applications);
});

router.post("/", (req, res) => {
  const application = {
    ...req.body,
    status: "Postulado"
  };

  applications.push(application);
  res.status(201).json(application);
});

module.exports = router;
