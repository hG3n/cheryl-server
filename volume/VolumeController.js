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
        let result = await getSystemVolume();
        if (result) return res.status(200).send(result);
        return res.status(500).send({success: false, message: "Error executing command!"});

    } catch (error) {
        console.error(error);
        return res.status(500).send({result: {message: "There was an error importing the data!"}});
    }
});

router.post('/', async function (req, res) {
    try {
        const value = req.body.value;
        // const result = await setSystemVolume(value);
        if (setSystemVolume(value)) return res.status(200).send({success: true});
        return res.status(500).send({success: false, message: "Error executing command!"});
    } catch (error) {
        console.error(error);
        return res.status(500).send({result: {message: "There was an error importing the data!"}});
    }
});

router.post('/raise/', async function (req, res) {
    try {
        const result = await setRelativeSystemVolume('+', req.body.precision);
        if (result) return res.status(200).send(value);
        return res.status(500).send({success: false, message: "Error setting value!"});
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

router.post('/mute/', async function (req, res) {
    try {
        const result = await muteSystem(req.body.mute).then(
            (value) => {
                if (value)
                    return res.status(200).send(value);
                return res.status(500).send({success: false, message: "Error executing Command"});
            },
            () => {
                return res.status(500).send({success: false, message: "Error executing Command"});
            }
        )
    } catch (error) {
        console.error(error);
        return res.status(500).send({result: {message: "There was an error importing the data!"}});
    }
});


function setSystemVolume(volume) {
    const command = constants.commands.volume.set + ` ${volume}`;
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            if (err) {
                console.log("Error executing:", command);
                reject({success: false})
            }
            resolve(extractVolumeLevel(stdout));
        });
    });
}

function setRelativeSystemVolume(prefix, precise) {
    let value = precise ? '2%' : '5%';
    console.log('vol commands', constants.commands);
    const command = constants.commands.volume.set + ` ${value}${prefix}`;
    console.log('cmd', command);
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            if (err) {
                console.log("Error executing:", command);
                reject();
            }
            resolve(extractVolumeLevel(stdout));
        });

    });
}

function getSystemVolume() {
    const command = constants.commands.volume.get;
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.warn("Error executing:", command);
                reject();
            }
            resolve(extractVolumeLevel(stdout));
        });
    });
}

function extractVolumeLevel(stdout) {

    const lines = stdout.split("\n");

    const lines_filtered = [];
    for (const line of lines) {
        const res = line.indexOf('[on]');
        if (res > 0) {
            lines_filtered.push(line);
        }
    }

    // filter left and right lines
    const left_line = lines_filtered[0];
    const right_line = lines_filtered[1];

    // left and right splitted at Payback leave the values in the second array
    const left_splitted = left_line.split("Playback")[1];
    const right_splitted = right_line.split("Playback")[1];

    const left = parseInt(findVolumeLevel(left_splitted));
    const right = parseInt(findVolumeLevel(right_splitted));

    return {
        volumes: {
            left: {pct: left},
            right: {pct: right},
            master: {pct: (left + right) / 2}
        }
    };
}

function findVolumeLevel(array) {
    const val_start = array.indexOf('[')
    const val_end = array.indexOf(']')
    const diff = val_end - val_start;
    if (diff < 2) {
        return `${array[l_val_start + 1]}`
    }
    return `${array[val_start + 1]}${array[val_start + 2]}`;
}

function muteSystem(mute) {
    const value = mute ? 'mute' : 'unmute';
    const command = constants.commands.volume.set + ` ${value}`;
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            if (err) {
                console.log("Error executing:", command);
                reject();
            }
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            resolve({success: true});
        });

    });
}


module.exports = router;
