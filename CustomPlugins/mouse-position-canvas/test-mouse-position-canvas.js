// jsPsych html-mouse-response-canvas

const resize_en = {
  type: 'resize',
  item_width: 3 + 3 / 8,
  item_height: 2 + 1 / 8,
  prompt:
    '<p>Resize the rectangle (click and drag bottom right corner) until it is the same size as a standard bankcard.</p>',
  pixels_per_unit: 100,
};

let timeline = [];
let mouse_position1 = {
  type: 'html-mouse-position-canvas',
  translate_origin: false,
};
timeline.push(resize_en);
timeline.push(mouse_position1);

let mouse_position2 = {
  type: 'html-mouse-position-canvas',
  translate_origin: true,
};
timeline.push(mouse_position2);

jsPsych.init({
  timeline: timeline,
  on_finish: function () {
    jsPsych.data.displayData('json');
  },
});
