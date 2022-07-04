// Flanker Task:
// VPs respond to the centre line type (dotted/dashed) whilst ignoring the
// surrounding lines

// Standard Flanker Task:
// VPs respond to the direction of the central arrow whilst
// ignoring the surrounding arrows using key responses ("Q" and "P").

const jsPsych = initJsPsych({});

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
  imageSet: 1,
  screenRes: [960, 720],
  nTrlsP: 64, // number of trials in first block (practice)
  nTrlsE: 64, // number of trials in subsequent blocks
  nBlks: 8, // number of blocks
  fixDur: 500, // duration of fixation cross
  fixSize: 40, // size of fixation cross
  fbDur: [0, 2000, 2000, 2000], // duration of feedback for each type
  waitDur: 1000, // duration following ...
  iti: 500, // duration of inter-trial-interval
  tooFast: 150, // responses faster than x ms -> too fast!
  tooSlow: 2000, // response slower than x ms -> too slow!
  respKeys: ['Q', 'P'],
  target: shuffle(['gestrichelt', 'gepunktet']),
  stimHeight: 180,
  fbTxt: ['', 'Falsch', 'Zu langsam', 'Zu schnell'],
  fbTxtSizeTrial: 26,
  fbTxtSizeBlock: 26,
  cTrl: 1, // count trials
  cBlk: 1, // count blocks
};

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const task_instructions1 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: generate_formatted_html({
    text: `Willkommen zu unserem Experiment:<br><br>
Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.
Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und genügend Zeit hast,
um das Experiment durchzuführen. Wir bitten dich die nächsten ca. 35-40 Minuten konzentriert zu arbeiten.<br><br>
Du erhältst den Code für Versuchspersonenstunden und weitere Anweisungen am Ende des Experiments.
Bei Fragen oder Problemen wende dich bitte an:<br><br>
hiwipibio@gmail.com <br><br>
Drücke eine beliebige Taste, um fortzufahren`,
    align: 'left',
    colour: 'black',
    fontsize: 30,
  }),
};

const task_instructions2 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus:
    generate_formatted_html({
      text: `In jedem Durchgang werden Dir Stimuli präsentiert, die aus
    verschiedenen Linien bestehen. Deine Aufgabe besteht nun darin zu entscheiden,
    ob die mittlere Linie gepunktet oder gestrichelt
    ist. Es gilt:`,
      align: 'left',
      colour: 'black',
      fontsize: 30,
    }) +
    generate_formatted_html({
      text: `${prms.target[0]} = "${prms.respKeys[0]}" Taste &emsp; ${prms.target[1]} = "${prms.respKeys[1]}" Taste<br><br><br>
    Versuche bitte so schnell und fehlerfrei wie möglich zu antworten.<br><br>
        Drücke eine beliebige Taste, um fortzufahren`,
      align: 'left',
      colour: 'black',
      fontsize: 30,
    }),
};

const task_reminder = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '',
  on_start: function (trial) {
    trial.stimulus =
      generate_formatted_html({
        text: `Block ${prms.cBlk} von ${prms.nBlks}<br><br>Es gilt:`,
        align: 'left',
        colour: 'black',
        fontsize: 30,
      }) +
      generate_formatted_html({
        text: `${prms.target[0]} = "${prms.respKeys[0]}" Taste &emsp; ${prms.target[1]} = "${prms.respKeys[1]}" Taste<br><br><br>
    Versuche bitte so schnell und fehlerfrei wie möglich zu antworten.<br><br>
        Drücke eine beliebige Taste, um fortzufahren`,
        align: 'left',
        colour: 'black',
        fontsize: 30,
      });
  },
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////
const flankers = [
  `images${prms.imageSet}/dash-dash-noObject-near.png`,
  `images${prms.imageSet}/dash-dash-Object-near.png`,
  `images${prms.imageSet}/dash-dot-noObject-near.png`,
  `images${prms.imageSet}/dash-dot-Object-near.png`,
  `images${prms.imageSet}/dot-dash-noObject-near.png`,
  `images${prms.imageSet}/dot-dash-Object-near.png`,
  `images${prms.imageSet}/dot-dot-noObject-near.png`,
  `images${prms.imageSet}/dot-dot-Object-near.png`,
];

