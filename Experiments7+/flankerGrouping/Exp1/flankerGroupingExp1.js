// Flanker Task:
// VPs respond to the centre line type (dotted/dashed) whilst ignoring the
// surrounding lines

// Standard Flanker Task:
// VPs respond to the direction of the central arrow whilst
// ignoring the surrounding arrows using key responses ("Q" and "P").

const jsPsych = initJsPsych({});

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
  screenRes: [1280, 960],
  nTrlsP: 8, // number of trials in first block (practice)
  nTrlsE: 16, // number of trials in subsequent blocks
  nBlks: 1, // number of blocks
  fixDur: 500, // duration of fixation cross
  fbDur: 750, // duration of feedback
  waitDur: 1000, // duration following ...
  iti: 750, // duration of inter-trial-interval
  tooFast: 150, // responses faster than x ms -> too fast!
  tooSlow: 2000, // response slower than x ms -> too slow!
  respKeys: ['Q', 'P'],
  target: shuffle(['Dashed', 'Dotted']),
  stimWidth: 250,
  stimHeight: 250,
  fbTxt: ['Richtig', 'Falsch', 'Zu langsam', 'Zu schnellt'],
  fbTxtSizeTrial: 30,
  fbTxtSizeBlock: 30,
  cTrl: 1, // count trials
  cBlk: 1, // count blocks
};

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const task_instructions = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus:
    generate_formatted_html({
      text: 'Welcome:',
      align: 'center',
      color: 'black',
      fontsize: 50,
      xypos: [0, -30],
      bold: true,
    }) +
    generate_formatted_html({
      text: 'Respond to the line type (dashed/dotted) of the central vertical line.',
      align: 'left',
      color: 'black',
      fontsize: 40,
      xypos: [0, 0],
    }) +
    generate_formatted_html({
      text: `${prms.target[0]} = "${prms.respKeys[0]}" key &emsp; ${prms.target[1]} = "${prms.respKeys[1]}" key<br><br><br>
        Press any key to continue!`,
      align: 'center',
      colour: 'black',
      fontsize: 40,
      xypos: [0, 50],
    }),
  post_trial_gap: prms.waitDur,
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////
const flankers = [
  'images/dash-dash-noObject.png',
  'images/dash-dash-object.png',
  'images/dash-dot-noObject.png',
  'images/dash-dot-object.png',
  'images/dot-dash-noObject.png',
  'images/dot-dash-object.png',
  'images/dot-dot-noObject.png',
  'images/dot-dot-object.png',
];

const preload = {
  type: jsPsychPreload,
  images: flankers,
};

// prettier-ignore
const trials = [
  { flanker: flankers[0], type: "noObject", comp: "comp",   key: prms.target[0] === "Dashed" ? prms.respKeys[0] : prms.respKeys[1] },
  { flanker: flankers[1], type: "object",   comp: "comp",   key: prms.target[0] === "Dahsed" ? prms.respKeys[0] : prms.respKeys[1] },
  { flanker: flankers[2], type: "noObject", comp: "incomp", key: prms.target[0] === "Dahsed" ? prms.respKeys[0] : prms.respKeys[1] },
  { flanker: flankers[3], type: "object",   comp: "incomp", key: prms.target[0] === "Dahsed" ? prms.respKeys[0] : prms.respKeys[1] },
  { flanker: flankers[4], type: "noObject", comp: "comp",   key: prms.target[0] === "Dotted" ? prms.respKeys[0] : prms.respKeys[1] },
  { flanker: flankers[5], type: "object",   comp: "comp",   key: prms.target[0] === "Dotted" ? prms.respKeys[0] : prms.respKeys[1] },
  { flanker: flankers[6], type: "noObject", comp: "incomp", key: prms.target[0] === "Dotted" ? prms.respKeys[0] : prms.respKeys[1] },
  { flanker: flankers[7], type: "object",   comp: "incomp", key: prms.target[0] === "Dotted" ? prms.respKeys[0] : prms.respKeys[1] },
];

