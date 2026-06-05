// api.js (Node/Express pseudo-code)
import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2/promise";

const app = express();
app.use(bodyParser.json());

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "aoa",
});

// POST /api/scores – Unreal sends scores here
app.post("/api/scores", async (req, res) => {
  const { playerName, score, mode, apiKey } = req.body;

  // super simple auth (you’d want better in production)
  if (apiKey !== process.env.UNREAL_API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!playerName || typeof score !== "number") {
    return res.status(400).json({ error: "Invalid payload" });
  }

  await pool.execute(
    "INSERT INTO scores (player_name, score, mode) VALUES (?, ?, ?)",
    [playerName, score, mode || "default"]
  );

  return res.json({ ok: true });
});

// GET /api/leaderboard – website calls this
app.get("/api/leaderboard", async (req, res) => {
  const page = parseInt(req.query.page || "1", 10);
  const pageSize = parseInt(req.query.pageSize || "50", 10);
  const offset = (page - 1) * pageSize;

  const [rows] = await pool.execute(
    `
    SELECT player_name, score, mode
    FROM scores
    ORDER BY score DESC, created_at ASC
    LIMIT ? OFFSET ?
    `,
    [pageSize, offset]
  );

  // Add rank (1..∞)
  const leaderboard = rows.map((row, index) => ({
    rank: offset + index + 1,
    name: row.player_name,
    score: row.score,
    mode: row.mode,
  }));

  res.json({ page, pageSize, results: leaderboard });
});

app.listen(3001, () => {
  console.log("API listening on :3001");
});
