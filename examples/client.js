var ldjson = require('../lib/index');

var interval;

var duplex = ldjson.connect(1337, '127.0.0.1', function() {
  console.log('connected');
  var count = 0;

  interval = setInterval(function() {
    duplex.write({an:'object',count:count++});
    duplex.write('["json","as","a","string"]');
  }, 2000);
});

duplex.on('data', function(json, ob) {
  console.log('received json:', json);
  console.log('received ob:', ob);
});

duplex.on('end', function() { clearInterval(interval); });
duplex.on('error', function(err) { clearInterval(interval); });
