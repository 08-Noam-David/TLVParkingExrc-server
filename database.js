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
};

const creatParking = async (newParking) => {
  const result = await executeQuery(
    `
  INSERT
  INTO t_parkings (x_coord, y_coord, address, time)
  VALUES ($1, $2, $3, $4)
  `,
    [
      newParking.x_coord,
      newParking.y_coord,
      newParking.address,
      newParking.time,
    ]
  );

  return result.rowCount === 1;
};

const updateParking = async (parking) => {
  const result = await executeQuery(
    `
  UPDATE t_parkings
  SET x_coord = $1, y_coord = $2, address = $3, time = $5
  WHERE id = $4
  `,
    [
      parking.x_coord,
      parking.y_coord,
      parking.address,
      parking.id,
      parking.time,
    ]
  );

  return result.rowCount === 1;
};

const deleteParking = (id) => {
  const result = executeQuery(
    `
  DELETE
  FROM t_parkings
  WHERE id = $1
  `,
    [id]
  );

  result.rowCount === 1;
};

module.exports = {
  getParking,
  getAllParkings,
  creatParking,
  updateParking,
  deleteParking,
};
