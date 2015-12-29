var Driver = require("pico.driver.webaudio");
var duolet = require("duolet.worker/client")();

window.AudioContext = window.AudioContext || window.webkitAudioContext;

window.addEventListener("DOMContentLoaded", function() {
  var audioContext = new AudioContext();

  duolet.compose({ driver: new Driver(), workerPath: "./bundle.worker.js" });
  duolet.setup({ context: audioContext, bufferLength: 1024 });

  document.getElementById("button").onclick = function(e) {
    if (duolet.state === "suspended") {
      duolet.sendToWorker({ type: "start" });
      e.target.textContent = "stop";
    } else {
      duolet.sendToWorker({ type: "stop" });
      e.target.textContent = "start";
    }
  };
});
