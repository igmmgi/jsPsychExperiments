// Voluntary Task Switching
// Illuminating the role of effector-specific task representations in voluntary task switching
// Online adapted version of Experiment 1
//
// Two stimuli (i.e., letter/coloured square) are presented in each trial and are
//  associated with two-independent task sets (letter task vs. colour task)
//  1st half: tasks assigned to same hand (task-to-hand)
//  2nd half: tasks assigned to same finger (task-to-finger)
//  Participants decide which task to perform
// The onset of the task (letter/colour) performed in trial n-1 was delayed by increasing steps of 50 ms
// The onset of the task (letter/colour) not performed in trial n-1 was presented without delay
// Following a switch trial, the SOA delay wass reset

const jsPsych = initJsPsych({});

const CANVAS_COLOUR = 'rgba(200, 200, 200, 1)';
const CANVAS_SIZE = [1280, 720];
const CANVAS_BORDER = '5px solid black';

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////

const COLOURS = shuffle(['red', 'blue', 'green', 'yellow']);
const LETTERS = shuffle(['Q', 'K', 'G', 'L']);

const PRMS = {
  screenRes: [960, 720], // minimum screen resolution requested
  nTrls: 10, // 100, // number of trials within a block
  nBlks: 4, // 14, // number of blocks
  fbDur: [400, 500], // feedback duration for correct and incorrect trials, respectively
  fbText: ['Richtig', 'Falsch!'],
  rsi: 400,
  waitDur: 5000, // wait time at end of block if too many errors!
  stimFont: '50px Arial',
  fbFont: '28px Arial',
  colours1: [COLOURS[0], COLOURS[1]],
  letters1: [LETTERS[0], LETTERS[1]],
  colours2: [COLOURS[2], COLOURS[3]],
  letters2: [LETTERS[2], LETTERS[3]],
  soaStart: 0,
  soaStep: 50,
  respKeys: ['F', 'V', 'J', 'N'],
  leftHand: ['F', 'V'],
  rightHand: ['J', 'N'],
  indexFinger: ['V', 'N'],
  middleFinger: ['F', 'J'],
  deactivateKeys: true, // should keys be deactivate when task not available?
};

const VTS_DATA = {
  cTrl: 1,
  cBlk: 1,
  half: 1,
  nLetter: 0,
  nColour: 0,
  previousTask: 'na',
  soa: 0,
  repCounter: 0,
  poorPerformance: false,
};

// 8 counter balanced versions
const VERSION = Number(jsPsych.data.urlVariables().version);
jsPsych.data.addProperties({ version: VERSION });

// 8 counter-balanced versions
// 1st half: hand-to-task   (left: colour, right: letter), 2nd half: finger-to-task (index: colour, middle: letter)
// 1st half: hand-to-task   (left: letter, right: colour), 2nd half: finger-to-task (index: colour, middle: letter)
// 1st half: hand-to-task   (left: colour, right: letter), 2nd half: finger-to-task (index: letter, middle: colour)
// 1st half: hand-to-task   (left: letter, right: colour), 2nd half: finger-to-task (index: letter, middle: colour)
// 1st half: finger-to-task (left: colour, right: letter), 2nd half: hand-to-task   (index: colour, middle: letter)
// 1st half: finger-to-task (left: letter, right: colour), 2nd half: hand-to-task   (index: colour, middle: letter)
// 1st half: finger-to-task (left: colour, right: letter), 2nd half: hand-to-task   (index: letter, middle: colour)
// 1st half: finger-to-task (left: letter, right: colour), 2nd half: hand-to-task   (index: letter, middle: colour)

