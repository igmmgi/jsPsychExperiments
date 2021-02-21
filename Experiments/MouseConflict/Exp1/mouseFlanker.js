// Flanker Task using the mouse
// Each individual trial is split into three phases:
// Phase 1: Trial Initiation
//      Participant is required to initiate the trial by moving the cursor into a
//      "Trial Initiation" region (start box).
//      Option 1: Just enter the start box region to initiate the trial.
//      Option 2: Enter the start box region AND press the left mouse button to initiate the trial.
// Phase 2: Fixation Cross (X ms)
// Phase 3: Stimulus presented --> Participant is required to move mouse cursor to one of two
//      response regions (reponse boxes) to execute the reponse.
//      Option 1: Just enter the response box to end the trial.
//      Option 2: Enter the response box and press the left mouse button.
//
// Whether the start box and both response boxes are drawn during each phase is controlled within
//  prms using an array (length = 3) of bools (see below).
//
//  The size of the response boxes is manipulated giving a 2*2 design:
//  Flanker compatibility (comp vs. incomp) X Response Box Size (small vs. large)

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const canvas_colour = 'rgba(200, 200, 200, 1)';
const canvas_size = [1280, 720];
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
const pcInfo = getComputerInfo();
const nFiles = getNumberOfFiles('/Common/num_files.php', dirName + 'data/');

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
  nTrlsP: 20, // number of trials in first block (practice)
  nTrlsE: 64, // number of trials in subsequent blocks
  nBlks: 10,
  fixDur: 500, // fixation cross duration
  fbDur: [500, 1000], // feedback duration for correct and incorrect trials, respectively
  waitDur: 1000,
  iti: 500, // inter-trial-interval
  fixPos: [canvas_size[0] / 2, canvas_size[1] * 0.75], // x,y position of stimulus
  stimPos: [canvas_size[0] / 2, canvas_size[1] * 0.75], // x,y position of stimulus
  startBox: [canvas_size[0] / 2, canvas_size[1] * 0.9, 50, 50], // xpos, ypos, xsize, ysize
  leftBox: [100, 100, 50, 50], // xpos, ypos, xsize, ysize
  rightBox: [1180, 100, 50, 50], // xpos, ypos, xsize, ysize
  responseBoxSizeAdjust: 25, // response boxes are +- X pixels different in height/width from start size
  keepFixation: false, // is fixation cross kept on screen with stimulus
  drawStartBox: [true, true, true], // draw response boxes at trial initiation, fixation cross, and response execution stages
  drawResponseBoxes: [false, true, true], // draw response boxes at trial initiation, fixation cross, and response execution stages
  boxLineWidth: 2, // linewidth of the start/target boxes
  requireMousePressStart: true, // is mouse button press inside start box required to initiate trial?
  requireMousePressFinish: true, // is mouse button press inside response box required to end trial?
  stimFont: '50px arial',
  fbTxt: ['Richtig', 'Falsch'],
  fbFont: '40px Arial',
  cTrl: 1, // count trials
  cBlk: 1, // count blocks
};

const nVersion = getVersionNumber(nFiles, 4);
jsPsych.data.addProperties({ version: nVersion });
let respText;
if (nVersion === 1 || nVersion === 2) {
  prms.resp_loc = ['left', 'right'];
  respText = "<h2 style='text-align:center;'><b>H = Links &ensp;&ensp;&ensp; S = Rechts</b></h2>";
} else {
  prms.resp_loc = ['right', 'left'];
  respText = "<h2 style='text-align:center;'><b>S = Links &ensp;&ensp;&ensp; H = Rechts</b></h2>";
}

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////

