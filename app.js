const express = require("express");
const cors = require("cors");
const path = require("path");
const tokenRoutes = require("./routes/tokenRoutes");
const userRoutes = require("./routes/usersRoutes");
const positionsRoutes = require("./routes/positionsRoutes");
const app = express();

app.use(
  cors({
    allowedHeaders: ["Content-Type", "Authorization", "Token"], // Add 'Token' here
    exposedHeaders: ["Content-Type", "Authorization", "Token"], // Add 'Token' here
  })
);

app.use(express.json());

app.use("/api/v1", tokenRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/positions", positionsRoutes);
app.use("/user-photo", express.static(path.join(__dirname, "user-photo")));

app.all("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Page not found",
  });
});

module.exports = app;
