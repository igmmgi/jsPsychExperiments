// jsPsych Template
// Start jsPsych, show "Hello, jsPsych", and wait for key press

// our "Hello, jsPsych" stimulus
const hello = {
  type: 'html-keyboard-response-canvas',
  stimulus: 'Hello, jsPsych canvas!',
};

jsPsych.init({
  timeline: [resize_en, hello],
  // timeline: [hello],
});
