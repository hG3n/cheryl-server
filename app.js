const express = require( 'express' );
const app = express();

let InfoController = require('./info/InfoController');
app.use('/info', InfoController);

let VolumeController = require('./volume/VolumeController');
app.use('/volume', VolumeController);

module.exports = app;
