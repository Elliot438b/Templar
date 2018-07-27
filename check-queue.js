const raq = require("redis-as-queue");
const config = {
    queueReqName: 'action_queue',
    queueResName: 'action_res_queue',
    redisUrl: '39.107.61.35',
    redisPort: 6379
};
const reqQueue = new raq.UniqueQueue(config.queueReqName, config.redisPort, config.redisUrl, {});
const reqQueue01 = new raq.UniqueQueue(config.queueReqName + "01", config.redisPort, config.redisUrl, {});
const reqQueue02 = new raq.UniqueQueue(config.queueReqName + "02", config.redisPort, config.redisUrl, {});
const reqQueue03 = new raq.UniqueQueue(config.queueReqName + "03", config.redisPort, config.redisUrl, {});
const reqQueue04 = new raq.UniqueQueue(config.queueReqName + "04", config.redisPort, config.redisUrl, {});
const reqQueue05 = new raq.UniqueQueue(config.queueReqName + "05", config.redisPort, config.redisUrl, {});
const reqQueue06 = new raq.UniqueQueue(config.queueReqName + "06", config.redisPort, config.redisUrl, {});
const reqQueue07 = new raq.UniqueQueue(config.queueReqName + "07", config.redisPort, config.redisUrl, {});
const reqQueue08 = new raq.UniqueQueue(config.queueReqName + "08", config.redisPort, config.redisUrl, {});
const reqQueue09 = new raq.UniqueQueue(config.queueReqName + "09", config.redisPort, config.redisUrl, {});
const resQueue = new raq.UniqueQueue(config.queueResName, config.redisPort, config.redisUrl, {});

function checkQueue() {
    reqQueue.length(function (err, msg) {
        console.log("reqQueue: " + msg);
    });
    reqQueue01.length(function (err, msg) {
        console.log("reqQueue01: " + msg);
    });
    reqQueue02.length(function (err, msg) {
        console.log("reqQueue02: " + msg);
    });
    reqQueue03.length(function (err, msg) {
        console.log("reqQueue03: " + msg);
    });
    reqQueue04.length(function (err, msg) {
        console.log("reqQueue04: " + msg);
    });
    reqQueue05.length(function (err, msg) {
        console.log("reqQueue05: " + msg);
    });
    reqQueue06.length(function (err, msg) {
        console.log("reqQueue06: " + msg);
    });
    reqQueue07.length(function (err, msg) {
        console.log("reqQueue07: " + msg);
    });
    reqQueue08.length(function (err, msg) {
        console.log("reqQueue08: " + msg);
    });
    reqQueue09.length(function (err, msg) {
        console.log("reqQueue09: " + msg);
    });
}

checkQueue();