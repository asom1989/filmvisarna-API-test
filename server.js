// server.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import moviesRoute from "./router/moviesRoute.js";
import reservationsRoute from "./router/reservationsRoute.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
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
app.use("/api/reservations", reservationsRoute);

// ---------------------------------
// Starting the server
// ---------------------------------
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
