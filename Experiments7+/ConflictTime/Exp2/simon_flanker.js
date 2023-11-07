// Simon Flanker Task:
// Participants respond to a laterally presented letter (H/S) with
//  left and right key-press responses, or the central letter within
//  an array of letters (e.g., HHH, HSH).
// Blockwise manipulation:
// Classic Simon Task vs. Classic Flanker Task
// Trialwise manipulation:
// Short (150 ms) vs. Long (Until response, or 1500ms) stimulus duration

const jsPsych = initJsPsych({});

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const CANVAS_COLOUR = "rgba(200, 200, 200, 1)";
const CANVAS_SIZE = [1280, 720];
const CANVAS_BORDER = "5px solid black";

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const PRMS = {
  screenRes: [960, 720],
  nTrlsP: 56, // number of trials in first block (practice)
  nTrlsE: 56, // number of trials in subsequent blocks
  nBlks: 14, // number of blocks
  fixDur: 500, // duration of fixation cross
  fixSize: 10, // size of fixation cross
  fixWidth: 4, // size of fixation cross
  fbDur: [0, 1500, 1500, 1500], // duration of feedback for each type
  waitDur: 1000, // duration following ...
  iti: 500, // duration of inter-trial-interval
  tooFast: 150, // responses faster than x ms -> too fast!
  tooSlow: 1500, // response slower than x ms -> too slow!
  targetDuration: [150, 1500],
  respKeys: ["Q", "P"],
  target: shuffle(["H", "S"]),
  stimFont: "100px Monospace",
  stimEccentricity: 200,
  fbTxt: ["", "Falsch", "Zu langsam", "Zu schnell"],
  fbTxtSizeTrial: 26,
  fbTxtSizeBlock: 26,
  cTrl: 1, // count trials
  cBlk: 1, // count blocks
};

// 2 counter balanced versions
const VERSION = Number(jsPsych.data.urlVariables().version);
jsPsych.data.addProperties({ version: VERSION });

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const TASK_INSTRUCTIONS1 = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: generate_formatted_html({
    text: `Willkommen zu unserem Experiment:<br><br>
               Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.
               Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und genügend Zeit hast,
               um das Experiment durchzuführen. Wir bitten dich die nächsten ca. 30-35 Minuten konzentriert zu arbeiten.<br><br>
               Du erhältst Informationen zur Versuchspersonenstunde nach dem Experiment.
               Bei Fragen oder Problemen wende dich bitte an:<br><br>
               ruben.ellinghaus@fernuni-hagen.de<br><br>
               Drücke eine beliebige Taste, um fortzufahren`,
    align: "left",
    colour: "black",
    fontsize: 30,
  }),
};

function pad_me(str, npad) {
  let len = Math.floor((npad - str.length) / 2);
  str = " ".repeat(len) + str + " ".repeat(len);
  return str
    .split("")
    .map(function(c) {
      return c === " " ? "&nbsp;" : c;
    })
    .join("");
}

// response keys
const RESP_TEXT = generate_formatted_html({
  text: `${pad_me(PRMS.target[0], 25) +
    pad_me(PRMS.target[1], 25) +
    "<br>" +
    pad_me("(Taste-" + PRMS.respKeys[0] + ")", 20) +
    pad_me("(Taste-" + PRMS.respKeys[1] + ")", 20)
    }`,
  align: "center",
  fontsize: 30,
  bold: true,
  lineheight: 1.5,
});

const TASK_INSTRUCTIONS_SIMON = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: "",
  on_start: function(trial) {
    trial.stimulus =
      generate_formatted_html({
        text: `Mini-Block ${PRMS.cBlk} von ${PRMS.nBlks}:<br><br>
               In diesem Block musst du auf in jedem Durchgang auf den
               Buchstaben reagieren welcher <span style="font-weight:bold;">rechts oder links</span> auf dem Bildschirm erscheint.
               Reagiere wie folgt:<br>`,
        align: "left",
        colour: "black",
        fontsize: 30,
      }) +
      RESP_TEXT +
      generate_formatted_html({
        text: `Drücke eine beliebige Taste, um fortzufahren.`,
        align: "left",
        colour: "black",
        fontsize: 30,
      });
  },
};