// lt = left task, rt = right task
// it = index task, mt = middle task
// slr = stim left resp, srr = stim right resp
// prettier-ignore
const VERSIONS = [
  { ver: 1, order: ["hand", "finger"], hand: { lt: "colour", slr: { [PRMS.colours1[0]]: PRMS.leftHand[0], [PRMS.colours1[1]]: PRMS.leftHand[1] }, rt: "letter", srr: { [PRMS.letters1[0]]: PRMS.rightHand[0], [PRMS.letters1[1]]: PRMS.rightHand[1] } }, finger: { it: "colour", sir: { [PRMS.colours2[0]]: PRMS.indexFinger[0], [PRMS.colours2[1]]: PRMS.indexFinger[1] }, mt: "letter", smr: { [PRMS.letters2[0]]: PRMS.middleFinger[0], [PRMS.letters2[1]]: PRMS.middleFinger[1] } } },
  { ver: 2, order: ["hand", "finger"], hand: { lt: "letter", slr: { [PRMS.letters1[0]]: PRMS.leftHand[0], [PRMS.letters1[1]]: PRMS.leftHand[1] }, rt: "colour", srr: { [PRMS.colours1[0]]: PRMS.rightHand[0], [PRMS.colours1[1]]: PRMS.rightHand[1] } }, finger: { it: "colour", sir: { [PRMS.colours2[0]]: PRMS.indexFinger[0], [PRMS.colours2[1]]: PRMS.indexFinger[1] }, mt: "letter", smr: { [PRMS.letters2[0]]: PRMS.middleFinger[0], [PRMS.letters2[1]]: PRMS.middleFinger[1] } } },
  { ver: 3, order: ["hand", "finger"], hand: { lt: "colour", slr: { [PRMS.colours1[0]]: PRMS.leftHand[0], [PRMS.colours1[1]]: PRMS.leftHand[1] }, rt: "letter", srr: { [PRMS.letters1[0]]: PRMS.rightHand[0], [PRMS.letters1[1]]: PRMS.rightHand[1] } }, finger: { it: "letter", sir: { [PRMS.letters2[0]]: PRMS.indexFinger[0], [PRMS.letters2[1]]: PRMS.indexFinger[1] }, mt: "colour", smr: { [PRMS.colours2[0]]: PRMS.middleFinger[0], [PRMS.colours2[1]]: PRMS.middleFinger[1] } } },
  { ver: 4, order: ["hand", "finger"], hand: { lt: "letter", slr: { [PRMS.letters1[0]]: PRMS.leftHand[0], [PRMS.letters1[1]]: PRMS.leftHand[1] }, rt: "colour", srr: { [PRMS.colours1[0]]: PRMS.rightHand[0], [PRMS.colours1[1]]: PRMS.rightHand[1] } }, finger: { it: "letter", sir: { [PRMS.letters2[0]]: PRMS.indexFinger[0], [PRMS.letters2[1]]: PRMS.indexFinger[1] }, mt: "colour", smr: { [PRMS.colours2[0]]: PRMS.middleFinger[0], [PRMS.colours2[1]]: PRMS.middleFinger[1] } } },
  { ver: 5, order: ["finger", "hand"], hand: { lt: "colour", slr: { [PRMS.colours2[0]]: PRMS.leftHand[0], [PRMS.colours2[1]]: PRMS.leftHand[1] }, rt: "letter", srr: { [PRMS.letters2[0]]: PRMS.rightHand[0], [PRMS.letters2[1]]: PRMS.rightHand[1] } }, finger: { it: "colour", sir: { [PRMS.colours1[0]]: PRMS.indexFinger[0], [PRMS.colours1[1]]: PRMS.indexFinger[1] }, mt: "letter", smr: { [PRMS.letters1[0]]: PRMS.middleFinger[0], [PRMS.letters1[1]]: PRMS.middleFinger[1] } } },
  { ver: 6, order: ["finger", "hand"], hand: { lt: "letter", slr: { [PRMS.letters2[0]]: PRMS.leftHand[0], [PRMS.letters2[1]]: PRMS.leftHand[1] }, rt: "colour", srr: { [PRMS.colours2[0]]: PRMS.rightHand[0], [PRMS.colours2[1]]: PRMS.rightHand[1] } }, finger: { it: "colour", sir: { [PRMS.colours1[0]]: PRMS.indexFinger[0], [PRMS.colours1[1]]: PRMS.indexFinger[1] }, mt: "letter", smr: { [PRMS.letters1[0]]: PRMS.middleFinger[0], [PRMS.letters1[1]]: PRMS.middleFinger[1] } } },
  { ver: 7, order: ["finger", "hand"], hand: { lt: "colour", slr: { [PRMS.colours2[0]]: PRMS.leftHand[0], [PRMS.colours2[1]]: PRMS.leftHand[1] }, rt: "letter", srr: { [PRMS.letters2[0]]: PRMS.rightHand[0], [PRMS.letters2[1]]: PRMS.rightHand[1] } }, finger: { it: "letter", sir: { [PRMS.letters1[0]]: PRMS.indexFinger[0], [PRMS.letters1[1]]: PRMS.indexFinger[1] }, mt: "colour", smr: { [PRMS.colours1[0]]: PRMS.middleFinger[0], [PRMS.colours1[1]]: PRMS.middleFinger[1] } } },
  { ver: 8, order: ["finger", "hand"], hand: { lt: "letter", slr: { [PRMS.letters2[0]]: PRMS.leftHand[0], [PRMS.letters2[1]]: PRMS.leftHand[1] }, rt: "colour", srr: { [PRMS.colours2[0]]: PRMS.rightHand[0], [PRMS.colours2[1]]: PRMS.rightHand[1] } }, finger: { it: "letter", sir: { [PRMS.letters1[0]]: PRMS.indexFinger[0], [PRMS.letters1[1]]: PRMS.indexFinger[1] }, mt: "colour", smr: { [PRMS.colours1[0]]: PRMS.middleFinger[0], [PRMS.colours1[1]]: PRMS.middleFinger[1] } } },
];

