// NarrowWide Pre-Pilot Version

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
  iti: 200,
  cTrl: 0, // count trials
  cBlk: 0, // count blocks
  cPoints: 0, // count points
  fixWidth: 3,
  fixSize: 15,
  fbSize: '50px monospace',
  respKeys: ['q', 'p'],
  pointsNarrow: [5],
  pointsWide: [1, 5, 9],
};

// 2 counter-balanced order versions
const version = Number(jsPsych.data.urlVariables().version);
jsPsych.data.addProperties({ version: version });

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
           Zusätzlich erhalten die 10 (von insgesamt 60) Teilnehmer mit der
           höchsten Gesamtpunktzahl einen 10€-Gutschein (wahlweise Deutsche Bahn oder Zalando oder REWE).<br><br>
           Jede/r Teilnehmerin/Teilnehmer startet mit 0 Gesamtpunkten.<br><br>
           Weiter geht es durch Drücken der Leertaste...`,
    fontsize: 26,
    lineheight: 1.5,
    align: 'left',
    bold: true,
  }),
  choices: [' '],
};

const task_instructions2 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: '',
  on_start: function (trial) {
    trial.stimulus = generate_formatted_html({
      text: `*** Sie müssen nun soviele Punkte wie möglich sichern. *** <br><br>
    Sie sehen in jedem Durchgang ein Bild auf der linken und ein Bild auf der
    rechten Seite des Bildschirms. <br><br>
    Wenn Sie das Bild mit Gewinn wählen bekommen Sie +1, +5 oder +9 Punkte. <br><br>
    Wenn Sie das Bild ohne Gewinn wählen bekommen Sie 0 Punkte.<br><br>
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
      (prms.cBlk + 1) +
      ' von 10</h2><br>' +
      "<h2 style='text-align:left;'>Aktuelle Gesampunkte: " +
      prms.cPoints +
      '<h2><br>Zur Erinnerung: Links: "Q"-Taste Rechts "P"-Taste</h2><br>' +
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
      ${prms.cPoints} <br><br>
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

const images = shuffle(readImages('../ExperienceImages/E_', 34));
const imagesNarrow = images.splice(0, 3);
const imagesWide = images.splice(0, 3);

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

  ctx.font = '30px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';
  ctx.fillText('Gesampunkte: ' + prms.cPoints, 0, -300);
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
  let numLeft = args.imageNumberLeft;
  let numRight = args.imageNumberRight;
  let imageTypeLeft = args.imageTypeLeft;
  let imageTypeRight = args.imageTypeRight;

  let imagesLeft = imageTypeLeft === 'Narrow' ? imagesNarrow : imagesWide;
  let imagesRight = imageTypeRight === 'Narrow' ? imagesNarrow : imagesWide;

  ctx.font = '30px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';
  ctx.fillText('Gesampunkte: ' + prms.cPoints, 0, -300);

  // draw left/right images
  ctx.drawImage(imagesLeft[numLeft], -imagesLeft[numLeft].width / 2 - 150, -imagesLeft[numLeft].height / 2);
  ctx.drawImage(imagesRight[numRight], -imagesRight[numRight].width / 2 + 150, -imagesRight[numRight].height / 2);
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

  ctx.font = '30px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';
  ctx.fillText('Gesampunkte: ' + prms.cPoints, 0, -300);

  ctx.font = prms.fbSize;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';
  ctx.fillText(dat.rewardPoints, 0, 0);
}