const TASK_INSTRUCTIONS_FLANKER = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: "",
  on_start: function(trial) {
    trial.stimulus =
      generate_formatted_html({
        text: `Mini-Block ${PRMS.cBlk} von ${PRMS.nBlks}:<br><br>
               In diesem Block musst du in jedem Durchgang auf den
               Buchstaben reagieren welcher <span style="font-weight:bold;">zentral</span> auf dem Bildschirm erscheint.
               Reagiere wie folgt:<br>`,
        align: "left",
        colour: "black",
        fontsize: 30,
      }) +
      RESP_TEXT +
      generate_formatted_html({
        text: `Drücke eine beliebige Taste, um fortzufahren.`,
        align: "left",
        colour: "black",
        fontsize: 30,
      });
  },
};

const TASK_REMINDER = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: "",
  on_start: function(trial) {
    trial.stimulus =
      generate_formatted_html({
        text: `Block ${PRMS.cBlk} von ${PRMS.nBlks}<br><br>Es gilt:`,
        align: "left",
        colour: "black",
        fontsize: 30,
      }) +
      RESP_TEXT +
      generate_formatted_html({
        text: `<br>Drücke eine beliebige Taste, um fortzufahren.`,
        align: "left",
        colour: "black",
        fontsize: 30,
      });
  },
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////

// prettier-ignore
const TRIALS_SIMON = [
  { type: "simon", target: PRMS.target[0], distractor: "left", duration: PRMS.targetDuration[0], compatibility: "comp", key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[0])] },
  { type: "simon", target: PRMS.target[1], distractor: "right", duration: PRMS.targetDuration[0], compatibility: "comp", key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[1])] },
  { type: "simon", target: PRMS.target[0], distractor: "right", duration: PRMS.targetDuration[0], compatibility: "incomp", key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[0])] },
  { type: "simon", target: PRMS.target[1], distractor: "left", duration: PRMS.targetDuration[0], compatibility: "incomp", key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[1])] },
  { type: "simon", target: PRMS.target[0], distractor: "left", duration: PRMS.targetDuration[1], compatibility: "comp", key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[0])] },
  { type: "simon", target: PRMS.target[1], distractor: "right", duration: PRMS.targetDuration[1], compatibility: "comp", key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[1])] },
  { type: "simon", target: PRMS.target[0], distractor: "right", duration: PRMS.targetDuration[1], compatibility: "incomp", key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[0])] },
  { type: "simon", target: PRMS.target[1], distractor: "left", duration: PRMS.targetDuration[1], compatibility: "incomp", key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[1])] },
];

// prettier-ignore
const TRIALS_FLANKER = [
  { type: "flanker", target: PRMS.target[0], distractor: PRMS.target[0], duration: PRMS.targetDuration[0], compatibility: "comp", key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[0])] },
  { type: "flanker", target: PRMS.target[1], distractor: PRMS.target[1], duration: PRMS.targetDuration[0], compatibility: "comp", key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[1])] },
  { type: "flanker", target: PRMS.target[0], distractor: PRMS.target[1], duration: PRMS.targetDuration[0], compatibility: "incomp", key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[0])] },
  { type: "flanker", target: PRMS.target[1], distractor: PRMS.target[0], duration: PRMS.targetDuration[0], compatibility: "incomp", key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[1])] },
  { type: "flanker", target: PRMS.target[0], distractor: PRMS.target[0], duration: PRMS.targetDuration[1], compatibility: "comp", key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[0])] },
  { type: "flanker", target: PRMS.target[1], distractor: PRMS.target[1], duration: PRMS.targetDuration[1], compatibility: "comp", key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[1])] },
  { type: "flanker", target: PRMS.target[0], distractor: PRMS.target[1], duration: PRMS.targetDuration[1], compatibility: "incomp", key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[0])] },
  { type: "flanker", target: PRMS.target[1], distractor: PRMS.target[0], duration: PRMS.targetDuration[1], compatibility: "incomp", key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[1])] },
];

