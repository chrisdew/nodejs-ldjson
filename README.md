# ldjson -- Line Delimited JSON

see http://en.wikipedia.org/wiki/Line_Delimited_JSON

## Status

Under development, see TODOs.

## Install

    npm install ldjson

## API

Use it on any readable stream:

    var ldjson = require('ldjson');

    var stream = ldjson.createDeserialisingStream(your_stream);

`ldjson` streams fire `data` events with **two** arguments.  The first is the original JSON string, while the second is the Javascript object.

## Convenience API

`ldjson` can present an API similar to `net` for TCP client and server functions.

### Client

    var ldjson = require('ldjson');

    var ldjson_socket = ldjson.connect(1337, '127.0.0.1', function() {
      console.log('connected');
    });

    ldjson_socket.on('data', function(json, ob) {
      console.log('received json:', json);
      console.log('received ob:', ob);
    });

### Server

    var ldjson = require('ldjson');
    
    var server = ldjson.createServer(function (ldjson_socket) {
      console.log('accepted connection');

      var count = 0;
      var interval = setInterval(function() {
        ldjson_socket.write({"count":count++});
      }, 3000);

      ldjson_socket.on('data', function(json, ob) {
        console.log('received json:', json);
        console.log('received ob:', ob);
      });
    });

    server.listen(1337, '127.0.0.1');

## TODOs

* Check handling of invalid JSON.
* Fix pause and resume functionality for wrapped streams.
* Increase test coverage.
