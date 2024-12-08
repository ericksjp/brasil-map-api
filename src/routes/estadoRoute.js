import { Router } from "express";
import {
  getEstado,
  getAllEstados,
  getMunicipiosOfEstado,
} from "../controllers/estadoController.js";

const router = Router();

router.get("/", getAllEstados);

router.get("/:uf", getEstado);

router.get("/:uf/municipios", getMunicipiosOfEstado);

export default router;