////////////////////////////////////////////////////////////////////////
//                              Exp Parts                             //
////////////////////////////////////////////////////////////////////////
function drawFixation() {
  "use strict";
  let ctx = document.getElementById("canvas").getContext("2d");
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
  func: drawFixation,
};

const ITI = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: "",
  response_ends_trial: false,
  trial_duration: PRMS.iti,
};

const TRIAL_FEEDBACK = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: "",
  response_ends_trial: false,
  trial_duration: 0,
  on_start: function(trial) {
    let dat = jsPsych.data.get().last(1).values()[0];
    if (dat.corrCode !== 1) {
      trial.trial_duration = PRMS.fbDur[dat.corrCode - 1];
      trial.stimulus = generate_formatted_html({
        text: `${PRMS.fbTxt[dat.corrCode - 1]}`,
        align: "center",
        fontsize: 30,
        lineheight: 1.5,
      });
    }
  },
};

function codeTrial() {
  "use strict";
  let dat = jsPsych.data.get().last(1).values()[0];
  dat.rt = dat.rt !== null ? dat.rt : PRMS.tooSlow;

  let corrCode = 0;
  let correctKey = jsPsych.pluginAPI.compareKeys(dat.key_press, dat.corrResp);

  if (correctKey && dat.rt > PRMS.tooFast && dat.rt < PRMS.tooSlow) {
    corrCode = 1; // correct
  } else if (!correctKey && dat.rt > PRMS.tooFast && dat.rt < PRMS.tooSlow) {
    corrCode = 2; // choice error
  } else if (dat.rt >= PRMS.tooSlow) {
    corrCode = 3; // too slow
  } else if (dat.rt <= PRMS.tooFast) {
    corrCode = 4; // too fast
  }
  jsPsych.data.addDataToLastTrial({
    date: Date(),
    blockNum: PRMS.cBlk,
    trialNum: PRMS.cTrl,
    corrCode: corrCode,
  });
}

function drawStimulus(args) {
  "use strict";
  let ctx = document.getElementById("canvas").getContext("2d");
  ctx.font = PRMS.stimFont;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "black";

  if (args.type === "simon") {
    if (args.distractor === "left") {
      ctx.fillText(args.target, -PRMS.stimEccentricity, 0);
    } else if (args.distractor === "right") {
      ctx.fillText(args.target, PRMS.stimEccentricity, 0);
    }
  } else if (args.type === "flanker") {
    ctx.fillText(args.distractor, -PRMS.stimEccentricity, 0);
    ctx.fillText(args.target, 0, 0);
    ctx.fillText(args.distractor, PRMS.stimEccentricity, 0);
  }
}

const STIMULUS = {
  type: jsPsychStaticCanvasKeyboardResponse,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  translate_origin: true,
  response_ends_trial: true,
  trial_duration: PRMS.tooSlow,
  choices: PRMS.respKeys,
  stimulus_duration: jsPsych.timelineVariable("duration"),
  trial_duration: PRMS.tooSlow,
  func: drawStimulus,
  func_args: null,
  data: {
    stim: "simon_flanker",
    type: jsPsych.timelineVariable("type"),
    target: jsPsych.timelineVariable("target"),
    distractor: jsPsych.timelineVariable("distractor"),
    duration: jsPsych.timelineVariable("duration"),
    compatibility: jsPsych.timelineVariable("compatibility"),
    corrResp: jsPsych.timelineVariable("key"),
  },
  on_start: function(trial) {
    trial.func_args = [
      {
        type: jsPsych.timelineVariable("type"),
        target: jsPsych.timelineVariable("target"),
        distractor: jsPsych.timelineVariable("distractor"),
        duration: jsPsych.timelineVariable("duration"),
        compatibility: jsPsych.timelineVariable("compatibility"),
      },
    ];
  },
  on_finish: function() {
    codeTrial();
    PRMS.cTrl += 1;
  },
};

