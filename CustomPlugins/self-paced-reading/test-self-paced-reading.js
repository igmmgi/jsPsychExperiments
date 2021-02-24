// jsPsych html-mouse-response
const sentences = [
  'The quick brown fox jumps over the lazy dog.',
  'Victor jagt zwölf Boxkämpfer quer über den großen Sylter Deich.',
];

let timeline = [];

// Mask type 1
for (let sent_num = 0; sent_num < sentences.length; sent_num++) {
  let moving_window = {
    type: 'self-paced-reading',
    mask_type: 1,
    sentence: sentences[sent_num],
    font: '24px monospace',
    x_align: 'left',
    translate_origin: true,
    xy_position: [-300, 0],
  };
  timeline.push(moving_window);
}

// Mask type 2
for (let sent_num = 0; sent_num < sentences.length; sent_num++) {
  let moving_window = {
    type: 'self-paced-reading',
    mask_type: 2,
    sentence: sentences[sent_num],
    font: '24px monospace',
    x_align: 'center',
    translate_origin: true,
    xy_position: [0, 0],
  };
  timeline.push(moving_window);
}

// // Mask type 3
// for (let sent_num = 0; sent_num < sentences.length; sent_num++) {
//   let moving_window = {
//     type: 'self-paced-reading',
//     mask_type: 3,
//     sentence: sentences[sent_num],
//     font: '24px monospace',
//     x_align: 'center',
//     translate_origin: true,
//     xy_position: [0, 0],
//   };
//   timeline.push(moving_window);
// }

jsPsych.init({
  timeline: timeline,
  default_iti: 500,
  on_finish: function () {
    jsPsych.data.displayData('csv');
  },
});
