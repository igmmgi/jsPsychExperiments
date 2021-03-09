// jsPsych mouse-box-response

let timeline = [];

const trial_stimulus = {
  type: 'mouse-drag-response',
  canvas_size: [1280, 960],
  canvas_colour: 'lightgrey',
  canvas_border: '5px solid black',
  response_border_x: 100,
};

timeline.push(trial_stimulus);

jsPsych.init({
  timeline: timeline,
  on_finish: function () {
    jsPsych.data.displayData('json');
  },
});
