const { Client } = require('pg');

const createClient = () =>
  new Client({
    user: 'postgres',
    password: '123',
    host: 'localhost',
    port: 5432,
    database: 'tlvparking',
  });

const getParking = async (id) => {
  const client = createClient();
  try {
    await createClient();
    return (await client.query(`
    SELECT *
    FROM t_parkings
    WHERE parking_id = $1::serial;
    `, [id]))[0];
    console.log('connected');
  } finally {
    await client.end();
  }
};

module.exports = { getParking };
