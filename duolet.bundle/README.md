# duolet.bundle
[![NPM Version](http://img.shields.io/npm/v/duolet.bundle.svg?style=flat-square)](https://www.npmjs.org/package/duolet.bundle)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](http://mohayonao.mit-license.org/)

All components in the main thread. This architecture works on the browser and the Node.js

[![duolet.bundle](https://raw.githubusercontent.com/wiki/mohayonao/duolet/images/duolet.bundle.png)](https://github.com/mohayonao/duolet/tree/master/duolet.bundle)

## Installation

```
$ npm install duolet.bundle
```

## Example

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

## API
### Duolet
- `constructor()`

#### Instance attributes
- `dsp: duoletDSP`
- `driver: pico.driver`
- `sampleRate: number` _(implicit readonly)_
- `bufferLength: number` _(implicit readonly)_

#### Instance methods
- `compose(spec: object): self`
- `setup(opts: object): self`
- `start(): self`
- `stop(): self`
- `sendToServer(data: any): void`

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
