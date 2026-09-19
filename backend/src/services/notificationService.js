const Notification = require("../models/Notification");

const createNotification = async ({ userId, type, title, message, data = {} }) => {
  if (!userId) throw new Error("userId is required");
  return Notification.create({ userId, type, title, message, data });
};

module.exports = { createNotification };
