var assert = require("assert");
var through = require('through');

var ldjson = require('../lib/index.js');
describe('The reader module', function() {
  it('should wrap a stream', function(done) {
    // fake up a passthrough stream
    var pass = through();

    var obstream = ldjson.createDeserialisingStream(pass);
    obstream.on('data', function(json, ob) {
      assert.deepEqual('{"hello":"world"}', json);
      assert.deepEqual({hello:'world'}, ob);
      done();
    });
    pass.emit('data', '{"hel'); 
    pass.emit('data', 'lo":"wo'); 
    pass.emit('data', 'rld"}\r\n'); 
  });
});