const STIM_RESP = VERSIONS[VERSION - 1];

function get_keymapping_hand(obj) {
  'use strict';
  let s1_1 = Object.getOwnPropertyNames(obj.hand.slr)[0];
  let k1_1 = obj.hand.slr[s1_1];
  let s2_1 = Object.getOwnPropertyNames(obj.hand.slr)[1];
  let k2_1 = obj.hand.slr[s2_1];
  let s1_2 = Object.getOwnPropertyNames(obj.hand.srr)[0];
  let k1_2 = obj.hand.srr[s1_2];
  let s2_2 = Object.getOwnPropertyNames(obj.hand.srr)[1];
  let k2_2 = obj.hand.srr[s2_2];
  return `${s1_1} = ${k1_1} Taste, ${s2_1} = ${k2_1} Taste &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; ${s1_2} = ${k1_2} Taste, ${s2_2} = ${k2_2} Taste`;
}

function get_keymapping_finger(obj) {
  'use strict';
  let s1_1 = Object.getOwnPropertyNames(obj.finger.sir)[0];
  let k1_1 = obj.finger.sir[s1_1];
  let s2_1 = Object.getOwnPropertyNames(obj.finger.sir)[1];
  let k2_1 = obj.finger.sir[s2_1];
  let s1_2 = Object.getOwnPropertyNames(obj.finger.smr)[0];
  let k1_2 = obj.finger.smr[s1_2];
  let s2_2 = Object.getOwnPropertyNames(obj.finger.smr)[1];
  let k2_2 = obj.finger.smr[s2_2];
  return `${s1_2} = ${k1_2} Taste, ${s1_1} = ${k1_1} Taste &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; ${s2_1} = ${k2_1} Taste, ${s2_2} = ${k2_2} Taste`;
}

