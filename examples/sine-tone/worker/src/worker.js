var DSP = require("@duolet-example/sine-tone").DSP;
var duolet = require("duolet.worker/worker")(self);

duolet.compose({ dsp: new DSP() });

duolet.recvFromClient = function(data) {
  switch (data.type) {
  case "start":
    duolet.start();
    break;
  case "stop":
    duolet.stop();
    break;
  }
};
