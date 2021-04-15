// jsPsych mouse-html-response-canvas

let timeline = [];
let mouse_search1 = {
  type: 'mouse-search',
  canvas_size: [1280, 960],
  canvas_border: '5px solid black',
  mask_radius: 50,
};
timeline.push(mouse_search1);

let mouse_search2 = {
  type: 'mouse-search',
  canvas_size: [1280, 960],
  canvas_border: '5px solid black',
  filter: 'opacity(90%) blur(20px)',
  mask_radius: 50,
};
timeline.push(mouse_search2);

let mouse_search3 = {
  type: 'mouse-search',
  canvas_size: [1280, 960],
  canvas_border: '5px solid black',
  filter: 'opacity(90%) blur(20px)',
  image_position: [
    [50, 50, 100, 100],
    [1180, 100, 200, 200],
    [1130, 810, 300, 300],
    [200, 760, 400, 400],
  ],
  mask_radius: 50,
};
timeline.push(mouse_search3);

jsPsych.init({
  timeline: timeline,
  default_iti: 500,
  on_finish: function () {
    jsPsych.data.displayData('json');
  },
});
