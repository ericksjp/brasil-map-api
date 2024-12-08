import { Router } from "express";

const router = Router();

router.get("/", (_, res) => {
  res.send("Hello World");
});

router.get("/:ufEstado", (req, res) => {
  const { ufEstado } = req.params;
  res.send(`Estado: ${ufEstado}`);
});

router.get("/:ufEstado/municipios", (req, res) => {
  const { ufEstado } = req.params;
  res.send(`Municipios do estado: ${ufEstado}`);
});

export default router;
