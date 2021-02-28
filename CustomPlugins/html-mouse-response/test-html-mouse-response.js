// jsPsych html-mouse-response

let timeline = [];
for (let i = 1; i <= 10; i++) {
  let mouse_response = {
    type: 'html-mouse-response',
    stimulus: `<H1>${i}/20<br><br>Press a mouse button!`,
  };
  timeline.push(mouse_response);
  let mouse_feedback = {
    type: 'html-mouse-response',
    stimulus: '',
    response_ends_trial: false,
    trial_duration: 1000,
    on_start: function (trial) {
      let dat = jsPsych.data.get().last(1).values()[0];
      trial.stimulus = `<H1>RT: ${dat.rt}<br><br>Button: ${dat.button_press}`;
    },
  };
  timeline.push(mouse_feedback);
}

jsPsych.init({
  timeline: timeline,
});
