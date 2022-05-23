// Simon Task:
// Participants respond to a laterally presented letter (H/S) with
//  left and right key-press responses.
// The duration of the presented letter is manipulated blockwise.

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
  nTrlsP: 4, // 8,  // number of trials in practice block
  nTrlsE: 8, // 48, // number of trials in subsequent blocks
  nBlks: 2,
  fixDur: 500,
  fbDur: [500, 1500, 1500, 1500],
  fixWidth: 5,
  fixSize: 20,
  stimFont: '120px Monospaced',
  stimEccentricity: 200,
  stimDuration: [200, null],
  fbTxtSizeTrial: '40px Monospaced',
  waitDur: 500,
  iti: 500,
  tooFast: 100,
  tooSlow: 2000,
  respKeys: ['Q', 'P'],
  respLetters: shuffle(['H', 'S']),
  fbTxt: ['Richtig', 'Falsch', 'Zu langsam!', 'Zu schnell!'],
  cTrl: 1, // count trials
  cBlk: 1, // count blocks
};

// 2 counter balanced versions
const version = 1; // Number(jsPsych.data.urlVariables().version);
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

const VP_CODE_INSTRUCTIONS1 = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: generate_formatted_html({
    text: `Du erhaelst den Code für die Versuchspersonenstunden und weitere Anweisungen
           am Ende des Experimentes. Bei Fragen oder Problemen wende dich bitte an:<br><br>
           Experiment.TaskSwitching@gmail.com<br><br>
           Drücke eine beliebige Taste, um fortzufahren!`,
    align: 'left',
    fontsize: 30,
    width: '1200px',
    bold: true,
    lineheight: 1.5,
  }),
};

// Response mapping 
const RESPTEXT = generate_formatted_html({
  text: `${PRMS.respLetters[0]} = linker Zeigefinger &emsp;&emsp;&emsp;${PRMS.respLetters[1]} = rechter Zeigefinger<br>
         (Taste '${PRMS.respKeys[0]}') &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;(Taste '${PRMS.respKeys[1]}')`,
  align: 'center',
  fontsize: 30,
  width: '1200px',
  bold: true,
  lineheight: 1.5,
})

const TASK_INSTRUCTIONS = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus:
    generate_formatted_html({
      text: `Aufgabe:<br><br>
             In diesem Experiment musst du auf verschiedene Buchstaben so schnell und so genau wie möglich reagieren.<br><br>
             Es gilt die folgende Zuordnung:<br><br>`,
      align: 'left',
      fontsize: 30,
      width: '1200px',
      bold: true,
      lineheight: 1.5,
    }) +
    RESPTEXT +
    generate_formatted_html({
      text: `<br>Drücke eine beliebige Taste, um fortzufahren!`,
      align: 'left',
      width: '1200px',
      fontsize: 30,
      bold: true,
      lineheight: 1.5,
    }),
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////
function drawFixation() {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  ctx.lineWidth = PRMS.fixWidth;
  ctx.moveTo(-PRMS.fixSize, 0);
  ctx.lineTo(PRMS.fixSize, 0);
  ctx.stroke();
  ctx.moveTo(0, -PRMS.fixSize);
  ctx.lineTo(0, PRMS.fixSize);
  ctx.stroke();
}

const FIXATION_CROSS = {
  type: jsPsychStaticCanvasKeyboardResponse,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  trial_duration: PRMS.fixDur,
  translate_origin: true,
  response_ends_trial: false,
  func: drawFixation,
};

function drawSimon(args) {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');

  // draw Simon
  ctx.font = PRMS.stimFont;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';

  switch (args.position) {
    case 'left':
      ctx.fillText(args.letter, -PRMS.stimEccentricity, 10);
      break;
    case 'right':
      ctx.fillText(args.letter, PRMS.stimEccentricity, 10);
      break;
  }
}

