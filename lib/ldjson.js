var util = require('util');
var Stream = require('stream').Stream;

var EventEmitter = process.EventEmitter;

createLineStream = function(readStream) {
  if (!readStream) {
    throw new Error('expected readStream');
  }
  // sockets are not immediately readable when using 'net.connect'
  //if (!readStream.readable) {
  //  throw new Error('readStream must be readable');
  //}
  if (readStream.encoding === null) {
    throw new Error('readStream must have non-null encoding');
  }
  var ls = new LineStream();
  readStream.pipe(ls);
  return ls;
};

function LineStream() {
  this.writable = true;
  this.readable = true;
  
  var source;
  var buffer = '';
  var self = this;
  
  this.write = function(data, encoding) {
    if (Buffer.isBuffer(data)) {
      data = data.toString(encoding || 'utf8');
    }

    var parts = data.split(/\n|\r\n/g);

    if (buffer.length > 0) {
      parts[0] = buffer + parts[0];
    }

    for (var i = 0; i < parts.length -1; i++) {
      self.emit('data', parts[i]);
    }

    buffer = parts[parts.length - 1];
  };

  this.end = function() {
    if (buffer.length > 0) {
      self.emit('data', buffer);
    }
    self.emit('end');
  };

  this.on('pipe', function(src) {
    source = src;
  });
  
  this.pause = function() {
    if (!source) {
      throw new Error('pause() only supported when a LineStream is piped into');
    }
    source.pause();
  };
  
  this.resume = function() {
    if (!source) {
      throw new Error('resume() only supported when a LineStream is piped into');
    }
    source.resume();
  };
}
util.inherits(LineStream, Stream);

function DeserialisingStream(stream) {
  EventEmitter.call(this);

  var self = this;
  var arr = [];
  createLineStream(stream).on('data', function(line) {
    arr.push(line);
    var buf = arr.join(''); // TODO: make this more efficient
    try {
      var ob = JSON.parse(buf);
    } catch (e) {
      // if it doesn't work, just try again on the next line
      return;
    }  
    self.emit('data', buf, ob);
    arr = [];
  });

  stream.on('end', function () { self.emit('end'); });
  stream.on('error', function (err) { self.emit('error', err); });
}

util.inherits(DeserialisingStream, EventEmitter);

function SerialisingStream(stream) {
  EventEmitter.call(this);
  var self = this;

  this.write = function (obOrJson) {
    try {
      var json;
      if (typeof ob !== 'string') {
        json = JSON.stringify(obOrJson);
      } else {
        json = objOrJson;
      }

      if (!stream.writable)
        throw "socket is invalid";
                
      stream.write(json + '\n');
    } catch (err) {
      this.emit('error', err);
      throw err;
    }
  };

  this.end = function () {
    try {
      stream.end();
    } catch (err) {
      this.emit('error', err);
    }
  };

  this.once = function (name, fn) {
    stream.once(name, fn);
  };

  stream.on('close', function () { self.emit('close'); });
  stream.on('error', function (err) { self.emit('error', err); });
  stream.on('drain', function () { self.emit('drain'); });
}

util.inherits(SerialisingStream, EventEmitter);

function DuplexStream(readstream, writestream) {
  writestream = writestream || readstream;
  this.socket = readstream;

  EventEmitter.call(this);
  var self = this;

  var input = new DeserialisingStream(readstream);
  input.on('data', function (data, arg1) { self.emit('data', data, arg1); });
  input.on('error', function (err) { self.emit('error', err); });
  input.on('end', function () { self.emit('end'); });

  var output = new SerialisingStream(writestream);
  output.on('close', function () { self.emit('close'); });
  output.on('error', function (err) { self.emit('error', err); });
  output.on('drain', function () { self.emit('drain'); });

  this.write = function (obj) {
    if (!writestream.writable) {
      self.emit('error', 'socket is invalid');
      throw "socket is invalid";
    }

    output.write(obj); 
  }
  this.end = function () { output.end(); }
}

util.inherits(DuplexStream, EventEmitter);

module.exports = {
  createDuplexStream: function (readstream, writestream) { return new DuplexStream(readstream, writestream); },
  createSerialisingStream: function (stream) { return new SerialisingStream(stream); },
  createDeserialisingStream: function (stream) { return new DeserialisingStream(stream); }
};
