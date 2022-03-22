// cat .\sample\sample.txt | node readable-stream.js
// non-flowing 모드
process.stdin
  .on('readable', () => {
    let chunk;
    console.log(`New data available`);
    while((chunk = process.stdin.read()) !== null) {
      console.log(`Chunk read(${chunk.length} bytes): "${chunk.toString()}"`);
    }

  })
  .on('end', () => console.log('End of stream'));

// flowing 모드
process.stdin
  .on('data', chunk => {
    console.log('New data available');
    console.log(`Chunk read(${chunk.length} bytes): "${chunk.toString()}"`);
  })
  .on('end', () => console.log('End of stream'));

// 비동기 반복자
async function main() {
  for await (const chunk of process.stdin) {
    console.log('New data available');
    console.log(`Chunk read (${chunk.length} bytes): "${chunk.toString()}"`);
  }
  console.log('End of stream');
}

// main();