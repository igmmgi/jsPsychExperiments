// Basic version of a PRP Task:
// Version 1: Arrow --> Tone

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

// version 1: Arrow --> Tone
// taskOrder 1: PRP --> TaskSwitch --> PRP --> TaskSwitch ...
// taskOrder 2: TaskSwitch --> PRP --> TaskSwitch --> PRP ...
const taskOrder = Number(jsPsych.data.urlVariables().taskOrder);
jsPsych.data.addProperties({ version: 1, taskOrder: taskOrder });

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
  nTrlsP: 32, // number of trials in first block (practice)
  nTrlsE: 64, // number of trials in subsequent blocks
  nBlks: 10,
  fixDur: 500,
  fbDur: [1000, 4000, 4000, 4000],
  soa: [50, 1000],
  iti: 500,
  tooFast: 100,
  tooSlow: 4000,
  trialDuration: 4000,
  fbTxt: ['Richtig', 'Falsch', 'Zu langsam', 'Zu schnell'],
  cTrl: 1, // count trials
  cBlk: 1, // count blocks
  respArrows: ['🡸', '🡺'],
  respTones: ['tones/low.wav', 'tones/high.wav'],
  fixWidth: 2,
  fixSize: 10,
  letterSize: '50px monospace',
  fbSize: '20px monospace',
  respKeys1: ['Q', 'P'],
  respKeys2: ['W', 'O'],
  respKeys: ['Q', 'P', 'W', 'O'],
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
    "<h3 style='text-align: left;'>Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und </h3>" +
    "<h3 style='text-align: left;'>genügend Zeit hast, um das Experiment durchzuführen.</h3><br>" +
    "<h3 style='text-align: left;'>WICHTIG: In diesem Experiment wirst du auf Töne reagieren müssen.</h3>" +
    "<h3 style='text-align: left;'>Bitte stelle sicher, dass dein Computer/Laptop Sounds abspielen kann.</h3>" +
    "<h3 style='text-align: left;'>Du kannst gerne Kopfhörer vervenden.</h3><br>" +
    "<h3 style='text-align: center;'>Wir bitten dich die ca. 35-40 Minuten konzentriert zu arbeiten.</h3><br>" +
    "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>",
};

const task_instructions2 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  stimulus:
    "<h3 style='text-align: left;'>In diesem Experiment gibt es zwei Aufgaben:</h3><br>" +
    "<h3 style='text-align: left;'>Aufgabe 1 = Mittelfinger: Bitte platziere hierzu deine Mittelfinger </h3>" +
    "<h3 style='text-align: left;'>auf die Tasten „Q“ und „P“.</h3><br>" +
    "<h3 style='text-align: left;'>Aufgabe 2 = Zeigefinger: Bitte platziere hierzu deine Zeigefinger </h3>" +
    "<h3 style='text-align: left;'>auf die Tasten „W“ und „O“.</h3><br>" +
    "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>",
};

const task_instructions_prp = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  stimulus:
    "<h1 style='text-align: center;'>***DUAL-BLOCK***</h1>" +
    "<h3 style='text-align: left;'>In jedem Durchgang musst du erst auf den Pfeil reagieren. Nachdem du auf</h3>" +
    "<h3 style='text-align: left;'>den Pfeil reagiert hast, musst du auf die Höhe des Tones reagiere.</h3>" +
    "<h3 style='text-align: left;'>Reagiere wie folgt:</h3><br>" +
    "<h3 style='text-align: center;'>Aufgabe 1 (Pfeilaufgabe): Mittelfinger</h3>" +
    "<h3 style='text-align: center;'>Aufgabe 2 (Tonaufgabe): Zeigefinger</h3><br>" +
    "<h2 style='text-align: left;'>&emsp;&emsp;&emsp;&emsp;&emsp;" +
    prms.respArrows[0] +
    '&emsp;&emsp;&emsp;&emsp;&emsp;' +
    'Tiefer Ton' +
    '&emsp;&emsp;&emsp;&emsp;Hoher Ton' +
    '&emsp;&emsp;&emsp;&emsp;' +
    prms.respArrows[1] +
    "<h3 style='text-align: left;'>" +
    '&emsp;&emsp;&emsp;&emsp;("Q-Taste") &emsp;&emsp;&emsp;&emsp; ("W-Taste") &emsp;&emsp;&emsp;&emsp;&emsp; ("O-Taste") &emsp;&emsp;&emsp;&emsp; ("P-Taste")' +
    '</h3><br>' +
    "<h3 style='text-align: left;'>Warte nicht mit der Bearbeitung die 1. Aufgabe bis die 2. Aufgabe präsentiert wird!</h3><br>" +
    "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>",
};

