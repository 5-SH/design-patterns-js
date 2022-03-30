const Redis = require('ioredis');

const redisRead = new Redis();

(async function () {
  // const [[, r1]] = await redisRead.xread('COUNT', 10, 'STREAMS', 'test_stream', 0);
  const [[, r1]] = await redisRead.xread('BLOCK', 0, 'STREAMS', 'test_stream', '$');
  for (const [, [, c1]] of r1) {
    console.log('c1', c1);
  }
  
  // const [[, r2]] = await redisRead.xread('COUNT', 10, 'STREAMS', 'test_stream', 0);
  const [[, r2]] = await redisRead.xread('BLOCK', 0, 'STREAMS', 'test_stream', '$');
  for (const [, [, c2]] of r2) {
    console.log('c2', c2);
  }

  // const [[, r3]] = await redisRead.xread('COUNT', 10, 'STREAMS', 'test_stream', 0);
  const [[, r3]] = await redisRead.xread('BLOCK', 0, 'STREAMS', 'test_stream', '$');
  for (const [, [, c3]] of r3) {
    console.log('c3', c3);
  }
})();