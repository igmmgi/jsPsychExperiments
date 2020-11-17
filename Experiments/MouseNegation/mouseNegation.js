// Negation task using the phrases "now left"/"not left" and mouse tracking responses.

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const canvas_colour = 'rgba(200, 200, 200, 1)';
const canvas_size = [1280, 960];
const canvas_border = '5px solid black';

////////////////////////////////////////////////////////////////////////
//                             Experiment                             //
////////////////////////////////////////////////////////////////////////
const expName = getFileName();
const dirName = getDirName();
const vpNum = genVpNum();

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
  nTrlsP: 16, // number of trials in first block (practice)
  nTrlsE: 48, // number of trials in subsequent blocks
  nBlks: 9,
  fbDur: 500,
  waitDur: 1000,
  iti: 500,
  fbTxt: ['Richtig', 'Falsch'],
  cTrl: 1, // count trials
  cBlk: 1, // count blocks
};

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const task_instructions = {
  type: 'html-keyboard-response',
  stimulus:
    "<H1 style='text-align: left;'>BITTE NUR TEILNEHMEN, FALLS EINE</H1>" +
    "<H1 style='text-align: left;'>COMPUTER-MAUS ZUR VERFÜGUNG STEHT!</H1><br>" +
    "<H2 style='text-align: left;'>Liebe/r Teilnehmer/in</H2><br>" +
    "<H3 style='text-align: left;'>im Experiment werden Sie in jedem Durchgang 3 Quadrate sehen. Zu Beginn</H3>" +
    "<H3 style='text-align: left;'>des Durchgangs bewegen Sie die Maus in das Quadrat am unteren Bildschirmrand</H3>" +
    "<H3 style='text-align: left;'>und klicken in das Quadrat. Dann erscheint eine der folgenden Aussagen:</H3><br>" +
    "<H3 style='text-align: center;'>'jetzt links', 'jetzt rechts', 'nicht links', oder 'nicht rechts'</H3><br>" +
    "<H3 style='text-align: left;'>Bitte bewegen Sie anschließend die Maus in das entsprechende obere</H3>" +
    "<H3 style='text-align: left;'>Quadrat, also das LINKE QUADRAT bei 'jetzt links' und 'nicht rechts', und das</H3>" +
    "<H3 style='text-align: left;'>RECHTE QUADRAT bei 'jetzt rechts' und 'nicht links'. Versuchen Sie</H3>" +
    "<H3 style='text-align: left;'>dabei möglichst schnell und korrekt zu reagieren. Es gibt im folgenden 16 </H3>" +
    "<H3 style='text-align: left;'>Übungsdurchgänge Danach beginnt das richtige Experiment.</H3><br>" +
    "<h3 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h3>",
  post_trial_gap: prms.waitDur,
};

function drawFeedback() {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  let dat = jsPsych.data.get().last(1).values()[0];
  ctx.font = '50px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';
  ctx.fillText(prms.fbTxt[dat.corrCode], dat.end_x, dat.end_y);
}

function codeTrial() {
  'use strict';
  let dat = jsPsych.data.get().last(1).values()[0];
  let corrCode = 0;
  if (dat.resp_loc !== dat.end_loc) {
    corrCode = 1; // choice error
  }
  jsPsych.data.addDataToLastTrial({ date: Date(), corrCode: corrCode, blockNum: prms.cBlk, trialNum: prms.cTrl });
  prms.cTrl += 1;
  if (dat.key_press === 27) {
    jsPsych.endExperiment();
  }
}

const trial_stimulus = {
  type: 'mouse-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  colour: 'black',
  word: jsPsych.timelineVariable('word'),
  scale_factor: null,
  data: {
    stim: 'mouse_negation',
    word: jsPsych.timelineVariable('word'),
    resp_loc: jsPsych.timelineVariable('resp_loc'),
  },
  on_start: function (trial) {
    let dat = jsPsych.data.get().last(1).values()[0];
    trial.scale_factor = dat.scale_factor;
  },
  on_finish: function () {
    codeTrial();
  },
};

stimuli = [
  { word: 'jetzt links', aff_neg: 'aff', resp_loc: 'left' },
  { word: 'jetzt rechts', aff_neg: 'aff', resp_loc: 'right' },
  { word: 'nicht rechts', aff_neg: 'neg', resp_loc: 'left' },
  { word: 'nicht links', aff_neg: 'neg', resp_loc: 'right' },
];

