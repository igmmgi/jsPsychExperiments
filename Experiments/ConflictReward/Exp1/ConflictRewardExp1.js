// Cognitive Control and Reward: BSc Project SS2021
//
// Two standard conflict tasks (presented in separate blocks):
//
// Simon Task:
// VPs respond to a laterally presented circles (red vs. green) with
// left/right-keypresses ("Q" and "P"). Stimuli are presented in one of two
// locations (left vs. right), with colour assigned to the response key.
//
// Stroop Task:
// VPs respond to the font colour of colour words (e.g., the word ROT presented
// in green font colour) with left/right-keypresses ("Q" and "P"). Stimuli are
// presented centrally.
//
// Factors:
// Task (Flanker vs. Simon) within
// Compatibility (Compatible vs. Incompatible) within
// Reward (Yes vs. No) between
//
// 4 Counter-balanced versions
// Version 1: Simon-RC  Stroop-RC
// Version 2: Stroop-RC Simon-RC
// Version 3: Simon-RI  Stroop-RI
// Version 4: Stroop-RI Simon-RI

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const canvas_colour = 'rgba(255, 255, 255, 1)';
const canvas_size = [960, 720];
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
getComputerInfo();

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
  nTrlsP: 4, // number of trials in each block
  nTrlsE: 4, // number of trials in each block
  nBlks: 10,
  fixDur: 400,
  fbDur: [1500, 2500, 2500],
  iti: 500,
  tooSlow: 1500,
  tooFast: 0,
  fbTxt: ['Richtig', 'Falsch!', 'Zu langsam!'],
  cTrl: 1, // count trials
  cBlk: 1, // count blocks
  fixWidth: 2,
  fixSize: 10,
  stimSize: '40px monospace',
  fbSize: '24px monospace',
  simonEccentricity: 150,
  simonSize: 20,
  respKeys: ['q', 'p'],
};

// 4 counter-balanced order versions
const orderVersion = Number(jsPsych.data.urlVariables().orderVersion);
jsPsych.data.addProperties({ orderVersion: orderVersion });

// 2 random key assignments
const keyVersion = getRandomInt(1, 2);
jsPsych.data.addProperties({ keyVersion: keyVersion });

const rewardCondition = [1, 2].includes(orderVersion) ? ['kongruent', 'inkongruent'] : ['inkongruent', 'kongruent'];
const rewardConditionInstructions1 = [1, 2].includes(orderVersion) ? ['mit', 'ohne'] : ['ohne', 'mit'];
const rewardConditionInstructions2 = [1, 2].includes(orderVersion)
  ? ['übereinstimmt', 'nicht übereinstimmt']
  : ['nicht übereinstimmt', 'übereinstimmt'];
const colourMapping = keyVersion === 1 ? ['rot', 'grün'] : ['grün', 'rot'];

const respText = generate_formatted_html({
  text: `${colourMapping[0]} = linker Zeigefinger (Taste 'Q')<br>
             ${colourMapping[1]} = rechter Zeigefinger (Taste 'P')<br>`,
  fontsize: 22,
  lineheight: 1.5,
});

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const task_instructions1 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: generate_formatted_html({
    text: `Herzlich Willkommen zu unserem Experiment:<br><br>
           Die Teilnahme ist selbstverständlich freiwillig und kann jederzeit durch
           drücken der Escape- Taste abgebrochen werden.<br><br>
           Wir bitten dich die nächsten ca. 35-40 Minuten konzentriert zu arbeiten: Für
           deine Teilnahme kannst du 1 VP-Stunde erhalten. Während des Experiments ist es
           in manchen Versuchsdurchgängen möglich, Belohnungen in Form von Punkten zu
           sammeln. Die zehn Teilnehmer mit der besten Gesamtleistung könnten zusätzlich
           einen 10€-Gutschein für XXXX erhalten (insgesamt gibt es maximal 60 Teilnehmer).<br><br>
           Weiter geht es durch Drücken der Leertaste...`,
    fontsize: 26,
    lineheight: 1.5,
    align: 'left',
  }),
  choices: [' '],
};

