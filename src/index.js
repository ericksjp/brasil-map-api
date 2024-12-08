import express from "express";
import cors from "cors";
import estadoRoute from "./routes/estadoRoute.js";
import { fileURLToPath } from "url";
import { join, dirname } from "path";

const __dirname = dirname(dirname(fileURLToPath(import.meta.url)));
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());

app.use("/static", express.static(join(__dirname, "public")));

app.use("/api/estado", estadoRoute);

app.use((req, res, next) => {
  res.status(404).json({ message: "Endpoint not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
