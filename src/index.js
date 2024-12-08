import express from "express";
import pool from "./config/dbconfig.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", async (req, res) => {
  const resp = await pool.query("SELECT 'Hello World' AS message");
  res.json(resp.rows[0]);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
