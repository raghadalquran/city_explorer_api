'use strict';
// Load Environment Variables from the .env file
require('dotenv').config();
// Application Dependencies
const express = require('express');
const cors = require('cors');

// Application Setup
const PORT = process.env.PORT || 4000;
const app = express();
app.use(cors());
// API Routes
app.get('/', (request, response) => {
  response.status(200).send('It Works!');
});
app.get('/bad', (request, response) => {
  throw new Error('oh nooooo!');
});

app.get('/location', (request, response) => {
  try {
    const geoData = require('./data/geo.json');
    const city = request.query.city;
    const locationData = new Location(city, geoData);
    response.status(200).json(locationData);
  } catch (error) {
    errorHandler(error, request, response);
  }
});

app.get('/weather',(req,res)=>{
  const skyData = require('./data/darksky.json');
  const city = req.query.city;
  const weatherData = new Weather(city,skyData);
  res.send(weatherData);
});

app.use('*', notFoundHandler);
//The constructor function of the Location
function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
}
let arrOfResult = [];
//The constructor function of the Weather
function Weather(city,skyData){
  skyData.data.forEach((val,i){
    this.forecast=skyData.data[i].weather.description;
    this.time=skyData.data[i].valid_date;
    arrOfResult.push(this);
  });
  return arrOfResult;
}
// HELPER FUNCTIONS
function notFoundHandler(request, response) {
  response.status(404).send('NOT FOUND!!');
}
function errorHandler(error, request, response) {
  response.status(500).send(error);
}
// Make sure the server is listening for requests
app.listen(PORT, () => console.log(`the server is up and running on ${PORT}`));
