// Standard Stroop combined with a negation language task (not left vs now left)
// VPs respond to font colour in the stroop task and phrase meaning in the
// negation task using the "C" and "M" keys.

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
  fbTxt: ['Richtig', 'Falsch', 'Zu langsam', 'Zu schnell'],
  cTrl: 1,
  cBlk: 1,
};

prms.colours = prms.mapping === 1 ? ['ROT', 'BLAU'] : ['BLAU', 'ROT'];
prms.respKeys = prms.mapping === 1 ? ['C', 'M'] : ['M', 'C'];

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const task_instructions = {
  type: 'html-keyboard-response',
  stimulus:
    "<h1 style='text-align:center;'>Aufgabe:</h1>" +
    "<h2 style='text-align:center;'>Reagieren Sie auf die Schriftfarbe bzw. auf die Bedeutung des Texts:</h2><br>" +
    "<h2 style='text-align:center;'>" +
    prms.colours[0] +
    ' bzw. Links = C Taste</h2>' +
    "<h2 style='text-align:center;'>" +
    prms.colours[1] +
    ' bzw. Rechts = M Taste</h2>' +
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

const stims = [
  ['<h1 style="color:red">rot</h1>'],
  ['<h1 style="color:red">blau</h1>'],
  ['<h1 style="color:blue">blau</h1>'],
  ['<h1 style="color:blue">rot</h1>'],
  ['<h1>jetzt links</h1>'],
  ['<h1>jetzt rechts</h1>'],
  ['<h1>nicht links</h1>'],
  ['<h1>nicht rechts</h1>'],
];

function codeTrial() {
  'use strict';
  let dat = jsPsych.data.get().last(1).values()[0];
  dat.rt = dat.rt !== null ? dat.rt : prms.tooSlow;

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

const trial_stimulus = {
  type: 'html-keyboard-response',
  stimulus: jsPsych.timelineVariable('stimulus'),
  trial_duration: prms.tooSlow,
  response_ends_trial: true,
  choices: prms.respKeys,
  post_trial_gap: 0,
  data: {
    stimulus: 'negStroop',
    task: jsPsych.timelineVariable('task'),
    compatibility: jsPsych.timelineVariable('comp'),
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

// prettier-ignore
const trial_timeline = {
  timeline: [fixation_cross, trial_stimulus, trial_feedback],
  timeline_variables: [
    { stimulus: stims[0], task: 'stroop', comp: 'comp',   key: prms.respKeys[0] },
    { stimulus: stims[1], task: 'stroop', comp: 'incomp', key: prms.respKeys[0] },
    { stimulus: stims[2], task: 'stroop', comp: 'comp',   key: prms.respKeys[1] },
    { stimulus: stims[3], task: 'stroop', comp: 'incomp', key: prms.respKeys[1] },
    { stimulus: stims[4], task: 'affneg', comp: 'comp',   key: 'C' },
    { stimulus: stims[5], task: 'affneg', comp: 'comp',   key: 'M' },
    { stimulus: stims[6], task: 'affneg', comp: 'incomp', key: 'M' },
    { stimulus: stims[7], task: 'affneg', comp: 'incomp', key: 'C' },
  ],
  sample: {
    type: 'fixed-repetitions',
  },
};

const randomString = generateRandomString(16);

const alphaNum = {
  type: 'html-keyboard-response',
  stimulus:
    '<h1>Wenn Sie für diesen Versuch eine Versuchspersonenstunde</h1>' +
    '<h1>benötigen, kopieren Sie den folgenden zufällig generierten Code</h1>' +
    '<h1>und senden Sie diesen zusammen mit Ihrer Matrikelnummer per Email an:</h1>' +
    '<h2>XXX@XXXe</h2>' +
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
