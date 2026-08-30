const express = require("express");
const router = express.Router();

const users = [];

router.post("/register", (req, res) => {
  const user = {
    ...req.body,
    role: req.body.role || "candidate",
    active: true
  };

  users.push(user);
  res.status(201).json(user);
});

router.post("/login", (req, res) => {
  const user = users.find((item) => item.email === req.body.email);

  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  res.json({
    message: "Login correcto",
    user
  });
});

module.exports = router;
