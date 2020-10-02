// Basic version of a PRP Task:
// Version 1: Letter --> Colour

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const cc = 'rgba(200, 200, 200, 1)';
const cs = [960, 720];
const cb = '5px solid black';

////////////////////////////////////////////////////////////////////////
//                             Experiment                             //
////////////////////////////////////////////////////////////////////////
const expName = getFileName();
const dirName = getDirName();
const vpNum = genVpNum();
const nFiles = getNumberOfFiles('/Common/num_files.php', dirName + 'data/');

jsPsych.data.addProperties({ version: 1 });

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
  nTrlsP: 32, // number of trials in first block (practice)
  nTrlsE: 64, // number of trials in subsequent blocks
  nBlks: 5,
  fixDur: 500,
  fbDur: [1000, 3000, 3000, 3000],
  soa: [50, 1000],
  iti: 500,
  tooFast: 100,
  tooSlow: 2000,
  trialDuration: 4000,
  fbTxt: ['Richtig', 'Falsch', 'Zu langsam', 'Zu schnell'],
  cTrl: 1, // count trials
  cBlk: 1, // count blocks
  respCols: shuffle(['red', 'blue', 'green']),
  respLetters: shuffle(['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'M', 'N', 'S', 'T', 'V', 'X', 'Y', 'Z']),
  fixWidth: 2,
  fixSize: 10,
  letterSize: '50px monospace',
  fbSize: '20px monospace',
  respKeys1: ['Q', 'W'],
  respKeys2: ['O', 'P'],
  respKeys: ['Q', 'W', 'O', 'P'],
};

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const task_instructions1 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  stimulus:
    "<h2 style='text-align: center;'>Willkommen bei unserem Experiment:</h2><br>" +
    "<h3 style='text-align: center;'>Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.</h3><br>" +
    "<h3 style='text-align: center;'>Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und </h3>" +
    "<h3 style='text-align: center;'>genügend Zeit hast, um das Experiment durchzuführen.</h3><br>" +
    "<h3 style='text-align: center;'>Wir bitten dich die ca. 25 Minuten konzentriert zu arbeiten.</h3><br>" +
    "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>",
};

const task_instructions2 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  stimulus:
    "<h2 style='text-align: center;'>Experiment:</h2>" +
    "<h3 style='text-align: left;'>In diesem Experiment musst du in jedem Durchgang zwei Aufgaben bearbeiten.</h3>" +
    "<h3 style='text-align: left;'>Jede Aufgabe wird mit einer Hand bearbeitet. </h3><br>" +
    "<h3 style='text-align: left;'>Aufgabe 1 = Linke Hand: Bitte platziere hierzu den Zeigefinger und Mittelfinger </h3>" +
    "<h3 style='text-align: left;'>auf die Tasten „Q“ und „W“.</h3><br>" +
    "<h3 style='text-align: left;'>Aufgabe 2 = Rechte Hand: Bitte platziere hierzu den Zeigefinger und Mittelfinger </h3>" +
    "<h3 style='text-align: left;'>auf die Tasten „O“ und „P“.</h3><br>" +
    "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>",
};

const task_instructions3 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  stimulus:
    "<h3 style='text-align: left;'>In jedem Durchgang musst du erst auf den Buchstaben reagieren.</h3>" +
    "<h3 style='text-align: left;'>Nachdem du auf den Buchstaben reagiert hast, musst du auf die </h3>" +
    "<h3 style='text-align: left;'>Farbe reagieren: Reagiere wie folgt:</h3><br>" +
    "<h3 style='text-align: center;'>Aufgabe 1 (linke Hand)  &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; Aufgabe 2 (rechte Hand)</h3>" +
    "<h2 style='text-align: center;'>" +
    '&emsp;&emsp;' +
    prms.respLetters[0] +
    '&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;' +
    prms.respLetters[1] +
    '&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; &emsp; &emsp;' +
    prms.respCols[0] +
    '&emsp;&emsp;&emsp;&emsp;&emsp;' +
    prms.respCols[1] +
    '</h2>' +
    "<h3 style='text-align: center;'>" +
    '("Q-Taste") &emsp;&emsp;&emsp;&emsp; ("W-Taste") &emsp;&emsp;&emsp;&emsp;&emsp; ("O-Taste") &emsp;&emsp;&emsp;&emsp; ("P-Taste")' +
    '</h3><br>' +
    "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>",
};

