// moviesRoute.js
import { Router } from "express";
import reservationsController from "../controller/reservationsController.js";

const reservationsRoute = Router();

reservationsRoute.route("/").get(reservationsController.getAllReservations);

reservationsRoute
  .route("/:reservation_num")
  .get(reservationsController.getReservationByNumber);
//   .put()
//   .delete();

export default reservationsRoute;
