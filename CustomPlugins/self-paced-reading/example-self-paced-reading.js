// Example self-paced-reading jsPsych plugin

// prettier-ignore
const items = [
    { item: 1, cond: 'CU', sentence: 'The man knew that one more spurt was enough to win the game of tennis against his biggest rival.', crit_pos: 7, dis_pos: 15 },
    { item: 1, cond: 'CA', sentence: 'The man knew that one more ace was enough to win the game of tennis against his biggest rival.',   crit_pos: 7, dis_pos: 15 },
    { item: 2, cond: 'CU', sentence: 'She asked about the manuscript and was told that it would be translated as soon as possible.',     crit_pos: 5, dis_pos: 13 },
    { item: 2, cond: 'CA', sentence: 'She asked about the appendix and was told that it would be translated as soon as possible.',       crit_pos: 5, dis_pos: 13 },
];

let exp_timeline = [];

// Example showing each item in each of the 3 mask types
for (let mask_type = 1; mask_type < 4; mask_type++) {
  for (let item = 0; item < items.length; item++) {
    let moving_window = {
      type: 'self-paced-reading',
      mask_type: mask_type,
      sentence: items[item].sentence,
      font: '20px monospace',
      x_align: 'center',
      translate_origin: true,
      data: {
        cond: items[item].cond,
        crit_pos: items[item].crit_pos,
        dis_pos: items[item].dis_pos,
        mask_type: mask_type,
      },
    };
    exp_timeline.push(moving_window);
  }
}

jsPsych.init({
  timeline: exp_timeline,
  default_iti: 500,
  on_finish: function () {
    jsPsych.data.displayData('csv');
  },
});
