const { pipeline } = require('stream');
const { createReadStream, createWriteStream } = require('fs');
const split = require('split');
const request = require('request-promise');
const parallelTransform = require('parallel-transform');

pipeline(
  createReadStream(process.argv[2]),
  split(),
  parallelTransform(4, async function (url, done) {
    if (!url) {
      return done();
    }
    console.log(url);
    try {
      await request.head(url, { timeout: 5 * 1000 });
      this.push(`${url} is up\n`);
    } catch (err) {
      this.push(`${url} is down\n`);
    }
    done();
  }),
  createWriteStream('results.txt'),
  err => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log('All urls have been checked');
  }
)