const preload = {
  type: jsPsychPreload,
  images: flankers,
};

// prettier-ignore
const trials = [
  { flanker: flankers[0], distance: "near", type: "noObject", comp: "comp",   key: prms.respKeys[prms.target.indexOf("gestrichelt")] },
  { flanker: flankers[1], distance: "near", type: "object",   comp: "comp",   key: prms.respKeys[prms.target.indexOf("gestrichelt")] },
  { flanker: flankers[2], distance: "near", type: "noObject", comp: "incomp", key: prms.respKeys[prms.target.indexOf("gestrichelt")] },
  { flanker: flankers[3], distance: "near", type: "object",   comp: "incomp", key: prms.respKeys[prms.target.indexOf("gestrichelt")] },
  { flanker: flankers[4], distance: "near", type: "noObject", comp: "incomp", key: prms.respKeys[prms.target.indexOf("gepunktet")]   },
  { flanker: flankers[5], distance: "near", type: "object",   comp: "incomp", key: prms.respKeys[prms.target.indexOf("gepunktet")]   },
  { flanker: flankers[6], distance: "near", type: "noObject", comp: "comp",   key: prms.respKeys[prms.target.indexOf("gepunktet")]   },
  { flanker: flankers[7], distance: "near", type: "object",   comp: "comp",   key: prms.respKeys[prms.target.indexOf("gepunktet")]   },
];

