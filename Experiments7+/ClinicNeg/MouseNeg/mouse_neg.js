////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////

const jsPsych = initJsPsych({});

const CANVAS_COLOUR = 'rgba(255, 255, 255, 1)';
const CANVAS_SIZE = [1280, 720];
const CANVAS_BORDER = '5px solid black';

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const PRMS = {
  nTrlsP: 4, //16, // number of trials in first block (practice)
  nTrlsE: 48, // number of trials in subsequent blocks
  nBlks: 2,
  fbDur: [500, 1500, 3000], // feedback duration for correct and incorrect trials, respectively
  waitDur: 1000,
  iti: 500,
  fixPos: [CANVAS_SIZE[0] / 2, CANVAS_SIZE[1] * 0.75], // x,y position of stimulus
  fixDur: 1000,
  stimPos: [CANVAS_SIZE[0] / 2, CANVAS_SIZE[1] * 0.75], // x,y position of stimulus
  startBox: [CANVAS_SIZE[0] / 2, CANVAS_SIZE[1] * 0.9, 50, 50], // xpos, ypos, xsize, ysize
  leftBox: [75, 50, 150, 100], // xpos, ypos, xsize, ysize
  rightBox: [1205, 50, 150, 100], // xpos, ypos, xsize, ysize
  leftImageAnchor: [300, 250],
  rightImageAnchor: [980, 250],
  keepFixation: false, // is fixation cross kept on screen with stimulus
  drawStartBox: [true, true, true], // draw response boxes at trial initiation, fixation cross, and response execution stages
  drawResponseBoxes: [true, true, true], // draw response boxes at trial initiation, fixation cross, and response execution stages
  drawResponseBoxesImage: [false, true, true, true], // draw response boxes at trial initiation, fixation cross, and response execution stages
  boxLineWidth: 4, // linewidth of the start/target boxes
  requireMousePressStart: true, // is mouse button press inside start box required to initiate trial?
  requireMousePressFinish: false, // is mouse button press inside response box required to end trial?
  stimFont: '50px arial',
  fbTxt: ['Richtig', 'Falsch'],
  fbFont: '40px Arial',
  cTrl: 1, // count trials
  cBlk: 1, // count blocks
};

// 2 counter balanced versions
const version = 2; // Number(jsPsych.data.urlVariables().version);
jsPsych.data.addProperties({ version: version });

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const WELCOME_INSTRUCTIONS = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: generate_formatted_html({
    text: `Willkommen zu unserem Experiment:<br><br>
           Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.
           Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und genügend Zeit hast,
           um das Experiment durchzuführen. Wir bitten dich die ca. nächsten 15 Minuten konzentriert zu arbeiten.<br><br>
           Drücke eine beliebige Taste, um fortzufahren`,
    align: 'left',
    fontsize: 30,
    width: '1200px',
    bold: true,
    lineheight: 1.5,
  }),
};

const MOUSE_INSTRUCTIONS = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: generate_formatted_html( {
text: `BITTE NUR TEILNEHMEN, WENN EINE COMPUTERMAUS ZUR VERFÜGUNG STEHT! <br><br>
    In diesem Experiment sehen Sie in jedem Durchgang drei Quadrate und zwei Bilder. 
    Um den Durchgang zu starten, klicken Sie auf das Quadrat unten in der Mitte. 
    Danach erscheint ein Wort auf dem Bildschirm.<br><br>
    Ihre Aufgabe ist es, das Bild auszuwählen, das am besten zu dem Wort passt oder mit ihm in  
    Zusammenhang steht, und den Mauszeiger in das zugehörige Quadrat zu bewegen.  
    Bitte reagieren Sie so schnell und korrekt wie möglich.<br><br>
    Drücken Sie eine beliebige Taste, um fortzufahren!`, 
    align: 'left',
    fontsize: 30,
    width: '1200px',
    bold: true,
    lineheight: 1.5,
  }),
 post_trial_gap: PRMS.waitDur,
};


