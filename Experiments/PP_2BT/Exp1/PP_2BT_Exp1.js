// Modified version of a Prioritized Processing task with two background tasks.
//
// Three tasks
// 1) Primary task: colour (e.g. red, green, blue). One of the three colours (randomly
// selected across participants) indicates that the background task is to be performed.
// The two colours assigned to the primary task are randomly assigned left/right keys.
// 2) Background task 1: letter (A, B, Y, Z)
// 3) Background task 2: number (1, 2, 8, 9)
// The letters (A, B) and numbers (1, 2) are assigned the left key, whilst the
// letters (Y, Z) and numbers (8, 9) are assigned the right key.
//
// Response keys: Index fingers on the Q and P keys
//
// Primary task probability 2/3
// Secondary task probability 1/3 (with 50% in each of the two background tasks)
//
// Basic Trial Structure
// Fixation Cross (500 ms)
// Primary Task stimulus (coloured square frame)
// SOA 50 ms between onset to primary and secondary task
// Secondary task (number/letter presented inside of square)
// Stimuli remain on screen until response or 3000 ms
// Trial Feedback (Correct, Incorrect, Too Slow) for 1s (Correct) or 3s (Incorrect/Too Slow)
//
// Experiment Structure
// Initial single task practice phase of 12 trials in each task
// Colour task
// (Letter -> Number) or (Number -> Letter)
// 6 blocks (3 in each HiPri/HiBac condition with order counter balanced across participants)
// 1st block in each probability condition (48 trials)
// 2nd + 3rd block in each probability condition (96 trials)

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const canvas_colour = 'rgba(200, 200, 200, 1)';
const canvas_size = [960, 720];
const canvas_border = '5px solid black';

const check_screen = {
  type: 'check-screen-resolution',
  width: canvas_size[0],
  height: canvas_size[1],
  timing_post_trial: 0,
  on_finish: function () {
    reload_if_not_fullscreen();
  },
};

////////////////////////////////////////////////////////////////////////
//                             Experiment                             //
////////////////////////////////////////////////////////////////////////
const expName = getFileName();
const dirName = getDirName();
const vpNum = genVpNum();
const nFiles = getNumberOfFiles('/Common/num_files.php', dirName + 'data/');
const nVersion = getVersionNumber(nFiles, 2);
jsPsych.data.addProperties({ version: nVersion });
getComputerInfo();

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
  // Block/Trial Numbers
  nTrls_training: 12, // number of trials in single task training blocks
  nBlks_training: 3, // 1 training block for each inddividual task
  nBlks_pp_p: 1, // single practice block in each PP probability block
  nTrls_pp_p: 48, // number of trials in practice PP block
  nBlks_pp_e: 3, // three experimental blocks in each PP probability blocks
  nTrls_pp_e: 96, // number of trials in experimental PP blocks
  nBlks_total: 11, // total number of training + experimental blocks

  // Timing
  soa: [50],
  iti: 500,
  too_slow: 3000,
  fb_duration: [500, 2000, 2000, 500, 2000], // Duration of feedback

  // Fixation Cross
  fix_duration: 500,
  fix_size: 15,
  fix_linewidth: 4,

  // Stimuli
  colours: shuffle(['red', 'green', 'blue']),
  rect_size: 100,
  rect_linewidth: 10,
  numbers: [1, 2, 8, 9],
  left_numbers: [1, 2],
  right_numbers: [8, 9],
  letters: ['A', 'B', 'Y', 'Z'],
  left_letters: ['A', 'B'],
  right_letters: ['Y', 'Z'],
  stim_size: 'bold 80px monospace',
  fb_size: '30px monospace',
  fb_text: ['Richtig', 'Falsch', 'Zu langsam', 'Richtig', 'Falsch'],

  // Response Keys
  resp_keys: ['q', 'p'],

  // Block/Trial Counters
  cTrl: 1,
  cBlk: 1,
};

// response keys for colour task
const de = { red: 'Rot', green: 'Grün', blue: 'Blau' };

