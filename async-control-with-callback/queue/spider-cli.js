const { spider } = require('./spider')
const TaskQueue = require('./taskQueue.js');

// node spider-cli.js https://loige.co/ 1 10
const url = process.argv[2];
const nesting = Number.parseInt(process.argv[3], 10) || 1;
const concurrency = Number.parseInt(process.argv[4], 10) || 2;

const spiderQueue = new TaskQueue(concurrency);
spiderQueue.on('error', console.error);
spiderQueue.on('empty', () => console.log('Download complete', new Date() - start));

const start = new Date();
spider(url, nesting, spiderQueue);
