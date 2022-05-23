// Negation Task:
// Participants respond to the meaning using key responses:
// Language (Now left/not left)
// Symbolic (Tick Mark Left / Cross Mark Left)

const jsPsych = initJsPsych({});

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const CANVAS_COLOUR = 'rgba(255, 255, 255, 1)';
const CANVAS_SIZE = [1280, 720];
const CANVAS_BORDER = '5px solid black';

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const PRMS = {
  nTrlsP: 4, //8, // number of trials in practice block
  nTrlsE: 8, // 48, // number of trials in subsequent blocks
  nBlks: 2, //6,
  fixDur: 500,
  fbDur: [500, 500],
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

// symbol characters
const TICK_MARK = "&#10004;";
const CROSS_MARK = "&#10008;";

const LEFT_ARROW = "&#129144;";
const RIGHT_ARROW = "&#129146;";


// 2 counter balanced versions
const version = Number(jsPsych.data.urlVariables().version);
jsPsych.data.addProperties({ version: version });

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
           um das Experiment durchzuführen. Wir bitten dich die ca. nächsten 15 Minuten konzentriert zu arbeiten.<br><br>
           Drücke eine beliebige Taste, um fortzufahren`,
    align: 'left',
    fontsize: 30,
    width: '1200px',
    bold: true,
    lineheight: 1.5,
  }),
};

const TASK_INSTRUCTIONS_LANGUAGE = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: generate_formatted_html({
    text: `Reagiere entsprechend der Bedeutung!<br><br>
"jetzt links" &emsp;oder&emsp; "nicht rechts" &emsp;&emsp;&emsp; "jetzt rechts" &emsp;oder&emsp; "nicht links"<br>
Linke blaue Taste &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; Rechte blaue Taste<br><br><br>
Drücke eine beliebige Taste, um fortzufahren`,
    align: 'center',
    fontsize: 30,
    width: '1200px',
    bold: true,
    lineheight: 1.5,
  }),
};


const TASK_INSTRUCTIONS_SYMBOLIC = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: generate_formatted_html({
    text: `Reagiere entsprechend der Bedeutung!<br><br>
"${TICK_MARK}${LEFT_ARROW}" &emsp;oder&emsp; "${CROSS_MARK}${RIGHT_ARROW}" &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; "${TICK_MARK}${RIGHT_ARROW}" &emsp;oder&emsp; "${CROSS_MARK}${LEFT_ARROW}"<br>
Linke blaue Taste &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; Rechte blaue Taste<br><br><br>
Drücke eine beliebige Taste, um fortzufahren`,
    align: 'center',
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
// const AFFNEGS_SYMBOLS = [
//     `<div style="font-size:${PRMS.stimSize}px;"><span style="vertical-align: sub; font-size:${PRMS.stimSize * 1.5}px; color: green">\u2714</span>links</h1>`,
//     `<div style="font-size:${PRMS.stimSize}px;"><span style="vertical-align: sub; font-size:${PRMS.stimSize * 1.5}px; color: green">\u2714</span>rechts</h1>`,
//     `<div style="font-size:${PRMS.stimSize}px;"><span style="vertical-align: sub; font-size:${PRMS.stimSize * 1.5}px; color: red">\u2718</span>links</h1>`,
//     `<div style="font-size:${PRMS.stimSize}px;"><span style="vertical-align: sub; font-size:${PRMS.stimSize * 1.5}px; color: red">\u2718</span>rechts</h1>`,
// ];


// pretier-ignore
const AFFNEGS_SYMBOLS = [
  `<div style="font-size:${PRMS.stimSize}px;">${TICK_MARK}${LEFT_ARROW}</h1>`,
  `<div style="font-size:${PRMS.stimSize}px;">${TICK_MARK}${RIGHT_ARROW}</h1>`,
  `<div style="font-size:${PRMS.stimSize}px;">${CROSS_MARK}${LEFT_ARROW}</h1>`,
  `<div style="font-size:${PRMS.stimSize}px;">${CROSS_MARK}${RIGHT_ARROW}</h1>`,
];

// pretier-ignore
const AFFNEGS_LANGUAGE = [
  `<div style="font-size:${PRMS.stimSize}px;">jetzt links</h1>`,
  `<div style="font-size:${PRMS.stimSize}px;">jetzt rechts</h1>`,
  `<div style="font-size:${PRMS.stimSize}px;">nicht links</h1>`,
  `<div style="font-size:${PRMS.stimSize}px;">nicht rechts</h1>`,
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
  on_start: function(trial) {
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
  stimulus: jsPsych.timelineVariable('stimulus'),
  trial_duration: PRMS.tooSlow,
  response_ends_trial: true,
  choices: PRMS.respKeys,
  data: {
    stim: 'affneg',
    type: jsPsych.timelineVariable('type'),
    affneg: jsPsych.timelineVariable('affneg'),
    stimulus: jsPsych.timelineVariable('stimulus'),
    side: jsPsych.timelineVariable('side'),
    corrResp: jsPsych.timelineVariable('key'),
  },
  on_finish: function() {
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
  on_start: function(trial) {
    let block_dvs = calculateBlockPerformance({
      filter_options: { stim: 'affneg', blockNum: PRMS.cBlk },
      corrColumn: 'error',
      corrValue: 0,
    });
    let text = blockFeedbackText(PRMS.cBlk, PRMS.nBlks, block_dvs.meanRt, block_dvs.errorRate, (language = 'de'));
    trial.stimulus = `<div style="font-size:${PRMS.fbTxtSizeBlock}px;">${text}</div>`;
  },
  on_finish: function() {
    PRMS.cTrl = 1;
    PRMS.cBlk += 1;
  },
};

// prettier-ignore
const TRIAL_TIMELINE_SYMBOLIC = {
  timeline: [FIXATION_CROSS, AFFNEG_STIMULUS, TRIAL_FEEDBACK, ITI],
  timeline_variables: [
    { type: "symbolic", affneg: "jetzt", stimulus: AFFNEGS_SYMBOLS[0], side: 'links', key: PRMS.respKeys[0] },
    { type: "symbolic", affneg: "jetzt", stimulus: AFFNEGS_SYMBOLS[1], side: 'rechts', key: PRMS.respKeys[1] },
    { type: "symbolic", affneg: "nicht", stimulus: AFFNEGS_SYMBOLS[2], side: 'links', key: PRMS.respKeys[1] },
    { type: "symbolic", affneg: "nicht", stimulus: AFFNEGS_SYMBOLS[3], side: 'rechts', key: PRMS.respKeys[0] },
  ],
};

// prettier-ignore
const TRIAL_TIMELINE_LANGUAGE = {
  timeline: [FIXATION_CROSS, AFFNEG_STIMULUS, TRIAL_FEEDBACK, ITI],
  timeline_variables: [
    { type: "language", affneg: "jetzt", stimulus: AFFNEGS_LANGUAGE[0], side: 'links', key: PRMS.respKeys[0] },
    { type: "language", affneg: "jetzt", stimulus: AFFNEGS_LANGUAGE[1], side: 'rechts', key: PRMS.respKeys[1] },
    { type: "language", affneg: "nicht", stimulus: AFFNEGS_LANGUAGE[2], side: 'links', key: PRMS.respKeys[1] },
    { type: "language", affneg: "nicht", stimulus: AFFNEGS_LANGUAGE[3], side: 'rechts', key: PRMS.respKeys[0] },
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

  // const data_fn = `${DIR_NAME}data/version${version}/${EXP_NAME}_${vpNum}`;
  // saveData('/Common/write_data.php', data_fn, { stim: 'affneg' });
  const data_fn = `/home/ian/Downloads/${EXP_NAME}_${vpNum}`;
  saveDataLocal(data_fn, { stim: 'affneg' });
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

  // exp.push(fullscreen(true));
  // exp.push(browser_check(PRMS.screenRes));
  // exp.push(resize_browser());
  // exp.push(welcome_message());
  // // exp.push(vpInfoFormClinic('/Common7+/vpInfoFormClinic_de.html'));
  // exp.push(mouseCursor(false));
  // exp.push(WELCOME_INSTRUCTIONS);
  // exp.push(WAIT);

  let blk_type;
  if (version === 1) {
    blk_type = repeatArray(['Language'], PRMS.nBlks / 2).concat(repeatArray(['Symbolic'], PRMS.nBlks / 2));
  } else if (version === 2) {
    blk_type = repeatArray(['Symbolic'], PRMS.nBlks / 2).concat(repeatArray(['Language'], PRMS.nBlks / 2));
  }

  for (let blk = 0; blk < PRMS.nBlks; blk += 1) {
    let blk_timeline;
    if (blk_type[blk] === 'Language') {

      exp.push(TASK_INSTRUCTIONS_LANGUAGE);
      exp.push(WAIT);

      blk_timeline = { ...TRIAL_TIMELINE_LANGUAGE };
      blk_timeline.sample = {
        type: 'fixed-repetitions',
        size: [0, PRMS.nBlks / 2].includes(blk)
          ? PRMS.nTrlsP / AFFNEGS_LANGUAGE.length
          : PRMS.nTrlsE / AFFNEGS_LANGUAGE.length,
      };
    } else if (blk_type[blk] === 'Symbolic') {

      exp.push(TASK_INSTRUCTIONS_SYMBOLIC);
      exp.push(WAIT);

      blk_timeline = { ...TRIAL_TIMELINE_SYMBOLIC };
      blk_timeline.sample = {
        type: 'fixed-repetitions',
        size: [0, PRMS.nBlks / 2].includes(blk)
          ? PRMS.nTrlsP / AFFNEGS_SYMBOLS.length
          : PRMS.nTrlsE / AFFNEGS_SYMBOLS.length,
      };
    }
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
