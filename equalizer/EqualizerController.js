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
        const result = await setRelativeSystemVolume('+', req.body.precision);
        if (result) return res.status(200).send(result);
        return res.status(500).send({success: false, message: "Error executing Command"});
    } catch (error) {
        console.error(error);
        return res.status(500).send({result: {message: "There was an error importing the data!"}});
    }
});

router.post('/lower/', async function (req, res) {
    try {
        const result = await setRelativeSystemVolume('-', req.body.precision);
        if (result) return res.status(200).send(result);
        return res.status(500).send({success: false, message: "Error executing Command"});
    } catch (error) {
        console.error(error);
        return res.status(500).send({result: {message: "There was an error importing the data!"}});
    }
});

router.post('/presets/', async function (req, res) {
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
                    levels: extractVolumeLevel(stdout)
                };
                resolve(res);
            });

        });
        levels.push(p);
    }

    return levels;
}

function setEqualizerLevel(handle_position, level) {
    const element = constants.equalizer.frequencies.find((el) => el.position === parseInt(handle_position));
    const command = constants.commands.equalizer.set + ` "${element.property}" ${level}%`;
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            if (err) {
                console.log("Error executing:", command);
                reject();
            }

            const res = {
                channel: element,
                levels: extractVolumeLevel(stdout)
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

    const left_line = lines[line_nr + 1];
    const left_muted = left_line.includes('[off]');
    const right_line = lines[line_nr + 2];
    const right_muted = right_line.includes('[off]');
    const left_splitted = left_line.split("Playback")[1];
    const right_splitted = right_line.split("Playback")[1];
    const left = parseInt(findVolumeLevel(left_splitted));
    const right = parseInt(findVolumeLevel(right_splitted));

    return {
        left: {pct: left, muted: left_muted},
        right: {pct: right, muted: right_muted},
        master: {pct: (left + right) / 2, muted: left_muted && right_muted}
    };
}

function findVolumeLevel(array) {
    const val_start = array.indexOf('[');
    const val_end = array.indexOf(']');
    const diff = val_end - val_start;
    if (diff === 3) {
        return `${array[val_start + 1]}`
    } else if (diff === 4) {
        return `${array[val_start + 1]}${array[val_start + 2]}`
    }
    return `${array[val_start + 1]}${array[val_start + 2]}${array[val_start + 3]}`;
}


module.exports = router;
