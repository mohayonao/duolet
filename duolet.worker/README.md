# duolet.worker
[![NPM Version](http://img.shields.io/npm/v/duolet.worker.svg?style=flat-square)](https://www.npmjs.org/package/duolet.worker)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](http://mohayonao.mit-license.org/)

`DRIVER` in the main thread; `API/DSP` in the worker thread. This architecture works on the browser.

[![duolet.worker](https://raw.githubusercontent.com/wiki/mohayonao/duolet/images/duolet.worker.png)](https://github.com/mohayonao/duolet/tree/master/duolet.worker)

## Installation

```
$ npm install duolet.worker
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

## Audio Drivers

- https://github.com/mohayonao/pico.driver

## License

MIT
