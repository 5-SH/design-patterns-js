const { createReadStream, createWriteStream } = require('fs');
const { createGzip } = require('zlib');

const filename = process.argv[2];

// node .\intro\gzip-stream.js .\sample\1GB.bin
createReadStream(filename)
  .pipe(createGzip())
  .pipe(createWriteStream(`${filename}.gz`))
  .on('finish', () => console.log('File successfully compressed'));
