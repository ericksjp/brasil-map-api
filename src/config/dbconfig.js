import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432", 10),
});

pool.on("connect", () => {
  console.log("Connected to the PostgreSQL database.");
});

pool.on("error", (err) => {
  console.error("Unexpected error on the PostreSQL database: ", err);
  process.exit(-1);
});

// Making sure the getViewboxEstado function is created
(async function () {
  try {
    await pool.query(
      `CREATE FUNCTION getViewboxEstado(TEXT) RETURNS TEXT AS $$
     DECLARE
        nome1 ALIAS FOR $1;
        viewBox TEXT;
     BEGIN
     SELECT INTO viewBox CAST(ST_xmin(ST_Envelope(geom)) as varchar) || ' ' ||
             CAST(ST_ymax(ST_Envelope(geom)) * -1 as varchar) || ' ' ||
             CAST(ST_xmax(ST_Envelope(geom)) - ST_xmin(ST_Envelope(geom)) as varchar) || ' ' ||
             CAST(ST_ymax(ST_Envelope(geom)) - ST_ymin(ST_Envelope(geom)) as varchar)
             FROM estado
             WHERE nome ilike nome1;
         return viewBox;
     END;$$ LANGUAGE plpgsql;`,
    );
  } catch (err) {
    if (err.code !== "42723") throw err;
  }
})();

export default pool;
