// Proactive Reward

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const canvas_colour = 'rgba(255, 255, 255, 1)';
const canvas_size = [960, 720];
const canvas_border = '5px solid black';

const red = 'rgba(139, 34, 34, 1)';
const green = 'rgba(34, 100, 34, 1)';

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
  nTrlsE: 48, // number of trials in each block
  nBlks: 14, // number of blocks
  cueDur: 800,
  fixDur: 400,
  fbDur: [750, 1250, 1250],
  iti: 300,
  tooSlow: 3000,
  deadline: 1000, // initial deadline (updated after every block)
  cTrl: 1, // count trials
  cBlk: 1, // count blocks
  cueSize: '40px monospace',
  fixWidth: 2,
  fixSize: 10,
  stimSize: '40px monospace',
  fbSize: 'bold 24px monospace',
  simonEccentricity: 150,
  simonSize: 20,
  respKeys: ['q', 'p'],
};

// counter-balanced order versions
const orderVersion = Number(jsPsych.data.urlVariables().orderVersion);
jsPsych.data.addProperties({ orderVersion: orderVersion });

// 2 random key assignments
const keyVersion = getRandomInt(0, 1);
jsPsych.data.addProperties({ keyVersion: keyVersion });

const colourMapping = keyVersion === 0 ? ['rot', 'grün'] : ['grün', 'rot'];

const respText = generate_formatted_html({
  text: `${colourMapping[0]} = linker Zeigefinger (Taste 'Q')<br>
             ${colourMapping[1]} = rechter Zeigefinger (Taste 'P')<br>`,
  fontsize: 22,
  lineheight: 1.5,
});

const images = loadImages(['../images/treasure_box.jpg', '../images/treasure_box_with_cross.jpg']);

