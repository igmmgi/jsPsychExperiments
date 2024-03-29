﻿// Standard Flanker Task with random stimulus location. 1st half
// vs. 2nd half blocks (counter-balanced) across VPs is with or
// without a fixation cross. VPs respond to the direction of the
// central arrow whilst ignoring the surrounding arrows using key
// responses ("C" and "M"). Feedback provided during the practice block.

const expName = getFileName();
const dirName = getDirName();
const vpNum = genVpNum();

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
  nTrlsP: 16, // number of trials in first block (practice)
  nTrlsE: 96, // number of trials in subsequent blocks
  nBlks: 14,
  fixDur: 500,
  fbDur: 1000,
  waitDur: 1000,
  iti: 500,
  tooFast: 150,
  tooSlow: 1500,
  respKeys: ['C', 'M'],
  fbTxt: ['Richtig', 'Falsch', 'Zu langsam', 'Zu schnell'],
  order: jsPsych.randomization.sampleWithoutReplacement([1, 2], 1)[0],
  cTrl: 1, // count trials
  cBlk: 1, // count blocks
};

////////////////////////////////////////////////////////////////////////
//                         Position Functions                         //
////////////////////////////////////////////////////////////////////////
function randomPosition() {
  let posx = Math.floor((Math.random() * screen.width) / 2) - screen.width / 4;
  let posy = Math.floor((Math.random() * screen.height) / 2) - screen.height / 4;
  return { x: posx, y: posy };
}

function setRandomPosition() {
  let pos = randomPosition();
  document.documentElement.style.setProperty('--posx', pos.x + 'px');
  document.documentElement.style.setProperty('--posy', pos.y + 'px');
}

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const task_instructions = {
  type: 'html-keyboard-response',
  stimulus:
    "<h1 style='text:align:center;'>Aufgabe:</h1>" +
    "<h2 style='text-align:center;'>Reagieren Sie auf die Ausrichtung des mittleren Pfeils:</h2><br>" +
    "<h2 style='text-align:center;'>LINKS = C Taste &nbsp &nbsp&nbsp&nbsp RECHTS = M Taste</h2><br>" +
    "<h2 style='text-align:center;'>Bitte reagieren Sie so schnell und korrekt wie möglich</h2><br>" +
    "<h2 style='text-align:center;'>Drücken Sie eine beliebige Taste, um fortzufahren!</h2>",
  post_trial_gap: prms.waitDur,
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////
const fixation_cross = {
  type: 'html-keyboard-response',
  stimulus: '<div style="font-size:60px;">+</div>',
  response_ends_trial: false,
  trial_duration: prms.fixDur,
};

const fixation_blank = {
  type: 'html-keyboard-response',
  stimulus: '<div style="font-size:60px;">&nbsp;</div>',
  response_ends_trial: false,
  trial_duration: prms.fixDur,
};

const flankers = [
  ['<div class="flank"> <<<<< </div>'],
  ['<div class="flank"> >><>> </div>'],
  ['<div class="flank"> >>>>> </div>'],
  ['<div class="flank"> <<><< </div>'],
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
  data: {
    stimulus: 'flanker',
    fixation: jsPsych.timelineVariable('fix'),
    compatibility: jsPsych.timelineVariable('comp'),
    direction: jsPsych.timelineVariable('dir'),
    corrResp: jsPsych.timelineVariable('key'),
  },
  on_start: function () {
    setRandomPosition();
  },
  on_finish: function () {
    codeTrial();
    jsPsych.data.addDataToLastTrial({
      posx: document.documentElement.style.getPropertyValue('--posx'),
      posy: document.documentElement.style.getPropertyValue('--posy'),
    });
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
  stimulus: blockFeedbackTxt,
  response_ends_trial: true,
  post_trial_gap: prms.waitDur,
};

// prettier-ignore
const trial_timeline_fixation_cross = {
  timeline: [fixation_cross, flanker_stimulus, trial_feedback],
  timeline_variables: [
    { flanker: flankers[0], fix: 1, comp: 'comp',   dir: 'left',  key: prms.respKeys[0] },
    { flanker: flankers[1], fix: 1, comp: 'incomp', dir: 'left',  key: prms.respKeys[0] },
    { flanker: flankers[2], fix: 1, comp: 'comp',   dir: 'right', key: prms.respKeys[1] },
    { flanker: flankers[3], fix: 1, comp: 'incomp', dir: 'right', key: prms.respKeys[1] },
  ],
  randomize_order: true,
};

// prettier-ignore
const trial_timeline_fixation_blank = {
  timeline: [fixation_blank, flanker_stimulus, trial_feedback],
  timeline_variables: [
    { flanker: flankers[0], fix: 0, comp: 'comp',   dir: 'left',  key: prms.respKeys[0] },
    { flanker: flankers[1], fix: 0, comp: 'incomp', dir: 'left',  key: prms.respKeys[0] },
    { flanker: flankers[2], fix: 0, comp: 'comp',   dir: 'right', key: prms.respKeys[1] },
    { flanker: flankers[3], fix: 0, comp: 'incomp', dir: 'right', key: prms.respKeys[1] },
  ],
  randomize_order: true,
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
  exp.push(resize_de);
  exp.push(task_instructions);

  for (let blk = 0; blk < prms.nBlks; blk += 1) {
    let showFixation = (prms.order === 1 && blk < 7) || (prms.order === 2 && blk > 6);
    let blk_timeline = {};
    if (showFixation) {
      blk_timeline = { ...trial_timeline_fixation_cross };
    } else {
      blk_timeline = { ...trial_timeline_fixation_blank };
    }
    blk_timeline.sample = {
      type: 'fixed-repetitions',
      size: blk === 0 ? prms.nTrlsP / 4 : prms.nTrlsE / 4,
    };
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
  show_progress_bar: false,
  on_finish: function () {
    saveRandomCode(expName);
    saveData('/Common/write_data.php', filename, { stim: 'flanker' });
  },
});
