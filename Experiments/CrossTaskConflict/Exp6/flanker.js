﻿// Standard Flanker Task with horizontal arrow and letter stimulus arrays:
// VPs respond to the direction of the central arrow/letter whilst
// ignoring the surrounding arrows/letters using key responses ("X" and "M").
// Feedback provided during the practice block

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
  mapping: jsPsych.randomization.sampleWithoutReplacement([1, 2], 1)[0],
  respKeys: ['C', 'M', 27],
  fbTxt: ['Richtig', 'Falsch', 'Zu langsam', 'Zu schnell'],
  cTrl: 1,
  cBlk: 1,
};

prms.stimMap = prms.mapping === 1 ? ['H', 'S'] : ['S', 'H'];
prms.respKeys = prms.mapping === 1 ? ['C', 'M', 'C', 'M'] : ['C', 'M', 'M', 'C'];

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const task_instructions = {
  type: 'html-keyboard-response',
  stimulus:
    "<h1 style='text-align:center;'>Aufgabe:</h1>" +
    "<h2 style='text-align:center;'>Reagieren Sie auf die Ausrichtung des mittleren Pfeils oder des mittleren Buchstabe:</h2>" +
    "<h2 style='text-align:center;'>LINKS oder " +
    prms.stimMap[0] +
    ' = C Taste</h2>' +
    "<h2 style='text-align:center;'>RECHTS oder " +
    prms.stimMap[1] +
    ' = M Taste</h2>' +
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
};

// prettier-ignore
const flankers = [
  ["<div class='left'  style='float: left'></div>" + "<div class='left'  style='float: left'></div>" + "<div class='left'  style='float: right'></div>",],
  ["<div class='right' style='float: left'></div>" + "<div class='left'  style='float: left'></div>" + "<div class='right' style='float: right'></div>",],
  ["<div class='right' style='float: left'></div>" + "<div class='right' style='float: left'></div>" + "<div class='right' style='float: right'></div>",],
  ["<div class='left'  style='float: left'></div>" + "<div class='right' style='float: left'></div>" + "<div class='left'  style='float: right'></div>",],
  ["<div style='font-size:3.0cm'>H H H</div>"],
  ["<div style='font-size:3.0cm'>S H S</div>"],
  ["<div style='font-size:3.0cm'>S S S</div>"],
  ['<div style="font-size:3.0cm">H S H</div>'],
];

function codeTrial() {
  'use strict';
  let dat = jsPsych.data.get().last(1).values()[0];
  dat.rt = dat.rt !== null ? dat.rt : prms.tooSlow;

  let corrCode = 0;
  let correctKey = jsPsych.pluginAPI.compareKeys(dat.response, dat.corrResp);

  if (correctKey && dat.rt > prms.tooFast && dat.rt < prms.tooSlow) {
    corrCode = 1; // correct
  } else if (!correctKey && dat.rt > prms.tooFast && dat.rt < prms.tooSlow) {
    corrCode = 2; // choice error
  } else if (dat.rt >= prms.tooSlow) {
    corrCode = 3; // too slow
  } else if (dat.rt <= prms.tooFast) {
    corrCode = 4; // too false
  }
  jsPsych.data.addDataToLastTrial({
    date: Date(),
    corrCode: corrCode,
    blockNum: prms.cBlk,
    trialNum: prms.cTrl,
  });
}

const flanker_stimulus = {
  type: 'html-keyboard-response',
  stimulus: jsPsych.timelineVariable('flanker'),
  trial_duration: prms.tooSlow,
  response_ends_trial: true,
  choices: prms.respKeys,
  post_trial_gap: 0,
  data: {
    stimulus: 'flanker',
    type: jsPsych.timelineVariable('type'),
    compatibility: jsPsych.timelineVariable('comp'),
    direction: jsPsych.timelineVariable('dir'),
    corrResp: jsPsych.timelineVariable('key'),
  },
  on_finish: function () {
    codeTrial();
    prms.cTrl += 1;
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
  stimulus: '',
  response_ends_trial: true,
  post_trial_gap: prms.waitDur,
  on_start: function (trial) {
    let block_dvs = calculateBlockPerformance({ filter_options: { stimulus: 'simonSnarc', blockNum: prms.cBlk } });
    trial.stimulus = blockFeedbackText(prms.cBlk, prms.nBlks, block_dvs.meanRt, block_dvs.errorRate);
  },
  on_finish: function () {
    prms.cBlk += 1;
  },
};

const trial_timeline = {
  timeline: [fixation_cross, flanker_stimulus, trial_feedback],
  timeline_variables: [
    { flanker: flankers[0], type: 'arrow', comp: 'comp', dir: 'left', key: prms.respKeys[0] },
    { flanker: flankers[1], type: 'arrow', comp: 'incomp', dir: 'left', key: prms.respKeys[0] },
    { flanker: flankers[2], type: 'arrow', comp: 'comp', dir: 'right', key: prms.respKeys[1] },
    { flanker: flankers[3], type: 'arrow', comp: 'incomp', dir: 'right', key: prms.respKeys[1] },
    { flanker: flankers[4], type: 'letter', comp: 'comp', dir: 'left', key: prms.respKeys[1] },
    { flanker: flankers[5], type: 'letter', comp: 'incomp', dir: 'left', key: prms.respKeys[1] },
    { flanker: flankers[6], type: 'letter', comp: 'comp', dir: 'right', key: prms.respKeys[0] },
    { flanker: flankers[7], type: 'letter', comp: 'incomp', dir: 'right', key: prms.respKeys[0] },
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

// save
const dirName = getDirName();
const expName = getFileName();

function save() {
  let vpNum = getTime();
  let pcInfo = getComputerInfo();
  jsPsych.data.addProperties({ vpNum: vpNum, pcInfo: pcInfo });

  let fn = dirName + 'data/' + expName + vpNum;
  saveData('/Common/write_data.php', fn, { stimulus: 'simonSnarc' });
}

const save_data = {
  type: 'call-function',
  func: save,
  post_trial_gap: 1000,
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
  'use strict';

  let exp = [];

  exp.push(fullscreen(true));
  exp.push(welcome_message());
  exp.push(vpInfoForm());
  exp.push(mouseCursor(false));
  exp.push(task_instructions);

  for (let blk = 0; blk < prms.nBlks; blk += 1) {
    let blk_timeline = { ...trial_timeline };
    blk_timeline.sample = {
      type: 'fixed-repetitions',
      size: blk === 0 ? prms.nTrlsP / 8 : prms.nTrlsE / 8,
    };
    exp.push(blk_timeline); // trials within a block
    exp.push(block_feedback); // show previous block performance
  }
  exp.push(save_data);
  exp.push(mouseCursor(true));
  exp.push(alphaNum);
  exp.push(end_message());
  exp.push(fullscreen(false));

  return exp;
}
const EXP = genExpSeq();

jsPsych.init({
  timeline: EXP,
});
