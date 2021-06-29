// Modified version of a Prioritized Processing task with two background tasks.
//
// Three tasks
// 1) Primary task: shape (e.g. circle, square, diamond). One of the three shapes (randomly
// selected across participants) indicates that the background task is to be performed.
// The two shapes assigned to the primary task are randomly assigned left/right keys.
// 2) Background task 1: letter (E, U, D, W) vowel vs. consonant
// 3) Background task 2: number (1, 2, 8, 9)
// The letters (E, U) annd letters (D, W) were randomly assigned to the left/right keys.
// The numbers (1, 2) are assigned the left key, whilst the numbers (8, 9) are assigned the right key.
// Additionally, the two background tasks are randomly assigned a colour (red vs. blue)
//
// Response keys: Index fingers on the Q and P keys
//
// Primary task probability 2/3
// Secondary task probability 1/3 (proportion manipulation of the two background tasks)
//
// Basic Trial Structure
// Fixation Cross (500 ms)
// Primary Task stimulus (white shape frame)
// SOA 50 ms between onset to primary and secondary task
// Secondary task (number/letter presented inside of shape)
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
const nVersion = 1; //Number(jsPsych.data.urlVariables().version);
jsPsych.data.addProperties({ version: nVersion });
getComputerInfo();

if (nVersion < 3) {
  jsPsych.data.addProperties({ inducer_task: 'number' });
} else {
  jsPsych.data.addProperties({ inducer_task: 'letter' });
}

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
  // Block/Trial Numbers
  nTrls_training: 12, // number of trials in single task training blocks
  nBlks_training: 3, // 1 training block for each inddividual task
  nBlks_pp_p: 1, // single practice block in each PP probability block
  nTrls_pp_p: 48, // number of trials in practice PP block
  nBlks_pp_e: 1, // three experimental blocks in each PP probability blocks
  nTrls_pp_e: 48, // number of trials in experimental PP blocks
  nBlks_total: 7, // total number of training + experimental blocks

  // Timing
  soa: [50],
  too_slow: 3000,
  fb_duration: [500, 2000, 2000, 500, 2000], // Duration of feedback
  iti: 500,
  iti_range: [300, 400, 500, 600, 700], // Duration of feedback

  // Fixation Cross
  fix_duration: 500,
  fix_size: 15,
  fix_linewidth: 4,

  // Stimuli
  shapes: shuffle(['kreis', 'quadrat', 'rhombus']),
  shape_size: 100,
  shape_linewidth: 10,
  shape_colour: 'black',
  colours: shuffle(['blue', 'red']),
  numbers: [1, 2, 8, 9],
  left_numbers: [1, 2],
  right_numbers: [8, 9],
  letters: ['E', 'U', 'D', 'W'],
  vowel_letters: ['E', 'U'],
  consonant_letters: ['D', 'W'],
  letter_task: shuffle(['Vokal', 'Konsonant']),
  stim_size: 'bold 80px monospace',
  fb_size: '30px monospace',
  fb_text: ['Richtig', 'Falsch', 'Zu langsam', 'Richtig', 'Falsch'],

  // Response Keys
  resp_keys: ['q', 'p'],

  // Block/Trial Counters
  cTrl: 1,
  cBlk: 1,
};

// prettier-ignore
let resp_text_shapes_training = `${prms.shapes[0]} &emsp;&emsp; ${prms.shapes[1]}</span><br>
                   (Q-Taste) &emsp;&emsp; (P-Taste) <br>
                   Wenn Form ${prms.shapes[2]} ist, kein Taste drücken!<br><br>`;

// response keys for letter task/number task
let resp_text_numbers = `Zahl kleiner 5 &emsp;&emsp;&emsp; Zahl größer 5<br>
                        (Q-Taste) &emsp;&emsp; (P-Taste) <br>`;

let resp_text_letters = `${prms.letter_task[0]} &emsp;&emsp;&emsp; ${prms.letter_task[1]}<br>
                        (Q-Taste) &emsp;&emsp; (P-Taste) <br>`;

