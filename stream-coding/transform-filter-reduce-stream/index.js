const { createReadStream } = require('fs');
const { parse } = require('csv-parse');
const { FilterByContry, SumProfit } = require('./filter-reduce');
const { createGunzip } = require('zlib');

const csvParser = parse({ columns: true });

createReadStream('data.csv.gz')
  .pipe(createGunzip())
  .pipe(csvParser)
  .pipe(new FilterByContry('Italy'))
  .pipe(new SumProfit())
  .pipe(process.stdout);