////////////////////////////////////////////////////////////////////////
//                              Exp Parts                             //
////////////////////////////////////////////////////////////////////////
const fixation_cross = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<div style="font-size:60px;">+</div>',
  response_ends_trial: false,
  trial_duration: prms.fixDur,
};

const iti = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '',
  response_ends_trial: false,
  trial_duration: prms.iti,
};

const trial_feedback = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '',
  response_ends_trial: false,
  trial_duration: prms.fbDur,
  on_start: function (trial) {
    let dat = jsPsych.data.get().last(1).values()[0];
    trial.stimulus = `<div style="font-size:${prms.fbTxtSizeTrial}px;">${prms.fbTxt[dat.corrCode - 1]}</div>`;
  },
};

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
    corrCode = 4; // too fast
  }
  jsPsych.data.addDataToLastTrial({
    date: Date(),
    blockNum: prms.cBlk,
    trialNum: prms.cTrl,
    corrCode: corrCode,
  });
}

const flanker_stimulus = {
  type: jsPsychImageKeyboardResponse,
  stimulus: jsPsych.timelineVariable('flanker'),
  trial_duration: prms.tooSlow,
  response_ends_trial: true,
  stimulus_height: prms.stimHeight,
  stimulus_width: prms.stimWidth,
  choices: prms.respKeys,
  render_on_canvas: false,
  data: {
    stim: 'flanker',
    type: jsPsych.timelineVariable('type'),
    comp: jsPsych.timelineVariable('comp'),
    corrResp: jsPsych.timelineVariable('key'),
  },
  on_finish: function () {
    codeTrial();
    prms.cTrl += 1;
  },
};

const trial_timeline = {
  timeline: [fixation_cross, flanker_stimulus, trial_feedback, iti],
  timeline_variables: trials,
};

const block_feedback = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '',
  response_ends_trial: true,
  post_trial_gap: prms.waitDur,
  on_start: function (trial) {
    let block_dvs = calculateBlockPerformance({ filter_options: { stim: 'flanker', blockNum: prms.cBlk } });
    let text = blockFeedbackText(prms.cBlk, prms.nBlks, block_dvs.meanRt, block_dvs.errorRate, (language = 'de'));
    trial.stimulus = `<div style="font-size:30px;">${text}</div>`;
  },
  on_finish: function () {
    prms.cTrl = 1;
    prms.cBlk += 1;
  },
};

////////////////////////////////////////////////////////////////////////
//                              Save                                  //
////////////////////////////////////////////////////////////////////////
const dirName = getDirName();
const expName = getFileName();

function save() {
  const vpNum = getTime();
  jsPsych.data.addProperties({ vpNum: vpNum });

  const fn = `${dirName}data/${expName}_${vpNum}`;
  // saveData('/Common/write_data.php', fn, { stim: 'flanker' });
  saveDataLocal(fn, { stim: 'flanker' });
}

const save_data = {
  type: jsPsychCallFunction,
  func: save,
  post_trial_gap: 1000,
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
  'use strict';

  let exp = [];

  // exp.push(browser_check(prms.screenRes));
  // exp.push(preload);
  // exp.push(fullscreen(true));
  // exp.push(resize_browser());
  // exp.push(welcome_message());
  // // exp.push(vpInfoForm());
  // exp.push(mouseCursor(false));
  exp.push(task_instructions);

  for (let blk = 0; blk < prms.nBlks; blk += 1) {
    let blk_timeline = { ...trial_timeline };
    blk_timeline.sample = {
      type: 'fixed-repetitions',
      size: blk === 0 ? prms.nTrlsP / trials.length : prms.nTrlsE / trials.length,
    };
    exp.push(blk_timeline); // trials within a block
    exp.push(block_feedback); // show previous block performance
  }

  exp.push(save_data);
  exp.push(end_message());
  exp.push(mouseCursor(true));
  exp.push(fullscreen(false));

  return exp;
}
const EXP = genExpSeq();

jsPsych.run(EXP);
