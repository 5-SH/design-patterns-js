const { spider } = require('./spider.js');

// node spider-cli.js https://loige.co/
const url = process.argv[2];
const nesting = Number.parseInt(process.argv[3], 10) || 1;

const start = new Date();
spider(process.argv[2], nesting, err => {
  if (err) {
    console.error(err);
    process.exit(1);
  } 

  const end = new Date();
  console.log(`Download complete`, end - start);
});