const task_instructions2 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: generate_formatted_html({
    text: `Du erhaelst den Code für die Versuchspersonenstunden und weitere Anweisungen
    zur Gutscheinvergabe am Ende des Experimentes.<br><br>
    Bei Fragen oder Problemen wende dich bitte an:<br>
    hiwipibio@gmail.com<br><br><br>
    Weiter geht es durch Drücken der Leertaste...`,
    fontsize: 26,
    lineheight: 1.5,
    align: 'left',
  }),
  choices: [' '],
};

const task_instructions3 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus:
    generate_formatted_html({
      text: `Versuche in Durchgängen mit Belohnung immer einen Punkt zu erhalten
    in dem du so genau und so schnell wie möglich antwortest!<br><br>
Bitte beachte aber auch in Durchgängen ohne Belohnung genau zu antworten: <br><br>
Deine Gesamtleistung berechnet sich aus der Anzahl Punkte in Durchgängen mit Belohnung:<br><br>`,
      fontsize: 26,
      lineheight: 1.5,
      align: 'left',
    }) +
    generate_formatted_html({
      text: `Gesamtpunktzahl (in Durchgängen mit Belohnung): 0 Punkte<br>
Gesamt korrekt (in Durchgängen ohne Belohnung): 100 %<br><br>`,
      fontsize: 26,
      lineheight: 1.5,
      align: 'center',
    }) +
    generate_formatted_html({
      text: `Bereit?<br>
        Witer geht es durch Drücken der Leertaste...`,
      fontsize: 26,
      lineheight: 1.5,
      align: 'left',
    }),
  choices: [' '],
};

const task_instructions_simon = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus:
    generate_formatted_html({
      text: `In der folgenden Aufgabe werden rote oder grüne Kreise entweder auf
    der rechten oder linken Seite des Bildschirmes erscheinen. Die Seite, auf
    der der Kreis erscheint ist für Deine Reaktion nicht relevant. Reagiere
    immer wie folgt:<br>`,
      fontsize: 24,
      lineheight: 1.25,
      align: 'left',
    }) +
    respText +
    generate_formatted_html({
      text: `In einem Durchgang kann die Position des Kreises mit der Seite,
      auf der Du reagieren musst übereinstimmen (z.B. der Kreis erscheint auf
      der linken Seite und Du musst für die Antwort den linken Zeigefinger
      verwenden) oder nicht (z.B. der Kreis erscheint auf der linken Seite und
      Du musst für die Antwort den rechten Zeigefinger verwenden).<br><br>
      Je nachdem hast du die Möglichkeit Belohnung zu erhalten:<br><br>
      In Durchgängen ${rewardConditionInstructions1[0]} Übereinstimmung hast du die Möglichkeit für
      korrekte und besonders schnelle Antworten einen Punkt / Belohnung zu erhalten.<br><br>
      In Durchgängen ${rewardConditionInstructions1[1]} Übereinstimmung
      kannst du keine Punkte / Belohnung erhalten.<br><br>
    Weiter geht es mit der Leertaste ...`,
      fontsize: 24,
      lineheight: 1.25,
      align: 'left',
    }),
  choices: [' '],
};

const task_instructions_stroop = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus:
    generate_formatted_html({
      text: `In der folgenden Aufgabe werden die Worte ROT oder GRÜN in roter
    oder grüner Farbe geschrieben erscheinen. Bitte reagiere immer nur auf die
    Farbe der Schrift und ignoriere das Wort. Reagiere immer wie folgt:<br>`,
      fontsize: 22,
      lineheight: 1.25,
      align: 'left',
    }) +
    respText +
    generate_formatted_html({
      text: `In einem Durchgang kann die Schriftfarbe mit der Wortbedeutung
      entweder übereinstimmen (d.h. das Wort ROT in rot geschrieben oder das
      Wort GRÜN in grün geschrieben) oder nicht übereinstimmen (d.h. das Wort
      ROT in grün geschrieben oder das Wort GRÜN in grün geschrieben). Je
      nachdem hast du die Möglichkeit eine Belohnung zu erhalten:<br><br>
      In Durchgängen ${rewardConditionInstructions1[0]} Übereinstimmung hast du die Möglichkeit für
      korrekte und besonders schnelle Antworten einen Punkt/Belohnung zu erhalten.<br><br>
      In Durchgängen ${rewardConditionInstructions1[1]} Übereinstimmung kannst du keine Punkte / Belohnung erhalten.<br><br>
      Weiter geht es mit der Leertaste ...`,
      fontsize: 22,
      lineheight: 1.25,
      align: 'left',
    }),
  choices: [' '],
};

