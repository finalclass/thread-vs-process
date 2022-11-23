const { fork } = require('child_process');
const getMessage = require('./get-message'); 

let nofMessages = 0;
let isRunning = true;

const slave = fork('./slave-process.js', [], {
    stdio: [ 'pipe', 'pipe', 'pipe', 'ipc' ]
});

slave.on('message', onMsg);

function onMsg(msg) {
    if (nofMessages === 0) {
        initKillTimer();
    }

    nofMessages += 1;

    if (isRunning) {
        slave.send(msg);
    }
}

function initKillTimer() {
    const RUN_SECS = process.env.RUN_SECS;

    if (!RUN_SECS) {
        console.error('RUN_SECS env variable is missing');
        process.exit(1);
    }
    
    setTimeout(() => {
        isRunning = false;
        slave.off('message', onMsg);
        slave.kill();
        console.log('Processed ' + nofMessages + ' messages');
    }, RUN_SECS * 1000);
}

slave.send(getMessage());

