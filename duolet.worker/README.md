# duolet.worker
[![NPM Version](http://img.shields.io/npm/v/duolet.worker.svg?style=flat-square)](https://www.npmjs.org/package/duolet.worker)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](http://mohayonao.mit-license.org/)

`DRIVER` in the main thread; `API/DSP` in the worker thread. This architecture works on the browser.

[![duolet.worker](https://raw.githubusercontent.com/wiki/mohayonao/duolet/images/duolet.worker.png)](https://github.com/mohayonao/duolet/tree/master/duolet.worker)

## Installation

```
$ npm install duolet.worker
```

## Example

```js
const duolet = require("duolet.worker/client");
const Driver = require("pico.driver.webaudio");

let audioContext = new AudioContext();

duolet.compose({ workerPath: "/path/to/worker", driver: new Driver() });
duolet.setup({ context: audioContext, bufferLength: 1024 });

duolet.sendToWorker({ type: "start" });
```

worker.js

```js
const duolet = require("duolet.worker/worker");
const DSP = require("./dsp");

duolet.compose({ dsp: new DSP() });

duolet.recvFromClient = (e) => {
  if (e.type === "start") {
    duolet.start();
  }
};
```

## API
### client/Duolet
- `constructor()`

#### Instance attributes
- `driver: pico.driver`
- `sampleRate: number` _(implicit readonly)_
- `bufferLength: number` _(implicit readonly)_

#### Instance methods
- `compose(spec: object): self`
- `setup(opts: object): self`
- `start(): self`
- `stop(): self`
- `sendToServer(data: any): void`

### worker/Duolet
- `constructor(self: DedicatedWorkerGlobalScope)`

#### Instance attributes
- `dsp: duoletDSP`
- `sampleRate: number` _(implicit readonly)_
- `bufferLength: number` _(implicit readonly)_

#### Instance methods
- `compose(spec: object): self`
- `setup(opts: object): self`
- `start(): self`
- `stop(): self`
- `sendToClient(data: any): void`

## Interfaces

- [duolet.dsp](https://github.com/mohayonao/duolet/tree/master/duolet.dsp)

```
interface duoletDSP {
  optional setup(opts: object) => void;
  optional start() => void;
  optional stop() => void;
  process(bufL: Float32Array, bufR: Float32Array) => void;
}
```

## Audio Drivers

- https://github.com/mohayonao/pico.driver

## License

MIT
