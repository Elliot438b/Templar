const raq = require("redis-as-queue");
const config = {
    queueReqName: 'action_queue',
    queueResName: 'action_res_queue',
    redisUrl: '39.107.61.35',
    redisPort: 6379
};
const reqQueue = new raq.NormalQueue(config.queueReqName, config.redisPort, config.redisUrl, {});
const resQueue = new raq.NormalQueue(config.queueResName, config.redisPort, config.redisUrl, {});

const nameRule = "12345abcdefghijklmnopqrstuvwxyz"

function randomInt(max) {
    return Math.floor(Math.random() * (max + 1));
}

for (let i = 0; i < 1002; i++) {
    let to = "eosiotestb1"
    let quantity = "0.0001 SYS"
    let memo = i
    let txs = '{"to":"' + to + '","quantity":"' + quantity + '","memo":"' + memo + '"}';
    pushtransactions(txs, reqQueue)
}

function pushtransactions(txsstr, queue) {
    console.log(queue.queueName + " push：" + txsstr);
    queue.push(txsstr, function (err) {
        if (err != null) console.log(err);
    });
    return "success"
}

