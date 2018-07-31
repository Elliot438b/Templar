const http = require('http');
// const createAccount = require('./src/createAccount.js');
// const queryAccount = require('./src/queryAccount.js');
// const getActions = require('./src/getActions.js');
// const getCurrencyBalance = require('./src/getCurrencyBalance.js');
const url = require('url');
const outputmsg = require('./outputmsg.js');
const pushtransactions = require('./pushtransactions.js');
const checkQueue = require('./check-queue.js');
const consumer = require('./consumer.js');
const pushTX = require('./src/push_tx.js');
const raq = require("redis-as-queue");
const config = {
    queueReqName: 'action_queue',
    queueResName: 'action_res_queue',
    redisUrl: '39.107.61.35',
    redisPort: 6379
};
const reqQueue = new raq.NormalQueue(config.queueReqName, config.redisPort, config.redisUrl, {});
const resQueue = new raq.NormalQueue(config.queueResName, config.redisPort, config.redisUrl, {});

function onRequest(req, res) {
    if (req.url !== "/favicon.ico") {
        let p = url.parse(req.url, true);
        let query = p.query;

        if (p.pathname == '/pushtransactions') {
            if (query.txs) {
                let txsstr = decodeURI(query.txs);
                let txs = JSON.parse(txsstr);
                if (txs.hasOwnProperty("to") && txs.hasOwnProperty("quantity") && txs.hasOwnProperty("memo")) {
                    pushtransactions(txsstr, reqQueue)
                    outputmsg(res, "success")
                } else
                    outputmsg(res, 'txs has not enough param ,check again!')
            }
            else
                outputmsg(res, 'no txs para ,check again!')
        } else if (p.pathname == '/consumeTrxRes') {
            consumer(resQueue);
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
