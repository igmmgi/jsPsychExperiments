// NoGo Flanker Task Exp2
// Two manipulations across implemented across blocks:
// 1: Proportion of NoGo trials (10 % vs. 50%)
// 2: Speed vs. Accuracy focus (via instructions)
//
// 24 blocks of 40 trials
//
// Counterbalancing
// Version 1: H = left, S = right, First half (10% nogo), second half (50% nogo), and Accuracy, Speed, Accuracy, Speed ...
// Version 2: S = left, H = right, First half (10% nogo), second half (50% nogo), and Accuracy, Speed, Accuracy, Speed ...
// Version 3: H = left, S = right, First half (10% nogo), second half (50% nogo), and Speed, Accuracy, Speed, Accuracy ...
// Version 4: S = left, H = right, First half (10% nogo), second half (50% nogo), and Speed, Accuracy, Speed, Accuracy ...
// Version 5: H = left, S = right, First half (50% nogo), second half (10% nogo), and Accuracy, Speed, Accuracy, Speed ...
// Version 6: S = left, H = right, First half (50% nogo), second half (10% nogo), and Accuracy, Speed, Accuracy, Speed ...
// Version 7: H = left, S = right, First half (50% nogo), second half (10% nogo), and Speed, Accuracy, Speed, Accuracy ...
// Version 8: S = left, H = right, First half (50% nogo), second half (10% nogo), and Speed, Accuracy, Speed, Accuracy ...

const jsPsych = initJsPsych({});

const CANVAS_COLOUR = 'rgba(200, 200, 200, 1)';
const CANVAS_SIZE = [960, 720];
const CANVAS_BORDER = '5px solid black';

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const PRMS = {
  nTrls: 40, // number of trials in each block
  nBlks: 24, // number of blocks
  nErrors: 15, // number of errors per speed block before warning
  fixDur: 500,
  fbDur: [1000, 2500],
  tooSlowPractice: 1500,
  tooSlow: 1000,
  wait: 1000,
  fbTxtGo: ['Richtig', 'Falsch: Falsche Taste gedrückt!', 'Zu langsam: Reagiere wenn der Buchstabe grün ist!'],
  fbTxtNoGo: ['Richtig', 'Falsch: Reagiere nicht, wenn der Buchstabe rot ist!'],
  fixWidth: 2,
  fixSize: 10,
  stimSize: '40px monospace',
  fbTxtSizeTrial: 30,
  fbTxtSizeBlock: 26,
  colours: ['green', 'red'], // go/nogo colours (although fixed within instruction text!)
  respKeys: [],
  cTrl: 1, // count trials
  cBlk: 1, // count blocks
};

// 2 counter balanced versions
const VERSION = 2; // Number(jsPsych.data.urlVariables().version);
jsPsych.data.addProperties({ version: VERSION });

function define_response_mapping(version) {
  if (version % 2 === 1) {
    PRMS.respKeys = ['Q', 'P'];
    respText =
      "<h2 style='text-align:center;'><b>H = linker Zeigefinger (Taste 'Q')</b></h2>" +
      "<h2 style='text-align:center;'><b>S = rechter Zeigefinger (Taste 'P')</b></h2><br>";
  } else {
    PRMS.respKeys = ['P', 'Q'];
    respText =
      "<h2 style='text-align:center;'><b>S = linker Zeigefinger (Taste 'Q')</b></h2>" +
      "<h2 style='text-align:center;'><b>H = rechter Zeigefinger (Taste 'P')</b></h2><br>";
  }
  return respText;
}

