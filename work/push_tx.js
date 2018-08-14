const Eos = require('../src');
const raq = require("redis-as-queue");
const keyProvider = "5JxWkyTDwktJVs9MNgNgmaLrRc26ESswR9gk926g47t6UCqvmop";
const fz_owner = "eosiotesta1";
const eos = Eos({
    httpEndpoint: 'http://39.107.152.239:8000',
    chainId: '1c6ae7719a2a3b4ecb19584a30ff510ba1b6ded86e1fd8b8fc22f1179c622a32',
    keyProvider: keyProvider,
    expireInSeconds: 60,
    broadcast: false,
    verbose: false
});
const config = {
    trx_pool_size: 5,
    action_pool_size: 10,
    queue_listen_interval: 10, // ms
    optBCST: {expireInSeconds: 120, broadcast: true},
    optLocal: {expireInSeconds: 60, broadcast: false},
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
    return {
        add: function (k, v) {
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
            delete pool[k];
        },
        getPool: function (k) {
            return pool;
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

function push_tx(to, quantity, memo) {
    actionPool.add(fz_owner, createTransferAction(fz_owner, to, quantity, memo));
    createTxLocalByActionPool(tx => {
        eos.pushTransaction(tx.transaction).then(ret => {
            console.log(ret.processed.action_traces[0].act.data.memo);
        })
    });
}

module.exports = push_tx