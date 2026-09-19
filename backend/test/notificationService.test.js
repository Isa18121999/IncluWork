const test = require("node:test");
const assert = require("node:assert/strict");
const Notification = require("../src/models/Notification");
const { createNotification } = require("../src/services/notificationService");

test("crea una notificación con el payload esperado", async () => {
  const originalCreate = Notification.create;
  let received;

  Notification.create = async (payload) => {
    received = payload;
    return { _id: "notification-1", ...payload };
  };

  try {
    const result = await createNotification({
      userId: "user-1",
      type: "application_status",
      title: "Postulación: En proceso",
      message: "Tu postulación pasó a la etapa En proceso.",
      data: { applicationId: "application-1", status: "En proceso" }
    });

    assert.equal(result._id, "notification-1");
    assert.deepEqual(received, {
      userId: "user-1",
      type: "application_status",
      title: "Postulación: En proceso",
      message: "Tu postulación pasó a la etapa En proceso.",
      data: { applicationId: "application-1", status: "En proceso" }
    });
  } finally {
    Notification.create = originalCreate;
  }
});

test("rechaza notificaciones sin usuario destinatario", async () => {
  await assert.rejects(
    () => createNotification({
      type: "new_application",
      title: "Nueva postulación",
      message: "Mensaje"
    }),
    { message: "userId is required" }
  );
});
