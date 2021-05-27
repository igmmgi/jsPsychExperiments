// BSc Project: Simon Task with affective valence stimuli (Spiders/Flowers)
//
// Original paper:
// Yamaguchi et al. (2018). Flowers and spiders in spatial stimulus-response
// compatibility: does affective valence influence selection of task-sets or
// selection of responses?
//
// Visual Simon task with pictures of spiders/flowers presented to lateral
// screen locations. Participants respond to spider vs. flower with left/right
// key-press.
//
// Spiders/Flower pictures provided by Yamaguchi et al (https://osf.io/sf83d/)

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const canvas_colour = 'rgba(255, 255, 255, 1)';
const canvas_size = [960, 720];
const canvas_border = '5px solid black';

////////////////////////////////////////////////////////////////////////
//                             Experiment                             //
////////////////////////////////////////////////////////////////////////
const expName = getFileName();
const dirName = getDirName();
const vpNum = genVpNum();
const nFiles = getNumberOfFiles('/Common/num_files.php', dirName + 'data/');

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
  nTrlsP: 40, // number of trials in practise blocks
  nBlksE: 120, // number of trials in experiment blocks
  nBlks: 5,
  fixDur: 500,
  fbDur: [1000, 1000, 1000],
  iti: 500,
  tooFast: 100,
  tooSlow: 2000,
  cTrl: 1, // count trials
  cBlk: 1, // count blocks
  fixWidth: 2,
  fixSize: 10,
  stimSize: '40px monospace',
  fbSize: '24px monospace',
  simonEccentricity: 250,
  respKeys: ['q', 'p'],
  fbTxt: ['Richtig', 'Falsch', 'Zu langsam', 'Zu schnell'],
};

const nVersion = getVersionNumber(nFiles, 2);
jsPsych.data.addProperties({ version: nVersion });

let respText;
if (nVersion === 1) {
  respText =
    "<h3 style='text-align:center;'><b>" +
    'Spinne' +
    " = linker Zeigefinger (Taste 'Q')</b></h3>" +
    "<h3 style='text-align:center;'><b>" +
    'Blume' +
    " = rechter Zeigefinger (Taste 'P')</b></h3><br>";
} else if (nVersion === 2) {
  respText =
    "<h3 style='text-align:center;'><b>" +
    'Blume' +
    " = linker Zeigefinger (Taste 'Q')</b></h3>" +
    "<h3 style='text-align:center;'><b>" +
    'Spinne' +
    " = rechter Zeigefinger (Taste 'P')</b></h3><br>";
}

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const task_instructions1 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus:
    "<h2 style='text-align: center;'>Willkommen bei unserem Experiment:</h2><br>" +
    "<h3 style='text-align: center;'>Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.</h3><br>" +
    "<h3 style='text-align: center;'>Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und </h3>" +
    "<h3 style='text-align: center;'>genügend Zeit hast, um das Experiment durchzuführen.</h3><br>" +
    "<h3 style='text-align: center;'>Wir bitten dich die ca. 40 Minuten konzentriert zu arbeiten.</h3><br>" +
    "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>",
};

const task_instructions2 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus:
    "<h3 style='text-align: left;'>Du erhaelst den Code für die Versuchspersonenstunden und weitere Anweisungen</h3>" +
    "<h3 style='text-align: left;'>am Ende des Experimentes. Bei Fragen oder Problemen wende dich bitte an:</h3><br>" +
    "<h3 style='text-align: center;'>hiwipibio@gmail.com</h3><br>" +
    "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>",
};

const task_instructions3 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus:
    "<h2 style='text-align: center;'>Aufgabe:</h2>" +
    "<h3 style='text-align: left;'>In diesem Experiment musst du auf verschiedene Bilder</h3>" +
    "<h3 style='text-align: left;'>so schnell und so genau wie möglich reagieren, die rechts</h3>" +
    "<h3 style='text-align: left;'>oder links auf dem Bildschirm erscheinen.</h3>" +
    "<h3 style='text-align: left;'>Reagiere immer wie folgt:</h3><br>" +
    respText +
    "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren.</h2>",
};

const task_instructions4 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: '',
  on_start: function (trial) {
    trial.stimulus =
      "<h2 style='text-align: center;'>Block " +
      prms.cBlk +
      ' von 5:</h2><br>' +
      "<h3 style='text-align: left;'>Wenn du bereit für den Block bist dann positioniere die Zeigefinger </h3>" +
      "<h3 style='text-align: left;'>deiner beiden Hände auf die Tastatur. Es gilt:</h3><br>" +
      respText +
      "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>";
  },
};

const task_instructions_pause = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus:
    "<h3 style='text-align: left;'>Kurze Pause. Bitte nutze die Pause, um dich zu erholen. Wenn du wieder bereit</h3>" +
    "<h3 style='text-align: left;'>für den nächsten Block bist, dann drücke eine beliebige Taste.</h3>",
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////
let imageFilesFlowers = [];
for (let i = 1; i <= 10; i++) {
  imageFilesFlowers.push('../images/flower' + i + '.png');
}
const imagesFlowers = loadImages(imageFilesFlowers);

let imageFilesSpiders = [];
for (let i = 1; i <= 10; i++) {
  imageFilesSpiders.push('../images/spider' + i + '.png');
}
const imagesSpiders = loadImages(imageFilesSpiders);

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

