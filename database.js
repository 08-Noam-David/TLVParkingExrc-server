const { Pool } = require('pg');
const { poolConfig } = require('./utils.js');

const pool = new Pool(poolConfig);

const executeQuery = async (query, params) => {
  const client = await pool.connect();
  try {
    return client.query(query, params);
  } catch (e) {
    console.log(e);
  } finally {
    client.release();
  }
};

const getParking = async (id) => {
  const parkings = await executeQuery(
    `
    SELECT id, x_coord, y_coord, address, time
    FROM t_parkings
    WHERE id = $1
    `,
    [id]
  );

  return parkings.rows[0];
};

const getAllParkings = async () => {
  const parkings = await executeQuery(
    `
    SELECT id, x_coord, y_coord, address, time
    FROM t_parkings
    `,
    []
  );

  return parkings.rows;
}

module.exports = { getParking, getAllParkings };
