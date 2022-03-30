const zmq = require('zeromq');
const delay = require('delay');
const { generateTasks } = require('./generateTask.js');

const ALPHABET = 'abcdefghijklmnopqrstuvWxyz';
const BATCH_SIZE = 10000;

const [,, maxLength, searchHash] = process.argv;

// node producer.js 4 f8e966d1e207d02c44511a58dccff2f5429e9a3b
async function main() {
  const ventilator = new zmq.Push();
  await ventilator.bind('tcp://*:5016');
  await delay(1000);

  const generatorObj = generateTasks(searchHash, ALPHABET, maxLength, BATCH_SIZE);
  for (const task of generatorObj) {
    await ventilator.send(JSON.stringify(task));
  }
}

main().catch(err => console.error(err));