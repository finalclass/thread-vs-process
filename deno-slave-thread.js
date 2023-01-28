// const { parentPort } =  require("worker_threads");

self.onmessage = event => {
    self.postMessage(event.data);
};
