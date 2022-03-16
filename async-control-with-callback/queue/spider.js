const fs = require('fs');
const path = require('path');
const superagent = require('superagent');
const mkdirp = require('mkdirp');
const { urlToFilename, getPageLinks } = require('../utils.js');

const spidering = new Set();
function spider(url, nesting, queue) {
  if (spidering.has(url)) return;
  
  spidering.add(url);
  queue.pushTask(done => {
    spiderTask(url, nesting, queue, done);
  });
}

function spiderTask(url, nesting, queue, cb) {
  const filename = urlToFilename(url);
  fs.readFile(filename, 'utf-8', (err, fileContent) => {
    if (err) {
      if (err.code !== 'ENOENT') return cb(err);
      
      return download(url, filename, (err, requestContent) => {
        if (err) return cb(err);

        spiderLinks(url, requestContent, nesting, queue);
        return cb();
      });
    }

    spiderLinks(url, fileContent, nesting, queue);
    return cb();
  })
}

function spiderLinks(currentUrl, body, nesting, queue) {
  if (nesting === 0) return;

  const links = getPageLinks(currentUrl, body);
  if (links.length === 0) return;

  links.forEach(link => spider(link, nesting - 1, queue));
}

function saveFile(filename, contents, cb) {
  mkdirp(path.dirname(filename), err => {
    if (err) return cb(err)
    
    fs.writeFile(filename, contents, cb)
  });
}

function download(url, filename, cb) {
  console.log(`Downloading ${url}`)
  superagent.get(url).end((err, res) => {
    if (err) return cb(err);
    
    saveFile(filename, res.text, err => {
      if (err) return cb(err);
      
      console.log(`Downloaded and saved: ${url}`)
      cb(null, res.text)
    })
  })
}

module.exports = {
  spider,
};
