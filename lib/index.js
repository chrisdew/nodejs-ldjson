// just a placeholder for functionality
exports.hello = function() { return "hello index"; }
exports.createServer = process.env.EXPRESS_COV
  ? require('../lib-cov/createServer')
  : require('./createServer')

exports.connect = process.env.EXPRESS_COV
  ? require('../lib-cov/connect')
  : require('./connect')
exports.createConnection = exports.connect;

exports.example = process.env.EXPRESS_COV
  ? require('../lib-cov/example')
  : require('./example')

var tmp = process.env.EXPRESS_COV
  ? require('../lib-cov/ldjson')
  : require('./ldjson')
exports.createDuplexStream = tmp.createDuplexStream;
exports.createSerialisingStream = tmp.createSerialisingStream;
exports.createDeserialisingStream = tmp.createDeserialisingStream;