// prettier-ignore
let RESPMAPPING_HAND;
if (STIM_RESP.hand.lt === 'colour') {
  RESPMAPPING_HAND = generate_formatted_html({
    text: `Farbaufgabe = Linke Hand &emsp;&emsp;&emsp;&emsp;&emsp;&emsp; Buchstabeaufgabe = Rechte Hand:<br>
          ${get_keymapping_hand(STIM_RESP)}<br>`,
    align: 'center',
    fontsize: 30,
    width: '1200px',
    bold: true,
    lineheight: 2,
  });
} else if (STIM_RESP.hand.lt === 'letter') {
  RESPMAPPING_HAND = generate_formatted_html({
    text: `Buchstabeaufgabe = Linke Hand &emsp;&emsp;&emsp;&emsp;&emsp;&emsp; Farbaufgabe = Rechte Hand:<br>
          ${get_keymapping_hand(STIM_RESP)}<br>`,
    align: 'center',
    fontsize: 30,
    width: '1200px',
    bold: true,
    lineheight: 2,
  });
}

// prettier-ignore
let RESPMAPPING_FINGER;
if (STIM_RESP.finger.it === 'colour') {
  RESPMAPPING_FINGER = generate_formatted_html({
    text: `Colour task = Index Fingers &emsp;&emsp;&emsp;&emsp;&emsp;&emsp; Letter task = Middle Fingers:<br>
          ${get_keymapping_finger(STIM_RESP)}<br>`,
    align: 'center',
    fontsize: 30,
    width: '1200px',
    bold: true,
    lineheight: 2,
  });
} else if (STIM_RESP.finger.it === 'letter') {
  RESPMAPPING_FINGER = generate_formatted_html({
    text: `Letter task = Index Fingers &emsp;&emsp;&emsp;&emsp;&emsp;&emsp; Colour task = Middle Fingers:<br>
          ${get_keymapping_finger(STIM_RESP)}<br>`,
    align: 'center',
    fontsize: 30,
    width: '1200px',
    bold: true,
    lineheight: 2,
  });
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

const TASK_INSTRUCTIONS1 = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: generate_formatted_html({
    text: `Du siehst in jedem Durchgang einen Buchstaben und eine Farbiges Rechteck, aber eine Aufgabe erscheint später als die andere Aufgabe.<br><br>
           Du darfst frei entscheiden, ob du die zuerst erscheinende Aufgabe bearbeiten willst oder auf die andere Aufgabe wartest, aber versuche so schnell und so genau wie möglich zu sein!<br><br>
           Die Reaktionszeitmessung in jedem Durchgang beginnt, sobald die erste Aufgabe erscheint und endet sobald du eine der beiden Aufgaben bearbeitet hast!<br><br>
           Drücke eine beliebige Taste um fortzufahren.`,
    align: 'left',
    fontsize: 30,
    width: '1200px',
    bold: true,
    lineheight: 1.5,
  }),
};

// prettier-ignore
const TASK_INSTRUCTIONS2 = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: generate_formatted_html({
    text: `In jedem Block gibt es insgesamt ${PRMS.nTrls} Aufgaben (${PRMS.nTrls / 2} Buchstaben und ${PRMS.nTrls / 2} Farbaufgaben).<br><br>
           Du hast freie Aufgabenwahl, wenn beide Aufgaben verfügbar sind.<br><br>
           Wenn nur ein “#”-Zeichen statt der Buchstaben Aufgabe, oder Grau die Farbaufgabe, dann musst du der andere Aufgabe bearbeiten bis der Block zu Ende ist.<br><br>
           Drücke eine beliebige Taste um fortzufahren.`,
    align: 'left',
    fontsize: 30,
    width: '1200px',
    bold: true,
    lineheight: 1.5,
  }),
};

const TASK_INSTRUCTIONS_MAPPING = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: '',
  on_start: function(trial) {
    let mapping = STIM_RESP.order[VTS_DATA.half - 1];
    let respText = mapping === 'hand' ? RESPMAPPING_HAND : RESPMAPPING_FINGER;
    trial.stimulus =
      respText +
      generate_formatted_html({
        text: `Drücke eine beliebige Taste, um fortzufahren.`,
        align: 'center',
        fontsize: 30,
        width: '1200px',
        bold: true,
        lineheight: 1.5,
      });
  },
};