const mouse_reminder = {
  type: 'html-button-response',
  stimulus:
    generate_formatted_html({
      text: 'BITTE NUR TEILNEHMEN, WENN EINE EXTERNE <br>COMPUTER-MAUS ZUR VERFÜGUNG STEHT!<br>',
      align: 'center',
      fontsize: 26,
      bold: true,
      underline: true,
    }) +
    generate_formatted_html({
      text: `Für dieses Experiment benötigen Sie eine externe Computermaus.
      Wenn noch nicht geschehen, schließen Sie bitte jetzt eine Computermaus an
        Ihren Computer an und positionieren Sie diese in eine für Sie angenehme
        Position.  Wenn Sie bereit für dieses Experiment sind, dann klicken Sie
        bitte die linke Maustaste.`,
      align: 'left',
      fontsize: 26,
      lineheight: 1.5,
    }),
  choices: ['Weiter'],
  post_trial_gap: prms.waitDur,
};

const task_instructions1 = {
  type: 'html-button-response',
  stimulus:
    generate_formatted_html({
      text: `Aufgabe: <br><br>In jedem Durchgang müssen Sie zu Beginn in das Quadrat klicken, welches unten mittig am Bildschirm platziert ist.
        Daraufhin erscheint ein Buchstabe, der auf jeder Seite von zwei anderen Buchstaben umgeben ist. Sie sollen nur auf den zentralen Buchstaben wie folgt reagieren:`,
      align: 'left',
      fontsize: 26,
      lineheight: 1.5,
    }) +
    respText +
    generate_formatted_html({
      text: `Zeitgleich erscheinen 2 neue Quadrate, die Sie für ihre Antwort verwenden sollen. Ihre Aufgabe ist es, in Abhängigkeit des zentalen Buchstabens,
        mit der linken Maustaste is das korrekte Quadrat zu klicken. Anschließend bekommen Sie Feedback darüber,
        ob Sie richtig geantwortet haben. Durch einen Klick in das Quadrat am unteren Bildschirmrand
        starten Sie den nächsten Durchlauf.<br><br>Bitte reagieren Sie so schnell und so genau wie möglich mit der Maus auf den Ziel-Buchstaben, sobald dieser erscheint!<br><br>
        klicken Sie die linke Maustaste, um fortzufahren!`,
      align: 'left',
      fontsize: 26,
      lineheight: 1.5,
    }),
  choices: ['Weiter'],
  post_trial_gap: prms.waitDur,
};

const task_instructions2 = {
  type: 'html-button-response',
  stimulus:
    generate_formatted_html({
      text:
        'Insgesamt wird es ' +
        prms.nBlks +
        ' Blöcke geben, zwischen denen Sie immer die Möglichkeit für eine Pause haben. Zu Beginn gibt es zwei kurze Übungsblöcke. Denken Sie daran,<br>',
      align: 'left',
      fontsize: 26,
      lineheight: 1.5,
    }) +
    respText +
    generate_formatted_html({
      text: `Klicken Sie die linke Maustaste, um fortzufahren!`,
      align: 'left',
      fontsize: 26,
      lineheight: 1.5,
    }),
  choices: ['Weiter'],
  post_trial_gap: prms.waitDur,
};

const task_instructions3 = {
  type: 'html-button-response',
  stimulus:
    generate_formatted_html({
      text: 'Die Übungsblöcke ist erfolgreich abgeschlossen. Denken Sie daran, <br>',
      align: 'left',
      fontsize: 26,
      lineheight: 1.5,
    }) +
    respText +
    generate_formatted_html({
      text: `Klicken Sie mit der linken Maustaste zu Beginn in das Quadrat am
      unteren Bildschirmrand und um eine Antwort abzugeben in eines der
        Antwortquadrate. <br><br>klicken Sie die linke Maustaste, um fortzufahren!`,
      align: 'left',
      fontsize: 26,
      lineheight: 1.5,
    }),
  choices: ['Weiter'],
  post_trial_gap: prms.waitDur,
};

////////////////////////////////////////////////////////////////////////
//                        Experiment Functions                        //
////////////////////////////////////////////////////////////////////////

