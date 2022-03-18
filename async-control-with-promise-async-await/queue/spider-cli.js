const { spider } = require("./spider");

// node spider-cli.js https://loige.co/ 1 10
const url = process.argv[2];
const nesting = Number.parseInt(process.argv[3], 10) || 1;
const concurrency = Number.parseInt(process.argv[4], 10) || 2;

spider(url, nesting, concurrency);
