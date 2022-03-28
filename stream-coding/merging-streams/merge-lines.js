const { createReadStream, createWriteStream } = require('fs');
const split = require('split');

// node .\merge-lines.js ..\files\result ..\files\file1.txt ..\files\file2.txt ..\files\file3.txt ..\files\file4.txt ..\files\file5.txt ..\files\file6.txt
const dest = process.argv[2];
const sources = process.argv.slice(3);

const destStream = createWriteStream(dest);
let endCount = 0;

for (const source of sources) {
  const sourceStream = createReadStream(source, { highWaterMark: 16 });
  sourceStream.on('end', () => {
    if (++endCount === sources.length) {
      destStream.end();
      console.log(`${dest} created`);
    }
  });

  sourceStream
    .pipe(split(line => line + '\n'))
    .pipe(destStream, { end: false });
}
