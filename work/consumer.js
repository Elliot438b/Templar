function consumer(queue, empty) {
    queue.get(-1, function (err, messages) {
        if (err != null) console.log(err);
        let counter_200 = 0;
        let counter_500 = 0;
        for (let key in messages) {
            let msg = messages[key];
            let msgObj = JSON.parse(msg);
            if (msgObj.code == 200) {
                counter_200++;
            } else if (msgObj.code == 500) {
                counter_500++;
            }
        }
        console.log(queue.queueName + " get:" + messages.length + ", success:" + counter_200 + ", failed:" + counter_500);
    });
    // queue.get(-1, function (err, messages) {
    //     if (err != null) console.log(err);
    //     if (messages.length) {
    //         for (let key in messages) {
    //             let msg = messages[key].message;
    //             console.log(msg);
    //         }
    //     }
    // });
    if (empty) {
        queue.removeAmount(-1, function (err) {
            if (err != null) console.log(err);
        });
    }
}
const config = {
    queueReqName: 'action_queue',
    queueResName: 'action_res_queue',
    redisUrl: '39.107.61.35',
    redisPort: 6379
};
const raq = require("redis-as-queue");
const resQueue = new raq.NormalQueue(config.queueResName, config.redisPort, config.redisUrl, {});
consumer(resQueue, false);
module.exports = consumer;
