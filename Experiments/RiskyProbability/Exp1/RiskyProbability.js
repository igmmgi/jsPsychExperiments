// RiskyProbability
// The influence of probability on risk attitudes
//
// Risky options are represented using 6 emoji features (3 win, 3 loss)
// Three probabilities: 20, 50, & 80%
// Safe options are represented using partially filled bars (3 green = win, 3 red = loss)
//
// Payoff scheme gain (risky)
// • Risky 20% = 20% chance of +40 or 80% chance of +20
// • Risky 50% = 50% chance of +40 or 50% chance of +20
// • Risky 80% = 80% chance of +40 or 20% chance of +20
//
// Payoff scheme loss (risky)
// • Risky 20% = 20% chance of -40 or 80% chance of -20
// • Risky 50% = 50% chance of -40 or 50% chance of -20
// • Risky 80% = 80% chance of -40 or 20% chance of -20
//
// Payoff scheme gain (sure bet)
// • Sure bet paired to 20% risky option = (20% chance of +40) + (80% chance of +20) = +24 points
// • Sure bet paired to 50% risky option = (50% chance of +40) + (50% chance of +20) = +30 points
// • Sure bet paired to 80% risky option = (80% chance of +40) + (20% chance of +20) = +36 points
//
// Payoff scheme loss (sure bet)
// • Sure bet paired to 20% risky option = (20% chance of -40) + (80% chance of -20) = -24 points
// • Sure bet paired to 50% risky option = (50% chance of -40) + (50% chance of -20) = -30 points
// • Sure bet paired to 80% risky option = (80% chance of -40) + (20% chance of -20) = -36 points
//
// Procedure:
// 10 blocks of 96 trials
// 5 blocks gain -> 5 blocks loss (order counter-balanced across participants)
// Blocks 1,2 and 6,7 (i.e., first two within each context) consist only safe or risky options
// Blocks 3,4,5 and 8,9,10 contain trials with:
//    i) two risky options
//   ii) two safe options
//  iii) a safe and a risky option with one option having a higher expected value
//   iv) a safe and a risky option with both options having equal expected value

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const canvas_colour = 'rgba(200, 200, 200, 1)';
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
  fixDur: 500,
  fbDur: 500, // 500 ms feedback
  iti: 750,
  cTrl: 0, // count trials
  cBlk: 0, // count blocks
  cPoints: 20000, // count points
  fixWidth: 3,
  fixSize: 15,
  fbSize: '50px monospace',
  respKeys: ['q', 'p'],
};

// 4 versions
// Version 1: Gain blocks -> Loss blocks with training (Safe  -> Risky)
// Version 2: Gain blocks -> Loss blocks with training (Risky -> Safe)
// Version 3: Loss blocks -> Gain blocks with training (Safe  -> Risky)
// Version 4: Loss blocks -> Gain blocks with training (Risky -> Safe)
const version = Number(jsPsych.data.urlVariables().version);
jsPsych.data.addProperties({ version: version });

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////