const trial_feedback = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  trial_duration: 500,
  translate_origin: false,
  func: drawFeedback,
};

function blockFeedbackTxt(filter_options) {
  'use strict';
  let dat = jsPsych.data.get().filter({ ...filter_options, blockNum: prms.cBlk });
  let nTotal = dat.count();
  let nError = dat.select('corrCode').values.filter(function (x) {
    return x !== 0;
  }).length;
  dat = jsPsych.data.get().filter({ ...filter_options, blockNum: prms.cBlk, corrCode: 0 });
  let blockFbTxt =
    '<H1>Block: ' +
    prms.cBlk +
    ' of ' +
    prms.nBlks +
    '</H1>' +
    '<H1>Mean RT: ' +
    Math.round(dat.select('end_rt').mean()) +
    ' ms </H1>' +
    '<H1>Error Rate: ' +
    Math.round((nError / nTotal) * 100) +
    ' %</H1>' +
    '<H2>Drücke eine beliebige Taste, um fortzufahren!</H2>';
  prms.cBlk += 1;
  return blockFbTxt;
}

const iti = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  trial_duration: prms.iti,
  response_ends_trial: false,
  func: function () {},
};

const block_feedback = {
  type: 'html-keyboard-response',
  stimulus: '',
  response_ends_trial: true,
  post_trial_gap: prms.waitDur,
  on_start: function (trial) {
    trial.stimulus = blockFeedbackTxt({ stim: 'mouse_negation' });
  },
};

const trial_timeline = {
  timeline: [trial_stimulus, trial_feedback, iti],
  randomize_order: true,
  timeline_variables: stimuli,
};

// For VP Stunden
const randomString = generateRandomString(16);

const alphaNum = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  response_ends_trial: true,
  choices: [32],
  stimulus: generate_formatted_html({
    text:
      `Vielen Dank für Ihre Teilnahme.<br><br>
        Wenn Sie Versuchspersonenstunden benötigen, kopieren Sie den folgenden
        zufällig generierten Code und senden Sie diesen zusammen mit Ihrer
        Matrikelnummer per Email mit dem Betreff 'Versuchpersonenstunde'
        an:<br><br>sprachstudien@psycho.uni-tuebingen.de<br> Code: ` +
      randomString +
      `<br><br>Drücken Sie die Leertaste, um fortzufahren!`,
    fontsize: 28,
    lineheight: 1.0,
    align: 'left',
  }),
};

////////////////////////////////////////////////////////////////////////
//                                Save                                //
////////////////////////////////////////////////////////////////////////
const save_data = {
  type: 'call-function',
  func: function () {
    let data_filename = dirName + 'data/' + expName + '_' + vpNum;
    saveData('/Common/write_data_json.php', data_filename, { stim: 'mouse_negation' }, 'json');
  },
  timing_post_trial: 200,
};

const save_code = {
  type: 'call-function',
  func: function () {
    let code_filename = dirName + 'code/' + expName;
    saveRandomCode('/Common/write_code.php', code_filename, randomString);
  },
  timing_post_trial: 200,
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
  'use strict';

  let exp = [];
  exp.push(fullscreen_on);
  exp.push(welcome_de);
  exp.push(resize_de);
  exp.push(vpInfoForm_de);
  exp.push(task_instructions);

  for (let blk = 0; blk < prms.nBlks; blk += 1) {
    let blk_timeline = { ...trial_timeline };
    blk_timeline.sample = {
      type: 'fixed-repetitions',
      size: blk === 0 ? prms.nTrlsP / 4 : prms.nTrlsE / 4,
    };
    exp.push(blk_timeline); // trials within a block
    exp.push(block_feedback); // show previous block performance
  }

  // save data
  exp.push(save_data);
  exp.push(save_code);

  // debrief
  exp.push(debrief_de);
  exp.push(alphaNum);
  exp.push(fullscreen_off);

  return exp;
}
const EXP = genExpSeq();

jsPsych.init({
  timeline: EXP,
  fullscreen_mode: true,
  show_progress_bar: false,
});
