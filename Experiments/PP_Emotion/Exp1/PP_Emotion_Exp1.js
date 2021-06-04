// Prioritized Processing task with face task as the backgroud task
//
// Two tasks
// 1) Primary task: colour (e.g. red, green, blue). One of the three colours (randomly
// selected across participants) indicates that the background task is to be performed.
// The two colours assigned to the primary task are randomly assigned left/right keys.
// 2) Background task: Face gender (male vs. female)
//
// Response keys: Index fingers on the Q and P keys
//
// Primary task probability 80% vs. 20%
// Secondary task probability 20% vs. 80%
//
// Basic Trial Structure
// Fixation Cross (500 ms)
// Primary Task stimulus (coloured square frame) + Secondary task (face stimulus)
// Stimuli remain on screen until response or 3000 ms
// Trial Feedback (Correct, Incorrect, Too Slow) for 1s (Correct) or 3s (Incorrect/Too Slow)
// 500 ms inter-trial-interval

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
const nFiles = getNumberOfFiles('/Common/num_files.php', dirName + 'data/');
const nVersion = getVersionNumber(nFiles, 2);
jsPsych.data.addProperties({ version: nVersion });
getComputerInfo();

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
  // Block/Trial Numbers
  nTrlsP: 40, // number of trials in practice PP block
  nTrlsE: 80, // number of trials in experimental blocks
  nBlks: 10, // total number of blocks

  // Timing
  too_slow: 3000,
  too_fast: 0,
  iti: 500,
  fb_duration: [500, 2000, 2000, 2000], // Duration of feedback

  // Fixation Cross
  fix_duration: 500,
  fix_size: 15,
  fix_linewidth: 4,

  // Stimuli
  colours: shuffle(['red', 'green', 'blue']),
  gender: shuffle(['Männlich', 'Weiblich']),
  rect_size: [150, 200],
  rect_linewidth: 10,
  stim_size: 'bold 80px monospace',
  fb_size: '30px monospace',
  fb_text: ['Richtig', 'Falsch', 'Zu langsam', 'Zu schnell'],

  // Response Keys
  resp_keys: ['q', 'p'],

  // Block/Trial Counters
  cTrl: 1,
  cBlk: 1,
};

// response keys for colour task
const de = { red: 'Rot', green: 'Grün', blue: 'Blau' };

// response keys for PP task
// prettier-ignore
let resp_text_pp = `1. Priorität: Farbaufgabe <br><br><span style="color: ${prms.colours[0]}">${ de[prms.colours[0]]}</span> &emsp;&emsp; <span style="color: ${prms.colours[1]}">${ de[prms.colours[1]] }</span><br>
                   (Q-Taste) &emsp;&emsp; (P-Taste) <br><br>
                   Wenn Farbe <span style="color: ${prms.colours[2]}">${de[prms.colours[2]]}</span><br><br>
                    2. Priorität: Geschlectaufgabe<br><br>
                   ${prms.gender[0]} &emsp;&emsp;&emsp;&emsp;&emsp;&emsp; ${prms.gender[1]}<br>
                   (Q-Taste) &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;(P-Taste) `;

// prettier-ignore
function resp_text_pp_block() {
  return (`Block ${prms.cBlk} von ${prms.nBlks_total}<br><br>
             1. Priorität: Farbaufgabe <br><br><span style="color: ${prms.colours[0]}">${ de[prms.colours[0]]}</span> &emsp;&emsp; <span style="color: ${prms.colours[1]}">${ de[prms.colours[1]] }</span><br>
            (Q-Taste) &emsp;&emsp; (P-Taste) <br><br>
            Wenn Farbe <span style="color: ${prms.colours[2]}">${de[prms.colours[2]]}</span><br>
             2. Priorität: Geschlectaufgabe<br><br>
            ${prms.gender[0]} &emsp;&emsp;&emsp;&emsp;&emsp;&emsp; ${prms.gender[1]}<br>
            (Q-Taste) &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;(P-Taste) `);
}

//////////////////////////////////////////////////////////////////////////
////                      Experiment Instructions                       //
//////////////////////////////////////////////////////////////////////////
const task_instructions1 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: generate_formatted_html({
    text: `Willkommen bei unserem Experiment:<br><br>
    Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.
    Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und
    genügend Zeit hast, um das Experiment durchzuführen.
    Wir bitten dich die ca. 45 Minuten konzentriert zu arbeiten.<br><br>
    Drücke eine beliebige Taste, um fortzufahren!`,
    fontsize: 26,
    align: 'left',
    lineheight: 1.5,
  }),
};

