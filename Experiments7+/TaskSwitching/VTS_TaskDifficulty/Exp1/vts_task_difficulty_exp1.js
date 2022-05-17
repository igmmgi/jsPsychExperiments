// Voluntary Task Switching paradigm with two tasks
// Task 1: Surrounding colour grid (task: more red vs. more blue?)
// Task 2: Central letter (task: normal vs. mirrored?)
// Two levels of difficulty within each task
// Colour task difficulty manipulation: ratio (e.g., 90/10 vs. 60/40)
// Letter task difficulty manipulation: degree of rotation
//
// Block structure:
// 50% of trials are free choice with both task stimuli presented
// 50% of trials are forced choice (single stimulus) with 50% colour, 50% letter
// Of the 50% forced task choices, 50% should be easy, 50% hard
//
// Trial structure:
// Fixation cross
// Stimulus (until response or ?)
// Feedback
// ITI

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
  nTrls: 96, // number of trials per block
  nBlks: 8, // number of blocks
  fixSize: 50, // duration of the fixation cross
  fixDur: 500, // duration of the fixation cross
  fbDur: [0, 3000], // feedback duration for correct and incorrect trials, respectively
  fbText: ['', 'Falsch!'],
  iti: 500, // duration of the inter-trial-interval
  stimFont: '200px Arial',
  fbFont: '200px Arial',
  letters: ['F', 'G', 'L', 'P', 'R'],
  anglesEasy: [-10, 10],
  anglesNormal: [-10, 10],
  anglesHard: [-120, 120],
  colours: ['rgba(0, 0, 255, 0.65)', 'rgba(255, 0, 0, 0.65)'],
  ratioEasy: 80,
  ratioNormal: 70,
  ratioHard: 60,
  respKeysLH: ['Q', 'W'],
  respKeysRH: ['O', 'P'],
  deactivateKeys: false, // should keys be deactivated when task not available?
  dotRadius: 10,
  dotEccentricity: 200,
  dotGaps: 30,
  dotBlank: 4,
  cBlk: 1,
  cTrl: 1,
};

// 2 counter balanced versions
const VERSION = 2; // Number(jsPsych.data.urlVariables().version);
jsPsych.data.addProperties({ version: VERSION });

// // Version 1: Colour task = left hand,  Letter task = right hand
// // Version 2: Colour task = right hand, Letter task = left hand
// if ([1, 3].includes(VERSION)) {
//   PRMS.colourTaskKeys = shuffle(PRMS.respKeysLH); // e.g., more red vs. more blue
//   PRMS.letterTaskKeys = shuffle(PRMS.respKeysRH); // e.g., normal vs. mirrored
// } else if ([2, 4].includes(VERSION)) {
//   PRMS.colourTaskKeys = shuffle(PRMS.respKeysRH); // e.g., more red vs. more blue
//   PRMS.letterTaskKeys = shuffle(PRMS.respKeysLH); // e.g., normal vs. mirrored
// }


