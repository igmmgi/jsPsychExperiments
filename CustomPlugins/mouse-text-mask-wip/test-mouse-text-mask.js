// jsPsych mouse-box-response

let timeline = [];

const trial_stimulus = {
  type: 'mouse-text-mask',
  canvas_size: [1280, 960],
  canvas_border: '5px solid black',
  mask_colour: 'rgb(245, 245, 245)',
  sentence: 'The quick brown fox jumps \nover the lazy dog!',
  font: '40px arial',
};

timeline.push(trial_stimulus);

jsPsych.init({
  timeline: timeline,
  on_finish: function () {
    jsPsych.data.displayData('json');
  },
});
