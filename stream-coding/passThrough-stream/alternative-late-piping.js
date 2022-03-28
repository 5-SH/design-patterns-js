const { createReadStream } = require('fs');
const { pipeline } = require('stream');
const { basename } = require('path');
const { createUploadStream } = require('./alternative-upload');

// node .\alternative-late-piping.js ..\sample\Airbus_Pleiades_50cm_8bit_RGB_Yogyakarta.jpg
const filepath = process.argv[2];
const filename = basename(filepath);

pipeline(
  createReadStream(filepath),
  createUploadStream(filename),
  err => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log('File uploaded');
  }
)