const trial_stimulus = {
  type: 'mouse-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  fixation_duration: prms.fixDur,
  fixation_position: prms.fixPos,
  stimulus: jsPsych.timelineVariable('stim'),
  stimulus_position: prms.stimPos,
  stimulus_colour: 'black',
  stimulus_font: prms.stimFont,
  start_box: prms.startBox,
  resp_size: jsPsych.timelineVariable('resp_size'),
  left_box: prms.leftBox,
  right_box: prms.rightBox,
  keep_fixation: prms.keepFixation,
  draw_start_box: prms.drawStartBox,
  draw_response_boxes: prms.drawResponseBoxes,
  box_linewidth: prms.boxLineWidth,
  require_mouse_press_start: prms.requireMousePressStart,
  require_mouse_press_finish: prms.requireMousePressFinish,
  data: {
    stim_type: 'mouse_flanker',
    stim: jsPsych.timelineVariable('stim'),
    comp: jsPsych.timelineVariable('comp'),
    resp_size: jsPsych.timelineVariable('resp_size'),
    resp_loc: jsPsych.timelineVariable('resp_loc'),
  },
  on_start: function (trial) {
    if (trial.data.resp_size === 'large') {
      trial.left_box[2] += prms.responseBoxSizeAdjust;
      trial.left_box[3] += prms.responseBoxSizeAdjust;
      trial.right_box[2] += prms.responseBoxSizeAdjust;
      trial.right_box[3] += prms.responseBoxSizeAdjust;
    } else if (trial.data.resp_size === 'small') {
      trial.left_box[2] -= prms.responseBoxSizeAdjust;
      trial.left_box[3] -= prms.responseBoxSizeAdjust;
      trial.right_box[2] -= prms.responseBoxSizeAdjust;
      trial.right_box[3] -= prms.responseBoxSizeAdjust;
    }
  },
  on_finish: function () {
    codeTrial();
  },
};

// Trials coded as Correct 0, Error 1
function codeTrial() {
  'use strict';
  let dat = jsPsych.data.get().last(1).values()[0];
  let corrCode = dat.resp_loc === dat.end_loc ? 0 : 1;
  jsPsych.data.addDataToLastTrial({
    date: Date(),
    corrCode: corrCode,
    blockNum: prms.cBlk,
    trialNum: prms.cTrl,
  });
  prms.cTrl += 1;
}

// Feedback is draw at response location
function drawFeedback() {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  let dat = jsPsych.data.get().last(1).values()[0];
  ctx.font = prms.fbFont;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';
  ctx.fillText(prms.fbTxt[dat.corrCode], dat.end_x, dat.end_y);
}

