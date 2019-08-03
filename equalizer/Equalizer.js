const mongoose = require('mongoose');
const MongoPaging = require('mongo-cursor-pagination');
MongoPaging.config.MAX_LIMIT = 100000;

const EqualizerSchema = new mongoose.Schema({
    _id: String,
    title: String,
    equalizers: [
        {
            channel: {
                name: "31 Hz",
                property: "00. 31 Hz",
                position: 0,
            },
            levels: {
                master: {pct: 50, muted: false},
                left: {pct: 50, muted: false},
                right: {pct: 50, muted: false},
            }
        },
        {
            channel: {
                name: "63 Hz",
                property: "01. 63 Hz",
                position: 1
            },
            levels: {
                master: {pct: 50, muted: false},
                left: {pct: 50, muted: false},
                right: {pct: 50, muted: false},
            }
        },
        {
            channel: {
                name: "125 Hz",
                property: "02. 125 Hz",
                position: 2
            },
            levels: {
                master: {pct: 50, muted: false},
                left: {pct: 50, muted: false},
                right: {pct: 50, muted: false},
            }
        },
        {
            channel: {
                name: "250 Hz",
                property: "03. 250 Hz",
                position: 3
            },
            levels: {
                master: {pct: 50, muted: false},
                left: {pct: 50, muted: false},
                right: {pct: 50, muted: false},
            }
        },
        {
            channel: {
                name: "500 Hz",
                property: "04. 500 Hz",
                position: 4
            },
            levels: {
                master: {pct: 50, muted: false},
                left: {pct: 50, muted: false},
                right: {pct: 50, muted: false},
            }
        },
        {
            channel: {
                name: "1 kHz",
                property: "05. 1 kHz",
                position: 5
            },
            levels: {
                master: {pct: 50, muted: false},
                left: {pct: 50, muted: false},
                right: {pct: 50, muted: false},
            }
        },
        {
            channel: {
                name: "2 kHz",
                property: "06. 2 kHz",
                position: 6
            },
            levels: {
                master: {pct: 50, muted: false},
                left: {pct: 50, muted: false},
                right: {pct: 50, muted: false},
            }
        },
        {
            channel: {
                name: "4 kHz",
                property: "07. 4 kHz",
                position: 7
            },
            levels: {
                master: {pct: 50, muted: false},
                left: {pct: 50, muted: false},
                right: {pct: 50, muted: false},
            }
        },
        {
            channel: {
                name: "8 kHz",
                property: "08. 8 kHz",
                position: 8
            },
            levels: {
                master: {pct: 50, muted: false},
                left: {pct: 50, muted: false},
                right: {pct: 50, muted: false},
            }
        },
        {
            channel: {
                name: "16 kHz",
                property: "09. 16 kHz",
                position: 9
            },
            levels: {
                master: {pct: 50, muted: false},
                left: {pct: 50, muted: false},
                right: {pct: 50, muted: false},
            }
        },
    ]
});

mongoose.model('Equalizer', EqualizerSchema);

module.exports = mongoose.model('Equalizer');
