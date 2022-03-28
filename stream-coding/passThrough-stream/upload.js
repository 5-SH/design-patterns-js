const axios = require('axios');

function upload(filename, contentStream) {
  return axios.post(
    'http://localhost:3000',
    contentStream,
    {
      headers: {
        'Content-Type': 'application/octet-stream',
        'X-Filename': filename
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    }
  );
}

module.exports = {
  upload
}