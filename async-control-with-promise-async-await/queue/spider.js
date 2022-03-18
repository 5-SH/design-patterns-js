const { promises: fsPromises } = require('fs');
const { dirname } = require('path');
const superagent = require('superagent');
const mkdirp = require('mkdirp');
const { urlToFilename, getPageLinks } = require('../utils');
const { promisify } = require('util');
const TaskQueue = require('./taskQueue');

const mkdirPromises = promisify(mkdirp);

function download(url, filename) {
  console.log(`Downloading ${url}`);
  let content;
  return superagent.get(url)
    .then(res => {
      content = res.text;
      return mkdirPromises(dirname(filename));
    })
    .then(() => fsPromises.writeFile(filename, content))
    .then(() => {
      console.log(`Downloaded and saved: ${url}`)
      return content;
    });
}

function spiderLinks(currentUrl, content, nesting, queue) {
  let promise = Promise.resolve();
  if (nesting === 0) return promise;

  const links = getPageLinks(currentUrl, content);
  const promises = links.map(link => spiderTask(link, nesting - 1, queue));

  return Promise.all(promises);
}

const spidering = new Set();
function spiderTask(url, nesting, queue) {
  if (spidering.has(url)) {
    return Promise.resolve();
  }
  spidering.add(url);

  const filename = urlToFilename(url);

  return queue.runTask(() => {
    return fsPromises.readFile(filename, 'utf-8')
      .catch(err => {
        if (err.code !== 'ENOENT') throw err;

        return download(url, filename);
      })
      .then(content => spiderLinks(url, content, nesting, queue));
  });
}

function spider(url, nesting, concurrency) {
  const queue = new TaskQueue(concurrency);
  return spiderTask(url, nesting, queue);
}

module.exports = {
  spider
}