const start_of_block_text_simon = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: '',
  choices: [' '],
  on_start: function (trial) {
    let npoints_reward = performanceData.simon_reward_correct + performanceData.stroop_reward_n;
    let per_noreward =
      ((performanceData.simon_noreward_correct + performanceData.stroop_noreward_correct) /
        (performanceData.simon_noreward_n + performanceData.stroop_noreward_n)) *
      100;
    if (isNaN(per_noreward)) {
      per_noreward = 0;
    }
    trial.stimulus =
      generate_formatted_html({
        text: `Start Block ${prms.cBlk} von ${prms.nBlks}:`,
        fontsize: 26,
        align: 'center',
        bold: true,
      }) +
      generate_formatted_html({
        text: `Gesamtpunktzahl (in Durchgängen mit Belohnung): ${npoints_reward} Punkte<br>
        Gesamt korrekt (in Durchgängen ohne Belohnung): ${Math.round(per_noreward)} %<br><br>
          Zur Erinnerung:`,
        fontsize: 26,
        align: 'center',
      }) +
      respText +
      generate_formatted_html({
        text: `
      Du kannst Belohnung nur in Durchgängen erhalten, in denen die Position des Kreise mit der Farbe des Kreises ${rewardConditionInstructions2[0]}!<br><br><br>
      Weiter geht es mit der Leertaste ...`,
        fontsize: 26,
        align: 'left',
      });
  },
};

const start_of_block_text_stroop = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: '',
  choices: [' '],
  on_start: function (trial) {
    let npoints_reward = performanceData.simon_reward_correct + performanceData.stroop_reward_n;
    let per_noreward =
      ((performanceData.simon_noreward_correct + performanceData.stroop_noreward_correct) /
        (performanceData.simon_noreward_n + performanceData.stroop_noreward_n)) *
      100;
    if (isNaN(per_noreward)) {
      per_noreward = 0;
    }
    trial.stimulus =
      generate_formatted_html({
        text: `Start Block ${prms.cBlk} von ${prms.nBlks}:`,
        fontsize: 26,
        align: 'center',
        bold: true,
      }) +
      generate_formatted_html({
        text: `Gesamtpunktzahl (in Durchgängen mit Belohnung): ${npoints_reward} Punkte<br>
        Gesamt korrekt (in Durchgängen ohne Belohnung): ${Math.round(per_noreward)} %<br><br>
          Zur Erinnerung:`,
        fontsize: 26,
        align: 'center',
      }) +
      respText +
      generate_formatted_html({
        text: `
      Du kannst Belohnung nur in Durchgängen erhalten, in denen die Bedeutung des Wortes mit der Farbe des Wortes ${rewardConditionInstructions2[0]}!<br><br><br>
      Weiter geht es mit der Leertaste ...`,
        fontsize: 26,
        align: 'left',
      });
  },
};

const end_of_block_text = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: '',
  choices: [' '],
  on_start: function (trial) {
    let npoints_reward = performanceData.simon_reward_correct + performanceData.stroop_reward_n;
    let per_noreward =
      ((performanceData.simon_noreward_correct + performanceData.stroop_noreward_correct) /
        (performanceData.simon_noreward_n + performanceData.stroop_noreward_n)) *
      100;
    if (isNaN(per_noreward)) {
      per_noreward = 0;
    }
    trial.stimulus =
      generate_formatted_html({
        text: `Ende Block ${prms.cBlk} von ${prms.nBlks}:`,
        fontsize: 26,
        align: 'center',
        bold: true,
      }) +
      generate_formatted_html({
        text: `Kurze Pause. Bitte nutze die Pause, um dich zu erholen. Wenn du wieder bereit für den nächsten Block bist, dann drücke eine beliebige Taste.<br><br>`,
        fontsize: 26,
        align: 'left',
      }) +
      generate_formatted_html({
        text: `Gesamtpunktzahl (in Durchgängen mit Belohnung): ${npoints_reward} Punkte<br>
        Gesamt korrekt (in Durchgängen ohne Belohnung): ${per_noreward} %<br><br>`,
        fontsize: 26,
        align: 'center',
      }) +
      generate_formatted_html({
        text: `Versuche weiterhin so viele Punkte wie möglich zu sammeln und dabei so genau wie möglich zu antworten: Deine Gesamtleistung berechnet sich aus der Anzahl Punkte in Durchgängen mit Belohnung! `,
        fontsize: 26,
        align: 'left',
      });
  },
  on_finish: function () {
    prms.cBlk += 1;
    prms.cTrl = 1;
  },
};

