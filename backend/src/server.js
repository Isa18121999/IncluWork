const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const connectDatabase = require("./config/database");
const applicationRoutes = require("./routes/applicationRoutes");
const authRoutes = require("./routes/authRoutes");
const companyRoutes = require("./routes/companyRoutes");
const cvRoutes = require("./routes/cvRoutes");
const profileRoutes = require("./routes/profileRoutes");

const app = express();
const uploadsDirectory = path.join(__dirname, "..", "uploads");
fs.mkdirSync(path.join(uploadsDirectory, "cv"), { recursive: true });

const allowedOrigins = process.env.CORS_ORIGIN?.split(",").map((origin) => origin.trim()).filter(Boolean);
app.use(cors({ origin: allowedOrigins?.length ? allowedOrigins : true }));
app.use(express.json());
app.use("/uploads", express.static(uploadsDirectory));

app.use("/api/applications", applicationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/cv", cvRoutes);
app.use("/api/profile", profileRoutes);

app.get("/", (req, res) => {
  res.json({
    name: "IncluWork API",
    status: "running"
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", database: "connected" });
});

app.use((error, _req, res, _next) => {
  if (error.code === "LIMIT_FILE_SIZE" || error.message === "Formato no permitido") {
    return res.status(400).json({ message: error.message });
  }
  console.error("Unhandled request error", error);
  res.status(500).json({ message: "Error interno del servidor" });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is required");
    await connectDatabase();
    app.listen(PORT, () => console.log(`IncluWork API running on ${PORT}`));
  } catch (error) {
    console.error("Unable to start IncluWork API", error.message);
    process.exit(1);
  }
};

startServer();