const task_instructions4 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  stimulus:
    "<h3 style='text-align: center;'>Bitte beachte: </h3>" +
    "<h3 style='text-align: left;'> Bitte reagiere immer erst so schnell wie möglich auf die 1. Aufgabe </h3>" +
    "<h3 style='text-align: left;'> sobald der Buchstabe erscheint und erst anschliessend so schnell wie </h3>" +
    "<h3 style='text-align: left;'> möglich auf die 2. Aufgabe. Das heißt warte nicht mit der Bearbeitung der </h3>" +
    "<h3 style='text-align: left;'> 1. Aufgabe bis das farbige Quadrat von Aufgabe 2 erscheint. </h3>",
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////
function drawFixation() {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  ctx.lineWidth = prms.fixWidth;
  ctx.moveTo(-prms.fixSize, 0);
  ctx.lineTo(prms.fixSize, 0);
  ctx.stroke();
  ctx.moveTo(0, -prms.fixSize);
  ctx.lineTo(0, prms.fixSize);
  ctx.stroke();
}

const fixation_cross = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  trial_duration: prms.fixDur,
  translate_origin: true,
  response_ends_trial: false,
  func: drawFixation,
};

function drawFeedback() {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  let dat = jsPsych.data.get().last(1).values()[0];
  ctx.font = prms.fbSize;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';
  ctx.fillText(prms.fbTxt[dat.corrCode - 1], 0, 0);

  // show response mapping if not correct
  ctx.font = '20px monospace';
  if (dat.corrCode !== 1) {
    ctx.fillText('Aufgabe 1 (linke Hand)', -250, 50);
    ctx.font = 'bold 20px monospace';
    ctx.fillText(prms.respLetters[0], -300, 80);
    ctx.fillText(prms.respLetters[1], -200, 80);
    ctx.font = '20px monospace';
    ctx.fillText('("Q-Taste")', -320, 120);
    ctx.fillText('("W-Taste")', -180, 120);

    ctx.fillText('Aufgabe 2 (rechte Hand)', 250, 50);
    ctx.font = 'bold 20px monospace';
    ctx.fillText(prms.respCols[0], 200, 80);
    ctx.fillText(prms.respCols[1], 300, 80);
    ctx.font = '20px monospace';
    ctx.fillText('("O-Taste")', 180, 120);
    ctx.fillText('("P-Taste")', 320, 120);
  }
}

function drawStimulus(args) {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');

  // draw first stimulus (letter)
  ctx.font = prms.letterSize;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';
  ctx.fillText(args['letter'], 0, 0);

  // draw second stimulus (square frame)
  ctx.beginPath();
  ctx.lineWidth = 10;
  ctx.strokeStyle = args['colour'];
  ctx.rect(-40, -40, 80, 80);
  ctx.stroke();
}

function codeTrial() {
  'use strict';
  let dat = jsPsych.data.get().last(1).values()[0];
  let corrCode = 0;
  let corrKeyNum1 = jsPsych.pluginAPI.convertKeyCharacterToKeyCode(dat.corrResp1);
  let corrKeyNum2 = jsPsych.pluginAPI.convertKeyCharacterToKeyCode(dat.corrResp2);

  let soa = dat.soa;
  let rt1 = dat.rt1 !== null ? dat.rt1 : prms.tooSlow;
  let rt2 = dat.rt2 !== null ? dat.rt2 - dat.soa : prms.tooSlow;

  if (
    (dat.key_press1 === corrKeyNum1 && rt1 > prms.tooFast && rt1 < prms.tooSlow) &
    (dat.key_press2 === corrKeyNum2 && rt2 > prms.tooFast && rt2 < prms.tooSlow)
  ) {
    corrCode = 1; // correct
  } else if (
    (dat.key_press1 !== corrKeyNum1 && rt1 > prms.tooFast && rt1 < prms.tooSlow) |
    (dat.key_press2 !== corrKeyNum2 && rt2 > prms.tooFast && rt2 < prms.tooSlow)
  ) {
    corrCode = 2; // choice error
  } else if (rt2 >= prms.tooSlow) {
    corrCode = 3; // too slow
  } else if (rt1 <= prms.tooFast) {
    corrCode = 4; // too false
  } else if (rt2 <= prms.tooFast) {
    corrCode = 4; // too false
  }

  jsPsych.data.addDataToLastTrial({
    date: Date(),
    rt1: rt1,
    rt2: rt2,
    corrCode: corrCode,
    blockNum: prms.cBlk,
    trialNum: prms.cTrl,
  });
  prms.cTrl += 1;
  if (dat.key_press === 27) {
    jsPsych.endExperiment();
  }
}

