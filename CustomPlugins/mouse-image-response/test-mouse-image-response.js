// jsPsych mouse-box-response

let timeline = [];

let canvas_size = [1280, 960];
let start_box_size = [50, 50];
let box_size = [100, 100];
let start_box_position = [canvas_size[0] / 2, canvas_size[1] * 0.9, start_box_size[0], start_box_size[1]];
let left_box_position = [canvas_size[0] * 0.2, canvas_size[1] * 0.2, box_size[0], box_size[1]];
let right_box_position = [canvas_size[0] * 0.8, canvas_size[1] * 0.2, box_size[0], box_size[1]];

let images_healthy = {
  type: 'preload',
  auto_preload: true,
  images: ['imgs/health1.jpg'],
};

let images_unhealthy = {
  type: 'preload',
  auto_preload: true,
  images: ['imgs/junk1.jpg'],
};

timeline.push(images_healthy, images_unhealthy);

const trial_stimulus = {
  type: 'mouse-image-response',
  canvas_size: [1280, 960],
  canvas_colour: 'white',
  canvas_border: '5px solid black',
  fixation_position: [canvas_size[0] / 2, canvas_size[1] * 0.8],
  fixation_duration: 1000,
  keep_fixation: false,
  stimulus: 'A Stimulus',
  stimulus_position: [canvas_size[0] / 2, canvas_size[1] * 0.8],
  start_box: start_box_position,
  left_box: left_box_position,
  right_box: right_box_position,
  left_box_colour: 'rgb(200, 200, 200)',
  right_box_colour: 'rgb(200, 200, 200)',
  left_image: images_healthy.images[0],
  right_image: images_unhealthy.images[0],
};

timeline.push(trial_stimulus);
timeline.push(trial_stimulus);

jsPsych.init({
  timeline: timeline,
  override_safe_mode: true,
  on_finish: function () {
    jsPsych.data.displayData('json');
  },
});
