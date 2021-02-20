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
// SOA (50 vs. 200 ms)
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
getComputerInfo();

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
  // Block/Trial Numbers
  nTrls_training: 12, // number of trials in single task training blocks
  nBlks_training: 3, // 1 training block for each inddividual task
  nBlks_pp_p: 1, // single practice block in each PP probability block
  nTrls_pp_p: 96, // number of trials in practice PP block
  nBlks_pp_e: 2, // two experimental blocks in each PP probability blocks
  nTrls_pp_e: 96, // number of trials in experimental PP blocks
  nBlks_total: 9, // total number of training + experimental blocks

  // Timing
  soa: [50, 200],
  iti: 500,
  too_slow: 3000,
  fb_duration: [500, 1000, 1000], // Duration of feedback

  // Fixation Cross
  fix_duration: 500,
  fix_size: 15,
  fix_linewidth: 4,

  // Stimuli
  colours: shuffle(['red', 'green', 'blue']),
  rect_size: 100,
  rect_linewidth: 10,
  numbers: [1, 2, 8, 9],
  letters: ['A', 'B', 'Y', 'Z'],
  stim_size: '60px monospace',
  fb_size: '40px monospace',
  fb_training: ['Richtig', 'Falsch', 'Zu langsam'], // trial feedback show during training

  // Response KEys
  resp_keys: ['Q', 'P', 27],

  // Block/Trial Counters
  cTrl: 1,
  cBlk: 1,
};

// response keys for colour task
const de = { red: 'Rot', green: 'Grün', blue: 'Blau' };
// prettier-ignore
let resp_text_colours = `${de[prms.colours[0]]} = linker Zeigefinger (Taste 'Q') <br> ${de[prms.colours[1]]} = rechter Zeigefinger (Taste 'P')`;

// response keys for letter task/number task and combined
let resp_text_letters = `${prms.letters[0]} oder ${prms.letters[1]} = linker Zeigefinger (Taste 'Q') <br> ${prms.letters[2]} oder ${prms.letters[3]} = rechter Zeigefinger (Taste 'P')`;
let resp_text_numbers = `${prms.numbers[0]} oder ${prms.numbers[1]} = linker Zeigefinger (Taste 'Q') <br> ${prms.numbers[2]} oder ${prms.numbers[3]} = rechter Zeigefinger (Taste 'P')`;
let resp_text_letters_numbers = `${prms.letters[0]}/${prms.letters[1]} oder ${prms.numbers[0]}/${prms.numbers[1]} = linker Zeigefinger (Taste 'Q') <br> ${prms.letters[2]}/${prms.letters[3]} oder ${prms.numbers[2]}/${prms.numbers[3]} = rechter Zeigefinger (Taste 'P')`;

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
    fontsize: 30,
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
    fontsize: 30,
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
      text: `Aufgabe:<br><br>
    In diesem Experiment Teil musst du auf verschiedene farbe
    so schnell und so genau wie möglich reagieren.
    Die Farben erscheint in der Mitte des Bildschirms.
    Reagiere auf diesen Farben wie folgt:</h3><br>`,
      fontsize: 30,
      align: 'left',
    }) +
    generate_formatted_html({
      text: resp_text_colours,
      fontsize: 30,
      align: 'center',
    }) +
    generate_formatted_html({
      text: `Drücke eine beliebige Taste, um fortzufahren.`,
      fontsize: 30,
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
      text: `Aufgabe:<br><br>
    In diesem Experiment Teil musst du auf verschiedene Buchstaben
    so schnell und so genau wie möglich reagieren.
    Die Buchstaben erscheint in der Mitte des Bildschirms.
    Reagiere auf diesen Farben wie folgt:</h3><br>`,
      fontsize: 30,
      align: 'left',
    }) +
    generate_formatted_html({
      text: resp_text_letters,
      fontsize: 30,
      align: 'center',
    }) +
    generate_formatted_html({
      text: `Drücke eine beliebige Taste, um fortzufahren.`,
      fontsize: 30,
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
      text: `Aufgabe:<br><br>
    In diesem Experiment Teil musst du auf verschiedene Nummer
    so schnell und so genau wie möglich reagieren.
    Die Nummer erscheint in der Mitte des Bildschirms.
    Reagiere auf diesen Farben wie folgt:</h3><br>`,
      fontsize: 30,
      align: 'left',
    }) +
    generate_formatted_html({
      text: resp_text_numbers,
      fontsize: 30,
      align: 'center',
    }) +
    generate_formatted_html({
      text: `Drücke eine beliebige Taste, um fortzufahren.`,
      fontsize: 30,
      align: 'left',
    }),
};

