// Simon Task with manipulation of stimulus discrimanibility
// Stimuli: Squares filled with small red/blue dots (varying proportions)
// Two levels of difficulty: easy (e.g., 10 vs. 90 %) vs. hard (e.g., 40 vs. 60%)
// Task: More blue vs. more red?
//
// Trial Structure
// Cental fixation cross for 500 ms
// Lateral stimulus until response (or 2000 ms)
// If incorrect, feedback screen for 1500 ms
// inter-trial-interval of 500 ms
//
// Block structure
// 12 blocks of 56 trials

const jsPsych = initJsPsych({});

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const CANVAS_COLOUR = 'rgba(200, 200, 200, 1)';
const CANVAS_SIZE = [1280, 720];
const CANVAS_BORDER = '5px solid black';

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////

const PRMS = {
  screenRes: [960, 720], // minimum screen resolution requested
  nTrls: 56, // number of trials per block
  nBlks: 12, // number of blocks
  fixSize: 15, // duration of the fixation cross
  fixWidth: 5, // size of fixation cross
  fixDur: 500, // duration of the fixation cross
  fbDur: [0, 1500, 1500, 1500], // feedback duration for response type (correct, incorrect, too slow, too fast)
  tooSlow: 2000, // feedback duration for correct and incorrect trials, respectively
  tooFast: 0, // feedback duration for correct and incorrect trials, respectively
  fbText: ['', 'Falsch!', 'Zu langsam!', 'Zu schnell!'],
  iti: 500, // duration of the inter-trial-interval
  stimFont: '110px Arial',
  fbFont: '200px Arial',
  colours: ['rgba(0, 0, 255, 0.9)', 'rgba(255, 0, 0, 0.9)'],
  ratioEasy: [10, 90], // should sum to 100!
  ratioHard: [37.5, 62.5], // should sum to 100!
  respKeys: ['Q', 'P'],
  target: shuffle(['blue', 'red']),
  simonEccentricity: 300,
  dotRadius: 2,
  squareSize: 50,
  dotGaps: 5,
  cBlk: 1,
  cTrl: 1,
};

const EN_DE = { blue: 'blau', red: 'rot' };

function calculateNumberOfDots() {
  // Required for ratio manipulation in VTS
  PRMS.nDots = 0;
  for (let rows = -PRMS.squareSize; rows <= PRMS.squareSize; rows += PRMS.dotGaps) {
    for (let cols = -PRMS.squareSize; cols <= PRMS.squareSize; cols += PRMS.dotGaps) {
      PRMS.nDots += 1;
    }
  }
}