////////////////////////////////////////////////////////////////////////
//                              Exp Parts                             //
////////////////////////////////////////////////////////////////////////
const fixation_cross = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<div style="font-size:${prms.fixSize}px;">+</div>`,
  response_ends_trial: false,
  trial_duration: prms.fixDur,
};

const iti = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '',
  response_ends_trial: false,
  trial_duration: prms.iti,
};

const trial_feedback = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '',
  response_ends_trial: false,
  trial_duration: null,
  on_start: function (trial) {
    let dat = jsPsych.data.get().last(1).values()[0];
    trial.trial_duration = prms.fbDur[dat.corrCode - 1];
    trial.stimulus = `<div style="text-align: center; font-size:${prms.fbTxtSizeTrial}px;">${
      prms.fbTxt[dat.corrCode - 1]
    }</div>`;
  },
};

function codeTrial() {
  'use strict';
  let dat = jsPsych.data.get().last(1).values()[0];
  dat.rt = dat.rt !== null ? dat.rt : prms.tooSlow;

  let corrCode = 0;
  let correctKey = jsPsych.pluginAPI.compareKeys(dat.response, dat.corrResp);

  if (correctKey && dat.rt > prms.tooFast && dat.rt < prms.tooSlow) {
    corrCode = 1; // correct
  } else if (!correctKey && dat.rt > prms.tooFast && dat.rt < prms.tooSlow) {
    corrCode = 2; // choice error
  } else if (dat.rt >= prms.tooSlow) {
    corrCode = 3; // too slow
  } else if (dat.rt <= prms.tooFast) {
    corrCode = 4; // too fast
  }
  jsPsych.data.addDataToLastTrial({
    date: Date(),
    blockNum: prms.cBlk,
    trialNum: prms.cTrl,
    corrCode: corrCode,
  });
}

const flanker_stimulus = {
  type: jsPsychImageKeyboardResponse,
  stimulus: jsPsych.timelineVariable('flanker'),
  trial_duration: prms.tooSlow,
  response_ends_trial: true,
  stimulus_height: prms.stimHeight,
  choices: prms.respKeys,
  render_on_canvas: false,
  data: {
    stim: 'flanker',
    distance: jsPsych.timelineVariable('distance'),
    type: jsPsych.timelineVariable('type'),
    comp: jsPsych.timelineVariable('comp'),
    corrResp: jsPsych.timelineVariable('key'),
  },
  on_finish: function () {
    codeTrial();
    prms.cTrl += 1;
  },
};

const trial_timeline = {
  timeline: [fixation_cross, flanker_stimulus, trial_feedback, iti],
  timeline_variables: trials,
};

function blockFeedbackTextFG(cBlk, nBlks, meanRt, errorRate) {
  let blockFbTxt =
    '<h2>Block: ' +
    cBlk +
    ' von ' +
    nBlks +
    '</h2><br>' +
    '<h2>Mittlere Reaktionszeit: ' +
    meanRt +
    ' ms </h2>' +
    '<h2>Fehlerrate: ' +
    errorRate +
    ' %</h2><br>' +
    '<h4>Versuche weiterhin so schnell und fehlerfrei wie möglich zu antworten!</h4><br>' +
    '<h4>Drücke eine beliebige Taste, um fortzufahren.</h4>';
  return blockFbTxt;
}

const block_feedback = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '',
  response_ends_trial: true,
  post_trial_gap: prms.waitDur,
  on_start: function (trial) {
    let block_dvs = calculateBlockPerformance({ filter_options: { stim: 'flanker', blockNum: prms.cBlk } });
    let text = blockFeedbackTextFG(prms.cBlk, prms.nBlks, block_dvs.meanRt, block_dvs.errorRate, (language = 'de'));
    trial.stimulus = `<div style="font-size:${prms.fbTxtSizeBlock}px;">${text}</div>`;
  },
  on_finish: function () {
    prms.cTrl = 1;
    prms.cBlk += 1;
  },
};

////////////////////////////////////////////////////////////////////////
//                             VP Stunden                             //
////////////////////////////////////////////////////////////////////////
const randomString = generateRandomString(16, 'fg2_');

const alphaNum = {
  type: jsPsychHtmlKeyboardResponse,
  response_ends_trial: true,
  choices: [' '],
  stimulus: generate_formatted_html({
    text:
      `Vielen Dank für Ihre Teilnahme.<br><br>
        Wenn Sie Versuchspersonenstunden benötigen, kopieren Sie den folgenden
        zufällig generierten Code und senden Sie diesen zusammen mit Ihrer
        Matrikelnummer per Email mit dem Betreff 'Versuchpersonenstunde'
        an: <br><br>hiwipibio@gmail.com<br><br> Code: ` +
      randomString +
      `<br><br>Drücken Sie die Leertaste, um fortzufahren!`,
    fontsize: 28,
    lineheight: 1.0,
    bold: false,
    align: 'left',
  }),
};

////////////////////////////////////////////////////////////////////////
//                              Save                                  //
////////////////////////////////////////////////////////////////////////
const dirName = getDirName();
const expName = getFileName();

function save() {
  const vpNum = getTime();
  jsPsych.data.addProperties({ vpNum: vpNum });

  const fn = `${dirName}data/${expName}_${vpNum}`;
  saveData('/Common/write_data.php', fn, { stim: 'flanker' });
  // saveDataLocal(fn, { stim: 'flanker' });

  const code_fn = `${dirName}code/${expName}`;
  saveRandomCode('/Common/write_code.php', code_fn, randomString);
}

const save_data = {
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
  exp.push(browser_check(prms.screenRes));
  exp.push(preload);
  exp.push(resize_browser());
  exp.push(welcome_message());
  exp.push(vpInfoForm());
  exp.push(mouseCursor(false));
  exp.push(task_instructions1);
  exp.push(task_instructions2);

  for (let blk = 0; blk < prms.nBlks; blk += 1) {
    exp.push(task_reminder);
    let blk_timeline = { ...trial_timeline };
    blk_timeline.sample = {
      type: 'fixed-repetitions',
      size: blk === 0 ? prms.nTrlsP / trials.length : prms.nTrlsE / trials.length,
    };
    exp.push(blk_timeline); // trials within a block
    exp.push(block_feedback); // show previous block performance
  }

  exp.push(save_data);

  // debrief
  exp.push(mouseCursor(true));
  exp.push(alphaNum);
  exp.push(end_message());
  exp.push(fullscreen(false));

  return exp;
}
const EXP = genExpSeq();

jsPsych.run(EXP);
