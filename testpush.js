const http = require('http');
var request = require('request');
const nameRule = "12345abcdefghijklmnopqrstuvwxyz"

function randomInt(max) {
    // parseInt(Math.random() * (max + 1), 10);
    return Math.floor(Math.random() * (max + 1));
}

for (let i = 0; i < 20000; i++) {
    // let com = nameRule.charAt(randomInt(30))
    // let to = "\"eosiotestb" + com + "\""
    let to = "eosiotestb1"
    let quantity = "0.0001 SYS"
    let memo = i
    let txs = '{"to":"' + to + '","quantity":"' + quantity + '","memo":"' + memo + '"}';
    console.log(txs)
    let encode = encodeURI(txs)
    console.log(encode)
    let url = "http://127.0.0.1:88/pushtransactions?txs=" + encode
    console.log(url)
    //let url = "http://127.0.0.1:88/pushtransactions?txs=%7b%22to%22%3a%22test%22%2c%22quantity%22%3a%221.0000+FZ%22%2c%22memo%22%3a%22uuid%22%7d"
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body) // Show the HTML for the baidu homepage.
        }
    })
}