const exp_start = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus:
    "<H1 style = 'text-align: center;'> Jetzt beginnt das eigentliche Experiment </H1>" +
    "<H3 style = 'text-align: left;'> Sie erhalten ab sofort kein Feedback mehr. </H3>" +
    "<H3 style = 'text-align: left;'> Ansonsten ist der Ablauf der gleiche wie in den Übungsdurchgängen gerade eben. </H3>" +
    "<H3 style = 'text-align: left;'> Zur Erinnerung:   </H3>" +
    "<H3 style = 'text-align: left;'> 1. Quadrat unten in der Mitte anklicken </H3>" +
    "<H3 style = 'text-align: left;'> 2. Mauszeiger in das Quadrat bewegen, dessen Bild am besten zu dem Wort passt/mit ihm zusammenhängt  </H3>" +
    "<H3 style = 'text-align: left;'> Bitte reagieren Sie so schnell und korrekt wie möglich!  </H3>" +
    "<H3 style = 'text-align: left;'> Drücken Sie eine beliebige Taste um fortzufahren!  </H3>",
  post_trial_gap: PRMS.waitDur,
  on_start: function () {
    PRMS.cBlk += 1;
    PRMS.cTrl = 1;
  },
};



const TASK_INSTRUCTIONS_LANGUAGE = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: generate_formatted_html({
    text: `Respond to the meaning of the text!<br><br>
"jetzt spielzeug" &emsp;oder&emsp; "nicht tiere" &emsp;&emsp;&emsp; "jetzt tiere" &emsp;oder&emsp; "nicht spielzeug"<br>
Drücke eine beliebige Taste, um fortzufahren`,
    align: 'center',
    fontsize: 30,
    width: '1200px',
    bold: true,
    lineheight: 1.5,
  }),
};

const TASK_INSTRUCTIONS_SYMBOLIC = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: generate_formatted_html({
    text: `Respond to the meaning of the text!<br><br>
"<span style="color:green";">\u2714</span> spielzeug" &emsp;oder&emsp; "<span style="color:red";">\u2718</span> tiere" &emsp;&emsp;&emsp; "<span style="color:green";">\u2714</span> tiere" &emsp;oder&emsp; "<span style="color:red";">\u2718</span> spielzeug"<br>
Drücke eine beliebige Taste, um fortzufahren`,
    align: 'center',
    fontsize: 30,
    width: '1200px',
    bold: true,
    lineheight: 1.5,
  }),
};

////////////////////////////////////////////////////////////////////////
//                     Experiment Utilities                           //
////////////////////////////////////////////////////////////////////////
function drawFeedback() {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  let dat = jsPsych.data.get().last(1).values()[0];
  ctx.font = '40px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';

  let xpos;
  let ypos;
  if (dat.end_loc === 'left') {
    xpos = PRMS.leftBox[0] + 25;
    ypos = PRMS.leftBox[1];
  } else if (dat.end_loc === 'right') {
    xpos = PRMS.rightBox[0] - 25;
    ypos = PRMS.rightBox[1];
  } else {
    // Fallback to mouse coords
    xpos = dat.end_x;
    ypos = dat.end_y;
  }
  if (dat.errorCode === 2) {
    ctx.fillText('Warte in dem Quadrat bis das Wort kommt!', CANVAS_SIZE[0] / 2, CANVAS_SIZE[1] / 2);
  } else {
    ctx.fillText(PRMS.fbTxt[dat.errorCode], xpos, ypos);
  }
}

function codeTrial() {
  'use strict';
  let dat = jsPsych.data.get().last(1).values()[0];
  let errorCode;
  errorCode = dat.correct_side !== dat.end_loc ? 1 : 0;
  errorCode = dat.time[0] < PRMS.fixDur ? 2 : errorCode;
  jsPsych.data.addDataToLastTrial({
    date: Date(),
    errorCode: errorCode,
    blockNum: PRMS.cBlk,
    trialNum: PRMS.cTrl,
  });
  PRMS.cTrl += 1;
}

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////
//               Stimuli/Timelines                                    //
////////////////////////////////////////////////////////////////////////

