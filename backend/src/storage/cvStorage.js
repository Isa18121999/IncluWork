const fs = require("fs");
const path = require("path");

const uploadsDirectory = path.join(__dirname, "..", "..", "uploads", "cv");

const removeLocalCv = (cvUrl) => {
  if (!cvUrl?.startsWith("/uploads/cv/")) return;
  fs.unlink(path.join(uploadsDirectory, path.basename(cvUrl)), () => {});
};

module.exports = { removeLocalCv };
