var DSP = require("@duolet-example/sine-tone").DSP;
var Driver = require("pico.driver.webaudio");
var duolet = require("duolet.bundle")();

window.AudioContext = window.AudioContext || window.webkitAudioContext;

window.addEventListener("DOMContentLoaded", function() {
  var audioContext = new AudioContext();

  duolet.compose({ dsp: new DSP(), driver: new Driver() });
  duolet.setup({ context: audioContext, bufferLength: 1024 });

  document.getElementById("button").onclick = function(e) {
    if (duolet.state === "suspended") {
      duolet.start();
      e.target.textContent = "stop";
    } else {
      duolet.stop();
      e.target.textContent = "start";
    }
  };
});
