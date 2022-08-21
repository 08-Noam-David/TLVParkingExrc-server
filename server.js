const express = require('express');
const shortid = require('shortid');
const cors = require('cors');
const { getParkings, updateParkings } = require('./utils');
const PORT = 3000;

const app = express();
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
})

//Endpoints

app.get('/api/parking/:id', async (req, res) => {
  const parkingId = req.params.id;
  const parkings = await getParkings(); 
  requestedParking = parkings.find((parking) => parking.id === parkingId);

  if (!requestedParking) {
    res.status(404).send(`parking ${parkingId} not found`);
  } else {
    res.send(requestedParking);
  }
});
app.get('/api/parkings', async (req, res) => {
  const parkings = await getParkings();

  if (!parkings || !parkings.length) {
    res.status(404).send(`Parkings do not exist`);
  } else {
    res.send(parkings);
  }
});

//  Create
app.post('/api/parking', async (req, res) => {
  const parkings = await getParkings();
  const newParking = {
    id: shortid.generate(),
    x_coord: req.body.x_coord,
    y_coord: req.body.y_coord,
    address: req.body.address,
    time: Date.now(),
  };

  parkings.push(newParking);
  await updateParkings(parkings);
  res.send(newParking);
});

app.put('/api/parking', async (req, res) => {
  const id = req.body.id;
  const parkings = await getParkings();
  
  let updatedParkings = parkings.map((parking) =>
    parking.id === id ? req.body : parking
  );

  await updateParkings(updatedParkings);
  res.send(req.body);
});

//Delete
app.delete('/api/parking/:id', async (req, res) => {
  const parkingId = req.params.id;
  const parkings = await getParkings();

  //findIndex+splice
  const indexToRemove = parkings.findIndex(
    (parking) => parking.id === parkingId
  );

  if (indexToRemove === -1) {
    res.status(404).send('Parking not found. Deletion failed.');
  } else {
    parkings.splice(indexToRemove, 1);
    await updateParkings(parkings);
    res.send(`Parking ${parkingId} has been deleted`);
  }
});

app.listen(PORT, function (err) {
  if (err) {
    console.log('Error in server setup');
  }
  console.log('Server listening on Port', PORT);
});