const IF_ERROR_TASK_INSTRUCTIONS_MAPPING = {
  timeline: [TASK_INSTRUCTIONS_MAPPING],
  conditional_function: function() {
    return jsPsych.data.get().last(2).values()[0].error === 1;
  },
};

const TASK_INSTRUCTIONS_BLOCK_START = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: '',
  on_start: function(trial) {
    let mapping = STIM_RESP.order[VTS_DATA.half - 1];
    let respText = mapping === 'hand' ? RESPMAPPING_HAND : RESPMAPPING_FINGER;
    trial.stimulus =
      generate_formatted_html({
        text: `Block ${VTS_DATA.cBlk} von ${PRMS.nBlks}<br><br>
               Du darfst in jedem frei Durchgang entscheiden, ob du die zuerst erscheinende Aufgabe bearbeitest oder auf die andere Aufgabe wartest (sofern beide Aufgaben noch verfügbar sind)!<br><br>
               Versuche aber alle ${PRMS.nTrls} Aufgaben (${PRMS.nTrls / 2} Buchstaben und ${PRMS.nTrls / 2
          } Farbe) so schnell und so genau wie möglich zu bearbeiten!`,
        fontsize: 30,
        align: 'left',
        width: '1200px',
        bold: true,
        lineheight: 1.5,
      }) +
      respText +
      generate_formatted_html({
        text: `Drücke eine beliebige Taste, um fortzufahren.`,
        align: 'left',
        fontsize: 30,
        width: '1200px',
        bold: true,
        lineheight: 1.5,
      });
  },
};

const TASK_INSTRUCTIONS_HALF = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: generate_formatted_html({
    text: `***** ACHTUNG *****<br><br>
          Aufgaben zum Tasten Wechseln!<br><br>
          Drücke eine beliebige Taste, um fortzufahren.`,
    fontsize: 38,
    lineheight: 1.5,
    align: 'center',
    bold: true,
  }),
};

function drawStimulus(args) {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  ctx.font = PRMS.stimFont;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';

  // draw surrounding rectangle
  if (args.draw_colour === 1) {
    ctx.strokeStyle = args.colour;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.rect(-40, -50, 80, 100);
    ctx.stroke();
  }

  // letter task
  if (args.draw_letter === 1) {
    ctx.fillText(args.letter, 0, 0);
  }
}

function draw_rsi() {
  'use strict';
}

const RSI = {
  type: jsPsychStaticCanvasKeyboardResponse,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  translate_origin: true,
  trial_duration: PRMS.rsi,
  response_ends_trial: false,
  func: draw_rsi,
};

