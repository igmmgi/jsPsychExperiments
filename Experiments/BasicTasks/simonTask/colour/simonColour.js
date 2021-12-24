// Simon Task:
// VPs respond to the colour of the presented stimulus using
// left and right key responses.

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
  nTrlsP: 4, // number of trials in first block (practice)
  nTrlsE: 8, // number of trials in subsequent blocks
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
    "<H1 style='text-align:center;'>Welcome:</H1><br>" +
    "<H2 style='text-align:center;'>Respond to the colour of the presented square</H2>" +
    "<H2 style='text-align:center;'>BLUE squares = 'D' key &emsp; RED squares = 'J' key</H2>",
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
  "<div class='square_blue_left'></div>",
  "<div class='square_blue_right'></div>",
  "<div class='square_red_left'></div>",
  "<div class='square_red_right'></div>",
];

function codeTrial() {
  'use strict';
  let dat = jsPsych.data.get().last(1).values()[0];
  dat.rt = dat.rt !== null ? dat.rt : prms.tooSlow;
  
  let corrCode = 0;
  let correctKey = jsPsych.pluginAPI.compareKeys(dat.response, dat.corrResp);

  if (correctKey && dat.rt > prms.tooFast && dat.rt < prms.tooSlow) {
    corrCode = 1; // correct
  } else if (!correctKey && rt > prms.tooFast && rt < prms.tooSlow) {
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
  prms.cTrl += 1;
}

const simon_stimulus = {
  type: 'html-keyboard-response',
  stimulus: jsPsych.timelineVariable('simon'),
  trial_duration: prms.tooSlow,
  response_ends_trial: true,
  choices: prms.respKeys,
  data: {
    stim: 'simon',
    comp: jsPsych.timelineVariable('comp'),
    side: jsPsych.timelineVariable('side'),
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
    trial.stimulus = blockFeedbackTxt({ stim: 'simon' });
  },
};

// prettier-ignore
const trial_timeline = {
  timeline: [fixation_cross, simon_stimulus, trial_feedback],
  timeline_variables: [
    { simon: simons[0], comp: 'comp',   side: 'left',  key: prms.respKeys[0] },
    { simon: simons[1], comp: 'incomp', side: 'right', key: prms.respKeys[0] },
    { simon: simons[2], comp: 'incomp', side: 'left',  key: prms.respKeys[1] },
    { simon: simons[3], comp: 'comp',   side: 'right', key: prms.respKeys[1] },
  ],
};

function save() {
    const vpNum = getTime();
    const pcInfo = getComputerInfo();
    jsPsych.data.addProperties({vpNum: vpNum, pcInfo: pcInfo});
    
    const fn = getDirName() + 'data/version' + expName() + vpNum;
    saveData('/Common/write_data.php', fn, {stim: 'flanker'});
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

  // exp.push(fullscreen());
  // exp.push(welcome_message());
  // exp.push(vpInfoForm());
  exp.push(mouseCursor(false));
  exp.push(task_instructions);

  for (let blk = 0; blk < prms.nBlks; blk += 1) {
    let blk_timeline = { ...trial_timeline };
    blk_timeline.sample = { 
        type: 'fixed-repetitions', 
        size: blk === 0 ? prms.nTrlsP / 4 : prms.nTrlsE / 4 
    };
    exp.push(blk_timeline); // trials within a block
    exp.push(block_feedback); // show previous block performance
  }
  exp.push(end_message());
  exp.push(mouseCursor(true));
  return exp;
}
const EXP = genExpSeq();

jsPsych.init({
  timeline: EXP,
});
