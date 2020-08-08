// Standard Flanker Task with alternating fixed (centre) and random (clock positions)
// across sequential trials. VPs respond to the direction of the central arrow whilst
// ignoring the surrounding arrows using key responses ("C" and "M"). Feedback provided
// during the practice block.

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
  respKeys: ["C", "M", 27],
  fbTxt: ["Richtig", "Falsch", "Zu langsam", "Zu schnell"],
  order: jsPsych.randomization.sampleWithoutReplacement([1, 2], 1)[0],
  cTrl: 1, // count trials
  cBlk: 1, // count blocks
};

////////////////////////////////////////////////////////////////////////
//                         Position Functions                         //
////////////////////////////////////////////////////////////////////////
function randomPositionClock() {
  let posx = [];
  let posy = [];
  let pos = Math.floor(Math.random() * 11);
  for (let i = 0; i < 2 * Math.PI; i = i + (2 * Math.PI) / 11) {
    posx.push((Math.cos(i) * screen.height) / 4);
    posy.push((Math.sin(i) * screen.height) / 4);
  }

  posx = posx[pos];
  posy = posy[pos];

  return { x: posx, y: posy };
}

function setRandomPositions() {
  let pos = randomPositionClock();
  document.documentElement.style.setProperty("--posx", pos.x + "px");
  document.documentElement.style.setProperty("--posy", pos.y + "px");
}

function setCentrePositions() {
  document.documentElement.style.setProperty("--posx", 0 + "px");
  document.documentElement.style.setProperty("--posy", 0 + "px");
}

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const task_instructions = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 style='text-align:center;'>Aufgabe:</h1>" +
    "<h2 style='text-align:center;'>Reagieren Sie auf die Ausrichtung des mittleren Pfeils:</h2><br>" +
    "<h2 style='text-align:center;'>LINKS = C Taste &nbsp &nbsp&nbsp&nbsp RECHTS = M Taste</h2><br>" +
    "<h2 style='text-align:center;'>Bitte reagieren Sie so schnell und korrekt wie möglich</h2><br>" +
    "<h2 style='text-align:center;'>Drücken Sie eine beliebige Taste, um fortzufahren!</h2>",
  timing_post_trial: prms.waitDur,
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////
const fixation_blank = {
  type: "html-keyboard-response",
  stimulus: '<div style="font-size:60px;">&nbsp;</div>',
  choices: jsPsych.NO_KEYS,
  trial_duration: prms.fixDur,
  post_trial_gap: 0,
  data: { stim: "fixation_blank" },
};

const flankers = [
  ['<div class="flank"> <<<<< </div>'],
  ['<div class="flank"> >><>> </div>'],
  ['<div class="flank"> >>>>> </div>'],
  ['<div class="flank"> <<><< </div>'],
];

const flanker_stimulus = {
  type: "html-keyboard-response",
  stimulus: jsPsych.timelineVariable("flanker"),
  trial_duration: prms.tooSlow,
  response_ends_trial: true,
  choices: prms.respKeys,
  post_trial_gap: 0,
  data: {
    stimulus: "flanker",
    compatibility: jsPsych.timelineVariable("comp"),
    direction: jsPsych.timelineVariable("dir"),
    corrResp: jsPsych.timelineVariable("key"),
  },
  on_start: function () {
    if (prms.cTrl % 2 === 1) {
      setCentrePositions();
    } else {
      setRandomPositions();
    }
  },
  on_finish: function () {
    codeTrial();
    jsPsych.data.addDataToLastTrial({
      posx: document.documentElement.style.getPropertyValue("--posx"),
      posy: document.documentElement.style.getPropertyValue("--posy"),
    });
  },
};

const trial_feedback = {
  type: "html-keyboard-response",
  stimulus: "",
  trial_duration: prms.fbDur,
  response_ends_trial: false,
  post_trial_gap: prms.iti,
  data: { stim: "feedback" },
  on_start: function (trial) {
    if (prms.cBlk === 1) {
      trial.stimulus = trialFeedbackTxt(prms.fbTxt);
    }
  },
};

const block_feedback = {
  type: "html-keyboard-response",
  stimulus: blockFeedbackTxt,
  response_ends_trial: true,
  post_trial_gap: prms.waitDur,
};

const trial_timeline = {
  timeline: [fixation_blank, flanker_stimulus, trial_feedback],
  timeline_variables: [
    { flanker: flankers[0], comp: "comp", dir: "left", key: prms.respKeys[0] },
    { flanker: flankers[1], comp: "incomp", dir: "left", key: prms.respKeys[0] },
    { flanker: flankers[2], comp: "comp", dir: "right", key: prms.respKeys[1] },
    { flanker: flankers[3], comp: "incomp", dir: "right", key: prms.respKeys[1] },
  ],
};

const randomString = generateRandomString(16);

const alphaNum = {
  type: "html-keyboard-response",
  stimulus:
    "<h1>Wenn Sie für diesen Versuch eine Versuchspersonenstunde</h1>" +
    "<h1>benötigen, kopieren Sie den folgenden zufällig generierten Code</h1>" +
    "<h1>und senden Sie diesen zusammen mit Ihrer Matrikelnummer per Email an:</h1>" +
    "<h2>XXX@XXX</h2>" +
    "<h1>Code:" +
    randomString +
    "</h1>" +
    "<h2>Drücken Sie eine beliebige Taste, um fortzufahren!</h2>",
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
  "use strict";

  let exp = [];

  exp.push(welcome_de);
  //exp.push(vpInfoForm);
  exp.push(resize_de);
  exp.push(task_instructions);

  for (let blk = 0; blk < prms.nBlks; blk += 1) {
    let blk_timeline = { ...trial_timeline };
    blk_timeline.sample = { type: "fixed-repetitions", size: blk === 0 ? prms.nTrlsP / 4 : prms.nTrlsE / 4 };
    exp.push(blk_timeline); // trials within a block
    exp.push(block_feedback); // show previous block performance
  }
  exp.push(debrief_de);
  exp.push(alphaNum);
  return exp;
}
const EXP = genExpSeq();
const filename = dirName + "data/" + expName + "_" + genVpNum();

jsPsych.init({
  timeline: EXP,
  fullscreen: false,
  show_progress_bar: false,
  on_finish: function () {
    saveRandomCode(expName);
    saveData("/Common/write_data.php", filename, { stim: "flanker" });
  },
});