// prettier-ignore
let resp_text_colours_training = `<span style="color: ${prms.colours[0]}"> ${de[prms.colours[0]]}</span> = linker Zeigefinger (Taste 'Q') <br> <span style="color: ${prms.colours[1]}">${de[prms.colours[1]]}</span> = rechter Zeigefinger (Taste 'P') <br> Regiere NICHT wenn die Farbe <span style="color: ${prms.colours[2]}"> ${de[prms.colours[2]]}</span> ist (d.h., keine Taste)!`;

// prettier-ignore
let resp_text_colours = `<span style="color: ${prms.colours[0]}">${de[prms.colours[0]]}</span> = linker Zeigefinger (Taste 'Q') <br> <span style="color: ${prms.colours[1]}">${de[prms.colours[1]]}</span> = rechter Zeigefinger (Taste 'P')`;

// response keys for letter task/number task
let resp_text_letters = `vor "M" = linker Zeigefinger (Taste 'Q') <br> nach "M" = rechter Zeigefinger (Taste 'P')`;
let resp_text_numbers = `kleiner 5 = linker Zeigefinger (Taste 'Q') <br> großer 5 = rechter Zeigefinger (Taste 'P')`;
// let resp_text_letters_numbers = `${prms.left_letters[0]}/${prms.left_letters[1]} oder ${prms.left_numbers[0]}/${prms.left_numbers[1]} = linker Zeigefinger (Taste 'Q') <br> ${prms.right_letters[0]}/${prms.right_letters[1]} oder ${prms.right_numbers[0]}/${prms.right_numbers[1]} = rechter Zeigefinger (Taste 'P')`;

// response keys for PP task
// prettier-ignore
let resp_text_pp = `1. Priorität: Farbaufgabe <br><br><span style="color: ${prms.colours[0]}">${ de[prms.colours[0]]}</span> = Taste 'Q' &emsp;&emsp; <span style="color: ${prms.colours[1]}">${ de[prms.colours[1]] }</span> = Taste 'P' <br><br>
                    2. Priorität (wenn Farbe <span style="color: ${prms.colours[2]}">${de[prms.colours[2]]}</span>): Buchstabe oder Farbaufgabe<br><br>
                   Buchstabe vor M &emsp;&emsp;&emsp;&emsp;&emsp;&emsp; Buchstabe nach M<br>
                   Zahl kleiner 5 &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; Zahl größer 5<br>
                   (Q-Taste) &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;(P-Taste) `;

//////////////////////////////////////////////////////////////////////////
////                      Experiment Instructions                       //
//////////////////////////////////////////////////////////////////////////
const task_instructions1 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: generate_formatted_html({
    text: `Willkommen bei unserem Experiment:<br><br>
    Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.
    Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und
    genügend Zeit hast, um das Experiment durchzuführen.
    Wir bitten dich die ca. 40 Minuten konzentriert zu arbeiten.<br><br>
    Drücke eine beliebige Taste, um fortzufahren!`,
    fontsize: 26,
    align: 'left',
  }),
};

const task_instructions2 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: generate_formatted_html({
    text: `Du erhaelst den Code für die Versuchspersonenstunden und weitere Anweisungen
    am Ende des Experimentes. Bei Fragen oder Problemen wende dich bitte an:<br><br>
    hiwipibio@gmail.com<br><br>
    Drücke eine beliebige Taste, um fortzufahren!`,
    fontsize: 26,
    align: 'left',
  }),
};

const task_instructions3 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: generate_formatted_html({
    text: `In diesem Experiment gibt es insgesamt drei verschiedene Aufgaben.
Du musst auf die Farben eines Quadrates (= Farbaufgabe), Buchstaben (= Buchstabenaufgabe) oder auf Zahlen <br>(= Zahlenaufgabe) reagieren. <br><br>
WICHTIG! Benutze hierfür die Q-Taste mit deinem linken Zeigefinger und die P-Taste mit dem rechten Zeigefinger.<br><br>
Zunächst hast du die Gelegenheit die einzelnen Aufgaben zu üben.<br><br>
Drücke eine beliebige Taste um fortzufahren.`,
    fontsize: 26,
    align: 'left',
  }),
};

