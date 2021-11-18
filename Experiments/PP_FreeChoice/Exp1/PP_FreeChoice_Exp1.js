// PP_FreeChoice_Exp1
// B.Sc. WS 2021 Sebastian

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
const version = 1; //Number(jsPsych.data.urlVariables().version);
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
  nTrls: 96, // number of trials within a block
  nBlks: 6, // number of blocks
  fixDur: 500,
  waitDur: 1000,
  tooSlow: 5000,
  iti: [150, 300],
  stimFont: '50px Arial',
  stimPos: [-30, 30],
  numberNoGo: [148, 152, 154, 158],
  numbersLeft: [125, 132, 139, 146],
  numbersRight: [160, 167, 174, 181],
  letterNoGo: ['J', 'M', 'N', 'Q'],
  lettersLeft: ['B', 'D', 'F', 'H'],
  lettersRight: ['S', 'U', 'W', 'Y'],
  soas: [50, 300, Infinity],
  respKeys: ['q', 'w', 'o', 'p'],
  taskMapping: version === 1 ? ['number', 'letter'] : ['letter', 'number'],

  // Fixation Cross
  fix_duration: 500,
  fix_size: 15,
  fix_linewidth: 4,

  // Feedback
  fbFont: '28px Arial',
  fbText: ['Falsch!', ''],
  fbDur: [2000, 0],

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
    abbrechen.  Bitte stelle sicher, dass du dich in einer ruhigen Umgebung
    befindest und genügend Zeit hast, um das Experiment durchzuführen. Wir
    bitten dich für die Dauer des Experiments (ca. 45 Minuten) konzentriert zu
    arbeiten.<br><br>
    Drücke eine beliebige Taste, um fortzufahren!`,
    fontsize: 26,
    align: 'left',
    lineheight: 1.5,
  }),
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
    stim_type: 'ppfc1',
    S1: jsPsych.timelineVariable('S1'),
    S2: jsPsych.timelineVariable('S2'),
    GoNogoLetter: jsPsych.timelineVariable('LetterType'),
    GoNogoNumber: jsPsych.timelineVariable('NumberType'),
    SOA: jsPsych.timelineVariable('SOA'),
  },
  on_start: function (trial) {
    // Stimulus 1
    let s1;
    let corrKey1;
    if (trial.data.S1 === 'Letter') {
      randomInt = getRandomInt(0, 3);
      if (trial.data.GoNogoLetter === 'Go') {
        if (Math.random() < 0.5) {
          s1 = prms.lettersLeft[randomInt];
        } else {
          s1 = prms.lettersRight[randomInt];
        }
      } else if (trial.data.GoNogoLetter === 'NoGo') {
        s1 = prms.letterNoGo[randomInt];
      }
      // Assign correct key for S1
      if (prms.letterNoGo.includes(s1)) {
        corrKey1 = null;
      } else if (prms.taskMapping[0] === 'letter') {
        corrKey1 = prms.lettersLeft.includes(s1) ? prms.respKeys[0] : prms.respKeys[1];
      } else if (prms.taskMapping[1] === 'letter') {
        corrKey1 = prms.lettersLeft.includes(s1) ? prms.respKeys[2] : prms.respKeys[3];
      }
    } else if (trial.data.S1 === 'Number') {
      randomInt = getRandomInt(0, 3);
      if (trial.data.GoNogoNumber === 'Go') {
        if (Math.random() < 0.5) {
          s1 = prms.numbersLeft[randomInt];
        } else {
          s1 = prms.numbersRight[randomInt];
        }
      } else if (trial.data.GoNogoNumber === 'NoGo') {
        s1 = prms.numberNoGo[randomInt];
      }
      if (prms.numberNoGo.includes(s1)) {
        corrKey1 = null;
      } else if (prms.taskMapping[0] === 'number') {
        corrKey1 = prms.numbersLeft.includes(s1) ? prms.respKeys[0] : prms.respKeys[1];
      } else if (prms.taskMapping[1] === 'number') {
        corrKey1 = prms.numbersLeft.includes(s1) ? prms.respKeys[2] : prms.respKeys[3];
      }
    }

    trial.data.s1 = s1;
    // Stimulus 2
    if (trial.data.S2 === 'Letter') {
      randomInt = getRandomInt(0, 3);
      if (trial.data.GoNogoLetter === 'Go') {
        if (Math.random() < 0.5) {
          s2 = prms.lettersLeft[randomInt];
        } else {
          s2 = prms.lettersRight[randomInt];
        }
      } else if (trial.data.GoNogoLetter === 'NoGo') {
        s2 = prms.letterNoGo[randomInt];
      }
      // Assign correct key for S1
      if (prms.letterNoGo.includes(s2)) {
        corrKey2 = null;
      } else if (prms.taskMapping[0] === 'letter') {
        corrKey2 = prms.lettersLeft.includes(s2) ? prms.respKeys[0] : prms.respKeys[1];
      } else if (prms.taskMapping[1] === 'letter') {
        corrKey2 = prms.lettersLeft.includes(s2) ? prms.respKeys[2] : prms.respKeys[3];
      }
    } else if (trial.data.S2 === 'Number') {
      randomInt = getRandomInt(0, 3);
      if (trial.data.GoNogoNumber === 'Go') {
        if (Math.random() < 0.5) {
          s2 = prms.numbersLeft[randomInt];
        } else {
          s2 = prms.numbersRight[randomInt];
        }
      } else if (trial.data.GoNogoNumber === 'NoGo') {
        s2 = prms.numberNoGo[randomInt];
      }
      if (prms.numberNoGo.includes(s2)) {
        corrKey2 = null;
      } else if (prms.taskMapping[0] === 'number') {
        corrKey2 = prms.numbersLeft.includes(s2) ? prms.respKeys[0] : prms.respKeys[1];
      } else if (prms.taskMapping[1] === 'number') {
        corrKey2 = prms.numbersLeft.includes(s2) ? prms.respKeys[2] : prms.respKeys[3];
      }
    }

    // deal with s2 = Infinity
    if (trial.data.SOA === Infinity) {
      s2 = '';
    }
    trial.data.s2 = s2;

    trial.data.corrKey1 = corrKey1;
    trial.data.corrKey2 = corrKey2;

    let pos = shuffle(prms.stimPos);
    // shuffle function changes order of stimPos as well!
    trial.func_args = [
      { S1: s1, S1_position: pos[0], S2: '', S2_position: pos[1] },
      { S1: s1, S1_position: pos[0], S2: s2, S2_position: pos[1] },
    ];
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
}

function codeTrial() {
  'use strict';

  let dat = jsPsych.data.get().last(1).values()[0];
  let corrCode = 0;

  console.log(dat);
  if ([dat.corrKey1, dat.corrKey2].includes(dat.key_press)) {
    corrCode = 1;
  }

  // S1 vs S2 response?
  let responseTask;
  if (prms.taskMapping[0] === 'number') {
    responseTask = prms.respKeys.slice(0, 2).includes(dat.key_press) ? 'Number' : 'Letter';
  } else if (prms.taskMapping[0] === 'letter') {
    responseTask = prms.respKeys.slice(0, 2).includes(dat.key_press) ? 'Letter' : 'Number';
  }

  let rt = dat.rt !== null ? dat.rt : prms.tooSlow;

  // correct for SOA
  if (responseTask !== dat.S1) {
    rt = rt - dat.SOA;
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

const iti = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  trial_duration: null,
  translate_origin: true,
  func: function () {},
  on_start: function (trial) {
    trial.trial_duration = getRandomInt(prms.iti[0], prms.iti[1]);
  },
};

// prettier-ignore
const trial_table = [
    {"TrialType":  1, "FreeForced":"Free",    "Forced":"NA",     "StimOrder":"Letter-Number", "S1":"Letter", "S2":"Number", "LetterType":"Go",   "NumberType":"Go",   "SOA":prms.soas[0]},
    {"TrialType":  1, "FreeForced":"Free",    "Forced":"NA",     "StimOrder":"Letter-Number", "S1":"Letter", "S2":"Number", "LetterType":"Go",   "NumberType":"Go",   "SOA":prms.soas[0]},
    {"TrialType":  1, "FreeForced":"Free",    "Forced":"NA",     "StimOrder":"Letter-Number", "S1":"Letter", "S2":"Number", "LetterType":"Go",   "NumberType":"Go",   "SOA":prms.soas[0]},
    {"TrialType":  2, "FreeForced":"Free",    "Forced":"NA",     "StimOrder":"Letter-Number", "S1":"Letter", "S2":"Number", "LetterType":"Go",   "NumberType":"Go",   "SOA":prms.soas[1]},
    {"TrialType":  2, "FreeForced":"Free",    "Forced":"NA",     "StimOrder":"Letter-Number", "S1":"Letter", "S2":"Number", "LetterType":"Go",   "NumberType":"Go",   "SOA":prms.soas[1]},
    {"TrialType":  2, "FreeForced":"Free",    "Forced":"NA",     "StimOrder":"Letter-Number", "S1":"Letter", "S2":"Number", "LetterType":"Go",   "NumberType":"Go",   "SOA":prms.soas[1]},
    {"TrialType":  3, "FreeForced":"Free",    "Forced":"NA",     "StimOrder":"Number-Letter", "S1":"Number", "S2":"Letter", "LetterType":"Go",   "NumberType":"Go",   "SOA":prms.soas[0]},
    {"TrialType":  3, "FreeForced":"Free",    "Forced":"NA",     "StimOrder":"Number-Letter", "S1":"Number", "S2":"Letter", "LetterType":"Go",   "NumberType":"Go",   "SOA":prms.soas[0]},
    {"TrialType":  3, "FreeForced":"Free",    "Forced":"NA",     "StimOrder":"Number-Letter", "S1":"Number", "S2":"Letter", "LetterType":"Go",   "NumberType":"Go",   "SOA":prms.soas[0]},
    {"TrialType":  4, "FreeForced":"Free",    "Forced":"NA",     "StimOrder":"Number-Letter", "S1":"Number", "S2":"Letter", "LetterType":"Go",   "NumberType":"Go",   "SOA":prms.soas[1]},
    {"TrialType":  4, "FreeForced":"Free",    "Forced":"NA",     "StimOrder":"Number-Letter", "S1":"Number", "S2":"Letter", "LetterType":"Go",   "NumberType":"Go",   "SOA":prms.soas[1]},
    {"TrialType":  4, "FreeForced":"Free",    "Forced":"NA",     "StimOrder":"Number-Letter", "S1":"Number", "S2":"Letter", "LetterType":"Go",   "NumberType":"Go",   "SOA":prms.soas[1]},
    {"TrialType":  5, "FreeForced":"Forced",  "Forced":"Letter", "StimOrder":"Letter-Number", "S1":"Letter", "S2":"Number", "LetterType":"Go",   "NumberType":"NoGo", "SOA":prms.soas[0]},
    {"TrialType":  6, "FreeForced":"Forced",  "Forced":"Letter", "StimOrder":"Letter-Number", "S1":"Letter", "S2":"Number", "LetterType":"Go",   "NumberType":"NoGo", "SOA":prms.soas[1]},
    {"TrialType":  7, "FreeForced":"Forced",  "Forced":"Number", "StimOrder":"Number-Letter", "S1":"Number", "S2":"Letter", "LetterType":"NoGo", "NumberType":"Go",   "SOA":prms.soas[0]},
    {"TrialType":  8, "FreeForced":"Forced",  "Forced":"Number", "StimOrder":"Number-Letter", "S1":"Number", "S2":"Letter", "LetterType":"NoGo", "NumberType":"Go",   "SOA":prms.soas[1]},
    {"TrialType":  9, "FreeForced":"Forced",  "Forced":"Letter", "StimOrder":"Letter-Number", "S1":"Letter", "S2":"Number", "LetterType":"Go",   "NumberType":"NoGo", "SOA":prms.soas[0]},
    {"TrialType": 10, "FreeForced":"Forced",  "Forced":"Letter", "StimOrder":"Letter-Number", "S1":"Letter", "S2":"Number", "LetterType":"Go",   "NumberType":"NoGo", "SOA":prms.soas[1]},
    {"TrialType": 11, "FreeForced":"Forced",  "Forced":"Number", "StimOrder":"Number-Letter", "S1":"Number", "S2":"Letter", "LetterType":"NoGo", "NumberType":"Go",   "SOA":prms.soas[0]},
    {"TrialType": 12, "FreeForced":"Forced",  "Forced":"Number", "StimOrder":"Number-Letter", "S1":"Number", "S2":"Letter", "LetterType":"NoGo", "NumberType":"Go",   "SOA":prms.soas[1]},
    {"TrialType": 13, "FreeForced":"Forced",  "Forced":"Letter", "StimOrder":"Letter-Number", "S1":"Letter", "S2":"Number", "LetterType":"Go",   "NumberType":"NoGo", "SOA":prms.soas[2]},
    {"TrialType": 13, "FreeForced":"Forced",  "Forced":"Letter", "StimOrder":"Letter-Number", "S1":"Letter", "S2":"Number", "LetterType":"Go",   "NumberType":"NoGo", "SOA":prms.soas[2]},
    {"TrialType": 14, "FreeForced":"Forced",  "Forced":"Number", "StimOrder":"Number-Letter", "S1":"Number", "S2":"Letter", "LetterType":"NoGo", "NumberType":"Go",   "SOA":prms.soas[2]},
    {"TrialType": 14, "FreeForced":"Forced",  "Forced":"Number", "StimOrder":"Number-Letter", "S1":"Number", "S2":"Letter", "LetterType":"NoGo", "NumberType":"Go",   "SOA":prms.soas[2]},
];

const trial_timeline = {
  timeline: [fixation_cross, stimulus, feedback, iti],
  timeline_variables: trial_table,
  sample: {
    type: 'fixed-repetitions',
    size: prms.nTrls / trial_table.length,
  },
};

////////////////////////////////////////////////////////////////////////
//                              De-brief                              //
////////////////////////////////////////////////////////////////////////
// For VP Stunden
const randomString = generateRandomStringWithExpName('vts1', 16);

const alpha_num = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus:
    generate_formatted_html({
      text: `Wenn du eine Versuchspersonenstunde benötigst, kopiere den folgenden
      zufällig generierten Code und sende diesen zusammen mit deiner Matrikelnummer
      und deiner Universität (Tübingen) per Email an:<br><br>
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
    saveData('/Common/write_data.php', data_filename, { stim: 'vts' });
  },
  timing_post_trial: 1000,
};

const save_interaction_data = {
  type: 'call-function',
  func: function () {
    let data_filename = dirName + 'interaction_data/' + expName + '_interaction_data_' + vpNum;
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

  // exp.push(fullscreen_on);
  // exp.push(check_screen);
  // exp.push(welcome_de);
  // exp.push(resize_de);
  // // exp.push(vpInfoForm_de);
  // exp.push(hideMouseCursor);
  // exp.push(task_instructions1);

  exp.push(trial_timeline);

  // save data
  exp.push(save_data);
  exp.push(save_interaction_data);
  exp.push(save_code);

  // debrief
  exp.push(showMouseCursor);
  exp.push(alpha_num);
  exp.push(debrief_de);
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
