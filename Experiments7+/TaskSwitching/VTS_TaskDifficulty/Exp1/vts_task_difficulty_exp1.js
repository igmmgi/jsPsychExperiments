// Voluntary Task Switching with two tasks
// Task 1: Colour (more red vs. more blue)
// Task 2: Letter (normal vs. mirrored)
// Two levels of difficulty within each task
// Colour task: ratio, Letter task: degree of rotation
// NB Only 1 task varies in difficulty level
// Block structure:
// 50% of trials are free choice,
// 50% of trials are forced choice (25% colour, 25% letter)
// Of the 25% forced task choices, 50% should be easy, 50% hard

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
  nTrls: 120, // number of trials per block
  nBlks: 4, // number of blocks
  fixSize: 50, // duration of the fixation cross
  fixDur: 500, // duration of the fixation cross
  fbDur: [0, 3000], // feedback duration for correct and incorrect trials, respectively
  fbText: ['Richtig', 'Falsch!'],
  iti: 500, // duration of the inter-trial-interval
  stimFont: '250px Arial',
  fbFont: '28px Arial',
  letters: ['F', 'G', 'J', 'L', 'P', 'R'],
  numDots: 100,
  anglesEasy: [-10, 10],
  anglesHard: [-10, 10],
  colours: ['rgba(0, 0, 255, 1)', 'rgba(255, 0, 0, 1)'],
  // colours: ['Blue', 'Red'],
  ratioEasy: 90,
  ratioHard: 60,
  respKeys: ['Q', 'W', 'O', 'P'],
  deactivateKeys: true, // should keys be deactivate when task not available?
  cBlk: 1,
  cTrl: 1,
  nDots: 0,
  dotRadius: 15,
  dotEccentricity: 250,
  dotGaps: 50,
  dotBlank: 3,
  nDots: null
};

// 2 counter balanced versions
const VERSION = 1; // Number(jsPsych.data.urlVariables().version);
jsPsych.data.addProperties({ version: VERSION });

if (VERSION == 1) {
  PRMS.letterTask = shuffle(['O', 'P']); // normal vs. mirrored
  PRMS.colourTask = shuffle(['Q', 'W']); // more red vs. more blue
} else if (VERSION == 2) {
  PRMS.colourTask = shuffle(['O', 'P']); // more red vs. more blue
  PRMS.letterTask = shuffle(['Q', 'W']); // normal vs. mirrored
}

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
           um das Experiment durchzuführen. Wir bitten dich die ca. nächsten 45 Minuten konzentriert zu arbeiten.<br><br>
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
  on_start: function () {
    PRMS.nDots = calculateNumberOfDots();
  },
};

const VP_CODE_INSTRUCTIONS1 = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: generate_formatted_html({
    text: `Du erhaelst den Code für die Versuchspersonenstunden und weitere Anweisungen
    am Ende des Experimentes. Bei Fragen oder Problemen wende dich bitte an:<br><br>
    hiwipibio@gmail.com<br><br>
    Drücke eine beliebige Taste, um fortzufahren!`,
    align: 'left',
    fontsize: 30,
    width: '1200px',
    bold: true,
    lineheight: 1.5,
  }),
};

// const TASK_INSTRUCTIONS1 = {
//   type: jsPsychHtmlKeyboardResponseCanvas,
//   canvas_colour: CANVAS_COLOUR,
//   canvas_size: CANVAS_SIZE,
//   canvas_border: CANVAS_BORDER,
//   stimulus: generate_formatted_html({
//     text: `Du siehst in jedem Durchgang einen Buchstaben und eine Farbiges Rechteck, aber eine Aufgabe erscheint später als die andere Aufgabe.<br><br>
//            Du darfst frei entscheiden, ob du die zuerst erscheinende Aufgabe bearbeiten willst oder auf die andere Aufgabe wartest, aber versuche so schnell und so genau wie möglich zu sein!<br><br>
//            Die Reaktionszeitmessung in jedem Durchgang beginnt, sobald die erste Aufgabe erscheint und endet sobald du eine der beiden Aufgaben bearbeitet hast!<br><br>
//            Drücke eine beliebige Taste um fortzufahren.`,
//     align: 'left',
//     fontsize: 30,
//     width: '1200px',
//     bold: true,
//     lineheight: 1.5,
//   }),
// };

