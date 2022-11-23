# Worker threads vs child processes benchmarks

The test is simple:

1. master sends a message to a slave process/thread
2. slave sends the message back
3. master receives it and adds to a number of processed messages
4. the test stops after RUN_SECS seconds and reports how much messages was processed

Results for my [rog14 GA401QM](https://rog.asus.com/laptops/rog-zephyrus/2021-rog-zephyrus-g14-series/spec)

## Results - 10 sec runs

> $ MSG_SIZE=small RUN_SECS=10 node master-process-spawner.js

Processed **252_384** messages

> $ MSG_SIZE=small RUN_SECS=10 node master-thread-spawner.js 

Processed **520_274** messages

> $ MSG_SIZE=medium RUN_SECS=10 node master-process-spawner.js 

Processed **123_592** messages

> $ MSG_SIZE=medium RUN_SECS=10 node master-thread-spawner.js 

Processed **173_562** messages

> $ MSG_SIZE=big RUN_SECS=10 node master-process-spawner.js

Processed **5_855** messages

> $ MSG_SIZE=big RUN_SECS=10 node master-thread-spawner.js 

Processed **6_594** messages

> $ MSG_SIZE=huge RUN_SECS=10 node master-process-spawner.js

Processed **1_054** messages

> $ MSG_SIZE=huge RUN_SECS=10 node master-thread-spawner.js

Processed **1_041** messages

> $ MSG_SIZE=bigstring RUN_SECS=10 node master-process-spawner.js

Processed **10_989** messages

> $ MSG_SIZE=bigstring RUN_SECS=10 node master-thread-spawner.js

Processed **187_678** messages

### Summary - 10 secs runs

| Message size | kb    | process | thread  | %     |
|--------------|-------|---------|---------|-------|
| small        | 0.015 | 252_384 | 520_274 | 206%  |
| medium       | 2.0   | 123_592 | 173_562 | 140%  |
| big          | 78    | 5_855   | 6_594   | 113%  |
| huge         | 576   | 1_054   | 1_041   | 99%   |
| bigstring    | 79    | 10_989  | 187_678 | 1708% |

## Results - 1 min runs

> $ MSG_SIZE=small RUN_SECS=60 node master-process-spawner.js

Processed **2_574_830** messages

> $ MSG_SIZE=small RUN_SECS=60 node master-thread-spawner.js 

Processed **5_284_697** messages

> $ MSG_SIZE=medium RUN_SECS=60 node master-process-spawner.js 

Processed **698_205** messages

> $ MSG_SIZE=medium RUN_SECS=60 node master-thread-spawner.js 

Processed **1_271_630** messages

> $ MSG_SIZE=big RUN_SECS=60 node master-process-spawner.js

Processed **41_378** messages

> $ MSG_SIZE=big RUN_SECS=60 node master-thread-spawner.js 

Processed **74_799** messages

> $ MSG_SIZE=huge RUN_SECS=60 node master-process-spawner.js

Processed **5_801** messages

> $ MSG_SIZE=huge RUN_SECS=60 node master-thread-spawner.js

Processed **8_161** messages

> $ MSG_SIZE=bigstring RUN_SECS=60 node master-process-spawner.js

Processed **48_560** messages

> $ MSG_SIZE=bigstring RUN_SECS=60 node master-thread-spawner.js

Processed **914_907** messages


### Summary - 1 min runs

| Message size | kb    | process   | thread    | %     |
|--------------|-------|-----------|-----------|-------|
| small        | 0.015 | 2_574_830 | 5_284_697 | 205%  |
| medium       | 2.0   | 698_205   | 1_271_630 | 182%  |
| big          | 78    | 41_378    | 74_799    | 181%  |
| huge         | 576   | 5_801     | 8_161     | 141%  |
| bigstring    | 70    | 48_560    | 914_907   | 1884% |

## Conclusion

It's much faster to send messages between threads. The difference is smaller when bigger messages as being sent. My conclusion is that this might be due to differences in performance of `JSON.parse(JSON.stringify(msg))` vs `structuredClone(msg)` - it seams that `structuredClone(msg)` is slower then `JSON.parse(JSON.stringify(msg))`. Moreover it can be seen that when testing a simple but big messages (the "bigstring" test) the threaded version is much more efficient. This would also indicate that the slow gain in the threaded example is due to slowness of `structuredClone`. 
