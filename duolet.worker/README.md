# duolet.worker
[![NPM Version](http://img.shields.io/npm/v/duolet.worker.svg?style=flat-square)](https://www.npmjs.org/package/duolet.worker)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](http://mohayonao.mit-license.org/)

`DRIVER` in the main thread; `DSP` in the worker thread. This architecture works on the browser.

[![duolet.worker](https://raw.githubusercontent.com/wiki/mohayonao/duolet/images/duolet.worker.png)](https://github.com/mohayonao/duolet/tree/master/duolet.worker)

## Installation

```
$ npm install duolet.worker
```

## Example

in the main thread

```js
const duolet = require("duolet.worker/client")();
const Driver = require("pico.driver.webaudio");

let audioContext = new AudioContext();

duolet.compose({ driver: new Driver(), workerPath: "/path/to/worker" });
duolet.setup({ context: audioContext, bufferLength: 1024 });

duolet.sendToWorker({ type: "start" });
```

in the worker thread

```js
const duolet = require("duolet.worker/worker")(self);
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
- `dsp: DuoletDSP`
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
interface DuoletDSP {
  optional setup(opts: object) => void;
  optional start() => void;
  optional stop() => void;
  process(bufL: Float32Array, bufR: Float32Array) => void;
}
```

## Audio Drivers

- [pico.driver.webaudio](https://github.com/mohayonao/pico.driver/tree/master/pico.driver.webaudio)

## License

MIT
