const { createReadStream, createWriteStream } = require('fs');
const { PassThrough } = require('stream');
const { createGzip } = require('zlib');

let bytesWritten = 0;
const monitor = new PassThrough();
monitor.on('data', chunk => {
  bytesWritten += chunk.length;
});
monitor.on('finish', () => {
  console.log(`${bytesWritten} bytes written`);
});

// monitor.write('Hello!');
// monitor.end();

// node .\pathThrough-stream\pathThrough.js .\sample\Airbus_Pleiades_50cm_8bit_RGB_Yogyakarta.jpg
const filename = process.argv[2];
createReadStream(filename)
  .pipe(createGzip())
  .pipe(monitor)
  .pipe(createWriteStream(`${filename}.gz`));