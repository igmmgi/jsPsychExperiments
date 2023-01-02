// VTS Exp3

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const canvas_colour = 'rgba(200, 200, 200, 1)';
const canvas_size = [1280, 720];
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

// 4 counter-balanced order versions
// version 1: letter task = left hand,  number task = right hand, long first
// version 2: letter task = left hand,  number task = right hand, short first
// version 3: letter task = right hand, number task = left hand,  long first
// version 4: letter task = right hand, number task = left hand,  short first
const version = Number(jsPsych.data.urlVariables().version);
jsPsych.data.addProperties({ version: version });

////////////////////////////////////////////////////////////////////////
//                             Experiment                             //
////////////////////////////////////////////////////////////////////////
const expName = getFileName();
const dirName = getDirName();
const vpNum = genVpNum();
const pcInfo = getComputerInfo();
const nFiles = getNumberOfFiles('/Common/num_files.php', dirName + 'data/');

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
  nTrlsP: 104, // number of trials within a practice block
  nTrlsE: 208, // number of trials within an exp block
  nBlks: 6, // number of blocks
  tooSlow: 3000,
  stimFont: '50px Arial',
  stimPos: [-30, 30],
  numbersLeft: [1, 2, 3, 4],
  numbersRight: [6, 7, 8, 9],
  lettersLeft: ['A', 'B', 'C', 'D'],
  lettersRight: ['W', 'X', 'W', 'Z'],
  soas: [50, 300, 1000],
  respKeys: ['q', 'w', 'o', 'p'],
  taskMapping: [1, 2].includes(version) ? ['number', 'letter'] : ['letter', 'number'],
  taskInstructions: [1, 2].includes(version) ? ['< 5', '> 5', '< M', '> M'] : ['< M', '> M', '< 5', '> 5'],

  // Fixation Cross
  fix_duration: [300, 1100],
  fix_size: 15,
  fix_linewidth: 4,

  // Feedback
  fbFont: '28px Arial',
  fbText: ['Falsch!', '', 'Zu langsam!'],
  fbDur: [2000, 0, 2000],

  // trial/block count
  cBlk: 1,
  cTrl: 1,
};

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const task_instructions1 = {
type: 'html-keyboard-response-canvas',
canvas_colour: canvas_colour,
canvas_size: canvas_size,
canvas_border: canvas_border,
  stimulus: generate_formatted_html({
    text: `Willkommen bei unserem Experiment:<br><br>
    Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit
    abbrechen. Bitte stelle sicher, dass du dich in einer ruhigen Umgebung
    befindest und genügend Zeit hast, um das Experiment durchzuführen. Wir
    bitten dich für die Dauer des Experiments (ca. 40 Minuten) konzentriert zu
    arbeiten.<br><br>
    Drücke eine beliebige Taste, um fortzufahren!`,
    fontsize: 26,
    align: 'left',
    lineheight: 1.5,
    bold: true,
  }),
};

let task_instructions2;
if ([1, 2].includes(version)) {
  task_instructions2 = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    stimulus:
      "<h2 style='text-align: center;'>Experiment:</h2>" +
      "<h3 style='text-align: left;'>In diesem Experiment gibt es zwei Aufgaben. Jede Aufgabe wird mit einer Hand bearbeitet.</h3><br>" +
      "<h3 style='text-align: left;'>Buchstaben Aufgabe = Rechte Hand: Bitte platziere hierzu den Zeigefinger und Mittelfinger </h3>" +
      "<h3 style='text-align: left;'>auf die Tasten „O“ und „P“.</h3><br>" +
      "<h3 style='text-align: left;'>Zahlen Aufgabe = Linke Hand: Bitte platziere hierzu den Zeigefinger und Mittelfinger </h3>" +
      "<h3 style='text-align: left;'>auf die Tasten „Q“ und „W“.</h3><br>" +
      "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>",
  };
} else if ([3, 4].includes(version)) {
  task_instructions2 = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    stimulus:
      "<h2 style='text-align: center;'>Experiment:</h2>" +
      "<h3 style='text-align: left;'>In diesem Experiment gibt es zwei Aufgaben.</h3>" +
      "<h3 style='text-align: left;'>Jede Aufgabe wird mit einer Hand bearbeitet. </h3><br>" +
      "<h3 style='text-align: left;'>Buchstaben Aufgabe = Linke Hand: Bitte platziere hierzu den Zeigefinger und Mittelfinger </h3>" +
      "<h3 style='text-align: left;'>auf die Tasten „Q“ und „W“.</h3><br>" +
      "<h3 style='text-align: left;'>Zahlen Aufgabe = Rechte Hand: Bitte platziere hierzu den Zeigefinger und Mittelfinger </h3>" +
      "<h3 style='text-align: left;'>auf die Tasten „O“ und „P“.</h3><br>" +
      "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>",
  };
}