// Version 1: Colour task = left hand,  Letter task = right hand
// Version 2: Colour task = right hand, Letter task = left hand
if ([1, 3].includes(VERSION)) {
  PRMS.colourTaskKeys = shuffle(PRMS.respKeysLH); // e.g., more red vs. more blue
  PRMS.letterTaskKeys = shuffle(PRMS.respKeysRH); // e.g., normal vs. mirrored
} else if ([2, 4].includes(VERSION)) {
  PRMS.colourTaskKeys = shuffle(PRMS.respKeysRH); // e.g., more red vs. more blue
  PRMS.letterTaskKeys = shuffle(PRMS.respKeysLH); // e.g., normal vs. mirrored
}

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
           hiwipibio@gmail.com <br><br>
           Drücke eine beliebige Taste, um fortzufahren`,
    align: 'left',
    fontsize: 30,
    width: '1200px',
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
    lineheight: 1.5,
  }),
};

function task_instructions1() {
  if (VERSION === 1) {
    return generate_formatted_html({
      text: `In diesem Experiment gibt es zwei Aufgaben. Jede Aufgabe wird mit einer Hand bearbeitet.<br><br>
             Farben Aufgabe = Linke Hand: Bitte platziere hierzu den Zeigefinger und Mittelfinger auf die Tasten „Q“ und „W“.<br><br>
             Buchstaben Aufgabe = Rechte Hand: Bitte platziere hierzu den Zeigefinger und Mittelfinger auf die Tasten „O“ und „P“.<br><br>
             Drücke eine beliebige Taste, um fortzufahren!`,
      align: 'left',
      fontsize: 30,
      width: '1200px',
      lineheight: 1.5,
    });
  } else if (VERSION === 2) {
    return generate_formatted_html({
      text: `In diesem Experiment gibt es zwei Aufgaben. Jede Aufgabe wird mit einer Hand bearbeitet.<br><br>
             Buchstaben Aufgabe = Linke Hand: Bitte platziere hierzu den Zeigefinger und Mittelfinger auf die Tasten „Q“ und „W“.<br><br>
             Farben Aufgabe = Rechte Hand: Bitte platziere hierzu den Zeigefinger und Mittelfinger auf die Tasten „O“ und „P“.<br><br>
             Drücke eine beliebige Taste, um fortzufahren!`,
      align: 'left',
      fontsize: 30,
      width: '1200px',
      lineheight: 1.5,
    });
  }
}

const TASK_INSTRUCTIONS_TEXT = task_instructions1();

const TASK_INSTRUCTIONS1 = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: TASK_INSTRUCTIONS_TEXT,
};

let RESPMAPPING;
if (VERSION === 1) {
  // left hand = colour, right hand = lettera
  RESPMAPPING = generate_formatted_html({
    text: `Farbaufgabe = Linke Hand &emsp;&emsp;&emsp;&emsp;&emsp;&emsp; Buchstabeaufgabe = Rechte Hand<br>
           More blue = ${PRMS.colourTaskKeys[0]}, More red = ${PRMS.colourTaskKeys[1]} &emsp;&emsp;&emsp; Normal = ${PRMS.letterTaskKeys[0]}, Mirrored = ${PRMS.letterTaskKeys[1]}`,
    align: 'center',
    fontsize: 30,
    width: '1200px',
    bold: true,
    lineheight: 1.5,
  });
} else if (VERSION === 2) {
  // left hand = letter, right hand = colour
  RESPMAPPING = generate_formatted_html({
    text: `Buchstabeaufgabe = Linke Hand&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; Farbaufgabe = Rechte Hand<br>
           Normal &emsp;&emsp; Gespiegelt  &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;    Mehr Blau &emsp;&emsp; Mehr Rot <br>
           ${PRMS.letterTaskKeys[0]} &emsp;&emsp;&emsp;${PRMS.letterTaskKeys[1]} &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; ${PRMS.colourTaskKeys[0]}  &emsp;&emsp;&emsp;${PRMS.colourTaskKeys[1]}`,
    align: 'center',
    fontsize: 30,
    width: '1200px',
    bold: true,
    lineheight: 1.5,
  });
}

const TASK_INSTRUCTIONS2 = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus:
    generate_formatted_html({
      text: `Für die Buchstaben Aufgabe musst du entscheiden, ob der Buchstabe normal ist oder gespiegelt (Beispiel: R wäre normal und Я gespiegelt).<br><br>
           Für die Farben Aufgabe musst du entscheiden, ob die Mehrheit der Kreise Blau oder Rot ist. Es gilt:`,
      align: 'left',
      fontsize: 30,
      width: '1200px',
      bold: false,
      lineheight: 1.5,
    }) + RESPMAPPING,
};

const TASK_INSTRUCTIONS3 = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: generate_formatted_html({
    text: `In jedem Durchgang muss nur eine Aufgabe bearbeitet werden.<br><br>
           Du darfst frei entscheiden welche der beiden Aufgaben du bearbeiten möchtest, wenn beide Aufgaben (Buchstabe und farbige Punkte) präsentiert werden.<br><br>
           Wenn jedoch nur ein Aufgabe präsentiert wird, dann musst du diese Aufgabe bearbeiten.<br><br> 
           Drücke eine beliebige Taste um fortzufahren.`,
    align: 'left',
    fontsize: 30,
    width: '1200px',
    bold: false,
    lineheight: 1.5,
  }),
};

const BLOCK_START = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: '',
  on_start: function (trial) {
    trial.stimulus =
      generate_formatted_html({
        text: `Start Block ${PRMS.cBlk} von ${PRMS.nBlks}<br><br>
             Entscheide selbst welche Aufgabe du bearbeiten willst, wenn beide Aufgaben verfügbar sind und bearbeite sonst die Aufgabe welche präsentiert ist. Es gilt:`,
        align: 'left',
        fontsize: 30,
        width: '1200px',
        bold: false,
        lineheight: 1.5,
      }) +
      RESPMAPPING +
      generate_formatted_html({
        text: `Um den Block zu starten, drücke eine beliebige Taste.`,
        align: 'center',
        fontsize: 30,
        width: '1200px',
        bold: false,
        lineheight: 1.5,
      });
  },
};

const BLOCK_END = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: '',
  on_start: function (trial) {
    trial.stimulus = generate_formatted_html({
      text: `Ende Block ${PRMS.cBlk} von ${PRMS.nBlks}<br><br>
             Kurze Pause.<br><br>
             Wenn du bereit für den nächsten Block bist, dann drücke eine beliebige Taste.`,
      align: 'left',
      fontsize: 30,
      width: '1200px',
      bold: false,
      lineheight: 1.5,
    });
  },
};

const TASK_INSTRUCTIONS_RESPMAPPING = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: RESPMAPPING,
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
          bold: false,
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

function drawStimulus(args) {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');

  // draw colour dors
  let radius = PRMS.dotRadius;
  let idx = 0;
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

  // draw letter
  ctx.font = PRMS.stimFont;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';
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

const VTS = {
  type: jsPsychStaticCanvasKeyboardResponse,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  translate_origin: true,
  response_ends_trial: true,
  choices: null, // PRMS.respKeysLH.concat(PRMS.respKeysRH),
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
    trial.data.letter = '';
    trial.data.letter_orientation = 'na';
    trial.data.letter_angle = 'na';
    trial.data.corr_resp_letter = 'na';

    if (trial.data.letter_diff != 'na') {
      trial.data.letter = shuffle(PRMS.letters)[0];
      trial.data.letter_orientation = shuffle(['normal', 'mirrored'])[0];
      if (trial.data.letter_diff === 'easy') {
        trial.data.letter_angle = shuffle(PRMS.anglesEasy)[0];
      } else if (trial.data.letter_diff === 'normal') {
        trial.data.letter_angle = shuffle(PRMS.anglesNormal)[0];
      } else if (trial.data.letter_diff === 'difficult') {
        trial.data.letter_angle = shuffle(PRMS.anglesHard)[0];
      }

      // code correct letter response key
      if (trial.data.letter_orientation === 'normal') {
        trial.data.corr_resp_letter = PRMS.letterTaskKeys[0];
      } else if (trial.data.letter_orientation === 'mirrored') {
        trial.data.corr_resp_letter = PRMS.letterTaskKeys[1];
      }
    }

    // colour task
    trial.data.colour_more = 'na';
    trial.data.corr_resp_colour = 'na';
    let dot_colours = repeatArray(CANVAS_COLOUR, Math.round(PRMS.nDots));
    if (trial.data.colour_diff !== 'na') {
      // let ratio = trial.data.colour_diff === 'easy' ? PRMS.ratioEasy : PRMS.ratioHard;
      let ratio;
      if (trial.data.colour_diff === 'easy') {
        ratio = PRMS.ratioEasy;
      } else if (trial.data.colour_diff === 'normal') {
        ratio = PRMS.ratioNormal;
      } else if (trial.data.colour_diff === 'difficult') {
        ratio = PRMS.ratioDifficult;
      }

      let colours = shuffle([0, 1]);
      trial.data.colour_more = PRMS.colours[colours[0]];
      dot_colours = shuffle(
        repeatArray([PRMS.colours[colours[0]]], Math.round(PRMS.nDots * (ratio / 100))).concat(
          repeatArray([PRMS.colours[colours[1]]], Math.round((PRMS.nDots * (100 - ratio)) / 100)),
        ),
      );

      // code letter response
      if (trial.data.colour_more === PRMS.colours[0]) {
        trial.data.corr_resp_colour = PRMS.colourTaskKeys[0];
      } else if (trial.data.colour_more === PRMS.colours[1]) {
        trial.data.corr_resp_colour = PRMS.colourTaskKeys[1];
      }
    }

    // activate response keys
    if (PRMS.deactivateKeys) {
      // only available task keys activated
      if ((trial.data.letter !== '') & (trial.data.colour_more !== 'na')) {
        trial.choices = PRMS.letterTaskKeys.concat(PRMS.colourTaskKeys);
      } else if ((trial.data.letter !== '') & (trial.data.colour_more === 'na')) {
        trial.choices = PRMS.letterTaskKeys;
      } else if ((trial.data.letter === '') & (trial.data.colour_more !== 'na')) {
        trial.choices = PRMS.colourTaskKeys;
      }
    } else {
      trial.choices = PRMS.letterTaskKeys.concat(PRMS.colourTaskKeys);
    }

    trial.func_args = [
      {
        trial_type: jsPsych.timelineVariable('trial_type'),
        letter: trial.data.letter,
        letter_orientation: trial.data.letter_orientation,
        letter_diff: trial.data.letter_diff,
        letter_angle: trial.data.letter_angle,
        colour_more: trial.data.colour_more,
        colours: dot_colours,
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

  // which task did they perform?
  let respondedLetter = PRMS.letterTaskKeys.includes(dat.key_press.toUpperCase());
  let respondedColour = PRMS.colourTaskKeys.includes(dat.key_press.toUpperCase());

  let error = 0;
  if (respondedLetter & (dat.key_press.toUpperCase() !== dat.corr_resp_letter)) {
    error = 1;
  } else if (respondedColour & (dat.key_press.toUpperCase() !== dat.corr_resp_colour)) {
    error = 1;
  }

  jsPsych.data.addDataToLastTrial({
    date: Date(),
    respondedLetter: respondedLetter,
    respondedColour: respondedColour,
    error: error,
    blockNum: PRMS.cBlk,
    trialNum: PRMS.cTrl,
  });

  PRMS.cTrl += 1;
}

// const BLOCK_FEEDBACK = {
//   type: jsPsychHtmlKeyboardResponseCanvas,
//   canvas_colour: CANVAS_COLOUR,
//   canvas_size: CANVAS_SIZE,
//   canvas_border: CANVAS_BORDER,
//   stimulus: '',
//   response_ends_trial: true,
//   on_start: function (trial) {
//     let block_dvs_forced_letter_easy = calculateBlockPerformance({
//       filter_options: {
//         stim_type: 'vtstd',
//         blockNum: PRMS.cBlk,
//         respondedLetter: true,
//         free_forced: 'forced',
//         letter_diff: 'easy',
//       },
//       corrColumn: 'error',
//       corrValue: 0,
//     });
//
//     let block_dvs_forced_letter_hard = calculateBlockPerformance({
//       filter_options: {
//         stim_type: 'vtstd',
//         blockNum: PRMS.cBlk,
//         respondedLetter: true,
//         free_forced: 'forced',
//         letter_diff: 'difficult',
//       },
//       corrColumn: 'error',
//       corrValue: 0,
//     });
//
//     let block_dvs_forced_colour_easy = calculateBlockPerformance({
//       filter_options: {
//         stim_type: 'vtstd',
//         blockNum: PRMS.cBlk,
//         respondedColour: true,
//         free_forced: 'forced',
//         colour_diff: 'easy',
//       },
//       corrColumn: 'error',
//       corrValue: 0,
//     });
//
//     let block_dvs_forced_colour_hard = calculateBlockPerformance({
//       filter_options: {
//         stim_type: 'vtstd',
//         blockNum: PRMS.cBlk,
//         respondedColour: true,
//         free_forced: 'forced',
//         colour_diff: 'difficult',
//       },
//       corrColumn: 'error',
//       corrValue: 0,
//     });
//
//     let fbText = `Block ${PRMS.cBlk}<br>
//     Letter easy: ${block_dvs_forced_letter_easy.meanRt} ms / ${block_dvs_forced_letter_easy.errorRate} %<br>
//     Letter hard: ${block_dvs_forced_letter_hard.meanRt} ms / ${block_dvs_forced_letter_hard.errorRate} %<br>
//     Colour easy: ${block_dvs_forced_colour_easy.meanRt} ms / ${block_dvs_forced_colour_easy.errorRate} %<br>
//     Colour hard: ${block_dvs_forced_colour_hard.meanRt} ms / ${block_dvs_forced_colour_hard.errorRate} %<br>`;
//
//     trial.stimulus = `<div style="font-size:${PRMS.fbTxtSizeBlock}px;">${fbText}</div>`;
//   },
//   on_finish: function () {
//     PRMS.cTrl = 1;
//     PRMS.cBlk += 1;
//   },
// };