const task_instructions_ts = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  stimulus:
    "<h1 style='text-align: center;'>***SINGLE-BLOCK***</h1>" +
    "<h3 style='text-align: left;'>In jedem Durchgang musst du auf den Pfeil ODER Höhe des Tones reagieren.</h3>" +
    "<h3 style='text-align: left;'>Reagiere wie folgt:.</h3>" +
    "<h3 style='text-align: center;'>Pfeilaufgabe: Mittelfinger</h3>" +
    "<h3 style='text-align: center;'>Tonaufgabe: Zeigefinger</h3><br>" +
    "<h2 style='text-align: left;'>&emsp;&emsp;&emsp;&emsp;&emsp;" +
    prms.respArrows[0] +
    '&emsp;&emsp;&emsp;&emsp;&emsp;' +
    'Tiefer Ton' +
    '&emsp;&emsp;&emsp;&emsp;Hoher Ton' +
    '&emsp;&emsp;&emsp;&emsp;' +
    prms.respArrows[1] +
    "<h3 style='text-align: left;'>" +
    '&emsp;&emsp;&emsp;&emsp;("Q-Taste") &emsp;&emsp;&emsp;&emsp; ("W-Taste") &emsp;&emsp;&emsp;&emsp;&emsp; ("O-Taste") &emsp;&emsp;&emsp;&emsp; ("P-Taste")' +
    '</h3><br>' +
    "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>",
};

const task_instructions_calibration = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  stimulus:
    "<h3 style='text-align: center;'>ACHTUNG-Soundkalibierung: </h3>" +
    "<h3 style='text-align: left;'>Im Folgenden werden dir eine Reihe von HOHEN und TIEFEN Tönen präsentiert.</h3>" +
    "<h3 style='text-align: left;'>Bitte stelle in dieser Zeit die Lautstärke deines Soundsystems so ein, dass du </h3>" +
    "<h3 style='text-align: left;'>deutlich zwischen den zwei Tönen differenzieren kannst.</h3>" +
    "<h3 style='text-align: left;'>Anmerkung: Es geht immer automatisch weiter (d.h. du musst keine Taste drucken!).</h3><br>" +
    "<h2 style='text-align: center;'>Bereit? Drücke eine beliebige Taste, um die Töne abzuspielen!</h2>",
};

// Audio Stimuli
const audio = ['tones/low.wav', 'tones/high.wav'];

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

const audio_calibration_low = {
  type: 'audio-button-response',
  stimulus: 'tones/low.wav',
  choices: [],
  trial_duration: 500,
  response_ends_trial: false,
  prompt: '<H1>Tiefer Ton</H1>',
  post_trial_gap: 750,
};

const audio_calibration_high = {
  type: 'audio-button-response',
  stimulus: 'tones/high.wav',
  choices: [],
  trial_duration: 500,
  response_ends_trial: false,
  prompt: '<H1>Hoher Ton</H1>',
  post_trial_gap: 750,
};

const audio_calibration = shuffle(new Array(10).fill([audio_calibration_low, audio_calibration_high]).flat());

