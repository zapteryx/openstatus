import { gotifyDataSchema } from "@openstatus/db/src/schema";
import type { NotificationContext } from "@openstatus/notification-base";
import { assertSafeUrl } from "@openstatus/utils";

export const sendAlert = async ({
  monitor,
  notification,
  statusCode,
  message,
}: NotificationContext) => {
  const notificationData = gotifyDataSchema.parse(JSON.parse(notification.data));
  const { name } = monitor;

  const title = `🔴 ${name} is down`;
  const body = `Your monitor ${name} / ${monitor.url} is down with ${
    statusCode ? `status code ${statusCode}` : `error: ${message}`
  }`;

  const url = `${notificationData.gotify.serverUrl}/message`;
  await assertSafeUrl(url);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Gotify-Key": notificationData.gotify.token,
    },
    body: JSON.stringify({
      title,
      message: body,
      priority: 8,
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to send alert notification: ${res.statusText}`);
  }
};

export const sendRecovery = async ({
  monitor,
  notification,
}: NotificationContext) => {
  const notificationData = gotifyDataSchema.parse(JSON.parse(notification.data));
  const { name } = monitor;

  const title = `🟢 ${name} is back up`;
  const body = `Your monitor ${name} / ${monitor.url} is up again`;

  const url = `${notificationData.gotify.serverUrl}/message`;
  await assertSafeUrl(url);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Gotify-Key": notificationData.gotify.token,
    },
    body: JSON.stringify({
      title,
      message: body,
      priority: 5,
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to send recovery notification: ${res.statusText}`);
  }
};

export const sendDegraded = async ({
  monitor,
  notification,
}: NotificationContext) => {
  const notificationData = gotifyDataSchema.parse(JSON.parse(notification.data));
  const { name } = monitor;

  const title = `🟡 ${name} is degraded`;
  const body = `Your monitor ${name} / ${monitor.url} is degraded`;

  const url = `${notificationData.gotify.serverUrl}/message`;
  await assertSafeUrl(url);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Gotify-Key": notificationData.gotify.token,
    },
    body: JSON.stringify({
      title,
      message: body,
      priority: 6,
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to send degraded notification: ${res.statusText}`);
  }
};

export const sendTest = async ({
  serverUrl,
  token,
}: {
  serverUrl: string;
  token: string;
}) => {
  const url = `${serverUrl}/message`;
  await assertSafeUrl(url);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Gotify-Key": token,
      },
      body: JSON.stringify({
        title: "Test from OpenStatus",
        message: "This is a test message from OpenStatus",
        priority: 5,
      }),
    });

    if (!res.ok) {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }

  return true;
};
