// Negation Task:
// Participants respond to the meaning of the presented combination of 
// symbols (tick mark/cross) text using key responses ("Q" and "P").

const jsPsych = initJsPsych({});

const CANVAS_COLOUR = 'rgba(200, 200, 200, 1)';
const CANVAS_SIZE = [1280, 720];
const CANVAS_BORDER = '5px solid black';

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const PRMS = {
  nTrlsP: 8, // number of trials in first block (practice)
  nTrlsE: 16, // number of trials in subsequent blocks
  nBlks: 4,
  fixDur: 1000,
  fbDur: [1000, 1000],
  fixSize: 50,
  stimSize: 50,
  fbTxtSizeTrial: 30,
  waitDur: 1000,
  iti: 1000,
  tooFast: 0,
  tooSlow: null,
  respKeys: ['Q', 'P'],
  fbTxt: ['Richtig', 'Falsch'],
  cTrl: 1, // count trials
  cBlk: 1, // count blocks
};

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const WELCOME_INSTRUCTIONS = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: generate_formatted_html({
    text: `Willkommen zu unserem Experiment:<br><br>
           Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.
           Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und genügend Zeit hast,
           um das Experiment durchzuführen. Wir bitten dich die ca. nächsten 35 Minuten konzentriert zu arbeiten.<br><br>
           Du erhältst den Code für Versuchspersonenstunden und weitere Anweisungen am Ende des Experiments.
           Bei Fragen oder Problemen wende dich bitte an:<br><br>
           hiwipibio@gmail.com <br><br>
           Drücke eine beliebige Taste, um fortzufahren`,
    align: 'left',
    fontsize: 30,
    width: '1200px',
    bold: true,
    lineheight: 1.5,
  }),
};

const TASK_INSTRUCTIONS = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: generate_formatted_html({
    text: `Respond to the meaning of the text!<br><br>
LINKS = "${PRMS.respKeys[0]}" Taste &emsp;&emsp;&emsp; RECHTS = "${PRMS.respKeys[1]}" Taste<br><br>
Drücke eine beliebige Taste, um fortzufahren`,
    align: "center",
    fontsize: 30,
    width: '1200px',
    bold: true,
    lineheight: 1.5,
  }),
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////
const FIXATION_CROSS = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: `<div style="font-size:${PRMS.fixSize}px;">+</div>`,
  response_ends_trial: false,
  trial_duration: PRMS.fixDur,
};

// // pretier-ignore
// const AFFNEGS = [
//     `<div style="font-size:${PRMS.stimSize}px">\u2705 links</h1>`,
//     `<div style="font-size:${PRMS.stimSize}px">\u2705 rechts</h1>`,
//     `<div style="font-size:${PRMS.stimSize}px">\u274C links</h1>`,
//     `<div style="font-size:${PRMS.stimSize}px">\u274C rechts</h1>`
// ]

// // pretier-ignore
// const AFFNEGS = [
//   `<div style="font-size:${PRMS.stimSize}px;"><span style="color: green">\u2713</span> links</h1>`,
//   `<div style="font-size:${PRMS.stimSize}px;"><span style="color: green">\u2713</span> rechts</h1>`,
//   `<div style="font-size:${PRMS.stimSize}px;"><span style="color: red">\u2717</span> links</h1>`,
//   `<div style="font-size:${PRMS.stimSize}px;"><span style="color: red">\u2717</span> rechts</h1>`,
// ];


// // pretier-ignore
// const AFFNEGS = [
//   `<div style="font-size:${PRMS.stimSize}px;">\u2713</span> links</h1>`,
//   `<div style="font-size:${PRMS.stimSize}px;">\u2713</span> rechts</h1>`,
//   `<div style="font-size:${PRMS.stimSize}px;">\u274C</span> links</h1>`,
//   `<div style="font-size:${PRMS.stimSize}px;">\u274C</span> rechts</h1>`,
// ];


// pretier-ignore
const AFFNEGS = [
  `<div style="font-size:${PRMS.stimSize}px;"><span style="color: green">\u2714</span> links</h1>`,
  `<div style="font-size:${PRMS.stimSize}px;"><span style="color: green">\u2714</span> rechts</h1>`,
  `<div style="font-size:${PRMS.stimSize}px;"><span style="color: red">\u2718</span> links</h1>`,
  `<div style="font-size:${PRMS.stimSize}px;"><span style="color: red">\u2718</span> rechts</h1>`,
];



const WAIT = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: '',
  response_ends_trial: false,
  trial_duration: PRMS.waitDur,
};

