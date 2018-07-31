const http = require('http');
// const createAccount = require('./src/createAccount.js');
// const queryAccount = require('./src/queryAccount.js');
// const getActions = require('./src/getActions.js');
// const getCurrencyBalance = require('./src/getCurrencyBalance.js');
const url = require('url');
const outputmsg = require('./outputmsg.js');
const pushtransactions = require('./pushtransactions.js');
const consumer = require('./consumer.js');
const pushTX = require('./src/push_tx.js');
const raq = require("redis-as-queue");
const config = {
    queueReqName: 'action_queue',
    queueResName: 'action_res_queue',
    redisUrl: '39.107.152.239',
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

function onRequest(req, res) {
    if (req.url !== "/favicon.ico") {
        let p = url.parse(req.url, true);
        let query = p.query;

        if (p.pathname == '/pushtransactions') {
            if (query.txs) {
                let txsstr = decodeURI(query.txs);
                let txs = JSON.parse(txsstr);
                if (txs.hasOwnProperty("to") && txs.hasOwnProperty("quantity") && txs.hasOwnProperty("memo")) {
                    let hash = txs.memo % 10;
                    if (hash == 1) {
                        pushtransactions(txsstr, reqQueue01)
                    } else if (hash == 2) {
                        pushtransactions(txsstr, reqQueue02)
                    } else if (hash == 3) {
                        pushtransactions(txsstr, reqQueue03)
                    } else if (hash == 4) {
                        pushtransactions(txsstr, reqQueue04)
                    } else if (hash == 5) {
                        pushtransactions(txsstr, reqQueue05)
                    } else if (hash == 6) {
                        pushtransactions(txsstr, reqQueue06)
                    } else if (hash == 7) {
                        pushtransactions(txsstr, reqQueue07)
                    } else if (hash == 8) {
                        pushtransactions(txsstr, reqQueue08)
                    } else if (hash == 9) {
                        pushtransactions(txsstr, reqQueue09)
                    } else {
                        pushtransactions(txsstr, reqQueue)
                    }
                    outputmsg(res, "success")
                } else
                    outputmsg(res, 'txs has not enough param ,check again!')
            }
            else
                outputmsg(res, 'no txs para ,check again!')
        } else if (p.pathname == '/consumeTrxRes') {
            consumer(resQueue);
            // consumer(reqQueue);
            // consumer(reqQueue01);
            // consumer(reqQueue02);
            // consumer(reqQueue03);
            // consumer(reqQueue04);
            // consumer(reqQueue05);
            // consumer(reqQueue06);
            // consumer(reqQueue07);
            // consumer(reqQueue08);
            // consumer(reqQueue09);
            outputmsg(res, "success");
        } else if (p.pathname == '/checkQueue') {
            checkQueue();
            outputmsg(res, "success");
        } else if (p.pathname == '/pushTX') {
            if (query.txs) {
                let txsstr = decodeURI(query.txs);
                let txs = JSON.parse(txsstr);
                pushTX(txs.to, txs.quantity, txs.memo);
                outputmsg(res, "success");
            }
        }
        // else if (p.pathname == '/createAccount') {
        //     if (query.accountName && query.publicKey)
        //         createAccount(query.accountName, query.publicKey, res)
        //     else
        //         console.log('no accountName,please check parament')
        // }
        // else if (p.pathname == '/queryAccount') {
        //     if (query.accountName)
        //         queryAccount(query.accountName, res)
        //     else
        //         console.log('no accountName,please check parament')
        // }
        // else if (p.pathname == '/getActions') {
        //     if (query.accountName && query.pos && query.offset) {
        //         getActions(query.accountName, query.pos, query.offset).then((ret) => outputmsg(res, JSON.stringify(ret)))
        //     }
        //     else
        //         console.log('no enough params,please check parament')
        // }
        // else if (p.pathname == '/getCurrencyBalance') {
        //     if (query.accountName) {
        //         let symbol = "";
        //         if (query.symbol != "") symbol = query.symbol
        //         getCurrencyBalance(query.accountName, symbol).then((ret) => outputmsg(ret))
        //     }
        //     else
        //         console.log('no enough params,please check parament')
        // }
        else
            outputmsg(res, 'no method match,please check params!');
    }
}

const server = http.createServer(onRequest).listen(88);

server.on('error', function (e) {
    if (e.code === 'EADDRINUSE')
        console.log("addr:port had already occupyed!");
    else if (e.code === 'ECONNRESET')
        console.log("socker timeout!");
    else
        console.log("error had happened,code:" + e.code);
});


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
