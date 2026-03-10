import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("eduquest.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    email TEXT PRIMARY KEY,
    name TEXT,
    password TEXT,
    created_at TEXT
  );

  CREATE TABLE IF NOT EXISTS user_stats (
    email TEXT PRIMARY KEY,
    name TEXT,
    education TEXT,
    category TEXT,
    progress INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 0,
    interactions INTEGER DEFAULT 0,
    last_active TEXT,
    FOREIGN KEY(email) REFERENCES users(email)
  );

  CREATE TABLE IF NOT EXISTS study_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT,
    date TEXT,
    minutes INTEGER,
    FOREIGN KEY(email) REFERENCES users(email)
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Auth Routes
  app.post("/api/auth/signup", (req, res) => {
    const { email, name, password } = req.body;
    try {
      const stmt = db.prepare("INSERT INTO users (email, name, password, created_at) VALUES (?, ?, ?, ?)");
      stmt.run(email, name, password, new Date().toISOString());
      res.json({ success: true, user: { email, name } });
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {
        res.status(400).json({ error: "Email already exists" });
      } else {
        res.status(500).json({ error: "Failed to create user" });
      }
    }
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password) as any;
    if (user) {
      res.json({ success: true, user: { email: user.email, name: user.name } });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  });

  // API Routes
  app.get("/api/user/stats/:email", (req, res) => {
    const { email } = req.params;
    const row = db.prepare("SELECT * FROM user_stats WHERE email = ?").get(email);
    if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  app.post("/api/user/stats", (req, res) => {
    const { email, name, education, category, progress, streak, interactions } = req.body;
    const now = new Date().toISOString();
    
    const stmt = db.prepare(`
      INSERT INTO user_stats (email, name, education, category, progress, streak, interactions, last_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(email) DO UPDATE SET
        name = COALESCE(excluded.name, user_stats.name),
        education = COALESCE(excluded.education, user_stats.education),
        category = COALESCE(excluded.category, user_stats.category),
        progress = COALESCE(excluded.progress, user_stats.progress),
        streak = COALESCE(excluded.streak, user_stats.streak),
        interactions = COALESCE(excluded.interactions, user_stats.interactions),
        last_active = excluded.last_active
    `);
    
    stmt.run(email, name, education, category, progress, streak, interactions, now);
    res.json({ success: true });
  });

  app.get("/api/study-logs/:email", (req, res) => {
    const { email } = req.params;
    const logs = db.prepare(`
      SELECT date, SUM(minutes) as mins 
      FROM study_logs 
      WHERE email = ? 
      GROUP BY date 
      ORDER BY date DESC 
      LIMIT 7
    `).all(email);
    res.json(logs.reverse());
  });

  app.post("/api/study-logs", (req, res) => {
    const { email, minutes } = req.body;
    const date = new Date().toISOString().split('T')[0];
    const stmt = db.prepare("INSERT INTO study_logs (email, date, minutes) VALUES (?, ?, ?)");
    stmt.run(email, date, minutes);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
