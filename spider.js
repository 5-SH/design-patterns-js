const fs = require('fs');
const path = require('path');
const superagent = require('superagent');
const mkdirp = require('mkdirp');
const { urlToFilename } = require('./utils.js');

function spider(url, cb) {
  const filename = urlToFilename(url);
  fs.access(filename, (err) => {
    if (!err || err.code !== 'ENOENT') return cb(null, filename, false);
    
    download(url, filename, err => {
      if (err) return cb(err);
      cb(null, filename, true);
    })
  });
}

function download(url, filename, cb) {
  console.log(`Downloading ${url} into ${filename}`);
      superagent.get(url).end((err, res) => {
        if (err) return cb(err);
        
        saveFile(filename, res.text, cb);
      });
}

function saveFile(filename, contents, cb) {
  mkdirp(path.dirname(filename), (err) => {
    if (err) return cb(err);
    
    fs.writeFile(filename, contents, (err) => {
      if (err) return cb(err);
      
      cb(null, filename, true);
    });
  });
}

module.exports = {
  spider,
};