function drawITI() {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');

  ctx.font = '30px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';
  ctx.fillText('Gesampunkte: ' + prms.cPoints, 0, -300);
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
  let response_side = dat.key_press === prms.respKeys[0] ? 'left' : 'right';
  let highProbSelected = response_side === dat.highProbSide ? true : false;

  let rewardCode;
  if (response_side === 'left') {
    rewardCode = Math.random() < dat.imageProbLeft ? 1 : 0;
  } else if (response_side === 'right') {
    rewardCode = Math.random() < dat.imageProbRight ? 1 : 0;
  }

  let chosenImageType = response_side === 'left' ? dat.imageTypeLeft : dat.imageTypeRight;

  let rewardPoints = 0;
  if (rewardCode === 1) {
    if (chosenImageType === 'Narrow') {
      rewardPoints = shuffle(prms.pointsNarrow)[0];
      prms.cPoints += rewardPoints;
    } else if (chosenImageType === 'Wide') {
      rewardPoints = shuffle(prms.pointsWide)[0];
      prms.cPoints += rewardPoints;
    }
  }

  jsPsych.data.addDataToLastTrial({
    date: Date(),
    response_side: response_side,
    rt: dat.rt,
    rewardCode: rewardCode,
    rewardPoints: rewardPoints,
    highProbSelected: highProbSelected,
    chosenImageType: chosenImageType,
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
      imageTypeLeft: jsPsych.timelineVariable('imageTypeLeft'),
      imageTypeRight: jsPsych.timelineVariable('imageTypeRight'),
      imageNumberLeft: jsPsych.timelineVariable('imageNumberLeft'),
      imageNumberRight: jsPsych.timelineVariable('imageNumberRight'),
      rewardSide: jsPsych.timelineVariable('rewardSide'),
    },
  ],
  data: {
    stim: 'NarrowWide',
    phase: jsPsych.timelineVariable('phase'),
    trialType: jsPsych.timelineVariable('trialType'),
    imageTypeLeft: jsPsych.timelineVariable('imageTypeLeft'),
    imageTypeRight: jsPsych.timelineVariable('imageTypeRight'),
    imageProbLeft: jsPsych.timelineVariable('imageProbLeft'),
    imageProbRight: jsPsych.timelineVariable('imageProbRight'),
    imageNumberLeft: jsPsych.timelineVariable('imageNumberLeft'),
    imageNumberRight: jsPsych.timelineVariable('imageNumberRight'),
    highProbSide: jsPsych.timelineVariable('highProbSide'),
  },
  on_finish: function () {
    codeTrial();
  },
};

// prettier-ignore
let learning_block_narrow = [
  // Pure narrow 6 in total

  // Squares vs. Squares Unequal
  { phase: 'learning', trialType: 'PureNarrow', imageTypeLeft: 'Narrow', imageTypeRight: 'Narrow', imageProbLeft: 0.2, imageProbRight: 0.5, imageNumberLeft: 0, imageNumberRight: 1, highProbSide: 'right', },
  { phase: 'learning', trialType: 'PureNarrow', imageTypeLeft: 'Narrow', imageTypeRight: 'Narrow', imageProbLeft: 0.2, imageProbRight: 0.8, imageNumberLeft: 0, imageNumberRight: 2, highProbSide: 'right', },
  { phase: 'learning', trialType: 'PureNarrow', imageTypeLeft: 'Narrow', imageTypeRight: 'Narrow', imageProbLeft: 0.5, imageProbRight: 0.8, imageNumberLeft: 1, imageNumberRight: 2, highProbSide: 'right', },
  { phase: 'learning', trialType: 'PureNarrow', imageTypeLeft: 'Narrow', imageTypeRight: 'Narrow', imageProbLeft: 0.5, imageProbRight: 0.2, imageNumberLeft: 1, imageNumberRight: 0, highProbSide: 'left', },
  { phase: 'learning', trialType: 'PureNarrow', imageTypeLeft: 'Narrow', imageTypeRight: 'Narrow', imageProbLeft: 0.8, imageProbRight: 0.2, imageNumberLeft: 2, imageNumberRight: 0, highProbSide: 'left', },
  { phase: 'learning', trialType: 'PureNarrow', imageTypeLeft: 'Narrow', imageTypeRight: 'Narrow', imageProbLeft: 0.8, imageProbRight: 0.5, imageNumberLeft: 2, imageNumberRight: 1, highProbSide: 'left', },

];

