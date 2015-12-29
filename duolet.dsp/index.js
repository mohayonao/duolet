var config = require("duolet._config")();

function DuoletDSP() {
  this.duolet = null;
  this.sampleRate = 0;
  this.bufferLength = 0;
}

DuoletDSP.prototype.setup = function(opts) {
  this.sampleRate = Math.max(0, +opts.sampleRate|0) || config.sampleRate;
  this.bufferLength = Math.max(0, +opts.bufferLength|0) || config.dspBufferLength;
};

DuoletDSP.prototype.start = function() {
};

DuoletDSP.prototype.stop = function() {
};

DuoletDSP.prototype.process = function() {
};

module.exports = DuoletDSP;