// need to store performance data to use to guide reward/no reward
const performanceData = {
  points: 0,
  simon_totalRT: prms.tooSlow,
  simon_meanRT: prms.tooSlow,
  simon_nTrlsCorrect: 0,
  stroop_totalRT: prms.tooSlow,
  stroop_meanRT: prms.tooSlow,
  stroop_nTrlsCorrect: 0,
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
    text: `Herzlich Willkommen zu unserem Experiment:<br><br>
Die Teilnahme ist selbstverständlich freiwillig und kann jederzeit durch
das Drücken der Escape- Taste abgebrochen werden.<br><br>
Wir bitten dich die nächsten ca. 35-40 Minuten konzentriert zu arbeiten: Für deine Teilnahme kannst du 1 VP-Stunde erhalten und zusätzlich abhängig von deiner Leistung einen Gutschein erhalten.<br><br>
Während des Experiments ist es in manchen Durchgängen möglich Punkte zu sammeln. <br><br>
Die 20% der Versuchspersonen mit den meisten Punkten erhalten einen 10 € Gutschein.
Dieser kann nach Wahl entweder vom Osiander oder der Deutschen Bahn sein. <br><br>
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
    text: `Du erhälst den Code für die Versuchspersonenstunden und weitere Anweisungen
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

const task_instructions_simon = {
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

const task_instructions_stroop = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus:
    generate_formatted_html({
      text: `In der folgenden Aufgabe werden die Worte ROT oder GRÜN in roter
    oder grüner Farbe geschrieben erscheinen. Bitte reagiere auf die
    Farbe der Schrift wie folgt:<br>`,
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

const reward_instructions = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: generate_formatted_html({
      text: ` Um +10 Punkte zu erhalten, musst du in <span style="font-weight:bold">belohnten</span> Durchgängen besonders <span style="font-weight:bold">schnell</span> und <span style="font-weight:bold">fehlerfrei</span> reagieren.<br><br> Beachte: Nicht jeder Durchgang ist belohnt. <br><br>
Dass ein Durchgang belohnt ist, siehst du an einer <span style="font-weight:bold">Schatztruhe</span> zu Beginn des Durchgangs. <br><br>
Sammle durch <span style="font-weight:bold">schnelle</span> und <span style="font-weight:bold">richtige</span> Antworten in Durchgängen mit <span style="font-weight:bold">Schatztruhe</span> möglichst viele Punkte, um den Gutschein zu bekommen! <br><br>
Weiter geht es mit der Leertaste ...`,
    fontsize: 22,
    lineheight: 1.25,
    align: 'left',
  }),
  choices: [' '],
};

const start_of_block_text = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: '',
  choices: [' '],
  on_start: function (trial) {
    trial.stimulus =
      generate_formatted_html({
        text: `Start Mini Block ${prms.cBlk} von ${prms.nBlks}:`,
        fontsize: 26,
        align: 'center',
        bold: false,
      }) +
      generate_formatted_html({
        text: `Aktuelle Gesamtpunktzahl: ${performanceData.points} Punkte<br><br>
        Versuche durch besonders schnelle (und korrekte)<br>Antworten so viele Punkte wie möglich zu sammeln!<br><br>
          Beachte: Die Antwort muss richtig und<br> schnell sein, um Punkte zu bekommen. <br><br> Zur Erinnerung:`,
        fontsize: 26,
        align: 'center',
      }) +
      respText +
      generate_formatted_html({
        text: `Weiter geht es mit der Leertaste ...`,
        fontsize: 24,
        lineheight: 1.25,
        align: 'center',
      });
  },
};

function calculateBlockPerformance({ filter_options = {} } = {}) {
  let dat = jsPsych.data.get().filter(filter_options);
  let meanRt = Math.round(dat.select('rt').mean());
  return meanRt;
}

const end_of_block_text = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: '',
  choices: [' '],
  on_start: function (trial) {
    trial.stimulus =
      generate_formatted_html({
        text: `Ende Mini Block ${prms.cBlk} von ${prms.nBlks}:<br><br>
        Aktuelle Gesamtpunktzahl: ${performanceData.points} Punkte<br><br>`,
        fontsize: 26,
        align: 'center',
        bold: false,
      }) +
      generate_formatted_html({
        text: `Kurze Pause.<br><br>Bitte nutze die Pause, um dich zu erholen. Wenn du
          wieder bereit für den nächsten Block bist, dann drücke die Leertaste.<br><br>`,
        fontsize: 26,
        align: 'center',
      });

    // update deadline
    let block_rt = calculateBlockPerformance({
      filter_options: { stim: 'pr', blockNum: prms.cBlk, reward: 'no_reward' },
    });
    prms.deadline = block_rt;

    prms.cBlk += 1;
    prms.cTrl = 1;
  },
  on_finish: function () {},
};

function drawCue(args) {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');

  // draw box
  ctx.beginPath();
  ctx.lineWidth = '5';
  ctx.strokeStyle = 'grey';
  ctx.rect(-60, -60, 120, 120);
  ctx.stroke();

  if (args.cue === 'reward') {
    // draw treasure chest inside box
    const size = 4;
    const width = images[0].width;
    const height = images[0].height;
    ctx.drawImage(images[0], -width / size / 2, -height / size / 2 + 0, width / size, height / size);
  }
}

const cue = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  trial_duration: prms.cueDur,
  translate_origin: true,
  response_ends_trial: false,
  func: drawCue,
  func_args: [{ cue: jsPsych.timelineVariable('reward') }],
};

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

const iti = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  trial_duration: prms.iti,
  response_ends_trial: false,
  func: function () {},
};

