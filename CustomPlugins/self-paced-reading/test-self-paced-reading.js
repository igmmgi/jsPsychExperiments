// jsPsych self-paced-reading

const sentences = [
  `The quick brown fox jumps over the lazy dog.`,
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
    x_align: 'center',
    translate_origin: true,
    xy_position: [0, 0],
  };
  timeline.push(moving_window);
}

// Mask type 1
for (let sent_num = 0; sent_num < sentences.length; sent_num++) {
  let moving_window = {
    type: 'self-paced-reading',
    mask_type: 1,
    mask_on_word: false,
    mask_y_offset: -10,
    sentence: sentences[sent_num],
    font: '24px monospace',
    x_align: 'left',
    translate_origin: true,
    xy_position: [-300, 0],
  };
  timeline.push(moving_window);
}

// Mask type 1
for (let sent_num = 0; sent_num < sentences.length; sent_num++) {
  let moving_window = {
    type: 'self-paced-reading',
    mask_type: 1,
    mask_on_word: false,
    mask_y_offset: -10,
    mask_gap_character: '_',
    sentence: sentences[sent_num],
    font: '24px monospace',
    x_align: 'left',
    translate_origin: true,
    xy_position: [-300, 0],
  };
  timeline.push(moving_window);
}

// Mask type 1
for (let sent_num = 0; sent_num < sentences.length; sent_num++) {
  let moving_window = {
    type: 'self-paced-reading',
    mask_type: 1,
    mask_on_word: false,
    mask_y_offset: 5,
    mask_character: '*',
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

// user define line breaks
const sentences_with_line_breaks = [
  'The quick brown fox \njumps over the lazy dog.',
  'Victor jagt zwölf Boxkämpfer \nquer über den großen Sylter Deich.',
  `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
neirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
voluptua. At vero eos et accusam et justo duo dolores et ea rebum.`,
];

// Mask type 1
for (let sent_num = 0; sent_num < sentences_with_line_breaks.length; sent_num++) {
  let moving_window = {
    type: 'self-paced-reading',
    mask_type: 1,
    sentence: sentences_with_line_breaks[sent_num],
    font: '20px monospace',
    x_align: 'left',
    line_height: 30,
    translate_origin: true,
    xy_position: [-400, 0],
  };
  timeline.push(moving_window);
}

// Mask type 1
for (let sent_num = 0; sent_num < sentences_with_line_breaks.length; sent_num++) {
  let moving_window = {
    type: 'self-paced-reading',
    mask_type: 2,
    sentence: sentences_with_line_breaks[sent_num],
    mask_on_word: false,
    font: '20px monospace',
    x_align: 'left',
    y_align: 'center',
    line_height: 30,
    translate_origin: true,
    xy_position: [-400, -200],
  };
  timeline.push(moving_window);
}

// Mask type 3
for (let sent_num = 0; sent_num < sentences.length; sent_num++) {
  let moving_window = {
    type: 'self-paced-reading',
    mask_type: 3,
    sentence: sentences[sent_num],
    font: '24px monospace',
    x_align: 'center',
    translate_origin: true,
    xy_position: [0, 0],
  };
  timeline.push(moving_window);
}

jsPsych.init({
  timeline: timeline,
  default_iti: 500,
  on_finish: function () {
    jsPsych.data.displayData('csv');
  },
});