function codeTrial() {
  'use strict';

  let dat = jsPsych.data.get().last(1).values()[0];

  // Which hand/finger/task did they respond with/to?
  let mapping = STIM_RESP.order[VTS_DATA.half - 1];
  let respHand = PRMS.leftHand.includes(dat.key_press.toUpperCase()) ? 'left' : 'right';
  let respFinger = PRMS.indexFinger.includes(dat.key_press.toUpperCase()) ? 'index' : 'middle';

  let respTask;
  if (mapping === 'hand') {
    respTask = respHand === 'left' ? STIM_RESP.hand.lt : STIM_RESP.hand.rt;
  } else if (mapping === 'finger') {
    respTask = respFinger === 'index' ? STIM_RESP.finger.it : STIM_RESP.finger.mt;
  }

  // Was it a repeat or repetition of task?
  let transition = 'na';
  if (VTS_DATA.previousTask !== 'na') {
    transition = respTask === VTS_DATA.previousTask ? 'repeat' : 'switch';
  }
  VTS_DATA.repCounter = transition === 'repeat' ? VTS_DATA.repCounter + 1 : 0;

  // Calculate RT: NB if responding to the repeat stimulus, subtract SOA
  let rt1 = dat.rt;
  let rt2 = transition !== 'repeat' ? dat.rt : dat.rt - VTS_DATA.soa;

  // Was response correct?
  let correctKeys = [
    STIM_RESP.hand.slr[dat.letter],
    STIM_RESP.hand.slr[dat.colour],
    STIM_RESP.hand.srr[dat.letter],
    STIM_RESP.hand.srr[dat.colour],
    STIM_RESP.finger.sir[dat.letter],
    STIM_RESP.finger.sir[dat.colour],
    STIM_RESP.finger.smr[dat.letter],
    STIM_RESP.finger.smr[dat.colour],
  ];
  let error = correctKeys.includes(dat.key_press.toUpperCase()) ? 0 : 1;

  console.log('##########################');
  console.log('Resp hand: ', respHand);
  console.log('Resp finger: ', respFinger);
  console.log('Mapping: ', mapping);
  console.log('Resp task: ', respTask);
  console.log('Transition: ', transition);
  console.log('SOA: ', VTS_DATA.soa);
  console.log('Transition: ', transition);
  console.log('Rep Counter: ', VTS_DATA.repCounter);
  console.log('RT1: ', rt1);
  console.log('RT2: ', rt2);
  console.log('Error: ', error);

  jsPsych.data.addDataToLastTrial({
    date: Date(),
    blockNum: VTS_DATA.cBlk,
    trialNum: VTS_DATA.cTrl,
    mapping: mapping,
    respHand: respHand,
    respFinger: respFinger,
    respTask: respTask,
    transition: transition,
    repCounter: VTS_DATA.repCounter,
    soa: VTS_DATA.soa,
    rt1: rt1,
    rt2: rt2,
    error: error,
  });

  // Update vts_data for next trial
  VTS_DATA.cTrl++;
  if (respTask === 'letter') VTS_DATA.nLetter++;
  if (respTask === 'colour') VTS_DATA.nColour++;
  VTS_DATA.previousTask = respTask;
  VTS_DATA.soa = transition === 'repeat' ? VTS_DATA.soa + PRMS.soaStep : 50;

  // Reset soa if an error?
  //if (error === 0) VTS_DATA.soa = 0;
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
  func: [drawStimulus, drawStimulus],
  stimulus_onset: null,
  letter: null,
  colour: null,
  func_args: null,
  data: {},
  on_start: function(trial) {
    'use strict';

    // Which letter/colour to show
    let letter;
    let colour;
    if (VTS_DATA.half === 1) {
      letter = VTS_DATA.nLetter < PRMS.nTrls / 2 ? PRMS.letters1[getRandomInt(0, PRMS.letters1.length - 1)] : '#';
      colour = VTS_DATA.nColour < PRMS.nTrls / 2 ? PRMS.colours1[getRandomInt(0, PRMS.colours1.length - 1)] : 'grey';
    } else if (VTS_DATA.half === 2) {
      letter = VTS_DATA.nLetter < PRMS.nTrls / 2 ? PRMS.letters2[getRandomInt(0, PRMS.letters2.length - 1)] : '#';
      colour = VTS_DATA.nColour < PRMS.nTrls / 2 ? PRMS.colours2[getRandomInt(0, PRMS.colours2.length - 1)] : 'grey';
    }

    // activate only response keys for available task?
    if (PRMS.deactivateKeys) {
      trial.choices = [];
      let mapping = STIM_RESP.order[VTS_DATA.half - 1];
      if (mapping === 'hand') {
        if ((letter !== '#') & (STIM_RESP.hand.lt === 'letter')) {
          trial.choices = trial.choices.concat(PRMS.leftHand);
        }
        if ((letter !== '#') & (STIM_RESP.hand.rt === 'letter')) {
          trial.choices = trial.choices.concat(PRMS.rightHand);
        }
        if ((colour !== 'grey') & (STIM_RESP.hand.lt === 'colour')) {
          trial.choices = trial.choices.concat(PRMS.leftHand);
        }
        if ((colour !== 'grey') & (STIM_RESP.hand.rt === 'colour')) {
          trial.choices = trial.choices.concat(PRMS.rightHand);
        }
      } else if (mapping === 'finger') {
        if ((letter !== '#') & (STIM_RESP.finger.it === 'letter')) {
          trial.choices = trial.choices.concat(PRMS.indexFinger);
        }
        if ((letter !== '#') & (STIM_RESP.finger.mt === 'letter')) {
          trial.choices = trial.choices.concat(PRMS.middleFinger);
        }
        if ((colour !== 'grey') & (STIM_RESP.finger.it === 'colour')) {
          trial.choices = trial.choices.concat(PRMS.indexFinger);
        }
        if ((colour !== 'grey') & (STIM_RESP.finger.mt === 'colour')) {
          trial.choices = trial.choices.concat(PRMS.middleFinger);
        }
      }
      console.log(trial.choices);
    }

    // SOA interval
    trial.stimulus_onset = VTS_DATA.cTrl === 1 ? [0, 0] : [0, VTS_DATA.soa];

    // repeat vs. switch task
    let draw_colour;
    let draw_letter;
    if (VTS_DATA.previousTask === 'na') {
      draw_colour = [1, 1];
      draw_letter = [1, 1];
    } else if (VTS_DATA.previousTask === 'colour') {
      draw_colour = [0, 1];
      draw_letter = [1, 1];
    } else if (VTS_DATA.previousTask === 'letter') {
      draw_colour = [1, 1];
      draw_letter = [0, 1];
    }

    trial.func_args = [
      { letter: letter, colour: colour, draw_colour: draw_colour[0], draw_letter: draw_letter[0] },
      { letter: letter, colour: colour, draw_colour: draw_colour[1], draw_letter: draw_letter[1] },
    ];

    trial.data = { stim: 'vts', letter: letter, colour: colour };
  },
  on_finish: function() {
    codeTrial();
  },
};