const task_instructions2 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: generate_formatted_html({
    text: `Du erhaelst den Code für die Versuchspersonenstunden und weitere Anweisungen
    am Ende des Experimentes. Bei Fragen oder Problemen wende dich bitte an:<br><br>
    hiwipibio@gmail.com<br><br>
    Drücke eine beliebige Taste, um fortzufahren!`,
    fontsize: 26,
    align: 'left',
    lineheight: 1.5,
  }),
};

const task_instructions3 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: generate_formatted_html({
    text: `In diesem Experiment gibt es insgesamt zwei verschiedene Aufgaben.
Du musst auf die Farben eines Quadrates (= Farbaufgabe), oder auf Gesichter <br>(= Geschlectaufgabe) reagieren. <br><br>
WICHTIG! Benutze hierfür die Q-Taste mit deinem linken Zeigefinger und die P-Taste mit dem rechten Zeigefinger.<br><br>
Drücke eine beliebige Taste um fortzufahren.`,
    fontsize: 26,
    align: 'left',
    lineheight: 1.5,
  }),
};

const task_instructions_pp1 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: generate_formatted_html({
    text: `Du musst nur auf eine der zwei Aufgaben reagieren. <br>
           Die erste Priorität ist die Farbe des Quadrates.<br>
           Die zweite Priorität ist die Geschlectaufgabe. Du musst NUR auf den Gesichter reagieren, wenn die Farbaufgabe keine Antwort verlangt.<br><br>
           Drücke eine beliebige Taste, um fortzufahren!`,
    fontsize: 26,
    align: 'left',
    lineheight: 1.5,
  }),
};

const task_instructions_pp2 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus:
    generate_formatted_html({
      text: resp_text_pp,
      fontsize: 26,
      align: 'center',
    }) +
    generate_formatted_html({
      text: `Drücke eine beliebige Taste, um fortzufahren.`,
      fontsize: 26,
      align: 'center',
    }),
};

const task_instructions_pp_reminder = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: '',
  on_start: function (trial) {
    trial.stimulus =
      generate_formatted_html({
        text: resp_text_pp_block(),
        fontsize: 26,
        align: 'center',
      }) +
      generate_formatted_html({
        text: `Drücke eine beliebige Taste, um fortzufahren.`,
        fontsize: 26,
        align: 'center',
      });
  },
};

////////////////////////////////////////////////////////////////////////
//                               Images                               //
////////////////////////////////////////////////////////////////////////
const female_fear_files = [
  '../images/female_fear/AF09AFS.JPG',
  '../images/female_fear/AF14AFS.JPG',
  '../images/female_fear/AF16AFS.JPG',
  '../images/female_fear/AF22AFS.JPG',
  '../images/female_fear/AF28AFS.JPG',
  '../images/female_fear/AF30AFS.JPG',
  '../images/female_fear/AF31AFS.JPG',
  '../images/female_fear/AF33AFS.JPG',
];
const female_fear_images = loadImages(female_fear_files);

const female_neutral_files = [
  '../images/female_neutral/AF09NES.JPG',
  '../images/female_neutral/AF16NES.JPG',
  '../images/female_neutral/AF28NES.JPG',
  '../images/female_neutral/AF31NES.JPG',
  '../images/female_neutral/AF14NES.JPG',
  '../images/female_neutral/AF22NES.JPG',
  '../images/female_neutral/AF30NES.JPG',
  '../images/female_neutral/AF33NES.JPG',
];
const female_neutral_images = loadImages(female_neutral_files);

const male_fear_files = [
  '../images/male_fear/AM04AFS.JPG',
  '../images/male_fear/AM10AFS.JPG',
  '../images/male_fear/AM11AFS.JPG',
  '../images/male_fear/AM14AFS.JPG',
  '../images/male_fear/AM17AFS.JPG',
  '../images/male_fear/AM22AFS.JPG',
  '../images/male_fear/AM25AFS.JPG',
  '../images/male_fear/AM35AFS.JPG',
];
const male_fear_images = loadImages(male_fear_files);

const male_neutral_files = [
  '../images/male_neutral/AM04NES.JPG',
  '../images/male_neutral/AM10NES.JPG',
  '../images/male_neutral/AM11NES.JPG',
  '../images/male_neutral/AM14NES.JPG',
  '../images/male_neutral/AM17NES.JPG',
  '../images/male_neutral/AM22NES.JPG',
  '../images/male_neutral/AM25NES.JPG',
  '../images/male_neutral/AM35NES.JPG',
];
const male_neutral_images = loadImages(male_neutral_files);