function stimuli_factory(items_toys, items_animals, type) {
  let stimuli = [];
  for (let i = 0; i < 48; i++) {
    let stimulus = {};
    if (i < 6) {
      // toy left, animal right, now toy
      stimulus.left = items_toys.images[i];
      stimulus.right = items_animals.images[i];
      stimulus.probe = type == 'Language' ? 'jetzt Spielzeug' : 'jetzt Spielzeug';
      stimulus.correct_side = 'left';
    } else if (i < 12) {
      // toy left, animal right, now animal
      stimulus.left = items_toys.images[i];
      stimulus.right = items_animals.images[i];
      stimulus.probe = type == 'Language' ? 'jetzt Tiere' : 'jetzt Tiere';
      stimulus.correct_side = 'right';
    } else if (i < 18) {
      // toy left, animal right, not toy
      stimulus.left = items_toys.images[i];
      stimulus.right = items_animals.images[i];
      stimulus.probe = type == 'Language' ? 'nicht Spielzeug' : 'nicht Spielzeug';
      stimulus.correct_side = 'right';
    } else if (i < 24) {
      // toy left, animal right, now animal
      stimulus.left = items_toys.images[i];
      stimulus.right = items_animals.images[i];
      stimulus.probe = type == 'Language' ? 'nicht Tiere' : 'nicht Tiere';
      stimulus.correct_side = 'left';
    } else if (i < 30) {
      // animal left, toy right, now toy
      stimulus.left = items_animals.images[i];
      stimulus.right = items_toys.images[i];
      stimulus.probe = type == 'Language' ? 'jetzt Spielzeug' : 'jetzt Spielzeug';
      stimulus.correct_side = 'right';
    } else if (i < 36) {
      // animal left, toy right, now animal
      stimulus.left = items_animals.images[i];
      stimulus.right = items_toys.images[i];
      stimulus.probe = type == 'Language' ? 'jetzt Tiere' : 'jetzt Tiere';
      stimulus.correct_side = 'left';
    } else if (i < 42) {
      // animal left, toy right, not toy
      stimulus.left = items_animals.images[i];
      stimulus.right = items_toys.images[i];
      stimulus.probe = type == 'Language' ? 'nicht Spielzeug' : 'nicht Spielzeug';
      stimulus.correct_side = 'left';
    } else if (i < 48) {
      // animal left, toy right, now animal
      stimulus.left = items_animals.images[i];
      stimulus.right = items_toys.images[i];
      stimulus.probe = type == 'Language' ? 'nicht Tiere' : 'nicht Tiere';
      stimulus.correct_side = 'right';
    }
    stimuli.push(stimulus);
  }
  stimuli = shuffle(stimuli);

  return stimuli;
}

// images
function image_array(x) {
  'use strict';
  let images = [];
  for (let i = 0; i < x.length; i++) {
    images.push(x[i].image_path);
  }
  return images;
}

const TOY_IMAGES = {
  type: 'preload',
  auto_preload: true,
  images: image_array(shuffle(TOY_IMAGE_LIST)),
};

const ANIMAL_IMAGES = {
  type: 'preload',
  auto_preload: true,
  images: image_array(shuffle(ANIMAL_IMAGE_LIST)),
};


const TRIAL_STIMULUS = {
  type: jsPsychMouseImageResponse2steps,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  fixation_duration: PRMS.fixDur,
  fixation_position: PRMS.fixPos,
  stimulus: jsPsych.timelineVariable('probe'),
  stimulus_position: PRMS.stimPos,
  stimulus_colour: 'black',
  stimulus_font: PRMS.stimFont,
  start_box: PRMS.startBox,
  left_box: PRMS.leftBox,
  right_box: PRMS.rightBox,
  left_box_colour: 'gray',
  right_box_colour: 'gray',
  left_image: jsPsych.timelineVariable('left'),
  right_image: jsPsych.timelineVariable('right'),
  left_image_anchor: PRMS.leftImageAnchor,
  right_image_anchor: PRMS.rightImageAnchor,
  keep_fixation: PRMS.keepFixation,
  draw_start_box: PRMS.drawStartBox,
  draw_response_boxes: PRMS.drawResponseBoxes,
  draw_response_boxes_image: PRMS.drawResponseBoxesImage,
  box_linewidth: PRMS.boxLineWidth,
  require_mouse_press_start: PRMS.requireMousePressStart,
  require_mouse_press_finish: PRMS.requireMousePressFinish,
  data: {
    stim_type: 'cse_mouse_tracking',
    probe: jsPsych.timelineVariable('probe'),
    probe_type: jsPsych.timelineVariable('probe_type'),
    left: jsPsych.timelineVariable('left'),
    right: jsPsych.timelineVariable('right'),
    correct_side: jsPsych.timelineVariable('correct_side'),
  },
  on_finish: function () {
    codeTrial();
  },
};