const task_instructions_training_colour_task = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus:
    generate_formatted_html({
      text: `Aufgabe: Übungsblock Farbaufgabe<br><br>
    Bitte entscheide die Farbe des Quadrates.`,
      fontsize: 26,
      align: 'left',
    }) +
    generate_formatted_html({
      text: resp_text_colours_training,
      fontsize: 26,
      align: 'center',
    }) +
    generate_formatted_html({
      text: `Drücke eine beliebige Taste, um fortzufahren.`,
      fontsize: 26,
      align: 'left',
    }),
};

const task_instructions_training_letter_task = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus:
    generate_formatted_html({
      text: `Aufgabe: Übungsblock Buchstabenaufgabe <br><br>
    Bitte entscheide ob der Buchstabe vor oder nach “M” im Alphabet erscheint:`,
      fontsize: 26,
      align: 'left',
    }) +
    generate_formatted_html({
      text: resp_text_letters,
      fontsize: 26,
      align: 'center',
    }) +
    generate_formatted_html({
      text: `Drücke eine beliebige Taste, um fortzufahren.`,
      fontsize: 26,
      align: 'left',
    }),
};

const task_instructions_training_number_task = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus:
    generate_formatted_html({
      text: `Aufgabe: Übungsblock Zahlenaufgabe <br><br>
    Bitte entscheide ob die Zahl größer oder kleiner als 5 ist:`,
      fontsize: 26,
      align: 'left',
    }) +
    generate_formatted_html({
      text: resp_text_numbers,
      fontsize: 26,
      align: 'center',
    }) +
    generate_formatted_html({
      text: `Drücke eine beliebige Taste, um fortzufahren.`,
      fontsize: 26,
      align: 'left',
    }),
};

const task_instructions_pp1 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: generate_formatted_html({
    text: `ACHTUNG: NEUE INSTRUKTIONEN!!!<br><br>
           Nun werden dir in jedem Durchgang 2 Aufgaben präsentiert: Immer die Farbaufgabe mit entweder der Buchstaben- oder Zahlenaufgabe.<br>
           Du musst nur auf eine der zwei Aufgaben reagieren. <br>
           Die erste Priorität ist die Farbe des Quadrates.<br>
           Die zweite Priorität ist die Buchstaben- und Zahlenaufgabe. Du musst NUR auf den Buchstaben bzw. die Zahl reagieren, wenn die Farbaufgabe keine Antwort verlangt.<br><br>
           Drücke eine beliebige Taste, um fortzufahren!`,
    fontsize: 26,
    align: 'left',
  }),
};

const task_instructions_pp2 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus:
    generate_formatted_html({
      text: resp_text_pp,
      fontsize: 26,
      align: 'center',
    }) +
    generate_formatted_html({
      text: `Drücke eine beliebige Taste, um fortzufahren.`,
      fontsize: 26,
      align: 'center',
    }),
};

const task_instructions_pp_reminder = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus:
    generate_formatted_html({
      text: `Erste Priorität ist die Farbaufgabe:`,
      fontsize: 26,
      align: 'left',
    }) +
    generate_formatted_html({
      text: resp_text_colours,
      fontsize: 26,
      align: 'center',
    }) +
    generate_formatted_html({
      text: `Wenn die Farbe aber <span style ="color: ${prms.colours[2]}">${
        de[prms.colours[2]]
      }</span> ist, dann bearbeite die Buchstaben-oder Zahlenaufgabe:`,
      fontsize: 26,
      align: 'left',
    }) +
    generate_formatted_html({
      text: resp_text_pp,
      fontsize: 26,
      align: 'center',
    }) +
    generate_formatted_html({
      text: `Drücke eine beliebige Taste, um fortzufahren.`,
      fontsize: 26,
      align: 'left',
    }),
};

////////////////////////////////////////////////////////////////////////
//                  Common Stimuli/Functions                          //
////////////////////////////////////////////////////////////////////////
function draw_fixation_cross() {
  let ctx = document.getElementById('canvas').getContext('2d');
  ctx.lineWidth = prms.fix_linewidth;
  ctx.moveTo(-prms.fix_size, 0);
  ctx.lineTo(prms.fix_size, 0);
  ctx.stroke();
  ctx.moveTo(0, -prms.fix_size);
  ctx.lineTo(0, prms.fix_size);
  ctx.stroke();
}

