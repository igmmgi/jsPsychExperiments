// Modified version of a Flanker Task:
// VPs respond to the central letter within a 5-letter array (e.g., HHHHH, SSHSS)
//  whilst ignoring the surrounding letters using left and right key-presses ("Q" and "P").
// 50% of trials involve the presentation of the "flankers"
//  first followed by the presentation of the "target" HH HH -> H
// 50% of trials involve the presentation of the "target"
//  first followed by the presentation of the "flankers" H -> HH HH

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

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
  nTrlsP: 32, // number of trials in first block (practice)
  nTrlsE: 72, // number of trials in subsequent blocks
  nBlks: 14,
  fixDur: 500,
  flankDur: 150,
  fbDur: [500, 1000, 1000, 1000],
  iti: 500,
  tooFast: 100,
  tooSlow: 2000,
  fbTxt: ['Richtig', 'Falsch', 'Zu langsam', 'Zu schnell'],
  cTrl: 1, // count trials
  cBlk: 1, // count blocks
  fixWidth: 2,
  fixSize: 10,
  flankSize: '30px monospace',
  fbSize: '20px monospace',
  respKeys: [],
};

const nVersion = getVersionNumber(nFiles, 2);
jsPsych.data.addProperties({ version: nVersion });
let respText;
if (nVersion === 1) {
  prms.respKeys = ['Q', 'P', 27];
  respText =
    "<h3 style='text-align:center;'><b>GRÜN = Taste 'Q'</b> (linker Zeigefinger).</h3>" +
    "<h3 style='text-align:center;'><b>BLAU = Taste 'P'</b> (rechter Zeigefinger).</h3><br>";
} else {
  prms.respKeys = ['P', 'Q', 27];
  respText =
    "<h3 style='text-align:center;'><b>BLAU = Taste 'Q'</b> (linker Zeigefinger).</h3>" +
    "<h3 style='text-align:center;'><b>GRÜN = Taste 'P'</b> (rechter Zeigefinger).</h3><br>";
}

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
    "<h3 style='text-align: center;'>Diese Studie wird im Rahmen einer B.Sc. Projektarbeit durchgeführt.</h3>" +
    "<h3 style='text-align: center;'>Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.</h3><br>" +
    "<h3 style='text-align: center;'>Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und </h3>" +
    "<h3 style='text-align: center;'>genügend Zeit hast, um das Experiment durchzuführen.</h3><br>" +
    "<h3 style='text-align: center;'>Wir bitten dich die ca. 45 Minuten konzentriert zu arbeiten.</h3><br>" +
    "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>",
};

const task_instructions2 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  stimulus:
    "<h2 style='text-align: center;'>Aufgabe:</h2>" +
    "<h3 style='text-align: center;'>Bitte reagiere immer nur auf die Farbe des zentralen „#“-Zeichens </h3>" +
    "<h3 style='text-align: center;'>in der Mitte und ignoriere die umliegenden „#-Zeichen“. Es gilt:</h3>" +
    respText +
    "<h3 style='text-align: center;'>Bitte reagiere so schnell und korrekt wie möglich.</h3><br>" +
    "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>",
};

const task_reminder = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  stimulus:
    "<h3 style='text-align: center;'>Versuche weiterhin so schnell und so genau wie möglich zu reagieren.</h3><br>" +
    "<h3 style='text-align: center;'>Wenn du wieder bereit für den nächsten Block bist, dann positioniere</h3>" +
    "<h3 style='text-align: center;'>deine Hände wieder auf der Tastatur. Es gilt weiterhin:</h3><br>" +
    respText +
    "<h2 style='text-align: center;'>Weiter mit beliebiger Taste!</h2>",
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
}

function drawFlanker(args) {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  ctx.font = prms.flankSize;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // draw target
  ctx.fillStyle = args['tCol'];
  ctx.fillText('#', 0, 0);

  // draw flankers
  ctx.fillStyle = args['fCol'];
  ctx.fillText('## ##', 0, 0);
}