// prettier-ignore
let learning_block_wide = [
  // Pure wide 6 in total

  // Emoji set
  { phase: 'learning', trialType: 'Wide', imageTypeLeft: 'Wide', imageTypeRight: 'Wide', imageProbLeft: 0.2, imageProbRight: 0.5, imageNumberLeft: 0, imageNumberRight: 1, highProbSide: 'right', },
  { phase: 'learning', trialType: 'Wide', imageTypeLeft: 'Wide', imageTypeRight: 'Wide', imageProbLeft: 0.2, imageProbRight: 0.8, imageNumberLeft: 0, imageNumberRight: 2, highProbSide: 'right', },
  { phase: 'learning', trialType: 'Wide', imageTypeLeft: 'Wide', imageTypeRight: 'Wide', imageProbLeft: 0.5, imageProbRight: 0.8, imageNumberLeft: 1, imageNumberRight: 2, highProbSide: 'right', },
  { phase: 'learning', trialType: 'Wide', imageTypeLeft: 'Wide', imageTypeRight: 'Wide', imageProbLeft: 0.5, imageProbRight: 0.2, imageNumberLeft: 1, imageNumberRight: 0, highProbSide: 'left', },
  { phase: 'learning', trialType: 'Wide', imageTypeLeft: 'Wide', imageTypeRight: 'Wide', imageProbLeft: 0.8, imageProbRight: 0.2, imageNumberLeft: 2, imageNumberRight: 0, highProbSide: 'left', },
  { phase: 'learning', trialType: 'Wide', imageTypeLeft: 'Wide', imageTypeRight: 'Wide', imageProbLeft: 0.8, imageProbRight: 0.5, imageNumberLeft: 2, imageNumberRight: 1, highProbSide: 'left', },

];

// prettier-ignore
let experimental_block_pure_narrow = repeatArray([

  // Pure narrow 6 in total
  // squares 0) 20% 2) 50% 4) 80%

  // Squares vs. Squares Unequal
  { phase: 'experiment', trialType: 'PureNarrow', imageTypeLeft: 'Narrow', imageTypeRight: 'Narrow', imageProbLeft: 0.2, imageProbRight: 0.5, imageNumberLeft: 0, imageNumberRight: 1, highProbSide: 'right', },
  { phase: 'experiment', trialType: 'PureNarrow', imageTypeLeft: 'Narrow', imageTypeRight: 'Narrow', imageProbLeft: 0.2, imageProbRight: 0.8, imageNumberLeft: 0, imageNumberRight: 2, highProbSide: 'right', },
  { phase: 'experiment', trialType: 'PureNarrow', imageTypeLeft: 'Narrow', imageTypeRight: 'Narrow', imageProbLeft: 0.5, imageProbRight: 0.8, imageNumberLeft: 1, imageNumberRight: 2, highProbSide: 'right', },
  { phase: 'experiment', trialType: 'PureNarrow', imageTypeLeft: 'Narrow', imageTypeRight: 'Narrow', imageProbLeft: 0.5, imageProbRight: 0.2, imageNumberLeft: 1, imageNumberRight: 0, highProbSide: 'left', },
  { phase: 'experiment', trialType: 'PureNarrow', imageTypeLeft: 'Narrow', imageTypeRight: 'Narrow', imageProbLeft: 0.8, imageProbRight: 0.2, imageNumberLeft: 2, imageNumberRight: 0, highProbSide: 'left', },
  { phase: 'experiment', trialType: 'PureNarrow', imageTypeLeft: 'Narrow', imageTypeRight: 'Narrow', imageProbLeft: 0.8, imageProbRight: 0.5, imageNumberLeft: 2, imageNumberRight: 1, highProbSide: 'left', },

], 2);