const images = loadImages(['../images/treasure_box.jpg', '../images/treasure_box_with_cross.jpg']);

// need to store performance data to use to guide reward/no reward
const performanceData = {
  simon_reward_n: 0,
  simon_reward_rts: [],
  simon_reward_mean: prms.tooSlow,
  simon_reward_correct: 0,
  simon_noreward_n: 0,
  simon_noreward_correct: 0,
  stroop_reward_n: 0,
  stroop_reward_rts: [],
  stroop_reward_mean: prms.tooSlow,
  stroop_reward_correct: 0,
  stroop_noreward_n: 0,
  stroop_noreward_correct: 0,
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
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  trial_duration: prms.fixDur,
  translate_origin: true,
  response_ends_trial: false,
  func: drawFixation,
};

function drawFeedback() {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  let dat = jsPsych.data.get().last(1).values()[0];

  if (dat.comp === dat.reward) {
    // draw text
    ctx.font = prms.fbSize;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';
    ctx.fillText(prms.fbTxt[dat.corrCode - 1], 0, -120);

    // draw image
    // show a version of the treasure chest
    const num = (dat.corrCode === 1) & dat.success ? 0 : 1;
    const size = 2;
    const width = images[num].width;
    const height = images[num].height;
    ctx.drawImage(images[num], -width / size / 2, -height / size / 2, width / size, height / size);

    // draw total accumulated points
    ctx.font = prms.fbSize * 1.5;
    let total_points = performanceData.simon_reward_correct + performanceData.stroop_reward_correct;
    ctx.fillText('Points: ' + total_points, 0, 120);
  } else {
    // draw text
    ctx.font = prms.fbSize;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';
    ctx.fillText(prms.fbTxt[dat.corrCode - 1], 0, -20);

    // draw total accumulated points
    ctx.font = prms.fbSize * 1.5;
    let percentage_correct =
      ((performanceData.simon_noreward_correct + performanceData.stroop_noreward_correct) /
        performanceData.simon_noreward_n +
        performanceData.stroop_noreward_n) *
      100;
    ctx.fillText('Gesamt korrekt: ' + Math.round(percentage_correct) + ' %', 0, 20);
  }
}

function drawStroop(args) {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  ctx.font = prms.stimSize;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = args.colour;
  ctx.fillText(args.stimulus, 0, 0); // always central
}

function drawSimon(args) {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  ctx.fillStyle = args.colour;
  if (args.position === 'left') {
    ctx.beginPath();
    ctx.arc(-prms.simonEccentricity, 0, prms.simonSize, 0, 2 * Math.PI);
    ctx.fill();
  } else if (args.position === 'right') {
    ctx.beginPath();
    ctx.arc(prms.simonEccentricity, 0, prms.simonSize, 0, 2 * Math.PI);
    ctx.fill();
  }
}

