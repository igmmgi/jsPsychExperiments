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
//
// Simon task: participants respond according to stimulus categors (spider/flower)
// with left/right mouse movements. A small circle moves with mouse x position.

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const canvas_colour = 'rgba(255, 255, 255, 1)';
const canvas_size = [1280, 960];
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
const nFiles = getNumberOfFiles('/Common/num_files.php', dirName + 'data/');

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
  nTrlsP: 16, // number of trials in practise blocks
  nTrlsE: 120, // number of trials in experiment blocks
  nBlks: 5,
  fixDur: 500,
  fbDur: [500, 1500],
  iti: 500,
  cTrl: 1, // count trials
  cBlk: 1, // count blocks
  fixWidth: 2,
  fixSize: 10,
  stimSize: '40px monospace',
  fbSize: '24px monospace',
  simonEccentricity: 450,
  imageSize: 0.5,
  startBox: [0, 0, 50, 50],
  fbTxt: ['Richtig', 'Falsch'],
};

const nVersion = getVersionNumber(nFiles, 2);
jsPsych.data.addProperties({ version: nVersion });

let respText;
if (nVersion === 1) {
  respText =
    "<h3 style='text-align:center;'><b>" +
    'Spinne' +
    ' = ziehe den Cursor nach links</b></h3>' +
    "<h3 style='text-align:center;'><b>" +
    'Blume' +
    ' = ziehe den Cursor nach rechts</b></h3><br>';
} else if (nVersion === 2) {
  respText =
    "<h3 style='text-align:center;'><b>" +
    'Blume' +
    ' = ziehe den Cursor nach links</b></h3>' +
    "<h3 style='text-align:center;'><b>" +
    'Spinne' +
    ' = ziehe den Cursor nach rechts</b></h3><br>';
}

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const participation_conditions = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus:
    "<h2 style='text-align: center;'>Wichtig Teilnahmevoraussetzungen:</h2><br>" +
    "<h3 style='text-align: left;'>* Laptop mit Touch-/Trackpad</h3>" +
    "<h3 style='text-align: left;'>* Keine Teilnahme an 'Flowers and Spiders Exp1'</h3>" +
    "<h3 style='text-align: left;'>* kein Problem mit der Betrachtung von realen Spinnenbildern</h3><br>" +
    "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>",
};

const task_instructions1 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus:
    "<h2 style='text-align: center;'>Willkommen bei unserem Experiment:</h2><br>" +
    "<h3 style='text-align: left;'>Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.</h3>" +
    "<h3 style='text-align: left;'>Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und </h3>" +
    "<h3 style='text-align: left;'>genügend Zeit hast, um das Experiment durchzuführen.</h3><br>" +
    "<h3 style='text-align: left;'>Wir bitten dich die ca. 35 Minuten konzentriert zu arbeiten.</h3><br>" +
    "<h3 style='text-align: left;'>Achtung: in diesem Experiment wirst du Bilder von echten Spinnen</h3>" +
    "<h3 style='text-align: left;'>sehen, welche gegebenfalls negative Emotionen oder Reaktionen</h3>" +
    "<h3 style='text-align: left;'>auslösen können. Bitte kilcke nur weiter wenn du damit einverstanden</h3>" +
    "<h3 style='text-align: left;'>bist solche Bilder zu sehen.</h3><br>" +
    "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>",
};

const task_instructions2 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus:
    "<h3 style='text-align: left;'>Du erhältst den Code für die Versuchspersonenstunden und weitere Anweisungen</h3>" +
    "<h3 style='text-align: left;'>am Ende des Experimentes. Bei Fragen oder Problemen wende dich bitte an:</h3><br>" +
    "<h3 style='text-align: center;'>sophie.renner@student.uni-tuebingen.de</h3><br>" +
    "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>",
};

