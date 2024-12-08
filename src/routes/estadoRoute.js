import { Router } from "express";
import {
  getEstado,
  getAllEstados,
  getMunicipiosOfEstado,
} from "../controllers/estadoController.js";

const router = Router();

router.get("/", getEstado);

router.get("/:ufEstado", getAllEstados);

router.get("/:ufEstado/municipios", getMunicipiosOfEstado);

export default router;
