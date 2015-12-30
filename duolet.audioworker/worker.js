var assign = require("object-assign");
var config = require("duolet._config");

function Duolet(self) {
  var _this = this;

  this.dsp = null;
  this.sampleRate = 0;
  this.bufferLength = 0;
  this.state = "uninitialized";

  this._self = self;

  self.onmessage = function(e) {
    _this.recvFromWorkerClient(e.data);
  };
  self.onaudioprocess = function(e) {
    _this.process(e);
  };
}

Duolet.prototype.compose = function(spec) {
  var dsp = spec.dsp;

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

  this.state = "suspended";

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

  return this;
};

Duolet.prototype.start = function() {
  if (this.state === "suspended") {
    this.state = "running";
    this._self.postMessage({ type: ":start" });
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
    this._self.postMessage({ type: ":stop" });
    this.driver.stop();
    if (typeof this.dsp.stop === "function") {
      this.dsp.stop();
    }
  }
  return this;
};

Duolet.prototype.recvFromWorkerClient = function(data) {
  if (data && data.type === ":setup") {
    this[data.type.substr(1)](data);
  } else if (typeof this.recvFromClient === "function") {
    this.recvFromClient(data);
  }
};

Duolet.prototype.process = function(e) {
  var bufL = e.outputs[0][0];
  var bufR = e.outputs[0][1];
  var bufferLength = bufL.length;
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

module.exports = function(self) {
  return new Duolet(self);
};
