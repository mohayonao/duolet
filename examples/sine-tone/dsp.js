function DSP() {
  this._currentTime = 0;
  this._phaseL = 0;
  this._phaseR = 0;
  this._phaseLstep = 0;
  this._phaseRstep = 0;
  this._counter = 0;
}

DSP.prototype.setup = function(opts) {
  this.sampleRate = opts.sampleRate;
  this.bufferLength = opts.dspBufferLength;
  this._currentTimeIncr = this.bufferLength / this.sampleRate;
};

DSP.prototype.start = function() {
  this._currentTime = 0;
};

DSP.prototype.process = function(bufL, bufR) {
  var phaseL = this._phaseL;
  var phaseR = this._phaseR;
  var phaseLstep = this._phaseLstep;
  var phaseRstep = this._phaseRstep;

  this._currentTime += this._currentTimeIncr;

  if (this._counter <= 0) {
    this._changeFrequency();
    this._counter += this.sampleRate * 0.25;
  }

  for (var i = 0, imax = this.bufferLength; i < imax; i++) {
    bufL[i] = Math.sin(phaseL) * 0.125;
    bufR[i] = Math.cos(phaseR) * 0.125;
    phaseL += phaseLstep;
    phaseR += phaseRstep;
  }

  this._phaseL = phaseL;
  this._phaseR = phaseR;
  this._counter -= this.bufferLength;
};

DSP.prototype._changeFrequency = function() {
  var noteNum = sample([ 0, 2, 4, 5, 7, 9, 11 ]);
  var channel = sample([ 0, 1 ]);
  var freq = 440 * Math.pow(2, noteNum / 12);

  if (channel === 0) {
    this._phaseLstep = (freq / this.sampleRate) * Math.PI * 2;
  } else {
    this._phaseRstep = (freq / this.sampleRate) * Math.PI * 2;
  }
}

function sample(list) {
  return list[(Math.random() * list.length)|0];
}

module.exports = DSP;
