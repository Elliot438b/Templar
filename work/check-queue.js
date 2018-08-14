const raq = require("redis-as-queue");
const config = {
    queueReqName: 'action_queue',
    queueResName: 'action_res_queue',
    redisUrl: '39.107.61.35',
    redisPort: 6379
};
const reqQueue = new raq.NormalQueue(config.queueReqName, config.redisPort, config.redisUrl, {});
const resQueue = new raq.NormalQueue(config.queueResName, config.redisPort, config.redisUrl, {});

function checkQueue() {
    reqQueue.length(function (err, msg) {
        console.log("reqQueue: " + msg);
    });
}

checkQueue();
module.exports = checkQueue;
