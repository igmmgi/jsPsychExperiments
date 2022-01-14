// Flanker Task:
// VPs respond to the centre line type (dotted/dashed) whilst ignoring the
// surrounding lines

// Standard Flanker Task:
// VPs respond to the direction of the central arrow whilst
// ignoring the surrounding arrows using key responses ("Q" and "P").

const jsPsych = initJsPsych({});

// for piloting
// imageset1 = stimulus-h-s
// imageset2 = stimulus-h-s-far
const stimHeight = Number(jsPsych.data.urlVariables().stimHeight);
const imageSet = Number(jsPsych.data.urlVariables().imageSet);
jsPsych.data.addProperties({ stimHeight: stimHeight, imageSet: imageSet });

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
  screenRes: [960, 720],
  nTrlsP: 32, // number of trials in first block (practice)
  nTrlsE: 64, // number of trials in subsequent blocks
  nBlks: 13, // number of blocks
  fixDur: 500, // duration of fixation cross
  fixSize: 50, // size of fixation cross
  fbDur: [0, 1500, 1500, 1500], // duration of feedback for each type
  waitDur: 1000, // duration following ...
  iti: 500, // duration of inter-trial-interval
  tooFast: 150, // responses faster than x ms -> too fast!
  tooSlow: 2000, // response slower than x ms -> too slow!
  respKeys: ['Q', 'P'],
  target: shuffle(['H', 'S']),
  stimHeight: stimHeight,
  fbTxt: ['', 'Falsch', 'Zu langsam', 'Zu schnell'],
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
      text: 'Respond to letter identity (H/S) of the central letter.',
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
  `images${imageSet}/dash-dash-noObject-far.png`,
  `images${imageSet}/dash-dash-noObject-near.png`,
  `images${imageSet}/dash-dash-Object-far.png`,
  `images${imageSet}/dash-dash-Object-near.png`,
  `images${imageSet}/dash-dot-noObject-far.png`,
  `images${imageSet}/dash-dot-noObject-near.png`,
  `images${imageSet}/dash-dot-Object-far.png`,
  `images${imageSet}/dash-dot-Object-near.png`,
  `images${imageSet}/dot-dash-noObject-far.png`,
  `images${imageSet}/dot-dash-noObject-near.png`,
  `images${imageSet}/dot-dash-Object-far.png`,
  `images${imageSet}/dot-dash-Object-near.png`,
  `images${imageSet}/dot-dot-noObject-far.png`,
  `images${imageSet}/dot-dot-noObject-near.png`,
  `images${imageSet}/dot-dot-Object-far.png`,
  `images${imageSet}/dot-dot-Object-near.png`,
];

console.log(flankers);

const preload = {
  type: jsPsychPreload,
  images: flankers,
};

// prettier-ignore
const trials = [
  { flanker: flankers[ 0], distance: "far",  type: "noObject", comp: "comp",   key: prms.respKeys[prms.target.indexOf("S")] },
  { flanker: flankers[ 1], distance: "near", type: "noObject", comp: "comp",   key: prms.respKeys[prms.target.indexOf("S")] },
  { flanker: flankers[ 2], distance: "far",  type: "object",   comp: "comp",   key: prms.respKeys[prms.target.indexOf("S")] },
  { flanker: flankers[ 3], distance: "near", type: "object",   comp: "comp",   key: prms.respKeys[prms.target.indexOf("S")] },
  { flanker: flankers[ 4], distance: "far",  type: "noObject", comp: "incomp", key: prms.respKeys[prms.target.indexOf("S")] },
  { flanker: flankers[ 5], distance: "near", type: "noObject", comp: "incomp", key: prms.respKeys[prms.target.indexOf("S")] },
  { flanker: flankers[ 6], distance: "far",  type: "object",   comp: "incomp", key: prms.respKeys[prms.target.indexOf("S")] },
  { flanker: flankers[ 7], distance: "near", type: "object",   comp: "incomp", key: prms.respKeys[prms.target.indexOf("S")] },
  { flanker: flankers[ 8], distance: "far",  type: "noObject", comp: "incomp", key: prms.respKeys[prms.target.indexOf("H")] },
  { flanker: flankers[ 9], distance: "near", type: "noObject", comp: "incomp", key: prms.respKeys[prms.target.indexOf("H")] },
  { flanker: flankers[10], distance: "far",  type: "object",   comp: "incomp", key: prms.respKeys[prms.target.indexOf("H")] },
  { flanker: flankers[11], distance: "near", type: "object",   comp: "incomp", key: prms.respKeys[prms.target.indexOf("H")] },
  { flanker: flankers[12], distance: "far",  type: "noObject", comp: "comp",   key: prms.respKeys[prms.target.indexOf("H")] },
  { flanker: flankers[13], distance: "near", type: "noObject", comp: "comp",   key: prms.respKeys[prms.target.indexOf("H")] },
  { flanker: flankers[14], distance: "far",  type: "object",   comp: "comp",   key: prms.respKeys[prms.target.indexOf("H")] },
  { flanker: flankers[15], distance: "near", type: "object",   comp: "comp",   key: prms.respKeys[prms.target.indexOf("H")] },
];