const ITI = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: '',
  response_ends_trial: false,
  trial_duration: PRMS.iti,
};

const TRIAL_FEEDBACK = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: '',
  response_ends_trial: false,
  trial_duration: null,
  on_start: function (trial) {
    let dat = jsPsych.data.get().last(1).values()[0];
    trial.trial_duration = PRMS.fbDur[dat.error];
    trial.stimulus = `<div style="font-size:${PRMS.fbTxtSizeTrial}px;">${PRMS.fbTxt[dat.error]}</div>`;
  },
};

function codeTrial() {
  'use strict';
  let dat = jsPsych.data.get().last(1).values()[0];

  let correctKey = jsPsych.pluginAPI.compareKeys(dat.key_press, dat.corrResp);
  let error = correctKey ? 0 : 1;

  jsPsych.data.addDataToLastTrial({
    date: Date(),
    blockNum: PRMS.cBlk,
    trialNum: PRMS.cTrl,
    error: error,
  });
}

const AFFNEG_STIMULUS = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: jsPsych.timelineVariable('affneg'),
  trial_duration: PRMS.tooSlow,
  response_ends_trial: true,
  choices: PRMS.respKeys,
  data: {
    stim: 'affneg',
    type: jsPsych.timelineVariable('type'),
    side: jsPsych.timelineVariable('side'),
    corrResp: jsPsych.timelineVariable('key'),
  },
  on_finish: function () {
    codeTrial();
    PRMS.cTrl += 1;
  },
};

const BLOCK_FEEDBACK = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: '',
  response_ends_trial: true,
  on_start: function (trial) {
    let block_dvs = calculateBlockPerformance({
      filter_options: { stim: 'affneg', blockNum: PRMS.cBlk },
      corrColumn: 'error',
      corrValue: 0,
    });
    let text = blockFeedbackText(PRMS.cBlk, PRMS.nBlks, block_dvs.meanRt, block_dvs.errorRate, (language = 'de'));
    trial.stimulus = `<div style="font-size:${PRMS.fbTxtSizeBlock}px;">${text}</div>`;
  },
  on_finish: function () {
    PRMS.cTrl = 1;
    PRMS.cBlk += 1;
  },
};

// prettier-ignore
const trial_timeline = {
  timeline: [FIXATION_CROSS, AFFNEG_STIMULUS, TRIAL_FEEDBACK, ITI],
  timeline_variables: [
    { affneg: AFFNEGS[0], type: 'aff', side: 'left',  key: PRMS.respKeys[0] },
    { affneg: AFFNEGS[1], type: 'aff', side: 'right', key: PRMS.respKeys[1] },
    { affneg: AFFNEGS[2], type: 'neg', side: 'left',  key: PRMS.respKeys[1] },
    { affneg: AFFNEGS[3], type: 'neg', side: 'right', key: PRMS.respKeys[0] },
  ],
};

////////////////////////////////////////////////////////////////////////
//                              Save                                  //
////////////////////////////////////////////////////////////////////////
const DIR_NAME = getDirName();
const EXP_NAME = getFileName();

function save() {
  const vpNum = getTime();
  jsPsych.data.addProperties({ vpNum: vpNum });

  const data_fn = `${DIR_NAME}data/${EXP_NAME}_${vpNum}`;
  saveData('/Common/write_data.php', data_fn, { stim: 'affneg' });

}

const SAVE_DATA = {
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
  exp.push(browser_check(PRMS.screenRes));
  exp.push(resize_browser());
  exp.push(welcome_message());
  exp.push(vpInfoForm('/Common7+/vpInfoForm_de.html'));
  exp.push(mouseCursor(false));
  exp.push(WELCOME_INSTRUCTIONS);
  exp.push(WAIT);
  exp.push(TASK_INSTRUCTIONS);
  exp.push(WAIT);

  for (let blk = 0; blk < PRMS.nBlks; blk += 1) {
    let blk_timeline = { ...trial_timeline };
    blk_timeline.sample = {
      type: 'fixed-repetitions',
      size: blk === 0 ? PRMS.nTrlsP / AFFNEGS.length : PRMS.nTrlsE / AFFNEGS.length,
    };
    exp.push(blk_timeline); // trials within a block
    exp.push(BLOCK_FEEDBACK); // show previous block performance
    exp.push(WAIT);
  }

  exp.push(SAVE_DATA);

  // debrief
  exp.push(mouseCursor(true));
  exp.push(end_message());
  exp.push(fullscreen(false));

  return exp;
}
const EXP = genExpSeq();

jsPsych.run(EXP);
