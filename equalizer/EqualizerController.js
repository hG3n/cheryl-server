const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const {exec} = require('child_process');
const constants = require('../constants');

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

const fs = require('fs');
const util = require('util');

router.get('/', async function (req, res) {
    try {
        let result = getEqualizerLevel();
        Promise.all(result).then(
            (values) => {
                return res.status(200).send(values);
            }
        );
        // return res.status(500).send({success: false, message: "Error executing command!"});
    } catch (error) {
        console.error(error);
        return res.status(500).send({result: {message: "There was an error importing the data!"}});
    }
});

router.put('/:position/:value', async function (req, res) {
    try {
        const result = await setEqualizerLevel(req.params.position, req.params.value);
        if (result) return res.status(200).send(result);
        return res.status(500).send({success: false, message: "Error executing command!"});
    } catch (error) {
        console.error(error);
        return res.status(500).send({result: {message: "There was an error importing the data!"}});
    }
});

router.post('/raise/', async function (req, res) {
    try {
        const result = await setRelativeSystemVolume('+', req.body.precision).then(
            (value) => {
                if (value)
                    return res.status(200).send(value);
                return res.status(500).send({success: false, message: "Error setting value!"});
            },
            () => {
                return res.status(500).send({success: false, message: "Error executing Command"});
            }
        );
    } catch (error) {
        console.error(error);
        return res.status(500).send({result: {message: "There was an error importing the data!"}});
    }
});

router.post('/lower/', async function (req, res) {
    try {
        const result = await setRelativeSystemVolume('-', req.body.precision).then(
            (value) => {
                if (value)
                    return res.status(200).send(value);
                return res.status(500).send({success: false, message: "Error setting value!"});
            },
            () => {
                return res.status(500).send({success: false, message: "Error executing Command"});
            }
        );
    } catch (error) {
        console.error(error);
        return res.status(500).send({result: {message: "There was an error importing the data!"}});
    }
});

function getEqualizerLevel() {
    const levels = [];

    for (const element of constants.equalizer.frequencies) {
        const command = constants.commands.equalizer.get + ` "${element.property}"`;
        const p = new Promise((resolve, reject) => {
            exec(command, (err, stdout, stderr) => {
                if (err) {
                    console.log("Error executing:", command);
                    reject();
                }
                const res = {
                    channel: element,
                    volume: extractVolumeLevel(stdout)
                };
                resolve(res);
            });

        });
        levels.push(p);
    }

    return levels;
}

function setEqualizerLevel(handle_position, level) {

    const element = constants.equalizer.frequencies.find(value => value.position === handle_position);
    console.log('found element', element);
    const command = constants.commands.equalizer.set + ` "${element.property}" ${level}%`;
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            if (err) {
                console.log("Error executing:", command);
                reject();
            }

            const res = {
                channel: element,
                volume: extractVolumeLevel(stdout)
            };
            resolve(res);
        });
    });
}

function extractVolumeLevel(stdout) {

    const lines = stdout.split("\n");

    let line_nr = 0;
    for (const line of lines) {
        const res = line.indexOf('Mono:');
        if (res > 0) {
            break
        }
        ++line_nr;
    }

    // filter left and right lines
    const left_line = lines[line_nr + 1];
    const right_line = lines[line_nr + 2];

    // console.log('lines', left_line, right_line);
    // left and right splitted at Payback leave the values in the second array
    const left_splitted = left_line.split("Playback")[1];
    const right_splitted = right_line.split("Playback")[1];
    // console.log('splitted:', left_splitted, right_splitted);

    const left = parseInt(findVolumeLevel(left_splitted));
    const right = parseInt(findVolumeLevel(right_splitted));
    // console.log('left:', left); console.log('righ:', right);


    return {
        volumes: {
            left: {pct: left},
            right: {pct: right},
            master: {pct: (left + right) / 2}
        }
    };
}

function findVolumeLevel(array) {
    const val_start = array.indexOf('[');
    const val_end = array.indexOf(']');
    const diff = val_end - val_start;
    if (diff < 2) {
        return `${array[l_val_start + 1]}`
    }
    return `${array[val_start + 1]}${array[val_start + 2]}`;
}

module.exports = router;
