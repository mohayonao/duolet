"use strict";

const assert = require("assert");
const sinon = require("sinon");
const _duolet = require("../");

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

describe("duolet.bundle", () => {
  let duolet, dsp, driver;

  beforeEach(() => {
    duolet = _duolet();
    dsp = createStub({ sampleRate: 22050, bufferLength: 64 });
    driver = createStub({ sampleRate: 44100, bufferLength: 1024 });
  });
  describe(".compose(spec: object): self", () => {
    it("compose components", () => {

      duolet.compose({ dsp, driver });

      assert(duolet.dsp === dsp);
      assert(duolet.driver === driver);
      assert(dsp.duolet === duolet);
      assert(driver.processor === duolet);
      assert(duolet.state === "composed");
    });
    it("throws an exception if call more than once", () => {
      duolet.compose({ dsp, driver });

      assert.throws(() => {
        duolet.compose({ dsp, driver });
      });
    });
  });
  describe(".setup(opts: object): self", () => {
    it("setup with configuration", () => {
      duolet.compose({ dsp, driver });
      duolet.setup({});

      assert(driver.setup.callCount === 1);
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
      duolet.compose({ dsp, driver });
      duolet.setup({});
      duolet.start();

      assert(driver.start.callCount === 1);
      assert(dsp.start.callCount === 1);
      assert(duolet.state === "running");
    });
    it("do nothing", () => {
      duolet.start();

      assert(driver.start.callCount === 0);
      assert(dsp.start.callCount === 0);
    });
  });
  describe(".stop(): self", () => {
    it("stop all components", () => {
      duolet.compose({ dsp, driver });
      duolet.setup({});
      duolet.start();
      duolet.stop();

      assert(driver.stop.callCount === 1);
      assert(dsp.stop.callCount === 1);
      assert(duolet.state === "suspended");
    });
    it("do nothing", () => {
      duolet.stop();

      assert(driver.stop.callCount === 0);
      assert(dsp.stop.callCount === 0);
    });
  });
  describe(".process(bufL: Float32Array, bufR: Float32Array): void", () => {
    it("works", () => {
      let bufL = new Float32Array(1024);
      let bufR = new Float32Array(1024);

      duolet.compose({ dsp, driver });
      duolet.setup({});
      duolet.process(bufL, bufR);

      assert(dsp.process.callCount === 16);
    });
  });
});
