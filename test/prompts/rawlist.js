var expect = require("chai").expect;
var sinon = require("sinon");
var EventEmitter = require("events").EventEmitter;
var Rawlist = require("../../lib/prompts/rawlist");

describe("`rawlist` prompt", function() {

  beforeEach(function() {
    this.rl = new EventEmitter();
    this.rawlist = new Rawlist({
      message: "",
      choices: [ "foo", "bar" ]
    }, this.rl);
  });

  it("should default to first choice", function(done) {

    this.rawlist.run(function(answer) {
      expect(answer).to.equal("foo");
      done();
    });

    this.rl.emit("line");
  });

  it("should select given index", function(done) {

    this.rawlist.run(function(answer) {
      expect(answer).to.equal("bar");
      done();
    });

    this.rl.emit("line", "2");
  });

  it("should not allow invalid index", function(done) {
    var self = this;
    var callCount = 0;

    this.rawlist.run(function(answer) {
      callCount++;
    });

    this.rl.emit("line", "blah");
    setTimeout(function() {
      self.rl.emit("line", "1");
      setTimeout(function() {
          expect(callCount).to.equal(1);
          done();
      }, 10);
    }, 10);
  });

  it("should filter input", function(done) {
    var rawlist = new Rawlist({
      message: "",
      choices: [ "foo", "bar" ],
      filter: function() {
        return "pass";
      }
    }, this.rl);

    rawlist.run(function(answer) {
      expect(answer).to.equal("pass");
      done();
    });

    this.rl.emit("line");
  });

});