function drawFeedbackPRP() {
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
    ctx.fillText('Aufgabe 1 (Pfeilaufgabe): Mittelfinger', 0, 50);
    ctx.fillText('Aufgabe 2 (Tonaufgabe): Zeigefinger', 0, 80);
    ctx.font = 'bold 20px monospace';
    ctx.fillText(prms.respArrows[0], -300, 150);
    ctx.fillText('Tiefer Ton', -180, 150);
    ctx.font = '20px monospace';
    ctx.fillText('("Q-Taste")', -320, 180);
    ctx.fillText('("W-Taste")', -160, 180);
    ctx.font = 'bold 20px monospace';
    ctx.fillText('Hoher Ton', 180, 150);
    ctx.fillText(prms.respArrows[1], 340, 150);
    ctx.font = '20px monospace';
    ctx.fillText('("O-Taste")', 180, 180);
    ctx.fillText('("P-Taste")', 340, 180);
  }
}

function drawFeedbackTS() {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  let dat = jsPsych.data.get().last(1).values()[0];
  ctx.font = prms.fbSize;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';
  ctx.fillText(prms.fbTxt[dat.corrCode - 1], 0, 0);

  ctx.font = '20px monospace';
  if (dat.corrCode !== 1) {
    if (dat.task === 'tone') {
      ctx.fillText('Tonaufgabe: Zeigefinger', 0, 50);
      ctx.font = 'bold 20px monospace';
      ctx.fillText('Tiefer Ton', -150, 100);
      ctx.fillText('Hoher Ton', 150, 100);
      ctx.font = '20px monospace';
      ctx.fillText('("W-Taste")', -150, 130);
      ctx.fillText('("O-Taste")', 150, 130);
    } else if (dat.task === 'arrow') {
      ctx.fillText('Pfeilaufgabe: Mittelfinger', 0, 50);
      ctx.font = 'bold 20px monospace';
      ctx.fillText(prms.respArrows[0], -150, 100);
      ctx.font = '20px monospace';
      ctx.fillText('("Q-Taste")', -150, 130);
      ctx.fillText('("P-Taste")', 150, 130);
      ctx.font = 'bold 20px monospace';
      ctx.fillText(prms.respArrows[1], 150, 100);
      ctx.font = '20px monospace';
    }
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
  ctx.fillText(args.letter, 0, 0);
}

function codeTrialPRP() {
  'use strict';
  let dat = jsPsych.data.get().last(1).values()[0];
  let corrCode = 0;
  let corrKeyNum1 = jsPsych.pluginAPI.convertKeyCharacterToKeyCode(dat.corrResp1);
  let corrKeyNum2 = jsPsych.pluginAPI.convertKeyCharacterToKeyCode(dat.corrResp2);

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
}

function codeTrialTS() {
  'use strict';
  let dat = jsPsych.data.get().last(1).values()[0];
  let corrCode = 0;
  let corrKeyNum1 = jsPsych.pluginAPI.convertKeyCharacterToKeyCode(dat.corrResp1);

  let rt1 = dat.rt1 !== null ? dat.rt1 : prms.tooSlow;

  if (dat.key_press1 === corrKeyNum1 && rt1 > prms.tooFast && rt1 < prms.tooSlow) {
    corrCode = 1; // correct
  } else if (dat.key_press1 !== corrKeyNum1 && rt1 > prms.tooFast && rt1 < prms.tooSlow) {
    corrCode = 2; // choice error
  } else if (rt1 >= prms.tooSlow) {
    corrCode = 3; // too slow
  } else if (rt1 <= prms.tooFast) {
    corrCode = 4; // too false
  }

  jsPsych.data.addDataToLastTrial({
    date: Date(),
    rt1: rt1,
    rt2: null,
    corrCode: corrCode,
    blockNum: prms.cBlk,
    trialNum: prms.cTrl,
  });
  prms.cTrl += 1;
}

const trial_feedback_prp = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  translate_origin: true,
  response_ends_trial: false,
  func: drawFeedbackPRP,
  on_start: function (trial) {
    let dat = jsPsych.data.get().last(1).values()[0];
    trial.trial_duration = prms.fbDur[dat.corrCode - 1];
  },
};

const trial_feedback_ts = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  translate_origin: true,
  response_ends_trial: false,
  func: drawFeedbackTS,
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

