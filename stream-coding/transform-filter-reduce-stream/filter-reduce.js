const { Transform } = require('stream');

class FilterByContry extends Transform {
  constructor(country, options = {}) {
    options.objectMode = true;
    super(options);
    this.country = country;
  }
  
  _transform(record, enc, cb) {
    if (record.country === this.country) this.push(record);
    cb();
  }
}

class SumProfit extends Transform {
  constructor(options = {}) {
    options.objectMode = true;
    super(options);
    this.total = 0;
  }

  _transform(record, enc, cb) {
    this.total += Number.parseFloat(record.profit);
    cb();
  }

  _flush(cb) {
    this.push(this.total.toString());
    cb();
  }
}

module.exports = {
  FilterByContry,
  SumProfit
}