const trial_feedback = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  translate_origin: true,
  response_ends_trial: false,
  func: drawFeedback,
  on_start: function (trial) {
    let dat = jsPsych.data.get().last(1).values()[0];
    trial.trial_duration = prms.fbDur[dat.corrCode - 1];
  },
};

const iti = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  trial_duration: prms.iti,
  response_ends_trial: false,
  func: function () {},
};

// function blockFeedbackTxt_de_du(filter_options) {
//     "use strict";
//     let dat = jsPsych.data.get().filter({...filter_options, blockNum: prms.cBlk});
//     let nTotal = dat.count();
//     let nError = dat.select("corrCode").values.filter(function (x) { return x !== 1; }).length;
//     dat = jsPsych.data.get().filter({...filter_options, blockNum: prms.cBlk, corrCode: 1});
//     let blockFbTxt = "<H1>Block: " + prms.cBlk + " von " + prms.nBlks + "</H1><br>" +
//         "<H1>Mittlere Reaktionszeit: " + (Math.round(dat.select("rt1").mean()) + Math.round(dat.select("rt2").mean())) + " ms </H1>" +
//         "<H1>Fehlerrate: " + Math.round((nError / nTotal) * 100) + " %</H1><br>" +
//         "<H2>Drücke eine beliebige Taste um fortzufahren!</H2>";
//     prms.cBlk += 1;
//     return blockFbTxt;
// }

function blockStartText() {
  'use strict';
  let blockStartTxt =
    '<H1>Block: ' +
    prms.cBlk +
    ' von ' +
    prms.nBlks +
    '</H1><br>' +
    "<h3 style='text-align: center;'>Aufgabe 1 (linke Hand)  &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; Aufgabe 2 (rechte Hand)</h3>" +
    "<h2 style='text-align: center;'>" +
    '&emsp;&emsp;' +
    prms.respLetters[0] +
    '&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;' +
    prms.respLetters[1] +
    '&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; &emsp; &emsp;' +
    prms.respCols[0] +
    '&emsp;&emsp;&emsp;&emsp;&emsp;' +
    prms.respCols[1] +
    '</h2>' +
    "<h3 style='text-align: center;'>" +
    '("Q-Taste") &emsp;&emsp;&emsp;&emsp; ("W-Taste") &emsp;&emsp;&emsp;&emsp;&emsp; ("O-Taste") &emsp;&emsp;&emsp;&emsp; ("P-Taste")' +
    '</h3><br>' +
    '<H3>Bitte versuche so schnell und so genau wie möglich zu sein! </H3><br>' +
    '<H2>Drücke eine beliebige Taste um fortzufahren!</H2>';
  return blockStartTxt;
}

function blockEndText() {
  'use strict';
  let blockEndTxt =
    '<H1>Pause</H1><br>' +
    '<H3>Bitte versuche weiterhin so schnell und so genau wie möglich zu sein! </H3><br>' +
    '<H2>Drücke eine beliebige Taste um fortzufahren!</H2>';
  prms.cBlk += 1;
  return blockEndTxt;
}

const block_start = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  stimulus: '',
  response_ends_trial: true,
  on_start: function (trial) {
    trial.stimulus = blockStartText();
  },
};

const block_end = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  stimulus: '',
  response_ends_trial: true,
  on_start: function (trial) {
    trial.stimulus = blockEndText();
  },
};

const prp_stimulus = {
  type: 'static-canvas-keyboard-multiple-response',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  trial_duration: prms.trialDuration,
  translate_origin: true,
  stimulus_onset: [0, jsPsych.timelineVariable('soa')],
  clear_screen: [1, 1],
  stimulus_duration: prms.tooSlow,
  response_ends_trial: true,
  choices: prms.respKeys,
  func: [drawStimulus, drawStimulus],
  func_args: [
    {
      letter: jsPsych.timelineVariable('t1_letter'),
      colour: jsPsych.timelineVariable('t2_1_colour'),
    },
    {
      letter: jsPsych.timelineVariable('t1_letter'),
      colour: jsPsych.timelineVariable('t2_2_colour'),
    },
  ],
  data: {
    stim: 'prp',
    soa: jsPsych.timelineVariable('soa'),
    corrResp1: jsPsych.timelineVariable('corrResp1'),
    corrResp2: jsPsych.timelineVariable('corrResp2'),
  },
  on_finish: function () {
    codeTrial();
  },
};

