// Horizontal flanker task using arrow stimuli combined
// with a negation language task (not left vs now left)
// VPs respond to orientation of the central arrows in
// the flanker task and phrase meaning in the negation
// task using the "C" and "M" keys.

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
  respKeys: ['C', 'M'],
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
    "<h2 style='text-align:center;'>Reagieren Sie auf die Ausrichtung des mittleren Pfeils bzw. auf die Bedeutung des Texts:</h2>" +
    "<h2 style='text-align:center;'>LINKS = C Taste</h2>" +
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
};

// prettier-ignore
const stims = [
  [ "<div class='left'  style='float: left'></div>" + "<div class='left'  style='float: left'></div>" + "<div class='left'  style='float: right'></div>", ],
  [ "<div class='right' style='float: left'></div>" + "<div class='left'  style='float: left'></div>" + "<div class='right' style='float: right'></div>", ],
  [ "<div class='right' style='float: left'></div>" + "<div class='right' style='float: left'></div>" + "<div class='right' style='float: right'></div>", ],
  [ "<div class='left'  style='float: left'></div>" + "<div class='right' style='float: left'></div>" + "<div class='left'  style='float: right'></div>", ],
  ['<h1>jetzt links</h1>'],
  ['<h1>jetzt rechts</h1>'],
  ['<h1>nicht links</h1>'],
  ['<h1>nicht rechts</h1>'],
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

const trial_stimulus = {
  type: 'html-keyboard-response',
  stimulus: jsPsych.timelineVariable('stimulus'),
  trial_duration: prms.tooSlow,
  response_ends_trial: true,
  choices: prms.respKeys,
  data: {
    stimulus: 'negFlank',
    task: jsPsych.timelineVariable('task'),
    compatibility: jsPsych.timelineVariable('comp'),
    respDir: jsPsych.timelineVariable('dir'),
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
  stimulus: blockFeedbackTxt,
  response_ends_trial: true,
  post_trial_gap: prms.waitDur,
};

// prettier-ignore
const trial_timeline = {
  timeline: [fixation_cross, trial_stimulus, trial_feedback],
  timeline_variables: [
    { stimulus: stims[0], task: 'flanker', comp: 'comp',   dir: 'left',  key: prms.respKeys[0] },
    { stimulus: stims[1], task: 'flanker', comp: 'incomp', dir: 'left',  key: prms.respKeys[0] },
    { stimulus: stims[2], task: 'flanker', comp: 'comp',   dir: 'right', key: prms.respKeys[1] },
    { stimulus: stims[3], task: 'flanker', comp: 'incomp', dir: 'right', key: prms.respKeys[1] },
    { stimulus: stims[4], task: 'affneg',  comp: 'comp',   dir: 'left',  key: prms.respKeys[0] },
    { stimulus: stims[5], task: 'affneg',  comp: 'comp',   dir: 'right', key: prms.respKeys[1] },
    { stimulus: stims[6], task: 'affneg',  comp: 'incomp', dir: 'right', key: prms.respKeys[1] },
    { stimulus: stims[7], task: 'affneg',  comp: 'incomp', dir: 'left',  key: prms.respKeys[0] },
  ],
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
  show_progress_bar: false,
  on_finish: function () {
    saveRandomCode(expName);
    saveData('/Common/write_data.php', filename, { stim: 'negFlank' });
  },
});