const SIMON_STIMULUS = {
  type: jsPsychStaticCanvasKeyboardResponse,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  trial_duration: PRMS.tooSlow,
  stimulus_duration: jsPsych.timelineVariable('duration'),
  translate_origin: true,
  response_ends_trial: true,
  func: drawSimon,
  choices: PRMS.respKeys,
  func: drawSimon,
  func_args: [
    {
      position: jsPsych.timelineVariable('position'),
      letter: jsPsych.timelineVariable('letter'),
    },
  ],
  data: {
    stim: 'simon',
    duration: jsPsych.timelineVariable('duration'),
    position: jsPsych.timelineVariable('position'),
    letter: jsPsych.timelineVariable('letter'),
    comp: jsPsych.timelineVariable('comp'),
    corrResp: jsPsych.timelineVariable('corrResp'),
  },
  on_finish: function() {
    codeTrial();
    PRMS.cTrl += 1;
  },
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

function drawFeedback() {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  let dat = jsPsych.data.get().last(1).values()[0];

  ctx.font = PRMS.fbTxtSizeTrial;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';
  ctx.fillText(PRMS.fbTxt[dat.corrCode - 1], 0, 0);
}

const TRIAL_FEEDBACK = {
  type: jsPsychStaticCanvasKeyboardResponse,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  translate_origin: true,
  response_ends_trial: false,
  func: drawFeedback,
  on_start: function(trial) {
    let dat = jsPsych.data.get().last(1).values()[0];
    trial.trial_duration = PRMS.fbDur[dat.corrCode - 1];
  },
};

// prettier-ignore
const SIMONS_SHORT = [
  { letter: PRMS.respLetters[0], duration: PRMS.stimDuration[0], position: 'left', comp: 'comp', corrResp: PRMS.respKeys[0] },
  { letter: PRMS.respLetters[1], duration: PRMS.stimDuration[0], position: 'right', comp: 'comp', corrResp: PRMS.respKeys[1] },
  { letter: PRMS.respLetters[0], duration: PRMS.stimDuration[0], position: 'right', comp: 'incomp', corrResp: PRMS.respKeys[0] },
  { letter: PRMS.respLetters[1], duration: PRMS.stimDuration[0], position: 'left', comp: 'incomp', corrResp: PRMS.respKeys[1] },
]

// prettier-ignore
const SIMONS_LONG = [
  { letter: PRMS.respLetters[0], duration: PRMS.stimDuration[1], position: 'left', comp: 'comp', corrResp: PRMS.respKeys[0] },
  { letter: PRMS.respLetters[1], duration: PRMS.stimDuration[1], position: 'right', comp: 'comp', corrResp: PRMS.respKeys[1] },
  { letter: PRMS.respLetters[0], duration: PRMS.stimDuration[1], position: 'right', comp: 'incomp', corrResp: PRMS.respKeys[0] },
  { letter: PRMS.respLetters[1], duration: PRMS.stimDuration[1], position: 'left', comp: 'incomp', corrResp: PRMS.respKeys[1] },
]

const TRIAL_TIMELINE_SHORT = {
  timeline: [FIXATION_CROSS, SIMON_STIMULUS, TRIAL_FEEDBACK, ITI],
  timeline_variables: SIMONS_SHORT,
  size: 1
};

const TRIAL_TIMELINE_LONG = {
  timeline: [FIXATION_CROSS, SIMON_STIMULUS, TRIAL_FEEDBACK, ITI],
  timeline_variables: SIMONS_LONG,
  size: 1
};

function codeTrial() {
  'use strict';
  let dat = jsPsych.data.get().last(1).values()[0];
  dat.rt === null ? PRMS.tooSlow : dat.rt;

  let correctKey = jsPsych.pluginAPI.compareKeys(dat.key_press, dat.corrResp);
  let corrCode;

  if (correctKey && (dat.rt > PRMS.tooFast) & (dat.rt < PRMS.tooSlow)) {
    corrCode = 1; // correct
  } else if (!correctKey && (dat.rt > PRMS.tooFast) & (dat.rt < PRMS.tooSlow)) {
    corrCode = 2; // choice error
  } else if (dat.rt >= PRMS.tooSlow) {
    corrCode = 3; // too slow
  } else if (dat.rt <= PRMS.tooFast) {
    corrCode = 4; // too fast
  }

  jsPsych.data.addDataToLastTrial({
    date: Date(),
    blockNum: PRMS.cBlk,
    trialNum: PRMS.cTrl,
    corrCode: corrCode,
  });
}

const BLOCK_FEEDBACK = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: '',
  response_ends_trial: true,
  on_start: function(trial) {
    let block_dvs = calculateBlockPerformance({ filter_options: { stim: 'simon', blockNum: PRMS.cBlk } });
    let text = blockFeedbackText(PRMS.cBlk, PRMS.nBlks, block_dvs.meanRt, block_dvs.errorRate, (language = 'de'));
    trial.stimulus = `<div style="font-size:${PRMS.fbTxtSizeBlock}px;">${text}</div>`;
  },
  on_finish: function() {
    PRMS.cTrl = 1;
    PRMS.cBlk += 1;
  },
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
  const data_fn = `${EXP_NAME}_${vpNum}`;
  saveDataLocal(data_fn, { stim: 'simon' });
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
  exp.push(TASK_INSTRUCTIONS);
  exp.push(ITI);

  let blk_type;
  if (version === 1) {
    blk_type = repeatArray(['Long'], PRMS.nBlks / 2).concat(repeatArray(['Short'], PRMS.nBlks / 2));
  } else if (version === 2) {
    blk_type = repeatArray(['Short'], PRMS.nBlks / 2).concat(repeatArray(['Long'], PRMS.nBlks / 2));
  }

  let blk_timeline;
  for (let blk = 0; blk < PRMS.nBlks; blk += 1) {
    if (blk_type[blk] === "Short") {
      blk_timeline = { ...TRIAL_TIMELINE_SHORT };
    } else if (blk_type[blk] === "Long") {
      blk_timeline = { ...TRIAL_TIMELINE_LONG };
    }
    blk_timeline.sample = { type: 'fixed-repetitions', size: 1 };
    exp.push(blk_timeline); // trials within a block
    exp.push(BLOCK_FEEDBACK)
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
