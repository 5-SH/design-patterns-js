const axios = require('axios');
const { PassThrough } = require('stream');

function createUploadStream(filename) {
  const connector = new PassThrough();

  axios
    .post(
      'http://localhost:3000',
      connector,
      {
        headers: {
          'Content-Type': 'application/octet-stream',
          'X-Filename': filename
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
    )
    .catch(err => {
      connector.emit(err);
    });
  
    return connector;
}

module.exports = {
  createUploadStream
}