function codeTrial() {
  'use strict';
  let dat = jsPsych.data.get().last(1).values()[0];
  let corrCode = 0;
  dat.rt = dat.rt !== null ? dat.rt : prms.tooSlow;

  let correctKey;
  if (dat.key_press !== null) {
    correctKey = jsPsych.pluginAPI.compareKeys(dat.key_press, dat.corrResp);
  }

  if (correctKey && dat.rt > prms.tooFast && dat.rt < prms.tooSlow) {
    corrCode = 1; // correct
  } else if (!correctKey && dat.rt > prms.tooFast && dat.rt < prms.tooSlow) {
    corrCode = 2; // choice error
  } else if (dat.rt >= prms.tooSlow) {
    corrCode = 3; // too slow
  } else if (dat.rt <= prms.tooFast) {
    corrCode = 4; // too false
  }

  // update performance data
  let success = false;
  if (dat.task === 'simon') {
    if (dat.comp === dat.reward) {
      performanceData.simon_reward_n += 1;
      if (corrCode === 1) {
        success = dat.rt < performanceData.simon_reward_mean;
        if (success) {
          performanceData.simon_reward_correct += 1;
        }
      }
    } else if (dat.comp !== dat.reward) {
      performanceData.simon_noreward_n += 1;
      if (corrCode === 1) {
        performanceData.simon_noreward_correct += 1;
      }
    }
  } else if (dat.task === 'stroop') {
    performanceData.stroop_total_n = 1;
    if (dat.comp === dat.reward) {
      performanceData.stroop_reward_n += 1;
      if (corrCode === 1) {
        success = dat.rt < performanceData.stroop_reward_mean;
        if (success) {
          performanceData.stroop_reward_correct += 1;
        }
      }
    } else if (dat.comp !== dat.reward) {
      performanceData.stroop_noreward_n += 1;
      if (corrCode === 1) {
        performanceData.stroop_noreward_correct += 1;
      }
    }
  }

  console.log(performanceData);
  jsPsych.data.addDataToLastTrial({
    date: Date(),
    blockNum: prms.cBlk,
    trialNum: prms.cTrl,
    success: success,
    simonMean: performanceData.simon_reward_mean,
    simonPoints: performanceData.simon_reward_correct,
    stroopMean: performanceData.stroop_reward_mean,
    stroopPoints: performanceData.stroop_reward_correct,
    corrCode: corrCode,
  });

  // update performance data for next trial
  if (success) {
    if (dat.task === 'stroop') {
      performanceData.stroop_reward_rts.push(dat.rt);
      performanceData.stroop_reward_mean = mean(performanceData.stroop_reward_rts);
    } else if (dat.task === 'simon') {
      performanceData.simon_reward_rts.push(dat.rt);
      performanceData.simon_reward_mean = mean(performanceData.simon_reward_rts);
    }
  }
  prms.cTrl += 1;
}

const trial_feedback = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
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
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  trial_duration: prms.iti,
  response_ends_trial: false,
  func: function () {},
};

const block_feedback = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: '',
  response_ends_trial: true,
  on_start: function (trial) {
    trial.stimulus = blockFeedbackTxt_de_du({ stim: 'ccr' });
  },
};

const stroop_stimulus = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  translate_origin: true,
  response_ends_trial: true,
  choices: prms.respKeys,
  trial_duration: prms.tooSlow,
  func: drawStroop,
  func_args: [
    {
      stimulus: jsPsych.timelineVariable('item'),
      position: jsPsych.timelineVariable('position'),
      colour: jsPsych.timelineVariable('colour'),
    },
  ],
  data: {
    stim: 'ccr',
    task: jsPsych.timelineVariable('task'),
    item: jsPsych.timelineVariable('item'),
    position: jsPsych.timelineVariable('position'),
    colour: jsPsych.timelineVariable('colour'),
    comp: jsPsych.timelineVariable('comp'),
    reward: jsPsych.timelineVariable('reward'),
    corrResp: jsPsych.timelineVariable('corrResp'),
  },
  on_finish: function () {
    codeTrial();
  },
};

const simon_stimulus = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  translate_origin: true,
  response_ends_trial: true,
  choices: prms.respKeys,
  trial_duration: prms.tooSlow,
  func: drawSimon,
  func_args: [
    {
      stimulus: jsPsych.timelineVariable('item'),
      position: jsPsych.timelineVariable('position'),
      colour: jsPsych.timelineVariable('colour'),
    },
  ],
  data: {
    stim: 'ccr',
    task: jsPsych.timelineVariable('task'),
    item: jsPsych.timelineVariable('item'),
    position: jsPsych.timelineVariable('position'),
    colour: jsPsych.timelineVariable('colour'),
    comp: jsPsych.timelineVariable('comp'),
    reward: jsPsych.timelineVariable('reward'),
    corrResp: jsPsych.timelineVariable('corrResp'),
  },
  on_finish: function () {
    codeTrial();
  },
};