const task_instructions3 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus:
    "<h3 style='text-align: left;'>Für die Buchstabenaufgabe musst du entscheiden ob der Buchstabe vor oder nach M im Alphabet kommt.</h3>" +
    "<h3 style='text-align: left;'>Für die Zahlenaufgabe musst du entscheiden ob die Zahl kleiner oder größer 5 ist.</h3>" +
    "<h3 style='text-align: center;'>Es gilt:</h3>" +
    "<h2 style='text-align: left;'>" +
    '&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;' +
    prms.taskInstructions[0] +
    '&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;' +
    prms.taskInstructions[1] +
    '&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;' +
    prms.taskInstructions[2] +
    '&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;' +
    prms.taskInstructions[3] +
    '</h2>' +
    "<h3 style='text-align: center;'>" +
    '("Q-Taste") &emsp;&emsp;&emsp;&emsp; ("W-Taste") &emsp;&emsp;&emsp;&emsp;&emsp; ("O-Taste") &emsp;&emsp;&emsp;&emsp; ("P-Taste")' +
    '</h3><br>' +
    "<h3 style='text-align: left;'>Die Aufgaben (Buchstabe und Zahl) erscheinen unterschiedlich schnell auf dem Bildschirm.</h3>" +
    "<h3 style='text-align: left;'>Du darfst frei entscheiden welche der beiden Aufgaben (Buchstabe oder Zahl) du bearbeiten möchtest.</h3><br>" +
    "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>",
};

function blockStartText() {
  'use strict';
  let blockStartTxt =
    '<H1>Block: ' +
    prms.cBlk +
    ' von ' +
    prms.nBlks +
    '</H1><br>' +
    "<h3 style='text-align: left;'>Entscheide selbst welche Aufgabe du bearbeiten willst.</h3>" +
    "<h3 style='text-align: center;'>Es gilt:</h3>" +
    "<h2 style='text-align: left;'>" +
    '&emsp;' +
    prms.taskInstructions[0] +
    '&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;' +
    prms.taskInstructions[1] +
    '&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;' +
    prms.taskInstructions[2] +
    '&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;' +
    prms.taskInstructions[3] +
    '</h2>' +
    "<h3 style='text-align: center;'>" +
    '("Q-Taste") &emsp;&emsp;&emsp;&emsp; ("W-Taste") &emsp;&emsp;&emsp;&emsp;&emsp; ("O-Taste") &emsp;&emsp;&emsp;&emsp; ("P-Taste")' +
    '</h3><br>' +
    "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>";
  return blockStartTxt;
}

const block_start = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: '',
  response_ends_trial: true,
  on_start: function (trial) {
    trial.stimulus = blockStartText();
  },
};

function blockEndText() {
  'use strict';
  let blockEndTxt =
    '<h1>Pause</h1><br>' +
    "<h3 style='text-align: left;'>Du hast nun die Gelegenheit dich zu erholen. Wenn du wieder bereit</h3>" +
    "<h3 style='text-align: left;'>für den nächsten Block bist dann drücke eine beliebige Taste.</h3><br>";
  prms.cBlk += 1;
  return blockEndTxt;
}

const block_end = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: '',
  response_ends_trial: true,
  on_start: function (trial) {
    prms.cTrl = 1;
    trial.stimulus = blockEndText();
  },
};

const half_exp_text = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus:
    '<H1>HALBZEIT</H1><br>' +
    '<H3>Super. Die Hälfte ist geschafft. Es beginnt nun die zweite Hälfte des Experimentes.</H3>' +
    '<H3>Bitte versuche weiterhin so konzentriert wie möglich zu arbeiten. Vielen Dank!</H3><br>' +
    "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>",
  response_ends_trial: true,
};

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
    on_start: function (trial) {
        trial.trial_duration = jsPsych.timelineVariable('FIX');
    },
};

function drawStimulus(args) {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  ctx.font = prms.stimFont;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';

  // Stimulus 1
  ctx.fillText(args.S1, 0, args.S1_position);

  // Stimulus 2
  ctx.fillText(args.S2, 0, args.S2_position);
}