function codeTrial() {
  'use strict';
  let dat = jsPsych.data.get().last(1).values()[0];
  let corrCode;
  if (dat.key_press === null) {
    corrCode = 2;
    dat.rt = prms.tooSlow;
  } else {
    corrCode = jsPsych.pluginAPI.compareKeys(dat.key_press, dat.corrResp) ? 0 : 1;
  }

  dat.success = false;
  // console.log(prms.deadline);
  // console.log(dat.rt);
  if (dat.task === 'simon') {
    if (dat.rt < prms.deadline) {
      dat.success = true;
      performanceData.points = dat.reward === 'reward' ? (performanceData.points += 10) : (performanceData.points += 0);
    }
    if ((corrCode === 0) & (dat.reward === 'no_reward')) {
      performanceData.simon_totalRT += dat.rt;
      performanceData.simon_nTrlsCorrect += 1;
      performanceData.simon_meanRT = performanceData.simon_totalRT / performanceData.simon_nTrlsCorrect;
    }
  } else if (dat.task === 'stroop') {
    if (dat.rt < prms.deadline) {
      dat.success = true;
      performanceData.points = dat.reward === 'reward' ? (performanceData.points += 10) : (performanceData.points += 0);
    }
    if ((corrCode === 0) & (dat.reward === 'no_reward')) {
      performanceData.simon_totalRT += dat.rt;
      performanceData.stroop_totalRT += dat.rt;
      performanceData.stroop_nTrlsCorrect += 1;
      performanceData.stroop_meanRT = performanceData.stroop_totalRT / performanceData.stroop_nTrlsCorrect;
    }
  }

  jsPsych.data.addDataToLastTrial({
    date: Date(),
    blockNum: prms.cBlk,
    trialNum: prms.cTrl,
    corrCode: corrCode,
    simon_totalRT: performanceData.simon_totalRT,
    stroop_totalRT: performanceData.stroop_totalRT,
    simon_nTrlsCorrect: performanceData.simon_nTrlsCorrect,
    stroop_nTrlsCorrect: performanceData.stroop_nTrlsCorrect,
    simon_meanRT: performanceData.simon_meanRT,
    stroop_meanRT: performanceData.stroop_meanRT,
    deadline: prms.dealine,
    points: performanceData.points,
  });

  prms.cTrl += 1;
}

function drawFeedback() {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  let dat = jsPsych.data.get().last(1).values()[0];
  ctx.font = prms.fbSize;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';

  if (dat.reward === 'no_reward') {
    if (dat.corrCode === 0) {
      ctx.fillText('Richtig', 0, 0);
    } else if (dat.corrCode === 1) {
      ctx.fillText('Falsch!', 0, 0);
    } else if (dat.corrCode === 2) {
      ctx.fillText('Falsch!', 0, 0);
      ctx.fillText('Keine Antwort!', 0, 25);
    }
  } else {
    let imgnum = 1;
    if ((dat.corrCode === 0) & dat.success) {
      ctx.fillText('Richtig', 0, -70);
      ctx.fillText('+10 Punkte!', 0, -45);
      imgnum = 0;
    } else if ((dat.corrCode === 0) & !dat.success) {
      ctx.fillText('Richtig', 0, -70);
    } else if (dat.corrCode === 1) {
      ctx.fillText('Falsch!', 0, -70);
    } else if (dat.corrCode === 2) {
      ctx.fillText('Falsch!', 0, -70);
      ctx.fillText('Keine Antwort!', 0, -45);
    }

    // draw image
    // show a version of the treasure chest
    const size = 4;
    const width = images[imgnum].width;
    const height = images[imgnum].height;
    ctx.drawImage(images[imgnum], -width / size / 2, -height / size / 2 + 20, width / size, height / size);
  }
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
    trial.trial_duration = prms.fbDur[dat.corrCode];
  },
};

