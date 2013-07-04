module.exports = connect;

var net = require('net');
var ldjson = require('./index');

function connect(port, arg1, arg2) {
  var socket = net.connect(port, arg1, arg2);
  return ldjson.createDuplexStream(socket);
}