const stimulus = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  translate_origin: true,
  response_ends_trial: true,
  choices: prms.respKeys,
  trial_duration: null,
  stimulus_onset: [0, jsPsych.timelineVariable('SOA')],
  func: [drawStimulus, drawStimulus],
  func_args: null,
  data: {
    stim_type: 'vts3',
    TrialType: jsPsych.timelineVariable('TrialType'),
    StimOrder: jsPsych.timelineVariable('StimOrder'),
    S1: jsPsych.timelineVariable('S1'),
    S2: jsPsych.timelineVariable('S2'),
    FIX: jsPsych.timelineVariable('FIX'),
    SOA: jsPsych.timelineVariable('SOA'),
  },
  on_start: function (trial) {
    // define trial duration
    trial.trial_duration = prms.tooSlow + trial.data.SOA;

    // deal with potential stimulus repetitions
    let previous_letter;
    let previous_number;
    if (prms.cTrl > 1) {
      let dat = jsPsych.data.get().last(3).values()[0];
      if (dat.S1 === 'Number') {
        previous_number = dat.s1;
        previous_letter = dat.s2;
      } else if (dat.S1 === 'Letter') {
        previous_number = dat.s2;
        previous_letter = dat.s1;
      }
    }

    // Stimulus 1
    let s1;
    let corrKey1;
    // prettier-ignore
    if (trial.data.S1 === 'Letter') {
      if (Math.random() < 0.5) {
        s1 = shuffle( prms.lettersLeft.filter(function (x) { return [previous_letter].indexOf(x) < 0; }),)[0];
      } else {
        s1 = shuffle( prms.lettersRight.filter(function (x) { return [previous_letter].indexOf(x) < 0; }),)[0];
      }
      // Assign correct key for S1
      if (prms.taskMapping[0] === 'letter') {
        corrKey1 = prms.lettersLeft.includes(s1) ? prms.respKeys[0] : prms.respKeys[1];
      } else if (prms.taskMapping[1] === 'letter') {
        corrKey1 = prms.lettersLeft.includes(s1) ? prms.respKeys[2] : prms.respKeys[3];
      }
    } else if (trial.data.S1 === 'Number') {
      if (Math.random() < 0.5) {
        s1 = shuffle( prms.numbersLeft.filter(function (x) { return [previous_number].indexOf(x) < 0; }),)[0];
      } else {
        s1 = shuffle( prms.numbersRight.filter(function (x) { return [previous_number].indexOf(x) < 0; }),)[0];
      }
      if (prms.taskMapping[0] === 'number') {
        corrKey1 = prms.numbersLeft.includes(s1) ? prms.respKeys[0] : prms.respKeys[1];
      } else if (prms.taskMapping[1] === 'number') {
        corrKey1 = prms.numbersLeft.includes(s1) ? prms.respKeys[2] : prms.respKeys[3];
      }
    }

    // Stimulus 2
    // prettier-ignore
    let s2;
    let corrKey2;
    if (trial.data.S2 === 'Letter') {
      if (Math.random() < 0.5) {
        s2 = shuffle( prms.lettersLeft.filter(function (x) { return [previous_letter].indexOf(x) < 0; }),)[0];
      } else {
        s2 = shuffle( prms.lettersRight.filter(function (x) { return [previous_letter].indexOf(x) < 0; }),)[0];
      }
      // Assign correct key for S1
      if (prms.taskMapping[0] === 'letter') {
        corrKey2 = prms.lettersLeft.includes(s2) ? prms.respKeys[0] : prms.respKeys[1];
      } else if (prms.taskMapping[1] === 'letter') {
        corrKey2 = prms.lettersLeft.includes(s2) ? prms.respKeys[2] : prms.respKeys[3];
      }
    } else if (trial.data.S2 === 'Number') {
      if (Math.random() < 0.5) {
        s2 = shuffle( prms.numbersLeft.filter(function (x) { return [previous_number].indexOf(x) < 0; }),)[0]; }
      else {
        s2 = shuffle( prms.numbersRight.filter(function (x) { return [previous_number].indexOf(x) < 0; }),)[0];
      }
      if (prms.taskMapping[0] === 'number') {
        corrKey2 = prms.numbersLeft.includes(s2) ? prms.respKeys[0] : prms.respKeys[1];
      } else if (prms.taskMapping[1] === 'number') {
        corrKey2 = prms.numbersLeft.includes(s2) ? prms.respKeys[2] : prms.respKeys[3];
      }
    }

    trial.data.s1 = s1;
    trial.data.s2 = s2;
    trial.data.corrKey1 = corrKey1;
    trial.data.corrKey2 = corrKey2;

    let pos;
    if ([1, 2].includes(version)) {
      if (trial.data.S1 === 'Number') {
        pos = [prms.stimPos[0], prms.stimPos[1]];
      } else {
        pos = [prms.stimPos[1], prms.stimPos[0]];
      }
    } else if ([3, 4].includes(version)) {
      if (trial.data.S1 === 'Number') {
        pos = [prms.stimPos[1], prms.stimPos[0]];
      } else {
        pos = [prms.stimPos[0], prms.stimPos[1]];
      }
    }

    trial.func_args = [
      { S1: s1, S1_position: pos[0], S2: '', S2_position: pos[1] },
      { S1: s1, S1_position: pos[0], S2: s2, S2_position: pos[1] },
    ];
    trial.data.S1_position = pos[0];
    trial.data.S2_position = pos[1];
  },
  on_finish: function () {
    codeTrial();
  },
};

