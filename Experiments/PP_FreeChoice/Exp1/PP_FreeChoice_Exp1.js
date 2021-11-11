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
  fbDur: [0, 2500], // feedback duration for correct and incorrect trials, respectively
  waitDur: 1000,
  stimFont: '50px Arial',
  stimPos: [-30, 30],
  fbFont: '28px Arial',
  numberNoGo: [153],
  numbersLeft: [125, 132, 139, 146],
  numbersRight: [160, 167, 174, 181],
  letterNoGo: ['M'],
  letterLeft: ['B', 'D', 'F', 'H'],
  letterRight: ['S', 'U', 'W', 'Y'],
  rsi: 200,
  soas: [50, 300],
  respKeys: ['Q', 'W', 'O', 'P'],

  // Fixation Cross
  fix_duration: 500,
  fix_size: 15,
  fix_linewidth: 4,

  // Feedback
  fbText: ['', 'Falsch!'],
  fbDur: [0, 1500],
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

  console.log(args);
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
    if (trial.data.S1 === 'Letter') {
      if (trial.data.GoNogoLetter === 'Go') {
        randomInt = getRandomInt(0, 3);
        if (Math.random() < 0.5) {
          s1 = prms.letterLeft[randomInt];
        } else {
          s1 = prms.letterRight[randomInt];
        }
      } else if (trial.data.GoNogoLetter === 'NoGo') {
        s1 = prms.letterNoGo;
      }
    } else if (trial.data.S1 === 'Number') {
      if (trial.data.GoNogoNumber === 'Go') {
        randomInt = getRandomInt(0, 3);
        if (Math.random() < 0.5) {
          s1 = prms.numbersLeft[randomInt];
        } else {
          s1 = prms.numbersRight[randomInt];
        }
      } else if (trial.data.GoNogoNumber === 'NoGo') {
        s1 = prms.numberNoGo;
      }
    }
    // Stimulus 2
    if (trial.data.S2 === 'Letter') {
      if (trial.data.GoNogoLetter === 'Go') {
        randomInt = getRandomInt(0, 3);
        if (Math.random() < 0.5) {
          s2 = prms.letterLeft[randomInt];
        } else {
          s2 = prms.letterRight[randomInt];
        }
      } else if (trial.data.GoNogoLetter === 'NoGo') {
        s2 = prms.letterNoGo;
      }
    } else if (trial.data.S2 === 'Number') {
      if (trial.data.GoNogoNumber === 'Go') {
        randomInt = getRandomInt(0, 3);
        if (Math.random() < 0.5) {
          s2 = prms.numbersLeft[randomInt];
        } else {
          s2 = prms.numbersRight[randomInt];
        }
      } else if (trial.data.GoNogoNumber === 'NoGo') {
        s2 = prms.numberNoGo;
      }
    }

    // deal with s2 = Infinity
    if (trial.data.SOA === Infinity) {
      console.log('here');
      s2 = '';
    }

    let pos = shuffle(prms.stimPos);
    trial.func_args = [
      { S1: s1, S1_position: pos[0], S2: '', S2_position: pos[1] },
      { S1: s1, S1_position: pos[0], S2: s2, S2_position: pos[1] },
    ];
  },
  // on_finish: function () {
  //    code_trial();
  // },
};