////////////////////////////////////////////////////////////////////////
//                  Common Stimuli/Functions                          //
////////////////////////////////////////////////////////////////////////
function draw_fixation_cross() {
  let ctx = document.getElementById('canvas').getContext('2d');
  ctx.lineWidth = prms.fix_linewidth;
  ctx.moveTo(-prms.fix_size, 0);
  ctx.lineTo(prms.fix_size, 0);
  ctx.stroke();
  ctx.moveTo(0, -prms.fix_size);
  ctx.lineTo(0, prms.fix_size);
  ctx.stroke();
}

const fixation_cross = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  trial_duration: prms.fix_duration,
  translate_origin: true,
  response_ends_trial: false,
  func: draw_fixation_cross,
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

function code_trial() {
  'use strict';

  let dat = jsPsych.data.get().last(1).values()[0];
  let corrCode = 0;

  dat.rt = dat.rt !== null ? dat.rt : prms.too_slow;

  if (dat.key_press !== null) {
    let correctKey = jsPsych.pluginAPI.compareKeys(dat.key_press, dat.corr_key);
    if (correctKey && dat.rt < prms.too_slow) {
      corrCode = 1; // correct
    } else if (!correctKey && dat.rt < prms.too_slow) {
      corrCode = 2; // choice-error
    } else if (dat.rt < prms.too_fast) {
      corrCode = 4; // too-fast
    }
  } else {
    corrCode = 3; // too-slow
  }

  jsPsych.data.addDataToLastTrial({
    date: Date(),
    corrCode: corrCode,
    blockNum: prms.cBlk,
    trialNum: prms.cTrl,
  });
  prms.cTrl += 1;
}

function block_feedback_text(filter_options) {
  'use strict';
  let dat = jsPsych.data.get().filter({ ...filter_options, blockNum: prms.cBlk });
  let nTotal = dat.count();
  let nError = dat.select('corrCode').values.filter(function (x) {
    return (x !== 1) & (x !== 4);
  }).length;
  dat = jsPsych.data.get().filter({ ...filter_options, blockNum: prms.cBlk, corrCode: 1 });

  let txt = `Block: ${prms.cBlk} von ${prms.nBlks} <br>
    Mittlere Reaktionzeit: ${Math.round(dat.select('rt').mean())} ms <br>
    Fehlerrate: ${Math.round((nError / nTotal) * 100)} % <br><br>
    Drücke eine beliebige Taste, um fortzufahren!`;

  let fb_txt = generate_formatted_html({ text: txt, fontsize: 30 });

  prms.cBlk += 1;
  prms.cTrl = 1;
  return fb_txt;
}

const block_feedback = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: '',
  response_ends_trial: true,
  on_start: function (trial) {
    trial.stimulus = block_feedback_text({ stim_type: 'ppemo' });
  },
};

////////////////////////////////////////////////////////////////////////
//                          Experiment Phase                          //
////////////////////////////////////////////////////////////////////////
// prettier-ignore
const stimuli_primary = [
    { response_task: 'primary', colour: prms.colours[0], face_gender: prms.gender[0], face_emotion: "neutral", corr_key: prms.resp_keys[0], backward_comp: "comp"},
    { response_task: 'primary', colour: prms.colours[1], face_gender: prms.gender[0], face_emotion: "neutral", corr_key: prms.resp_keys[1], backward_comp: "incomp"},
    { response_task: 'primary', colour: prms.colours[0], face_gender: prms.gender[1], face_emotion: "neutral", corr_key: prms.resp_keys[0], backward_comp: "incomp"},
    { response_task: 'primary', colour: prms.colours[1], face_gender: prms.gender[1], face_emotion: "neutral", corr_key: prms.resp_keys[1], backward_comp: "comp"},
    { response_task: 'primary', colour: prms.colours[0], face_gender: prms.gender[0], face_emotion: "fear",    corr_key: prms.resp_keys[0], backward_comp: "comp"},
    { response_task: 'primary', colour: prms.colours[1], face_gender: prms.gender[0], face_emotion: "fear",    corr_key: prms.resp_keys[1], backward_comp: "incomp"},
    { response_task: 'primary', colour: prms.colours[0], face_gender: prms.gender[1], face_emotion: "fear",    corr_key: prms.resp_keys[0], backward_comp: "icomp"},
    { response_task: 'primary', colour: prms.colours[1], face_gender: prms.gender[1], face_emotion: "fear",    corr_key: prms.resp_keys[1], backward_comp: "comp"},
];

