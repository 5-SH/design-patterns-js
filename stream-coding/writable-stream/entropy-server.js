const { createServer } = require('http');
const Chance = require('chance');

const chance = new Chance();
// const server = createServer((req, res) => {
//   res.writeHead(200, { 'Content-Type': 'text/plain' });
//   while (chance.bool({ likelihood: 95 })) {
//     res.write(`${chance.string()}\n`);
//   }
//   res.end('\n\n');
//   res.on('finish', () => console.log('All data sent'));
// });

// backpressure 추가
// res.end('\n\n', 'utf-8'); 첫 호출 다음 res 스트림에 write 되는 randomChunk 는 무시됨.
const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  function generateMore() {
    while (chance.bool({ likelihood: 95 })) {
      const randomChunk = chance.string({
        length: (16 * 1024) - 1
      });
      const shouldContinue = res.write(`${randomChunk}\n`);
      if (!shouldContinue) {
        console.log('back-pressure');
        return res.once('drain', generateMore);
      }
    }

    res.end('\n\n', 'utf-8');
  }
  generateMore();
  res.on('finish', () => console.log('All data sent'));
});

server.listen(8080, () => console.log('listening on http://localhost:8080'));