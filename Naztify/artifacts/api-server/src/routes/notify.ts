import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();
const DB_PATH = path.resolve(process.cwd(), "db.json");
const TEMPLATES = path.resolve(process.cwd(), "templates");

function loadDB() {
  try { if (fs.existsSync(DB_PATH)) return JSON.parse(fs.readFileSync(DB_PATH, "utf-8")); } catch {}
  return { messages: [] };
}
function saveDB(db: any) { fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2)); }

async function sendPush(message: string) {
  const appId = process.env.ONESIGNAL_APP_ID;
  const key = process.env.ONESIGNAL_REST_API_KEY;
  const appUrl = process.env.APP_URL || "https://couple-connect--delbandbehdadf1.replit.app";
  if (!appId || !key) return { ok: false, error: "Keys missing" };
  try {
    const r = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Basic ${key}` },
      body: JSON.stringify({
        app_id: appId,
        included_segments: ["Total Subscriptions"],
        contents: { en: message },
        headings: { en: "💌 from your love" },
        url: `${appUrl}/her`,
      }),
    });
    return { ok: true, data: await r.json() };
  } catch (e: any) { return { ok: false, error: e.message }; }
}

// Pages
router.get("/dashboard", (_req, res) => {
  const f = path.join(TEMPLATES, "dashboard.html");
  if (fs.existsSync(f)) res.sendFile(f);
  else res.status(404).send("Not Found");
});

router.get("/her", (_req, res) => {
  const f = path.join(TEMPLATES, "her.html");
  if (fs.existsSync(f)) res.sendFile(f);
  else res.status(404).send("Not Found");
});

// OneSignal service worker
router.get("/OneSignalSDKWorker.js", (_req, res) => {
  const f = path.resolve(process.cwd(), "OneSignalSDKWorker.js");
  if (fs.existsSync(f)) res.sendFile(f);
  else res.status(404).send("Not Found");
});

// API: send mood
router.post("/api/send", async (req, res) => {
  const { moodId, message, emoji, color } = req.body;
  const db = loadDB();
  const entry = { id: Date.now().toString(), moodId, message, emoji, color, sentAt: Date.now(), reply: null, replyEmoji: null, replyAt: null };
  db.messages.unshift(entry);
  if (db.messages.length > 50) db.messages = db.messages.slice(0, 50);
  saveDB(db);
  const push = await sendPush(`${emoji} ${message}`);
  res.json({ success: true, entry, push });
});

// API: her reply
router.post("/api/reply", (req, res) => {
  const { messageId, reply, replyEmoji } = req.body;
  const db = loadDB();
  const msg = db.messages.find((m: any) => m.id === messageId);
  if (msg) { msg.reply = reply; msg.replyEmoji = replyEmoji; msg.replyAt = Date.now(); saveDB(db); }
  res.json({ success: true });
});

// API: latest message
router.get("/api/latest", (_req, res) => {
  const db = loadDB();
  res.json({ message: db.messages[0] || null });
});

// API: dashboard status
router.get("/api/status", (_req, res) => {
  const db = loadDB();
  res.json({ latest: db.messages[0] || null });
});

export default router;