// prettier-ignore
let RESPMAPPING;
if (VERSION === 1) { // left hand = colour, right hand = lettera
  RESPMAPPING = generate_formatted_html({
    text: `Farbaufgabe = Linke Hand: &emsp;&emsp;&emsp;&emsp;&emsp;&emsp; Buchstabeaufgabe = Rechte Hand:<br>
          More red = ${PRMS.colourTask[0]}, More blue = ${PRMS.colourTask[1]} &emsp;&emsp;&emsp; Normal = ${PRMS.letterTask[0]}, Mirrored = ${PRMS.letterTask[1]}`,
    align: 'center',
    fontsize: 30,
    width: '1200px',
    bold: true,
    lineheight: 2,
  });
} else if (VERSION === 2) { // left hand = colour, right hand = letter
  RESPMAPPING = generate_formatted_html({
    text: `Buchstabeaufgabe = Linke Hand: &emsp;&emsp;&emsp;&emsp;&emsp;&emsp; Farbaufgabe = Rechte Hand:<br>`,
    align: 'center',
    fontsize: 30,
    width: '1200px',
    bold: true,
    lineheight: 2,
  });
}

const TASK_INSTRUCTIONS1 = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: RESPMAPPING
};




function blockStartText() {
  'use strict';
  let blockStartTxt =
    '<H1>Block: ' +
    PRMS.cBlk +
    ' von ' +
    PRMS.nBlks +
    '</H1><br>' +
    "<h3 style='text-align: left;'>Entscheide selbst welche Aufgabe du bearbeiten willst.</h3>" +
    "<h3 style='text-align: center;'>Es gilt:</h3>" +
    "<h2 style='text-align: left;'>" +
    '&emsp;' +
    //PRMS.taskInstructions[0] +
    '&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;' +
    //PRMS.taskInstructions[1] +
    '&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;' +
    //PRMS.taskInstructions[2] +
    '&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;' +
    //PRMS.taskInstructions[3] +
    '</h2>' +
    "<h3 style='text-align: center;'>" +
    '("Q-Taste") &emsp;&emsp;&emsp;&emsp; ("W-Taste") &emsp;&emsp;&emsp;&emsp;&emsp; ("O-Taste") &emsp;&emsp;&emsp;&emsp; ("P-Taste")' +
    '</h3><br>' +
    "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>";
  return blockStartTxt;
}

const BLOCK_START = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: '',
  response_ends_trial: true,
  on_start: function (trial) {
    trial.stimulus = blockStartText();
  },
};

const FIXATION_CROSS = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: `<div style="font-size:${PRMS.fixSize}px;">+</div>`,
  response_ends_trial: false,
  trial_duration: PRMS.fixDur,
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
    trial.stimulus = 'placeholder';
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

function blockEndText() {
  'use strict';
  let blockEndTxt =
    '<h1>Pause</h1><br>' +
    "<h3 style='text-align: left;'>Du hast nun die Gelegenheit dich zu erholen. Wenn du wieder bereit</h3>" +
    "<h3 style='text-align: left;'>für den nächsten Block bist dann drücke eine beliebige Taste.</h3><br>";
  PRMS.cBlk += 1;
  return blockEndTxt;
}

const BLOCK_END = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: '',
  response_ends_trial: true,
  on_start: function (trial) {
    PRMS.cTrl = 1;
    trial.stimulus = blockEndText();
  },
};

function calculateNumberOfDots() {
  let nDots = 0
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
      nDots += 1;;
    }
  }
  return (nDots);
}

