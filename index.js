import express from "express";

import dotenv from "dotenv";
import cors from "cors";
import "./database/initial.js";
import Router from "./routes/destination-routes.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use("/api/tripadvisor", Router);

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    method: `${req.method} ${req.url} is not allowed`,
  });
});

app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    statusCode: err.statusCode || 500,
    success: false,
    message: err.message,
  });
});

const port = process.env.SERVER_PORT || 3005;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
