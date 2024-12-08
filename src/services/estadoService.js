import pool from "../config/dbconfig.js";

export async function getEstados() {
  const query = "SELECT nome, sigla, regiao, area_km2, getViewboxEstado(nome) as viewbox, st_assvg(geom) as svg FROM estado";
  const { rows } = await pool.query(query);
  return rows;
}

export async function getEstadoByUf(uf) {
  const query = "SELECT nome, sigla, regiao, area_km2, getViewboxEstado(nome) as viewbox, st_assvg(geom) as svg FROM estado where sigla ilike $1";
  const { rows } = await pool.query(query, [uf]);
  return rows[0];
}

export async function getMunicipiosByUf(uf) {
  const query = "SELECT id, nome, estado, area_km2, st_assvg(geom) as svg FROM municipio where estado ilike $1";
  const { rows } = await pool.query(query, [uf]);
  return rows;
}
