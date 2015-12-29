module.exports = function() {
  return {
    sampleRate: 44100,
    channels: 2,
    bufferLength: 1024,
    dspBufferLength: 64,
    bufferSlotCount: 8
  };
};