const TRIAL_FEDBACK = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: '',
  trial_duration: null,
  response_ends_trial: false,
  on_start: function(trial) {
    let dat = jsPsych.data.get().last(1).values()[0];
    trial.stimulus = generate_formatted_html({
      text: PRMS.fbText[dat.error],
      align: 'center',
      fontsize: 36,
      width: '1200px',
      bold: true,
    });
    trial.trial_duration = PRMS.fbDur[dat.error];
  },
};

function blockFeedbackTxt(filter_options) {
  'use strict';
  let dat = jsPsych.data.get().filter({ ...filter_options, blockNum: VTS_DATA.cBlk });
  let meanTime = Math.round(dat.select('rt1').mean());
  let nError = dat.select('error').values.filter(function(x) {
    return x === 1;
  }).length;

  let blockFbTxt =
    generate_formatted_html({
      text: `Kurze Pause.`,
      align: 'center',
      fontsize: 30,
      width: '1200px',
      bold: true,
      lineheight: 1.5,
    }) +
    generate_formatted_html({
      text: `Du hast im Durchschnitt ${meanTime} ms zur Bearbeitung aller ${PRMS.nTrls} Aufgaben gebraucht und dabei ${nError} Fehler gemacht.<br><br>
             Versuche weiterhin so schnell und so genau wie möglich in jedem Durchgang zu sein. Die Reaktionszeitmessung in jedem Durchgang beginnt, sobald die erste Aufgabe (oder #-Zeichen) erscheint und endet, sobald du eine der beiden Aufgaben bearbeitet hast! <br><br>
             Drücke eine beliebige Taste um fortzufahren.`,
      align: 'left',
      fontsize: 30,
      width: '1200px',
      bold: true,
      lineheight: 1.5,
    });

  // reset vts_data for next block
  VTS_DATA.cTrl = 1;
  VTS_DATA.cBlk += 1;
  VTS_DATA.nColour = 0;
  VTS_DATA.nLetter = 0;
  VTS_DATA.previousTask = 'na';
  VTS_DATA.soa = 0;
  VTS_DATA.poorPerformance = nError >= PRMS.nPoor;

  if (VTS_DATA.cBlk > PRMS.nBlks / 2) {
    VTS_DATA.half = 2;
  }

  return blockFbTxt;
}

