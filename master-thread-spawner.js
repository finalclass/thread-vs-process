const { Worker } = require('worker_threads');
const getMessage = require('./get-message');

const worker = new Worker('./slave-thread.js');

let nofMessages = 0;
let isRunning = true;

function onMsg(msg) {
    if (nofMessages === 0) {
        initKillTimer();
    }
    
    nofMessages += 1;

    if (isRunning) {
        worker.postMessage(msg);
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
        worker.off('message', onMsg);
        worker.terminate();
        console.log('Processed ' + nofMessages + ' messages');
    }, RUN_SECS * 1000);
}

worker.on('message', onMsg);
worker.postMessage(getMessage());

