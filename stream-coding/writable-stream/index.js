const { Writable } = require('stream');
const { promises: fs } = require('fs');
const { ToFileStream } = require('./writable-stream');
const { dirname, join } = require('path');
const mkdirp = require('mkdirp');

const toFileStream = new ToFileStream();

toFileStream.write({
  path: join('files', 'file1.txt'), content: 'Hello'
});

toFileStream.write({
  path: join('files', 'file2.txt'), content: 'Node.js'
});

toFileStream.write({
  path: join('files', 'file3.txt'), content: 'streams'
});

toFileStream.end(() => console.log('All files created'));

const newToFileStream = new Writable({
  objectMode: true,
  write(chunk, encoding, cb) {
    console.log(chunk);
    mkdirp(dirname(chunk.path))
      .then(() => fs.writeFile(chunk.path, chunk.content))
      .then(() => cb())
      .catch(cb);
  }
});

newToFileStream.write({
  path: join('files', 'file4.txt'), content: 'Hello'
});

newToFileStream.write({
  path: join('files', 'file5.txt'), content: 'Node.js'
});

newToFileStream.write({
  path: join('files', 'file6.txt'), content: 'streams'
});

newToFileStream.end(() => console.log('All files created'));