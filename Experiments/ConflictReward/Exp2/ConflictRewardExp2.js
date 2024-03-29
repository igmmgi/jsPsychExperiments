// Cognitive Control and Reward: BSc Project SS2021
//
// Two standard conflict tasks (presented in separate blocks):
//
// Simon Task:
// VPs respond to a laterally presented circles (red vs. green) with
// left/right-keypresses ("Q" and "P"). Stimuli are presented in one of two
// locations (left vs. right), with colour assigned to the response key.
//
// Flanker Task:
// VPs respond to the colour of a central circle surrounded by flanking circles
// with left/right-keypresses ("Q" and "P").
//
// Factors:
// Task (Flanker vs. Simon) within
// Compatibility (Compatible vs. Incompatible) within
// Reward (Yes vs. No) between
//
// 4 Counter-balanced versions
// Version 1: Simon-RC  Flanker-RC
// Version 2: Flanker-RC Simon-RC
// Version 3: Simon-RI  Flanker-RI
// Version 4: Flanker-RI Simon-RI

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
  nTrlsP: 80, // number of trials in each block
  nTrlsE: 80, // number of trials in each block
  nBlks: 10,
  fixDur: 400,
  fbDur: [1500, 2500],
  iti: 500,
  fbTxt: ['Richtig', 'Falsch!'],
  cTrl: 1, // count trials
  cBlk: 1, // count blocks
  fixWidth: 2,
  fixSize: 10,
  stimSize: '40px monospace',
  fbSize: '24px monospace',
  simonEccentricity: 150,
  flankerEccentricity: 50,
  simonSize: 20,
  flankerSize: 20,
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
           deine Teilnahme kannst du 1 VP-Stunde erhalten. <br><br>
           Während des Experiments ist es in manchen Versuchsdurchgängen möglich, Belohnungen in Form von Punkten zu
           sammeln. Die sechs Teilnehmer mit der höchsten Gesamtpunktzahl erhalten zusätzlich
           einen 10€-Gutschein für eine Buchhandlung (OSIANDER). Insgesamt gibt es maximal 60 Teilnehmer.<br><br>
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
    hiwipibio@gmail.com <br><br><br>
    Weiter geht es durch Drücken der Leertaste...`,
    fontsize: 26,
    lineheight: 1.5,
    align: 'left',
  }),
  choices: [' '],
};

const task_instructions_simon1 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus:
    generate_formatted_html({
      text: `In der folgenden Aufgabe werden rote oder grüne Kreise entweder auf
    der rechten oder linken Seite des Bildschirmes erscheinen. Reagiere auf die Farbe des Kreises
    wie folgt:<br>`,
      fontsize: 24,
      lineheight: 1.25,
      align: 'left',
    }) +
    respText +
    generate_formatted_html({
      text: `Weiter geht es mit der Leertaste ...`,
      fontsize: 24,
      lineheight: 1.25,
      align: 'left',
    }),
  choices: [' '],
};

const task_instructions_simon2 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: generate_formatted_html({
    text: `In einem Durchgang kann die Position des Kreises mit der Seite,
      auf der Du reagieren musst übereinstimmen (z.B. der Kreis erscheint auf
      der linken Seite und Du musst für die Antwort den linken Zeigefinger
      verwenden) oder nicht (z.B. der Kreis erscheint auf der linken Seite und
      Du musst für die Antwort den rechten Zeigefinger verwenden).<br><br>
      Je nachdem hast du die Möglichkeit Belohnung zu erhalten:<br><br>
      In Durchgängen ${rewardConditionInstructions1[0]} Übereinstimmung hast du die Möglichkeit für
      besonders schnelle (und korrekte) Antworten Belohnung (+10 Punkte) zu erhalten.<br><br>
      In Durchgängen ${rewardConditionInstructions1[1]} Übereinstimmung
      kannst du keine Belohnung/Punkte erhalten.<br><br>
    Weiter geht es mit der Leertaste ...`,
    fontsize: 24,
    lineheight: 1.25,
    align: 'left',
  }),
  choices: [' '],
};

const task_instructions_flanker1 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus:
    generate_formatted_html({
      text: `In der folgenden Aufgabe wird in der Mitte ein roter oder grüner Kreis umgeben von farbigen Kreisen erscheinen.
        Bitte reagiere auf die Farbe des mittleren Kreises wie folgt:<br>`,
      fontsize: 22,
      lineheight: 1.25,
      align: 'left',
    }) +
    respText +
    generate_formatted_html({
      text: `Weiter geht es mit der Leertaste ...`,
      fontsize: 22,
      lineheight: 1.25,
      align: 'left',
    }),
  choices: [' '],
};

const task_instructions_flanker2 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: generate_formatted_html({
    text: `In einem Durchgang kann die Farbe des mittleren Kreises mit der Farbe der anderen Kreise entweder
    übereinstimmen (d.h. mittlerer Kreis rot/umliegende Kreise rot oder mittlerer Kreis grün/umliegende
    Kreise grün) oder nicht übereinstimmen (d.h. mittlerer Kreis grün/umliegende Kreise rot oder
    mittlerer Kreis rot/umliegende Kreise grün). Je nachdem hast du die Möglichkeit eine Belohnung
    zu erhalten::<br><br>
      In Durchgängen ${rewardConditionInstructions1[0]} Übereinstimmung hast du die Möglichkeit für
      besonders schnelle (und korrekte) Antworten Belohnung (+10 Punkte) zu erhalten.<br><br>
      In Durchgängen ${rewardConditionInstructions1[1]} Übereinstimmung kannst du keine Belohnung/Punkte erhalten.<br><br>
      Weiter geht es mit der Leertaste ...`,
    fontsize: 22,
    lineheight: 1.25,
    align: 'left',
  }),
  choices: [' '],
};

const reward_instructions = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus:
    generate_formatted_html({
      text: `Versuche in Durchgängen mit Belohnung durch besonders schnelle
      (und korrekte) Antworten so viele Punkte wie möglich zu sammeln!<br><br>
        Bitte beachte aber auch in Durchgängen ohne Belohnung nicht zu viele
        Fehler zu machen, da der Anteil korrekter Antworten in diesen
        Durchgängen bei der Berechnung deiner Gesamtpunktzahl berücksichtigt
        wird.`,
      fontsize: 22,
      lineheight: 1.25,
      align: 'left',
    }) +
    generate_formatted_html({
      text: `<br>Beispiel: <br><br>Punktzahl (in Durchgängen mit Belohnung): 100 Punkte<br>
    Prozent Korrekt (in Durchgängen ohne Belohnung): 85 %<br><br>
    Aktuelle Gesamtpunkte: 100 x 0.85 = 85 Punkte<br><br>
      Weiter geht es mit der Taste 'G' ...`,
      fontsize: 22,
      lineheight: 1.25,
      align: 'center',
    }),
  choices: ['g'],
};

const start_of_block_text_simon = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: '',
  choices: [' '],
  on_start: function (trial) {
    let npoints_reward = performanceData.simon_reward_correct + performanceData.flanker_reward_correct;
    let per_noreward =
      (performanceData.simon_noreward_correct + performanceData.flanker_noreward_correct) /
      (performanceData.simon_noreward_n + performanceData.flanker_noreward_n);
    let points = Math.round(npoints_reward * per_noreward);
    if (isNaN(points)) {
      points = 0;
    }
    trial.stimulus =
      generate_formatted_html({
        text: `Start Block ${prms.cBlk} von ${prms.nBlks}:`,
        fontsize: 26,
        align: 'center',
        bold: true,
      }) +
      generate_formatted_html({
        text: `Aktuelle Gesamtpunktzahl: ${points} Punkte<br><br>
        Versuche in Durchgängen mit Belohnung durch besonders schnelle (und korrekte) Antworten so viele Punkte wie möglich zu sammeln!<br><br>
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

