const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const {exec} = require('child_process');

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

const fs = require('fs');
const util = require('util');

router.post('get/', async function (req, res) {
    try {
        const value = req.body.value;
        if (getSystemVolume(value)) return res.status(200).send({success: true});
        return res.status(500).send({success: false, message: "Error executing command!"});
    } catch (error) {
        console.error(error);
        return res.status(500).send({result: {message: "There was an error importing the data!"}});
    }
});

router.post('set/', async function (req, res) {
    try {
        const value = req.body.value;
        if (setSystemVolume(value)) return res.status(200).send({success: true});
        return res.status(500).send({success: false, message: "Error executing command!"});
    } catch (error) {
        console.error(error);
        return res.status(500).send({result: {message: "There was an error importing the data!"}});
    }
});

router.post('increment/', async function (req, res) {
    try {
        if(setRelativeSystemVolume('+', req.body.precise)) {
            return res.status(200).send({success: true});
        }
        return res.status(500).send({success: true});
    } catch (error) {
        console.error(error);
        return res.status(500).send({result: {message: "There was an error importing the data!"}});
    }
});

router.post('decrement/', async function (req, res) {
    try {
        if(setRelativeSystemVolume('-', req.body.precise)) {
            return res.status(200).send({success: true});
        }
        return res.status(500).send({success: true});
    } catch (error) {
        console.error(error);
        return res.status(500).send({result: {message: "There was an error importing the data!"}});
    }
});


router.post('mute/', async function (req, res) {
    try {
        if(muteSystem(req.body.mute)){
            return res.status(200).send({success: true});
        }
        return res.status(500).send({success: true});
    } catch (error) {
        console.error(error);
        return res.status(500).send({result: {message: "There was an error importing the data!"}});
    }
});


function setSystemVolume(volume) {
    const command = `amixer set Speaker ${volume}`;
    exec(command, (err, stdout, stderr) => {
        if (err) {
            console.log("Error executing:", command);
            return false;
        }

        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        return true
    });
    return false;
}

function setRelativeSystemVolume(prefix, precise) {
    let value = precise ? '2%' : '5%';
    const command = `amixer set Speaker ${value}${prefix}`;
    exec(command, (err, stdout, stderr) => {
        if (err) {
            console.log("Error executing:", command);
            return false;
        }

        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        return true
    });
    return false;
}

function getSystemVolume() {
    const command = `amixer get Speaker`;
    exec(command, (err, stdout, stderr) => {
        if (err) {
            console.log("Error executing:", command);
            return false;
        }

        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        return true
    });
    return false;
}

function muteSystem(mute) {
    const value = mute ? 'mute' : 'unmute';
    const command = `amixer set Speaker ${value}`;
    exec(command, (err, stdout, stderr) => {
        if (err) {
            console.log("Error executing:", command);
            return false;
        }

        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        return true
    });
    return false;
}


module.exports = router;
