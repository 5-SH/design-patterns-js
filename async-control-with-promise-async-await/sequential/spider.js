const { promises: fsPromises } = require('fs');
const { dirname } = require('path');
const superagent = require('superagent');
const mkdirp = require('mkdirp');
const { urlToFilename, getPageLinks } = require('../utils');
const { promisify } = require('util');

const mkdirPromises = promisify(mkdirp);

async function download(url, filename) {
  console.log(`Downloading ${url}`);
  const { text: content } = await superagent.get(url);
  await mkdirPromises(dirname(filename));
  await fsPromises.writeFile(filename, content);
  console.log(`Downloaded and saved: ${url}`);
  return content;

  // return superagent.get(url)
  //   .then(res => {
  //     content = res.text;
  //     return mkdirPromises(dirname(filename));
  //   })
  //   .then(() => fsPromises.writeFile(filename, content))
  //   .then(() => {
  //     console.log(`Downloaded and saved: ${url}`)
  //     return content;
  //   });
}

async function spiderLinks(currentUrl, content, nesting) {
  let promise = Promise.resolve();
  if (nesting === 0) return promise;

  const links = getPageLinks(currentUrl, content);
  for (const link of links) {
    await spider(link, nesting -1);
  }
  
  // for (const link of links) {
  //   promise = promise.then(() => spider(link, nesting - 1));
  // }

  // return promise;
}

function spider(url, nesting) {
  const filename = urlToFilename(url);
  return fsPromises.readFile(filename, 'utf-8')
    .catch(err => {
      if (err.code !== 'ENOENT') throw err;

      return download(url, filename);
    })
    .then(content => spiderLinks(url, content, nesting));
}

module.exports = {
  spider
}