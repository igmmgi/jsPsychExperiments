// Modified version of a Prioritized Processing task with lateralized stimuli.
// VPs respond to a laterally presented stimulus (e.g., H,S,K) with left and
// right key-presses ("Q" and "P"). Two of the three letters are assigned to
// left and right keys (primary task), whilst the third letter indicates that
// the background task is to be performed (respond according to stimulus
// location). The proportion of required primary vs. background responses is
// manipulated blockwise, with HighPri vs. LowPri at 90/10 and 50/50,
// respectively.

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
  nTrlsBase: 40, // number of trials in Simon baseline blocks
  nBlksBase: 8, // number of blocks of Simon baseline
  nTrlsPP: 40, // number of trials in subsequent blocks
  nBlksPP: 16,
  nBlks: 24,
  fixDur: 500,
  fbDur: [1000, 3000, 3000],
  iti: 500,
  tooFast: 100,
  tooSlow: 2000,
  respLetters: shuffle(['H', 'S', 'K']),
  cTrl: 1, // count trials
  cBlk: 1, // count blocks
  fixWidth: 2,
  fixSize: 10,
  stimSize: '40px monospace',
  fbSize: '24px monospace',
  simonEccentricity: 150,
  respKeys: ['Q', 'P', 27],
};

const nVersion = getVersionNumber(nFiles, 2);
jsPsych.data.addProperties({ version: nVersion });

// response keys for baseline simon
let respText_base =
  "<h3 style='text-align:center;'><b>" +
  prms.respLetters[0] +
  " = linker Zeigefinger (Taste 'Q')</b></h3>" +
  "<h3 style='text-align:center;'><b>" +
  prms.respLetters[1] +
  " = rechter Zeigefinger (Taste 'P')</b></h3><br>";

let respText_pp =
  "<h3 style='text-align:center;'><b>" +
  prms.respLetters[2] +
  " erscheint links = linker Zeigefinger (Taste 'Q')</b></h3>" +
  "<h3 style='text-align:center;'><b>" +
  prms.respLetters[2] +
  " erscheint rechts = rechter Zeigefinger (Taste 'P')</b></h3><br>";

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
    "<h3 style='text-align: center;'>Wir bitten dich die ca. 40 Minuten konzentriert zu arbeiten.</h3><br>" +
    "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>",
};

const task_instructions2 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  stimulus:
    "<h3 style='text-align: left;'>Du erhaelst den Code für die Versuchspersonenstunden und weitere Anweisungen</h3>" +
    "<h3 style='text-align: left;'>am Ende des Experimentes. Bei Fragen oder Problemen wende dich bitte an:</h3><br>" +
    "<h3 style='text-align: center;'>hiwipibio@gmail.com</h3><br>" +
    "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>",
};

const task_instructions_base = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  stimulus:
    "<h2 style='text-align: center;'>ACHTUNG: NEUE INSTRUKTIONEN!!!</h2>" +
    "<h3 style='text-align: left;'>Du musst nun nur noch auf die Buchstaben</h3>" +
    "<h3 style='text-align: left;'>so schnell und so genau wie möglich reagieren</h3>" +
    "<h3 style='text-align: left;'>und kannst die Position auf dem Bildschirm immer ignorieren.</h3>" +
    "<h3 style='text-align: left;'>Reagiere somit wie folgt:</h3><br>" +
    respText_base +
    "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren.</h2>",
};

const task_instructions_base_reminder = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  stimulus: '',
  on_start: function (trial) {
    trial.stimulus =
      "<h2 style='text-align: center;'>Block " +
      prms.cBlk +
      ' von 24:</h2><br>' +
      "<h3 style='text-align: left;'>Wenn du bereit für den Block bist dann positioniere die Zeigefinger </h3>" +
      "<h3 style='text-align: left;'>deiner beiden Hände auf die Tastatur. Es gilt:</h3><br>" +
      respText_base +
      "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>";
  },
};

const task_instructions_pause = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  stimulus:
    "<h3 style='text-align: left;'>Kurze Pause. Bitte nutze die Pause, um dich zu erholen. Wenn du wieder bereit</h3>" +
    "<h3 style='text-align: left;'>für den nächsten Block bist, dann drücke eine beliebige Taste.</h3>",
};

const task_instructions_pp1 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  stimulus:
    "<h3 style='text-align: left;'>In diesem Experiment musst du auf verschiedene Buchstaben</h3>" +
    "<h3 style='text-align: left;'>so schnell und so genau wie möglich reagieren, die rechts</h3>" +
    "<h3 style='text-align: left;'>oder links auf dem Bildschirm erscheinen.</h3><br><br>" +
    "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>",
};

