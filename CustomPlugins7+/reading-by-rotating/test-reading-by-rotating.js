var jsPsych = initJsPsych({
});


// Instructions
var instructions = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<p style="font-size:30px;font-weight:bold;">ANSWEISUNGEN</p><p>Wenn das Wort "öffnet" erscheint, drehen Sie den Knopf im Uhrzeigersinn.</p><p>Wenn das Wort "schließt" erscheint, drehen Sie den Knopf gegen den Uhrzeigersinn.</p><p>Drücken Sie eine beliebige Taste, um fortzufahren.</p>'
};

// Fullscreen
var enter_fullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: true,
  message: "<p>Das Experiment wechselt in den Vollbildmodus, wenn Sie auf Weiter klicken.</p>",
  button_label: "Weiter"
};


////////////////////////////////////////////////////////////////////////////////
////////////////////////////// SEGMENTS ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function segment(my_segment) {

  return {
    timeline: [
    {
      type: jsPsychKnobStaticResponse,
      canvas_border: '5px solid black',
      response_border_x: 100,
      text: my_segment,
    }]};
};

function critical_segment(my_segment) {

  return {
    timeline: [
    {
      type: jsPsychKnobDragResponse,
      canvas_border: '5px solid black',
      response_border_x: 100,
      text: my_segment,
      rotation_direction: 'clockwise'
    }
  ]};
};


var segment1 = segment('Emilio');
var segment2 = segment('hat dieses Wochenende');
var segment3 = segment('Besuch von Freunden');
var segment4 = segment('und bereitet');
var segment5 = segment('mit viel Mühe');
var segment6 = segment('ein üppiges Frühstück zu.');
var segment7 = segment('Er');
var critical_segment = critical_segment('öffnet ein Marmeladenglas.');
var segment8 = segment('Er hofft');
var segment9 = segment('dass allen Gästen');
var segment10 = segment('sein Frühstück');
var segment11 = segment('schmecken wird.');

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////



// Timeline of one trial
var timeline = [instructions, enter_fullscreen, segment1, segment2, segment3, segment4, segment5, segment6, segment7,
  critical_segment, segment8, segment9, segment10, segment11];


// Start Experiment
jsPsych.run(timeline);