const COUNT_DOTS = {
  type: jsPsychCallFunction,
  func: calculateNumberOfDots,
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
               um das Experiment durchzuführen. Wir bitten dich die nächsten ca. 30-35 Minuten konzentriert zu arbeiten.<br><br>
               Du erhältst Informationen zur Versuchspersonenstunde nach dem Experiment.
               Bei Fragen oder Problemen wende dich bitte an:<br><br>
               ruben.ellinghaus@fernuni-hagen.de<br><br>
               Drücke eine beliebige Taste, um fortzufahren`,
    align: 'left',
    colour: 'black',
    fontsize: 30,
  }),
};

function pad_me(str, npad) {
  let len = Math.floor((npad - str.length) / 2);
  str = ' '.repeat(len) + str + ' '.repeat(len);
  return str
    .split('')
    .map(function (c) {
      return c === ' ' ? '&nbsp;' : c;
    })
    .join('');
}

// response keys
const RESP_TEXT = generate_formatted_html({
  text: `${
    pad_me('mehr ' + EN_DE[PRMS.target[0]], 20) +
    pad_me('mehr ' + EN_DE[PRMS.target[1]], 20) +
    '<br>' +
    pad_me('(Taste-' + PRMS.respKeys[0] + ')', 20) +
    pad_me('(Taste-' + PRMS.respKeys[1] + ')', 20)
  }`,
  align: 'center',
  fontsize: 30,
  bold: true,
  lineheight: 1.5,
});

const TASK_INSTRUCTIONS = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: '',
  on_start: function (trial) {
    trial.stimulus =
      generate_formatted_html({
        text: `Mini-Block ${PRMS.cBlk} von ${PRMS.nBlks}:<br><br>
               Du musst in jedem Durchgang entscheiden ob das Quadrat mehr blaue oder mehr rote Punkte hat.
               Reagiere wie folgt:<br>`,
        align: 'left',
        colour: 'black',
        fontsize: 30,
      }) +
      RESP_TEXT +
      generate_formatted_html({
        text: `Drücke eine beliebige Taste, um fortzufahren.`,
        align: 'left',
        colour: 'black',
        fontsize: 30,
      });
  },
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
  translate_origin: true,
  response_ends_trial: false,
  trial_duration: PRMS.fixDur,
  func: drawFixation,
};

function drawStimulus(args) {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  // draw colour dors
  let radius = PRMS.dotRadius;
  let idx = 0;
  let eccentricity = args.position === 'left' ? -PRMS.simonEccentricity : PRMS.simonEccentricity;
  for (let rows = -PRMS.squareSize + eccentricity; rows <= PRMS.squareSize + eccentricity; rows += PRMS.dotGaps) {
    for (let cols = -PRMS.squareSize; cols <= PRMS.squareSize; cols += PRMS.dotGaps) {
      let centerX = rows;
      let centerY = cols;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = args.colours[idx];
      ctx.fill();
      idx += 1;
    }
  }
}

const SIMON = {
  type: jsPsychStaticCanvasKeyboardResponse,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  translate_origin: true,
  response_ends_trial: true,
  choices: null,
  trial_duration: PRMS.tooSlow,
  func: drawStimulus,
  func_args: null,
  data: {
    stim_type: 'sd',
    ratio: jsPsych.timelineVariable('ratio'),
    position: jsPsych.timelineVariable('position'),
    target: jsPsych.timelineVariable('target'),
    compatibility: jsPsych.timelineVariable('compatibility'),
    correct_key: jsPsych.timelineVariable('correct_key'),
  },
  on_start: function (trial) {
    'use strict';

    let ratio = trial.data.ratio === 'easy' ? PRMS.ratioEasy : PRMS.ratioHard;
    let dot_colours = repeatArray(CANVAS_COLOUR, Math.round(PRMS.nDots));
    if (trial.data.target === 'blue') {
      dot_colours = shuffle(
        repeatArray(PRMS.colours[0], Math.round(PRMS.nDots * (ratio[1] / 100))).concat(
          repeatArray(PRMS.colours[1], Math.round((PRMS.nDots * ratio[0]) / 100)),
        ),
      );
    } else if (trial.data.target === 'red') {
      dot_colours = shuffle(
        repeatArray(PRMS.colours[1], Math.round(PRMS.nDots * (ratio[1] / 100))).concat(
          repeatArray(PRMS.colours[0], Math.round((PRMS.nDots * ratio[0]) / 100)),
        ),
      );
    }
    trial.func_args = [{ position: trial.data.position, colours: dot_colours }];
  },
  on_finish: function () {
    codeTrial();
    PRMS.cTrl += 1;
  },
};

const TRIAL_FEEDBACK = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: '',
  response_ends_trial: false,
  trial_duration: 0,
  on_start: function (trial) {
    let dat = jsPsych.data.get().last(1).values()[0];
    trial.trial_duration = PRMS.fbDur[dat.corrCode - 1];
    if (dat.corrCode != 1) {
      trial.stimulus = generate_formatted_html({
        text: `${PRMS.fbText[dat.corrCode - 1]}`,
        align: 'center',
        fontsize: 30,
        width: '1200px',
        lineheight: 1.5,
      });
    }
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

function codeTrial() {
  'use strict';

  let dat = jsPsych.data.get().last(1).values()[0];
  dat.rt = dat.rt !== null ? dat.rt : PRMS.tooSlow;
    

  let corrCode = 0;
  let correctKey = jsPsych.pluginAPI.compareKeys(dat.key_press, dat.correct_key);

  if (correctKey && dat.rt > PRMS.tooFast && dat.rt < PRMS.tooSlow) {
    corrCode = 1; // correct
  } else if (!correctKey && dat.rt > PRMS.tooFast && dat.rt < PRMS.tooSlow) {
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
  on_start: function (trial) {
    let block_dvs = calculateBlockPerformance({
      filter_options: { stim_type: 'sd', blockNum: PRMS.cBlk },
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
const TRIAL_TABLE = [
    { ratio: "easy", position: "left",  target: PRMS.target[0], compatibility: "comp",   correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[0])] },
    { ratio: "easy", position: "left",  target: PRMS.target[1], compatibility: "incomp", correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[1])] },
    { ratio: "easy", position: "right", target: PRMS.target[0], compatibility: "incomp", correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[0])] },
    { ratio: "easy", position: "right", target: PRMS.target[1], compatibility: "comp",   correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[1])] },
    { ratio: 'hard', position: 'left',  target: PRMS.target[0], compatibility: 'comp',   correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[0])] },
    { ratio: 'hard', position: 'left',  target: PRMS.target[1], compatibility: 'incomp', correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[1])] },
    { ratio: 'hard', position: 'right', target: PRMS.target[0], compatibility: 'incomp', correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[0])] },
    { ratio: 'hard', position: 'right', target: PRMS.target[1], compatibility: 'comp',   correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[1])] },
];

// prettier-ignore
const TRIAL_TIMELINE = {
    timeline: [FIXATION_CROSS, SIMON, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIAL_TABLE
};

////////////////////////////////////////////////////////////////////////
//                             VP Stunden                             //
////////////////////////////////////////////////////////////////////////
const END_SCREEN = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  response_ends_trial: true,
  choices: [' '],
  stimulus: generate_formatted_html({
    text: `Dieser Teil des Experiments ist jetzt beendet.<br><br>
             Nun folgen Informationen zur Versuchspersonenstunde auf Unipark.
             Drücke eine beliebige Taste, um die Weiterleitung zu Unipark zu starten.`,
    fontsize: 28,
    lineheight: 1.0,
    bold: false,
    align: 'left',
  }),
  on_finish: function () {},
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
  saveData('/Common/write_data.php', data_fn, { stim_type: 'sd' });
  // saveDataLocal(data_fn, { stim_type: 'sd' });

  // const code_fn = `${DIR_NAME}code/${EXP_NAME}`;
  // saveRandomCode('/Common/write_code.php', code_fn, RANDOM_STRING);
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
  exp.push(COUNT_DOTS);

  exp.push(TASK_INSTRUCTIONS);

  for (let blk = 0; blk < PRMS.nBlks; blk += 1) {
    let blk_timeline;
    blk_timeline = { ...TRIAL_TIMELINE };
    blk_timeline.sample = {
      type: 'fixed-repetitions',
      size: PRMS.nTrls / TRIAL_TABLE.length,
    };
    exp.push(blk_timeline); // trials within a block
    exp.push(BLOCK_FEEDBACK); // show previous block performance
  }

  // save data
  exp.push(SAVE_DATA);

  // debrief
  exp.push(mouseCursor(true));
  exp.push(END_SCREEN);
  exp.push(end_message());
  exp.push(fullscreen(false));

  return exp;
}
const EXP = genExpSeq();

jsPsych.run(EXP);