// from https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function numberWithCommas(x) {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
}

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
           Zusätzlich erhalten die 10% Teilnehmer mit der
           höchsten Gesamtpunktzahl einen 10€-Gutschein (wahlweise Deutsche Bahn oder Zalando oder REWE).<br><br>
           Jede/r Teilnehmerin/Teilnehmer startet mit ${numberWithCommas(prms.cPoints)} Gesamtpunkten.<br><br>
           Weiter geht es durch Drücken der Leertaste...`,
    fontsize: 26,
    lineheight: 1.5,
    align: 'left',
    bold: true,
  }),
  choices: [' '],
};

const task_instructions_gain = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: '',
  on_start: function (trial) {
    trial.stimulus = generate_formatted_html({
      text: `*** Sie müssen nun soviele Punkte wie möglich sammeln. *** <br><br>
    Sie sehen in jedem Durchgang ein Bild auf der linken und ein Bild auf der
    rechten Seite des Bildschirms. <br><br>
    Wenn Sie das Bild mit Gewinn wählen bekommen Sie +24, +30, +36, oder +40 Punkte. <br><br>
    Entscheiden Sie sich in jedem Durchgang für ein Bild indem Sie
    die entsprechende Taste drücken: <br><br>
    Links: "Q" -Taste &ensp; &ensp; &ensp; Rechts: "P" -Taste <br><br>
    Drücken Sie eine beliebige Taste, um fortzufahren!`,
      fontsize: 26,
      bold: true,
      lineheight: 1.25,
      align: 'left',
    });
  },
};

const task_instructions_loss = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: '',
  on_start: function (trial) {
    trial.stimulus = generate_formatted_html({
      text: `*** Sie müssen nun soviele Punkte wie möglich sichern. ***
    Sie sehen in jedem Durchgang ein Bild auf der linken und ein Bild auf der
    rechten Seite des Bildschirms.<br><br>
    Wenn Sie das Bild mit Verlust wählen verlieren Sie -24, -30, -36, oder -40 Punkte. <br><br>
    Entscheiden Sie sich in jedem Durchgang für ein Bild indem Sie
    die entsprechende Taste drücken: <br><br>
    Links: "Q" -Taste &ensp; &ensp; &ensp; Rechts: "P" -Taste <br><br>
    Drücken Sie eine beliebige Taste, um fortzufahren!`,
      fontsize: 26,
      bold: true,
      lineheight: 1.25,
      align: 'left',
    });
  },
};

const block_start = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: '',
  on_start: function (trial) {
    trial.stimulus =
      "<h2 style='text-align:left;'>Block Start: " +
      prms.cBlk +
      ' von 10</h2><br>' +
      "<h2 style='text-align:left;'>Versuche soviele Punkte wie möglich zu sammeln!<br><br></h2>" +
      "<h1 style='text-align:left;'>Aktuelle Gesamtpunkte: " +
      numberWithCommas(prms.cPoints) +
      '</h1>' +
      '<h2><br>Zur Erinnerung: Linkes Bild: "Q"-Taste Rechtes Bild "P"-Taste</h2><br>' +
      "<h2 style='text-align:left;'>Drücken Sie eine beliebige Taste, um fortzufahren!</h2>";
  },
  on_finish: function () {
    prms.cTrl = 1;
    prms.cBlk += 1;
  },
};

const short_break = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus:
    "<h2 style='text-align:left;'>Pause</h2><br>" +
    "<h2 style='text-align:left;'>Drücken Sie eine beliebige Taste, um fortzufahren!</h2>",
};

const half_break = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: '',
  choices: ['g'],
  on_start: function (trial) {
    trial.stimulus = generate_formatted_html({
      text: `*********************************************<br><br>
      Die Hälfte ist geschafft.<br><br> Deine aktuelle Gesamtpunktzahl:
      ${numberWithCommas(prms.cPoints)} <br><br>
      Bitte lese aufmerksam die neuen Instruktionen.<br><br>
        Weiter mit Taste G<br><br>
      ********************************************* `,
      fontsize: 26,
      lineheight: 1.5,
      align: 'left',
      bold: true,
    });
  },
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////
function readImages(dir, n) {
  let images = [];
  for (let i = 1; i <= n; i++) {
    images.push(dir + i + '.png');
  }
  return loadImages(images);
}

function basename(path) {
  return path.split(/[\\/]/).pop();
}

// safe images
const imgsSafeGain = readImages('DescriptionImages/DG_', 3);
const imgsSafeLoss = readImages('DescriptionImages/DR_', 3);

// risky images
let imgsExperience = shuffle(readImages('ExperienceImages/E_', 34));
let imgsRiskyGain = imgsExperience.splice(0, 3);
let imgsRiskyLoss = imgsExperience.splice(0, 3);

// console.log(imagesSafeGain);
// console.log(imagesSafeLoss);
// console.log(imagesRiskyGain);
// console.log(imagesRiskyLoss);

////////////////////////////////////////////////////////////////////////
//                             Functions                              //
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

  // ctx.font = '30px monospace';
  // ctx.textAlign = 'center';
  // ctx.textBaseline = 'middle';
  // ctx.fillStyle = 'black';
  // ctx.fillText('Gesamtpunkte: ' + prms.cPoints, 0, -300);
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

function showPicture(args) {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  ctx.font = '30px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';
  // ctx.fillText('Gesamtpunkte: ' + prms.cPoints, 0, -300);

  // draw left/right images
  ctx.drawImage(args.imgLeft, -args.imgLeft.width / 2 - 150, -args.imgLeft.height / 2);
  ctx.drawImage(args.imgRight, -args.imgRight.width / 2 + 150, -args.imgRight.height / 2);
}

const trial_feedback = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  translate_origin: true,
  trial_duration: prms.fbDur,
  response_ends_trial: false,
  func: drawFeedback,
};

function drawFeedback() {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  let dat = jsPsych.data.get().last(1).values()[0];

  // ctx.font = '30px monospace';
  // ctx.textAlign = 'center';
  // ctx.textBaseline = 'middle';
  // ctx.fillStyle = 'black';
  // ctx.fillText('Gesamtpunkte: ' + prms.cPoints, 0, -300);

  ctx.font = prms.fbSize;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';

  let fb;
  if (dat.rewardPoints > 0) {
    fb = String('+' + dat.rewardPoints);
  } else {
    fb = String(dat.rewardPoints);
  }
  // console.log(fb);

  ctx.fillText(fb, 0, 0);
}

function drawITI() {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');

  // ctx.font = '30px monospace';
  // ctx.textAlign = 'center';
  // ctx.textBaseline = 'middle';
  // ctx.fillStyle = 'black';
  // ctx.fillText('Gesamtpunkte: ' + prms.cPoints, 0, -300);
}

const iti = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  translate_origin: true,
  trial_duration: prms.iti,
  response_ends_trial: false,
  func: drawITI,
};

function codeTrial() {
  'use strict';
  let dat = jsPsych.data.get().last(1).values()[0];

  console.log(dat);
  let responseSide = dat.key_press === prms.respKeys[0] ? 'left' : 'right';
  let highProbSelected = responseSide === dat.highProbSide ? true : false;
  let selectedImageType = responseSide === 'left' ? dat.imgLeftType : dat.imgRightType;
  let selectedImageProb = responseSide === 'left' ? dat.probLeft : dat.probRight;

  // console.log(responseSide);
  // console.log(highProbSelected);
  // console.log(selectedImageType);
  // console.log(selectedImageProb);

  let rewardCode = 0;
  let rewardPoints = 0;
  if (selectedImageType === 'Safe') {
    rewardCode = 1;
    if (selectedImageProb === 0.2) {
      rewardPoints = 24;
    } else if (selectedImageProb === 0.5) {
      rewardPoints = 30;
    } else if (selectedImageProb === 0.8) {
      rewardPoints = 36;
    }
  } else if (selectedImageType === 'Risky') {
    rewardCode = Math.random() < selectedImageProb ? 1 : 0;
    rewardPoints = rewardCode ? 40 : 20;
  }

  // console.log(rewardProb);
  // console.log(rewardCode);

  if (dat.blkType === 'Loss') {
    rewardPoints = -rewardPoints;
  }
  prms.cPoints += rewardPoints;

  jsPsych.data.addDataToLastTrial({
    date: Date(),
    responseSide: responseSide,
    rt: dat.rt,
    rewardCode: rewardCode,
    rewardPoints: rewardPoints,
    totalPoints: prms.cPoints,
    highProbSelected: highProbSelected,
    blockNum: prms.cBlk,
    trialNum: prms.cTrl,
  });

  prms.cTrl += 1;
}

const pic_stim = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  translate_origin: true,
  stimulus_onset: 0,
  response_ends_trial: true,
  choices: prms.respKeys,
  func: showPicture,
  func_args: [
    {
      blkType: jsPsych.timelineVariable('blkType'),
      imgLeftType: jsPsych.timelineVariable('imgLeftType'),
      imgRightType: jsPsych.timelineVariable('imgRightType'),
      imgLeft: jsPsych.timelineVariable('imgLeft'),
      imgRight: jsPsych.timelineVariable('imgRight'),
      rewardSide: jsPsych.timelineVariable('rewardSide'),
    },
  ],
  data: {
    stim: 'RiskyProbability',
    phase: jsPsych.timelineVariable('phase'),
    blkType: jsPsych.timelineVariable('blkType'),
    imgLeftType: jsPsych.timelineVariable('imgLeftType'),
    imgRightType: jsPsych.timelineVariable('imgRightType'),
    probLeft: jsPsych.timelineVariable('probLeft'),
    probRight: jsPsych.timelineVariable('probRight'),
    highProbSide: jsPsych.timelineVariable('highProbSide'),
  },
  on_start: function (trial) {
    let imgLeft = jsPsych.timelineVariable('imgLeft');
    trial.data.imgLeft = basename(imgLeft.src);
    let imgRight = jsPsych.timelineVariable('imgRight');
    trial.data.imgRight = basename(imgRight.src);
  },
  on_finish: function () {
    codeTrial();
  },
};

// prettier-ignore
let training_block_gain_safe = [
  { phase: 'training', blkType: 'Gain', imgLeftType: 'Safe', imgRightType: 'Safe', imgLeft: imgsSafeGain[0], imgRight: imgsSafeGain[1], probLeft: 0.2, probRight: 0.5, highProbSide: 'right' },
  { phase: 'training', blkType: 'Gain', imgLeftType: 'Safe', imgRightType: 'Safe', imgLeft: imgsSafeGain[0], imgRight: imgsSafeGain[2], probLeft: 0.2, probRight: 0.8, highProbSide: 'right' },
  { phase: 'training', blkType: 'Gain', imgLeftType: 'Safe', imgRightType: 'Safe', imgLeft: imgsSafeGain[1], imgRight: imgsSafeGain[2], probLeft: 0.5, probRight: 0.8, highProbSide: 'right' },
  { phase: 'training', blkType: 'Gain', imgLeftType: 'Safe', imgRightType: 'Safe', imgLeft: imgsSafeGain[1], imgRight: imgsSafeGain[0], probLeft: 0.5, probRight: 0.2, highProbSide: 'left' },
  { phase: 'training', blkType: 'Gain', imgLeftType: 'Safe', imgRightType: 'Safe', imgLeft: imgsSafeGain[2], imgRight: imgsSafeGain[0], probLeft: 0.8, probRight: 0.2, highProbSide: 'left' },
  { phase: 'training', blkType: 'Gain', imgLeftType: 'Safe', imgRightType: 'Safe', imgLeft: imgsSafeGain[2], imgRight: imgsSafeGain[1], probLeft: 0.8, probRight: 0.5, highProbSide: 'left' },
];

// prettier-ignore
let training_block_loss_safe = [
  { phase: 'training', blkType: 'Loss', imgLeftType: 'Safe', imgRightType: 'Safe', imgLeft: imgsSafeLoss[0], imgRight: imgsSafeLoss[1], probLeft: 0.2, probRight: 0.5, highProbSide: 'right' },
  { phase: 'training', blkType: 'Loss', imgLeftType: 'Safe', imgRightType: 'Safe', imgLeft: imgsSafeLoss[0], imgRight: imgsSafeLoss[2], probLeft: 0.2, probRight: 0.8, highProbSide: 'right' },
  { phase: 'training', blkType: 'Loss', imgLeftType: 'Safe', imgRightType: 'Safe', imgLeft: imgsSafeLoss[1], imgRight: imgsSafeLoss[2], probLeft: 0.5, probRight: 0.8, highProbSide: 'right' },
  { phase: 'training', blkType: 'Loss', imgLeftType: 'Safe', imgRightType: 'Safe', imgLeft: imgsSafeLoss[1], imgRight: imgsSafeLoss[0], probLeft: 0.5, probRight: 0.2, highProbSide: 'left' },
  { phase: 'training', blkType: 'Loss', imgLeftType: 'Safe', imgRightType: 'Safe', imgLeft: imgsSafeLoss[2], imgRight: imgsSafeLoss[0], probLeft: 0.8, probRight: 0.2, highProbSide: 'left' },
  { phase: 'training', blkType: 'Loss', imgLeftType: 'Safe', imgRightType: 'Safe', imgLeft: imgsSafeLoss[2], imgRight: imgsSafeLoss[1], probLeft: 0.8, probRight: 0.5, highProbSide: 'left' },
];

// prettier-ignore
let training_block_gain_risky = [
  { phase: 'training', blkType: 'Gain', imgLeftType: 'Risky', imgRightType: 'Risky', imgLeft: imgsRiskyGain[0], imgRight: imgsRiskyGain[1], probLeft: 0.2, probRight: 0.5, highProbSide: 'right' },
  { phase: 'training', blkType: 'Gain', imgLeftType: 'Risky', imgRightType: 'Risky', imgLeft: imgsRiskyGain[0], imgRight: imgsRiskyGain[2], probLeft: 0.2, probRight: 0.8, highProbSide: 'right' },
  { phase: 'training', blkType: 'Gain', imgLeftType: 'Risky', imgRightType: 'Risky', imgLeft: imgsRiskyGain[1], imgRight: imgsRiskyGain[2], probLeft: 0.5, probRight: 0.8, highProbSide: 'right' },
  { phase: 'training', blkType: 'Gain', imgLeftType: 'Risky', imgRightType: 'Risky', imgLeft: imgsRiskyGain[1], imgRight: imgsRiskyGain[0], probLeft: 0.5, probRight: 0.2, highProbSide: 'left' },
  { phase: 'training', blkType: 'Gain', imgLeftType: 'Risky', imgRightType: 'Risky', imgLeft: imgsRiskyGain[2], imgRight: imgsRiskyGain[0], probLeft: 0.8, probRight: 0.2, highProbSide: 'left' },
  { phase: 'training', blkType: 'Gain', imgLeftType: 'Risky', imgRightType: 'Risky', imgLeft: imgsRiskyGain[2], imgRight: imgsRiskyGain[1], probLeft: 0.8, probRight: 0.5, highProbSide: 'left' },
];

// prettier-ignore
let training_block_loss_risky = [
  { phase: 'training', blkType: 'Loss', imgLeftType: 'Risky', imgRightType: 'Risky', imgLeft: imgsRiskyLoss[0], imgRight: imgsRiskyLoss[1], probLeft: 0.2, probRight: 0.5, highProbSide: 'right' },
  { phase: 'training', blkType: 'Loss', imgLeftType: 'Risky', imgRightType: 'Risky', imgLeft: imgsRiskyLoss[0], imgRight: imgsRiskyLoss[2], probLeft: 0.2, probRight: 0.8, highProbSide: 'right' },
  { phase: 'training', blkType: 'Loss', imgLeftType: 'Risky', imgRightType: 'Risky', imgLeft: imgsRiskyLoss[1], imgRight: imgsRiskyLoss[2], probLeft: 0.5, probRight: 0.8, highProbSide: 'right' },
  { phase: 'training', blkType: 'Loss', imgLeftType: 'Risky', imgRightType: 'Risky', imgLeft: imgsRiskyLoss[1], imgRight: imgsRiskyLoss[0], probLeft: 0.5, probRight: 0.2, highProbSide: 'left' },
  { phase: 'training', blkType: 'Loss', imgLeftType: 'Risky', imgRightType: 'Risky', imgLeft: imgsRiskyLoss[2], imgRight: imgsRiskyLoss[0], probLeft: 0.8, probRight: 0.2, highProbSide: 'left' },
  { phase: 'training', blkType: 'Loss', imgLeftType: 'Risky', imgRightType: 'Risky', imgLeft: imgsRiskyLoss[2], imgRight: imgsRiskyLoss[1], probLeft: 0.8, probRight: 0.5, highProbSide: 'left' },
];

// prettier-ignore
let exp_block_gain = [
  // pure safe
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Safe',  imgRightType: 'Safe',  imgLeft: imgsSafeGain[0],  imgRight: imgsSafeGain[1],  probLeft: 0.2, probRight: 0.5, highProbSide: 'right' },
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Safe',  imgRightType: 'Safe',  imgLeft: imgsSafeGain[0],  imgRight: imgsSafeGain[2],  probLeft: 0.2, probRight: 0.8, highProbSide: 'right' },
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Safe',  imgRightType: 'Safe',  imgLeft: imgsSafeGain[1],  imgRight: imgsSafeGain[2],  probLeft: 0.5, probRight: 0.8, highProbSide: 'right' },
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Safe',  imgRightType: 'Safe',  imgLeft: imgsSafeGain[1],  imgRight: imgsSafeGain[0],  probLeft: 0.5, probRight: 0.2, highProbSide: 'left' },
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Safe',  imgRightType: 'Safe',  imgLeft: imgsSafeGain[2],  imgRight: imgsSafeGain[0],  probLeft: 0.8, probRight: 0.2, highProbSide: 'left' },
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Safe',  imgRightType: 'Safe',  imgLeft: imgsSafeGain[2],  imgRight: imgsSafeGain[1],  probLeft: 0.8, probRight: 0.5, highProbSide: 'left' },
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Safe',  imgRightType: 'Safe',  imgLeft: imgsSafeGain[0],  imgRight: imgsSafeGain[1],  probLeft: 0.2, probRight: 0.5, highProbSide: 'right' },
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Safe',  imgRightType: 'Safe',  imgLeft: imgsSafeGain[0],  imgRight: imgsSafeGain[2],  probLeft: 0.2, probRight: 0.8, highProbSide: 'right' },
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Safe',  imgRightType: 'Safe',  imgLeft: imgsSafeGain[1],  imgRight: imgsSafeGain[2],  probLeft: 0.5, probRight: 0.8, highProbSide: 'right' },
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Safe',  imgRightType: 'Safe',  imgLeft: imgsSafeGain[1],  imgRight: imgsSafeGain[0],  probLeft: 0.5, probRight: 0.2, highProbSide: 'left' },
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Safe',  imgRightType: 'Safe',  imgLeft: imgsSafeGain[2],  imgRight: imgsSafeGain[0],  probLeft: 0.8, probRight: 0.2, highProbSide: 'left' },
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Safe',  imgRightType: 'Safe',  imgLeft: imgsSafeGain[2],  imgRight: imgsSafeGain[1],  probLeft: 0.8, probRight: 0.5, highProbSide: 'left' },

  // pure risky
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Risky', imgRightType: 'Risky', imgLeft: imgsRiskyGain[0], imgRight: imgsRiskyGain[1], probLeft: 0.2, probRight: 0.5, highProbSide: 'right' },
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Risky', imgRightType: 'Risky', imgLeft: imgsRiskyGain[0], imgRight: imgsRiskyGain[2], probLeft: 0.2, probRight: 0.8, highProbSide: 'right' },
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Risky', imgRightType: 'Risky', imgLeft: imgsRiskyGain[1], imgRight: imgsRiskyGain[2], probLeft: 0.5, probRight: 0.8, highProbSide: 'right' },
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Risky', imgRightType: 'Risky', imgLeft: imgsRiskyGain[1], imgRight: imgsRiskyGain[0], probLeft: 0.5, probRight: 0.2, highProbSide: 'left' },
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Risky', imgRightType: 'Risky', imgLeft: imgsRiskyGain[2], imgRight: imgsRiskyGain[0], probLeft: 0.8, probRight: 0.2, highProbSide: 'left' },
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Risky', imgRightType: 'Risky', imgLeft: imgsRiskyGain[2], imgRight: imgsRiskyGain[1], probLeft: 0.8, probRight: 0.5, highProbSide: 'left' },
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Risky', imgRightType: 'Risky', imgLeft: imgsRiskyGain[0], imgRight: imgsRiskyGain[1], probLeft: 0.2, probRight: 0.5, highProbSide: 'right' },
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Risky', imgRightType: 'Risky', imgLeft: imgsRiskyGain[0], imgRight: imgsRiskyGain[2], probLeft: 0.2, probRight: 0.8, highProbSide: 'right' },
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Risky', imgRightType: 'Risky', imgLeft: imgsRiskyGain[1], imgRight: imgsRiskyGain[2], probLeft: 0.5, probRight: 0.8, highProbSide: 'right' },
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Risky', imgRightType: 'Risky', imgLeft: imgsRiskyGain[1], imgRight: imgsRiskyGain[0], probLeft: 0.5, probRight: 0.2, highProbSide: 'left' },
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Risky', imgRightType: 'Risky', imgLeft: imgsRiskyGain[2], imgRight: imgsRiskyGain[0], probLeft: 0.8, probRight: 0.2, highProbSide: 'left' },
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Risky', imgRightType: 'Risky', imgLeft: imgsRiskyGain[2], imgRight: imgsRiskyGain[1], probLeft: 0.8, probRight: 0.5, highProbSide: 'left' },

  // mixed unequal
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Risky', imgRightType: 'Safe',  imgLeft: imgsRiskyGain[0], imgRight: imgsSafeGain[1],  probLeft: 0.2, probRight: 0.5, highProbSide: 'right' },
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Risky', imgRightType: 'Safe',  imgLeft: imgsRiskyGain[0], imgRight: imgsSafeGain[2],  probLeft: 0.2, probRight: 0.8, highProbSide: 'right' },
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Risky', imgRightType: 'Safe',  imgLeft: imgsRiskyGain[1], imgRight: imgsSafeGain[2],  probLeft: 0.5, probRight: 0.8, highProbSide: 'right' },
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Risky', imgRightType: 'Safe',  imgLeft: imgsRiskyGain[1], imgRight: imgsSafeGain[0],  probLeft: 0.5, probRight: 0.2, highProbSide: 'left' },
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Risky', imgRightType: 'Safe',  imgLeft: imgsRiskyGain[2], imgRight: imgsSafeGain[0],  probLeft: 0.8, probRight: 0.2, highProbSide: 'left' },
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Risky', imgRightType: 'Safe',  imgLeft: imgsRiskyGain[2], imgRight: imgsSafeGain[1],  probLeft: 0.8, probRight: 0.5, highProbSide: 'left' },
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Safe',  imgRightType: 'Risky', imgLeft: imgsSafeGain[0],  imgRight: imgsRiskyGain[1], probLeft: 0.2, probRight: 0.5, highProbSide: 'right' },
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Safe',  imgRightType: 'Risky', imgLeft: imgsSafeGain[0],  imgRight: imgsRiskyGain[2], probLeft: 0.2, probRight: 0.8, highProbSide: 'right' },
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Safe',  imgRightType: 'Risky', imgLeft: imgsSafeGain[1],  imgRight: imgsRiskyGain[2], probLeft: 0.5, probRight: 0.8, highProbSide: 'right' },
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Safe',  imgRightType: 'Risky', imgLeft: imgsSafeGain[1],  imgRight: imgsRiskyGain[0], probLeft: 0.5, probRight: 0.2, highProbSide: 'left' },
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Safe',  imgRightType: 'Risky', imgLeft: imgsSafeGain[2],  imgRight: imgsRiskyGain[0], probLeft: 0.8, probRight: 0.2, highProbSide: 'left' },
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Safe',  imgRightType: 'Risky', imgLeft: imgsSafeGain[2],  imgRight: imgsRiskyGain[1], probLeft: 0.8, probRight: 0.5, highProbSide: 'left' },

  // mixed equal
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Risky', imgRightType: 'Safe',  imgLeft: imgsRiskyGain[0], imgRight: imgsSafeGain[0],  probLeft: 0.2, probRight: 0.2, highProbSide: 'na' },
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Risky', imgRightType: 'Safe',  imgLeft: imgsRiskyGain[1], imgRight: imgsSafeGain[1],  probLeft: 0.5, probRight: 0.5, highProbSide: 'na' },
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Risky', imgRightType: 'Safe',  imgLeft: imgsRiskyGain[2], imgRight: imgsSafeGain[2],  probLeft: 0.8, probRight: 0.8, highProbSide: 'na' },
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Safe',  imgRightType: 'Risky', imgLeft: imgsSafeGain[0],  imgRight: imgsRiskyGain[0], probLeft: 0.2, probRight: 0.2, highProbSide: 'na' },
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Safe',  imgRightType: 'Risky', imgLeft: imgsSafeGain[1],  imgRight: imgsRiskyGain[1], probLeft: 0.5, probRight: 0.5, highProbSide: 'na' },
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Safe',  imgRightType: 'Risky', imgLeft: imgsSafeGain[2],  imgRight: imgsRiskyGain[2], probLeft: 0.8, probRight: 0.8, highProbSide: 'na' },
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Risky', imgRightType: 'Safe',  imgLeft: imgsRiskyGain[0], imgRight: imgsSafeGain[0],  probLeft: 0.2, probRight: 0.2, highProbSide: 'na' },
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Risky', imgRightType: 'Safe',  imgLeft: imgsRiskyGain[1], imgRight: imgsSafeGain[1],  probLeft: 0.5, probRight: 0.5, highProbSide: 'na' },
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Risky', imgRightType: 'Safe',  imgLeft: imgsRiskyGain[2], imgRight: imgsSafeGain[2],  probLeft: 0.8, probRight: 0.8, highProbSide: 'na' },
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Safe',  imgRightType: 'Risky', imgLeft: imgsSafeGain[0],  imgRight: imgsRiskyGain[0], probLeft: 0.2, probRight: 0.2, highProbSide: 'na' },
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Safe',  imgRightType: 'Risky', imgLeft: imgsSafeGain[1],  imgRight: imgsRiskyGain[1], probLeft: 0.5, probRight: 0.5, highProbSide: 'na' },
  { phase: 'exp', blkType: 'Gain', imgLeftType: 'Safe',  imgRightType: 'Risky', imgLeft: imgsSafeGain[2],  imgRight: imgsRiskyGain[2], probLeft: 0.8, probRight: 0.8, highProbSide: 'na' },

];
console.log(exp_block_gain);

// prettier-ignore
let exp_block_loss = [
  // pure safe
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Safe',  imgRightType: 'Safe',  imgLeft: imgsSafeLoss[0],  imgRight: imgsSafeLoss[1],  probLeft: 0.2, probRight: 0.5, highProbSide: 'right' },
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Safe',  imgRightType: 'Safe',  imgLeft: imgsSafeLoss[0],  imgRight: imgsSafeLoss[2],  probLeft: 0.2, probRight: 0.8, highProbSide: 'right' },
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Safe',  imgRightType: 'Safe',  imgLeft: imgsSafeLoss[1],  imgRight: imgsSafeLoss[2],  probLeft: 0.5, probRight: 0.8, highProbSide: 'right' },
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Safe',  imgRightType: 'Safe',  imgLeft: imgsSafeLoss[1],  imgRight: imgsSafeLoss[0],  probLeft: 0.5, probRight: 0.2, highProbSide: 'left' },
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Safe',  imgRightType: 'Safe',  imgLeft: imgsSafeLoss[2],  imgRight: imgsSafeLoss[0],  probLeft: 0.8, probRight: 0.2, highProbSide: 'left' },
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Safe',  imgRightType: 'Safe',  imgLeft: imgsSafeLoss[2],  imgRight: imgsSafeLoss[1],  probLeft: 0.8, probRight: 0.5, highProbSide: 'left' },
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Safe',  imgRightType: 'Safe',  imgLeft: imgsSafeLoss[0],  imgRight: imgsSafeLoss[1],  probLeft: 0.2, probRight: 0.5, highProbSide: 'right' },
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Safe',  imgRightType: 'Safe',  imgLeft: imgsSafeLoss[0],  imgRight: imgsSafeLoss[2],  probLeft: 0.2, probRight: 0.8, highProbSide: 'right' },
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Safe',  imgRightType: 'Safe',  imgLeft: imgsSafeLoss[1],  imgRight: imgsSafeLoss[2],  probLeft: 0.5, probRight: 0.8, highProbSide: 'right' },
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Safe',  imgRightType: 'Safe',  imgLeft: imgsSafeLoss[1],  imgRight: imgsSafeLoss[0],  probLeft: 0.5, probRight: 0.2, highProbSide: 'left' },
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Safe',  imgRightType: 'Safe',  imgLeft: imgsSafeLoss[2],  imgRight: imgsSafeLoss[0],  probLeft: 0.8, probRight: 0.2, highProbSide: 'left' },
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Safe',  imgRightType: 'Safe',  imgLeft: imgsSafeLoss[2],  imgRight: imgsSafeLoss[1],  probLeft: 0.8, probRight: 0.5, highProbSide: 'left' },

  // pure risky
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Risky', imgRightType: 'Risky', imgLeft: imgsRiskyLoss[0], imgRight: imgsRiskyLoss[1], probLeft: 0.2, probRight: 0.5, highProbSide: 'right' },
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Risky', imgRightType: 'Risky', imgLeft: imgsRiskyLoss[0], imgRight: imgsRiskyLoss[2], probLeft: 0.2, probRight: 0.8, highProbSide: 'right' },
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Risky', imgRightType: 'Risky', imgLeft: imgsRiskyLoss[1], imgRight: imgsRiskyLoss[2], probLeft: 0.5, probRight: 0.8, highProbSide: 'right' },
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Risky', imgRightType: 'Risky', imgLeft: imgsRiskyLoss[1], imgRight: imgsRiskyLoss[0], probLeft: 0.5, probRight: 0.2, highProbSide: 'left' },
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Risky', imgRightType: 'Risky', imgLeft: imgsRiskyLoss[2], imgRight: imgsRiskyLoss[0], probLeft: 0.8, probRight: 0.2, highProbSide: 'left' },
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Risky', imgRightType: 'Risky', imgLeft: imgsRiskyLoss[2], imgRight: imgsRiskyLoss[1], probLeft: 0.8, probRight: 0.5, highProbSide: 'left' },
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Risky', imgRightType: 'Risky', imgLeft: imgsRiskyLoss[0], imgRight: imgsRiskyLoss[1], probLeft: 0.2, probRight: 0.5, highProbSide: 'right' },
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Risky', imgRightType: 'Risky', imgLeft: imgsRiskyLoss[0], imgRight: imgsRiskyLoss[2], probLeft: 0.2, probRight: 0.8, highProbSide: 'right' },
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Risky', imgRightType: 'Risky', imgLeft: imgsRiskyLoss[1], imgRight: imgsRiskyLoss[2], probLeft: 0.5, probRight: 0.8, highProbSide: 'right' },
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Risky', imgRightType: 'Risky', imgLeft: imgsRiskyLoss[1], imgRight: imgsRiskyLoss[0], probLeft: 0.5, probRight: 0.2, highProbSide: 'left' },
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Risky', imgRightType: 'Risky', imgLeft: imgsRiskyLoss[2], imgRight: imgsRiskyLoss[0], probLeft: 0.8, probRight: 0.2, highProbSide: 'left' },
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Risky', imgRightType: 'Risky', imgLeft: imgsRiskyLoss[2], imgRight: imgsRiskyLoss[1], probLeft: 0.8, probRight: 0.5, highProbSide: 'left' },

  // mixed unequal
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Risky', imgRightType: 'Safe',  imgLeft: imgsRiskyLoss[0], imgRight: imgsSafeLoss[1],  probLeft: 0.2, probRight: 0.5, highProbSide: 'right' },
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Risky', imgRightType: 'Safe',  imgLeft: imgsRiskyLoss[0], imgRight: imgsSafeLoss[2],  probLeft: 0.2, probRight: 0.8, highProbSide: 'right' },
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Risky', imgRightType: 'Safe',  imgLeft: imgsRiskyLoss[1], imgRight: imgsSafeLoss[2],  probLeft: 0.5, probRight: 0.8, highProbSide: 'right' },
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Risky', imgRightType: 'Safe',  imgLeft: imgsRiskyLoss[1], imgRight: imgsSafeLoss[0],  probLeft: 0.5, probRight: 0.2, highProbSide: 'left' },
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Risky', imgRightType: 'Safe',  imgLeft: imgsRiskyLoss[2], imgRight: imgsSafeLoss[0],  probLeft: 0.8, probRight: 0.2, highProbSide: 'left' },
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Risky', imgRightType: 'Safe',  imgLeft: imgsRiskyLoss[2], imgRight: imgsSafeLoss[1],  probLeft: 0.8, probRight: 0.5, highProbSide: 'left' },
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Safe',  imgRightType: 'Risky', imgLeft: imgsSafeLoss[0],  imgRight: imgsRiskyLoss[1], probLeft: 0.2, probRight: 0.5, highProbSide: 'right' },
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Safe',  imgRightType: 'Risky', imgLeft: imgsSafeLoss[0],  imgRight: imgsRiskyLoss[2], probLeft: 0.2, probRight: 0.8, highProbSide: 'right' },
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Safe',  imgRightType: 'Risky', imgLeft: imgsSafeLoss[1],  imgRight: imgsRiskyLoss[2], probLeft: 0.5, probRight: 0.8, highProbSide: 'right' },
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Safe',  imgRightType: 'Risky', imgLeft: imgsSafeLoss[1],  imgRight: imgsRiskyLoss[0], probLeft: 0.5, probRight: 0.2, highProbSide: 'left' },
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Safe',  imgRightType: 'Risky', imgLeft: imgsSafeLoss[2],  imgRight: imgsRiskyLoss[0], probLeft: 0.8, probRight: 0.2, highProbSide: 'left' },
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Safe',  imgRightType: 'Risky', imgLeft: imgsSafeLoss[2],  imgRight: imgsRiskyLoss[1], probLeft: 0.8, probRight: 0.5, highProbSide: 'left' },

  // mixed equal
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Risky', imgRightType: 'Safe',  imgLeft: imgsRiskyLoss[0], imgRight: imgsSafeLoss[0],  probLeft: 0.2, probRight: 0.2, highProbSide: 'na' },
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Risky', imgRightType: 'Safe',  imgLeft: imgsRiskyLoss[1], imgRight: imgsSafeLoss[1],  probLeft: 0.5, probRight: 0.5, highProbSide: 'na' },
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Risky', imgRightType: 'Safe',  imgLeft: imgsRiskyLoss[2], imgRight: imgsSafeLoss[2],  probLeft: 0.8, probRight: 0.8, highProbSide: 'na' },
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Safe',  imgRightType: 'Risky', imgLeft: imgsSafeLoss[0],  imgRight: imgsRiskyLoss[0], probLeft: 0.2, probRight: 0.2, highProbSide: 'na' },
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Safe',  imgRightType: 'Risky', imgLeft: imgsSafeLoss[1],  imgRight: imgsRiskyLoss[1], probLeft: 0.5, probRight: 0.5, highProbSide: 'na' },
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Safe',  imgRightType: 'Risky', imgLeft: imgsSafeLoss[2],  imgRight: imgsRiskyLoss[2], probLeft: 0.8, probRight: 0.8, highProbSide: 'na' },
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Risky', imgRightType: 'Safe',  imgLeft: imgsRiskyLoss[0], imgRight: imgsSafeLoss[0],  probLeft: 0.2, probRight: 0.2, highProbSide: 'na' },
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Risky', imgRightType: 'Safe',  imgLeft: imgsRiskyLoss[1], imgRight: imgsSafeLoss[1],  probLeft: 0.5, probRight: 0.5, highProbSide: 'na' },
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Risky', imgRightType: 'Safe',  imgLeft: imgsRiskyLoss[2], imgRight: imgsSafeLoss[2],  probLeft: 0.8, probRight: 0.8, highProbSide: 'na' },
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Safe',  imgRightType: 'Risky', imgLeft: imgsSafeLoss[0],  imgRight: imgsRiskyLoss[0], probLeft: 0.2, probRight: 0.2, highProbSide: 'na' },
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Safe',  imgRightType: 'Risky', imgLeft: imgsSafeLoss[1],  imgRight: imgsRiskyLoss[1], probLeft: 0.5, probRight: 0.5, highProbSide: 'na' },
  { phase: 'exp', blkType: 'Loss', imgLeftType: 'Safe',  imgRightType: 'Risky', imgLeft: imgsSafeLoss[2],  imgRight: imgsRiskyLoss[2], probLeft: 0.8, probRight: 0.8, highProbSide: 'na' },

];
// console.log(exp_block_gain);

const trial_timeline_training_block_gain_safe = {
  timeline: [fixation_cross, pic_stim, trial_feedback, iti],
  timeline_variables: training_block_gain_safe,
  sample: {
    type: 'fixed-repetitions',
    size: 16,
  },
};
// console.log(trial_timeline_training_block_gain_safe);

const trial_timeline_training_block_loss_safe = {
  timeline: [fixation_cross, pic_stim, trial_feedback, iti],
  timeline_variables: training_block_loss_safe,
  sample: {
    type: 'fixed-repetitions',
    size: 16,
  },
};
// console.log(trial_timeline_training_block_loss_safe);

const trial_timeline_training_block_gain_risky = {
  timeline: [fixation_cross, pic_stim, trial_feedback, iti],
  timeline_variables: training_block_gain_risky,
  sample: {
    type: 'fixed-repetitions',
    size: 16,
  },
};
// console.log(trial_timeline_training_block_gain_risky);

const trial_timeline_training_block_loss_risky = {
  timeline: [fixation_cross, pic_stim, trial_feedback, iti],
  timeline_variables: training_block_loss_risky,
  sample: {
    type: 'fixed-repetitions',
    size: 16,
  },
};
// console.log(trial_timeline_training_block_loss_risky);

const trial_timeline_exp_block_gain = {
  timeline: [fixation_cross, pic_stim, trial_feedback, iti],
  timeline_variables: exp_block_gain,
  sample: {
    type: 'fixed-repetitions',
    size: 2,
  },
};
// console.log(trial_timeline_exp_block_gain);

const trial_timeline_exp_block_loss = {
  timeline: [fixation_cross, pic_stim, trial_feedback, iti],
  timeline_variables: exp_block_loss,
  sample: {
    type: 'fixed-repetitions',
    size: 2,
  },
};
// console.log(trial_timeline_exp_block_loss);

////////////////////////////////////////////////////////////////////////
//                              Be-brief                              //
////////////////////////////////////////////////////////////////////////
const randomString = generateRandomStringWithExpName('rp1', 16);

const alphaNum = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: '',
  response_ends_trial: true,
  choices: [' '],
  on_start: function (trial) {
    trial.stimulus =
      "<h2 style='text-align:left;'>Vielen Dank für Ihre Teilnahme.</h2>" +
      "<h3 style='text-align:left;'>Gesamtpunkte: " +
      numberWithCommas(prms.cPoints) +
      '</h3><br>' +
      "<h3 style='text-align:left;'>Wenn Sie eine Versuchspersonenstunde benötigen, kopieren Sie den </h3>" +
      "<h3 style='text-align:left;'>folgenden zufällig generierten Code und senden Sie diesen per Email an. </h3>" +
      '<h2>hiwipibio@gmail.com</h2>' +
      '<h2>Code: ' +
      randomString +
      '</h2><br>' +
      "<h2 style='text-align:left;'>Drücken Sie die Leertaste, um fortzufahren!</h2>";
  },
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
    bold: true,
  }),
};

const email_option = {
  type: 'survey-text',
  questions: [{ prompt: 'E-mail addresse?', placeholder: 'email@email', columns: 50, required: false, name: 'email' }],
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
    let data_filename = dirName + 'data/version' + version + '/' + expName + '_' + vpNum;
    saveData('/Common/write_data.php', data_filename, { stim: 'RiskyProbability' });
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

  exp.push(fullscreen_on);
  exp.push(check_screen);
  exp.push(welcome_de);
  exp.push(resize_de);
  exp.push(vpInfoForm_de);
  exp.push(hideMouseCursor);
  exp.push(screenInfo);
  exp.push(task_instructions1);

  // 1st half Gain vs. Loss counterbalanced
  // Version 1 & 2: Gain 1st half/Loss 2nd half
  // Version 3 & 4: Loss 1st half/Gain 2nd half
  // Training phase
  if (version === 1) {
    exp.push(task_instructions_gain);
    exp.push(block_start);
    exp.push(trial_timeline_training_block_gain_safe);
    exp.push(short_break);
    exp.push(block_start);
    exp.push(trial_timeline_training_block_gain_risky);
  } else if (version === 2) {
    exp.push(task_instructions_gain);
    exp.push(block_start);
    exp.push(trial_timeline_training_block_gain_risky);
    exp.push(short_break);
    exp.push(block_start);
    exp.push(trial_timeline_training_block_gain_safe);
  } else if (version === 3) {
    exp.push(task_instructions_loss);
    exp.push(block_start);
    exp.push(trial_timeline_training_block_loss_safe);
    exp.push(short_break);
    exp.push(block_start);
    exp.push(trial_timeline_training_block_loss_risky);
  } else if (version === 4) {
    exp.push(task_instructions_loss);
    exp.push(block_start);
    exp.push(trial_timeline_training_block_loss_risky);
    exp.push(short_break);
    exp.push(block_start);
    exp.push(trial_timeline_training_block_loss_safe);
  }

  // Exp phase
  for (let blk = 0; blk < 3; blk++) {
    exp.push(short_break);
    exp.push(block_start);
    if ([1, 2].includes(version)) {
      exp.push(trial_timeline_exp_block_gain);
    } else {
      exp.push(trial_timeline_exp_block_loss);
    }
  }

  exp.push(half_break);

  // 2nd half Gain vs. Loss counterbalanced
  // Version 1 & 2: Gain 1st half/Loss 2nd half
  // Version 3 & 4: Loss 1st half/Gain 2nd half
  // Training phase
  if (version === 1) {
    exp.push(task_instructions_loss);
    exp.push(block_start);
    exp.push(trial_timeline_training_block_loss_safe);
    exp.push(short_break);
    exp.push(block_start);
    exp.push(trial_timeline_training_block_loss_risky);
  } else if (version === 2) {
    exp.push(task_instructions_loss);
    exp.push(block_start);
    exp.push(trial_timeline_training_block_loss_risky);
    exp.push(short_break);
    exp.push(block_start);
    exp.push(trial_timeline_training_block_loss_safe);
  } else if (version === 3) {
    exp.push(task_instructions_gain);
    exp.push(block_start);
    exp.push(trial_timeline_training_block_gain_safe);
    exp.push(short_break);
    exp.push(block_start);
    exp.push(trial_timeline_training_block_gain_risky);
  } else if (version === 4) {
    exp.push(task_instructions_gain);
    exp.push(block_start);
    exp.push(trial_timeline_training_block_gain_risky);
    exp.push(short_break);
    exp.push(block_start);
    exp.push(trial_timeline_training_block_gain_safe);
  }

  // Exp phase
  for (let blk = 0; blk < 3; blk++) {
    exp.push(short_break);
    exp.push(block_start);
    if ([1, 2].includes(version)) {
      exp.push(trial_timeline_exp_block_loss);
    } else {
      exp.push(trial_timeline_exp_block_gain);
    }
  }

  exp.push(short_break);
  exp.push(showMouseCursor);

  // email
  exp.push(showMouseCursor);
  exp.push(email_option_instructions);
  exp.push(email_option);

  // save data
  exp.push(save_data);
  exp.push(save_interaction_data);
  exp.push(save_code);

  // de-brief
  exp.push(alphaNum);
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
