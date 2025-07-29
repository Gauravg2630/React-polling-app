const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "polling_app",
  port: 3307
});

db.connect(err => {
  if (err) throw err;
  console.log("MySQL Connected");
});

// AUTH ROUTES
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashed], (err) => {
    if (err) return res.status(500).send("User already exists");
    res.send("Registered");
  });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err || results.length === 0) return res.status(400).send("Invalid credentials");
    const isMatch = await bcrypt.compare(password, results[0].password);
    if (!isMatch) return res.status(401).send("Incorrect password");
    const token = jwt.sign({ id: results[0].id }, "secret");
    res.json({ token, user: { id: results[0].id, name: results[0].name } });
  });
});

// POLL ROUTES
app.post("/api/polls", (req, res) => {
  const { question, options } = req.body;
  db.query("INSERT INTO polls (question) VALUES (?)", [question], (err, result) => {
    if (err) return res.sendStatus(500);
    const pollId = result.insertId;
    options.forEach(opt => {
      db.query("INSERT INTO options (poll_id, text) VALUES (?, ?)", [pollId, opt]);
    });
    res.send("Poll created");
  });
});

app.get("/api/polls", (req, res) => {
  db.query("SELECT * FROM polls", (err, polls) => {
    if (err) return res.sendStatus(500);
    const query = "SELECT * FROM options";
    db.query(query, (err, options) => {
      if (err) return res.sendStatus(500);
      const pollMap = polls.map(poll => ({
        ...poll,
        options: options.filter(opt => opt.poll_id === poll.id)
      }));
      res.json(pollMap);
    });
  });
});

app.post("/api/vote", (req, res) => {
  const { option_id } = req.body;
  db.query("UPDATE options SET votes = votes + 1 WHERE id = ?", [option_id], (err) => {
    if (err) return res.sendStatus(500);
    res.send("Voted");
  });
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
