var assert = require("assert")

var example = require('../lib/index.js').example;
describe('The example module', function() {
  it('should say "this function is tested"', function() {
    assert.equal("this function is tested", example.tested());
  });
});

