// jsPsych Template
// Start jsPsych, show "Hello, jsPsych", and wait for key press

function draw() {
  let ctx = document.getElementById('canvas').getContext('2d');
  ctx.textAlign = 'center';
  ctx.font = '50px monospace';
  ctx.fillStyle = 'black';
  ctx.fillText('Hello, jsPsych', 0, 0);
}

// our "Hello, jsPsych" stimulus
const hello = {
  type: 'static-canvas-keyboard-multiple-response',
  stimulus_onset: [0],
  translate_origin: true,
  func: draw,
};

jsPsych.init({
  timeline: [hello],
});
