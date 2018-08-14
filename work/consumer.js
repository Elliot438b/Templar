function consumer(queue, empty, unique) {
    if (unique) {
        queue.get(-1, function (err, messages) {
            if (err != null) console.log(err);
            // let args = [];
            // for (let i = 0; i < messages.length; i++) {
            //     args.push(messages[i].message);
            // }
            // let nary = args.sort();
            // for (let i = 0; i < nary.length; i++) {
            //     if (nary[i] == nary[i + 1]) {
            //         console.log("数组重复内容：" + nary[i]);
            //     }
            // }
            console.log(queue.queueName + " unconsumed:" + messages.length);
        });
    } else {
        queue.get(-1, function (err, messages) {
            if (err != null) console.log(err);
            let args = [];
            for (let i = 0; i < messages.length; i++) {
                let msg = messages[i];
                let msgObj = JSON.parse(msg);
                args.push(msgObj.uuid);
            }
            let nary = args.sort();
            for (let i = 0; i < nary.length; i++) {
                if (nary[i] == nary[i + 1]) {
                    console.log("数组重复内容：" + nary[i]);
                }
            }

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
    }
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
    queueResName: 'action_res_queue',
    queueFailedName: 'action_failed_queue',
    redisUrl: '39.107.61.35',
    redisPort: 6379
};
const raq = require("redis-as-queue");
const resQueue = new raq.NormalQueue(config.queueResName, config.redisPort, config.redisUrl, {});
const failedQueue = new raq.UniqueQueue(config.queueFailedName, config.redisPort, config.redisUrl, {});
consumer(resQueue, false, false);
consumer(failedQueue, false, true);
module.exports = consumer;