// prettier-ignore
const stimuli_background = [
    { response_task: 'background', colour: prms.colours[2], face_gender: prms.gender[0], face_emotion: "neutral", corr_key: prms.resp_keys[0], backward_comp: "na"},
    { response_task: 'background', colour: prms.colours[2], face_gender: prms.gender[1], face_emotion: "neutral", corr_key: prms.resp_keys[1], backward_comp: "na"},
    { response_task: 'background', colour: prms.colours[2], face_gender: prms.gender[0], face_emotion: "fear",    corr_key: prms.resp_keys[0], backward_comp: "na"},
    { response_task: 'background', colour: prms.colours[2], face_gender: prms.gender[1], face_emotion: "fear",    corr_key: prms.resp_keys[1], backward_comp: "na"},
];

const stimuli_high_primary = deepCopy(repeatArray(stimuli_primary, 4).concat(repeatArray(stimuli_background, 2)));
stimuli_high_primary.forEach((i) => (i.prob_cond = 'HP'));
// console.log(stimuli_high_primary);

const stimuli_low_primary = deepCopy(repeatArray(stimuli_primary, 1).concat(repeatArray(stimuli_background, 8)));
stimuli_low_primary.forEach((i) => (i.prob_cond = 'LP'));
// console.log(stimuli_low_primary);

function draw_pp(args) {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');

  // draw image
  const size = 4;
  const width = args.image.width;
  const height = args.image.height;
  ctx.drawImage(args.image, -width / size / 2, -height / size / 2, width / size, height / size);

  // Square frame
  ctx.beginPath();
  ctx.lineWidth = prms.rect_linewidth;
  ctx.strokeStyle = args.colour;
  ctx.rect(-prms.rect_size[0] / 2, -prms.rect_size[1] / 2, prms.rect_size[0], prms.rect_size[1]);
  ctx.stroke();
}

function draw_feedback_pp() {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  let dat = jsPsych.data.get().last(1).values()[0];
  ctx.font = prms.fb_size;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';
  if (dat.corrCode === 1) {
    ctx.fillText(prms.fb_text[dat.corrCode - 1], 0, 0);
  } else {
    ctx.font = 'bold 30px monospace';
    ctx.fillText(prms.fb_text[dat.corrCode - 1], 0, -150);
    ctx.font = '30px monospace';
    ctx.fillText('1. Priorität: Farbaufgabe', 0, -80);
    ctx.fillStyle = prms.colours[0];
    ctx.fillText(de[prms.colours[0]], -160, -35);
    ctx.fillStyle = prms.colours[1];
    ctx.fillText(de[prms.colours[1]], 190, -30);
    ctx.fillStyle = 'black';
    ctx.fillText('Wenn Farbe     ', 0, 40);
    ctx.fillText('2. Priorität: Geschlectaufgabe', 0, 90);
    ctx.fillStyle = prms.colours[2];
    ctx.fillText(de[prms.colours[2]], 90, 40);
    ctx.fillStyle = 'black';
    ctx.fillText(`${prms.gender[0]}       ${prms.gender[1]}`, 0, 130);
    ctx.font = '20px monospace';
    ctx.fillText('(Q-Taste)', -150, -10);
    ctx.fillText('(Q-Taste)', -150, 210);
    ctx.fillText('(P-Taste)', 200, -10);
    ctx.fillText('(P-Taste)', 200, 210);
  }
}

const trial_feedback_pp = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  translate_origin: true,
  response_ends_trial: false,
  func: draw_feedback_pp,
  on_start: function (trial) {
    let dat = jsPsych.data.get().last(1).values()[0];
    trial.trial_duration = prms.fb_duration[dat.corrCode - 1];
  },
};

const trial_pp = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  translate_origin: true,
  stimulus_onset: [0, jsPsych.timelineVariable('soa')],
  response_ends_trial: true,
  choices: prms.resp_keys,
  trial_duration: prms.too_slow,
  func: [draw_pp],
  func_args: null,
  data: {
    stim_type: 'ppemo',
    response_task: jsPsych.timelineVariable('response_task'),
    colour: jsPsych.timelineVariable('colour'),
    face_gender: jsPsych.timelineVariable('face_gender'),
    face_emotion: jsPsych.timelineVariable('face_emotion'),
    image: null,
    corr_key: jsPsych.timelineVariable('corr_key'),
    backward_comp: jsPsych.timelineVariable('backward_comp'),
    prob_cond: jsPsych.timelineVariable('prob_cond'),
  },
  on_start: function (trial) {
    let randomInt = getRandomInt(0, 7);
    if (trial.data.face_gender === 'Männlich' && trial.data.face_emotion === 'neutral') {
      trial.data.image = male_neutral_images[randomInt];
    } else if (trial.data.face_gender === 'Männlich' && trial.data.face_emotion === 'fear') {
      trial.data.image = male_fear_images[randomInt];
    } else if (trial.data.face_gender === 'Weiblich' && trial.data.face_emotion === 'neutral') {
      trial.data.image = female_neutral_images[randomInt];
    } else if (trial.data.face_gender === 'Weiblich' && trial.data.face_emotion === 'fear') {
      trial.data.image = female_fear_images[randomInt];
    }
    trial.func_args = [{ colour: trial.data.colour, image: trial.data.image }];
  },
  on_finish: function () {
    code_trial();
  },
};

