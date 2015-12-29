"use strict";

const assert = require("assert");
const sinon = require("sinon");
const tickable = require("tickable-timer");
const _duolet = require("../worker");

function createWorkerGlobalScope() {
  return {
    postMessage: sinon.spy(),
    onmessage: sinon.spy()
  };
}

function createStub(opts) {
  return {
    setup: sinon.spy(),
    start: sinon.spy(),
    stop: sinon.spy(),
    process: sinon.spy(),
    sampleRate: opts.sampleRate,
    bufferLength: opts.bufferLength
  };
}

describe("duolet.worker/worker", () => {
  let duolet, self, dsp;

  beforeEach(() => {
    tickable.clearAllTimers();
    self = createWorkerGlobalScope();
    duolet = _duolet(self);
    duolet.timerAPI = tickable;
    dsp = createStub({ sampleRate: 44100, bufferLength: 64 });
  });
  describe(".compose(spec: object): self", () => {
    it("compose components", () => {

      duolet.compose({ dsp });

      assert(duolet.dsp === dsp);
      assert(dsp.duolet === duolet);
      assert(duolet.state === "composed");
    });
    it("throws an exception if call more than once", () => {
      duolet.compose({ dsp });

      assert.throws(() => {
        duolet.compose({ dsp });
      });
    });
  });
  describe(".setup(opts: object): self", () => {
    it("setup with configuration", () => {
      duolet.compose({ dsp });
      duolet.setup({});

      assert(dsp.setup.callCount === 1);
      assert(duolet.state === "suspended");
    });
    it("throws an exception if not calling compose first", () => {
      assert.throws(() => {
        duolet.setup({});
      });
    });
  });
  describe(".start(): self", () => {
    it("start all components", () => {
      duolet.compose({ dsp });
      duolet.setup({});
      duolet.start();

      assert(self.postMessage.callCount === 1);
      assert.deepEqual(self.postMessage.args[0][0], { type: ":start" });
      assert(dsp.start.callCount === 1);
      assert(duolet.state === "running");
    });
    it("do nothing", () => {
      duolet.start();

      assert(dsp.start.callCount === 0);
    });
  });
  describe(".stop(): self", () => {
    it("stop all components", () => {
      duolet.compose({ dsp });
      duolet.setup({});
      duolet.start();
      duolet.stop();

      assert(self.postMessage.callCount === 2);
      assert.deepEqual(self.postMessage.args[1][0], { type: ":stop" });
      assert(dsp.stop.callCount === 1);
      assert(duolet.state === "suspended");
    });
    it("do nothing", () => {
      duolet.stop();

      assert(dsp.stop.callCount === 0);
    });
  });
  describe(".process(): void", () => {
    it("works", () => {
      let bufL = new Float32Array(1024);
      let bufR = new Float32Array(1024);
      let processed = new Float32Array(2048);

      for (let i = 0; i < 2048; i++) {
        processed[i] = Math.random() - 0.5;
      }

      duolet.compose({ dsp });
      duolet.setup({ sampleRate: 44100, bufferLength: 1024, bufferSlotCount: 1 });

      duolet.process();
      assert(dsp.process.callCount === 16);
      assert(self.postMessage.callCount === 1);
      assert(self.postMessage.args[0][0] instanceof Float32Array);
      assert(self.postMessage.args[0][1][0] === self.postMessage.args[0][0].buffer);

      duolet.process();
      assert(dsp.process.callCount === 16);
      assert(self.postMessage.callCount === 1);
    });
  });
});