function trial_table() {
  if ([1, 3].includes(VERSION)) {
    return [
      { trial_type: 1, free_forced: 'free', forced_task: 'na', colour_diff: 'difficult', letter_diff: 'normal' },
      { trial_type: 2, free_forced: 'free', forced_task: 'na', colour_diff: 'difficult', letter_diff: 'normal' },
      { trial_type: 3, free_forced: 'free', forced_task: 'na', colour_diff: 'easy', letter_diff: 'normal' },
      { trial_type: 4, free_forced: 'free', forced_task: 'na', colour_diff: 'easy', letter_diff: 'normal' },
      { trial_type: 5, free_forced: 'forced', forced_task: 'letter', colour_diff: 'na', letter_diff: 'normal' },
      { trial_type: 6, free_forced: 'forced', forced_task: 'letter', colour_diff: 'na', letter_diff: 'normal' },
      { trial_type: 7, free_forced: 'forced', forced_task: 'colour', colour_diff: 'difficult', letter_diff: 'na' },
      { trial_type: 8, free_forced: 'forced', forced_task: 'colour', colour_diff: 'easy', letter_diff: 'na' },
    ];
  } else if ([2, 4].includes(VERSION)) {
    return [
      { trial_type: 1, free_forced: 'free', forced_task: 'na', colour_diff: 'normal', letter_diff: 'difficult' },
      { trial_type: 2, free_forced: 'free', forced_task: 'na', colour_diff: 'normal', letter_diff: 'difficult' },
      { trial_type: 3, free_forced: 'free', forced_task: 'na', colour_diff: 'normal', letter_diff: 'easy' },
      { trial_type: 4, free_forced: 'free', forced_task: 'na', colour_diff: 'normal', letter_diff: 'easy' },
      { trial_type: 5, free_forced: 'forced', forced_task: 'letter', colour_diff: 'normal', letter_diff: 'na' },
      { trial_type: 6, free_forced: 'forced', forced_task: 'letter', colour_diff: 'normal', letter_diff: 'na' },
      { trial_type: 7, free_forced: 'forced', forced_task: 'colour', colour_diff: 'na', letter_diff: 'difficult' },
      { trial_type: 8, free_forced: 'forced', forced_task: 'colour', colour_diff: 'na', letter_diff: 'easy' },
    ];
  }
}

