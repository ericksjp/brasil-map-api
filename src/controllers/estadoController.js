import * as se from "../services/estadoService.js";

export async function getAllEstados(_, res) {
  try {
    const estados = await se.getEstados();
    res.send(estados);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function getEstado(req, res) {
  try {
    const estado = await se.getEstadoByUf(req.params.uf);
    res.send(estado);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function getMunicipiosOfEstado(req, res) {
  try {
    const municipios = await se.getMunicipiosByUf(req.params.uf);
    res.send(municipios);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