function drawStimulus(args) {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');

  ctx.font = PRMS.stimFont;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';

  // draw colour dors
  if (args.colour_more != 'na') {
    let radius = PRMS.dotRadius;
    let idx = 0;
    // let nDots = 0;
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

  ctx.fillStyle = 'black';

  // draw letter
  if (args.letter !== 'na') {
    ctx.save();
    if (args.letter_orientation === 'normal') {
      ctx.scale(1, 1);
      ctx.rotate((args.letter_angle * Math.PI) / 180);
    } else if (args.letter_orientation === 'mirrored') {
      ctx.scale(1, -1);
      ctx.rotate(((180 - args.letter_angle) * Math.PI) / 180);
    }
    ctx.fillText(args.letter, 0, 5);
    ctx.restore();
  }
}

const VTS = {
  type: jsPsychStaticCanvasKeyboardResponse,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  translate_origin: true,
  response_ends_trial: true,
  choices: PRMS.respKeys,
  trial_duration: PRMS.tooSlow,
  func: drawStimulus,
  func_args: null,
  data: {
    stim_type: 'vtstd',
    trial_type: jsPsych.timelineVariable('trial_type'),
    free_forced: jsPsych.timelineVariable('free_forced'),
    forced_task: jsPsych.timelineVariable('forced_task'),
    colour_diff: jsPsych.timelineVariable('colour_diff'),
    letter_diff: jsPsych.timelineVariable('letter_diff'),
  },
  on_start: function (trial) {
    'use strict';

    // letter task
    if (trial.data.letter_diff != 'na') {
      trial.data.letter = shuffle(PRMS.letters)[0];
      trial.data.letter_orientation = randomSelection(['normal', 'mirrored'], 1)[0];
      if (trial.data.letter_diff === 'easy') {
        trial.data.letter_angle = shuffle(PRMS.anglesEasy)[0];
      } else if (trial.data.letter_diff === 'difficult') {
        trial.data.letter_angle = shuffle(PRMS.anglesHard)[0];
      }
    } else {
      trial.data.letter = 'na';
      trial.data.letter_orientation = 'na';
      trial.data.letter_angle = 'na';
    }

    // colour task
    let ratio = 100;
    let colours = shuffle(PRMS.colours);
    if (trial.data.colour_diff === 'easy') {
      ratio = PRMS.ratioEasy;
      trial.data.colour_more = colours[0];
    } else if (trial.data.colour_diff === 'difficult') {
      ratio = PRMS.ratioHard;
      trial.data.colour_more = colours[0];
    } else if (trial.data.colour_diff === 'na') {
      trial.data.colour_more = 'na';
    }

    colours = shuffle(
      repeatArray([colours[0]], Math.round(PRMS.nDots * (ratio / 100))).concat(
        repeatArray([colours[1]], Math.round((PRMS.nDots * (100 - ratio)) / 100)),
      ),
    );

    trial.func_args = [
      {
        trial_type: jsPsych.timelineVariable('trial_type'),
        letter: trial.data.letter,
        letter_orientation: trial.data.letter_orientation,
        letter_diff: trial.data.letter_diff,
        letter_angle: trial.data.letter_angle,
        colour_more: trial.data.colour_more,
        colours: colours,
      },
    ];
  },
  on_finish: function () {
    codeTrial();
  },
};

function codeTrial() {
  'use strict';

  let dat = jsPsych.data.get().last(1).values()[0];

  jsPsych.data.addDataToLastTrial({
    date: Date(),
    blockNum: PRMS.cBlk,
    trialNum: PRMS.cTrl,
  });

  PRMS.cTrl += 1;
}

// // prettier-ignore
// const TRIAL_TABLE = [
//   { trial_type: 1, free_forced: 'free',   forced_task: 'na',     colour_diff: 'difficult', letter_diff: 'easy'},
//   { trial_type: 2, free_forced: 'free',   forced_task: 'na',     colour_diff: 'difficult', letter_diff: 'easy'},
//   { trial_type: 3, free_forced: 'free',   forced_task: 'na',     colour_diff: 'easy',      letter_diff: 'easy'},
//   { trial_type: 4, free_forced: 'free',   forced_task: 'na',     colour_diff: 'easy',      letter_diff: 'easy'},
//   { trial_type: 5, free_forced: 'forced', forced_task: 'letter', colour_diff: 'na',        letter_diff: 'easy'},
//   { trial_type: 6, free_forced: 'forced', forced_task: 'letter', colour_diff: 'na',        letter_diff: 'easy'},
//   { trial_type: 7, free_forced: 'forced', forced_task: 'colour', colour_diff: 'difficult', letter_diff: 'na'},
//   { trial_type: 8, free_forced: 'forced', forced_task: 'colour', colour_diff: 'easy',      letter_diff: 'na'},
// ];


// prettier-ignore
const TRIAL_TABLE = [
  { trial_type:  1, free_forced: 'free',   forced_task: 'na',     colour_diff: 'difficult', letter_diff: 'easy'},
  { trial_type:  2, free_forced: 'free',   forced_task: 'na',     colour_diff: 'difficult', letter_diff: 'easy'},
  { trial_type:  3, free_forced: 'free',   forced_task: 'na',     colour_diff: 'easy',      letter_diff: 'easy'},
  { trial_type:  4, free_forced: 'free',   forced_task: 'na',     colour_diff: 'easy',      letter_diff: 'easy'},
  // { trial_type:  5, free_forced: 'forced', forced_task: 'letter', colour_diff: 'na',        letter_diff: 'easy'},
  // { trial_type:  6, free_forced: 'forced', forced_task: 'letter', colour_diff: 'na',        letter_diff: 'easy'},
  // { trial_type:  7, free_forced: 'forced', forced_task: 'colour', colour_diff: 'difficult', letter_diff: 'na'},
  // { trial_type:  8, free_forced: 'forced', forced_task: 'colour', colour_diff: 'easy',      letter_diff: 'na'},
  { trial_type:  9, free_forced: 'free',   forced_task: 'na',     colour_diff: 'difficult', letter_diff: 'difficult'},
  { trial_type: 10, free_forced: 'free',   forced_task: 'na',     colour_diff: 'difficult', letter_diff: 'difficult'},
  { trial_type: 11, free_forced: 'free',   forced_task: 'na',     colour_diff: 'easy',      letter_diff: 'difficult'},
  { trial_type: 12, free_forced: 'free',   forced_task: 'na',     colour_diff: 'easy',      letter_diff: 'difficult'},
  //{ trial_type: 13, free_forced: 'forced', forced_task: 'letter', colour_diff: 'na',        letter_diff: 'difficult'},
  //{ trial_type: 14, free_forced: 'forced', forced_task: 'letter', colour_diff: 'na',        letter_diff: 'difficult'},
  //{ trial_type: 15, free_forced: 'forced', forced_task: 'colour', colour_diff: 'difficult', letter_diff: 'na'},
  //{ trial_type: 16, free_forced: 'forced', forced_task: 'colour', colour_diff: 'easy',      letter_diff: 'na'},
];


// prettier-ignore
const TRIAL_TIMELINE = {
    timeline: [FIXATION_CROSS, VTS, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIAL_TABLE
};

////////////////////////////////////////////////////////////////////////
//                              VP Stunden                            //
////////////////////////////////////////////////////////////////////////
const RANDOM_STRING = generateRandomString(16, 'vtstd1_');

const VP_CODE_INSTRUCTIONS2 = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  response_ends_trial: true,
  choices: [' '],
  stimulus: generate_formatted_html({
    text:
      `Vielen Dank für Ihre Teilnahme.<br><br>
       Wenn Sie Versuchspersonenstunden benötigen, kopieren Sie den folgenden
       zufällig generierten Code und senden Sie diesen zusammen mit Ihrer
       Matrikelnummer per Email mit dem Betreff 'Versuchpersonenstunde'
       an:<br><br>
       hiwipibio@gmail.com <br><br>
       Code: ` +
      RANDOM_STRING +
      `<br><br>Drücken Sie die Leertaste, um fortzufahren!`,
    align: 'left',
    fontsize: 30,
    width: '1200px',
    bold: true,
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
  saveData('/Common/write_data.php', data_fn, { stim: 'vtstd' });
  // saveDataLocal(data_fn, { stim: 'vts' });

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

  exp.push(WELCOME_INSTRUCTIONS);
  // exp.push(VP_CODE_INSTRUCTIONS1);
  exp.push(TASK_INSTRUCTIONS1);
  // exp.push(TASK_INSTRUCTIONS2);

  for (let blk = 0; blk < PRMS.nBlks; blk += 1) {
    let blk_timeline;
    blk_timeline = { ...TRIAL_TIMELINE };
    blk_timeline.sample = {
      type: 'fixed-repetitions',
      size: 1, //PRMS.nTrls / 8,
    };
    //exp.push(BLOCK_START);
    exp.push(blk_timeline); // trials within a block
    //exp.push(BLOCK_END);
  }

  // save data
  exp.push(SAVE_DATA);

  // debrief
  exp.push(mouseCursor(true));
  exp.push(VP_CODE_INSTRUCTIONS2);
  exp.push(end_message());
  exp.push(fullscreen(false));

  return exp;
}
const EXP = genExpSeq();

jsPsych.run(EXP);
