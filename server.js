// server.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import db from "./config/connectDb.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// استخدام middleware
app.use(cors());
app.use(bodyParser.json());

// ---------------------------------
// Movies
// ---------------------------------
app.get("/movies", (req, res) => {
  db.query("SELECT * FROM movie", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.get("/movies/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM movie WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0]);
  });
});

app.post("/movies", (req, res) => {
  const { title, play_time, movie_info } = req.body;
  db.query(
    "INSERT INTO movie (title, play_time, movie_info) VALUES (?, ?, ?)",
    [title, play_time, JSON.stringify(movie_info)],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.status(201).json({ id: results.insertId });
    }
  );
});

app.put("/movies/:id", (req, res) => {
  const { id } = req.params;
  const { title, play_time, movie_info } = req.body;
  db.query(
    "UPDATE movie SET title = ?, play_time = ?, movie_info = ? WHERE id = ?",
    [title, play_time, JSON.stringify(movie_info), id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.sendStatus(204);
    }
  );
});

app.delete("/movies/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM movie WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.sendStatus(204);
  });
});

// ---------------------------------
// Genres
// ---------------------------------
app.get("/genres", (req, res) => {
  db.query("SELECT * FROM genre", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post("/genres", (req, res) => {
  const { genre_name } = req.body;
  db.query(
    "INSERT INTO genre (genre_name) VALUES (?)",
    [genre_name],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.status(201).json({ id: results.insertId });
    }
  );
});

// ---------------------------------
// Auditors
// ---------------------------------
app.get("/auditoriums", (req, res) => {
  db.query("SELECT * FROM auditorium", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post("/auditoriums", (req, res) => {
  const { auditorium_name } = req.body;
  db.query(
    "INSERT INTO auditorium (auditorium_name) VALUES (?)",
    [auditorium_name],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.status(201).json({ id: results.insertId });
    }
  );
});

// ---------------------------------
// Tickets
// ---------------------------------
app.get("/tickets", (req, res) => {
  db.query("SELECT * FROM ticket", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// ---------------------------------
// Starting the server
// ---------------------------------
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
