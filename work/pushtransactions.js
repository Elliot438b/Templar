function pushtransactions(txsstr, queue) {
    console.log(queue.queueName + " push：" + txsstr);
    queue.push(txsstr, function (err) {
        if (err != null) console.log(err);
    });
    return "success"
}

module.exports = pushtransactions;