const task_instructions_pp2 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  stimulus:
    "<h3 style='text-align: left;'>Reagiere wie folgt:</h3>" +
    "<h3 style='text-align: left;'>Die erste Priorität ist auf den Buchstaben zu reagieren:</h3><br>" +
    respText_base +
    "<h3 style='text-align: left;'>Wenn der Buchstabe aber " +
    prms.respLetters[2] +
    ' ist, dann reagiere auf die</h3>' +
    "<h3 style='text-align: left;'>Position des Buchstabens (zweite Priorität):</h3><br>" +
    respText_pp +
    "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>",
};

const task_instructions_pp_reminder = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  stimulus: '',
  on_start: function (trial) {
    trial.stimulus =
      "<h2 style='text-align: center;'>Block " +
      prms.cBlk +
      ' von 24:</h2><br>' +
      "<h3 style='text-align: left;'>Erste Priorität ist Typ Buchstabe:</h3>" +
      respText_base +
      "<h3 style='text-align: left;'>Wenn der Buchstabe aber " +
      prms.respLetters[2] +
      ' ist, dann reagiere auf die</h3>' +
      "<h3 style='text-align: left;'>Position des Buchstabens:</h3>" +
      respText_pp +
      "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>";
  },
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
  if (dat.blk_type === 'B') {
    switch (dat.corrCode) {
      case 1: // correct
        ctx.fillText('Richtig', 0, 0);
        break;
      case 2: // Falsch
        ctx.fillText('Falsch!', 0, -50);
        ctx.fillText(prms.respLetters[0] + " = linker Zeigefinger (Taste 'Q')", 0, 0);
        ctx.fillText(prms.respLetters[1] + " = rechter Zeigefinger (Taste 'P')", 0, 50);
        break;
      case 3: // Too Slow
        ctx.fillText('Zu langsam!', 0, 0);
        break;
    }
  } else {
    switch (dat.corrCode) {
      case 1: // correct
        ctx.fillText('Richtig', 0, 0);
        break;
      case 2: // Falsch
        if (dat.task === 'T1') {
          ctx.fillText('Falsch!', 0, -75);
          ctx.fillText('Erste Priorität ist Typ Buchstabe:', 0, -25);
          ctx.fillText(prms.respLetters[0] + " = linker Zeigefinger (Taste 'Q')", 0, 25);
          ctx.fillText(prms.respLetters[1] + " = rechter Zeigefinger (Taste 'P')", 0, 75);
        } else if (dat.task === 'T2') {
          ctx.fillText('Falsch!', 0, -75);
          ctx.fillText('Wenn der Buchstabe ' + prms.respLetters[2] + ' ist, reagiere auf die Position:', 0, -25);
          ctx.fillText("Links = linker Zeigefinger (Taste 'Q')", 0, 25);
          ctx.fillText("Rechts = rechter Zeigefinger (Taste 'P')", 0, 75);
        }
        break;
      case 3: // Too Slow
        ctx.fillText('Zu langsam!', 0, 0);
        break;
    }
  }
}

function drawSimon(args) {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  ctx.font = prms.stimSize;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // draw Simon
  ctx.fillStyle = 'black';
  if (args.position === 'left') {
    ctx.fillText(args.letter, -prms.simonEccentricity, 0);
  } else {
    ctx.fillText(args.letter, prms.simonEccentricity, 0);
  }
}

function codeTrial() {
  'use strict';

  let dat = jsPsych.data.get().last(1).values()[0];

  let corrCode = 0;
  let corrKeyNum = jsPsych.pluginAPI.convertKeyCharacterToKeyCode(dat.corrResp);
  let rt = dat.rt !== null ? dat.rt : prms.tooSlow;
  if (dat.key_press === corrKeyNum && rt < prms.tooSlow) {
    corrCode = 1; // correct
  } else if (dat.key_press !== corrKeyNum && rt < prms.tooSlow) {
    corrCode = 2; // choice error
  } else if (rt >= prms.tooSlow) {
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

const block_feedback = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  stimulus: '',
  response_ends_trial: true,
  on_start: function (trial) {
    trial.stimulus = blockFeedbackTxt_de_du({ stim: 'pp_simon' });
  },
};

const simon_stimulus = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  translate_origin: true,
  response_ends_trial: true,
  choices: prms.respKeys,
  trial_duration: prms.tooSlow,
  func: drawSimon,
  func_args: [{ letter: jsPsych.timelineVariable('letter'), position: jsPsych.timelineVariable('position') }],
  data: {
    stim: 'pp_simon',
    letter: jsPsych.timelineVariable('letter'),
    task: jsPsych.timelineVariable('task'),
    blk_type: jsPsych.timelineVariable('blk_type'),
    comp: jsPsych.timelineVariable('comp'),
    position: jsPsych.timelineVariable('position'),
    corrResp: jsPsych.timelineVariable('corrResp'),
  },
  on_finish: function () {
    codeTrial();
  },
};

