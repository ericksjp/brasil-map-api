import express from "express";
import estadoRoute from "./routes/estadoRoute.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/api/estado", estadoRoute);

app.use((req, res, next) => {
  res.status(404).json({ message: "Endpoint not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
