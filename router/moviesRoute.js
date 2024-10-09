// moviesRoute.js
import { Router } from "express";
import moviesController from "../controller/moviesController.js";
const moviesRoute = Router();

moviesRoute
  .route("/")
  .get(moviesController.getAllMovies)
  .post(moviesController.addMovie);

moviesRoute
  .route("/:id")
  .get(moviesController.getMovie)
  .put(moviesController.updateMovie)
  .delete(moviesController.deleteMovie);

export default moviesRoute;
