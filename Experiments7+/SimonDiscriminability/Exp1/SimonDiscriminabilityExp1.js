// Simon Task with manipulation of stimulus discrimanibility
// Stimuli: Squares filled with small red/blue dots (varying proportions)
// Two levels of difficulty: easy (e.g., 10 vs. 90 %) vs. hard (e.g., 40 vs. 60%)
// Task: More blue vs. more red?

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
  fbDur: [0, 1500], // feedback duration for correct and incorrect trials, respectively
  tooSlow: 2000, // feedback duration for correct and incorrect trials, respectively
  fbText: ['', 'Falsch!', 'Zu langsam!'],
  iti: 500, // duration of the inter-trial-interval
  stimFont: '110px Arial',
  fbFont: '200px Arial',
  colours: ['rgba(0, 0, 255, 0.9)', 'rgba(255, 0, 0, 0.9)'],
  ratioEasy: [10, 90],
  ratioHard: [40, 60],
  respKeys: ['Q', 'P'],
  target: shuffle(['blue', 'red']),
  simonEccentricity: 200,
  dotRadius: 1.5,
  dotEccentricity: 50,
  dotGaps: 4,
  dotBlank: 0,
  cBlk: 1,
  cTrl: 1,
};

// 2 counter balanced versions
const VERSION = Number(jsPsych.data.urlVariables().version);
jsPsych.data.addProperties({ version: VERSION });