// prettier-ignore
const trial_table = [
    {"TrialType":  1, "FreeForced":"Free",    "Forced":"NA",     "StimOrder":"Letter-Number", "S1":"Letter", "S2":"Number", "LetterType":"Go",   "NumberType":"Go",   "SOA":50},
    {"TrialType":  1, "FreeForced":"Free",    "Forced":"NA",     "StimOrder":"Letter-Number", "S1":"Letter", "S2":"Number", "LetterType":"Go",   "NumberType":"Go",   "SOA":50},
    {"TrialType":  1, "FreeForced":"Free",    "Forced":"NA",     "StimOrder":"Letter-Number", "S1":"Letter", "S2":"Number", "LetterType":"Go",   "NumberType":"Go",   "SOA":50},
    {"TrialType":  2, "FreeForced":"Free",    "Forced":"NA",     "StimOrder":"Letter-Number", "S1":"Letter", "S2":"Number", "LetterType":"Go",   "NumberType":"Go",   "SOA":300},
    {"TrialType":  2, "FreeForced":"Free",    "Forced":"NA",     "StimOrder":"Letter-Number", "S1":"Letter", "S2":"Number", "LetterType":"Go",   "NumberType":"Go",   "SOA":300},
    {"TrialType":  2, "FreeForced":"Free",    "Forced":"NA",     "StimOrder":"Letter-Number", "S1":"Letter", "S2":"Number", "LetterType":"Go",   "NumberType":"Go",   "SOA":300},
    {"TrialType":  3, "FreeForced":"Free",    "Forced":"NA",     "StimOrder":"Number-Letter", "S1":"Number", "S2":"Letter", "LetterType":"Go",   "NumberType":"Go",   "SOA":50},
    {"TrialType":  3, "FreeForced":"Free",    "Forced":"NA",     "StimOrder":"Number-Letter", "S1":"Number", "S2":"Letter", "LetterType":"Go",   "NumberType":"Go",   "SOA":50},
    {"TrialType":  3, "FreeForced":"Free",    "Forced":"NA",     "StimOrder":"Number-Letter", "S1":"Number", "S2":"Letter", "LetterType":"Go",   "NumberType":"Go",   "SOA":50},
    {"TrialType":  4, "FreeForced":"Free",    "Forced":"NA",     "StimOrder":"Number-Letter", "S1":"Number", "S2":"Letter", "LetterType":"Go",   "NumberType":"Go",   "SOA":300},
    {"TrialType":  4, "FreeForced":"Free",    "Forced":"NA",     "StimOrder":"Number-Letter", "S1":"Number", "S2":"Letter", "LetterType":"Go",   "NumberType":"Go",   "SOA":300},
    {"TrialType":  4, "FreeForced":"Free",    "Forced":"NA",     "StimOrder":"Number-Letter", "S1":"Number", "S2":"Letter", "LetterType":"Go",   "NumberType":"Go",   "SOA":300},
    {"TrialType":  5, "FreeForced":"Forced",  "Forced":"Letter", "StimOrder":"Letter-Number", "S1":"Letter", "S2":"Number", "LetterType":"Go",   "NumberType":"NoGo", "SOA":50},
    {"TrialType":  6, "FreeForced":"Forced",  "Forced":"Letter", "StimOrder":"Letter-Number", "S1":"Letter", "S2":"Number", "LetterType":"Go",   "NumberType":"NoGo", "SOA":300},
    {"TrialType":  7, "FreeForced":"Forced",  "Forced":"Letter", "StimOrder":"Letter-Number", "S1":"Letter", "S2":"Number", "LetterType":"Go",   "NumberType":"NoGo", "SOA":Infinity},
    {"TrialType":  8, "FreeForced":"Forced",  "Forced":"Number", "StimOrder":"Number-Letter", "S1":"Number", "S2":"Letter", "LetterType":"NoGo", "NumberType":"Go",   "SOA":50},
    {"TrialType":  9, "FreeForced":"Forced",  "Forced":"Number", "StimOrder":"Number-Letter", "S1":"Number", "S2":"Letter", "LetterType":"NoGo", "NumberType":"Go",   "SOA":300},
    {"TrialType": 10, "FreeForced":"Forced",  "Forced":"Number", "StimOrder":"Number-Letter", "S1":"Number", "S2":"Letter", "LetterType":"NoGo", "NumberType":"Go",   "SOA":Infinity},
    {"TrialType": 11, "FreeForced":"Forced",  "Forced":"Letter", "StimOrder":"Letter-Number", "S1":"Letter", "S2":"Number", "LetterType":"Go",   "NumberType":"NoGo", "SOA":50},
    {"TrialType": 12, "FreeForced":"Forced",  "Forced":"Letter", "StimOrder":"Letter-Number", "S1":"Letter", "S2":"Number", "LetterType":"Go",   "NumberType":"NoGo", "SOA":300},
    {"TrialType": 13, "FreeForced":"Forced",  "Forced":"Letter", "StimOrder":"Letter-Number", "S1":"Letter", "S2":"Number", "LetterType":"Go",   "NumberType":"NoGo", "SOA":Infinity},
    {"TrialType": 14, "FreeForced":"Forced",  "Forced":"Number", "StimOrder":"Number-Letter", "S1":"Number", "S2":"Letter", "LetterType":"NoGo", "NumberType":"Go",   "SOA":50},
    {"TrialType": 15, "FreeForced":"Forced",  "Forced":"Number", "StimOrder":"Number-Letter", "S1":"Number", "S2":"Letter", "LetterType":"NoGo", "NumberType":"Go",   "SOA":300},
    {"TrialType": 16, "FreeForced":"Forced",  "Forced":"Number", "StimOrder":"Number-Letter", "S1":"Number", "S2":"Letter", "LetterType":"NoGo", "NumberType":"Go",   "SOA":Infinity},
];

const trial_timeline = {
  // timeline: [fixation_cross, stimulus, feedback, iti],
  timeline: [fixation_cross, stimulus],
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
