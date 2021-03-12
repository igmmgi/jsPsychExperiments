// DescriptionExperience

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const canvas_colour = 'rgba(200, 200, 200, 1)';
const canvas_size = [960, 720];
const canvas_border = '5px solid black';

////////////////////////////////////////////////////////////////////////
//                             Experiment                             //
////////////////////////////////////////////////////////////////////////
const expName = getFileName();
const dirName = getDirName();
const vpNum = genVpNum();
const nFiles = getNumberOfFiles('/Common/num_files.php', dirName + 'data/');
const phase_order = getVersionNumber(nFiles, 2);

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
  fixDur: 500,
  fbDur: [1000, 500], // 1000 ms feedback for no reward, 500 ms for reward
  iti: 200,
  cTrl: 1, // count trials
  cBlk: 1, // count blocks
  cPoints: 600, // count points
  fixWidth: 3,
  fixSize: 15,
  fbSize: '50px monospace',
  fbTxt: ['-0', '-1'],
  respKeys: ['q', 'p'],
};

jsPsych.data.addProperties({ version: 'loss', phase_order: phase_order });

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const task_instructions1 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus:
    "<h2 style='text-align:left;'>Liebe Teilnehmer/innen,</h2><br>" +
    "<h2 style='text-align:left;'>vielen Dank, dass Sie sich die Zeit zur</h2>" +
    "<h2 style='text-align:left;'>Teilnahme an unserer Arbeit nehmen.</h2><br>" +
    "<h2 style='text-align:left;'>Bitte nehmen Sie nur teil, wenn Sie mindestens 18 Jahre alt sind.</h2>" +
    "<h2 style='text-align:left;'>Drücken Sie eine beliebige Taste, um fortzufahren!</h2>",
};

const task_instructions2 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: generate_formatted_html({
    text: `In diesem Experiment müssen Sie versuchen soviele Punkte wie möglich zu
    sichern. Sie haben zu Beginn 600 Punkte und Sie sehen in jedem Durchgang ein
    Bild auf der linken und ein Bild auf der rechten Seite des Bildschirms. Wenn
    Sie das Bild mit Verlust wählen verlieren Sie -1 Punkt. Wenn Sie das Bild ohne
    Verlust wählen verlieren Sie 0 Punkte. 
    <br><br>Entscheiden Sie sich in jedem Durchgang für ein Bild indem Sie 
    die entsprechende Taste drücken: Links: "Q" Rechts: "P" <br><br> 
    Drücken Sie eine beliebige Taste, um fortzufahren!`,
    fontsize: 26,
    bold: true,
    lineheight: 1.25,
    align: 'left',
  }),
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
      "<h2 style='text-align:left;'>Gesampunkte: " +
      prms.cPoints +
      '</h2><br>' +
      "<h2 style='text-align:left;'>Drücken Sie eine beliebige Taste, um fortzufahren!</h2>";
  },
  on_finish: function () {
    prms.cTrl = 1;
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
  on_finish: function () {
    prms.cBlk += 1;
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

const imagesDescription = readImages('../DescriptionImages/D_', 3);
const imagesExperience = shuffle(readImages('../ExperienceImages/E_', 34)).splice(0, 3);

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

  let imagesLeft = imageTypeLeft === 'Description' ? imagesDescription : imagesExperience;
  let imagesRight = imageTypeRight === 'Description' ? imagesDescription : imagesExperience;

  ctx.font = '30px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';
  ctx.fillText('Gesampunkte: ' + prms.cPoints, 0, -300);

  // draw left image
  ctx.drawImage(imagesLeft[numLeft], -imagesLeft[numLeft].width / 2 - 150, -imagesLeft[numLeft].height / 2);

  // draw right image
  ctx.drawImage(imagesRight[numRight], -imagesRight[numRight].width / 2 + 150, -imagesRight[numRight].height / 2);
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
    trial.trial_duration = prms.fbDur[dat.rewardCode];
  },
};

