# duolet
[![Build Status](http://img.shields.io/travis/mohayonao/duolet.svg?style=flat-square)](https://travis-ci.org/mohayonao/duolet)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](http://mohayonao.mit-license.org/)

> 2 layered architecture for sound programming in JavaScript

## Installation

### duolet.bundle
[![NPM Version](http://img.shields.io/npm/v/duolet.bundle.svg?style=flat-square)](https://www.npmjs.org/package/duolet.bundle)

All components in the main thread. This architecture works on the browser and the Node.js

[![duolet.bundle](https://raw.githubusercontent.com/wiki/mohayonao/duolet/images/duolet.bundle.png)](https://github.com/mohayonao/duolet/tree/master/duolet.bundle)

```
$ npm install duolet.bundle
```

in the main thread

```js
const duolet = require("duolet.bundle")();
const Driver = require("pico.driver.webaudio");
const DSP = require("./dsp");

let audioContext = new AudioContext();

duolet.compose({ dsp: new DSP(), driver: new Driver() });
duolet.setup({ context: audioContext, bufferLength: 1024 });

duolet.start();
```

### duolet.worker
[![NPM Version](http://img.shields.io/npm/v/duolet.worker.svg?style=flat-square)](https://www.npmjs.org/package/duolet.worker)

`DRIVER` in the main thread; `DSP` in the worker thread. This architecture works on the browser.

[![duolet.worker](https://raw.githubusercontent.com/wiki/mohayonao/duolet/images/duolet.worker.png)](https://github.com/mohayonao/duolet/tree/master/duolet.worker)

```
$ npm install duolet.worker
```

in the main thread

```js
const duolet = require("duolet.worker/client")();
const Driver = require("pico.driver.webaudio");

let audioContext = new AudioContext();

duolet.compose({ workerPath: "/path/to/worker", driver: new Driver() });
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

- https://github.com/mohayonao/pico.driver

## License

MIT