// prettier-ignore
let experimental_block_pure_wide = repeatArray([

  // Pure wide 6(*2) in total
  // random emoji with 0) 20% 2) 50% 4) 80%

  // Emoji set 1
  { phase: 'experiment', trialType: 'PureWide', imageTypeLeft: 'Wide', imageTypeRight: 'Wide', imageProbLeft: 0.2, imageProbRight: 0.5, imageNumberLeft: 0, imageNumberRight: 1, highProbSide: 'right', },
  { phase: 'experiment', trialType: 'PureWide', imageTypeLeft: 'Wide', imageTypeRight: 'Wide', imageProbLeft: 0.2, imageProbRight: 0.8, imageNumberLeft: 0, imageNumberRight: 2, highProbSide: 'right', },
  { phase: 'experiment', trialType: 'PureWide', imageTypeLeft: 'Wide', imageTypeRight: 'Wide', imageProbLeft: 0.5, imageProbRight: 0.8, imageNumberLeft: 1, imageNumberRight: 2, highProbSide: 'right', },
  { phase: 'experiment', trialType: 'PureWide', imageTypeLeft: 'Wide', imageTypeRight: 'Wide', imageProbLeft: 0.5, imageProbRight: 0.2, imageNumberLeft: 1, imageNumberRight: 0, highProbSide: 'left', },
  { phase: 'experiment', trialType: 'PureWide', imageTypeLeft: 'Wide', imageTypeRight: 'Wide', imageProbLeft: 0.8, imageProbRight: 0.2, imageNumberLeft: 2, imageNumberRight: 0, highProbSide: 'left', },
  { phase: 'experiment', trialType: 'PureWide', imageTypeLeft: 'Wide', imageTypeRight: 'Wide', imageProbLeft: 0.8, imageProbRight: 0.5, imageNumberLeft: 2, imageNumberRight: 1, highProbSide: 'left', },

], 2);

// prettier-ignore
let experimental_block_narrow_vs_wide_unequal = [

  // Narrow vs. Wide Unequal 12 in total
  { phase: 'experiment', trialType: 'UnequalMixed', imageTypeLeft: 'Narrow', imageTypeRight: 'Wide',  imageProbLeft: 0.2, imageProbRight: 0.5, imageNumberLeft: 0, imageNumberRight: 1, highProbSide: 'right', },
  { phase: 'experiment', trialType: 'UnequalMixed', imageTypeLeft: 'Narrow', imageTypeRight: 'Wide',  imageProbLeft: 0.2, imageProbRight: 0.8, imageNumberLeft: 0, imageNumberRight: 2, highProbSide: 'right', },
  { phase: 'experiment', trialType: 'UnequalMixed', imageTypeLeft: 'Narrow', imageTypeRight: 'Wide',  imageProbLeft: 0.5, imageProbRight: 0.8, imageNumberLeft: 1, imageNumberRight: 2, highProbSide: 'right', },
  { phase: 'experiment', trialType: 'UnequalMixed', imageTypeLeft: 'Narrow', imageTypeRight: 'Wide',  imageProbLeft: 0.5, imageProbRight: 0.2, imageNumberLeft: 1, imageNumberRight: 0, highProbSide: 'left', },
  { phase: 'experiment', trialType: 'UnequalMixed', imageTypeLeft: 'Narrow', imageTypeRight: 'Wide',  imageProbLeft: 0.8, imageProbRight: 0.2, imageNumberLeft: 2, imageNumberRight: 0, highProbSide: 'left', },
  { phase: 'experiment', trialType: 'UnequalMixed', imageTypeLeft: 'Narrow', imageTypeRight: 'Wide',  imageProbLeft: 0.8, imageProbRight: 0.5, imageNumberLeft: 2, imageNumberRight: 1, highProbSide: 'left', },

  { phase: 'experiment', trialType: 'UnequalMixed', imageTypeLeft: 'Wide',  imageTypeRight: 'Narrow', imageProbLeft: 0.2, imageProbRight: 0.5, imageNumberLeft: 0, imageNumberRight: 1, highProbSide: 'right', },
  { phase: 'experiment', trialType: 'UnequalMixed', imageTypeLeft: 'Wide',  imageTypeRight: 'Narrow', imageProbLeft: 0.2, imageProbRight: 0.8, imageNumberLeft: 0, imageNumberRight: 2, highProbSide: 'right', },
  { phase: 'experiment', trialType: 'UnequalMixed', imageTypeLeft: 'Wide',  imageTypeRight: 'Narrow', imageProbLeft: 0.5, imageProbRight: 0.8, imageNumberLeft: 1, imageNumberRight: 2, highProbSide: 'right', },
  { phase: 'experiment', trialType: 'UnequalMixed', imageTypeLeft: 'Wide',  imageTypeRight: 'Narrow', imageProbLeft: 0.5, imageProbRight: 0.2, imageNumberLeft: 1, imageNumberRight: 0, highProbSide: 'left', },
  { phase: 'experiment', trialType: 'UnequalMixed', imageTypeLeft: 'Wide',  imageTypeRight: 'Narrow', imageProbLeft: 0.8, imageProbRight: 0.2, imageNumberLeft: 2, imageNumberRight: 0, highProbSide: 'left', },
  { phase: 'experiment', trialType: 'UnequalMixed', imageTypeLeft: 'Wide',  imageTypeRight: 'Narrow', imageProbLeft: 0.8, imageProbRight: 0.5, imageNumberLeft: 2, imageNumberRight: 1, highProbSide: 'left', },

];