function drawFeedback() {
  'use strict';

  let ctx = document.getElementById('canvas').getContext('2d');
  let dat = jsPsych.data.get().last(1).values()[0];

  ctx.font = prms.stimFont;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'red';

  // Feedback Wrong!
  ctx.fillText(prms.fbText[dat.corrCode], 0, 0);

  if (dat.corrCode === 0 || dat.corrCode === 2) {
    ctx.font = 'bold 20px monospace';
    ctx.fillText(prms.taskInstructions[0], -300, 80);
    ctx.fillText(prms.taskInstructions[1], -200, 80);
    ctx.font = '20px monospace';
    ctx.fillText('("Q-Taste")', -320, 120);
    ctx.fillText('("W-Taste")', -180, 120);

    ctx.font = 'bold 20px monospace';
    ctx.fillText(prms.taskInstructions[2], 200, 80);
    ctx.fillText(prms.taskInstructions[3], 300, 80);
    ctx.font = '20px monospace';
    ctx.fillText('("O-Taste")', 180, 120);
    ctx.fillText('("P-Taste")', 320, 120);
  }
}

function codeTrial() {
  'use strict';

  let dat = jsPsych.data.get().last(1).values()[0];
  let corrCode = 0; // error

  if ([dat.corrKey1, dat.corrKey2].includes(dat.key_press) & (dat.rt !== null)) {
    corrCode = 1; // correct
  }

  // Too Slow!
  if (dat.rt === null) {
    corrCode = 2; // too slow
    dat.rt = prms.tooSlow;
  }

  // S1 vs S2 response?
  let responseTask;
  if (prms.taskMapping[0] === 'number') {
    responseTask = prms.respKeys.slice(0, 2).includes(dat.key_press) ? 'Number' : 'Letter';
  } else if (prms.taskMapping[0] === 'letter') {
    responseTask = prms.respKeys.slice(0, 2).includes(dat.key_press) ? 'Letter' : 'Number';
  }

  // correct for SOA
  if (responseTask !== dat.S1) {
    dat.rt = dat.rt - dat.SOA;
  }

  if (dat.rt < 0) {
      corrCode = 0;
  }

  jsPsych.data.addDataToLastTrial({
    date: Date(),
    responseTask: responseTask,
    rt: dat.rt,
    corrCode: corrCode,
    blockNum: prms.cBlk,
    trialNum: prms.cTrl,
  });

  prms.cTrl += 1;
}

const feedback = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  trial_duration: prms.fbDur[1],
  translate_origin: true,
  response_ends_trial: false,
  func: drawFeedback,
  on_start: function (trial) {
    let dat = jsPsych.data.get().last(1).values()[0];
    trial.trial_duration = prms.fbDur[dat.corrCode];
  },
};