////////////////////////////////////////////////////////////////////////
//                              Exp Parts                             //
////////////////////////////////////////////////////////////////////////
const fixation_cross = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<div style="font-size:${prms.fixSize}px;">+</div>`,
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
  trial_duration: null,
  on_start: function (trial) {
    let dat = jsPsych.data.get().last(1).values()[0];
    trial.trial_duration = prms.fbDur[dat.corrCode - 1];
    trial.stimulus = `<div style="font-size:${prms.fbTxtSizeTrial}px;">${prms.fbTxt[dat.corrCode - 1]}</div>`;
  },
};

function codeTrial() {
  'use strict';
  let dat = jsPsych.data.get().last(1).values()[0];
  dat.rt = dat.rt !== null ? dat.rt : prms.tooSlow;
  console.log(dat.comp);
  console.log(dat.distance);

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
  choices: prms.respKeys,
  render_on_canvas: false,
  data: {
    stim: 'flanker',
    distance: jsPsych.timelineVariable('distance'),
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
    trial.stimulus = `<div style="font-size:${prms.fbTxtSizeBlock}px;">${text}</div>`;
  },
  on_finish: function () {
    prms.cTrl = 1;
    prms.cBlk += 1;
  },
};

////////////////////////////////////////////////////////////////////////
//                              VP Stun                               //
////////////////////////////////////////////////////////////////////////
const randomString = generateRandomString(16, 'fg1_');

const alphaNum = {
  type: jsPsychHtmlKeyboardResponse,
  response_ends_trial: true,
  choices: [' '],
  stimulus: generate_formatted_html({
    text:
      `Vielen Dank für Ihre Teilnahme.<br><br>
        Wenn Sie Versuchspersonenstunden benötigen, kopieren Sie den folgenden
        zufällig generierten Code und senden Sie diesen zusammen mit Ihrer
        Matrikelnummer per Email mit dem Betreff 'Versuchpersonenstunde'
        an:<br><br>xxx@yyy<br><br> Code: ` +
      randomString +
      `<br><br>Drücken Sie die Leertaste, um fortzufahren!`,
    fontsize: 28,
    lineheight: 1.0,
    bold: true,
    align: 'left',
  }),
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
  saveData('/Common/write_data.php', fn, { stim: 'flanker' });
  // saveDataLocal(fn, { stim: 'flanker' });
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

  exp.push(fullscreen(true));
  exp.push(browser_check(prms.screenRes));
  exp.push(preload);
  exp.push(resize_browser());
  exp.push(welcome_message());
  exp.push(vpInfoForm());
  exp.push(mouseCursor(false));
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

  // debrief
  exp.push(mouseCursor(true));
  exp.push(alphaNum);
  exp.push(end_message());
  exp.push(fullscreen(false));

  return exp;
}
const EXP = genExpSeq();

jsPsych.run(EXP);