let stroops;
let simons;
// prettier-ignore
if (keyVersion === 1) {
  stroops = [
    { task: 'stroop', item: 'ROT',  position: 'centre', colour: 'red',   comp: 'kongruent',   reward: rewardCondition[0], corrResp: prms.respKeys[0] },
    { task: 'stroop', item: 'GRÜN', position: 'centre', colour: 'green', comp: 'kongruent',   reward: rewardCondition[0], corrResp: prms.respKeys[1] },
    { task: 'stroop', item: 'ROT',  position: 'centre', colour: 'green', comp: 'inkongruent', reward: rewardCondition[0], corrResp: prms.respKeys[1] },
    { task: 'stroop', item: 'GRÜN', position: 'centre', colour: 'red',   comp: 'inkongruent', reward: rewardCondition[0], corrResp: prms.respKeys[0] },
  ];
  simons = [
    { task: 'simon', item: 'circle', position: 'left',  colour: 'red',   comp: 'kongruent',   reward: rewardCondition[0], corrResp: prms.respKeys[0] },
    { task: 'simon', item: 'circle', position: 'right', colour: 'red',   comp: 'inkongruent', reward: rewardCondition[0], corrResp: prms.respKeys[0] },
    { task: 'simon', item: 'circle', position: 'left',  colour: 'green', comp: 'inkongruent', reward: rewardCondition[0], corrResp: prms.respKeys[1] },
    { task: 'simon', item: 'circle', position: 'right', colour: 'green', comp: 'kongruent',   reward: rewardCondition[0], corrResp: prms.respKeys[1] },
  ];
} else if (keyVersion === 2) {
  stroops = [
    { task: 'stroop', item: 'ROT',  position: 'centre', colour: 'red',   comp: 'kongruent',   reward: rewardCondition[0], corrResp: prms.respKeys[1] },
    { task: 'stroop', item: 'GRÜN', position: 'centre', colour: 'green', comp: 'kongruent',   reward: rewardCondition[0], corrResp: prms.respKeys[0] },
    { task: 'stroop', item: 'ROT',  position: 'centre', colour: 'green', comp: 'inkongruent', reward: rewardCondition[0], corrResp: prms.respKeys[0] },
    { task: 'stroop', item: 'GRÜN', position: 'centre', colour: 'red',   comp: 'inkongruent', reward: rewardCondition[0], corrResp: prms.respKeys[1] },
  ];
  simons = [
    { task: 'simon', item: 'circle', position: 'left',  colour: 'green', comp: 'kongruent',   reward: rewardCondition[0], corrResp: prms.respKeys[0] },
    { task: 'simon', item: 'circle', position: 'right', colour: 'green', comp: 'inkongruent', reward: rewardCondition[0], corrResp: prms.respKeys[0] },
    { task: 'simon', item: 'circle', position: 'left',  colour: 'red',   comp: 'inkongruent', reward: rewardCondition[0], corrResp: prms.respKeys[1] },
    { task: 'simon', item: 'circle', position: 'right', colour: 'red',   comp: 'kongruent',   reward: rewardCondition[0], corrResp: prms.respKeys[1] },
  ];
}

const trial_timeline_stroop = {
  timeline: [fixation_cross, stroop_stimulus, trial_feedback],
  timeline_variables: stroops,
};

const trial_timeline_simon = {
  timeline: [fixation_cross, simon_stimulus, trial_feedback],
  timeline_variables: simons,
};

////////////////////////////////////////////////////////////////////////
//                              De-brief                              //
////////////////////////////////////////////////////////////////////////
// For VP Stunden
const randomString = generateRandomStringWithExpName('ccr1', 16);