// prettier-ignore
let experimental_block_narrow_vs_wide_equal = repeatArray([

  // Narrow vs. WWide Equal 6(*2) in total
  { phase: 'experiment', trialType: 'EqualMixed', imageTypeLeft: 'Narrow', imageTypeRight: 'Wide',   imageProbLeft: 0.2, imageProbRight: 0.2, imageNumberLeft: 0, imageNumberRight: 1, highProbSide: 'na', },
  { phase: 'experiment', trialType: 'EqualMixed', imageTypeLeft: 'Narrow', imageTypeRight: 'Wide',   imageProbLeft: 0.5, imageProbRight: 0.5, imageNumberLeft: 0, imageNumberRight: 2, highProbSide: 'na', },
  { phase: 'experiment', trialType: 'EqualMixed', imageTypeLeft: 'Narrow', imageTypeRight: 'Wide',   imageProbLeft: 0.8, imageProbRight: 0.8, imageNumberLeft: 1, imageNumberRight: 2, highProbSide: 'na', },
  { phase: 'experiment', trialType: 'EqualMixed', imageTypeLeft: 'Wide',   imageTypeRight: 'Narrow', imageProbLeft: 0.2, imageProbRight: 0.2, imageNumberLeft: 1, imageNumberRight: 0, highProbSide: 'na', },
  { phase: 'experiment', trialType: 'EqualMixed', imageTypeLeft: 'Wide',   imageTypeRight: 'Narrow', imageProbLeft: 0.5, imageProbRight: 0.5, imageNumberLeft: 2, imageNumberRight: 0, highProbSide: 'na', },
  { phase: 'experiment', trialType: 'EqualMixed', imageTypeLeft: 'Wide',   imageTypeRight: 'Narrow', imageProbLeft: 0.8, imageProbRight: 0.8, imageNumberLeft: 2, imageNumberRight: 1, highProbSide: 'na', },

], 2);

// Learning Blocks:
// learning_block_narrow (6)
// learning_block_wide (6)
// Experimental Blocks:
// Experimental Block Trial Combinations (48*2)
// experimental_block_pure_narrow (6*2)
// experimental_block_pure_wide (6*2)
// experimental_block_narrow_vs_wide_unequal (12)
// experimental_block_narrow_vs_wide_equal (6*2)