const task_instructions3 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus:
    "<h2 style='text-align: center;'>Aufgabe:</h2>" +
    "<h3 style='text-align: left;'>In diesem Experiment musst du auf Bilder (Spinnen und Blumen) so schnell und so genau wie</h3>" +
    "<h3 style='text-align: left;'>möglich reagieren, die rechts oder links auf dem Bildschirm erscheinen.</h3><br>" +
    "<h3 style='text-align: left;'>Reagiere, indem du den Cursor in der Mitte des Bildschirms nach links oder rechts ziehst.</h3>" +
    "<h3 style='text-align: left;'>Bewege dazu deinen Finger auf dem Touch-/Trackpad deines Laptops. </h3><br>" +
    "<h3 style='text-align: left;'>Ignoriere die Position der Bilder und reagiere wie folgt:</h3><br>" +
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
      "<h3 style='text-align: left;'>Wenn du bereit für den Block bist dann positioniere deine Hand </h3>" +
      "<h3 style='text-align: left;'>auf dem Touch-/Trackpad. Es gilt:</h3><br>" +
      respText +
      "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>";
  },
};

const task_instructions_reminder = {
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
      "<h3 style='text-align: left;'>Wenn du bereit für den Block bist dann positioniere deine Hand </h3>" +
      "<h3 style='text-align: left;'>auf dem Touch-/Trackpad. Es gilt:</h3><br>" +
      respText +
      "<h3 style='text-align: center;'>Anmerkung: Starten jeden Durchgang in dem du in die Mitte klickst.</h3><br>" +
      "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>";
  },
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////
let imageFilesFlowers = [];
for (let i = 1; i <= 10; i++) {
  imageFilesFlowers.push(`../images/flower${i}.png`);
}
const imagesFlowers = loadImages(imageFilesFlowers);

