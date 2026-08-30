const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    name: "IncluWork API",
    status: "running"
  });
});

app.get("/api/jobs", (req, res) => {
  res.json([
    {
      title: "Frontend Developer",
      match: 94,
      accessibility: ["Trabajo remoto", "Subtítulos"]
    }
  ]);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`IncluWork API running on ${PORT}`);
});
