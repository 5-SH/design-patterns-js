const { Readable } = require('stream');
const { RandomStream } = require('./random-stream');
const Chance = require('chance');

const chance = new Chance();
const randomStream = new RandomStream();
randomStream
  .on('data', (chunk) => {
    console.log(`Chunk received (${chunk.length} bytes): ${chunk.toString()}`);
  })
  .on('end', () => {
    console.log(`Produced ${randomStream.emittedBytes} bytes of random data`);
  });

const newRandomStream = new Readable({
  read(size) {
    const chunk = chance.string({ length: size });
    this.push(chunk, 'utf-8');
    this.emittedBytes += chunk.length;
    if (chance.bool({ likelihood: 5 })) {
      this.push(null);
    }
  },
});
newRandomStream
  .on('data', (chunk) => {
    console.log(`Chunk received (${chunk.length} bytes): ${chunk.toString()}`);
  })
  .on('end', () => {
    console.log(`Produced ${randomStream.emittedBytes} bytes of random data`);
  });

const mountains = [
  { name: 'Everest', height: 8848 },
  { name: 'K2', height: 8611 },
  { name: 'Kangchenjunga', height: 8586 },
  { name: 'Lhotse', height: 8516 },
  { name: 'Makalu', height: 8481 },
];

const mountainsStream = Readable.from(mountains);
mountainsStream.on('data', (mountain) => {
  console.log(`${mountain.name.padStart(14)}\t${mountain.height}m`);
});
