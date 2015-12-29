var assign = require("object-assign");
var config = require("duolet._config");

function Duolet() {
  this.dsp = null;
  this.driver = null;
  this.sampleRate = 0;
  this.bufferLength = 0;
  this.state = "uninitialized";

  this._dspBufLength = 0;
  this._dspBufL = null;
  this._dspBufR = null;
}

Duolet.prototype.compose = function(spec) {
  var dsp = spec.dsp;
  var driver = spec.driver;

  if (this.state !== "uninitialized") {
    throw new Error("Failed to execute 'compose' on 'Duolet'");
  }

  this.state = "composed";

  this.dsp = dsp;
  this.driver = driver;

  dsp.duolet = this;
  driver.processor = this;

  return this;
};

Duolet.prototype.setup = function(opts) {
  if (this.state !== "composed") {
    throw new Error("Failed to execute 'setup' on 'Duolet'");
  }

  opts = assign(config(), opts);

  this.driver.setup(opts);
  this.sampleRate = this.driver.sampleRate;
  this.bufferLength = this.driver.bufferLength;

  opts = assign(opts, {
    sampleRate: this.sampleRate, bufferLength: this.bufferLength
  });

  if (typeof this.dsp.setup === "function") {
    this.dsp.setup(opts);
    this._dspBufLength = this.dsp.bufferLength || opts.dspBufferLength;
  } else {
    this._dspBufLength = opts.dspBufferLength;
  }
  this._dspBufL = new Float32Array(this._dspBufLength);
  this._dspBufR = new Float32Array(this._dspBufLength);

  this.state = "suspended";

  return this;
};

Duolet.prototype.start = function() {
  if (this.state === "suspended") {
    this.state = "running";
    this.driver.start();
    if (typeof this.dsp.start === "function") {
      this.dsp.start();
    }
  }
  return this;
};

Duolet.prototype.stop = function() {
  if (this.state === "running") {
    this.state = "suspended";
    this.driver.stop();
    if (typeof this.dsp.stop === "function") {
      this.dsp.stop();
    }
  }
  return this;
};

Duolet.prototype.process = function(bufL, bufR) {
  var bufIndex = 0;
  var bufLength = this.bufferLength;
  var dspBufLength = this._dspBufLength;
  var dspBufL = this._dspBufL;
  var dspBufR = this._dspBufR;

  while (bufIndex < bufLength) {
    this.dsp.process(dspBufL, dspBufR);

    bufL.set(dspBufL, bufIndex);
    bufR.set(dspBufR, bufIndex);

    bufIndex += dspBufLength;
  }
};

module.exports = function() {
  return new Duolet();
};
