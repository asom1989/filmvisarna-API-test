// server.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import db from "./config/connectDb.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(bodyParser.json());

// ---------------------------------
// Movies
// ---------------------------------
app.get("/movies", async (req, res) => {
  try {
    db.query("SELECT * FROM movie", (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

app.get("/movies/:id", async (req, res) => {
  const { id } = req.params;
  try {
    db.query("SELECT * FROM movie WHERE id = ?", [id], (err, results) => {
      if (err) throw err;

      if (results.length === 0) {
        return res.status(404).json({ message: "Movie not found" });
      }
      res.json(results[0]);
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

app.post("/movies", async (req, res) => {
  const { title, play_time, movie_info } = req.body;
  try {
    db.query(
      "INSERT INTO movie (title, play_time, movie_info) VALUES (?, ?, ?)",
      [title, play_time, JSON.stringify(movie_info)],
      (err, results) => {
        if (err) throw err;
        res.status(201).json({ id: results.insertId });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

app.put("/movies/:id", async (req, res) => {
  const { id } = req.params;
  const { title, play_time, movie_info } = req.body;
  try {
    db.query(
      "UPDATE movie SET title = ?, play_time = ?, movie_info = ? WHERE id = ?",
      [title, play_time, JSON.stringify(movie_info), id],
      (err) => {
        if (err) throw err;
        res.sendStatus(204);
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

app.delete("/movies/:id", async (req, res) => {
  const { id } = req.params;
  try {
    db.query("DELETE FROM movie WHERE id = ?", [id], (err) => {
      if (err) throw err;
      res.sendStatus(204);
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

// ---------------------------------
// Tickets
// ---------------------------------
app.get("/tickets", async (req, res) => {
  try {
    db.query("SELECT * FROM ticket", (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

// ---------------------------------
// Starting the server
// ---------------------------------
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
