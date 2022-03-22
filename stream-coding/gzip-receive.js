const { createWriteStream } = require('fs');
const { createServer } = require('http');
const { createGunzip } = require('zlib');
const { basename, join } = require('path');
const { createDecipheriv, randomBytes, scryptSync } = require('crypto');


const secret = scryptSync('secret', 'salt', 24);
console.log(`Generated secret: ${secret.toString('hex')}`);

const server = createServer((req, res) => {
  const filename = basename(req.headers['x-filename']);
  const iv = Buffer.from(req.headers['x-initialization-vector'], 'hex');
  
  const destFilename = join('received_files', filename);

  console.log(`File request received: ${filename}`);
  req
    .pipe(createGunzip())
    .pipe(createDecipheriv('aes192', secret, iv))
    .pipe(createWriteStream(destFilename))
    .on('finish', () => {
      res.writeHead(201, { 'Content-Type': 'text/plain' });
      res.end('OK\n');
      console.log(`File saved: ${destFilename}`);
    })
    .on('error', err => console.error(err));
});

server.listen(3000, () => console.log('Listening on http://localhost:3000'));
