var ldjson = require('../lib/index');

var server = ldjson.createServer(function (duplex) {
  console.log('accepted connection');

  var count = 0;
  var interval = setInterval(function() {
    duplex.write({"count":count++});
  }, 3000);

  duplex.on('error', function(err) { clearInterval(interval); });
  duplex.on('close', function(err) { clearInterval(interval); });

  duplex.on('data', function(json, ob) {
    console.log('received json:', json);
    console.log('received ob:', ob);
  });
});

server.listen(1337, '127.0.0.1');