function drawSimon(args) {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');

  // draw response buttons
  const num = args.imageNumber - 1;
  let width, height;
  const size = 2;
  const xpos = args.imagePosition === 'left' ? prms.simonEccentricity : -prms.simonEccentricity;

  switch (args.imageType) {
    case 'spider':
      width = imagesSpiders[num].width;
      height = imagesSpiders[num].height;
      ctx.drawImage(imagesSpiders[num], -width / size / 2 - xpos, -height / size / 2, width / size, height / size);
      break;
    case 'flower':
      width = imagesFlowers[num].width;
      height = imagesFlowers[num].height;
      ctx.drawImage(imagesFlowers[num], -width / size / 2 - xpos, -height / size / 2, width / size, height / size);
      break;
  }
}

function codeTrial() {
  'use strict';

  let dat = jsPsych.data.get().last(1).values()[0];
  let corrCode = 0;
  let rt = dat.rt !== null ? dat.rt : prms.tooSlow;

  let correctKey;
  if (dat.key_press !== null) {
    correctKey = jsPsych.pluginAPI.compareKeys(dat.key_press, dat.corrResp);
  }

  let comp =
    (dat.imagePosition === 'left' && dat.key_press === prms.respKeys[0]) ||
    (dat.imagePosition === 'right' && dat.key_press === prms.respKeys[1]);
  comp = comp ? 'comp' : 'incomp';

  if (correctKey && rt > prms.tooFast && rt < prms.tooSlow) {
    corrCode = 1; // correct
  } else if (!correctKey && rt > prms.tooFast && rt < prms.tooSlow) {
    corrCode = 2; // choice error
  } else if (rt >= prms.tooSlow) {
    corrCode = 3; // too slow
  } else if (rt <= prms.tooFast) {
    corrCode = 4; // too false
  }
  jsPsych.data.addDataToLastTrial({
    date: Date(),
    comp: comp,
    rt: rt,
    corrCode: corrCode,
    blockNum: prms.cBlk,
    trialNum: prms.cTrl,
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
  ctx.fillText(prms.fbTxt[dat.corrCode - 1], 0, 0);
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
    trial.stimulus = blockFeedbackTxt_de_du({ stim: 'saa1' });
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
      imageType: jsPsych.timelineVariable('imageType'),
      imageNumber: jsPsych.timelineVariable('imageNumber'),
      imagePosition: jsPsych.timelineVariable('imagePosition'),
    },
  ],
  data: {
    stim: 'saa1',
    imageType: jsPsych.timelineVariable('imageType'),
    imageNumber: jsPsych.timelineVariable('imageNumber'),
    imagePosition: jsPsych.timelineVariable('imagePosition'),
    corrResp: jsPsych.timelineVariable('corrResp'),
  },
  on_finish: function () {
    codeTrial();
  },
};

let simon = [];
// prettier-ignore
if (nVersion === 1) {
    for (let i = 1; i <= 10; i++) {
        simon.push({ imageType: "spider", imageNumber: i, imagePosition: 'left',  corrResp: prms.respKeys[0] });
        simon.push({ imageType: "spider", imageNumber: i, imagePosition: 'right', corrResp: prms.respKeys[0] });
        simon.push({ imageType: "flower", imageNumber: i, imagePosition: 'left',  corrResp: prms.respKeys[1] });
        simon.push({ imageType: "flower", imageNumber: i, imagePosition: 'right', corrResp: prms.respKeys[1] });
    }
}
else if (nVersion === 2) {
    for (let i = 1; i <= 10; i++) {
        simon.push({ imageType: "spider", imageNumber: i, imagePosition: 'left',  corrResp: prms.respKeys[1] });
        simon.push({ imageType: "spider", imageNumber: i, imagePosition: 'right', corrResp: prms.respKeys[1] });
        simon.push({ imageType: "flower", imageNumber: i, imagePosition: 'left',  corrResp: prms.respKeys[0] });
        simon.push({ imageType: "flower", imageNumber: i, imagePosition: 'right', corrResp: prms.respKeys[0] });
    }
}

const trial_timeline_simon = {
  timeline: [fixation_cross, simon_stimulus, trial_feedback],
  timeline_variables: simon,
};

////////////////////////////////////////////////////////////////////////
//                              De-brief                              //
////////////////////////////////////////////////////////////////////////
// For VP Stunden
const randomString = generateRandomStringWithExpName('saa1', 16);

const alpha_num = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus:
    generate_formatted_html({
      text: `Wenn du eine Versuchspersonenstunde benötigst, kopiere den folgenden
      zufällig generierten Code und sende diesen zusammen mit deiner Matrikelnummer
      und deiner Universität (Tübingen oder Greifswald) per Email an:<br><br>
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

////////////////////////////////////////////////////////////////////////
//                                Save                                //
////////////////////////////////////////////////////////////////////////
const save_data = {
  type: 'call-function',
  func: function () {
    let data_filename = dirName + 'data/version' + nVersion + '/' + expName + '_' + vpNum;
    saveData('/Common/write_data.php', data_filename, { stim: 'saa1' });
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
  exp.push(task_instructions4);

  for (let blk = 0; blk < prms.nBlks; blk += 1) {
    let blk_timeline = { ...trial_timeline_simon };
    blk_timeline.sample = { type: 'fixed-repetitions', size: blk === 0 ? prms.nTrlsP / 40 : prms.nTrlsE / 40 };
    exp.push(blk_timeline); // trials within a block
    exp.push(block_feedback); // show previous block performance
  }

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
