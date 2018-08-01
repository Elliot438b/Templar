# Templar
> Christianity and the Knights Templar.

> Do something with eosjs on EOS blockchain. 

## nodejs + redis-as-queue
- consume(statistics) response msg: http://127.0.0.1:88/consumeTrxRes
- matched check balance:

```
cleos --wallet-url http://127.0.0.1:6666 --url http://127.0.0.1:8000  get currency balance eosio.token eosiotesta1
```

- push test request: node testpush-local.js
- check queue status: node check-queue.js
- execute the main function: node src/pack_actions.js

## redis data structure:
- string
- list => NormalQueue
- hash
- set
- zset(sorted set) => UniqueQueue

> UniqueQueue tps: 418-500, including a warn level issue: duplicated get.

## next step
- Add RPOP(atomic get&delete) function in NormalQueue source code.
- All UniqueQueues change to NormalQueue.
- test tps.

## multi exec
- Add a lib interface to exec the atomic commands [lpop].

> PC with 2 cores and 8g ram, normal queue tps: 600-700, including 5 progresses.