const alpha_num = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus:
    generate_formatted_html({
      text: `Wenn du eine Versuchspersonenstunde benötigst, kopiere den folgenden
      zufällig generierten Code und sende diesen zusammen mit deiner Matrikelnummer
      per Email an:<br><br>
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
  choices: [' '],
};

const email_option_instructions = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: generate_formatted_html({
    text: `Das Experiment ist jetzt beendet.<br><br>
      Vielen Dank für Deine Teilnahme!<br><br>
      Im nächsten Fester wirst Du aufgefordert Deine E-Mail-Adresse für die Gutscheinvergabe anzugeben.
Wenn Du das nicht möchtest, lasse das Feld einfach leer.<br><br>
Falls Du Fragen zu unserem Experiment hast, kanst Du uns gerne unter folgender E-Mail-Adresse kontaktieren:<br><br>
j.koenig@student.uni-tuebingen.de <br><br>
Drücke die Leertaste, um fortzufahren!`,
    fontsize: 26,
    align: 'left',
  }),
};

const email_option = {
  type: 'survey-text',
  questions: [{ prompt: 'E-mail addres?', placeholder: 'email@email', columns: 50, required: false, name: 'email' }],
  button_label: 'Weiter',
  on_finish: function () {
    let dat = jsPsych.data.get().last(1).values()[0];
    jsPsych.data.addProperties({ email: dat.response.email });
  },
};

////////////////////////////////////////////////////////////////////////
//                                Save                                //
////////////////////////////////////////////////////////////////////////
const save_data = {
  type: 'call-function',
  func: function () {
    let data_filename = dirName + 'data/version' + orderVersion + '/' + expName + '_' + vpNum;
    saveData('/Common/write_data.php', data_filename, { stim: 'ccr' });
  },
  timing_post_trial: 1000,
};

const save_interaction_data = {
  type: 'call-function',
  func: function () {
    let data_filename = dirName + 'interaction/' + expName + '_interaction_data_' + vpNum;
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

  exp.push(fullscreen_on);
  exp.push(welcome_de_du);
  exp.push(resize_de_du);
  // exp.push(vpInfoForm_de);
  exp.push(hideMouseCursor);
  exp.push(screenInfo);
  exp.push(task_instructions1);
  exp.push(task_instructions2);
  exp.push(task_instructions3);

  // Counter-balanced task order Flanker-Simon vs. Simon-Flanker
  let blk_task;
  if ([1, 3].includes(orderVersion)) {
    blk_task = repeatArray(['simon'], prms.nBlks / 2).concat(repeatArray(['stroop'], prms.nBlks / 2));
  } else {
    blk_task = repeatArray(['stroop'], prms.nBlks / 2).concat(repeatArray(['simon'], prms.nBlks / 2));
  }

  for (let blk = 0; blk < prms.nBlks; blk += 1) {
    // add approprite block start stroop vs. simon instructions for 1st block of that task
    if (blk_task[blk] === 'simon' && [0, prms.nBlks / 2].includes(blk)) {
      exp.push(task_instructions_simon);
    } else if (blk_task[blk] === 'stroop' && [0, prms.nBlks / 2].includes(blk)) {
      exp.push(task_instructions_stroop);
    }

    // start of block text
    if (blk_task[blk] === 'simon') {
      exp.push(start_of_block_text_simon);
    } else if (blk_task[blk] === 'stroop') {
      exp.push(start_of_block_text_stroop);
    }

    // select appropriate blk_timeline
    let blk_timeline;
    if (blk_task[blk] === 'stroop') {
      blk_timeline = { ...trial_timeline_stroop };
    } else if (blk_task[blk] === 'simon') {
      blk_timeline = { ...trial_timeline_simon };
    }
    blk_timeline.sample = {
      type: 'fixed-repetitions',
      size: [0, prms.nBlks / 2].includes(blk) ? prms.nTrlsP / 4 : prms.nTrlsE / 4,
    };
    exp.push(blk_timeline); // trials within a block

    // end of block text
    exp.push(end_of_block_text);
  }

  // save data
  exp.push(save_data);
  exp.push(save_interaction_data);
  exp.push(save_code);

  // debrief
  exp.push(showMouseCursor);
  exp.push(alpha_num);
  exp.push(email_option_instructions);
  exp.push(email_option);
  exp.push(debrief_de_du);
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