function drawFeedback() {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  let dat = jsPsych.data.get().last(1).values()[0];

  ctx.font = prms.fbSize;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';
  ctx.fillText(prms.fbTxt[dat.rewardCode], 0, 0);

  ctx.font = '30px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';
  ctx.fillText('Gesampunkte: ' + prms.cPoints, 0, -300);
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

  if (rewardCode === 1) {
    prms.cPoints -= 1;
  }

  let chosenImageType = response_side === 'left' ? dat.imageTypeLeft : dat.imageTypeRight;

  jsPsych.data.addDataToLastTrial({
    date: Date(),
    response_side: response_side,
    rt: dat.rt,
    rewardCode: rewardCode,
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
    stim: 'DescriptionExperience',
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
let learning_block_description = [
  // Pure Description 6 in total 
  // squares 0) 20% 2) 50% 4) 80%

  // Squares vs. Squares Unequal
  { phase: 'learning', trialType: 'PureDescription', imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 0.2, imageProbRight: 0.5, imageNumberLeft: 0, imageNumberRight: 1, highProbSide: 'right', },
  { phase: 'learning', trialType: 'PureDescription', imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 0.2, imageProbRight: 0.8, imageNumberLeft: 0, imageNumberRight: 2, highProbSide: 'right', },
  { phase: 'learning', trialType: 'PureDescription', imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 0.5, imageProbRight: 0.8, imageNumberLeft: 1, imageNumberRight: 2, highProbSide: 'right', },
  { phase: 'learning', trialType: 'PureDescription', imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 0.5, imageProbRight: 0.2, imageNumberLeft: 1, imageNumberRight: 0, highProbSide: 'left', },
  { phase: 'learning', trialType: 'PureDescription', imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 0.8, imageProbRight: 0.2, imageNumberLeft: 2, imageNumberRight: 0, highProbSide: 'left', },
  { phase: 'learning', trialType: 'PureDescription', imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 0.8, imageProbRight: 0.5, imageNumberLeft: 2, imageNumberRight: 1, highProbSide: 'left', },

];

// prettier-ignore
let learning_block_experience = [
  // Pure Experience 24 in total
  // random emoji with 0) 20% 2) 50% 4) 80%

  // Emoji set 
  { phase: 'learning', trialType: 'PureExperience', imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 0.2, imageProbRight: 0.5, imageNumberLeft: 0, imageNumberRight: 1, highProbSide: 'right', },
  { phase: 'learning', trialType: 'PureExperience', imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 0.2, imageProbRight: 0.8, imageNumberLeft: 0, imageNumberRight: 2, highProbSide: 'right', },
  { phase: 'learning', trialType: 'PureExperience', imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 0.5, imageProbRight: 0.8, imageNumberLeft: 1, imageNumberRight: 2, highProbSide: 'right', },
  { phase: 'learning', trialType: 'PureExperience', imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 0.5, imageProbRight: 0.2, imageNumberLeft: 1, imageNumberRight: 0, highProbSide: 'left', },
  { phase: 'learning', trialType: 'PureExperience', imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 0.8, imageProbRight: 0.2, imageNumberLeft: 2, imageNumberRight: 0, highProbSide: 'left', },
  { phase: 'learning', trialType: 'PureExperience', imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 0.8, imageProbRight: 0.5, imageNumberLeft: 2, imageNumberRight: 1, highProbSide: 'left', },

];

// prettier-ignore
let experimental_block_pure_description = repeatArray([
    
  // Pure Description 6 in total
  // numbers = squares 0) 20% 2) 50% 4) 80%
 
  // Squares vs. Squares Unequal
  { phase: 'experiment', trialType: 'PureDescription', imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 0.2, imageProbRight: 0.5, imageNumberLeft: 0, imageNumberRight: 1, highProbSide: 'right', },
  { phase: 'experiment', trialType: 'PureDescription', imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 0.2, imageProbRight: 0.8, imageNumberLeft: 0, imageNumberRight: 2, highProbSide: 'right', },
  { phase: 'experiment', trialType: 'PureDescription', imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 0.5, imageProbRight: 0.8, imageNumberLeft: 1, imageNumberRight: 2, highProbSide: 'right', },
  { phase: 'experiment', trialType: 'PureDescription', imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 0.5, imageProbRight: 0.2, imageNumberLeft: 1, imageNumberRight: 0, highProbSide: 'left', },
  { phase: 'experiment', trialType: 'PureDescription', imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 0.8, imageProbRight: 0.2, imageNumberLeft: 2, imageNumberRight: 0, highProbSide: 'left', },
  { phase: 'experiment', trialType: 'PureDescription', imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 0.8, imageProbRight: 0.5, imageNumberLeft: 2, imageNumberRight: 1, highProbSide: 'left', },

], 2);

// prettier-ignore
let experimental_block_pure_experience = repeatArray([
    
  // Pure Experience 6 in total
  // even image numbers = random emoji with 0) 20% 2) 50% 4) 80%

  // Emoji set 1 
  { phase: 'experiment', trialType: 'PureExperience', imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 0.2, imageProbRight: 0.5, imageNumberLeft: 0, imageNumberRight: 1, highProbSide: 'right', },
  { phase: 'experiment', trialType: 'PureExperience', imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 0.2, imageProbRight: 0.8, imageNumberLeft: 0, imageNumberRight: 2, highProbSide: 'right', },
  { phase: 'experiment', trialType: 'PureExperience', imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 0.5, imageProbRight: 0.8, imageNumberLeft: 1, imageNumberRight: 2, highProbSide: 'right', },
  { phase: 'experiment', trialType: 'PureExperience', imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 0.5, imageProbRight: 0.2, imageNumberLeft: 1, imageNumberRight: 0, highProbSide: 'left', },
  { phase: 'experiment', trialType: 'PureExperience', imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 0.8, imageProbRight: 0.2, imageNumberLeft: 2, imageNumberRight: 0, highProbSide: 'left', },
  { phase: 'experiment', trialType: 'PureExperience', imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 0.8, imageProbRight: 0.5, imageNumberLeft: 2, imageNumberRight: 1, highProbSide: 'left', },

], 2);

// prettier-ignore
let experimental_block_description_vs_experience_unequal = [

  // Description vs. Experience Unequal 12 in total
  // Squares vs. Emoji set 1 
  { phase: 'experiment', trialType: 'UnequalMixed', imageTypeLeft: 'Description', imageTypeRight: 'Experience',  imageProbLeft: 0.2, imageProbRight: 0.5, imageNumberLeft: 0, imageNumberRight: 1, highProbSide: 'right', },
  { phase: 'experiment', trialType: 'UnequalMixed', imageTypeLeft: 'Description', imageTypeRight: 'Experience',  imageProbLeft: 0.2, imageProbRight: 0.8, imageNumberLeft: 0, imageNumberRight: 2, highProbSide: 'right', },
  { phase: 'experiment', trialType: 'UnequalMixed', imageTypeLeft: 'Description', imageTypeRight: 'Experience',  imageProbLeft: 0.5, imageProbRight: 0.8, imageNumberLeft: 1, imageNumberRight: 2, highProbSide: 'right', },
  { phase: 'experiment', trialType: 'UnequalMixed', imageTypeLeft: 'Description', imageTypeRight: 'Experience',  imageProbLeft: 0.5, imageProbRight: 0.2, imageNumberLeft: 1, imageNumberRight: 0, highProbSide: 'left', },
  { phase: 'experiment', trialType: 'UnequalMixed', imageTypeLeft: 'Description', imageTypeRight: 'Experience',  imageProbLeft: 0.8, imageProbRight: 0.2, imageNumberLeft: 2, imageNumberRight: 0, highProbSide: 'left', },
  { phase: 'experiment', trialType: 'UnequalMixed', imageTypeLeft: 'Description', imageTypeRight: 'Experience',  imageProbLeft: 0.8, imageProbRight: 0.5, imageNumberLeft: 2, imageNumberRight: 1, highProbSide: 'left', },

  { phase: 'experiment', trialType: 'UnequalMixed', imageTypeLeft: 'Experience',  imageTypeRight: 'Description', imageProbLeft: 0.2, imageProbRight: 0.5, imageNumberLeft: 0, imageNumberRight: 1, highProbSide: 'right', },
  { phase: 'experiment', trialType: 'UnequalMixed', imageTypeLeft: 'Experience',  imageTypeRight: 'Description', imageProbLeft: 0.2, imageProbRight: 0.8, imageNumberLeft: 0, imageNumberRight: 2, highProbSide: 'right', },
  { phase: 'experiment', trialType: 'UnequalMixed', imageTypeLeft: 'Experience',  imageTypeRight: 'Description', imageProbLeft: 0.5, imageProbRight: 0.8, imageNumberLeft: 1, imageNumberRight: 2, highProbSide: 'right', },
  { phase: 'experiment', trialType: 'UnequalMixed', imageTypeLeft: 'Experience',  imageTypeRight: 'Description', imageProbLeft: 0.5, imageProbRight: 0.2, imageNumberLeft: 1, imageNumberRight: 0, highProbSide: 'left', },
  { phase: 'experiment', trialType: 'UnequalMixed', imageTypeLeft: 'Experience',  imageTypeRight: 'Description', imageProbLeft: 0.8, imageProbRight: 0.2, imageNumberLeft: 2, imageNumberRight: 0, highProbSide: 'left', },
  { phase: 'experiment', trialType: 'UnequalMixed', imageTypeLeft: 'Experience',  imageTypeRight: 'Description', imageProbLeft: 0.8, imageProbRight: 0.5, imageNumberLeft: 2, imageNumberRight: 1, highProbSide: 'left', },

];

// prettier-ignore
let experimental_block_description_vs_experience_equal = repeatArray([
    
  // Description vs. Experience Equal 6(*2) in total
  // Squares vs. Emoji Set 
  { phase: 'experiment', trialType: 'EqualMixed', imageTypeLeft: 'Description', imageTypeRight: 'Experience',  imageProbLeft: 0.2, imageProbRight: 0.2, imageNumberLeft: 0, imageNumberRight: 1, highProbSide: 'na', },
  { phase: 'experiment', trialType: 'EqualMixed', imageTypeLeft: 'Description', imageTypeRight: 'Experience',  imageProbLeft: 0.5, imageProbRight: 0.5, imageNumberLeft: 0, imageNumberRight: 2, highProbSide: 'na', },
  { phase: 'experiment', trialType: 'EqualMixed', imageTypeLeft: 'Description', imageTypeRight: 'Experience',  imageProbLeft: 0.8, imageProbRight: 0.8, imageNumberLeft: 1, imageNumberRight: 2, highProbSide: 'na', },
  { phase: 'experiment', trialType: 'EqualMixed', imageTypeLeft: 'Experience',  imageTypeRight: 'Description', imageProbLeft: 0.2, imageProbRight: 0.2, imageNumberLeft: 1, imageNumberRight: 0, highProbSide: 'na', },
  { phase: 'experiment', trialType: 'EqualMixed', imageTypeLeft: 'Experience',  imageTypeRight: 'Description', imageProbLeft: 0.5, imageProbRight: 0.5, imageNumberLeft: 2, imageNumberRight: 0, highProbSide: 'na', },
  { phase: 'experiment', trialType: 'EqualMixed', imageTypeLeft: 'Experience',  imageTypeRight: 'Description', imageProbLeft: 0.8, imageProbRight: 0.8, imageNumberLeft: 2, imageNumberRight: 1, highProbSide: 'na', },

], 2);
// console.log(learning_block_description);

// Learning Blocks:
// learning_block_description (6)
// learning_block_experience (6)
// Experimental Blocks:
// Experimental Block Trial Combinations (48*2)
// experimental_block_pure_description (6*2)
// experimental_block_pure_experience (6*2)
// experimental_block_description_vs_experience_unequal (12)
// experimental_block_description_vs_experience_equal (6*2)

const experimental_block = experimental_block_pure_description.concat(
  experimental_block_pure_experience,
  experimental_block_description_vs_experience_unequal,
  experimental_block_description_vs_experience_equal,
);
// console.log(experimental_block);

const trial_timeline_description = {
  timeline: [fixation_cross, pic_stim, trial_feedback, iti],
  timeline_variables: learning_block_description,
  sample: {
    type: 'fixed-repetitions',
    size: 16,
  },
};

const trial_timeline_experience = {
  timeline: [fixation_cross, pic_stim, trial_feedback, iti],
  timeline_variables: learning_block_experience,
  sample: {
    type: 'fixed-repetitions',
    size: 16,
  },
};

const trial_timeline_experiment = {
  timeline: [fixation_cross, pic_stim, trial_feedback, iti],
  timeline_variables: experimental_block,
  sample: {
    type: 'fixed-repetitions',
    size: 2,
  },
};

function ratings(imgs, imgType) {
  let r = [];
  for (let i = 0; i < 3; i++) {
    let tmp = {
      type: 'image-slider-response',
      stimulus: imgs[i].src,
      labels: ['0% Verlust', '20%', '40%', '60%', '80%', '100% Verlust'],
      button_label: 'Weiter',
      slider_width: 500,
      require_movement: true,
      prompt: '<p>Schätzen Sie die Wahrscheinlichkeit, dass dieses Bild zu einem Verlust führt.</p>',
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

const ratingsDescription = ratings(imagesDescription, 'D');
const ratingsExperience = ratings(imagesExperience, 'E');
const ratingStimuli = ratingsDescription.concat(ratingsExperience);

const randomString = generateRandomStringWithExpName('DE', 16);

const alphaNum = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: '',
  response_ends_trial: true,
  choices: [32],
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

////////////////////////////////////////////////////////////////////////
//                                Save                                //
////////////////////////////////////////////////////////////////////////
const save_data = {
  type: 'call-function',
  func: function () {
    let data_filename = dirName + 'data/' + expName + '_' + vpNum;
    saveData('/Common/write_data.php', data_filename, { stim: 'DescriptionExperience' });
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
  exp.push(welcome_de);
  exp.push(resize_de);

  exp.push(vpInfoForm_de);
  exp.push(hideMouseCursor);
  exp.push(screenInfo);
  exp.push(task_instructions1);
  exp.push(task_instructions2);

  // 96 trials in each block
  // first phase: learning block (description vs. experience)
  if (phase_order === 1) {
    exp.push(block_start);
    exp.push(trial_timeline_description);
    exp.push(short_break);
    exp.push(block_start);
    exp.push(trial_timeline_experience);
  } else if (phase_order === 2) {
    exp.push(block_start);
    exp.push(trial_timeline_experience);
    exp.push(short_break);
    exp.push(block_start);
    exp.push(trial_timeline_description);
  }

  // second phase: 8 experiment block of 96 trials
  for (let blk = 0; blk < 8; blk++) {
    exp.push(short_break);
    exp.push(block_start);
    exp.push(trial_timeline_experiment);
  }

  exp.push(showMouseCursor);
  exp.push(short_break);

  // end of experiment ratings
  for (let i = 0; i < ratingStimuli.length; i++) {
    exp.push(ratingStimuli[i]);
  }

  // save data
  exp.push(save_data);
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
  show_progress_bar: false,
  exclusions: {
    min_width: canvas_size[0],
    min_height: canvas_size[1],
  },
});