const RESP_TEXT = define_response_mapping(VERSION);

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
           Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest, und genügend Zeit hast,
           um das Experiment durchzuführen. Wir bitten dich, in den nächsten ca. 40 Minuten konzentriert zu arbeiten.<br><br>
           Bei Fragen oder Problemen wende dich bitte an:<br><br>
           hiwipibio@gmail.com<br><br>
           Drücke eine beliebige Taste, um fortzufahren`,
    align: 'left',
    fontsize: 28,
    bold: true,
    lineheight: 1.5,
  }),
};

const TASK_INSTRUCTIONS1 = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus:
    generate_formatted_html({
      text: `Aufgabe:<br><br>
      In diesem Experiment musst du auf den Ziel-Buchstaben H oder S in der Mitte des Bildschirms
      reagieren. Der Ziel-Buchstabe erscheint manchmal in <span style="color:green";>grüner</span> und manchmal in <span style="color:red";>roter</span> Farbe. Reagiere
      nur, wenn der Buchstabe <span style="color:green";>grün</span> ist! Somit sollst du keine Taste drücken, wenn der Buchstabe <span style="color:red";>rot</span> ist.<br><br>
      Reagiere bei <span style="color:green";>grün</span> wie folgt:<br><br>`,
      align: 'left',
      fontsize: 28,
      bold: true,
      lineheight: 1.5,
    }) +
    respText +
    generate_formatted_html({
      text: `Drücke eine beliebige Taste, um fortzufahren!`,
      align: 'left',
      fontsize: 28,
      bold: true,
      lineheight: 1.5,
    }),
};

const TASK_INSTRUCTIONS2 = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: generate_formatted_html({
    text: `WICHTIG:<br><br>
    Der Ziel-Buchstabe H oder S erscheint manchmal in <span style="color:green";>grün</span> und manchmal in
    <span style="color:red";>roter</span> Farbe. Reagiere nur so schnell und so genau wie möglich, wenn der
    Buchstabe <span style="color:green";>grün</span> ist! Somit sollst du keine Taste drücken, wenn der Buchstabe
    in <span style="color:red";>rot</span> erscheint.<br><br>
    Drücke eine beliebige Taste, um fortzufahren!`,
    align: 'left',
    fontsize: 28,
    bold: true,
    lineheight: 1.5,
  }),
};

const SPEED_ACCURACY_INSTRUCTIONS = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: generate_formatted_html({
    text: `Es folgen insgesamt ${PRMS.nBlks} Blöcke.<br><br>
    Wichtig: Zu Beginn eines jeden Blockes erfährt du ob der Fokus darauf liegt in diesem Block
    besonders schnell zu sein (SPEED-Block) oder ob der Fokus darauf liegt möglichst genau zu sein
    (ACCURACY-Block).<br><br>
    In SPEED-Blöcken sollst du versuchen besonders schnell zu reagieren und du musst weniger besorgt
    sein, wenn du in diesen Blöcken Fehler machst (aber nicht raten!)<br><br>
    In ACCURACY-Blöcken sollst du versuchen keine Fehler zu machen und du musst weniger besorgt
    sein, wenn du in diesen Blöcken langsamer bist.<br><br>
    Drücke eine beliebige Taste, um fortzufahren.`,
    align: 'left',
    fontsize: 28,
    bold: true,
    lineheight: 1.5,
  }),
};

const TASK_INSTRUCTIONS_SPEED = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: '',
  on_start: function (trial) {
    trial.stimulus =
      generate_formatted_html({
        text: `Block ${PRMS.cBlk} von ${PRMS.nBlks}:<br><br><br>
          ACHTUNG: <br>
          *** SPEED BLOCK ***<br><br>`,
        align: 'center',
        fontsize: 28,
        bold: true,
        lineheight: 1.5,
      }) +
      respText +
      generate_formatted_html({
        text: `Drücke eine beliebige Taste, um fortzufahren!`,
        align: 'center',
        fontsize: 28,
        bold: true,
        lineheight: 1.5,
      });
  },
};

const TASK_INSTRUCTIONS_ACCURACY = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: '',
  on_start: function (trial) {
    trial.stimulus =
      generate_formatted_html({
        text: `Block ${PRMS.cBlk} von ${PRMS.nBlks}:<br><br><br>
        *** ACCURACY BLOCK ***<br><br>`,
        align: 'center',
        fontsize: 28,
        bold: true,
        lineheight: 1.5,
      }) +
      respText +
      generate_formatted_html({
        text: `Drücke eine beliebige Taste, um fortzufahren!`,
        align: 'center',
        fontsize: 28,
        bold: true,
        lineheight: 1.5,
      });
  },
};

const TASK_INSTRUCTIONS_BREAK = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: generate_formatted_html({
    text: `Kurze Pause. Bitte nutze die Pause, um dich zu erholen. Wenn du wieder bereit für den nächsten Block bist, dann drücke eine beliebige Taste.`,
    align: 'left',
    fontsize: 28,
    bold: true,
    lineheight: 1.5,
  }),
};

function generate_flanker_combinations(nGo, nNoGo) {
  // prettier-ignore
  let flanker_go = repeatArray(
        [ { task: 'flanker', stimulus: 'HHHHH', colour: PRMS.colours[0], type: 'go', comp: 'comp',   correct_key: PRMS.respKeys[0]},
          { task: 'flanker', stimulus: 'SSSSS', colour: PRMS.colours[0], type: 'go', comp: 'comp',   correct_key: PRMS.respKeys[1]},
          { task: 'flanker', stimulus: 'SSHSS', colour: PRMS.colours[0], type: 'go', comp: 'incomp', correct_key: PRMS.respKeys[0]},
          { task: 'flanker', stimulus: 'HHSHH', colour: PRMS.colours[0], type: 'go', comp: 'incomp', correct_key: PRMS.respKeys[1]},
        ],
        nGo,
    );
  // prettier-ignore
  let flanker_nogo = repeatArray(
        [ { task: 'flanker', stimulus: 'HHHHH', colour: PRMS.colours[1], type: 'nogo', comp: 'comp',   correct_key: null},
          { task: 'flanker', stimulus: 'SSSSS', colour: PRMS.colours[1], type: 'nogo', comp: 'comp',   correct_key: null},
          { task: 'flanker', stimulus: 'SSHSS', colour: PRMS.colours[1], type: 'nogo', comp: 'incomp', correct_key: null},
          { task: 'flanker', stimulus: 'HHSHH', colour: PRMS.colours[1], type: 'nogo', comp: 'incomp', correct_key: null},
        ],
        nNoGo,
    );
  return flanker_go.concat(flanker_nogo);
}

const FLANKER_TRIALS_LOW_NOGO = generate_flanker_combinations((PRMS.nTrls / 4) * 0.9, (PRMS.nTrls / 4) * 0.1); // 50% NoGo
const FLANKER_TRIALS_HIGH_NOGO = generate_flanker_combinations((PRMS.nTrls / 4) * 0.5, (PRMS.nTrls / 4) * 0.5); // 50% NoGo
// console.table(FLANKER_TRIALS_LOW_NOGO);
// console.table(FLANKER_TRIALS_HIGH_NOGO);

////////////////////////////////////////////////////////////////////////
//                         Trial Parts                                //
////////////////////////////////////////////////////////////////////////

const WAIT_BLANK = {
  type: jsPsychStaticCanvasKeyboardResponse,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  trial_duration: PRMS.wait,
  response_ends_trial: false,
};

function draw_fixation() {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  ctx.strokeStyle = 'Black';
  ctx.lineWidth = PRMS.fixWidth;
  ctx.moveTo(-PRMS.fixSize, 0);
  ctx.lineTo(PRMS.fixSize, 0);
  ctx.stroke();
  ctx.moveTo(0, -PRMS.fixSize);
  ctx.lineTo(0, PRMS.fixSize);
  ctx.stroke();
}

const FIXATION_CROSS = {
  type: jsPsychStaticCanvasKeyboardResponse,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  translate_origin: true,
  response_ends_trial: false,
  trial_duration: PRMS.fixDur,
  func: draw_fixation,
};

function draw_flanker(args) {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  ctx.font = PRMS.stimSize;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = args.colour;
  ctx.fillText(args.stimulus, 0, 0); // always central
}

function code_trial() {
  'use strict';
  let dat = jsPsych.data.get().last(1).values()[0];
  let corrCode = 0;

  let rt;
  let rt_deadline = dat.sat === 'Accuracy' ? PRMS.tooSlow : PRMS.tooSlow / 2;
  if (dat.type === 'go') {
    let is_correct = jsPsych.pluginAPI.compareKeys(dat.key_press, dat.correct_key);
    rt = dat.rt !== null ? dat.rt : PRMS.tooSlow;
    if (is_correct && rt < rt_deadline) {
      corrCode = 1; // correct
    } else if (!is_correct && rt < rt_deadline) {
      corrCode = 2; // choice error
    } else if (rt >= rt_deadline) {
      corrCode = 3; // too slow
    }
  } else if (dat.type === 'nogo') {
    if (dat.key_press === null) {
      corrCode = 1; // correct withheld response
    } else if (dat.key_press !== null) {
      corrCode = 2; // response to nogo trial
    }
  }

  jsPsych.data.addDataToLastTrial({
    date: Date(),
    rt: rt,
    corrCode: corrCode,
    blockNum: PRMS.cBlk,
    trialNum: PRMS.cTrl,
  });
}

const TRIAL_FEEDBACK = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: '',
  trial_duration: 0,
  response_ends_trial: false,
  on_start: function (trial) {
    let dat = jsPsych.data.get().last(1).values()[0];
    trial.trial_duration = PRMS.fbDur[0];
    if (dat.sat === 'Accuracy') {
      // shown for longer when error made
      if (dat.corrCode === 2) {
        trial.trial_duration = PRMS.fbDur[1];
      }
    } else if (dat.sat === 'Speed') {
      // shown for longer when too slow
      if (dat.corrCode === 3) {
        trial.trial_duration = PRMS.fbDur[1];
      }
    }
    if (dat.type === 'go') {
      trial.stimulus = `<div style="font-size:${PRMS.fbTxtSizeTrial}px; color:Black; font-weight: normal;">${
        PRMS.fbTxtGo[dat.corrCode - 1]
      }</div>`;
    } else if (dat.type === 'nogo') {
      trial.stimulus = `<div style="font-size:${PRMS.fbTxtSizeTrial}px; color:Black;font-weight: normal;">${
        PRMS.fbTxtNoGo[dat.corrCode - 1]
      }</div>`;
    }
  },
};

function blockFeedbackTextAccuracy(accuracyRate) {
  return `Block: ${PRMS.cBlk} von ${PRMS.nBlks}<br><br>
        Accuracy Rate: ${accuracyRate} %<br><br>
        Drücke eine beliebige Taste, um fortzufahren.`;
}

function blockFeedbackTextSpeed(meanRt, nErrors) {
  let blockFbTxt;
  if (nErrors <= 15) {
    blockFbTxt = `Block ${PRMS.cBlk} von ${PRMS.nBlks}<br><br>
      Mittlere Reaktionszeit: ${meanRt} ms<br><br>
      Drücke eine beliebige Taste, um fortzufahren.`;
  } else {
    blockFbTxt = `Block ${PRMS.cBlk} von ${PRMS.nBlks}<br><br>
      Mittlere Reaktionszeit: ${meanRt} ms<br><br>
      You made many errors – you should be fast but without guessing!<br><br>'
      Drücke eine beliebige Taste, um fortzufahren.`;
  }
  return blockFbTxt;
}

function calculateBlockPerformance({
  filter_options = {},
  rtColumn = 'rt',
  corrColumn = 'corrCode',
  corrValue = 1,
  errorValue = 2,
} = {}) {
  let dat = jsPsych.data.get().filter(filter_options);
  let blockType = dat.trials[0].sat;
  let nTotal = dat.count();
  let nCorrect = dat.select(corrColumn).values.filter(function (x) {
    return x === corrValue;
  }).length;
  let nError = dat.select(corrColumn).values.filter(function (x) {
    return x === errorValue;
  }).length;
  let meanRt = Math.round(dat.select(rtColumn).mean());
  let accuracyRate = Math.round((nCorrect / nTotal) * 100);

  return { blockType: blockType, meanRt: meanRt, accuracyRate: accuracyRate, nError: nError };
}

const BLOCK_FEEDBACK = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: '',
  trial_duration: null,
  response_ends_trial: true,
  on_start: function (trial) {
    let block_dvs = calculateBlockPerformance({ filter_options: { stim: 'flanker', blockNum: PRMS.cBlk } });
    let text;
    if (block_dvs.blockType === 'Accuracy') {
      text = blockFeedbackTextAccuracy(block_dvs.accuracyRate);
    } else if (block_dvs.blockType === 'Speed') {
      text = blockFeedbackTextSpeed(block_dvs.meanRt, block_dvs.nError);
    }
    trial.stimulus = `<div style="font-size:${PRMS.fbTxtSizeBlock}px; font-weight: bold;">${text}</div>`;
  },
  on_finish: function () {
    PRMS.cTrl = 1;
    PRMS.cBlk += 1;
  },
};

const FLANKER_STIMULUS = {
  type: jsPsychStaticCanvasKeyboardResponse,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  translate_origin: true,
  response_ends_trial: true,
  choices: PRMS.respKeys,
  trial_duration: PRMS.tooSlow,
  func: draw_flanker,
  func_args: [{ stimulus: jsPsych.timelineVariable('stimulus'), colour: jsPsych.timelineVariable('colour') }],
  data: {
    stim: 'flanker',
    task: jsPsych.timelineVariable('task'),
    flanker_array: jsPsych.timelineVariable('stimulus'),
    type: jsPsych.timelineVariable('type'),
    comp: jsPsych.timelineVariable('comp'),
    nogo_prob: jsPsych.timelineVariable('nogo_prob'),
    colour: jsPsych.timelineVariable('colour'),
    sat: jsPsych.timelineVariable('sat'),
    correct_key: jsPsych.timelineVariable('correct_key'),
  },
  on_start: function (trial) {
    trial.trial_duration = [1, 2, 11, 12].includes(PRMS.cBlk) ? PRMS.tooSlowPractice : PRMS.tooSlow;
    /* if (trial.data.sat === 'Accuracy') { */
    /*   trial.trial_duration = [1, 2, 11, 12].includes(PRMS.cBlk) ? PRMS.tooSlowPractice : PRMS.tooSlow; */
    /* } else if (trial.data.saT === 'Speed') { */
    /*   trial.trial_duration = [1, 2, 11, 12].includes(PRMS.cBlk) ? PRMS.tooSlowPractice / 2 : PRMS.tooSlow / 2; */
    /* } */
  },
  on_finish: function () {
    code_trial();
    PRMS.cTrl += 1;
  },
};

////////////////////////////////////////////////////////////////////////
//                         Trial Timelines                            //
////////////////////////////////////////////////////////////////////////
const TRIAL_TIMELINE_LOW_NOGO = {
  timeline: [FIXATION_CROSS, FLANKER_STIMULUS, TRIAL_FEEDBACK],
  timeline_variables: FLANKER_TRIALS_LOW_NOGO,
};

const TRIAL_TIMELINE_HIGH_NOGO = {
  timeline: [FIXATION_CROSS, FLANKER_STIMULUS, TRIAL_FEEDBACK],
  timeline_variables: FLANKER_TRIALS_HIGH_NOGO,
};

////////////////////////////////////////////////////////////////////////
//                              Save                                  //
////////////////////////////////////////////////////////////////////////
const DIR_NAME = getDirName();
const EXP_NAME = getFileName();

function save() {
  const vpNum = getTime();
  jsPsych.data.addProperties({ vpNum: vpNum });

  const data_fn = `${DIR_NAME}data/${EXP_NAME}_${vpNum}`;
  // saveData('/Common/write_data.php', data_fn, { stim: 'flanker' });
  saveDataLocal('/Common/write_data.php', { stim: 'flanker' });
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
  exp.push(vpInfoForm('/Common7+/vpInfoForm_de.html'));
  exp.push(mouseCursor(false));

  exp.push(WELCOME_INSTRUCTIONS);
  exp.push(WAIT_BLANK);

  exp.push(TASK_INSTRUCTIONS1);
  exp.push(WAIT_BLANK);

  exp.push(TASK_INSTRUCTIONS2);
  exp.push(WAIT_BLANK);

  exp.push(SPEED_ACCURACY_INSTRUCTIONS);
  exp.push(WAIT_BLANK);

  // Counter-balanced NoGo proportion order (10 vs. 50 %)
  let nogo_proportion = [];
  if ([1, 2, 3, 4].includes(VERSION)) {
    nogo_proportion = repeatArray(['Low'], PRMS.nBlks / 2).concat(repeatArray(['High'], PRMS.nBlks / 2));
  } else if ([5, 6, 7, 8].includes(VERSION)) {
    nogo_proportion = repeatArray(['High'], PRMS.nBlks / 2).concat(repeatArray(['Low'], PRMS.nBlks / 2));
  }

  // Counter-balanced SAT order (Accuracy vs. Speed)
  let sat_condition = [];
  if ([1, 2, 5, 6].includes(VERSION)) {
    sat_condition = repeatArray(['Accuracy', 'Speed'], PRMS.nBlks / 2);
  } else if ([3, 4, 7, 8].includes(VERSION)) {
    sat_condition = repeatArray(['Speed', 'Accuracy'], PRMS.nBlks / 2);
  }

  for (let blk = 0; blk < PRMS.nBlks; blk += 1) {
    // add approprite block start SAT instructions
    if (sat_condition[blk] === 'Accuracy') {
      exp.push(TASK_INSTRUCTIONS_ACCURACY);
    } else if (sat_condition[blk] === 'Speed') {
      exp.push(TASK_INSTRUCTIONS_SPEED);
    }

    // select appropriate blk_timeline
    let blk_timeline;
    if (nogo_proportion[blk] === 'Low') {
      blk_timeline = TRIAL_TIMELINE_LOW_NOGO;
    } else if (nogo_proportion[blk] === 'High') {
      blk_timeline = TRIAL_TIMELINE_HIGH_NOGO;
    }

    // add low vs. high to block timeline variables
    for (let i = 0; i < blk_timeline.timeline_variables.length; i++) {
      blk_timeline.timeline_variables[i].nogo_prob = nogo_proportion[blk];
      blk_timeline.timeline_variables[i].sat = sat_condition[blk];
    }

    blk_timeline.sample = {
      type: 'fixed-repetitions',
      size: 1,
    };
    exp.push(deepCopy(blk_timeline)); // trials within a block

    if (blk < PRMS.nBlks) {
      exp.push(BLOCK_FEEDBACK); // show blockfeedback
      // exp.push(TASK_INSTRUCTIONS_BREAK); // show PAUSE
    }
  }

  // save data
  exp.push(SAVE_DATA);

  // debrief
  exp.push(mouseCursor(true));
  exp.push(end_message());
  exp.push(fullscreen(false));

  return exp;
}
const EXP = genExpSeq();

jsPsych.run(EXP);
