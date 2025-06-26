import express from "express";
import {
  createBooking,
  getOccupiesSeats,
} from "../controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post("/create", createBooking);
bookingRouter.get("/seats/:showId", getOccupiesSeats);

export default bookingRouter;
