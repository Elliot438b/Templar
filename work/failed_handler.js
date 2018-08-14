const Eos = require('../src/index');
const raq = require("redis-as-queue");
const eos = Eos({
    httpEndpoint: 'http://127.0.0.1:8000',
    chainId: '1c6ae7719a2a3b4ecb19584a30ff510ba1b6ded86e1fd8b8fc22f1179c622a32',
    expireInSeconds: 120,
    broadcast: false,
    verbose: false
});
const config = {
    queue_listen_interval: 100, // ms
    queueResName: 'action_res_queue',
    queueFailedName: 'action_failed_queue',
    redisUrl: '39.107.61.35',
    redisPort: 6379,
    listen_queue: true,
    ok: true,
    no: false
};
const failedQueue = new raq.UniqueQueue(config.queueFailedName, config.redisPort, config.redisUrl, {});
const resQueue = new raq.NormalQueue(config.queueResName, config.redisPort, config.redisUrl, {});

function failedQueueConsume() {
    failedQueue.get(100, function (err, messages) {
            let dealMessages = messages;
            removeMessageUnique(failedQueue, messages);
            if (err != null) {
                console.log(err);
                return;
            }
            if (dealMessages != null) {
                for (let i = 0; i < dealMessages.length; i++) {
                    let dealMsg = dealMessages[i].message;
                    eos.abiBinToJson("eosio.token", "transfer", dealMsg).then(ret => {
                        resQueueProductor(ret.args.memo, "failed", 500, resQueue);
                    });
                }
            } else {
                return;
            }
        }
    )
}

function resQueueProductor(uuid, status, code) {
    let action_res = '{"code":"' + code + '","status":"' + status + '","uuid":"' + uuid + '"}';
    console.log(action_res);
    resQueue.push(action_res, function (err) {
        if (err != null) console.log(err);
    });
}

function removeMessageUnique(queue, messages) {
    if (messages != null && typeof messages != undefined) {
        queue.removeMessages(messages, function (err, removeCount, notRemovedMessages) {
            if (err != null) {
                console.log(err);
            }
            if (notRemovedMessages.length > 0) {
                removeMessageUnique(notRemovedMessages);
            }
        });
    }
}

// init
failedQueueConsume();

/**
 * listening queue
 */
if (config.listen_queue) {
    let interval = setInterval(function () {
        failedQueueConsume();
    }, config.queue_listen_interval);
}