function calculateNumberOfDots() {
  // Required for ratio manipulation in VTS
  PRMS.nDots = 0;
  for (let rows = -PRMS.dotEccentricity; rows <= PRMS.dotEccentricity; rows += PRMS.dotGaps) {
    for (let cols = -PRMS.dotEccentricity; cols <= PRMS.dotEccentricity; cols += PRMS.dotGaps) {
      if (
        (rows > -PRMS.dotGaps * PRMS.dotBlank) &
        (rows < PRMS.dotGaps * PRMS.dotBlank) &
        (cols > -PRMS.dotGaps * PRMS.dotBlank) &
        (cols < PRMS.dotGaps * PRMS.dotBlank)
      ) {
        continue;
      }
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
           um das Experiment durchzuführen. Wir bitten dich die ca. nächsten 40 Minuten konzentriert zu arbeiten.<br><br>
           Du erhältst den Code für Versuchspersonenstunden und weitere Anweisungen am Ende des Experiments.
           Bei Fragen oder Problemen wende dich bitte an:<br><br>
           XXX@XXX<br><br>
           Drücke eine beliebige Taste, um fortzufahren`,
    align: 'left',
    fontsize: 30,
    width: '1200px',
    lineheight: 1.5,
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
    pad_me(PRMS.target[0], 25) +
    pad_me(PRMS.target[1], 25) +
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
               In diesem Block musst du auf in jedem Durchgang auf den
               Buchstaben reagieren welcher <span style="font-weight:bold;">rechts oder links</span> auf dem Bildschirm erscheint.
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

const TASK_REMINDER = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: '',
  on_start: function (trial) {
    trial.stimulus =
      generate_formatted_html({
        text: `Block ${PRMS.cBlk} von ${PRMS.nBlks}<br><br>Es gilt:`,
        align: 'left',
        colour: 'black',
        fontsize: 30,
      }) +
      RESP_TEXT +
      generate_formatted_html({
        text: `<br>Drücke eine beliebige Taste, um fortzufahren.`,
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
    console.log(args.position);
  let eccentricity = args.position === 'left' ? -PRMS.simonEccentricity : PRMS.simonEccentricity;
  for (
    let rows = -PRMS.dotEccentricity + eccentricity;
    rows <= PRMS.dotEccentricity + eccentricity;
    rows += PRMS.dotGaps
  ) {
    for (let cols = -PRMS.dotEccentricity; cols <= PRMS.dotEccentricity; cols += PRMS.dotGaps) {
      if (
        (rows > -PRMS.dotGaps * PRMS.dotBlank) &
        (rows < PRMS.dotGaps * PRMS.dotBlank) &
        (cols > -PRMS.dotGaps * PRMS.dotBlank) &
        (cols < PRMS.dotGaps * PRMS.dotBlank)
      ) {
        continue;
      }
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
    key: jsPsych.timelineVariable('key'),
  },
  on_start: function (trial) {
    'use strict';

    let ratio = trial.data.ratio === 'easy' ? PRMS.ratioEasy : PRMS.ratioHard;
    let dot_colours = repeatArray(CANVAS_COLOUR, Math.round(PRMS.nDots));
    if (trial.data.target === 'blue') {
      dot_colours = shuffle(
        repeatArray(PRMS.colours[0], Math.round(PRMS.nDots * (ratio[0] / 100))).concat(
          repeatArray(PRMS.colours[1], Math.round((PRMS.nDots * ratio[1]) / 100)),
        ),
      );
    } else if (trial.data.target === 'red') {
      dot_colours = shuffle(
        repeatArray(PRMS.colours[1], Math.round(PRMS.nDots * (ratio[0] / 100))).concat(
          repeatArray(PRMS.colours[0], Math.round((PRMS.nDots * ratio[1]) / 100)),
        ),
      );
    }
    trial.func_args = [{ position: trial.data.position, colours: dot_colours }];
  },
  on_finish: function () {
    codeTrial();
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
    if (dat.error === 1) {
      trial.trial_duration = PRMS.fbDur[dat.error];
      trial.stimulus =
        generate_formatted_html({
          text: `${PRMS.fbText[dat.error]}`,
          align: 'center',
          fontsize: 30,
          width: '1200px',
          lineheight: 1.5,
        }) + RESPMAPPING;
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
  console.table(dat);

    let corrCode = 0;

  jsPsych.data.addDataToLastTrial({
    date: Date(),
    corrCode: corrCode,
    blockNum: PRMS.cBlk,
    trialNum: PRMS.cTrl,
  });

  PRMS.cTrl += 1;
}

// prettier-ignore
const TRIAL_TABLE_EASY = [
    { ratio: "easy", position: "left",  target: PRMS.target[0], compatibility: "comp",   key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[0])] },
    { ratio: "easy", position: "left",  target: PRMS.target[1], compatibility: "incomp", key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[1])] },
    { ratio: "easy", position: "right", target: PRMS.target[0], compatibility: "incomp", key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[0])] },
    { ratio: "easy", position: "right", target: PRMS.target[1], compatibility: "comp",   key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[1])] },
];

// prettier-ignore
const TRIAL_TABLE_HARD = [
  { ratio: 'hard', position: 'left',  target: PRMS.target[0], compatibility: 'comp',   key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[0])] },
  { ratio: 'hard', position: 'left',  target: PRMS.target[1], compatibility: 'incomp', key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[1])] },
  { ratio: 'hard', position: 'right', target: PRMS.target[0], compatibility: 'incomp', key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[0])] },
  { ratio: 'hard', position: 'right', target: PRMS.target[1], compatibility: 'comp',   key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[1])] },
];

// prettier-ignore
const TRIAL_TIMELINE_EASY = {
    timeline: [FIXATION_CROSS, SIMON, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIAL_TABLE_EASY
};

// prettier-ignore
const TRIAL_TIMELINE_HARD = {
    timeline: [FIXATION_CROSS, SIMON, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIAL_TABLE_HARD
};

////////////////////////////////////////////////////////////////////////
//                              VP Stunden                            //
////////////////////////////////////////////////////////////////////////
const RANDOM_STRING = generateRandomString(16, 'sd_');

const VP_CODE_INSTRUCTIONS = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  response_ends_trial: true,
  choices: [' '],
  stimulus: generate_formatted_html({
    text:
      `Super, du bist am Ende des Experiments!
       Vielen Dank für deine Teilnahme :)<br><br>
       Wenn du Versuchspersonenstunden benötigst, kopiere den folgenden
       zufällig generierten Code und sende diesen zusammen mit deiner
       Matrikelnummer per Email mit dem Betreff 'Versuchspersonenstunde'
       an:<br><br>
       XXX@XXX<br><br>
       Code:
      <span style="font-weight:bold;">` +
      RANDOM_STRING +
      `</span>` +
      `<br><br>Drücke die Leertaste, um fortzufahren!`,
    align: 'left',
    fontsize: 30,
    width: '1200px',
    lineheight: 1.5,
  }),
};

////////////////////////////////////////////////////////////////////////
//                              Save                                  //
////////////////////////////////////////////////////////////////////////
const DIR_NAME = getDirName();
const EXP_NAME = getFileName();

function save() {
  const vpNum = getTime();
  jsPsych.data.addProperties({ vpNum: vpNum });

  const data_fn = `${DIR_NAME}data/version${VERSION}/${EXP_NAME}_${vpNum}`;
  saveData('/Common/write_data.php', data_fn, { stim_type: 'sd' });
  // saveDataLocal(data_fn, { stim_type: 'vtstd' });

  const code_fn = `${DIR_NAME}code/${EXP_NAME}`;
  saveRandomCode('/Common/write_code.php', code_fn, RANDOM_STRING);
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
  // exp.push(vpInfoForm('/Common7+/vpInfoForm_de.html'));
  // exp.push(mouseCursor(false));

  // exp.push(WELCOME_INSTRUCTIONS);
  exp.push(COUNT_DOTS);

  exp.push(TASK_INSTRUCTIONS);
  exp.push(TRIAL_TIMELINE_EASY);

  // save data
  // exp.push(SAVE_DATA);

  // debrief
  exp.push(mouseCursor(true));
  exp.push(VP_CODE_INSTRUCTIONS);
  exp.push(end_message());
  exp.push(fullscreen(false));

  return exp;
}
const EXP = genExpSeq();

jsPsych.run(EXP);