const TRIAL_TIMELINE_SIMON = {
  timeline: [FIXATION_CROSS, STIMULUS, TRIAL_FEEDBACK, ITI],
  timeline_variables: TRIALS_SIMON,
};

const TRIAL_TIMELINE_FLANKER = {
  timeline: [FIXATION_CROSS, STIMULUS, TRIAL_FEEDBACK, ITI],
  timeline_variables: TRIALS_FLANKER,
};

const BLOCK_FEEDBACK = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  response_ends_trial: true,
  on_start: function(trial) {
    let block_dvs = calculateBlockPerformance({ filter_options: { stim: "simon_flanker", blockNum: PRMS.cBlk } });
    let text = blockFeedbackText(PRMS.cBlk, PRMS.nBlks, block_dvs.meanRt, block_dvs.errorRate, (language = "de"));
    trial.stimulus = `<div style="font-size:${PRMS.fbTxtSizeBlock}px;">${text}</div>`;
  },
  on_finish: function() {
    PRMS.cTrl = 1;
    PRMS.cBlk += 1;
  },
};

////////////////////////////////////////////////////////////////////////
//                             VP Stunden                             //
////////////////////////////////////////////////////////////////////////
const END_SCREEN = {
  type: jsPsychHtmlKeyboardResponse,
  response_ends_trial: true,
  choices: [" "],
  stimulus: generate_formatted_html({
    text: `Dieser Teil des Experiments ist jetzt beendet.<br><br>
             Nun folgen Informationen zur Versuchspersonenstunde auf Unipark.
             Drücke eine beliebige Taste, um die Weiterleitung zu Unipark zu starten.`,
    fontsize: 28,
    lineheight: 1.0,
    bold: false,
    align: "left",
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

  const fn = `${DIR_NAME}data/version${VERSION}/${EXP_NAME}_${vpNum}`;
  saveData("/Common/write_data.php", fn, { stim: "simon_flanker" });
  // saveDataLocal(fn, { stim: 'simon' });
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
  "use strict";

  let exp = [];

  exp.push(fullscreen(true));
  exp.push(browser_check(PRMS.screenRes));
  exp.push(resize_browser());
  exp.push(welcome_message());
  exp.push(vpInfoForm("vpInfoForm_de.html"));
  exp.push(mouseCursor(false));
  exp.push(TASK_INSTRUCTIONS1);

  let blk_type;
  if (VERSION === 1) {
    blk_type = repeatArray(["simon", "flanker"], PRMS.nBlks / 2);
  } else if (VERSION === 2) {
    blk_type = repeatArray(["flanker", "simon"], PRMS.nBlks / 2);
  }

  for (let blk = 0; blk < PRMS.nBlks; blk += 1) {
    let blk_timeline;
    if (blk_type[blk] === "simon") {
      exp.push(TASK_INSTRUCTIONS_SIMON);
      blk_timeline = { ...TRIAL_TIMELINE_SIMON };
    } else if (blk_type[blk] === "flanker") {
      exp.push(TASK_INSTRUCTIONS_FLANKER);
      blk_timeline = { ...TRIAL_TIMELINE_FLANKER };
    }
    blk_timeline.sample = {
      type: "fixed-repetitions",
      size: [0, 1].includes(blk) ? PRMS.nTrlsP / TRIALS_SIMON.length : PRMS.nTrlsE / TRIALS_SIMON.length,
    };
    exp.push(blk_timeline); // trials within a block
    exp.push(BLOCK_FEEDBACK); // show previous block performance
  }

  exp.push(SAVE_DATA);

  // debrief
  exp.push(mouseCursor(true));
  exp.push(END_SCREEN);
  exp.push(end_message());
  exp.push(fullscreen(false));

  return exp;
}
const EXP = genExpSeq();

jsPsych.run(EXP);
