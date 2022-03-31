const Redis = require('ioredis');
const { generateTasks } = require('./generateTask');

const ALPHABET = 'abcdefghijklmnopqrstuvWxyz';
const BATCH_SIZE = 10000;
const redisClient = new Redis();
const [,, maxLength, searchHash] = process.argv;

// node producer.js 4 f8e966d1e207d02c44511a58dccff2f5429e9a3b
async function main() {
  const generatorObj = generateTasks(searchHash, ALPHABET, maxLength, BATCH_SIZE);
  for (const task of generatorObj) {
    await redisClient.xadd('tasks_stream', '*', 'task', JSON.stringify(task));
  }

  redisClient.disconnect();
}

main().catch(err => console.error(err));