const experimental_block = experimental_block_pure_narrow.concat(
  experimental_block_pure_wide,
  experimental_block_narrow_vs_wide_unequal,
  experimental_block_narrow_vs_wide_equal,
);

const trial_timeline_narrow = {
  timeline: [fixation_cross, pic_stim, trial_feedback, iti],
  timeline_variables: learning_block_narrow,
  sample: {
    type: 'fixed-repetitions',
    size: 16,
  },
};
// console.log(trial_timeline_narrow);

const trial_timeline_wide = {
  timeline: [fixation_cross, pic_stim, trial_feedback, iti],
  timeline_variables: learning_block_wide,
  sample: {
    type: 'fixed-repetitions',
    size: 16,
  },
};
// console.log(trial_timeline_wide);

const trial_timeline_experiment = {
  timeline: [fixation_cross, pic_stim, trial_feedback, iti],
  timeline_variables: experimental_block,
  sample: {
    type: 'fixed-repetitions',
    size: 2,
  },
};
// console.log(trial_timeline_experiment);

function ratings(imgs, imgType) {
  let r = [];
  for (let i = 0; i < 3; i++) {
    let tmp = {
      type: 'image-slider-response',
      stimulus: imgs[i].src,
      labels: ['0% Gewinn', '20%', '40%', '60%', '80%', '100% Gewinn'],
      button_label: 'Weiter',
      slider_width: 500,
      require_movement: false,
      prompt: '<p>Schätzen Sie die Wahrscheinlichkeit, dass dieses Bild zu einem Gewinn führt.</p>',
      on_finish: function () {
        let dat = jsPsych.data.get().last(1).values()[0];
        let key = imgType + (i + 1);
        jsPsych.data.addProperties({ [key]: dat.response });
      },
    };
    r.push(tmp);
  }
  return r;
}

const ratingsNarrow = ratings(imagesNarrow, 'N');
const ratingsWide = ratings(imagesWide, 'W');
const ratingStimuli = ratingsNarrow.concat(ratingsWide);

////////////////////////////////////////////////////////////////////////
//                              Be-brief                              //
////////////////////////////////////////////////////////////////////////
const randomString = generateRandomStringWithExpName('nwv1', 16);

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
      "<h3 style='text-align:left;'>Gesampunkte: " +
      prms.cPoints +
      '</h3><br>' +
      "<h3 style='text-align:left;'>Wenn Sie eine Versuchspersonenstunde benötigen, kopieren Sie den </h3>" +
      "<h3 style='text-align:left;'>folgenden zufällig generierten Code und senden Sie diesen per Email. </h3>" +
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
    let data_filename = dirName + 'data/version' + version + '/' + expName + '_' + vpNum;
    saveData('/Common/write_data.php', data_filename, { stim: 'NarrowWide' });
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
  exp.push(task_instructions2);

  // 96 trials in each block
  // first phase: learning block (narrow vs. wide)
  for (let blk = 0; blk < 2; blk++) {
    if (version === 1) {
      exp.push(block_start);
      exp.push(trial_timeline_narrow);
      exp.push(short_break);
      exp.push(block_start);
      exp.push(trial_timeline_wide);
    } else if (version === 2) {
      exp.push(block_start);
      exp.push(trial_timeline_wide);
      exp.push(short_break);
      exp.push(block_start);
      exp.push(trial_timeline_narrow);
    }
  }

  // second phase: 6 experiment block of 96 trials
  // for (let blk = 0; blk < 6; blk++) {
  for (let blk = 0; blk < 1; blk++) {
    exp.push(short_break);
    exp.push(block_start);
    exp.push(trial_timeline_experiment);
  }

  exp.push(showMouseCursor);

  // end of experiment ratings
  for (let i = 0; i < ratingStimuli.length; i++) {
    exp.push(ratingStimuli[i]);
  }

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