const TRIAL_FEEDBACK = {
  type: jsPsychStaticCanvasKeyboardResponse,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  trial_duration: null,
  translate_origin: false,
  func: drawFeedback,
  on_start: function (trial) {
    let dat = jsPsych.data.get().last(1).values()[0];
    trial.trial_duration = PRMS.fbDur[dat.errorCode];
  }
};

const BLOCK_FEEDBACK = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: '',
  response_ends_trial: true,
  on_start: function (trial) {
    let block_dvs = calculateBlockPerformance({
      filter_options: { stim: 'affneg', blockNum: PRMS.cBlk },
      corrColumn: 'error',
      corrValue: 0,
    });
    let text = blockFeedbackText(PRMS.cBlk, PRMS.nBlks, block_dvs.meanRt, block_dvs.errorRate, (language = 'de'));
    trial.stimulus = `<div style="font-size:${PRMS.fbTxtSizeBlock}px;">${text}</div>`;
  },
  on_finish: function () {
    PRMS.cTrl = 1;
    PRMS.cBlk += 1;
  },
};

const WAIT = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: '',
  response_ends_trial: false,
  trial_duration: PRMS.waitDur,
};

const ITI = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: '',
  response_ends_trial: false,
  trial_duration: PRMS.iti,
};

const TRIAL_TIMELINE = {
  timeline: [TRIAL_STIMULUS, TRIAL_FEEDBACK, ITI],
  randomize_order: true,
};

////////////////////////////////////////////////////////////////////////
//                              Save                                  //
////////////////////////////////////////////////////////////////////////
const DIR_NAME = getDirName();
const EXP_NAME = getFileName();

function save() {
  const vpNum = getTime();
  jsPsych.data.addProperties({ vpNum: vpNum });

  const data_fn = `${DIR_NAME}data/${EXP_NAME}_${vpNum}`;
  saveData('/Common/write_data.php', data_fn, { stim: 'affneg' });
}

const SAVE_DATA = {
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

  // exp.push(fullscreen(true));
  // exp.push(browser_check(PRMS.screenRes));
  // exp.push(resize_browser());
  // exp.push(welcome_message());
  // exp.push(vpInfoForm('/Common7+/vpInfoForm_de.html'));
  // exp.push(mouseCursor(false));
//  exp.push(WELCOME_INSTRUCTIONS);
  exp.push(MOUSE_INSTRUCTIONS);
  // exp.push(WAIT);

  let blk_type;
  if (version === 1) {
    blk_type = repeatArray(['Language'], PRMS.nBlks / 2).concat(repeatArray(['Symbolic'], PRMS.nBlks / 2));
  } else if (version === 2) {
    blk_type = repeatArray(['Symbolic'], PRMS.nBlks / 2).concat(repeatArray(['Language'], PRMS.nBlks / 2));
  }

  for (let blk = 0; blk < PRMS.nBlks; blk += 1) {
    let blk_timeline;
    if (blk_type[blk] === 'Language') {
      exp.push(TASK_INSTRUCTIONS_LANGUAGE);
      exp.push(WAIT);

      blk_timeline = { ...TRIAL_TIMELINE };
      blk_timeline.sample = {
        type: 'fixed-repetitions',
        size: [0, PRMS.nBlks / 2].includes(blk) ? PRMS.nTrlsP / 1 : PRMS.nTrlsE / 1,
      };
      blk_timeline.timeline_variables = stimuli_factory(TOY_IMAGES, ANIMAL_IMAGES, 'Language');
    } else if (blk_type[blk] === 'Symbolic') {
      exp.push(TASK_INSTRUCTIONS_SYMBOLIC);
      exp.push(WAIT);

      blk_timeline = { ...TRIAL_TIMELINE };
      blk_timeline.sample = {
        type: 'fixed-repetitions',
        size: [0, PRMS.nBlks / 2].includes(blk) ? PRMS.nTrlsP / 1 : PRMS.nTrlsE / 1,
      };
      blk_timeline.timeline_variables = stimuli_factory(TOY_IMAGES, ANIMAL_IMAGES, 'Symbolic');
    }
    exp.push(blk_timeline); // trials within a block
    exp.push(BLOCK_FEEDBACK); // show previous block performance
    exp.push(WAIT);
  }

  exp.push(SAVE_DATA);

  // debrief
  exp.push(mouseCursor(true));
  exp.push(end_message());
  exp.push(fullscreen(false));

  return exp;
}
const EXP = genExpSeq();

jsPsych.run(EXP);
