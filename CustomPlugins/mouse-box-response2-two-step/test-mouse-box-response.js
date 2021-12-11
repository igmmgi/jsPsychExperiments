// jsPsych mouse-box-response

let timeline = [];

let canvas_size = [1280, 960];
let box_size = [50, 50];
let start_box_position = [canvas_size[0] / 2, canvas_size[1] * 0.9, box_size[0], box_size[1]];
let left_box_position = [canvas_size[0] * 0.2, canvas_size[1] * 0.1, box_size[0], box_size[1]];
let right_box_position = [canvas_size[0] * 0.8, canvas_size[1] * 0.1, box_size[0], box_size[1]];

const trial_stimulus = {
  type: 'mouse-box-response',
  canvas_size: [1280, 960],
  canvas_colour: 'lightgrey',
  canvas_border: '5px solid black',
  fixation_position: [canvas_size[0] / 2, canvas_size[1] * 0.8],
  fixation_duration: 500,
  keep_fixation: false,
  stimulus: 'A Stimulus',
  stimulus_position: [canvas_size[0] / 2, canvas_size[1] * 0.8],
  start_box: start_box_position,
  left_box: left_box_position,
  right_box: right_box_position,
};

timeline.push(trial_stimulus);
timeline.push(trial_stimulus);

jsPsych.init({
  timeline: timeline,
  on_finish: function () {
    jsPsych.data.displayData('json');
  },
});