const stroop_stimulus = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  translate_origin: true,
  response_ends_trial: true,
  trial_duration: prms.tooSlow,
  choices: prms.respKeys,
  func: drawStroop,
  func_args: [
    {
      stimulus: jsPsych.timelineVariable('item'),
      position: jsPsych.timelineVariable('position'),
      colour: jsPsych.timelineVariable('colour'),
    },
  ],
  data: {
    stim: 'pr',
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
  trial_duration: prms.tooSlow,
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
    stim: 'pr',
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

if (keyVersion === 0) {
  // prettier-ignore
  stroops = [
        { task: 'stroop', item: 'ROT',  position: 'centre', colour: red,   comp: 'kongruent',   reward: "no_reward", corrResp: prms.respKeys[0] },
        { task: 'stroop', item: 'GRÜN', position: 'centre', colour: green, comp: 'kongruent',   reward: "no_reward", corrResp: prms.respKeys[1] },
        { task: 'stroop', item: 'ROT',  position: 'centre', colour: green, comp: 'inkongruent', reward: "no_reward", corrResp: prms.respKeys[1] },
        { task: 'stroop', item: 'GRÜN', position: 'centre', colour: red,   comp: 'inkongruent', reward: "no_reward", corrResp: prms.respKeys[0] },
        { task: 'stroop', item: 'ROT',  position: 'centre', colour: red,   comp: 'kongruent',   reward: "reward",    corrResp: prms.respKeys[0] },
        { task: 'stroop', item: 'GRÜN', position: 'centre', colour: green, comp: 'kongruent',   reward: "reward",    corrResp: prms.respKeys[1] },
        { task: 'stroop', item: 'ROT',  position: 'centre', colour: green, comp: 'inkongruent', reward: "reward",    corrResp: prms.respKeys[1] },
        { task: 'stroop', item: 'GRÜN', position: 'centre', colour: red,   comp: 'inkongruent', reward: "reward",    corrResp: prms.respKeys[0] },
    ];
  // prettier-ignore
  simons = [
        { task: 'simon', item: 'circle', position: 'left',  colour: red,   comp: 'kongruent',   reward: "no_reward", corrResp: prms.respKeys[0] },
        { task: 'simon', item: 'circle', position: 'right', colour: red,   comp: 'inkongruent', reward: "no_reward", corrResp: prms.respKeys[0] },
        { task: 'simon', item: 'circle', position: 'left',  colour: green, comp: 'inkongruent', reward: "no_reward", corrResp: prms.respKeys[1] },
        { task: 'simon', item: 'circle', position: 'right', colour: green, comp: 'kongruent',   reward: "no_reward", corrResp: prms.respKeys[1] },
        { task: 'simon', item: 'circle', position: 'left',  colour: red,   comp: 'kongruent',   reward: "reward",    corrResp: prms.respKeys[0] },
        { task: 'simon', item: 'circle', position: 'right', colour: red,   comp: 'inkongruent', reward: "reward",    corrResp: prms.respKeys[0] },
        { task: 'simon', item: 'circle', position: 'left',  colour: green, comp: 'inkongruent', reward: "reward",    corrResp: prms.respKeys[1] },
        { task: 'simon', item: 'circle', position: 'right', colour: green, comp: 'kongruent',   reward: "reward",    corrResp: prms.respKeys[1] },
    ];
} else if (keyVersion === 1) {
  // prettier-ignore
  stroops = [
        { task: 'stroop', item: 'ROT',  position: 'centre', colour: red,   comp: 'kongruent',   reward: "no_reward", corrResp: prms.respKeys[1] },
        { task: 'stroop', item: 'GRÜN', position: 'centre', colour: green, comp: 'kongruent',   reward: "no_reward", corrResp: prms.respKeys[0] },
        { task: 'stroop', item: 'ROT',  position: 'centre', colour: green, comp: 'inkongruent', reward: "no_reward", corrResp: prms.respKeys[0] },
        { task: 'stroop', item: 'GRÜN', position: 'centre', colour: red,   comp: 'inkongruent', reward: "no_reward", corrResp: prms.respKeys[1] },
        { task: 'stroop', item: 'ROT',  position: 'centre', colour: red,   comp: 'kongruent',   reward: "reward",    corrResp: prms.respKeys[1] },
        { task: 'stroop', item: 'GRÜN', position: 'centre', colour: green, comp: 'kongruent',   reward: "reward",    corrResp: prms.respKeys[0] },
        { task: 'stroop', item: 'ROT',  position: 'centre', colour: green, comp: 'inkongruent', reward: "reward",    corrResp: prms.respKeys[0] },
        { task: 'stroop', item: 'GRÜN', position: 'centre', colour: red,   comp: 'inkongruent', reward: "reward",    corrResp: prms.respKeys[1] },
    ];
  // prettier-ignore
  simons = [
        { task: 'simon', item: 'circle', position: 'left',  colour: red,   comp: 'inkongruent', reward: "no_reward", corrResp: prms.respKeys[1] },
        { task: 'simon', item: 'circle', position: 'right', colour: red,   comp: 'kongruent',   reward: "no_reward", corrResp: prms.respKeys[1] },
        { task: 'simon', item: 'circle', position: 'left',  colour: green, comp: 'kongruent',   reward: "no_reward", corrResp: prms.respKeys[0] },
        { task: 'simon', item: 'circle', position: 'right', colour: green, comp: 'inkongruent', reward: "no_reward", corrResp: prms.respKeys[0] },
        { task: 'simon', item: 'circle', position: 'left',  colour: red,   comp: 'inkongruent', reward: "reward",    corrResp: prms.respKeys[1] },
        { task: 'simon', item: 'circle', position: 'right', colour: red,   comp: 'kongruent',   reward: "reward",    corrResp: prms.respKeys[1] },
        { task: 'simon', item: 'circle', position: 'left',  colour: green, comp: 'kongruent',   reward: "reward",    corrResp: prms.respKeys[0] },
        { task: 'simon', item: 'circle', position: 'right', colour: green, comp: 'inkongruent', reward: "reward",    corrResp: prms.respKeys[0] },
    ];
}

const trial_timeline_stroop = {
  timeline: [cue, fixation_cross, stroop_stimulus, trial_feedback, iti],
  timeline_variables: stroops,
};

const trial_timeline_simon = {
  timeline: [cue, fixation_cross, simon_stimulus, trial_feedback, iti],
  timeline_variables: simons,
};

////////////////////////////////////////////////////////////////////////
//                              De-brief                              //
////////////////////////////////////////////////////////////////////////
// For VP Stunden
const randomString = generateRandomStringWithExpName('pr', 16);

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
               hiwipibio@gmail.com<br><br>
               Drücke die Leertaste, um fortzufahren!`,
        fontsize: 26,
        align: 'left',
    }),
};

const email_option = {
  type: 'survey-text',
  questions: [{ prompt: 'E-Mail-Addresse?', placeholder: 'email@email', columns: 50, required: false, name: 'email' }],
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
    saveData('/Common/write_data.php', data_filename, { stim: 'pr' });
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
  
  // experiment intro stuff
  exp.push(fullscreen_on_de);
  exp.push(check_screen);
  exp.push(welcome_de_du);
  exp.push(resize_de_du);
  exp.push(vpInfoForm_de);
  exp.push(hideMouseCursor);
  exp.push(screenInfo);
  exp.push(task_instructions1);
  exp.push(task_instructions2);
  exp.push(reward_instructions);

  // Assign block task type and block reward type
  let blk_task;
  if (orderVersion === 1) {
    blk_task = repeatArray(['simon'], prms.nBlks / 2).concat(repeatArray(['stroop'], prms.nBlks / 2));
  } else if (orderVersion === 2) {
    blk_task = repeatArray(['stroop'], prms.nBlks / 2).concat(repeatArray(['simon'], prms.nBlks / 2));
  }

  // actual experiment
  for (let blk = 0; blk < prms.nBlks; blk += 1) {
    let blk_timeline;
    if (blk_task[blk] === 'simon') {
      if ((blk === 0) | (blk === prms.nBlks / 2)) {
        exp.push(task_instructions_simon);
      }
      exp.push(start_of_block_text);
      blk_timeline = { ...trial_timeline_simon };
    } else if (blk_task[blk] === 'stroop') {
      if ((blk === 0) | (blk === prms.nBlks / 2)) {
        exp.push(task_instructions_stroop);
      }
      exp.push(start_of_block_text);
      blk_timeline = { ...trial_timeline_stroop };
    }
    blk_timeline.sample = {
      type: 'fixed-repetitions',
      size: prms.nTrlsE / 8,
    };
    exp.push(blk_timeline);
    if (blk < prms.nBlks - 1) {
      exp.push(end_of_block_text);
    }
  }

  // end of experiment stuff
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
