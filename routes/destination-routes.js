import express from "express";
import {
  addReviewToDestination,
  createDestination,
  deleteDestination,
  filterDestinationByRating,
  getAllDestination,
  getAllReviewOfDestination,
  getDestinationByLocation,
  getDestinationByName,
  getDestinationByRating,
  updateDestination,
} from "../controllers/destination.controller.js";

const Router = express.Router();

Router.post("/add-destination", createDestination);
Router.get("/destinations", getAllDestination);
Router.get("/destinations/:destinationName", getDestinationByName);
Router.get("/destinations/location/:location", getDestinationByLocation);
Router.get("/destination/ratings", getDestinationByRating);
Router.post("/destinations/:destinationId", updateDestination);
Router.delete("/destinations/:destinationId", deleteDestination);
Router.get("/destinations/rating/:minRating", filterDestinationByRating);
Router.post("/destinations/:destinationId/reviews", addReviewToDestination);
Router.get("/destinations/:destinationId/review", getAllReviewOfDestination);

export default Router;
