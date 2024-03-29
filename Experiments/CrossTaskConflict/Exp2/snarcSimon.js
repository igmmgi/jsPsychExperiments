// Notebaert & Verguts 2008 Experiment B:
// VPs respond to orientation in SNARC trials and color in Simon trials
// ("C" for upright and green; and "M" for italic and red).
// 12 stimuli:
// 1, 2, 8, 9 (normal/italics)
// X in green or left to the left or right of fixation

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

prms.respKeys = prms.mapping === 1 ? ['C', 'M'] : ['M', 'C'];
prms.comp = prms.mapping === 1 ? ['comp', 'incomp'] : ['incomp', 'comp'];

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const task_instructions = {
  type: 'html-keyboard-response',
  stimulus:
    "<h1 style='text-align:center;'>Aufgabe:</h1>" +
    "<h2 style='text-align:center;'>Reagieren Sie auf die Farbe bzw. auf die Ausrichtung der Buchstaben bzw. Zahlen:</h2><br>" +
    "<h2 style='text-align:center;'>Grün bzw. senkrecht = " +
    prms.respKeys[0] +
    ' Taste</h2>' +
    "<h2 style='text-align:center;'>Rot bzw. kursiv = " +
    prms.respKeys[1] +
    ' Taste</h2>' +
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
  ["<h1 style='font-size:60px; color:red;   font-family:Courier;  position:relative; left: -100px'>X</h1>"],
  ["<h1 style='font-size:60px; color:red;   font-family:Courier;  position:relative; left:  100px'>X</h1>"],
  ["<h1 style='font-size:60px; color:green; font-family:Courier;  position:relative; left: -100px'>X</h1>"],
  ["<h1 style='font-size:60px; color:green; font-family:Courier;  position:relative; left:  100px'>X</h1>"],
  ["<h1 style='font-size:60px; color:black; font-family:Courier; '   >1</h1>"],
  ["<h1 style='font-size:60px; color:black; font-family:Courier; '><i>1</i></h1>"],
  ["<h1 style='font-size:60px; color:black; font-family:Courier; '   >2</h1>"],
  ["<h1 style='font-size:60px; color:black; font-family:Courier; '><i>2</i></h1>"],
  ["<h1 style='font-size:60px; color:black; font-family:Courier; '   >8</h1>"],
  ["<h1 style='font-size:60px; color:black; font-family:Courier; '><i>8</i></h1>"],
  ["<h1 style='font-size:60px; color:black; font-family:Courier; '   >9</h1>"],
  ["<h1 style='font-size:60px; color:black; font-family:Courier; '><i>9</i></h1>"],
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
    stimulus: 'simonSnarc',
    task: jsPsych.timelineVariable('task'),
    compatibility: jsPsych.timelineVariable('comp'),
    colour: jsPsych.timelineVariable('colour'),
    side: jsPsych.timelineVariable('side'),
    font: jsPsych.timelineVariable('font'),
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
    { stimulus: stims[0],  task: 'simon', comp: prms.comp[1], colour: 'red',   side: 'left',   font: 'normal', key: prms.respKeys[1], },
    { stimulus: stims[1],  task: 'simon', comp: prms.comp[0], colour: 'red',   side: 'right',  font: 'normal', key: prms.respKeys[1], },
    { stimulus: stims[2],  task: 'simon', comp: prms.comp[1], colour: 'green', side: 'left',   font: 'normal', key: prms.respKeys[0], },
    { stimulus: stims[3],  task: 'simon', comp: prms.comp[0], colour: 'green', side: 'right',  font: 'normal', key: prms.respKeys[0], },
    { stimulus: stims[0],  task: 'simon', comp: prms.comp[1], colour: 'red',   side: 'left',   font: 'normal', key: prms.respKeys[1], },
    { stimulus: stims[1],  task: 'simon', comp: prms.comp[0], colour: 'red',   side: 'right',  font: 'normal', key: prms.respKeys[1], }, 
    { stimulus: stims[2],  task: 'simon', comp: prms.comp[1], colour: 'green', side: 'left',   font: 'normal', key: prms.respKeys[0], },
    { stimulus: stims[3],  task: 'simon', comp: prms.comp[0], colour: 'green', side: 'right',  font: 'normal', key: prms.respKeys[0], },
    { stimulus: stims[4],  task: 'snarc', comp: prms.comp[0], colour: 'black', side: 'middle', font: 'normal', key: prms.respKeys[0], },
    { stimulus: stims[5],  task: 'snarc', comp: prms.comp[1], colour: 'black', side: 'middle', font: 'italic', key: prms.respKeys[1], },
    { stimulus: stims[6],  task: 'snarc', comp: prms.comp[0], colour: 'black', side: 'middle', font: 'normal', key: prms.respKeys[0], },
    { stimulus: stims[7],  task: 'snarc', comp: prms.comp[1], colour: 'black', side: 'middle', font: 'italic', key: prms.respKeys[1], },
    { stimulus: stims[8],  task: 'snarc', comp: prms.comp[1], colour: 'black', side: 'middle', font: 'normal', key: prms.respKeys[0], },
    { stimulus: stims[9],  task: 'snarc', comp: prms.comp[0], colour: 'black', side: 'middle', font: 'italic', key: prms.respKeys[1], },
    { stimulus: stims[10], task: 'snarc', comp: prms.comp[1], colour: 'black', side: 'middle', font: 'normal', key: prms.respKeys[0], },
    { stimulus: stims[11], task: 'snarc', comp: prms.comp[0], colour: 'black', side: 'middle', font: 'italic', key: prms.respKeys[1], },
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
      size: blk === 0 ? prms.nTrlsP / 16 : prms.nTrlsE / 16,
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
