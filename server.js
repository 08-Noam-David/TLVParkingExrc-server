const express = require('express');
const shortid = require('shortid');
const cors = require('cors');
const { getParkings, updateParkings } = require('./utils');
const {
  getParking,
  getAllParkings,
  creatParking,
  updateParking,
  deleteParking,
} = require('./database.js');
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
});

//Endpoints

app.get('/api/parking/:id', async (req, res) => {
  const id = req.params.id;
  const parking = await getParking(id);

  if (!parking) {
    res.status(404).send(`parking ${id} not found`);
  } else {
    res.send(parking);
  }
});

app.get('/api/parkings', async (req, res) => {
  const parkings = await getAllParkings();

  if (!parkings || !parkings.length) {
    res.status(404).send(`Parkings do not exist`);
  } else {
    res.send(parkings);
  }
});

//  Create
app.post('/api/parking', async (req, res) => {
  const newParking = {
    x_coord: req.body.x_coord,
    y_coord: req.body.y_coord,
    address: req.body.address,
    time: new Date().toISOString(),
  };

  const result = await creatParking(newParking);
  if (result) {
    res.send(newParking);
  } else {
    res.status(500).send('Something went wrong');
  }
});

app.put('/api/parking', async (req, res) => {
  const id = req.body.id;
  const oldParking = await getParking(id);

  if (oldParking) {
    const updatedParking = {
      id,
      x_coord: req.body.x_coord ?? oldParking.x_coord,
      y_coord: req.body.y_coord ?? oldParking.y_coord,
      address: req.body.address ?? oldParking.address,
      time: req.body.time ?? oldParking.time,
    };

    const result = await updateParking(updatedParking);

    if (result) {
      res.send(updatedParking);
    } else {
      res.status(500).send('Something went wrong');
    }
  } else {
    res.status(404).send("The parking you wanted to update doesn't exist");
  }
});

//Delete
app.delete('/api/parking/:id', async (req, res) => {
  const id = req.params.id;
  const toBeDeleted = await getParking(id);

  if (toBeDeleted) {
    const result = await deleteParking(id);

    if (result) {
      res.send(toBeDeleted);
    } else {
      res.status(500).send('Something went wrong');
    }
  } else {
    res.status(404).send("The parking you wanted to update doesn't exist");
  }
});

app.listen(PORT, function (err) {
  if (err) {
    console.log('Error in server setup');
  }
  console.log('Server listening on Port', PORT);
});