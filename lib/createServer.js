module.exports = createServer;

var net = require('net');
var ldjson = require('./index');
var EventEmitter = process.EventEmitter;
var util = require('util');

// this wraps the net.createServer, returning socket-like streams on
// connection
function createServer(arg0, arg1) {
  var server;
  var netServer;
  var ocb;

  if (typeof arg1 === 'function') {
    // options, callback
    netServer = net.createServer(arg0, callback);
    ocb = arg1;
  } else if (typeof arg0 === 'function') {
    // callback
    netServer = net.createServer(callback);
    ocb = arg0;
  } else {
    // options?
    netServer = net.createServer(arg0);
    ocb = null;
  }

  server = new Server(netServer);

  function callback(socket) {
    ocb(ldjson.createDuplexStream(socket));
  };

  return server;
}

function Server(netServer) {
  this.netServer = netServer;
}
util.inherits(Server, EventEmitter);

Server.prototype.listen = function() {
  this.netServer.listen.apply(this.netServer, arguments);
}

