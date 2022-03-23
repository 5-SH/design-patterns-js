const { request } = require('http');
const { createGzip } = require('zlib');
const { createReadStream } = require('fs');
const { basename, join } = require('path');
const { createCipheriv, randomBytes, scryptSync } = require('crypto');

// node ./intro/gzip-client ./sample/1GB.bin localhost

const filename = process.argv[2];
const serverHost = process.argv[3];

const secret = scryptSync('secret', 'salt', 24);
const iv = randomBytes(16);

const httpRequestOptions = {
  hostname: serverHost,
  port: 3000,
  path: '/',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/octet-stream',
    'Content-Encoding': 'gzip',
    'X-Filename': basename(filename),
    'X-Initialization-Vector': iv.toString('hex')
  }
}

const req = request(httpRequestOptions, res => {
  console.log(`Server response: ${res.statusCode}`);
});

createReadStream(filename)
.pipe(createCipheriv('aes192', secret, iv))
.pipe(createGzip())
  .pipe(req)
  .on('finish', () => console.log(`File sucessfully sent`));