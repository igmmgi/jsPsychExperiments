// Simon Task:
// VPs respond to the colour of the presented stimulus using
// left and right key responses.

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
  nTrlsP: 4,
  nTrlsE: 8,
  nBlks: 2,
  fixDur: 750,
  fbDur: 750,
  waitDur: 1000,
  iti: 1000,
  tooFast: 150,
  tooSlow: 1500,
  respKeys: ['D', 'J'],
  fbTxt: ['Correct', 'Error', 'Too Slow', 'Too Fast'],
  cTrl: 1, // count trials
  cBlk: 1, // count blocks
};

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const task_instructions = {
  type: 'html-keyboard-response',
  stimulus:
    "<H1 style='text-align=center;'>Welcome:</H1><br>" +
    "<H2 style='text-align=center;'>Respond to the colour of the presented square</H2>" +
    "<H2 style='text-align=center;'>Square = 'D' key &emsp; Circle = 'J' key</H2>",
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

const simons = [
  "<div class='square_left'></div>",
  "<div class='circle_left'></div>",
  "<div class='square_right'></div>",
  "<div class='circle_right'></div>",
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
    blockNum: prms.cBlk,
    trialNum: prms.cTrl,
    corrCode: corrCode,
  });
}

const simon_stimulus = {
  type: 'html-keyboard-response',
  stimulus: jsPsych.timelineVariable('simon'),
  trial_duration: prms.tooSlow,
  response_ends_trial: true,
  choices: prms.respKeys,
  post_trial_gap: 0,
  data: {
    stim: 'simon',
    comp: jsPsych.timelineVariable('comp'),
    side: jsPsych.timelineVariable('side'),
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
    let dat = jsPsych.data.get().last(1).values()[0];
    trial.stimulus = '<h2>' + prms.fbTxt[dat.corrCode - 1] + '</h2>';
  },
};

const block_feedback = {
  type: 'html-keyboard-response',
  stimulus: '',
  response_ends_trial: true,
  post_trial_gap: prms.waitDur,
  on_start: function (trial) {
    let block_dvs = calculateBlockPerformance({ filter_options: { stim: 'simon', blockNum: prms.cBlk } });
    trial.stimulus = blockFeedbackText(prms.cBlk, prms.nBlks, block_dvs.meanRt, block_dvs.errorRate);
  },
  on_finish: function () {
    prms.cTrl = 1;
    prms.cBlk += 1;
  },
};

// prettier-ignore
const trial_timeline = {
  timeline: [fixation_cross, simon_stimulus, trial_feedback],
  timeline_variables: [
    { simon: simons[0], comp: 'comp',   side: 'left',  key: prms.respKeys[0] },
    { simon: simons[1], comp: 'incomp', side: 'left',  key: prms.respKeys[1] },
    { simon: simons[2], comp: 'incomp', side: 'right', key: prms.respKeys[0] },
    { simon: simons[3], comp: 'comp',   side: 'right', key: prms.respKeys[1] },
  ],
};

// save
const dirName = getDirName();
const expName = getFileName();

function save() {
  const vpNum = getTime();
  const pcInfo = getComputerInfo();
  jsPsych.data.addProperties({ vpNum: vpNum, pcInfo: pcInfo });

  const fn = `${dirName}data/${expName}_${vpNum}`;
  saveData('/Common/write_data.php', fn, { stim: 'simon' });
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
    for (let blk = 0; blk < prms.nBlks; blk += 1) {
      let blk_timeline = { ...trial_timeline };
      blk_timeline.sample = {
        type: 'fixed-repetitions',
        size: blk === 0 ? prms.nTrlsP / 4 : prms.nTrlsE / 4,
      };
      exp.push(blk_timeline); // trials within a block
      exp.push(block_feedback); // show previous block performance
    }
  }
  exp.push(end_message());
  exp.push(mouseCursor(true));
  exp.push(fullscreen(false));

  return exp;
}
const EXP = genExpSeq();

jsPsych.init({
  timeline: EXP,
});