const trial_timeline_high_primary_practice = {
  timeline: [iti, fixation_cross, trial_pp, trial_feedback_pp],
  timeline_variables: stimuli_high_primary,
  sample: {
    type: 'fixed-repetitions',
    size: prms.nTrlsP / stimuli_high_primary.length,
  },
};
// console.log(trial_timeline_high_primary_practice);

const trial_timeline_low_primary_practice = {
  timeline: [iti, fixation_cross, trial_pp, trial_feedback_pp],
  timeline_variables: stimuli_low_primary,
  sample: {
    type: 'fixed-repetitions',
    size: prms.nTrlsP / stimuli_low_primary.length,
  },
};
// console.log(trial_timeline_low_primary_practice);

const trial_timeline_high_primary_exp = {
  timeline: [iti, fixation_cross, trial_pp, trial_feedback_pp],
  timeline_variables: stimuli_high_primary,
  sample: {
    type: 'fixed-repetitions',
    size: prms.nTrlsE / stimuli_high_primary.length,
  },
};
// console.log(trial_timeline_high_primary_exp);

const trial_timeline_low_primary_exp = {
  timeline: [iti, fixation_cross, trial_pp, trial_feedback_pp],
  timeline_variables: stimuli_low_primary,
  sample: {
    type: 'fixed-repetitions',
    size: prms.nTrlsE / stimuli_low_primary.length,
  },
};
// console.log(trial_timeline_low_primary_exp);

////////////////////////////////////////////////////////////////////////
//                              De-brief                              //
////////////////////////////////////////////////////////////////////////
// For VP Stunden
const randomString = generateRandomStringWithExpName('ppemo', 16);

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
};

////////////////////////////////////////////////////////////////////////
//                                Save                                //
////////////////////////////////////////////////////////////////////////
const save_data = {
  type: 'call-function',
  func: function () {
    let data_filename = dirName + 'data/' + expName + '_' + vpNum;
    saveData('/Common/write_data.php', data_filename, { stim_type: 'pp2bt' });
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
  exp.push(welcome_de_du);
  exp.push(resize_de_du);
  // exp.push(vpInfoForm);
  exp.push(hideMouseCursor);
  exp.push(screenInfo);

  exp.push(task_instructions1);
  exp.push(task_instructions2);
  exp.push(task_instructions3);

  // In experiment phase, low vs. high probability is split across half with order counterbalanced across participants
  // The first block or trials in each probability level is a practice block with fewer trials
  exp.push(task_instructions_pp1);
  exp.push(task_instructions_pp2);

  let hplp_type;
  let pe_type = ['P']
    .concat(repeatArray('E', prms.nBlks / 2 - 1))
    .concat('P')
    .concat(repeatArray('E', prms.nBlks / 2 - 1));
  if (nVersion === 1) {
    hplp_type = repeatArray('HP', prms.nBlks / 2).concat(repeatArray('LP', prms.nBlks / 2));
  } else if (nVersion === 2) {
    hplp_type = repeatArray('LP', prms.nBlks / 2).concat(repeatArray('HP', prms.nBlks / 2));
  }

  for (let blk = 0; blk < hplp_type.length; blk++) {
    if (blk > 0) {
      exp.push(task_instructions_pp_reminder);
    }
    if (hplp_type[blk] === 'HP') {
      if (pe_type[blk] === 'P') {
        exp.push(trial_timeline_high_primary_practice);
      } else if (pe_type[blk] === 'E') {
        exp.push(trial_timeline_high_primary_exp);
      }
    } else if (hplp_type[blk] === 'LP') {
      if (pe_type[blk] === 'P') {
        exp.push(trial_timeline_low_primary_practice);
      } else if (pe_type[blk] === 'E') {
        exp.push(trial_timeline_low_primary_exp);
      }
    }
    exp.push(block_feedback);
  }

  // save data
  exp.push(save_data);
  exp.push(save_interaction_data);
  exp.push(save_code);

  // debrief
  exp.push(showMouseCursor);
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
