var redis = require('redis');
var client = redis.createClient('6379', '39.107.61.35');
client.on("error", function (err) {
    console.log("Error" + err);
});
client.set("string key", "stringval", redis.print);
client.hset("hash key", "hashtest 1", "some value", redis.print);
client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
client.hkeys("hash key", function (err, replies) {
    console.log(replies.length + " replies:");
    replies.forEach(function (reply, i) {
        console.log("    " + i + ":" + reply);
    });
    client.quit();
});