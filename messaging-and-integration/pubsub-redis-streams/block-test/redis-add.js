const Redis = require('ioredis');
const Chance = require('chance');

const redisAdd = new Redis();

const chance = new Chance();
const chunk = chance.string({ length: 5 });

redisAdd.xtrim('test_stream', 'MAXLEN', 0);
redisAdd.xadd('test_stream', '*', 'chunk', chunk);
