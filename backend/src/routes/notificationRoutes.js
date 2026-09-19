const express = require("express");
const Notification = require("../models/Notification");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth);

router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(100);
    const unreadCount = await Notification.countDocuments({ userId: req.user.id, read: false });

    res.json({ notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo notificaciones", error: error.message });
  }
});

router.patch("/:id/read", async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: { read: true } },
      { new: true }
    );

    if (!notification) return res.status(404).json({ message: "Notificación no encontrada" });
    res.json(notification);
  } catch (error) {
    res.status(400).json({ message: "Notificación no válida", error: error.message });
  }
});

router.patch("/read-all", async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { userId: req.user.id, read: false },
      { $set: { read: true } }
    );

    res.json({ message: "Notificaciones marcadas como leídas", modifiedCount: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ message: "Error marcando notificaciones", error: error.message });
  }
});

module.exports = router;
