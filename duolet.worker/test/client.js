"use strict";

const assert = require("assert");
const sinon = require("sinon");
const _duolet = require("../client");

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

describe("duolet.worker/client", () => {
  let duolet, driver;
  let Worker, worker;

  before(() => {
    Worker = global.Worker;
    global.Worker = class Worker {
      constructor() {
        worker = this;
        this.postMessage = sinon.spy();
        this.onmessage = sinon.spy();
      }
    }
  });
  beforeEach(() => {
    duolet = _duolet();
    driver = createStub({ sampleRate: 44100, bufferLength: 1024 });
  });
  after(() => {
    global.Worker = Worker;
  });
  describe(".compose(spec: object): self", () => {
    it("compose components", () => {

      duolet.compose({ driver });

      assert(duolet.driver === driver);
      assert(driver.processor === duolet);
      assert(duolet.state === "composed");
    });
    it("throws an exception if call more than once", () => {
      duolet.compose({ driver });

      assert.throws(() => {
        duolet.compose({ driver });
      });
    });
  });
  describe(".setup(opts: object): self", () => {
    it("setup with configuration", () => {
      duolet.compose({ driver });
      duolet.setup({});

      assert(driver.setup.callCount === 1);
      assert(worker.postMessage.callCount === 1);
      assert(worker.postMessage.args[0][0].type === ":setup");
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
      duolet.compose({ driver });
      duolet.setup({});
      duolet.start();

      assert(driver.start.callCount === 1);
      assert(duolet.state === "running");
    });
    it("do nothing", () => {
      duolet.start();

      assert(driver.start.callCount === 0);
    });
  });
  describe(".stop(): self", () => {
    it("stop all components", () => {
      duolet.compose({ driver });
      duolet.setup({});
      duolet.start();
      duolet.stop();

      assert(driver.stop.callCount === 1);
      assert(duolet.state === "suspended");
    });
    it("do nothing", () => {
      duolet.stop();

      assert(driver.stop.callCount === 0);
    });
  });
  describe(".sendToWorker(data: any)", () => {
    it("send to the server", () => {
      duolet.compose({ driver });
      duolet.sendToWorker({ type: "message" });

      assert(worker.postMessage.callCount === 1);
      assert.deepEqual(worker.postMessage.args[0][0], { type: "message" });
    });
  });
  describe(".recvFromWorker(data: any)", () => {
    it("call duolet method", () => {
      duolet.start = sinon.spy();
      duolet.compose({ driver });
      duolet.recvFromWorker({ type: ":start" });

      assert(duolet.start.callCount === 1);
    });
  });
  describe(".process(bufL: Float32Array, bufR: Float32Array): void", () => {
    it("works", () => {
      let bufL = new Float32Array(1024);
      let bufR = new Float32Array(1024);
      let processed = new Float32Array(2048);

      for (let i = 0; i < 2048; i++) {
        processed[i] = Math.random() - 0.5;
      }

      duolet.compose({ driver });
      duolet.setup({});
      duolet.process(bufL, bufR);

      duolet.recvFromWorker(processed);
      duolet.process(bufL, bufR);
      assert.deepEqual(bufL, processed.subarray(0, 1024));
      assert.deepEqual(bufR, processed.subarray(1024, 2048));
      assert(worker.postMessage.args[1][0] === processed);
      assert.deepEqual(worker.postMessage.args[1][1], [ processed.buffer ]);
    });
  });
});