const trial_timeline = {
  timeline: [fixation_cross, prp_stimulus, trial_feedback, iti],
  timeline_variables: [
    {
      t1_letter: prms.respLetters[0],
      t2_1_colour: cc,
      t2_2_colour: prms.respCols[0],
      soa: prms.soa[0],
      corrResp1: prms.respKeys1[0],
      corrResp2: prms.respKeys2[0],
    },
    {
      t1_letter: prms.respLetters[1],
      t2_1_colour: cc,
      t2_2_colour: prms.respCols[0],
      soa: prms.soa[0],
      corrResp1: prms.respKeys1[1],
      corrResp2: prms.respKeys2[0],
    },
    {
      t1_letter: prms.respLetters[0],
      t2_1_colour: cc,
      t2_2_colour: prms.respCols[1],
      soa: prms.soa[0],
      corrResp1: prms.respKeys1[0],
      corrResp2: prms.respKeys2[1],
    },
    {
      t1_letter: prms.respLetters[1],
      t2_1_colour: cc,
      t2_2_colour: prms.respCols[1],
      soa: prms.soa[0],
      corrResp1: prms.respKeys1[1],
      corrResp2: prms.respKeys2[1],
    },
    {
      t1_letter: prms.respLetters[0],
      t2_1_colour: cc,
      t2_2_colour: prms.respCols[0],
      soa: prms.soa[1],
      corrResp1: prms.respKeys1[0],
      corrResp2: prms.respKeys2[0],
    },
    {
      t1_letter: prms.respLetters[1],
      t2_1_colour: cc,
      t2_2_colour: prms.respCols[0],
      soa: prms.soa[1],
      corrResp1: prms.respKeys1[1],
      corrResp2: prms.respKeys2[0],
    },
    {
      t1_letter: prms.respLetters[0],
      t2_1_colour: cc,
      t2_2_colour: prms.respCols[1],
      soa: prms.soa[1],
      corrResp1: prms.respKeys1[0],
      corrResp2: prms.respKeys2[1],
    },
    {
      t1_letter: prms.respLetters[1],
      t2_1_colour: cc,
      t2_2_colour: prms.respCols[1],
      soa: prms.soa[1],
      corrResp1: prms.respKeys1[1],
      corrResp2: prms.respKeys2[1],
    },
  ],
};

const randomString = generateRandomString(16);

const alphaNum = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  response_ends_trial: true,
  choices: [32],
  stimulus:
    "<h3 style='text-align:left;'>Vielen Dank für Ihre Teilnahme.</h3>" +
    "<h3 style='text-align:left;'>Wenn Sie Versuchspersonenstunden (0,5) benötigen, kopieren Sie den </h3>" +
    "<h3 style='text-align:left;'>folgenden zufällig generierten Code und senden Sie diesen zusammen mit </h3>" +
    "<h3 style='text-align:left;'>Ihrer Matrikelnummer per Email an:</h3><br>" +
    '<h2>hiwipibio@gmail.com</h2>' +
    '<h1>Code: ' +
    randomString +
    '</h1><br>' +
    "<h2 style='text-align:left;'>Drücken Sie die Leertaste, um fortzufahren!</h2>",
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
  'use strict';

  let exp = [];

  exp.push(fullscreen_on);
  exp.push(welcome_de_du);
  exp.push(resize_de_du);
  // exp.push(vpInfoForm_de)
  exp.push(task_instructions1);
  exp.push(task_instructions2);
  exp.push(task_instructions3);
  exp.push(task_instructions4);
  exp.push(hideMouseCursor);

  for (let blk = 0; blk < prms.nBlks; blk += 1) {
    let blk_timeline = { ...trial_timeline };
    blk_timeline.sample = { type: 'fixed-repetitions', size: blk === 0 ? prms.nTrlsP / 8 : prms.nTrlsE / 8 };
    exp.push(block_start);
    exp.push(blk_timeline); // trials within a block
    exp.push(block_end);
  }
  exp.push(debrief_de);
  exp.push(showMouseCursor);
  exp.push(alphaNum);
  exp.push(fullscreen_off);

  return exp;
}
const EXP = genExpSeq();

const data_filename = dirName + 'data/' + expName + '_' + vpNum;
const code_filename = dirName + 'code/' + expName;

jsPsych.init({
  timeline: EXP,
  fullscreen: true,
  show_progress_bar: false,
  exclusions: {
    min_width: cs[0],
    min_height: cs[1],
  },
  on_finish: function () {
    saveData('/Common/write_data.php', data_filename, { stim: 'prp' });
    saveRandomCode('/Common/write_code.php', code_filename, randomString);
  },
});