function codeTrial() {
  'use strict';
  let dat = jsPsych.data.get().last(1).values()[0];
  let corrCode = 0;
  let corrKeyNum = jsPsych.pluginAPI.convertKeyCharacterToKeyCode(dat.corrResp);

  let offset = dat.rt === null ? 0 : prms.flankDur;
  let rt = dat.rt !== null ? dat.rt : prms.tooSlow;
  rt = dat.order === 'RI' ? rt : rt - offset;

  if (dat.key_press === corrKeyNum && rt > prms.tooFast && rt < prms.tooSlow) {
    corrCode = 1; // correct
  } else if (dat.key_press !== corrKeyNum && rt > prms.tooFast && rt < prms.tooSlow) {
    corrCode = 2; // choice error
  } else if (rt >= prms.tooSlow) {
    corrCode = 3; // too slow
  } else if (rt <= prms.tooFast) {
    corrCode = 4; // too fast
  }

  jsPsych.data.addDataToLastTrial({
    date: Date(),
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

const trial_feedback = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  translate_origin: true,
  response_ends_trial: false,
  func: drawFeedback,
  on_start: function(trial) {
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
  func: function() { },
};

const block_feedback = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  stimulus: '',
  response_ends_trial: true,
  on_start: function(trial) {
    trial.stimulus = blockFeedbackTxt_de_du({ stim: 'flanker' });
  },
};

const flanker_stimulus = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  translate_origin: true,
  stimulus_onset: [0, 150],
  response_ends_trial: true,
  choices: prms.respKeys,
  clear_screen: [1, 1],
  stimulus_duration: 300,
  func: [drawFlanker, drawFlanker],
  func_args: [
    { fCol: jsPsych.timelineVariable('f1Col'), tCol: jsPsych.timelineVariable('t1Col') },
    { fCol: jsPsych.timelineVariable('f2Col'), tCol: jsPsych.timelineVariable('t2Col') },
  ],
  data: {
    stim: 'flanker',
    flanker: jsPsych.timelineVariable('stimulus'),
    comp: jsPsych.timelineVariable('comp'),
    order: jsPsych.timelineVariable('order'),
    corrResp: jsPsych.timelineVariable('corrResp'),
  },
  on_start: function(trial) {
    if (trial.data.order === 'RI') {
      trial.trial_duration = prms.tooSlow;
    } else {
      trial.trial_duration = prms.tooSlow + prms.flankDur;
    }
  },
  on_finish: function() {
    codeTrial();
  },
};

const trial_timeline = {
  timeline: [fixation_cross, flanker_stimulus, trial_feedback, iti],
  timeline_variables: [
    {
      stimulus: '#####',
      f1Col: cc,
      t1Col: 'green',
      f2Col: 'green',
      t2Col: cc,
      comp: 'comp',
      order: 'RI',
      corrResp: prms.respKeys[0],
    },
    {
      stimulus: '#####',
      f1Col: cc,
      t1Col: 'blue',
      f2Col: 'blue',
      t2Col: cc,
      comp: 'comp',
      order: 'RI',
      corrResp: prms.respKeys[1],
    },
    {
      stimulus: '#####',
      f1Col: cc,
      t1Col: 'green',
      f2Col: 'blue',
      t2Col: cc,
      comp: 'incomp',
      order: 'RI',
      corrResp: prms.respKeys[0],
    },
    {
      stimulus: '#####',
      f1Col: cc,
      t1Col: 'blue',
      f2Col: 'green',
      t2Col: cc,
      comp: 'incomp',
      order: 'RI',
      corrResp: prms.respKeys[1],
    },
    {
      stimulus: '#####',
      f1Col: 'green',
      t1Col: cc,
      f2Col: cc,
      t2Col: 'green',
      comp: 'comp',
      order: 'IR',
      corrResp: prms.respKeys[0],
    },
    {
      stimulus: '#####',
      f1Col: 'blue',
      t1Col: cc,
      f2Col: cc,
      t2Col: 'blue',
      comp: 'comp',
      order: 'IR',
      corrResp: prms.respKeys[1],
    },
    {
      stimulus: '#####',
      f1Col: 'green',
      t1Col: cc,
      f2Col: cc,
      t2Col: 'blue',
      comp: 'incomp',
      order: 'IR',
      corrResp: prms.respKeys[1],
    },
    {
      stimulus: '#####',
      f1Col: 'blue',
      t1Col: cc,
      f2Col: cc,
      t2Col: 'green',
      comp: 'incomp',
      order: 'IR',
      corrResp: prms.respKeys[0],
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
    "<h3 style='text-align:left;'>Wenn du eine Versuchspersonenstunde benötigst, </h3>" +
    "<h3 style='text-align:left;'>kopiere den folgenden zufällig generierten Code</h3>" +
    "<h3 style='text-align:left;'>und sende diesen zusammen mit deiner Matrikelnummer per Email an:</h3><br>" +
    '<h2>BAflanker@web.de</h2>' +
    '<h1>Code: ' +
    randomString +
    '</h1><br>' +
    "<h2 align='left'>Drücke die Leertaste, um fortzufahren!</h2>",
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
  // exp.push(vpInfoForm_de);
  exp.push(hideMouseCursor);
  exp.push(screenInfo);
  exp.push(task_instructions1);
  exp.push(task_instructions2);

  for (let blk = 0; blk < prms.nBlks; blk += 1) {
    let blk_timeline = { ...trial_timeline };
    blk_timeline.sample = { type: 'fixed-repetitions', size: blk === 0 ? prms.nTrlsP / 8 : prms.nTrlsE / 8 };
    if (blk > 0) {
      exp.push(task_reminder);
    }
    exp.push(blk_timeline); // trials within a block
    exp.push(block_feedback); // show previous block performance
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
  show_progress_bar: false,
  exclusions: {
    min_width: cs[0],
    min_height: cs[1],
  },
  on_finish: function() {
    saveData('/Common/write_data.php', data_filename, { stim: 'flanker' });
    saveRandomCode('/Common/write_code.php', code_filename, randomString);
  },
});
