const { Transform } = require('stream');
const { ReplaceStream } = require('./replaceStream');

const replaceStream = new ReplaceStream('World', 'Node.js');
replaceStream.on('data', chunk => console.log(chunk.toString()));

replaceStream.write('Hello W');
replaceStream.write('orld!');
replaceStream.end();

const searchStr = 'World';
const replaceStr = 'Node.js';
let tail = '';
const newReplaceStream = new Transform( {
  defaultEncoding: 'utf-8',
  transform(chunk, encoding, cb) {
    const pieces = (tail + chunk).split(searchStr);
    const lastPiece = pieces[pieces.length - 1];
    const tailLen = searchStr.length - 1;
    tail = lastPiece.slice(-tailLen);
    pieces[pieces.length - 1] = lastPiece.slice(0, -tailLen);

    this.push(pieces.join(replaceStr));
    cb();
  },
  flush(cb) {
    this.push(tail);
    cb();
  }
});

newReplaceStream.on('data', chunk => console.log(chunk.toString()));

newReplaceStream.write('Hello W');
newReplaceStream.write('orld!');
newReplaceStream.end();