const fixation_cross = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  trial_duration: prms.fix_duration,
  translate_origin: true,
  response_ends_trial: false,
  func: draw_fixation_cross,
};

const iti = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  trial_duration: prms.iti,
  response_ends_trial: false,
  func: function () {},
};

function code_trial() {
  'use strict';

  let dat = jsPsych.data.get().last(1).values()[0];
  let corrCode = 0;
  let offset = dat.response_task === 'primary' ? 0 : dat.soa;
  let rt = dat.rt !== null ? dat.rt - offset : prms.too_slow;

  if (dat.key_press !== null) {
    let correctKey = jsPsych.pluginAPI.compareKeys(dat.key_press, dat.corr_key);
    if (correctKey & (rt < prms.too_slow)) {
      corrCode = 1; // correct
    } else if (!correctKey & (rt < prms.too_slow)) {
      corrCode = 2; // choice-error
    }
  } else {
    corrCode = 3; // too-slow
  }

  // Special Case: no-oo type trials during colour training block
  if (dat.corr_key === 'no-go') {
    if (dat.key_press === null) {
      corrCode = 4;
    } else {
      corrCode = 5;
    }
  }

  jsPsych.data.addDataToLastTrial({
    date: Date(),
    rt: rt,
    corrCode: corrCode,
    blockNum: prms.cBlk,
    trialNum: prms.cTrl,
  });
  prms.cTrl += 1;
}

function block_feedback_text(filter_options) {
  'use strict';
  let dat = jsPsych.data.get().filter({ ...filter_options, blockNum: prms.cBlk });
  let nTotal = dat.count();
  let nError = dat.select('corrCode').values.filter(function (x) {
    return (x !== 1) & (x !== 4);
  }).length;
  dat = jsPsych.data.get().filter({ ...filter_options, blockNum: prms.cBlk, corrCode: 1 });

  let txt = `Block: ${prms.cBlk} von ${prms.nBlks_total} <br>
    Mittlere Reaktionzeit: ${Math.round(dat.select('rt').mean())} ms <br>
    Fehlerrate: ${Math.round((nError / nTotal) * 100)} % <br><br>
    Drücke eine beliebige Taste, um fortzufahren!`;

  let fb_txt = generate_formatted_html({ text: txt, fontsize: 30 });

  prms.cBlk += 1;
  prms.cTrl = 1;
  return fb_txt;
}

const block_feedback = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: '',
  response_ends_trial: true,
  on_start: function (trial) {
    trial.stimulus = block_feedback_text({ stim_type: 'pp2bt' });
  },
};

////////////////////////////////////////////////////////////////////////
//                  Training-Phase 3 Separate Tasks                   //
////////////////////////////////////////////////////////////////////////

// Coloured Frame
function draw_square_training(args) {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  ctx.beginPath();
  ctx.lineWidth = prms.rect_linewidth;
  ctx.strokeStyle = args.colour;
  ctx.rect(-prms.rect_size / 2, -prms.rect_size / 2, prms.rect_size, prms.rect_size);
  ctx.stroke();
}

// Letter/Number
function draw_letter_number_training(args) {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  ctx.font = prms.stim_size;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';
  ctx.fillText(args.letter_number, 0, 0);
}

const trial_feedback_training = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  translate_origin: true,
  response_ends_trial: false,
  func: draw_feedback_training,
  on_start: function (trial) {
    let dat = jsPsych.data.get().last(1).values()[0];
    trial.trial_duration = prms.fb_duration[dat.corrCode - 1];
  },
};

function draw_feedback_training() {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  let dat = jsPsych.data.get().last(1).values()[0];
  ctx.font = prms.fb_size;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';
  ctx.fillText(prms.fb_text[dat.corrCode - 1], 0, 0);
}

