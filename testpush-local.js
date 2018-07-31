const raq = require("redis-as-queue");
const config = {
    queueReqName: 'action_queue',
    queueResName: 'action_res_queue',
    redisUrl: '127.0.0.1',
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

const nameRule = "12345abcdefghijklmnopqrstuvwxyz"

function randomInt(max) {
    return Math.floor(Math.random() * (max + 1));
}

for (let i = 0; i < 20000; i++) {
    let to = "eosiotestb1"
    let quantity = "0.0001 SYS"
    let memo = i
    let hash = i % 10;
    let txs = '{"to":"' + to + '","quantity":"' + quantity + '","memo":"' + memo + '"}';
    if (hash == 1) {
        pushtransactions(txs, reqQueue01)
    } else if (hash == 2) {
        pushtransactions(txs, reqQueue02)
    } else if (hash == 3) {
        pushtransactions(txs, reqQueue03)
    } else if (hash == 4) {
        pushtransactions(txs, reqQueue04)
    } else if (hash == 5) {
        pushtransactions(txs, reqQueue05)
    } else if (hash == 6) {
        pushtransactions(txs, reqQueue06)
    } else if (hash == 7) {
        pushtransactions(txs, reqQueue07)
    } else if (hash == 8) {
        pushtransactions(txs, reqQueue08)
    } else if (hash == 9) {
        pushtransactions(txs, reqQueue09)
    } else {
        pushtransactions(txs, reqQueue)
    }
}

function pushtransactions(txsstr, queue) {
    console.log(queue.queueName + " push：" + txsstr);
    queue.push(txsstr, function (err) {
        if (err != null) console.log(err);
    });
    return "success"
}

