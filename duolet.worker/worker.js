var assign = require("object-assign");
var config = require("duolet._config");

function Duolet(self) {
  var _this = this;

  this.dsp = null;
  this.sampleRate = 0;
  this.bufferLength = 0;
  this.state = "uninitialized";
  this.timerAPI = global;

  this._self = self;
  this._bufSlots = null;
  this._bufSlotCount = 0;
  this._rdBufIndex = 0;
  this._wrBufIndex = 0;
  this._dspBufLength = 0;
  this._dspBufL = null;
  this._dspBufR = null;
  this._timerId = 0;

  self.onmessage = function(e) {
    _this.recvFromWorkerClient(e.data);
  };
}

Duolet.prototype.compose = function(spec) {
  var dsp = spec.dsp;

  if (this.state !== "uninitialized") {
    throw new Error("Failed to execute 'compose' on 'Duolet'");
  }

  this.state = "composed";

  this.dsp = dsp;

  dsp.duolet = this;

  return this;
};

Duolet.prototype.setup = function(opts) {
  if (this.state !== "composed") {
    throw new Error("Failed to execute 'setup' on 'Duolet'");
  }

  this.state = "suspended";

  opts = assign(config(), opts);

  this.sampleRate = opts.sampleRate;
  this.bufferLength = opts.bufferLength;

  opts = assign(opts, {
    sampleRate: this.sampleRate, bufferLength: this.bufferLength
  });

  this.dsp.setup(opts);
  this._bufSlotCount = opts.bufferSlotCount;
  this._bufSlots = new Array(this._bufSlotCount);

  for (var i = 0; i < this._bufSlots.length; i++) {
    this._bufSlots[i] = new Float32Array(this.bufferLength * 2);
  }

  this._dspBufLength = this.dsp.bufferLength;
  this._dspBufL = new Float32Array(this._dspBufLength);
  this._dspBufR = new Float32Array(this._dspBufLength);

  return this;
};

Duolet.prototype.start = function() {
  var _this = this;
  var interval = Math.floor((this.bufferLength / this.sampleRate) * 500);

  if (this.state === "suspended") {
    this.state = "running";
    this._self.postMessage({ type: ":start" });
    this.dsp.start();
    this._timerId = this.timerAPI.setInterval(function() {
      _this.process();
    }, interval);
  }

  return this;
};

Duolet.prototype.stop = function() {
  if (this.state === "running") {
    this.state = "suspended";
    this._self.postMessage({ type: ":stop" });
    this.dsp.stop();
    this.timerAPI.clearInterval(this._timerId);
    this._timerId = 0;
  }

  return this;
};

Duolet.prototype.recvFromClient = function() {
};

Duolet.prototype.recvFromWorkerClient = function(data) {
  if (data instanceof Float32Array) {
    this._bufSlots[this._rdBufIndex] = data;
    this._rdBufIndex += 1;
    if (this._bufSlotCount <= this._rdBufIndex) {
      this._rdBufIndex = 0;
    }
  } else if (data.type[0] === ":") {
    this[data.type.substr(1)](data);
  } else {
    this.recvFromClient(data);
  }
};

Duolet.prototype.process = function() {
  var buf = this._bufSlots[this._wrBufIndex];
  var bufIndex = 0;
  var bufLength = this.bufferLength;
  var dspBufLength = this._dspBufLength;
  var dspBufL = this._dspBufL;
  var dspBufR = this._dspBufR;

  if (buf) {
    while (bufIndex < bufLength) {
      this.dsp.process(dspBufL, dspBufR);

      buf.set(dspBufL, bufIndex);
      buf.set(dspBufR, bufIndex + bufLength);

      bufIndex += dspBufLength;
    }

    this._self.postMessage(buf, [ buf.buffer ]);
    this._bufSlots[this._wrBufIndex] = null;

    this._wrBufIndex += 1;
    if (this._bufSlotCount <= this._wrBufIndex) {
      this._wrBufIndex = 0;
    }
  }
};

module.exports = function(self) {
  return new Duolet(self);
};