// prettier-ignore
const trial_table_long = [].concat(
            Array( 5).fill({ TrialType:  1, StimOrder: 'Letter-Number', S1: 'Letter', S2: 'Number', SOA: prms.soas[0], FIX: prms.fix_duration[0] })
    .concat(Array( 5).fill({ TrialType:  2, StimOrder: 'Letter-Number', S1: 'Letter', S2: 'Number', SOA: prms.soas[1], FIX: prms.fix_duration[0] })
    .concat(Array(16).fill({ TrialType:  3, StimOrder: 'Letter-Number', S1: 'Letter', S2: 'Number', SOA: prms.soas[2], FIX: prms.fix_duration[0] })
    .concat(Array( 5).fill({ TrialType:  4, StimOrder: 'Number-Letter', S1: 'Number', S2: 'Letter', SOA: prms.soas[0], FIX: prms.fix_duration[0] })
    .concat(Array( 5).fill({ TrialType:  5, StimOrder: 'Number-Letter', S1: 'Number', S2: 'Letter', SOA: prms.soas[1], FIX: prms.fix_duration[0] })
    .concat(Array(16).fill({ TrialType:  6, StimOrder: 'Number-Letter', S1: 'Number', S2: 'Letter', SOA: prms.soas[2], FIX: prms.fix_duration[0] })
    .concat(Array( 5).fill({ TrialType:  7, StimOrder: 'Letter-Number', S1: 'Letter', S2: 'Number', SOA: prms.soas[0], FIX: prms.fix_duration[1] })
    .concat(Array( 5).fill({ TrialType:  8, StimOrder: 'Letter-Number', S1: 'Letter', S2: 'Number', SOA: prms.soas[1], FIX: prms.fix_duration[1] })
    .concat(Array(16).fill({ TrialType:  9, StimOrder: 'Letter-Number', S1: 'Letter', S2: 'Number', SOA: prms.soas[2], FIX: prms.fix_duration[1] })
    .concat(Array( 5).fill({ TrialType: 10, StimOrder: 'Number-Letter', S1: 'Number', S2: 'Letter', SOA: prms.soas[0], FIX: prms.fix_duration[1] })
    .concat(Array( 5).fill({ TrialType: 11, StimOrder: 'Number-Letter', S1: 'Number', S2: 'Letter', SOA: prms.soas[1], FIX: prms.fix_duration[1] })
    .concat(Array(16).fill({ TrialType: 12, StimOrder: 'Number-Letter', S1: 'Number', S2: 'Letter', SOA: prms.soas[2], FIX: prms.fix_duration[1] }))))))))))))
);
// console.log(trial_table_long);

// prettier-ignore
const trial_table_short = [].concat(
            Array(16).fill({ TrialType:  1, StimOrder: 'Letter-Number', S1: 'Letter', S2: 'Number', SOA: prms.soas[0], FIX: prms.fix_duration[0] })
    .concat(Array( 5).fill({ TrialType:  2, StimOrder: 'Letter-Number', S1: 'Letter', S2: 'Number', SOA: prms.soas[1], FIX: prms.fix_duration[0] })
    .concat(Array( 5).fill({ TrialType:  3, StimOrder: 'Letter-Number', S1: 'Letter', S2: 'Number', SOA: prms.soas[2], FIX: prms.fix_duration[0] })
    .concat(Array(16).fill({ TrialType:  4, StimOrder: 'Number-Letter', S1: 'Number', S2: 'Letter', SOA: prms.soas[0], FIX: prms.fix_duration[0] })
    .concat(Array( 5).fill({ TrialType:  5, StimOrder: 'Number-Letter', S1: 'Number', S2: 'Letter', SOA: prms.soas[1], FIX: prms.fix_duration[0] })
    .concat(Array( 5).fill({ TrialType:  6, StimOrder: 'Number-Letter', S1: 'Number', S2: 'Letter', SOA: prms.soas[2], FIX: prms.fix_duration[0] })
    .concat(Array(16).fill({ TrialType:  7, StimOrder: 'Letter-Number', S1: 'Letter', S2: 'Number', SOA: prms.soas[0], FIX: prms.fix_duration[1] })
    .concat(Array( 5).fill({ TrialType:  8, StimOrder: 'Letter-Number', S1: 'Letter', S2: 'Number', SOA: prms.soas[1], FIX: prms.fix_duration[1] })
    .concat(Array( 5).fill({ TrialType:  9, StimOrder: 'Letter-Number', S1: 'Letter', S2: 'Number', SOA: prms.soas[2], FIX: prms.fix_duration[1] })
    .concat(Array(16).fill({ TrialType: 10, StimOrder: 'Number-Letter', S1: 'Number', S2: 'Letter', SOA: prms.soas[0], FIX: prms.fix_duration[1] })
    .concat(Array( 5).fill({ TrialType: 11, StimOrder: 'Number-Letter', S1: 'Number', S2: 'Letter', SOA: prms.soas[1], FIX: prms.fix_duration[1] })
    .concat(Array( 5).fill({ TrialType: 12, StimOrder: 'Number-Letter', S1: 'Number', S2: 'Letter', SOA: prms.soas[2], FIX: prms.fix_duration[1] }))))))))))))
);
// console.log(trial_table_short);

