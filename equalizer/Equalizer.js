const mongoose = require('mongoose');
const MongoPaging = require('mongo-cursor-pagination');
MongoPaging.config.MAX_LIMIT = 100000;

const EqualizerSchema = new mongoose.Schema({
    _id: String,
    title: String,
    frequencies: [
        {
            name: String,
            property: String,
            position: Number,
            value: Number,
        },
    ]
});


mongoose.model('Equalizer', EqualizerSchema);

module.exports = mongoose.model('Equalizer');