// response keys for PP task
// prettier-ignore
let resp_text_pp = `1. Priorität: Formaufgabe <br><br>${prms.shapes[0]}&emsp;&emsp; ${prms.shapes[1]}<br>
                   (Q-Taste) &emsp;&emsp; (P-Taste) <br><br>
                   Wenn form ${prms.shapes[2]} ist: <br><br>
                    2. Priorität: Buchstabe oder Zahlaufgabe<br><br>
                   ${prms.letter_task[0]} &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;${prms.letter_task[1]}<br>
                   Zahl kleiner 5 &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; Zahl größer 5<br>
                   (Q-Taste) &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;(P-Taste) `;

// prettier-ignore
function resp_text_pp_block() {
    return (`Block ${prms.cBlk} von ${prms.nBlks_total}<br><br>
             1. Priorität: Formaufgabe <br><br> ${prms.shapes[0]}&emsp;&emsp;${prms.shapes[1]}<br>
            (Q-Taste) &emsp;&emsp; (P-Taste) <br><br>
            Wenn form ${prms.shapes[2]} ist: <br>
             2. Priorität: Buchstabe- oder Zahlaufgabe<br><br>
            ${prms.letter_task[0]} &emsp;&emsp;&emsp;&emsp;&emsp;&emsp; ${prms.letter_task[1]}<br>
            Zahl kleiner 5 &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; Zahl größer 5<br>
            (Q-Taste) &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;(P-Taste) `);
}

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
    Wir bitten dich die ca. 45 Minuten konzentriert zu arbeiten.<br><br>
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
Du musst auf die Form (= Formaufgabe), Buchstaben (= Buchstabenaufgabe) oder auf Zahlen (= Zahlaufgabe) reagieren. <br><br>
WICHTIG! Benutze hierfür die Q-Taste mit deinem linken Zeigefinger und die P-Taste mit dem rechten Zeigefinger.<br><br>
Zunächst hast du die Gelegenheit die einzelnen Aufgaben zu üben.<br><br>
Drücke eine beliebige Taste um fortzufahren.`,
    fontsize: 26,
    align: 'left',
  }),
};

const task_instructions_training_shape_task = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus:
    generate_formatted_html({
      text: `Aufgabe: Übungsblock Formaufgabe<br><br>
    Bitte entscheide die Form.`,
      fontsize: 26,
      align: 'center',
    }) +
    generate_formatted_html({
      text: resp_text_shapes_training,
      fontsize: 26,
      align: 'center',
    }) +
    generate_formatted_html({
      text: `Drücke eine beliebige Taste, um fortzufahren.`,
      fontsize: 26,
      align: 'center',
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
    Bitte entscheide ob der Buchstabe Vokal oder Konsonant ist:`,
      fontsize: 26,
      align: 'center',
    }) +
    generate_formatted_html({
      text: resp_text_letters,
      fontsize: 26,
      align: 'center',
    }) +
    generate_formatted_html({
      text: `Drücke eine beliebige Taste, um fortzufahren.`,
      fontsize: 26,
      align: 'center',
    }),
};

const task_instructions_training_number_task = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus:
    generate_formatted_html({
      text: `Aufgabe: Übungsblock Zahlaufgabe <br><br>
    Bitte entscheide ob die Zahl größer oder kleiner als 5 ist:`,
      fontsize: 26,
      align: 'center',
    }) +
    generate_formatted_html({
      text: resp_text_numbers,
      fontsize: 26,
      align: 'center',
    }) +
    generate_formatted_html({
      text: `Drücke eine beliebige Taste, um fortzufahren.`,
      fontsize: 26,
      align: 'center',
    }),
};