function blockStartTextPRP() {
  'use strict';
  let blockStartTxt =
    '<h1>Block: ' +
    prms.cBlk +
    ' von ' +
    prms.nBlks +
    '</h1><br>' +
    "<h1 style='text-align: center;'>***DUAL-BLOCK***</h1><br>" +
    "<h3 style='text-align: center;'>Aufgabe 1 (Pfeilaufgabe): Mittelfinger</h3>" +
    "<h3 style='text-align: center;'>Aufgabe 2 (Tonaufgabe): Zeigefinger</h3><br>" +
    "<h2 style='text-align: left;'>&emsp;&emsp;&emsp;&emsp;&emsp;" +
    prms.respArrows[0] +
    '&emsp;&emsp;&emsp;&emsp;&emsp;' +
    'Tiefer Ton' +
    '&emsp;&emsp;&emsp;&emsp;Hoher Ton' +
    '&emsp;&emsp;&emsp;&emsp;' +
    prms.respArrows[1] +
    "<h3 style='text-align: left;'>" +
    '&emsp;&emsp;&emsp;&emsp;("Q-Taste") &emsp;&emsp;&emsp;&emsp; ("W-Taste") &emsp;&emsp;&emsp;&emsp;&emsp; ("O-Taste") &emsp;&emsp;&emsp;&emsp; ("P-Taste")' +
    '</h3><br>' +
    "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>";
  return blockStartTxt;
}

function blockStartTextTS() {
  'use strict';
  let blockStartTxt =
    '<H1>Block: ' +
    prms.cBlk +
    ' von ' +
    prms.nBlks +
    '</H1><br>' +
    "<h1 style='text-align: center;'>***SINGLE-BLOCK***</h1><br>" +
    "<h3 style='text-align: center;'>Pfeilaufgabe (Mittelfinger)</h3>" +
    "<h3 style='text-align: center;'>ODER</h3>" +
    "<h3 style='text-align: center;'>Tonaufgabe (Zeigefinger)</h3><br>" +
    "<h2 style='text-align: left;'>&emsp;&emsp;&emsp;&emsp;&emsp;" +
    prms.respArrows[0] +
    '&emsp;&emsp;&emsp;&emsp;&emsp;' +
    'Tiefer Ton' +
    '&emsp;&emsp;&emsp;&emsp;Hoher Ton' +
    '&emsp;&emsp;&emsp;&emsp;' +
    prms.respArrows[1] +
    "<h3 style='text-align: left;'>" +
    '&emsp;&emsp;&emsp;&emsp;("Q-Taste") &emsp;&emsp;&emsp;&emsp; ("W-Taste") &emsp;&emsp;&emsp;&emsp;&emsp; ("O-Taste") &emsp;&emsp;&emsp;&emsp; ("P-Taste")' +
    '</h3><br>' +
    "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>";
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

const block_start_prp = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  stimulus: '',
  response_ends_trial: true,
  on_start: function (trial) {
    trial.stimulus = blockStartTextPRP();
  },
};

const block_start_ts = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  stimulus: '',
  response_ends_trial: true,
  on_start: function (trial) {
    trial.stimulus = blockStartTextTS();
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
  type: 'static-canvas-keyboard-multiple-response-visual-sound',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  sound_stimulus: jsPsych.timelineVariable('tone'),
  sound_onset: jsPsych.timelineVariable('soa'),
  trial_duration: prms.trialDuration,
  translate_origin: true,
  stimulus_onset: 0,
  stimulus_duration: prms.trialDuration,
  response_ends_trial: true,
  choices: prms.respKeys,
  func: [drawStimulus],
  func_args: [{ letter: jsPsych.timelineVariable('arrow') }],
  data: {
    stim: 'prp',
    task: jsPsych.timelineVariable('task'),
    arrowDirection: jsPsych.timelineVariable('arrowDirection'),
    tone: jsPsych.timelineVariable('tone'),
    soa: jsPsych.timelineVariable('soa'),
    corrResp1: jsPsych.timelineVariable('corrResp1'),
    corrResp2: jsPsych.timelineVariable('corrResp2'),
  },
  on_finish: function () {
    codeTrialPRP();
  },
};

