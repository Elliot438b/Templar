const Eos = require('../src');
const raq = require("redis-as-queue");
const keyProvider = "5JxWkyTDwktJVs9MNgNgmaLrRc26ESswR9gk926g47t6UCqvmop";
const fz_owner = "eosiotesta1";
const eos = Eos({
    httpEndpoint: 'http://127.0.0.1:8000',
    chainId: '1c6ae7719a2a3b4ecb19584a30ff510ba1b6ded86e1fd8b8fc22f1179c622a32',
    keyProvider: keyProvider,
    expireInSeconds: 120,
    broadcast: false,
    verbose: false
});
const config = {
    trx_pool_size: 10,
    action_pool_size: 50,
    queue_listen_interval: 1, // ms
    optBCST: {expireInSeconds: 120, broadcast: true},
    optLocal: {expireInSeconds: 120, broadcast: false},
    queueReqName: 'action_queue',
    queueResName: 'action_res_queue',
    redisUrl: '39.107.61.35',
    redisPort: 6379,
    listen_queue: true,
    ok: true,
    no: false
};
const actionPool = function () {
    let pool = {};
    let size = 0;
    return {
        add: function (k, v) {
            size++;
            if (pool.hasOwnProperty(k)) {
                let temp = pool[k];
                if (temp instanceof Array) {
                    temp.push(v);
                    pool[k] = temp
                } else {
                    let actionArray = [];
                    actionArray.push(temp);
                    actionArray.push(v);
                    pool[k] = actionArray
                }
            } else {
                let actionArray = [];
                actionArray.push(v);
                pool[k] = actionArray;
            }
        },
        getV: function (k) {
            return pool[k];
        },
        remove: function (k) {
            size--;
            delete pool[k];
        },
        getPool: function (k) {
            return pool;
        },
        getSize: function () {
            return size;
        }
    }
}();
const txPool = function () {
    let pool = []
    return {
        push: function (obj) {
            pool.push(obj)
        },
        getSize: function () {
            return pool.length;
        },
        getPool: function () {
            return pool;
        },
        empty: function () {
            pool = []
        }
    }
}();

function createTransferAction(src, dest, quality, memo) {
    return {
        account: "eosio.token",
        name: 'transfer',
        authorization: [{
            actor: src,
            permission: 'active'
        }],
        data: {
            "from": src,
            "to": dest,
            "quantity": quality,
            "memo": memo
        }
    }
}

function createTxLocalByActionPool(callback) {
    let actionpl = actionPool.getPool();
    for (let key in actionpl) {
        let actionArray = actionpl[key];
        actionPool.remove(key);
        eos.transaction({
            actions: actionArray
        }, config.optLocal).then(callback)
    }
}

let start = new Date().getTime();
const reqQueue = new raq.NormalQueue(config.queueReqName, config.redisPort, config.redisUrl, {});
const resQueue = new raq.NormalQueue(config.queueResName, config.redisPort, config.redisUrl, {});
let req_empty_flag = false;

function reqQueuesConsume() {
    let size = config.action_pool_size;
    reqQueue.pop(size, function (err, replies) {
        if (err != null) {
            console.log(err);
            return;
        }
        let dealmsgs = [];
        replies.forEach(function (reply, index) {
            if (reply != null) {
                dealmsgs.push(reply);
            }
        });
        if (dealmsgs.length > 0) {
            console.log(reqQueue.queueName + " get: " + dealmsgs.length);
            if (dealmsgs.length == size) {
                for (let key in dealmsgs) {
                    let msg = dealmsgs[key];
                    let msgJson = JSON.parse(msg);
                    console.log(reqQueue.queueName + " get memo: " + msgJson.memo);
                    actionPool.add(fz_owner, createTransferAction(fz_owner, msgJson.to, msgJson.quantity, msgJson.memo));
                }
                createTxLocalByActionPool(tx => {
                        txPool.push(tx.transaction);
                        if (txPool.getSize() == config.trx_pool_size) {
                            var signTxs = txPool.getPool();
                            txPool.empty();
                            eos.pushTransactions(signTxs).then(ret => {
                                for (let i in ret) {
                                    let processed = ret[i].processed;
                                    // once trx failed, all of its actions failed.
                                    if (processed.error != null) {
                                        // ？？communication fault（e.g. RPC req）: once one of trxs failed, all of the trxs failed.
                                        // for (let j in signTxs) {
                                        //     let failed_actions = signTxs[j].transaction.actions;
                                        //     for (let k in failed_actions) {
                                        //         let hexData = failed_actions[k].data;
                                        //         eos.abiBinToJson("eosio.token", "transfer", hexData).then(ret => {
                                        //             resQueueProductor(ret.args.memo, "failed", 500, resQueue);
                                        //         });
                                        //     }
                                        // }
                                        console.log("item in pool failed...")
                                    } else {
                                        let actions = processed.action_traces;
                                        for (let key in actions) {
                                            resQueueProductor(actions[key].act.data.memo, "success", 200, resQueue);
                                        }
                                    }
                                }
                            });
                        }
                    }
                );
            } else { // Not full as a batch unit.
                for (let key in dealmsgs) {
                    let msg = dealmsgs[key].message;
                    let msgJson = JSON.parse(msg);
                    console.log(reqQueue.queueName + " get memo: " + msgJson.memo);
                    actionPool.add(fz_owner, createTransferAction(fz_owner, msgJson.to, msgJson.quantity, msgJson.memo));
                }

                createTxLocalByActionPool(tx => {
                    eos.pushTransaction(tx.transaction).then(ret => {
                        let processed = ret.processed;
                        if (processed.error != null) {
                            // let failed_actions = tx.transaction.transaction.actions;
                            // for (let k in failed_actions) {
                            //     let hexData = failed_actions[k].data;
                            //     eos.abiBinToJson("eosio.token", "transfer", hexData).then(ret => {
                            //         resQueueProductor(ret.args.memo, "failed", 500, resQueue);
                            //     });
                            // }
                            console.log("single item failed...")
                        } else {
                            let actions = processed.action_traces;
                            for (let key in actions) {
                                resQueueProductor(actions[key].act.data.memo, "success", 200, resQueue);
                            }
                        }
                    })
                });
            }
        } else { // Queue empty.
            req_empty_flag = true;
        }
    })
}

function resQueueProductor(uuid, status, code) {
    let action_res = '{"code":"' + code + '","status":"' + status + '","uuid":"' + uuid + '"}';
    resQueue.push(action_res, function (err) {
        if (err != null) console.log(err);
    });
}

// init
reqQueuesConsume();

/**
 * listening queue
 */
if (config.listen_queue) {
    let interval = setInterval(function () {
        if (req_empty_flag) {
            console.log("listening... " + (new Date().getTime() - start) + " ms");
            clearInterval(interval);
        }
        reqQueuesConsume();
    }, config.queue_listen_interval);
}