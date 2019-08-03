const express = require('express');
const app = express();
const db = require('db');
const morgan = require('morgan');

app.use(morgan('dev'));

let InfoController = require('./info/InfoController');
app.use('/info', InfoController);

let VolumeController = require('./volume/VolumeController');
app.use('/volume', VolumeController);

let EqualizerController = require('./equalizer/EqualizerController');
app.use('/equalizer', EqualizerController);

module.exports = app;