const trial_feedback = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  trial_duration: null,
  translate_origin: false,
  func: drawFeedback,
  on_start: function (trial) {
    let dat = jsPsych.data.get().last(1).values()[0];
    trial.trial_duration = prms.fbDur[dat.corrCode];
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

// prettier-ignore
stimuli_large = [
  { stim: 'HHHHH', comp: 'comp',   resp_size: 'large', resp_loc: prms.resp_loc[0] },
  { stim: 'SSSSS', comp: 'comp',   resp_size: 'large', resp_loc: prms.resp_loc[1] },
  { stim: 'HHSHH', comp: 'incomp', resp_size: 'large', resp_loc: prms.resp_loc[1] },
  { stim: 'SSHSS', comp: 'incomp', resp_size: 'large', resp_loc: prms.resp_loc[0] },
];

// prettier-ignore
stimuli_small = [
  { stim: 'HHHHH', comp: 'comp',   resp_size: 'small', resp_loc: prms.resp_loc[0] },
  { stim: 'SSSSS', comp: 'comp',   resp_size: 'small', resp_loc: prms.resp_loc[1] },
  { stim: 'HHSHH', comp: 'incomp', resp_size: 'small', resp_loc: prms.resp_loc[1] },
  { stim: 'SSHSS', comp: 'incomp', resp_size: 'small', resp_loc: prms.resp_loc[0] },
];

// Block feedback shows:
// Block Number, Mean RT + ER from previous block
function blockFeedbackTxt(filter_options) {
  'use strict';
  let dat = jsPsych.data.get().filter({ ...filter_options, blockNum: prms.cBlk });
  let nTotal = dat.count();
  let nError = dat.select('corrCode').values.filter(function (x) {
    return x !== 0;
  }).length;
  dat = jsPsych.data.get().filter({ ...filter_options, blockNum: prms.cBlk, corrCode: 0 });
  let blockFbTxt =
    '<H1>Block: ' +
    prms.cBlk +
    ' of ' +
    prms.nBlks +
    '</H1>' +
    '<H1>Mean RT: ' +
    Math.round(dat.select('end_rt').mean()) +
    ' ms </H1>' +
    '<H1>Error Rate: ' +
    Math.round((nError / nTotal) * 100) +
    ' %</H1>' +
    '<H2>Klicken Sie die linke Maustaste, um fortzufahren!</H2>';
  prms.cBlk += 1;
  prms.cTrl = 0;
  return blockFbTxt;
}

const block_feedback = {
  type: 'html-button-response',
  stimulus: '',
  response_ends_trial: true,
  post_trial_gap: prms.waitDur,
  on_start: function (trial) {
    trial.stimulus = blockFeedbackTxt({ stim_type: 'mouse_flanker' });
  },
  choices: ['Weiter'],
};

const trial_timeline_large = {
  timeline: [trial_stimulus, trial_feedback, iti],
  randomize_order: true,
  timeline_variables: stimuli_large,
};

const trial_timeline_small = {
  timeline: [trial_stimulus, trial_feedback, iti],
  randomize_order: true,
  timeline_variables: stimuli_small,
};

////////////////////////////////////////////////////////////////////////
//                              De-brief                              //
////////////////////////////////////////////////////////////////////////

// For VP Stunden
const randomString = generateRandomStringWithExpName('mc1', 16);

const alphaNum = {
  type: 'html-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  response_ends_trial: true,
  choices: [32],
  stimulus: generate_formatted_html({
    text:
      `Vielen Dank für Ihre Teilnahme.<br><br>
        Wenn Sie Versuchspersonenstunden benötigen, kopieren Sie den folgenden
        zufällig generierten Code und senden Sie diesen zusammen mit Ihrer
        Matrikelnummer per Email mit dem Betreff 'Versuchpersonenstunde'
        an:<br><br>samuel.sonntag@gmail.com<br> Code: ` +
      randomString +
      `<br><br>Drücken Sie die Leertaste, um fortzufahren!`,
    fontsize: 32,
    lineheight: 1.5,
    align: 'left',
  }),
};

////////////////////////////////////////////////////////////////////////
//                                Save                                //
////////////////////////////////////////////////////////////////////////
const save_data = {
  type: 'call-function',
  func: function () {
    let data_filename = dirName + 'data/' + expName + '_' + vpNum;
    saveData('/Common/write_data_json.php', data_filename, { stim_type: 'mouse_flanker' }, 'json');
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
  exp.push(check_screen);
  //exp.push(welcome_de);
  //exp.push(resize_de);
  // exp.push(vpInfoForm_de);
  //exp.push(mouse_reminder);
  //exp.push(task_instructions1);
  //exp.push(task_instructions2);

  let order;
  if (nVersion % 2 === 1) {
    order = repeatArray(['S', 'L'], prms.nBlks / 2);
  } else {
    order = repeatArray(['L', 'S'], prms.nBlks / 2);
  }

  for (let blk = 0; blk < prms.nBlks; blk += 1) {
    if (blk === 2) {
      exp.push(task_instructions3);
    }
    let blk_timeline;
    if (order[blk] === 'S') {
      blk_timeline = { ...trial_timeline_small };
    } else if (order[blk] === 'L') {
      blk_timeline = { ...trial_timeline_large };
    }
    blk_timeline.sample = {
      type: 'fixed-repetitions',
      size: blk === 0 || blk === 1 ? prms.nTrlsP / 4 : prms.nTrlsE / 4,
    };
    exp.push(blk_timeline); // trials within a block
    exp.push(block_feedback); // show previous block performance
  }

  // save data
  exp.push(save_data);
  exp.push(save_interaction_data);
  exp.push(save_code);

  // debrief
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
