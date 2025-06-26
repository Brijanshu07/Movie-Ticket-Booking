import express from "express";
import cors from "cors";
import "dotenv/config";
import { clerkMiddleware } from "@clerk/express";
import connectDB from "./configs/db.js";
import { serve } from "inngest/express";
import { functions, inngest } from "./inngest/inngest.js";
import showRouter from "./routes/showRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import userRouter from "./routes/userRoutes.js";
const app = express();

const port = 3000;
await connectDB();
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

//Routes
app.get("/", (req, res) => {
  res.send("Server is live");
});

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/show", showRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);

app.listen(port, () => console.log(`Server is running at ${port} `));
