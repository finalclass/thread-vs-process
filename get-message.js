if (process.env.MSG_SIZE === "small") {
    module.exports = () => require('./small-msg.json');
} else if (process.env.MSG_SIZE === "medium") {
    module.exports = () => require('./medium-msg.json');
} else if (process.env.MSG_SIZE === "big") {
    module.exports = () => require('./big-msg.json');
} else if (process.env.MSG_SIZE === "huge") {
    module.exports = () => require('./huge-msg.json');
} else if (process.env.MSG_SIZE === "bigstring") {
    module.exports = () => require('./bigstring-msg.json');
} else {
    console.error('MSG_SIZE env variable is missing');
    process.exit(1);
}
