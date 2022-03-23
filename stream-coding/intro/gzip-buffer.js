const { promises: fs } = require('fs');
const { gzip } = require('zlib');
const { promisify } = require('util');

const gzipPromise = promisify(gzip);

const filename = process.argv[2];

// node .\intro\gzip-buffer.js .\sample\1GB.bin
async function main() {
  const data = await fs.readFile(filename);
  const gzippedData = await gzipPromise(data);
  await fs.writeFile(`${filename}.gz`, gzippedData);
  console.log('File successfully compressed');
}

main();