const BLOCK_FEEDBACK1 = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: '',
  response_ends_trial: true,
  on_start: function(trial) {
    trial.stimulus = blockFeedbackTxt({ stim: 'vts' });
  },
};

const BLOCK_FEEDBACK2 = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: '',
  response_ends_trial: false,
  trial_duration: 1000,
  on_start: function(trial) {
    let mapping = STIM_RESP.order[VTS_DATA.half - 1];
    let respText = mapping === 'hand' ? RESPMAPPING_HAND : RESPMAPPING_FINGER;
    trial.stimulus =
      generate_formatted_html({
        text: `ACHTUNG!`,
        align: 'center',
        fontsize: 30,
        width: '1200px',
        bold: true,
        lineheight: 1.5,
      }) +
      generate_formatted_html({
        text: `Du hast viele Fehler in diesem Block gemacht. Du sollst zwar so schnell wie möglich sein, aber dabei auch nicht zuviele Fehler Machen. Bitte schaue dir nochmal die Antworttasten genau an. Es geht in 30 s automatisch weiter.`,
        align: 'left',
        fontsize: 30,
        width: '1200px',
        bold: true,
        lineheight: 1.5,
      }) +
      respText;
    if (VTS_DATA.poorPerformance) {
      trial.trial_duration = PRMS.waitDur;
    } else {
      trial.trial_duration = 0;
    }
  },
};

////////////////////////////////////////////////////////////////////////
//                              VP Stunden                            //
////////////////////////////////////////////////////////////////////////
const RANDOM_STRING = generateRandomString(16, 'vtse1_');

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
  saveData('/Common/write_data.php', data_fn, { stim: 'vts' });
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

  exp.push(fullscreen(true));
  exp.push(browser_check(PRMS.screenRes));
  exp.push(resize_browser());
  exp.push(welcome_message());
  // exp.push(vpInfoForm('/Common7+/vpInfoForm_de.html'));
  exp.push(mouseCursor(false));

  exp.push(WELCOME_INSTRUCTIONS);
  exp.push(VP_CODE_INSTRUCTIONS1);
  exp.push(TASK_INSTRUCTIONS1);
  exp.push(TASK_INSTRUCTIONS2);

  for (let blk = 0; blk < PRMS.nBlks; blk++) {
    // instruction warning that task->key mapping changes
    if (blk === PRMS.nBlks / 2) {
      exp.push(TASK_INSTRUCTIONS_HALF);
    }

    exp.push(TASK_INSTRUCTIONS_MAPPING);
    exp.push(TASK_INSTRUCTIONS_BLOCK_START);
    exp.push(RSI); // blank before 1st trial start

    // trials within block
    for (let trl = 0; trl < PRMS.nTrls; trl++) {
      exp.push(VTS);
      exp.push(TRIAL_FEDBACK); // duration = RSI of 400, 900 for correct/incorrect trials
      if ((blk === 0) | (blk === PRMS.nBlks / 2)) {
        exp.push(IF_ERROR_TASK_INSTRUCTIONS_MAPPING);
      }
    }

    // between block feedback
    exp.push(BLOCK_FEEDBACK1);
    if (blk < PRMS.nBlks - 1) {
      exp.push(BLOCK_FEEDBACK2);
    }
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
