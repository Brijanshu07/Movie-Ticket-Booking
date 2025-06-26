import express from "express";
import {
  getFavorite,
  getUserBookings,
  updateFavorite,
} from "../controllers/userControllers.js";

const userRouter = express.Router();

userRouter.get("/bookings", getUserBookings);
userRouter.post(`/update-favorite`, updateFavorite);
userRouter.get("/favorites", getFavorite);

export default userRouter;