const TRIAL_TABLE = trial_table();

// prettier-ignore
// const TRIAL_TABLE_COLOUR_MANIPULATION =

// // prettier-ignore
// const TRIAL_TABLE_LETTER_MANIPULATION = [
//   { trial_type:  1, free_forced: 'free',   forced_task: 'na',     colour_diff: 'easy', letter_diff: 'difficult'},
//   { trial_type:  2, free_forced: 'free',   forced_task: 'na',     colour_diff: 'easy', letter_diff: 'difficult'},
//   { trial_type:  3, free_forced: 'free',   forced_task: 'na',     colour_diff: 'easy', letter_diff: 'easy'},
//   { trial_type:  4, free_forced: 'free',   forced_task: 'na',     colour_diff: 'easy', letter_diff: 'easy'},
//   { trial_type:  5, free_forced: 'forced', forced_task: 'letter', colour_diff: 'easy', letter_diff: 'na'},
//   { trial_type:  6, free_forced: 'forced', forced_task: 'letter', colour_diff: 'easy', letter_diff: 'na'},
//   { trial_type:  7, free_forced: 'forced', forced_task: 'colour', colour_diff: 'na',   letter_diff: 'difficult'},
//   { trial_type:  8, free_forced: 'forced', forced_task: 'colour', colour_diff: 'na',   letter_diff: 'easy'},
// ];

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
       Matrikelnummer per Email mit dem Betreff 'Versuchpersonenstunde'
       an:<br><br>
       Experiment.TaskSwitching@gmail.com<br><br>
       Code: ` +
      RANDOM_STRING +
      `<br><br>Drücke die Leertaste, um fortzufahren!`,
    align: 'left',
    fontsize: 30,
    width: '1200px',
    bold: false,
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
  // saveDataLocal(data_fn, { stim: 'vtstd' });

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
  // exp.push(VP_CODE_INSTRUCTIONS1);
  // exp.push(TASK_INSTRUCTIONS1);
  exp.push(TASK_INSTRUCTIONS2);
  exp.push(TASK_INSTRUCTIONS3);
  // exp.push(TASK_INSTRUCTIONS2);

  for (let blk = 0; blk < PRMS.nBlks; blk += 1) {
    exp.push(BLOCK_START);
    let blk_timeline;
    blk_timeline = { ...TRIAL_TIMELINE };
    blk_timeline.sample = {
      type: 'fixed-repetitions',
      size: PRMS.nTrls / TRIAL_TABLE.length,
    };
    exp.push(blk_timeline); // trials within a block
    exp.push(BLOCK_END);
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
