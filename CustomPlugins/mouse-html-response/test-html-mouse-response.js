// jsPsych mouse-html-response

let timeline = [];
for (let i = 1; i <= 10; i++) {
  let mouse_response = {
    type: 'html-mouse-response',
    stimulus: `<H1>${i}/10<br><br>Press a mouse button!`,
  };
  timeline.push(mouse_response);
  let mouse_feedback = {
    type: 'html-mouse-response',
    stimulus: '',
    response_ends_trial: false,
    trial_duration: 500,
    on_start: function (trial) {
      let dat = jsPsych.data.get().last(1).values()[0];
      trial.stimulus = `<H1>RT: ${dat.rt} ms<br><br>Button: ${dat.button_press}`;
    },
  };
  timeline.push(mouse_feedback);
}

jsPsych.init({
  timeline: timeline,
  on_finish: function () {
    jsPsych.data.displayData('csv');
  },
});