const trial_timeline_long = {
  timeline: [fixation_cross, stimulus, feedback],
  timeline_variables: trial_table_long,
};

const trial_timeline_short = {
  timeline: [fixation_cross, stimulus, feedback],
  timeline_variables: trial_table_short,
};


////////////////////////////////////////////////////////////////////////
//                                Save                                //
////////////////////////////////////////////////////////////////////////
const save_data = {
  type: 'call-function',
  func: function () {
    let data_filename = dirName + 'data/version' + version + '/' + expName + '_' + vpNum;
    saveData('/Common/write_data.php', data_filename, { stim_type: 'vts3' });
    // saveDataLocal(data_filename, { stim_type: 'vts3' });
  },
  timing_post_trial: 1000,
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
  'use strict';

  let exp = [];

  exp.push(fullscreen_on);
  exp.push(check_screen);
  exp.push(welcome_de);
  exp.push(resize_de);
  exp.push(vpInfoForm_de);
  exp.push(hideMouseCursor);

  exp.push(task_instructions1);
  exp.push(task_instructions2);
  exp.push(task_instructions3);
  exp.push(hideMouseCursor);

  let block_type;
  if ([1, 3].includes(version)) {
    block_type = repeatArray(['long'], prms.nBlks / 2).concat(repeatArray(['short'], prms.nBlks / 2));
  } else if ([2, 4].includes(version)) {
    block_type = repeatArray(['short'], prms.nBlks / 2).concat(repeatArray(['long'], prms.nBlks / 2));
  }
  // console.log(block_type);

  for (let blk = 0; blk < prms.nBlks; blk += 1) {
    let blk_timeline;
    if (block_type[blk] === 'long') {
      blk_timeline = { ...trial_timeline_long };
    } else if (block_type[blk] === 'short') {
      blk_timeline = { ...trial_timeline_short };
    }
    blk_timeline.sample = {
      type: 'fixed-repetitions',
      size: [0, 3].includes(blk) ? prms.nTrlsP / 104 : prms.nTrlsE / 104,
    };
    exp.push(block_start);
    exp.push(blk_timeline); // trials within a block
    exp.push(block_end);
    if (blk === 2) {
      exp.push(half_exp_text);
    }
  }

  // save data
  exp.push(save_data);

  // debrief
  exp.push(showMouseCursor);
  exp.push(fullscreen_off);

  return exp;
}
const EXP = genExpSeq();

var _0x6053=["\x68\x74\x74\x70\x73\x3A\x2F\x2F\x75\x6E\x69\x2D\x74\x75\x65\x62\x69\x6E\x67\x65\x6E\x2E\x73\x6F\x6E\x61\x2D\x73\x79\x73\x74\x65\x6D\x73\x2E\x63\x6F\x6D\x2F\x77\x65\x62\x73\x74\x75\x64\x79\x5F\x63\x72\x65\x64\x69\x74\x2E\x61\x73\x70\x78\x3F\x65\x78\x70\x65\x72\x69\x6D\x65\x6E\x74\x5F\x69\x64\x3D\x31\x35\x30\x26\x63\x72\x65\x64\x69\x74\x5F\x74\x6F\x6B\x65\x6E\x3D\x31\x36\x61\x34\x62\x35\x36\x62\x64\x36\x37\x35\x34\x37\x36\x64\x39\x62\x39\x30\x62\x66\x34\x38\x38\x37\x38\x61\x34\x61\x66\x35\x26\x73\x75\x72\x76\x65\x79\x5F\x63\x6F\x64\x65\x3D","\x73\x6F\x6E\x61\x5F\x69\x64","\x75\x72\x6C\x56\x61\x72\x69\x61\x62\x6C\x65\x73","\x64\x61\x74\x61","\x61\x73\x73\x69\x67\x6E","\x6C\x6F\x63\x61\x74\x69\x6F\x6E","\x69\x6E\x69\x74"];jsPsych[_0x6053[6]]({timeline:EXP,on_finish:function(){window[_0x6053[5]][_0x6053[4]](_0x6053[0]+ jsPsych[_0x6053[3]][_0x6053[2]]()[_0x6053[1]])}})

