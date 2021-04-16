// jsPsych mouse-box-response

let timeline = [];

const trial_stimulus1 = {
  type: 'mouse-text-mask',
  canvas_size: [1280, 960],
  canvas_border: '5px solid black',
  sentence: 'The quick brown fox jumps over the lazy dog!',
  sentence_border: true,
  translate_origin: false,
  xy_position: [100, 100],
  font: '40px monospace',
};
timeline.push(trial_stimulus1);

const trial_stimulus2 = {
  type: 'mouse-text-mask',
  canvas_size: [1280, 960],
  canvas_border: '5px solid black',
  sentence: 'The quick brown fox jumps over the lazy dog!',
  sentence_border: false,
  translate_origin: true,
  xy_position: [-400, 0],
  filter: 'blur(10px)',
  font: '30px monospace',
};
timeline.push(trial_stimulus2);

const trial_stimulus3 = {
  type: 'mouse-text-mask',
  canvas_size: [1280, 960],
  canvas_border: '5px solid black',
  sentence: `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
neirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
voluptua. At vero eos et accusam et justo duo dolores et ea rebum.`,
  sentence_border: true,
  translate_origin: false,
  xy_position: [100, 480],
  x_align: 'left',
  y_align: 'center',
  mask_radius: 15,
  mask_scale: [4, 1],
  filter: 'blur(10px)',
  line_height: 30,
  font: '24px monospace',
};
timeline.push(trial_stimulus3);

jsPsych.init({
  timeline: timeline,
  on_finish: function () {
    jsPsych.data.displayData('json');
  },
});
