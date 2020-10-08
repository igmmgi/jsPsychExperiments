// Standard Flanker Task with vertical and horizontal stimulus arrays:
// VPs respond to the direction of the central arrow whilst
// ignoring the surrounding arrows using key responses ("C" and "M").
// Feedback provided during the practice block

const expName = getFileName();
const dirName = getDirName();
const vpNum = genVpNum();

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
  nTrlsP: 16,
  nTrlsE: 96,
  nBlks: 11,
  fixDur: 500,
  fbDur: 1000,
  waitDur: 1000,
  iti: 500,
  tooFast: 150,
  tooSlow: 1500,
  respKeys: ['C', 'M', 27],
  fbTxt: ['Richtig', 'Falsch', 'Zu langsam', 'Zu schnell'],
  cTrl: 1,
  cBlk: 1,
};

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const task_instructions = {
  type: 'html-keyboard-response',
  stimulus:
    "<h1 style='text-align:center;'>Aufgabe:</h1>" +
    "<h2 style='text-align:center;'>Reagieren Sie auf die Ausrichtung des mittleren Pfeils:</h2>" +
    "<h2 style='text-align:center;'>LINKS  = C Taste</h2>" +
    "<h2 style='text-align:center;'>RECHTS = M Taste</h2>" +
    "<h2 style='text-align:center;'>Drücken Sie eine beliebige Taste, um fortzufahren!</h2>",
  post_trial_gap: prms.waitDur,
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////
const fixation_cross = {
  type: 'html-keyboard-response',
  stimulus: '<div style="font-size:60px;">+</div>',
  choices: jsPsych.NO_KEYS,
  trial_duration: prms.fixDur,
  post_trial_gap: 0,
  data: { stim: 'fixation' },
};

const flankers = [
  [
    "<div class='left' style='float: left'></div>" +
      "<div class='left' style='float: left'></div>" +
      "<div class='left' style='float: right'></div>",
  ],
  [
    "<div class='right' style='float: left'></div>" +
      "<div class='left'  style='float: left'></div>" +
      "<div class='right' style='float: right'></div>",
  ],
  [
    "<div class='right' style='float: left'></div>" +
      "<div class='right' style='float: left'></div>" +
      "<div class='right' style='float: right'></div>",
  ],
  [
    "<div class='left'  style='float: left'></div>" +
      "<div class='right' style='float: left'></div>" +
      "<div class='left'  style='float: right'></div>",
  ],
  ["<div class='left'></div>" + "<div class='left'></div>" + "<div class='left'></div>"],
  ["<div class='right'></div>" + "<div class='left'></div>" + "<div class='right'></div>"],
  ["<div class='right'></div>" + "<div class='right'></div>" + "<div class='right'></div>"],
  ["<div class='left'></div>" + "<div class='right'></div>" + "<div class='left'></div>"],
];

const flanker_stimulus = {
  type: 'html-keyboard-response',
  stimulus: jsPsych.timelineVariable('flanker'),
  trial_duration: prms.tooSlow,
  response_ends_trial: true,
  choices: prms.respKeys,
  post_trial_gap: 0,
  data: {
    stimulus: 'flanker',
    dimension: jsPsych.timelineVariable('dim'),
    compatibility: jsPsych.timelineVariable('comp'),
    direction: jsPsych.timelineVariable('dir'),
    corrResp: jsPsych.timelineVariable('key'),
  },
  on_finish: function () {
    codeTrial();
  },
};

const trial_feedback = {
  type: 'html-keyboard-response',
  stimulus: '',
  trial_duration: prms.fbDur,
  response_ends_trial: false,
  post_trial_gap: prms.iti,
  data: { stim: 'feedback' },
  on_start: function (trial) {
    if (prms.cBlk === 1) {
      trial.stimulus = trialFeedbackTxt(prms.fbTxt);
    }
  },
};

const block_feedback = {
  type: 'html-keyboard-response',
  stimulus: blockFeedbackTxt,
  response_ends_trial: true,
  post_trial_gap: prms.waitDur,
};

const trial_timeline = {
  timeline: [fixation_cross, flanker_stimulus, trial_feedback],
  timeline_variables: [
    { flanker: flankers[0], dim: 'hor', comp: 'comp', dir: 'left', key: prms.respKeys[0] },
    { flanker: flankers[1], dim: 'hor', comp: 'incomp', dir: 'left', key: prms.respKeys[0] },
    { flanker: flankers[2], dim: 'hor', comp: 'comp', dir: 'right', key: prms.respKeys[1] },
    { flanker: flankers[3], dim: 'hor', comp: 'incomp', dir: 'right', key: prms.respKeys[1] },
    { flanker: flankers[4], dim: 'ver', comp: 'comp', dir: 'left', key: prms.respKeys[0] },
    { flanker: flankers[5], dim: 'ver', comp: 'incomp', dir: 'left', key: prms.respKeys[0] },
    { flanker: flankers[6], dim: 'ver', comp: 'comp', dir: 'right', key: prms.respKeys[1] },
    { flanker: flankers[7], dim: 'ver', comp: 'incomp', dir: 'right', key: prms.respKeys[1] },
  ],
};

const randomString = generateRandomString(16);

const alphaNum = {
  type: 'html-keyboard-response',
  stimulus:
    '<h1>Wenn Sie für diesen Versuch eine Versuchspersonenstunde</h1>' +
    '<h1>benötigen, kopieren Sie den folgenden zufällig generierten Code</h1>' +
    '<h1>und senden Sie diesen zusammen mit Ihrer Matrikelnummer per Email an:</h1>' +
    '<h2>XXX@XXX</h2>' +
    '<h1>Code:' +
    randomString +
    '</h1>' +
    '<h2>Drücken Sie eine beliebige Taste, um fortzufahren!</h2>',
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
  'use strict';

  let exp = [];

  exp.push(welcome_de);
  //exp.push(vpInfoForm);
  exp.push(task_instructions);

  for (let blk = 0; blk < prms.nBlks; blk += 1) {
    let blk_timeline = { ...trial_timeline };
    blk_timeline.sample = { type: 'fixed-repetitions', size: blk === 0 ? prms.nTrlsP / 8 : prms.nTrlsE / 8 };
    exp.push(blk_timeline); // trials within a block
    exp.push(block_feedback); // show previous block performance
  }
  exp.push(debrief_de);
  exp.push(alphaNum);
  return exp;
}
const EXP = genExpSeq();
const filename = dirName + 'data/' + expName + '_' + genVpNum();

jsPsych.init({
  timeline: EXP,
  fullscreen: false,
  show_progress_bar: false,
  on_finish: function () {
    saveRandomCode(expName);
    saveData('/Common/write_data.php', filename, { stim: 'flanker' });
  },
});