const task_instructions_pp = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus:
    generate_formatted_html({
      text: `In diesem Experimentteil, die erste Priorität ist auf den Farben weiterhin wie folgt zu reagieren:`,
      fontsize: 30,
      align: 'left',
    }) +
    generate_formatted_html({
      text: resp_text_colours,
      fontsize: 30,
      align: 'center',
    }) +
    generate_formatted_html({
      text: `Wenn der Farbe aber ${
        de[prms.colours[2]]
      } ist, dann reagiere auf die Buchstaben oder Nummern (zweite Priorität) wie folgt:`,
      fontsize: 30,
      align: 'left',
    }) +
    generate_formatted_html({
      text: resp_text_letters_numbers,
      fontsize: 30,
      align: 'center',
    }) +
    generate_formatted_html({
      text: `Drücke eine beliebige Taste, um fortzufahren.`,
      fontsize: 30,
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
  let corrKeyNum = jsPsych.pluginAPI.convertKeyCharacterToKeyCode(dat.corr_key);
  let rt = dat.rt !== null ? dat.rt : prms.tooSlow;
  if (dat.key_press === corrKeyNum && rt < prms.too_slow) {
    corrCode = 1; // correct
  } else if (dat.key_press !== corrKeyNum && rt < prms.too_slow) {
    corrCode = 2; // choice error
  } else if (rt >= prms.too_slow) {
    corrCode = 3; // too slow
  }

  jsPsych.data.addDataToLastTrial({
    date: Date(),
    keyPress: dat.key_press,
    rt: rt,
    corrCode: corrCode,
    blockNum: prms.cBlk,
    trialNum: prms.cTrl,
  });
  prms.cTrl += 1;
  if (dat.key_press === 27) {
    jsPsych.endExperiment();
  }
}

function block_feedback_text(filter_options) {
  'use strict';
  let dat = jsPsych.data.get().filter({ ...filter_options, blockNum: prms.cBlk });
  let nTotal = dat.count();
  let nError = dat.select('corrCode').values.filter(function (x) {
    return x !== 1;
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
    trial.stimulus = block_feedback_text({ stim: 'pp2bt' });
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
  ctx.fillText(prms.fb_training[dat.corrCode - 1], 0, 0);
}

// prettier-ignore
const stimuli_training_colours = [
    { colour: prms.colours[0], corr_key: prms.resp_keys[0] },
    { colour: prms.colours[1], corr_key: prms.resp_keys[1] },
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
    stim: 'pp2bt',
    colour: jsPsych.timelineVariable('colour'),
    letter_number: 'na',
    soa: 'na',
    task: 'training_colour',
    blk_type: 'training',
    corr_key: jsPsych.timelineVariable('corr_key'),
  },
  on_finish: function () {
    code_trial();
  },
};

const trial_timeline_training_colours = {
  timeline: [fixation_cross, trial_training_colours, trial_feedback_training, iti],
  timeline_variables: stimuli_training_colours,
  sample: {
    type: 'fixed-repetitions',
    size: prms.nTrls_training / stimuli_training_colours.length,
  },
};

// prettier-ignore
const stimuli_training_letters = [
    { letter_number: prms.letters[0], corr_key: prms.resp_keys[0] },
    { letter_number: prms.letters[1], corr_key: prms.resp_keys[0] },
    { letter_number: prms.letters[2], corr_key: prms.resp_keys[1] },
    { letter_number: prms.letters[3], corr_key: prms.resp_keys[1] },
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
  func_args: [{ letter_number: jsPsych.timelineVariable('letter_number') }],
  data: {
    stim: 'pp2bt',
    colour: 'black',
    letter_number: 'na',
    soa: 'na',
    task: 'training_colour',
    blk_type: 'training',
    corr_key: jsPsych.timelineVariable('corr_key'),
  },
  on_finish: function () {
    code_trial();
  },
};

const trial_timeline_training_letters = {
  timeline: [fixation_cross, trial_training_letters_numbers, trial_feedback_training, iti],
  timeline_variables: stimuli_training_letters,
  sample: {
    type: 'fixed-repetitions',
    size: prms.nTrls_training / stimuli_training_letters.length,
  },
};

// prettier-ignore
const stimuli_training_numbers = [
    { letter_number: prms.numbers[0], corr_key: prms.resp_keys[0] },
    { letter_number: prms.numbers[1], corr_key: prms.resp_keys[0] },
    { letter_number: prms.numbers[2], corr_key: prms.resp_keys[1] },
    { letter_number: prms.numbers[3], corr_key: prms.resp_keys[1] },
];

const trial_timeline_training_numbers = {
  timeline: [fixation_cross, trial_training_letters_numbers, trial_feedback_training, iti],
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
  { response_task: 'primary', background_task: 'letter', colour: prms.colours[0], letter_number: prms.letters[0], soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "comp"},
  { response_task: 'primary', background_task: 'letter', colour: prms.colours[1], letter_number: prms.letters[0], soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "incomp"},
  { response_task: 'primary', background_task: 'letter', colour: prms.colours[0], letter_number: prms.letters[1], soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "comp"},
  { response_task: 'primary', background_task: 'letter', colour: prms.colours[1], letter_number: prms.letters[1], soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "incomp"},
  { response_task: 'primary', background_task: 'letter', colour: prms.colours[0], letter_number: prms.letters[2], soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "incomp"},
  { response_task: 'primary', background_task: 'letter', colour: prms.colours[1], letter_number: prms.letters[2], soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "comp"},
  { response_task: 'primary', background_task: 'letter', colour: prms.colours[0], letter_number: prms.letters[3], soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "incomp"},
  { response_task: 'primary', background_task: 'letter', colour: prms.colours[1], letter_number: prms.letters[3], soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "comp"},
  { response_task: 'primary', background_task: 'number', colour: prms.colours[0], letter_number: prms.numbers[0], soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "comp"},
  { response_task: 'primary', background_task: 'number', colour: prms.colours[1], letter_number: prms.numbers[0], soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "incomp"},
  { response_task: 'primary', background_task: 'number', colour: prms.colours[0], letter_number: prms.numbers[1], soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "comp"},
  { response_task: 'primary', background_task: 'number', colour: prms.colours[1], letter_number: prms.numbers[1], soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "incomp"},
  { response_task: 'primary', background_task: 'number', colour: prms.colours[0], letter_number: prms.numbers[2], soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "incomp"},
  { response_task: 'primary', background_task: 'number', colour: prms.colours[1], letter_number: prms.numbers[2], soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "comp"},
  { response_task: 'primary', background_task: 'number', colour: prms.colours[0], letter_number: prms.numbers[3], soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "incomp"},
  { response_task: 'primary', background_task: 'number', colour: prms.colours[1], letter_number: prms.numbers[3], soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "comp"},
  { response_task: 'primary', background_task: 'letter', colour: prms.colours[0], letter_number: prms.letters[0], soa: prms.soa[1], corr_key: prms.resp_keys[0], backward_comp: "comp"},
  { response_task: 'primary', background_task: 'letter', colour: prms.colours[1], letter_number: prms.letters[0], soa: prms.soa[1], corr_key: prms.resp_keys[1], backward_comp: "incomp"},
  { response_task: 'primary', background_task: 'letter', colour: prms.colours[0], letter_number: prms.letters[1], soa: prms.soa[1], corr_key: prms.resp_keys[0], backward_comp: "comp"},
  { response_task: 'primary', background_task: 'letter', colour: prms.colours[1], letter_number: prms.letters[1], soa: prms.soa[1], corr_key: prms.resp_keys[1], backward_comp: "incomp"},
  { response_task: 'primary', background_task: 'letter', colour: prms.colours[0], letter_number: prms.letters[2], soa: prms.soa[1], corr_key: prms.resp_keys[0], backward_comp: "incomp"},
  { response_task: 'primary', background_task: 'letter', colour: prms.colours[1], letter_number: prms.letters[2], soa: prms.soa[1], corr_key: prms.resp_keys[1], backward_comp: "comp"},
  { response_task: 'primary', background_task: 'letter', colour: prms.colours[0], letter_number: prms.letters[3], soa: prms.soa[1], corr_key: prms.resp_keys[0], backward_comp: "incomp"},
  { response_task: 'primary', background_task: 'letter', colour: prms.colours[1], letter_number: prms.letters[3], soa: prms.soa[1], corr_key: prms.resp_keys[1], backward_comp: "comp"},
  { response_task: 'primary', background_task: 'number', colour: prms.colours[0], letter_number: prms.numbers[0], soa: prms.soa[1], corr_key: prms.resp_keys[0], backward_comp: "comp"},
  { response_task: 'primary', background_task: 'number', colour: prms.colours[1], letter_number: prms.numbers[0], soa: prms.soa[1], corr_key: prms.resp_keys[1], backward_comp: "incomp"},
  { response_task: 'primary', background_task: 'number', colour: prms.colours[0], letter_number: prms.numbers[1], soa: prms.soa[1], corr_key: prms.resp_keys[0], backward_comp: "comp"},
  { response_task: 'primary', background_task: 'number', colour: prms.colours[1], letter_number: prms.numbers[1], soa: prms.soa[1], corr_key: prms.resp_keys[1], backward_comp: "incomp"},
  { response_task: 'primary', background_task: 'number', colour: prms.colours[0], letter_number: prms.numbers[2], soa: prms.soa[1], corr_key: prms.resp_keys[0], backward_comp: "incomp"},
  { response_task: 'primary', background_task: 'number', colour: prms.colours[1], letter_number: prms.numbers[2], soa: prms.soa[1], corr_key: prms.resp_keys[1], backward_comp: "comp"},
  { response_task: 'primary', background_task: 'number', colour: prms.colours[0], letter_number: prms.numbers[3], soa: prms.soa[1], corr_key: prms.resp_keys[0], backward_comp: "incomp"},
  { response_task: 'primary', background_task: 'number', colour: prms.colours[1], letter_number: prms.numbers[3], soa: prms.soa[1], corr_key: prms.resp_keys[1], backward_comp: "comp"},
];

// prettier-ignore
const stimuli_background = [
  { response_task: 'background', background_task: 'letter', colour: prms.colours[2], letter_number: prms.letters[0], soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
  { response_task: 'background', background_task: 'letter', colour: prms.colours[2], letter_number: prms.letters[1], soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
  { response_task: 'background', background_task: 'letter', colour: prms.colours[2], letter_number: prms.letters[2], soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
  { response_task: 'background', background_task: 'letter', colour: prms.colours[2], letter_number: prms.letters[3], soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
  { response_task: 'background', background_task: 'number', colour: prms.colours[2], letter_number: prms.numbers[0], soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
  { response_task: 'background', background_task: 'number', colour: prms.colours[2], letter_number: prms.numbers[1], soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
  { response_task: 'background', background_task: 'number', colour: prms.colours[2], letter_number: prms.numbers[2], soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
  { response_task: 'background', background_task: 'number', colour: prms.colours[2], letter_number: prms.numbers[3], soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
  { response_task: 'background', background_task: 'letter', colour: prms.colours[2], letter_number: prms.letters[0], soa: prms.soa[1], corr_key: prms.resp_keys[0], backward_comp: "na"},
  { response_task: 'background', background_task: 'letter', colour: prms.colours[2], letter_number: prms.letters[1], soa: prms.soa[1], corr_key: prms.resp_keys[0], backward_comp: "na"},
  { response_task: 'background', background_task: 'letter', colour: prms.colours[2], letter_number: prms.letters[2], soa: prms.soa[1], corr_key: prms.resp_keys[1], backward_comp: "na"},
  { response_task: 'background', background_task: 'letter', colour: prms.colours[2], letter_number: prms.letters[3], soa: prms.soa[1], corr_key: prms.resp_keys[1], backward_comp: "na"},
  { response_task: 'background', background_task: 'number', colour: prms.colours[2], letter_number: prms.numbers[0], soa: prms.soa[1], corr_key: prms.resp_keys[0], backward_comp: "na"},
  { response_task: 'background', background_task: 'number', colour: prms.colours[2], letter_number: prms.numbers[1], soa: prms.soa[1], corr_key: prms.resp_keys[0], backward_comp: "na"},
  { response_task: 'background', background_task: 'number', colour: prms.colours[2], letter_number: prms.numbers[2], soa: prms.soa[1], corr_key: prms.resp_keys[1], backward_comp: "na"},
  { response_task: 'background', background_task: 'number', colour: prms.colours[2], letter_number: prms.numbers[3], soa: prms.soa[1], corr_key: prms.resp_keys[1], backward_comp: "na"},
];

const stimuli_high_primary = stimuli_primary.concat(stimuli_background);
// console.log(stimuli_high_primary);

const stimuli_low_primary = stimuli_primary.concat(repeatArray(stimuli_background, 4));
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
  ctx.fillText(args.letter_number, 0, 0);
}

// TO DO: Do we need more detailed feedback for PP trials?
const trial_feedback_pp = {
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

const trial_pp = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  translate_origin: true,
  stimulus_onset: [0, jsPsych.timelineVariable('soa')],
  response_ends_trial: true,
  choices: prms.resp_keys,
  trial_duration: prms.too_slow,
  func: [draw_pp, draw_pp],
  func_args: [
    { colour: jsPsych.timelineVariable('colour'), letter_number: '' },
    { colour: jsPsych.timelineVariable('colour'), letter_number: jsPsych.timelineVariable('letter_number') },
  ],
  data: {
    stim: 'pp2bt',
    colour: jsPsych.timelineVariable('colour'),
    letter_number: jsPsych.timelineVariable('letter_number'),
    soa: jsPsych.timelineVariable('soa'),
    task: 'pp',
    blk_type: 'experiment',
    corr_key: jsPsych.timelineVariable('corr_key'),
  },
  on_finish: function () {
    code_trial();
  },
};

const trial_timeline_high_primary_practice = {
  timeline: [fixation_cross, trial_pp, trial_feedback_pp, iti],
  timeline_variables: stimuli_high_primary,
  sample: {
    type: 'fixed-repetitions',
    size: prms.nTrls_pp_p / stimuli_high_primary.length,
  },
};

const trial_timeline_low_primary_practice = {
  timeline: [fixation_cross, trial_pp, trial_feedback_pp, iti],
  timeline_variables: stimuli_low_primary,
  sample: {
    type: 'fixed-repetitions',
    size: prms.nTrls_pp_p / stimuli_low_primary.length,
  },
};

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
      text: `Du erhaelst den Code für die Versuchspersonenstunden und weitere Anweisungen
    am Ende des Experimentes. Bei Fragen oder Problemen wende dich bitte an:<br><br>
    hiwipibio@gmail.com<br>`,
      fontsize: 30,
      align: 'left',
    }) +
    generate_formatted_html({
      text: `Code: ${randomString}<br>`,
      fontsize: 30,
      align: 'left',
    }) +
    generate_formatted_html({
      text: `Drücke die Leertaste, um fortzufahren!`,
      fontsize: 30,
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

  let blk_type;
  if (nVersion == 1) {
    blk_type = repeatArray('HP', prms.nBlks_pp_e).concat(repeatArray('LP', prms.nBlks_pp_e));
  } else if (nVersion == 2) {
    blk_type = repeatArray('LP', prms.nBlks_pp_e).concat(repeatArray('HP', prms.nBlks_pp_e));
  }
  for (let i = 0; i < blk_type.length; i++) {
    exp.push(task_instructions_pp);
    if (blk_type[i] === 'HP') {
      exp.push(trial_timeline_high_primary_practice);
    } else if (blk_type[i] === 'LP') {
      exp.push(trial_timeline_low_primary_practice);
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