const start_of_block_text_flanker = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: '',
  choices: [' '],
  on_start: function (trial) {
    let npoints_reward = performanceData.simon_reward_correct + performanceData.flanker_reward_correct;
    let per_noreward =
      (performanceData.simon_noreward_correct + performanceData.flanker_noreward_correct) /
      (performanceData.simon_noreward_n + performanceData.flanker_noreward_n);
    let points = Math.round(npoints_reward * per_noreward);
    if (isNaN(points)) {
      points = 0;
    }
    trial.stimulus =
      generate_formatted_html({
        text: `Start Block ${prms.cBlk} von ${prms.nBlks}:`,
        fontsize: 26,
        align: 'center',
        bold: true,
      }) +
      generate_formatted_html({
        text: `Aktuelle Gesamtpunktzahl: ${points} Punkte<br><br>
        Versuche in Durchgängen mit Belohnung durch besonders schnelle (und korrekte) Antworten so viele Punkte wie möglich zu sammeln!<br><br>
          Zur Erinnerung:`,
        fontsize: 26,
        align: 'center',
      }) +
      respText +
      generate_formatted_html({
        text: `
      Du kannst Belohnung nur in Durchgängen erhalten, in denen die Farbe
      des mittleren Kreises mit der Farbe der umliegenden Kreise
          ${rewardConditionInstructions2[0]}!<br><br><br>
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
    let npoints_reward = performanceData.simon_reward_correct + performanceData.flanker_reward_correct;
    let per_noreward =
      (performanceData.simon_noreward_correct + performanceData.flanker_noreward_correct) /
      (performanceData.simon_noreward_n + performanceData.flanker_noreward_n);
    let points = Math.round(npoints_reward * per_noreward);
    if (isNaN(points)) {
      points = 0;
    }
    trial.stimulus =
      generate_formatted_html({
        text: `Ende Block ${prms.cBlk} von ${prms.nBlks}:`,
        fontsize: 26,
        align: 'center',
        bold: true,
      }) +
      generate_formatted_html({
        text: `Kurze Pause. Bitte nutze die Pause, um dich zu erholen. Wenn du
          wieder bereit für den nächsten Block bist, dann drücke die Leertaste.<br><br>`,
        fontsize: 26,
        align: 'left',
      }) +
      generate_formatted_html({
        text: `Aktuelle Gesamtpunktzahl: ${points} Punkte<br><br>`,
        fontsize: 26,
        align: 'center',
      }) +
      generate_formatted_html({
        text: `Versuche weiterhin soviele Punkte wie möglich zu sammeln indem
          du in Durchgängen mit Belohnung besonders schnell (und korrekt)
          antwortest! Beachte aber auch in Durchgängen ohne Belohnung nicht zu
          viele Fehler zu machen: Deine Gesamtpunkte berechnen sich aus der
          Anzahl gesammelter Punkte in Durchgängen mit Belohnung multipliziert
          mit dem Anteil korrekter Antworten in Durchgängen ohne Belohnung!`,
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
  simon_reward_mean: 10000, // initial high value
  simon_reward_correct: 0,
  simon_noreward_n: 0,
  simon_noreward_correct: 0,
  flanker_reward_n: 0,
  flanker_reward_rts: [],
  flanker_reward_mean: 10000, // initial high value
  flanker_reward_correct: 0,
  flanker_noreward_n: 0,
  flanker_noreward_correct: 0,
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

    let imgnum = 1;
    if ((dat.error === 0) & dat.success) {
      ctx.fillText('Richtig & schnell!', 0, -70);
      ctx.fillText('+10 Punkte!', 0, -45);
      imgnum = 0;
    } else if ((dat.error === 0) & !dat.success) {
      ctx.fillText('Richtig aber zu langsam!', 0, -70);
      ctx.fillText('Keine Punkte!', 0, -45);
    } else if (dat.error === 1) {
      ctx.fillText('Falsch!', 0, -70);
      ctx.fillText('Keine Punkte!', 0, -45);
    }

    // draw image
    // show a version of the treasure chest
    const size = 4;
    const width = images[imgnum].width;
    const height = images[imgnum].height;
    ctx.drawImage(images[imgnum], -width / size / 2, -height / size / 2 + 20, width / size, height / size);

    // draw total accumulated points
    ctx.font = prms.fbSize * 1.5;
  } else {
    // draw text
    ctx.font = prms.fbSize;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';
    ctx.fillText(prms.fbTxt[dat.error], 0, -15);

    // draw total accumulated points
    ctx.font = prms.fbSize * 1.5;
    let per_noreward =
      ((performanceData.simon_noreward_correct + performanceData.flanker_noreward_correct) /
        (performanceData.simon_noreward_n + performanceData.flanker_noreward_n)) *
      100;
    ctx.fillText('Prozent korrekt: ' + Math.round(per_noreward) + ' %', 0, 15);
  }
}

function drawFlanker(args) {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');

  // draw central target
  ctx.fillStyle = args.colour;
  ctx.beginPath();
  ctx.arc(0, 0, prms.flankerSize, 0, 2 * Math.PI);
  ctx.fill();

  // flanker colour
  ctx.fillStyle = args.stimulus;

  // left flanker
  ctx.beginPath();
  ctx.arc(-prms.flankerEccentricity, 0, prms.flankerSize, 0, 2 * Math.PI);
  ctx.fill();

  // right flanker
  ctx.beginPath();
  ctx.arc(prms.flankerEccentricity, 0, prms.flankerSize, 0, 2 * Math.PI);
  ctx.fill();
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

  let error = jsPsych.pluginAPI.compareKeys(dat.key_press, dat.corrResp) ? 0 : 1;

  // update performance data
  let success = false;
  if (dat.task === 'simon') {
    if (dat.comp === dat.reward) {
      performanceData.simon_reward_n += 1;
      if (error === 0) {
        success = dat.rt < performanceData.simon_reward_mean;
        if (success) {
          performanceData.simon_reward_correct += 10;
        }
      }
    } else if (dat.comp !== dat.reward) {
      performanceData.simon_noreward_n += 1;
      if (error === 0) {
        performanceData.simon_noreward_correct += 1;
      }
    }
  } else if (dat.task === 'flanker') {
    if (dat.comp === dat.reward) {
      performanceData.flanker_reward_n += 1;
      if (error === 0) {
        success = dat.rt < performanceData.flanker_reward_mean;
        if (success) {
          performanceData.flanker_reward_correct += 10;
        }
      }
    } else if (dat.comp !== dat.reward) {
      performanceData.flanker_noreward_n += 1;
      if (error === 0) {
        performanceData.flanker_noreward_correct += 1;
      }
    }
  }

  jsPsych.data.addDataToLastTrial({
    date: Date(),
    blockNum: prms.cBlk,
    trialNum: prms.cTrl,
    success: success,
    simonMean: performanceData.simon_reward_mean,
    simonPoints: performanceData.simon_reward_correct,
    flankerMean: performanceData.flanker_reward_mean,
    flankerPoints: performanceData.flanker_reward_correct,
    error: error,
  });

  // update performance data for next trial
  if (dat.comp === dat.reward && dat.error === 0) {
    if (dat.task === 'flanker') {
      performanceData.flanker_reward_rts.push(dat.rt);
      performanceData.flanker_reward_mean = mean(performanceData.flanker_reward_rts);
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
    trial.trial_duration = prms.fbDur[dat.error];
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

const flanker_stimulus = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  translate_origin: true,
  response_ends_trial: true,
  choices: prms.respKeys,
  func: drawFlanker,
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

let flankers;
let simons;
// prettier-ignore
if (keyVersion === 1) {
  flankers = [
    { task: 'flanker', item: 'red',   position: 'centre', colour: 'red',   comp: 'kongruent',   reward: rewardCondition[0], corrResp: prms.respKeys[0] },
    { task: 'flanker', item: 'green', position: 'centre', colour: 'green', comp: 'kongruent',   reward: rewardCondition[0], corrResp: prms.respKeys[1] },
    { task: 'flanker', item: 'red',   position: 'centre', colour: 'green', comp: 'inkongruent', reward: rewardCondition[0], corrResp: prms.respKeys[1] },
    { task: 'flanker', item: 'green', position: 'centre', colour: 'red',   comp: 'inkongruent', reward: rewardCondition[0], corrResp: prms.respKeys[0] },
  ];
  simons = [
    { task: 'simon', item: 'circle', position: 'left',  colour: 'red',   comp: 'kongruent',   reward: rewardCondition[0], corrResp: prms.respKeys[0] },
    { task: 'simon', item: 'circle', position: 'right', colour: 'red',   comp: 'inkongruent', reward: rewardCondition[0], corrResp: prms.respKeys[0] },
    { task: 'simon', item: 'circle', position: 'left',  colour: 'green', comp: 'inkongruent', reward: rewardCondition[0], corrResp: prms.respKeys[1] },
    { task: 'simon', item: 'circle', position: 'right', colour: 'green', comp: 'kongruent',   reward: rewardCondition[0], corrResp: prms.respKeys[1] },
  ];
} else if (keyVersion === 2) {
  flankers = [
    { task: 'flanker', item: 'red',   position: 'centre', colour: 'red',   comp: 'kongruent',   reward: rewardCondition[0], corrResp: prms.respKeys[1] },
    { task: 'flanker', item: 'green', position: 'centre', colour: 'green', comp: 'kongruent',   reward: rewardCondition[0], corrResp: prms.respKeys[0] },
    { task: 'flanker', item: 'red',   position: 'centre', colour: 'green', comp: 'inkongruent', reward: rewardCondition[0], corrResp: prms.respKeys[0] },
    { task: 'flanker', item: 'green', position: 'centre', colour: 'red',   comp: 'inkongruent', reward: rewardCondition[0], corrResp: prms.respKeys[1] },
  ];
  simons = [
    { task: 'simon', item: 'circle', position: 'left',  colour: 'green', comp: 'kongruent',   reward: rewardCondition[0], corrResp: prms.respKeys[0] },
    { task: 'simon', item: 'circle', position: 'right', colour: 'green', comp: 'inkongruent', reward: rewardCondition[0], corrResp: prms.respKeys[0] },
    { task: 'simon', item: 'circle', position: 'left',  colour: 'red',   comp: 'inkongruent', reward: rewardCondition[0], corrResp: prms.respKeys[1] },
    { task: 'simon', item: 'circle', position: 'right', colour: 'red',   comp: 'kongruent',   reward: rewardCondition[0], corrResp: prms.respKeys[1] },
  ];
}

const trial_timeline_flanker = {
  timeline: [fixation_cross, flanker_stimulus, trial_feedback],
  timeline_variables: flankers,
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
      Im nächsten Fenster wirst Du aufgefordert Deine E-Mail-Adresse für die Gutscheinvergabe anzugeben.
Wenn Du das nicht möchtest, lasse das Feld einfach leer.<br><br>
Falls Du Fragen zu unserem Experiment hast, kannst Du uns gerne unter folgender E-Mail-Adresse kontaktieren:<br><br>
hiwipibio@gmail.com <br><br>
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
  post_trial_gap: 1000,
};

const save_interaction_data = {
  type: 'call-function',
  func: function () {
    let data_filename = dirName + 'interaction/' + expName + '_interaction_data_' + vpNum;
    saveInteractionData('/Common/write_data.php', data_filename);
  },
  post_trial_gap: 200,
};

const save_code = {
  type: 'call-function',
  func: function () {
    let code_filename = dirName + 'code/' + expName;
    saveRandomCode('/Common/write_code.php', code_filename, randomString);
  },
  post_trial_gap: 200,
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
  'use strict';

  let exp = [];

  exp.push(fullscreen_on_de);
  exp.push(check_screen);
  exp.push(welcome_de_du);
  exp.push(resize_de_du);
  exp.push(vpInfoForm_de);
  exp.push(hideMouseCursor);
  exp.push(screenInfo);
  exp.push(task_instructions1);
  exp.push(task_instructions2);

  // Counter-balanced task order Flanker-Simon vs. Simon-Flanker
  let blk_task;
  if ([1, 3].includes(orderVersion)) {
    blk_task = repeatArray(['simon'], prms.nBlks / 2).concat(repeatArray(['flanker'], prms.nBlks / 2));
  } else {
    blk_task = repeatArray(['flanker'], prms.nBlks / 2).concat(repeatArray(['simon'], prms.nBlks / 2));
  }

  for (let blk = 0; blk < prms.nBlks; blk += 1) {
    // add approprite block start flanker vs. simon instructions for 1st block of that task
    if (blk_task[blk] === 'simon' && [0, prms.nBlks / 2].includes(blk)) {
      exp.push(task_instructions_simon1);
      exp.push(task_instructions_simon2);
      exp.push(reward_instructions);
    } else if (blk_task[blk] === 'flanker' && [0, prms.nBlks / 2].includes(blk)) {
      exp.push(task_instructions_flanker1);
      exp.push(task_instructions_flanker2);
      exp.push(reward_instructions);
    }

    // start of block text
    if (blk_task[blk] === 'simon') {
      exp.push(start_of_block_text_simon);
    } else if (blk_task[blk] === 'flanker') {
      exp.push(start_of_block_text_flanker);
    }

    // select appropriate blk_timeline
    let blk_timeline;
    if (blk_task[blk] === 'flanker') {
      blk_timeline = { ...trial_timeline_flanker };
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

  // email
  exp.push(showMouseCursor);
  exp.push(email_option_instructions);
  exp.push(email_option);

  // save data
  exp.push(save_data);
  exp.push(save_interaction_data);
  exp.push(save_code);

  // debrief
  exp.push(alpha_num);
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