const simon_t1 = [
  { letter: prms.respLetters[0], task: 'T1', position: 'left', comp: 'comp', corrResp: prms.respKeys[0] },
  { letter: prms.respLetters[1], task: 'T1', position: 'right', comp: 'comp', corrResp: prms.respKeys[1] },
  { letter: prms.respLetters[0], task: 'T1', position: 'right', comp: 'incomp', corrResp: prms.respKeys[0] },
  { letter: prms.respLetters[1], task: 'T1', position: 'left', comp: 'incomp', corrResp: prms.respKeys[1] },
];

const trial_timeline_simon_base = {
  timeline: [fixation_cross, simon_stimulus, trial_feedback],
  timeline_variables: repeatArray(simon_t1, prms.nTrlsBase / 4),
};

const simon_t2 = [
  { letter: prms.respLetters[2], task: 'T2', position: 'left', comp: 'comp', corrResp: prms.respKeys[0] },
  { letter: prms.respLetters[2], task: 'T2', position: 'right', comp: 'comp', corrResp: prms.respKeys[1] },
];

const trial_timeline_simon_low = {
  timeline: [fixation_cross, simon_stimulus, trial_feedback],
  timeline_variables: repeatArray(simon_t1, (prms.nTrlsBase - 4) / 4).concat(
    repeatArray(simon_t2, prms.nTrlsBase / 10 / 2),
  ), // 90% vs. 10%
};

const trial_timeline_simon_high = {
  timeline: [fixation_cross, simon_stimulus, trial_feedback],
  timeline_variables: repeatArray(simon_t1, prms.nTrlsBase / 2 / 4).concat(
    repeatArray(simon_t2, prms.nTrlsBase / 2 / 2),
  ), // 50% vs. 50%
};

const randomString = generateRandomStringWithExpName('pps2', 16);

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
    "<h3 style='text-align:left;'>und sende diesen zusammen mit deiner Matrikelnummer</h3><br>" +
    "<h3 style='text-align:left;'>und deiner Universität (Bremen/Tübingen) per Email an:</h3><br>" +
    '<h2>hiwipibio@gmail.com</h2>' +
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
  exp.push(vpInfoForm_de);
  exp.push(hideMouseCursor);
  exp.push(screenInfo);
  exp.push(task_instructions1);
  exp.push(task_instructions2);

  // PP Simon block
  exp.push(task_instructions_pp1);
  exp.push(task_instructions_pp2);
  let blk_prob;
  if (nVersion % 2 == 0) {
    blk_prob = repeatArray(['L'], prms.nBlksPP / 2).concat(repeatArray(['H'], prms.nBlksPP / 2));
  } else {
    blk_prob = repeatArray(['H'], prms.nBlksPP / 2).concat(repeatArray(['L'], prms.nBlksPP / 2));
  }

  let blk_timeline_pp;
  for (let blk = 0; blk < prms.nBlksPP; blk += 1) {
    exp.push(task_instructions_pp_reminder);
    if (blk_prob[blk] === 'L') {
      blk_timeline_pp = deepCopy(trial_timeline_simon_low);
    } else if (blk_prob[blk] === 'H') {
      blk_timeline_pp = deepCopy(trial_timeline_simon_high);
    }

    // add (L)ow vs. (H)igh to block timeline variables
    for (let i = 0; i < blk_timeline_pp.timeline_variables.length; i++) {
      blk_timeline_pp.timeline_variables[i].blk_type = blk_prob[blk];
    }

    blk_timeline_pp.sample = { type: 'fixed-repetitions', size: 1 };
    exp.push(blk_timeline_pp); // trials within a block
    exp.push(block_feedback); // show previous block performance
    exp.push(task_instructions_pause);
  }

  // baseline Simon block
  exp.push(task_instructions_base);
  for (let blk = 0; blk < prms.nBlksBase; blk += 1) {
    exp.push(task_instructions_base_reminder);
    let blk_timeline_simon_base = deepCopy(trial_timeline_simon_base);
    blk_timeline_simon_base.sample = { type: 'fixed-repetitions', size: 1 };
    // add (B)aseline block type to timeline variables
    for (let i = 0; i < blk_timeline_simon_base.timeline_variables.length; i++) {
      blk_timeline_simon_base.timeline_variables[i].blk_type = 'B';
    }
    exp.push(blk_timeline_simon_base); // trials within a block
    exp.push(block_feedback); // show previous block performance
    exp.push(task_instructions_pause);
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
  on_finish: function () {
    saveData('/Common/write_data.php', data_filename, { stim: 'pp_simon' });
    saveRandomCode('/Common/write_code.php', code_filename, randomString);
  },
});