let imageFilesSpiders = [];
for (let i = 1; i <= 10; i++) {
  imageFilesSpiders.push(`../images/spider${i}.png`);
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

function codeTrial() {
  'use strict';

  let dat = jsPsych.data.get().last(1).values()[0];

  let error = dat.end_loc === dat.corrResp ? 0 : 1;

  jsPsych.data.addDataToLastTrial({
    date: Date(),
    rt: dat.end_rt,
    error: error,
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
  ctx.fillText(prms.fbTxt[dat.error], 0, 0);
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

function blockFeedbackTxt_de_du(filter_options) {
  'use strict';
  let dat = jsPsych.data.get().filter({ ...filter_options, blockNum: prms.cBlk });
  let nTotal = dat.count();
  let nError = dat.select('error').values.filter(function (x) {
    return x !== 0;
  }).length;
  dat = jsPsych.data.get().filter({ ...filter_options, blockNum: prms.cBlk, error: 0 });
  let blockFbTxt =
    '<H1>Block: ' +
    prms.cBlk +
    ' von ' +
    prms.nBlks +
    '</H1><br>' +
    '<H1>Mittlere Reaktionszeit: ' +
    Math.round(dat.select('rt').mean()) +
    ' ms </H1>' +
    '<H1>Fehlerrate: ' +
    Math.round((nError / nTotal) * 100) +
    ' %</H1><br>' +
    '<H2>Drücke eine beliebige Taste, um fortzufahren!</H2>';
  prms.cBlk += 1;
  prms.cTrl = 1;
  return blockFbTxt;
}

const block_feedback = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: '',
  response_ends_trial: true,
  on_start: function (trial) {
    trial.stimulus = blockFeedbackTxt_de_du({ stim: 'saa2' });
  },
};

const simon_stimulus = {
  type: 'simon-aa-mouse',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  image: null,
  image_position: null,
  image_size: prms.imageSize,
  start_box: prms.startBox,
  stimulus_position: prms.stimPos,
  circle_eccentricity: prms.simonEccentricity,
  choices: prms.respKeys,
  data: {
    stim: 'saa2',
    imageType: jsPsych.timelineVariable('imageType'),
    imageNumber: jsPsych.timelineVariable('imageNumber'),
    imagePosition: jsPsych.timelineVariable('imagePosition'),
    corrResp: jsPsych.timelineVariable('corrResp'),
    comp: jsPsych.timelineVariable('comp'),
  },
  on_start: function (trial) {
    if (jsPsych.timelineVariable('imageType') === 'flower') {
      trial.image = imagesFlowers[jsPsych.timelineVariable('imageNumber') - 1];
    } else if (jsPsych.timelineVariable('imageType') === 'spider') {
      trial.image = imagesSpiders[jsPsych.timelineVariable('imageNumber') - 1];
    }
    if (jsPsych.timelineVariable('imagePosition') === 'left') {
      trial.image_position = prms.simonEccentricity;
    } else if (jsPsych.timelineVariable('imagePosition') === 'right') {
      trial.image_position = -prms.simonEccentricity;
    }
  },
  on_finish: function () {
    codeTrial();
  },
};

let simon = [];
// prettier-ignore
if (nVersion === 1) {
    for (let i = 1; i <= 10; i++) {
        simon.push({ imageType: "spider", imageNumber: i, imagePosition: 'left',  corrResp: "left",  comp: "comp"   });
        simon.push({ imageType: "spider", imageNumber: i, imagePosition: 'right', corrResp: "left",  comp: "incomp" });
        simon.push({ imageType: "flower", imageNumber: i, imagePosition: 'left',  corrResp: "right", comp: "incomp" });
        simon.push({ imageType: "flower", imageNumber: i, imagePosition: 'right', corrResp: "right", comp: "comp"   });
    }
}
else if (nVersion === 2) {
    for (let i = 1; i <= 10; i++) {
        simon.push({ imageType: "spider", imageNumber: i, imagePosition: 'left',  corrResp: "right", comp: "incomp" });
        simon.push({ imageType: "spider", imageNumber: i, imagePosition: 'right', corrResp: "right", comp: "comp"   });
        simon.push({ imageType: "flower", imageNumber: i, imagePosition: 'left',  corrResp: "left",  comp: "comp"   });
        simon.push({ imageType: "flower", imageNumber: i, imagePosition: 'right', corrResp: "left",  comp: "incomp" });
    }
}

const trial_timeline_simon_practise = {
  timeline: [simon_stimulus, trial_feedback],
  timeline_variables: simon.slice(0, 16),
};

const trial_timeline_simon_exp = {
  timeline: [simon_stimulus, trial_feedback],
  timeline_variables: simon,
};

////////////////////////////////////////////////////////////////////////
//                              De-brief                              //
////////////////////////////////////////////////////////////////////////
// For VP Stunden
const randomString = generateRandomStringWithExpName('saa2', 16);

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
    sophie.renner@student.uni-tuebingen.de<br>`,
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
    let data_filename = dirName + 'data/' + expName + '_' + vpNum;
    saveData('/Common/write_data_json.php', data_filename, { stim: 'saa2' }, 'json');
  },
  post_trial_gap: 3000,
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
  exp.push(welcome_de_du);
  exp.push(resize_de_du);
  exp.push(vpInfoForm_de);
  exp.push(screenInfo);
  exp.push(participation_conditions);
  exp.push(task_instructions1);
  exp.push(task_instructions2);
  exp.push(task_instructions3);
  exp.push(task_instructions4);

  for (let blk = 0; blk < prms.nBlks; blk++) {
    let blk_timeline = blk === 0 ? { ...trial_timeline_simon_practise } : { ...trial_timeline_simon_exp };
    blk_timeline.sample = {
      type: 'fixed-repetitions',
      size:
        blk === 0
          ? prms.nTrlsP / blk_timeline.timeline_variables.length
          : prms.nTrlsE / blk_timeline.timeline_variables.length,
    };
    exp.push(blk_timeline); // trials within a block
    exp.push(block_feedback); // show previous block performance
    if (blk < prms.nBlks - 1) {
      exp.push(task_instructions_reminder); // show reminder
    }
  }

  // save data
  exp.push(save_data);
  exp.push(save_interaction_data);
  exp.push(save_code);

  // debrief
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
