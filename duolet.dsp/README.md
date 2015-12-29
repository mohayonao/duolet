# duolet.dsp
[![NPM Version](http://img.shields.io/npm/v/duolet.dsp.svg?style=flat-square)](https://www.npmjs.org/package/duolet.dsp)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](http://mohayonao.mit-license.org/)

> base class for duolet DSP

## Installation

```
$ npm install duolet.dsp
```

## API
### DuoletDSP
- `constructor()`

#### Instance attributes
- `duolet: Duolet` _(required)_
- `sampleRate: number` _(implicit readonly)_
- `bufferLength: number` _(implicit readonly)_

#### Instance methods
- `setup(opts: object): void`
- `start(): void`
- `stop(): void`
- `process(bufL: Float32Array, bufR: Float32Array): void`

#### Duolet Interface
```
interface Duolet {
  dsp: DuoletDSP;
}
```

## License

MIT