// prettier-ignore
const stimuli_training_colours = [
    { response_task: "primary", colour: prms.colours[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
    { response_task: "primary", colour: prms.colours[1], corr_key: prms.resp_keys[1], backward_comp: "na"},
    { response_task: "primary", colour: prms.colours[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
    { response_task: "primary", colour: prms.colours[1], corr_key: prms.resp_keys[1], backward_comp: "na"},
    { response_task: "primary", colour: prms.colours[2], corr_key: "no-go",           backward_comp: "na"},
    { response_task: "primary", colour: prms.colours[2], corr_key: "no-go",           backward_comp: "na"},
];

const trial_training_colours = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  translate_origin: true,
  response_ends_trial: true,
  choices: prms.resp_keys,
  trial_duration: prms.too_slow,
  func: draw_square_training,
  func_args: [{ colour: jsPsych.timelineVariable('colour') }],
  data: {
    stim_type: 'pp2bt',
    response_task: jsPsych.timelineVariable('response_task'),
    colour: jsPsych.timelineVariable('colour'),
    letter_number_group: 'na',
    letter_number: 'na',
    soa: 'na',
    blk_type: 'training',
    corr_key: jsPsych.timelineVariable('corr_key'),
    backward_comp: jsPsych.timelineVariable('backward_comp'),
    prob_cond: 'na',
  },
  on_finish: function () {
    code_trial();
  },
};

const trial_timeline_training_colours = {
  timeline: [fixation_cross, trial_training_colours, trial_feedback_training],
  timeline_variables: stimuli_training_colours,
  sample: {
    type: 'fixed-repetitions',
    size: prms.nTrls_training / stimuli_training_colours.length,
  },
};

// prettier-ignore
const stimuli_training_letters = [
    { response_task: "primary", letter_number: "left_letter",  corr_key: prms.resp_keys[0], backward_comp: "na" },
    { response_task: "primary", letter_number: "right_letter", corr_key: prms.resp_keys[1], backward_comp: "na" },
];

const trial_training_letters_numbers = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  translate_origin: true,
  response_ends_trial: true,
  choices: prms.resp_keys,
  trial_duration: prms.too_slow,
  func: draw_letter_number_training,
  func_args: null,
  data: {
    stim_type: 'pp2bt',
    response_task: jsPsych.timelineVariable('response_task'),
    colour: 'black',
    letter_number_group: jsPsych.timelineVariable('letter_number'),
    letter_number: null,
    soa: 'na',
    blk_type: 'training',
    corr_key: jsPsych.timelineVariable('corr_key'),
    backward_comp: jsPsych.timelineVariable('backward_comp'),
    prob_cond: 'na',
  },
  on_start: function (trial) {
    let letter_number;
    let randomInt = getRandomInt(0, 1);
    switch (trial.data.letter_number_group) {
      case 'left_letter':
        letter_number = prms.left_letters[randomInt];
        break;
      case 'left_number':
        letter_number = prms.left_numbers[randomInt];
        break;
      case 'right_letter':
        letter_number = prms.right_letters[randomInt];
        break;
      case 'right_number':
        letter_number = prms.right_numbers[randomInt];
        break;
    }
    trial.func_args = [{ colour: trial.data.colour, letter_number: letter_number }];
    trial.data.letter_number = letter_number;
  },
  on_finish: function () {
    code_trial();
  },
};

const trial_timeline_training_letters = {
  timeline: [fixation_cross, trial_training_letters_numbers, trial_feedback_training],
  timeline_variables: stimuli_training_letters,
  sample: {
    type: 'fixed-repetitions',
    size: prms.nTrls_training / stimuli_training_letters.length,
  },
};

// prettier-ignore
const stimuli_training_numbers = [
    { response_task: "primary", letter_number: "left_number",  corr_key: prms.resp_keys[0], backward_comp: "na" },
    { response_task: "primary", letter_number: "right_number", corr_key: prms.resp_keys[1], backward_comp: "na" },
];

const trial_timeline_training_numbers = {
  timeline: [fixation_cross, trial_training_letters_numbers, trial_feedback_training],
  timeline_variables: stimuli_training_numbers,
  sample: {
    type: 'fixed-repetitions',
    size: prms.nTrls_training / stimuli_training_numbers.length,
  },
};

////////////////////////////////////////////////////////////////////////
//                          Experiment Phase                          //
////////////////////////////////////////////////////////////////////////

// prettier-ignore
const stimuli_primary = [
        { response_task: 'primary', background_task: 'letter', colour: prms.colours[0], letter_number: "left_letter",  soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "comp"},
        { response_task: 'primary', background_task: 'letter', colour: prms.colours[1], letter_number: "left_letter",  soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "incomp"},
        { response_task: 'primary', background_task: 'letter', colour: prms.colours[0], letter_number: "right_letter", soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "incomp"},
        { response_task: 'primary', background_task: 'letter', colour: prms.colours[1], letter_number: "right_letter", soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "comp"},
        { response_task: 'primary', background_task: 'number', colour: prms.colours[0], letter_number: "left_number",  soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "comp"},
        { response_task: 'primary', background_task: 'number', colour: prms.colours[1], letter_number: "left_number",  soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "incomp"},
        { response_task: 'primary', background_task: 'number', colour: prms.colours[0], letter_number: "right_number", soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "incomp"},
        { response_task: 'primary', background_task: 'number', colour: prms.colours[1], letter_number: "right_number", soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "comp"},
];

// prettier-ignore
const stimuli_background = [
    { response_task: 'background', background_task: 'letter', colour: prms.colours[2], letter_number: "left_letter",  soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
    { response_task: 'background', background_task: 'letter', colour: prms.colours[2], letter_number: "right_letter", soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
    { response_task: 'background', background_task: 'number', colour: prms.colours[2], letter_number: "left_number",  soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
    { response_task: 'background', background_task: 'number', colour: prms.colours[2], letter_number: "right_number", soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
];

const stimuli_high_primary = stimuli_primary.concat(stimuli_background);
stimuli_high_primary.forEach((i) => (i.prob_cond = 'HP'));

const stimuli_low_primary = stimuli_primary.concat(repeatArray(stimuli_background, 4));
stimuli_high_primary.forEach((i) => (i.prob_cond = 'LP'));
// console.log(stimuli_low_primary);

function draw_pp(args) {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  // Square frame
  ctx.beginPath();
  ctx.lineWidth = prms.rect_linewidth;
  ctx.strokeStyle = args.colour;
  ctx.rect(-prms.rect_size / 2, -prms.rect_size / 2, prms.rect_size, prms.rect_size);
  ctx.stroke();

  // Letter/Number
  ctx.font = prms.stim_size;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';
  ctx.fillText(args.letter_number, 0, 5); // 5 pixel offset seems to work better?
}

function draw_feedback_pp() {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  let dat = jsPsych.data.get().last(1).values()[0];
  ctx.font = prms.fb_size;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';
  if (dat.corrCode == 1) {
    ctx.fillText(prms.fb_text[dat.corrCode - 1], 0, 0);
  } else {
    ctx.fillText(prms.fb_text[dat.corrCode - 1], 0, -150);
    ctx.fillText('1. Priorität: Farbaufgabe', 0, -80);
    ctx.fillStyle = prms.colours[0];
    ctx.fillText(de[prms.colours[0]], -290, -30);
    ctx.fillStyle = 'black';
    ctx.fillText(' = Taste "Q"', -150, -30);
    ctx.fillStyle = prms.colours[1];
    ctx.fillText(de[prms.colours[1]], 60, -30);
    ctx.fillStyle = 'black';
    ctx.fillText(' = Taste "P"', 200, -30);
    ctx.fillText('2. Priorität wenn Farbe', 0, 50);
    ctx.fillStyle = prms.colours[2];
    ctx.fillText(de[prms.colours[2]], 250, 50);
    ctx.fillStyle = 'black';
    ctx.fillText('Buchstabe vor M        Buchstabe nach M', 0, 100);
    ctx.fillText('Zahl kleiner 5         Zahl größer 5', 0, 140);
    ctx.fillText('(Q-Taste)              (P-Taste)', 0, 180);
  }
}

// TO DO: Do we need more detailed feedback for PP trials?
const trial_feedback_pp = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  translate_origin: true,
  response_ends_trial: false,
  func: draw_feedback_pp,
  on_start: function (trial) {
    let dat = jsPsych.data.get().last(1).values()[0];
    trial.trial_duration = prms.fb_duration[dat.corrCode - 1];
  },
};

const trial_pp = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  translate_origin: true,
  stimulus_onset: [0, jsPsych.timelineVariable('soa')],
  response_ends_trial: true,
  choices: prms.resp_keys,
  trial_duration: null,
  func: [draw_pp, draw_pp],
  func_args: null,
  data: {
    stim_type: 'pp2bt',
    response_task: jsPsych.timelineVariable('response_task'),
    colour: jsPsych.timelineVariable('colour'),
    letter_number_group: jsPsych.timelineVariable('letter_number'),
    letter_number: null,
    soa: jsPsych.timelineVariable('soa'),
    blk_type: 'experiment',
    corr_key: jsPsych.timelineVariable('corr_key'),
    backward_comp: jsPsych.timelineVariable('backward_comp'),
    prob_cond: jsPsych.timelineVariable('prob'),
  },
  on_start: function (trial) {
    let letter_number;
    let randomInt = getRandomInt(0, 1);
    switch (trial.data.letter_number_group) {
      case 'left_letter':
        letter_number = prms.left_letters[randomInt];
        break;
      case 'left_number':
        letter_number = prms.left_numbers[randomInt];
        break;
      case 'right_letter':
        letter_number = prms.right_letters[randomInt];
        break;
      case 'right_number':
        letter_number = prms.right_numbers[randomInt];
        break;
    }
    trial.func_args = [
      { colour: trial.data.colour, letter_number: '' },
      { colour: trial.data.colour, letter_number: letter_number },
    ];
    trial.data.letter_number = letter_number;
    trial.trial_duration = trial.data.response_task === 'primary' ? prms.too_slow : prms.too_slow + trial.data.soa;
  },
  on_finish: function () {
    code_trial();
  },
};

const trial_timeline_high_primary_practice = {
  timeline: [fixation_cross, trial_pp, trial_feedback_pp],
  timeline_variables: stimuli_high_primary,
  sample: {
    type: 'fixed-repetitions',
    size: prms.nTrls_pp_p / stimuli_high_primary.length,
  },
};
// console.log(trial_timeline_high_primary_practice);

const trial_timeline_low_primary_practice = {
  timeline: [fixation_cross, trial_pp, trial_feedback_pp],
  timeline_variables: stimuli_low_primary,
  sample: {
    type: 'fixed-repetitions',
    size: prms.nTrls_pp_p / stimuli_low_primary.length,
  },
};
// console.log(trial_timeline_low_primary_practice);

const trial_timeline_high_primary_exp = {
  timeline: [fixation_cross, trial_pp, trial_feedback_pp],
  timeline_variables: stimuli_high_primary,
  sample: {
    type: 'fixed-repetitions',
    size: prms.nTrls_pp_e / stimuli_high_primary.length,
  },
};
// console.log(trial_timeline_high_primary_exp);

const trial_timeline_low_primary_exp = {
  timeline: [fixation_cross, trial_pp, trial_feedback_pp],
  timeline_variables: stimuli_low_primary,
  sample: {
    type: 'fixed-repetitions',
    size: prms.nTrls_pp_e / stimuli_low_primary.length,
  },
};
// console.log(trial_timeline_low_primary_exp);

////////////////////////////////////////////////////////////////////////
//                              De-brief                              //
////////////////////////////////////////////////////////////////////////
// For VP Stunden
const randomString = generateRandomStringWithExpName('pp2bt1', 16);

const alpha_num = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus:
    generate_formatted_html({
      text: `Wenn du eine Versuchspersonenstunde benötigst, kopiere den folgenden
      zufällig generierten Code und sende diesen zusammen mit deiner Matrikelnummer
      und deiner Universität (Tübingen oder Greifswald) per Email an:<br><br>
    hiwipibio@gmail.com<br>`,
      fontsize: 26,
      align: 'left',
    }) +
    generate_formatted_html({
      text: `Code: ${randomString}<br>`,
      fontsize: 26,
      align: 'left',
    }) +
    generate_formatted_html({
      text: `Drücke die Leertaste, um fortzufahren!`,
      fontsize: 26,
      align: 'left',
    }),
};

////////////////////////////////////////////////////////////////////////
//                                Save                                //
////////////////////////////////////////////////////////////////////////
const save_data = {
  type: 'call-function',
  func: function () {
    let data_filename = dirName + 'data/' + expName + '_' + vpNum;
    saveData('/Common/write_data.php', data_filename, { stim_type: 'pp2bt' });
  },
  timing_post_trial: 1000,
};

const save_interaction_data = {
  type: 'call-function',
  func: function () {
    let data_filename = dirName + 'interaction/' + expName + '_interaction_data_' + vpNum;
    saveInteractionData('/Common/write_data.php', data_filename);
  },
  timing_post_trial: 200,
};

const save_code = {
  type: 'call-function',
  func: function () {
    let code_filename = dirName + 'code/' + expName;
    saveRandomCode('/Common/write_code.php', code_filename, randomString);
  },
  timing_post_trial: 200,
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
  'use strict';

  let exp = [];

  exp.push(fullscreen_on);
  exp.push(check_screen);
  exp.push(welcome);
  exp.push(resize);
  exp.push(vpInfoForm);
  exp.push(hideMouseCursor);
  exp.push(screenInfo);

  exp.push(task_instructions1);
  exp.push(task_instructions2);
  exp.push(task_instructions3);

  // Training Phase: 1 block of 12 trials for each task (colour/letter/number)
  // Always colour first, then random order of letter/number task
  exp.push(task_instructions_training_colour_task);
  exp.push(trial_timeline_training_colours);
  exp.push(block_feedback);

  if (Math.random < 0.5) {
    // letter task
    exp.push(task_instructions_training_letter_task);
    exp.push(trial_timeline_training_letters);
    exp.push(block_feedback);
    // number task
    exp.push(task_instructions_training_number_task);
    exp.push(trial_timeline_training_numbers);
    exp.push(block_feedback);
  } else {
    // number task
    exp.push(task_instructions_training_number_task);
    exp.push(trial_timeline_training_numbers);
    exp.push(block_feedback);
    // letter task
    exp.push(task_instructions_training_letter_task);
    exp.push(trial_timeline_training_letters);
    exp.push(block_feedback);
  }

  // In experiment phase, low vs. high probability is split across half with order counterbalanced across participants
  // The first block or trials in each probability level is a practice block with fewer trials
  exp.push(task_instructions_pp1);
  exp.push(task_instructions_pp2);

  let hplp_type;
  let pe_type = ['P'].concat(repeatArray('E', prms.nBlks_pp_e)).concat('P').concat(repeatArray('E', prms.nBlks_pp_e));
  if (nVersion == 1) {
    hplp_type = repeatArray('HP', prms.nBlks_pp_e + 1).concat(repeatArray('LP', prms.nBlks_pp_e + 1));
  } else if (nVersion == 2) {
    hplp_type = repeatArray('LP', prms.nBlks_pp_e + 1).concat(repeatArray('HP', prms.nBlks_pp_e + 1));
  }
  for (let blk = 0; blk < hplp_type.length; blk++) {
    if (hplp_type[blk] === 'HP') {
      if (pe_type[blk] === 'P') {
        exp.push(trial_timeline_high_primary_practice);
      } else if (pe_type[blk] === 'E') {
        exp.push(trial_timeline_high_primary_exp);
      }
    } else if (hplp_type[blk] === 'LP') {
      if (pe_type[blk] === 'P') {
        exp.push(trial_timeline_low_primary_practice);
      } else if (pe_type[blk] === 'E') {
        exp.push(trial_timeline_low_primary_exp);
      }
    }
    exp.push(block_feedback);
  }

  // save data
  exp.push(save_data);
  exp.push(save_interaction_data);
  exp.push(save_code);

  // debrief
  exp.push(alpha_num);
  exp.push(debrief);
  exp.push(showMouseCursor);
  exp.push(fullscreen_off);

  return exp;
}
const EXP = genExpSeq();

jsPsych.init({
  timeline: EXP,
  on_interaction_data_update: function (data) {
    update_user_interaction_data(data);
  },
});
