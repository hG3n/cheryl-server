const express = require( 'express' );
const app = express();

let InfoController = require('./info/InfoController');
app.use('/export', InfoController);

let VolumeController = require('./volume/VolumeController');
app.use('/export', VolumeController);

module.exports = app;
