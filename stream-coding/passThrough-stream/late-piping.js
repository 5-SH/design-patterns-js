const { createReadStream } = require('fs');
const { createBrotliCompress } = require('zlib');
const { PassThrough } = require('stream');
const { basename } = require('path');
const { upload } = require('./upload.js');

// node .\late-piping.js ..\sample\Airbus_Pleiades_50cm_8bit_RGB_Yogyakarta.jpg
const filepath = process.argv[2];
const filename = basename(filepath);
const contentStream = new PassThrough();

upload(`${filename}.br`, contentStream)
  .then(response => {
    console.log(`Server response: ${response.data}`)
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

createReadStream(filepath)
  .pipe(createBrotliCompress())
  .pipe(contentStream);