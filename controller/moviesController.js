import db from "../config/connectDb.js";

const getAllMovies = async (req, res) => {
  try {
    db.query("SELECT * FROM movie", (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const getMovie = async (req, res) => {
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
};

const addMovie = async (req, res) => {
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
};

const updateMovie = async (req, res) => {
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
};

const deleteMovie = async (req, res) => {
  const { id } = req.params;
  try {
    db.query("DELETE FROM movie WHERE id = ?", [id], (err) => {
      if (err) throw err;
      res.sendStatus(204);
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

export default { getAllMovies, getMovie, addMovie, updateMovie, deleteMovie };
