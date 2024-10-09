// server.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import db from "./config/connectDb.js";
import dotenv from "dotenv";
import moviesRoute from "./router/moviesRoute.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(bodyParser.json());

// Route

// ---------------------------------
// Movies
// ---------------------------------
app.use("/api/movie", moviesRoute);
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
