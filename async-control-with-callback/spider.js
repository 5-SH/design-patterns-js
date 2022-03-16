const fs = require('fs');
const path = require('path');
const superagent = require('superagent');
const mkdirp = require('mkdirp');
const { urlToFilename, getPageLinks } = require('./utils.js');

const spidering = new Set();
// 병렬 실행할 때 같은 url 이 들어오면 파일이 두 번 저장될 수 있음
function spider(url, nesting, cb) {
  if (spidering.has(url)) {
    return process.nextTick(cb);
  }
  spidering.add(url);
  const filename = urlToFilename(url);
  fs.readFile(filename, 'utf-8', (err, fileContent) => {
    if (err) {
      if (err.code !== 'ENOENT') return cb(err);

      return download(url, filename, (err, requestContent) => {
        if (err) return cb(err);

        // spiderLinks(url, requestContent, nesting, cb);
        spiderLinksParallel(url, requestContent, nesting, cb);
      });
    }

    // spiderLinks(url, fileContent, nesting, cb);
    spiderLinksParallel(url, fileContent, nesting, cb);
  });
}

function spiderLinksParallel(currentUrl, body, nesting, cb) {
  if (nesting === 0) return process.nextTick(cb);

  const links = getPageLinks(currentUrl, body);
  if (links.length === 0) return process.nextTick(cb);

  let completed = 0;
  let hasErrors = false;

  function done(err) {
    if (err) {
      hasErrors = true;
      return cb(err);
    }

    if (++completed === links.length && !hasErrors) {
      return cb();
    }
  }

  links.forEach(link => spider(link, nesting - 1, done));
}

function spiderLinks(currentUrl, body, nesting, cb) {
  if (nesting === 0) return process.nextTick(cb);

  const links = getPageLinks(currentUrl, body);
  if (links.length === 0) return process.nextTick(cb);

  function iterate(index) {
    if (index === links.length) return cb();

    spider(links[index], nesting - 1, (err) => {
      if (err) return cb(err);

      iterate(index + 1);
    });
  }

  iterate(0);
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