const task_instructions_pp1 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: generate_formatted_html({
    text: `ACHTUNG: NEUE INSTRUKTIONEN!!!<br><br>
           Nun werden dir in jedem Durchgang 2 Aufgaben präsentiert: Immer die Formaufgabe mit entweder der Buchstaben- oder Zahlenaufgabe.<br>
           Du musst nur auf eine der zwei Aufgaben reagieren. <br>
           Die erste Priorität ist Form.<br>
           Die zweite Priorität ist die Buchstaben- und Zahlenaufgabe. Du musst NUR auf den Buchstaben bzw. die Zahl reagieren, wenn die Formaufgabe keine Antwort verlangt.<br><br>
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
  stimulus: '',
  on_start: function (trial) {
    trial.stimulus =
      generate_formatted_html({
        text: resp_text_pp_block(),
        fontsize: 26,
        align: 'center',
      }) +
      generate_formatted_html({
        text: `Drücke eine beliebige Taste, um fortzufahren.`,
        fontsize: 26,
        align: 'center',
      });
  },
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
  trial_duration: 0,
  response_ends_trial: false,
  func: function () {},
  on_start: function (trial) {
    let randomInt = getRandomInt(0, 4);
    trial.trial_duration = prms.iti_range[randomInt];
    prms.iti = trial.trial_duration;
  },
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

  // Special Case: no-go type trials during colour training block
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
    iti: prms.iti,
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
function draw_shape_training(args) {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');

  if (args.shape === 'quadrat') {
    ctx.beginPath();
    ctx.lineWidth = prms.shape_linewidth;
    ctx.strokeStyle = prms.shape_colour;
    ctx.rect(-prms.shape_size / 2, -prms.shape_size / 2, prms.shape_size, prms.shape_size);
    ctx.stroke();
  } else if (args.shape === 'kreis') {
    ctx.beginPath();
    ctx.lineWidth = prms.shape_linewidth;
    ctx.arc(0, 0, 50, 0, 2 * Math.PI);
    ctx.stroke();
  } else if (args.shape === 'rhombus') {
    ctx.beginPath();
    ctx.lineWidth = prms.shape_linewidth;
    ctx.strokeStyle = prms.shape_colour;
    ctx.rotate(Math.PI / 4);
    ctx.rect(-prms.shape_size / 2, -prms.shape_size / 2, prms.shape_size, prms.shape_size);
    ctx.rotate(-Math.PI / 4);
    ctx.stroke();
  }
}

// Letter/Number
function draw_letter_number_training(args) {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  ctx.font = prms.stim_size;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = args.colour;
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

  ctx.font = '30px monospace';
  if ((dat.corrCode === 1) | (dat.corrCode === 4)) {
    ctx.fillText(prms.fb_text[dat.corrCode - 1], 0, 0);
  } else {
    ctx.fillText(prms.fb_text[dat.corrCode - 1], 0, -75);
    if (dat.shape !== 'na') {
      ctx.fillStyle = 'black';
      ctx.fillText(prms.shapes[0], -160, -35);
      ctx.fillText(prms.shapes[1], 190, -30);
      ctx.fillText(`Wenn die Form ${prms.shapes[2]} ist, keine Taske drücken!`, 0, 50);
      ctx.fillText('(Q-Taste)', -150, 0);
      ctx.fillText('(P-Taste)', 200, 0);
    } else if ([1, 2, 8, 9].includes(dat.letter_number)) {
      ctx.fillText('Zahl kleiner 5         Zahl größer 5', 0, -15);
      ctx.fillText('(Q-Taste)', -150, 20);
      ctx.fillText('(P-Taste)', 200, 20);
    } else {
      ctx.fillText(`${prms.letter_task[0]}        ${prms.letter_task[1]}`, 0, -15);
      ctx.fillText('(Q-Taste)', -150, 20);
      ctx.fillText('(P-Taste)', 200, 20);
    }
  }
}

// prettier-ignore
const stimuli_training_shapes = [
    { response_task: "primary", shape: prms.shapes[0], colour: prms.shape_colour, corr_key: prms.resp_keys[0], backward_comp: "na"},
    { response_task: "primary", shape: prms.shapes[1], colour: prms.shape_colour, corr_key: prms.resp_keys[1], backward_comp: "na"},
    { response_task: "primary", shape: prms.shapes[0], colour: prms.shape_colour, corr_key: prms.resp_keys[0], backward_comp: "na"},
    { response_task: "primary", shape: prms.shapes[1], colour: prms.shape_colour, corr_key: prms.resp_keys[1], backward_comp: "na"},
    { response_task: "primary", shape: prms.shapes[2], colour: prms.shape_colour, corr_key: "no-go",           backward_comp: "na"},
    { response_task: "primary", shape: prms.shapes[2], colour: prms.shape_colour, corr_key: "no-go",           backward_comp: "na"},
];

const trial_training_shapes = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  translate_origin: true,
  response_ends_trial: true,
  choices: prms.resp_keys,
  trial_duration: prms.too_slow,
  func: draw_shape_training,
  func_args: [{ shape: jsPsych.timelineVariable('shape'), colour: jsPsych.timelineVariable('colour') }],
  data: {
    stim_type: 'pp2bt',
    response_task: jsPsych.timelineVariable('response_task'),
    shape: jsPsych.timelineVariable('shape'),
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

const trial_timeline_training_shapes = {
  timeline: [fixation_cross, trial_training_shapes, trial_feedback_training, iti],
  timeline_variables: stimuli_training_shapes,
  sample: {
    type: 'fixed-repetitions',
    size: prms.nTrls_training / stimuli_training_shapes.length,
  },
};

let stimuli_training_letters;
// prettier-ignore
if (prms.letter_task[0] === "Vokal") {
    stimuli_training_letters = [
        { response_task: "primary", shape: "na", colour: prms.colours[0], letter_number: "vowel_letter",     corr_key: prms.resp_keys[0], backward_comp: "na" },
        { response_task: "primary", shape: "na", colour: prms.colours[0], letter_number: "consonant_letter", corr_key: prms.resp_keys[1], backward_comp: "na" },
    ];
} else if (prms.letter_task[0] === "Konsonant") {
    stimuli_training_letters = [
        { response_task: "primary", shape: "na", colour: prms.colours[0], letter_number: "vowel_letter",     corr_key: prms.resp_keys[1], backward_comp: "na" },
        { response_task: "primary", shape: "na", colour: prms.colours[0], letter_number: "consonant_letter", corr_key: prms.resp_keys[0], backward_comp: "na" },
    ];
}

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
    shape: jsPsych.timelineVariable('shape'),
    colour: jsPsych.timelineVariable('colour'),
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
      case 'vowel_letter':
        letter_number = prms.vowel_letters[randomInt];
        break;
      case 'left_number':
        letter_number = prms.left_numbers[randomInt];
        break;
      case 'consonant_letter':
        letter_number = prms.consonant_letters[randomInt];
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
  timeline: [iti, fixation_cross, trial_training_letters_numbers, trial_feedback_training, iti],
  timeline_variables: stimuli_training_letters,
  sample: {
    type: 'fixed-repetitions',
    size: prms.nTrls_training / stimuli_training_letters.length,
  },
};

// prettier-ignore
const stimuli_training_numbers = [
    { response_task: "primary", shape: "na", colour: prms.colours[1], letter_number: "left_number",  corr_key: prms.resp_keys[0], backward_comp: "na" },
    { response_task: "primary", shape: "na", colour: prms.colours[1], letter_number: "right_number", corr_key: prms.resp_keys[1], backward_comp: "na" },
];

const trial_timeline_training_numbers = {
  timeline: [iti, fixation_cross, trial_training_letters_numbers, trial_feedback_training],
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
    { response_task: 'primary', background_task: 'letter', shape: prms.shapes[0], colour: prms.colours[0], letter_number: "vowel_letter",     soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "comp"},
    { response_task: 'primary', background_task: 'letter', shape: prms.shapes[1], colour: prms.colours[0], letter_number: "consonant_letter", soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "incomp"},
    { response_task: 'primary', background_task: 'letter', shape: prms.shapes[0], colour: prms.colours[0], letter_number: "vowel_letter",     soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "incomp"},
    { response_task: 'primary', background_task: 'letter', shape: prms.shapes[1], colour: prms.colours[0], letter_number: "consonant_letter", soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "comp"},
    { response_task: 'primary', background_task: 'number', shape: prms.shapes[0], colour: prms.colours[1], letter_number: "left_number",      soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "comp"},
    { response_task: 'primary', background_task: 'number', shape: prms.shapes[1], colour: prms.colours[1], letter_number: "left_number",      soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "incomp"},
    { response_task: 'primary', background_task: 'number', shape: prms.shapes[0], colour: prms.colours[1], letter_number: "right_number",     soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "incomp"},
    { response_task: 'primary', background_task: 'number', shape: prms.shapes[1], colour: prms.colours[1], letter_number: "right_number",     soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "comp"},
];

let stimuli_background_high_primary;
// prettier-ignore
if (prms.letter_task[0] === "Vokal") {
    stimuli_background_high_primary = (nVersion < 3) ?
        [
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "vowel_letter",     soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "consonant_letter", soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "vowel_letter",     soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "consonant_letter", soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "vowel_letter",     soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "consonant_letter", soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[1], letter_number: "left_number",      soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[1], letter_number: "right_number",     soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"}
        ] : [
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "vowel_letter",     soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "consonant_letter", soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "left_number",      soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "right_number",     soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "left_number",      soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "right_number",     soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[1], letter_number: "left_number",      soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[1], letter_number: "right_number",     soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"}
        ];
} else if (prms.letter_task[0] === "Konsonant") {
    stimuli_background_high_primary = (nVersion < 3) ?
        [
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "vowel_letter",     soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "consonant_letter", soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "vowel_letter",     soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "consonant_letter", soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "vowel_letter",     soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "consonant_letter", soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[1], letter_number: "left_number",      soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[1], letter_number: "right_number",     soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"}
        ] : [
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "vowel_letter",     soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "consonant_letter", soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "left_number",      soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "right_number",     soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "left_number",      soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "right_number",     soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[1], letter_number: "left_number",      soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[1], letter_number: "right_number",     soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"}
        ];

}

let stimuli_background_low_primary;
// prettier-ignore
if (prms.letter_task[0] === "Vokal") {
    stimuli_background_low_primary = (nVersion < 3) ?
        [
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "vowel_letter",     soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "consonant_letter", soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "vowel_letter",     soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "consonant_letter", soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "vowel_letter",     soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "consonant_letter", soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[1], letter_number: "left_number",      soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[1], letter_number: "right_number",     soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[1], letter_number: "left_number",      soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[1], letter_number: "right_number",     soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[1], letter_number: "left_number",      soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[1], letter_number: "right_number",     soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[1], letter_number: "left_number",      soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[1], letter_number: "right_number",     soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[1], letter_number: "left_number",      soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[1], letter_number: "right_number",     soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
        ] : [
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "vowel_letter",     soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "consonant_letter", soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "vowel_letter",     soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "consonant_letter", soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "vowel_letter",     soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "consonant_letter", soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "vowel_letter",     soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "consonant_letter", soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "vowel_letter",     soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "consonant_letter", soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[1], letter_number: "left_number",      soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[1], letter_number: "right_number",     soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[1], letter_number: "left_number",      soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[1], letter_number: "right_number",     soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[1], letter_number: "left_number",      soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[1], letter_number: "right_number",     soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
        ];
} else if (prms.letter_task[0] === "Konsonant") {
    stimuli_background_low_primary = (nVersion < 3) ?
        [
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "vowel_letter",     soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "consonant_letter", soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "vowel_letter",     soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "consonant_letter", soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "vowel_letter",     soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "consonant_letter", soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[1], letter_number: "left_number",      soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[1], letter_number: "right_number",     soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[1], letter_number: "left_number",      soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[1], letter_number: "right_number",     soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[1], letter_number: "left_number",      soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[1], letter_number: "right_number",     soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[1], letter_number: "left_number",      soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[1], letter_number: "right_number",     soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[1], letter_number: "left_number",      soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[1], letter_number: "right_number",     soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
        ] : [
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "vowel_letter",     soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "consonant_letter", soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "vowel_letter",     soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "consonant_letter", soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "vowel_letter",     soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "consonant_letter", soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "vowel_letter",     soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "consonant_letter", soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "vowel_letter",     soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
            { response_task: 'background', background_task: 'letter', shape: prms.shapes[2], colour: prms.colours[0], letter_number: "consonant_letter", soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[1], letter_number: "left_number",      soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[1], letter_number: "right_number",     soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[1], letter_number: "left_number",      soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[1], letter_number: "right_number",     soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[1], letter_number: "left_number",      soa: prms.soa[0], corr_key: prms.resp_keys[0], backward_comp: "na"},
            { response_task: 'background', background_task: 'number', shape: prms.shapes[2], colour: prms.colours[1], letter_number: "right_number",     soa: prms.soa[0], corr_key: prms.resp_keys[1], backward_comp: "na"},
        ];

}

const stimuli_high_primary = deepCopy(repeatArray(stimuli_primary, 2).concat(stimuli_background_high_primary));
stimuli_high_primary.forEach((i) => (i.prob_cond = 'HP'));
// console.log(stimuli_high_primary);

const stimuli_low_primary = deepCopy(stimuli_primary.concat(stimuli_background_low_primary));
stimuli_low_primary.forEach((i) => (i.prob_cond = 'LP'));
// console.log(stimuli_low_primary);

function draw_pp(args) {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  if (args.shape === 'quadrat') {
    ctx.beginPath();
    ctx.lineWidth = prms.shape_linewidth;
    ctx.strokeStyle = prms.shape_colour;
    ctx.rect(-prms.shape_size / 2, -prms.shape_size / 2, prms.shape_size, prms.shape_size);
    ctx.stroke();
  } else if (args.shape === 'kreis') {
    ctx.beginPath();
    ctx.lineWidth = prms.shape_linewidth;
    ctx.arc(0, 0, 50, 0, 2 * Math.PI);
    ctx.stroke();
  } else if (args.shape === 'rhombus') {
    ctx.beginPath();
    ctx.lineWidth = prms.shape_linewidth;
    ctx.strokeStyle = prms.shape_colour;
    ctx.rotate(Math.PI / 4);
    ctx.rect(-prms.shape_size / 2, -prms.shape_size / 2, prms.shape_size, prms.shape_size);
    ctx.rotate(-Math.PI / 4);
    ctx.stroke();
  }

  // Letter/Number
  ctx.font = prms.stim_size;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = args.colour;
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
    ctx.font = 'bold 30px monospace';
    ctx.fillText(prms.fb_text[dat.corrCode - 1], 0, -150);
    ctx.font = '30px monospace';
    ctx.fillText('1. Priorität: Formaufgabe', 0, -80);
    ctx.fillText(prms.shapes[0], -160, -35);
    ctx.fillText(prms.shapes[1], 190, -30);
    ctx.fillText(`Wenn Form ${prms.shapes[2]} ist`, 0, 40);
    ctx.fillText('2. Priorität: Buchstabe-/Zahlaufgabe', 0, 90);
    ctx.fillStyle = 'black';
    ctx.fillText(`${prms.letter_task[0]}        ${prms.letter_task[1]}`, 0, 130);
    ctx.fillText('Zahl kleiner 5         Zahl größer 5', 0, 170);
    ctx.font = '20px monospace';
    ctx.fillText('(Q-Taste)', -150, -10);
    ctx.fillText('(Q-Taste)', -150, 210);
    ctx.fillText('(P-Taste)', 200, -10);
    ctx.fillText('(P-Taste)', 200, 210);
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
    shape: jsPsych.timelineVariable('shape'),
    colour: jsPsych.timelineVariable('colour'),
    letter_number_group: jsPsych.timelineVariable('letter_number'),
    letter_number: null,
    soa: jsPsych.timelineVariable('soa'),
    blk_type: 'experiment',
    corr_key: jsPsych.timelineVariable('corr_key'),
    backward_comp: jsPsych.timelineVariable('backward_comp'),
    prob_cond: jsPsych.timelineVariable('prob_cond'),
  },
  on_start: function (trial) {
    let letter_number;
    let randomInt = getRandomInt(0, 1);
    switch (trial.data.letter_number_group) {
      case 'vowel_letter':
        letter_number = prms.vowel_letters[randomInt];
        break;
      case 'left_number':
        letter_number = prms.left_numbers[randomInt];
        break;
      case 'consonant_letter':
        letter_number = prms.consonant_letters[randomInt];
        break;
      case 'right_number':
        letter_number = prms.right_numbers[randomInt];
        break;
    }
    trial.func_args = [
      { shape: trial.data.shape, colour: canvas_colour, letter_number: '' },
      { shape: trial.data.shape, colour: trial.data.colour, letter_number: letter_number },
    ];
    trial.data.letter_number = letter_number;
    trial.trial_duration = trial.data.response_task === 'primary' ? prms.too_slow : prms.too_slow + trial.data.soa;
  },
  on_finish: function () {
    code_trial();
  },
};

const trial_timeline_high_primary_practice = {
  timeline: [iti, fixation_cross, trial_pp, trial_feedback_pp],
  timeline_variables: stimuli_high_primary,
  sample: {
    type: 'fixed-repetitions',
    size: prms.nTrls_pp_p / stimuli_high_primary.length,
  },
};
// console.log(trial_timeline_high_primary_practice);

const trial_timeline_low_primary_practice = {
  timeline: [iti, fixation_cross, trial_pp, trial_feedback_pp],
  timeline_variables: stimuli_low_primary,
  sample: {
    type: 'fixed-repetitions',
    size: prms.nTrls_pp_p / stimuli_low_primary.length,
  },
};
// console.log(trial_timeline_low_primary_practice);

const trial_timeline_high_primary_exp = {
  timeline: [iti, fixation_cross, trial_pp, trial_feedback_pp],
  timeline_variables: stimuli_high_primary,
  sample: {
    type: 'fixed-repetitions',
    size: prms.nTrls_pp_e / stimuli_high_primary.length,
  },
};
// console.log(trial_timeline_high_primary_exp);

const trial_timeline_low_primary_exp = {
  timeline: [iti, fixation_cross, trial_pp, trial_feedback_pp],
  timeline_variables: stimuli_low_primary,
  sample: {
    type: 'fixed-repetitions',
    size: prms.nTrls_pp_e / stimuli_low_primary.length,
  },
};
// console.log(trial_timeline_low_primary_exp);

////////////////////////////////////////////////////////////////////////
//                            End Question                            //
////////////////////////////////////////////////////////////////////////
const end_question = {
  type: 'survey-text',
  questions: [
    {
      prompt: 'Sind dir Unterschiede zwischen den verschiedenen Blöcken des Experiments aufgefallen?',
      placeholder: 'ja/nein',
      columns: 10,
      rffequired: true,
      name: 'end_q1',
    },
    {
      prompt: 'Wenn ja, welche?',
      placeholder: 'Welche?',
      columns: 100,
      required: false,
      name: 'end_q2',
    },
  ],
  button_label: 'Weiter',
  randomize_question_order: false,
  on_finish: function () {
    let dat = jsPsych.data.get().last(1).values()[0];
    jsPsych.data.addProperties({ end_q1: dat.end_q1, end_q2: dat.end_q2 });
  },
};

////////////////////////////////////////////////////////////////////////
//                              De-brief                              //
////////////////////////////////////////////////////////////////////////
// For VP Stunden
const randomString = generateRandomStringWithExpName('pp2bt3', 16);

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
  choices: [' '],
};

////////////////////////////////////////////////////////////////////////
//                                Save                                //
////////////////////////////////////////////////////////////////////////
const save_data = {
  type: 'call-function',
  func: function () {
    let data_filename = dirName + 'data/version' + nVersion + '/' + expName + '_' + vpNum;
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
  // Always shape first, then random order of letter/number task
  exp.push(task_instructions_training_shape_task);
  exp.push(trial_timeline_training_shapes);
  exp.push(block_feedback);

  if (Math.random() < 0.5) {
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
  if ((nVersion === 1) | (nVersion === 3)) {
    hplp_type = repeatArray('HP', prms.nBlks_pp_e + 1).concat(repeatArray('LP', prms.nBlks_pp_e + 1));
  } else if ((nVersion === 2) | (nVersion === 4)) {
    hplp_type = repeatArray('LP', prms.nBlks_pp_e + 1).concat(repeatArray('HP', prms.nBlks_pp_e + 1));
  }
  for (let blk = 0; blk < hplp_type.length; blk++) {
    if (blk > 0) {
      exp.push(task_instructions_pp_reminder);
    }
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

  exp.push(end_question);

  // save data
  exp.push(save_data);
  exp.push(save_interaction_data);
  exp.push(save_code);

  // debrief
  exp.push(showMouseCursor);
  exp.push(alpha_num);
  exp.push(debrief);
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
