// Example self-paced-reading jsPsych plugin

// prettier-ignore
const items = [
    { num: 1, cond: 'CU', sent: 'The man knew that one more spurt was enough to win the game of tennis against his biggest rival.', cpos: 7, dpos: 15 },
    //{ num: 1, cond: 'CA', sent: 'The man knew that one more ace was enough to win the game of tennis against his biggest rival.',   cpos: 7, dpos: 15 },
    //{ num: 2, cond: 'CU', sent: 'She asked about the manuscript and was told that it would be translated as soon as possible.',     cpos: 5, dpos: 13 },
    //{ num: 2, cond: 'CA', sent: 'She asked about the appendix and was told that it would be translated as soon as possible.',       cpos: 5, dpos: 13 },
];

//const versions = [1, 2, 3];
const versions = [1];

let exp_timeline = [];

// Example showing each item in each of the 3 mask type versions
versions.forEach((version) => {
  items.forEach((item) => {
    let moving_window = {
      type: 'self-paced-reading',
      mask_type: version,
      sentence: item.sent,
      font: '20px monospace',
      x_align: 'center',
      translate_origin: true,
      data: {
        item_num: item.num,
        cond: item.cond,
        cpos: item.cpos,
        dpos: items.dpos,
        mask_type: version,
      },
    };
    exp_timeline.push(moving_window);
  });
});

jsPsych.init({
  timeline: exp_timeline,
  default_iti: 500,
  on_finish: function () {
    jsPsych.data.displayData('csv');
  },
});
