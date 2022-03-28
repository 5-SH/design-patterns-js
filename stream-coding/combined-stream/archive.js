const { createReadStream, createWriteStream } = require('fs');
const { pipeline } = require('stream');
const { randomBytes } = require('crypto');
const { createCompressAndEncrypt, createDecryptAndDecompress } = require('./combined-stream');

const [,, password, source] = process.argv;
const iv = randomBytes(16);
const destination = `${source}.gz.enc`;

pipeline(
  createReadStream(source),
  createCompressAndEncrypt(password, iv),
  createWriteStream(destination),
  err => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`${destination} created with iv: ${iv.toString('hex')}`)
  }
);

setTimeout(() => {
  pipeline(
    createReadStream(destination),
    createDecryptAndDecompress(password, iv),
    createWriteStream(`${destination}.result`),
    err => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`${destination}.result created with iv: ${iv.toString('hex')}`)
    }
  )
}, 2000);