// prettier-ignore
const trial_timeline_prp = {
  timeline: [fixation_cross, prp_stimulus, trial_feedback_prp, iti],
  timeline_variables: [
    { task: "prp", arrow: prms.respArrows[0], arrowDirection: 'left',  tone: prms.respTones[0], soa: prms.soa[0], corrResp1: prms.respKeys1[0], corrResp2: prms.respKeys2[0] },
    { task: "prp", arrow: prms.respArrows[1], arrowDirection: 'right', tone: prms.respTones[0], soa: prms.soa[0], corrResp1: prms.respKeys1[1], corrResp2: prms.respKeys2[0] },
    { task: "prp", arrow: prms.respArrows[0], arrowDirection: 'left',  tone: prms.respTones[1], soa: prms.soa[0], corrResp1: prms.respKeys1[0], corrResp2: prms.respKeys2[1] },
    { task: "prp", arrow: prms.respArrows[1], arrowDirection: 'right', tone: prms.respTones[1], soa: prms.soa[0], corrResp1: prms.respKeys1[1], corrResp2: prms.respKeys2[1] },
    { task: "prp", arrow: prms.respArrows[0], arrowDirection: 'left',  tone: prms.respTones[0], soa: prms.soa[1], corrResp1: prms.respKeys1[0], corrResp2: prms.respKeys2[0] },
    { task: "prp", arrow: prms.respArrows[1], arrowDirection: 'right', tone: prms.respTones[0], soa: prms.soa[1], corrResp1: prms.respKeys1[1], corrResp2: prms.respKeys2[0] },
    { task: "prp", arrow: prms.respArrows[0], arrowDirection: 'left',  tone: prms.respTones[1], soa: prms.soa[1], corrResp1: prms.respKeys1[0], corrResp2: prms.respKeys2[1] },
    { task: "prp", arrow: prms.respArrows[1], arrowDirection: 'right', tone: prms.respTones[1], soa: prms.soa[1], corrResp1: prms.respKeys1[1], corrResp2: prms.respKeys2[1] },
  ],
};

const task_switch_stimulus = {
  type: 'static-canvas-keyboard-multiple-response-visual-sound',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  sound_stimulus: jsPsych.timelineVariable('tone'),
  sound_onset: 0,
  trial_duration: prms.trialDuration,
  translate_origin: true,
  stimulus_onset: 0,
  stimulus_duration: prms.trialDuration,
  response_ends_trial: true,
  number_responses: 1,
  choices: prms.respKeys,
  func: [drawStimulus],
  func_args: [{ letter: jsPsych.timelineVariable('arrow') }],
  data: {
    stim: 'prp',
    task: jsPsych.timelineVariable('task'),
    arrowDirection: jsPsych.timelineVariable('arrowDirection'),
    tone: jsPsych.timelineVariable('tone'),
    soa: jsPsych.timelineVariable('soa'),
    corrResp1: jsPsych.timelineVariable('corrResp1'),
    corrResp2: jsPsych.timelineVariable('corrResp2'),
  },
  on_start: function (trial) {
    if (trial.data.task === 'arrow') {
      trial.stimulus_onset = 0;
      trial.sound_onset = null;
    } else if (trial.data.task === 'tone') {
      trial.stimulus_onset = null;
      trial.sound_onset = 0;
    }
  },
  on_finish: function () {
    codeTrialTS();
  },
};

