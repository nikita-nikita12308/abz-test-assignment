const express = require("express");
const tokenRoutes = require("./routes/tokenRoutes");
const userRoutes = require("./routes/usersRoutes");
const positionsRoutes = require("./routes/positionsRoutes");
const app = express();

app.use(express.json());

app.use("/api/v1", tokenRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/positions", positionsRoutes);

app.all("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Page not found",
  });
});

module.exports = app;
