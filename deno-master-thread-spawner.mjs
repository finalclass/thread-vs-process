// const { Worker } = require('worker_threads');
// import getWorker from './get-message.js';
// const getMessage = require('./get-message');

const worker = new Worker(new URL('./slave-thread.js', import.meta.url), { type: "module" });

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
    const RUN_SECS = Deno.env.get("RUN_SECS");

    if (!RUN_SECS) {
        console.error('RUN_SECS env variable is missing');
        Deno.exit(1);
    }
    
    setTimeout(() => {
        isRunning = false;
        worker.terminate();
        console.log('Processed ' + nofMessages + ' messages');
    }, RUN_SECS * 1000);
}

worker.onmessage = (event) => onMsg(event.data);
worker.postMessage({"msg": true });