// prettier-ignore
const trial_timeline_task_switch = {
  timeline: [fixation_cross, task_switch_stimulus, trial_feedback_ts, iti],
  timeline_variables: [
    { task: "arrow", arrow: prms.respArrows[0], arrowDirection: 'left',  tone: prms.respTones[0], soa: null, corrResp1: prms.respKeys1[0], corrResp2: null },
    { task: "arrow", arrow: prms.respArrows[1], arrowDirection: 'right', tone: prms.respTones[0], soa: null, corrResp1: prms.respKeys1[1], corrResp2: null },
    { task: "arrow", arrow: prms.respArrows[0], arrowDirection: 'left',  tone: prms.respTones[1], soa: null, corrResp1: prms.respKeys1[0], corrResp2: null },
    { task: "arrow", arrow: prms.respArrows[1], arrowDirection: 'right', tone: prms.respTones[1], soa: null, corrResp1: prms.respKeys1[1], corrResp2: null },
    { task: "tone",  arrow: prms.respArrows[0], arrowDirection: 'left',  tone: prms.respTones[0], soa: null, corrResp1: prms.respKeys2[0], corrResp2: null },
    { task: "tone",  arrow: prms.respArrows[1], arrowDirection: 'right', tone: prms.respTones[0], soa: null, corrResp1: prms.respKeys2[0], corrResp2: null },
    { task: "tone",  arrow: prms.respArrows[0], arrowDirection: 'left',  tone: prms.respTones[1], soa: null, corrResp1: prms.respKeys2[1], corrResp2: null },
    { task: "tone",  arrow: prms.respArrows[1], arrowDirection: 'right', tone: prms.respTones[1], soa: null, corrResp1: prms.respKeys2[1], corrResp2: null },
  ],
};

const randomString = generateRandomStringWithExpName('prp4_', 16);

const alphaNum = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  response_ends_trial: true,
  choices: [32],
  stimulus:
    "<h3 style='text-align:left;'>Vielen Dank für Ihre Teilnahme.</h3>" +
    "<h3 style='text-align:left;'>Wenn Sie Versuchspersonenstunden (1,0) benötigen, kopieren Sie den </h3>" +
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

  exp.push(welcome_de_du_click);
  exp.push(resize_de_du);
  exp.push(vpInfoForm_de);
  exp.push(task_instructions1);

  // Audio calibration routine
  exp.push(task_instructions_calibration);
  for (let i = 0; i < audio_calibration.length; i++) {
    exp.push(audio_calibration[i]);
  }

  exp.push(fullscreen_on);
  exp.push(hideMouseCursor);

  let taskType;
  if (taskOrder === 1) {
    taskType = repeatArray(['prp', 'taskSwitch'], prms.nBlks / 2);
  } else if (taskOrder === 2) {
    taskType = repeatArray(['taskSwitch', 'prp'], prms.nBlks / 2);
  }

  exp.push(task_instructions2);
  for (let blk = 0; blk < prms.nBlks; blk += 1) {
    if (taskType[blk] === 'prp') {
      let blk_timeline = { ...trial_timeline_prp };
      blk_timeline.sample = { type: 'fixed-repetitions', size: blk === 0 ? prms.nTrlsP / 8 : prms.nTrlsE / 8 };
      exp.push(task_instructions_prp);
      exp.push(block_start_prp);
      exp.push(blk_timeline); // trials within a block
      exp.push(block_end);
    } else if (taskType[blk] === 'taskSwitch') {
      let blk_timeline = { ...trial_timeline_task_switch };
      blk_timeline.sample = { type: 'fixed-repetitions', size: blk === 0 ? prms.nTrlsP / 8 : prms.nTrlsE / 8 };
      exp.push(task_instructions_ts);
      exp.push(block_start_ts);
      exp.push(blk_timeline); // trials within a block
      exp.push(block_end);
    }
  }
  exp.push(debrief_de);
  exp.push(showMouseCursor);
  exp.push(alphaNum);
  exp.push(fullscreen_off);

  return exp;
}
const EXP = genExpSeq();

const data_filename = dirName + 'data/order' + taskOrder + '/' + expName + '_' + vpNum;
const code_filename = dirName + 'code/' + expName;

jsPsych.init({
  timeline: EXP,
  preload_audio: audio,
  use_webaudio: true,
  exclusions: {
    min_width: cs[0],
    min_height: cs[1],
  },
  on_finish: function () {
    saveData('/Common/write_data.php', data_filename, { stim: 'prp' });
    saveRandomCode('/Common/write_code.php', code_filename, randomString);
  },
});
