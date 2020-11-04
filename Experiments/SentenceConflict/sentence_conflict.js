// JavaScript (jsPsych) version (word-by-word presentation) of:
// Recovery from misinterpretations during online sentence processing
// Lena M Blott, Jennifer M Rodd, Fernanda Ferreira, and Jane E Warren
//
// Experiment Overview:
// Materials consist of sentnces (garden-path) where an ambiguous
// word was disambiguated towards an unexpected meaning. For example,
// consider the following sentences:
//
// Coherent Unambiguous	 The man knew that one more (spurt) was enough to win the game of tennis against his rival.
// Coherent Ambiguous	 The man knew that one more (ace)   was enough to win the game of tennis against his rival.
// Anomalous Unambiguous The man knew that one more (prawn) was enough to win the game of tennis against his rival.
// Anomalous Ambiguous	 The man knew that one more (mule)  was enough to win the game of tennis against his rival.
//
// NB. Experiment uses only Coherent Unambigous (CU) and Coherent Ambiguous (CA) items

//////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                            //
//////////////////////////////////////////////////////////////////////////
const canvas_colour = 'rgba(200, 200, 200, 1)';
const canvas_size = [1280, 720];
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
  iti: 500,
  word_by_word_resp_key: ['Space'],
  word_by_word_mask_type: 1, // select 1 vs. 2
  canvas_border: canvas_border,
  font_size_sentence: '20px monospace',
  sentence_width: 1250,
  stroop_resp_keys: [],
  font_size_stroop: '30px monospace',
  stroop_mapping: shuffle([1, 2])[0],
  fbTxt: ['Correct', 'Incorrect'],
  fbDur: [1000, 1000],
  cTrlSentence: 1, // count trials
  cTrlStroop: 1, // count trials
};

////////////////////////////////////////////////////////////////////////
//                            Instructions                            //
////////////////////////////////////////////////////////////////////////
const task_instructions1 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: "<h2 style='text-align:center;'>Welcome: Press any key to continue!</h2><br>",
};

const task_instructions2 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: "<h2 style='text-align:center;'>Sentence Task Instructions Part 1: TO DO!</h2><br>",
};

const task_instructions3 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: "<h2 style='text-align:center;'>End of Part 1: Press and key to continue!</h2><br>",
};

let stroop_text_instructions;
if (prms.stroop_mapping === 1) {
  prms.stroop_resp_keys = ['Q', 'P', 27];
  stroop_text_instructions =
    "<h3 style='text-align: center;'><b>BLUE</b> Press the <b>'Q' key</b> (left index finger).</h3>" +
    "<h3 style='text-align: center;'><b>GREEN</b> Press the <b>'P' key</b> (right index finger).</h3><br>";
} else if (prms.stroop_mapping === 2) {
  prms.stroop_resp_keys = ['P', 'Q', 27];
  stroop_text_instructions =
    "<h3 style='text-align: center;'><b>GREEN</b> Press the <b>'Q' key</b> (left index finger).</h3>" +
    "<h3 style='text-align: center;'><b>BLUE</b> Press the <b>'P' key</b> (right index finger).</h3><br>";
}

const task_instructions4 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: stroop_text_instructions,
};

////////////////////////////////////////////////////////////////////////
//                         Sentence Materials                         //
////////////////////////////////////////////////////////////////////////
// See item_list.js for item list
// Item selection
function select_items(items, condition, selected, n) {
  return items
    .filter(function (i) {
      return (i.cond === condition) & !selected.includes(i.item);
    })
    .splice(0, n);
}

function update_selected_items(items) {
  for (let i = 0; i < items.length; i++) {
    selected_items.push(items[i].item);
  }
}

let selected_items = [];
const items_cu = select_items(items, 'CU', [], 24);
update_selected_items(items_cu);

const items_ca = select_items(items, 'CA', selected_items, 24);
update_selected_items(items_ca);

// selected_items.sort((a, b) => a - b);
// console.log(selected_items);

const items_final = shuffle(items_cu.concat(items_ca));
// console.log(items_final);

////////////////////////////////////////////////////////////////////////
//                        jsPsych type stimuli                        //
////////////////////////////////////////////////////////////////////////
const iti = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  trial_duration: prms.iti,
  response_ends_trial: false,
  func: function () {},
};

const moving_window_text = {
  type: 'text-moving-window-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  mask_type: jsPsych.timelineVariable('mask_type'),
  sentence: jsPsych.timelineVariable('sent'),
  word_number: jsPsych.timelineVariable('word_num'),
  font: prms.font_size_sentence,
  max_width: prms.sentence_width,
  text_align: 'center',
  choices: prms.word_by_word_resp_key,
  data: {
    stim: 'SentenceConflict',
    item: jsPsych.timelineVariable('item'),
    num: jsPsych.timelineVariable('num'),
    word: jsPsych.timelineVariable('word'),
    cond: jsPsych.timelineVariable('cond'),
    sent: jsPsych.timelineVariable('sent'),
    word_number: jsPsych.timelineVariable('word_num'),
    length: jsPsych.timelineVariable('length'),
  },
  on_finish: function () {
    let dat = jsPsych.data.get().last(1).values()[0];
    jsPsych.data.addDataToLastTrial({ date: Date(), corrCode: 1, trialNum: prms.cTrlSentence });
    if (dat.word_number === dat.length - 1) {
      prms.cTrlSentence += 1;
    }
    if (dat.key_press === 27) {
      jsPsych.endExperiment();
    }
  },
};

function drawStroop(args) {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');

  // draw word
  ctx.font = prms.font_size_stroop;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = args.colour;
  ctx.fillText(args.word, 0, 0);
}

function drawFeedback() {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  let dat = jsPsych.data.get().last(1).values()[0];
  ctx.font = prms.font_size_stroop;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';
  ctx.fillText(prms.fbTxt[dat.corrCode], 0, 0);
}

const stroop_stimulus = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  translate_origin: true,
  choices: prms.stroop_resp_keys,
  func: [drawStroop],
  func_args: [{ word: jsPsych.timelineVariable('word'), colour: jsPsych.timelineVariable('colour') }],
  data: {
    stim: 'stroop',
    word: jsPsych.timelineVariable('word'),
    colour: jsPsych.timelineVariable('colour'),
    comp: jsPsych.timelineVariable('comp'),
    corrResp: jsPsych.timelineVariable('corrResp'),
  },
  on_finish: function () {
    codeTrial();
  },
};

const trial_feedback = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  translate_origin: true,
  response_ends_trial: false,
  func: [drawFeedback],
  on_start: function (trial) {
    let dat = jsPsych.data.get().last(1).values()[0];
    trial.trial_duration = prms.fbDur[dat.corrCode];
  },
};

const trial_timeline_stroop = {
  timeline: [stroop_stimulus, trial_feedback, iti],
  timeline_variables: [
    { word: 'BLUE', colour: 'blue', comp: 'comp', corrResp: prms.stroop_resp_keys[0] },
    { word: 'BLUE', colour: 'green', comp: 'incomp', corrResp: prms.stroop_resp_keys[1] },
    { word: 'GREEN', colour: 'green', comp: 'comp', corrResp: prms.stroop_resp_keys[1] },
    { word: 'GREEN', colour: 'blue', comp: 'incomp', corrResp: prms.stroop_resp_keys[0] },
  ],
  sample: {
    type: 'fixed-repetitions',
    size: 12,
  },
};

function codeTrial() {
  'use strict';
  let dat = jsPsych.data.get().last(1).values()[0];
  let corrCode = 0;
  if (dat.key_press !== jsPsych.pluginAPI.convertKeyCharacterToKeyCode(dat.corrResp)) {
    corrCode = 1; // choice error
  }
  // console.log('Code Trial: ', corrCode);
  jsPsych.data.addDataToLastTrial({
    date: Date(),
    rt: dat.rt,
    corrCode: corrCode,
    trialNum: prms.cTrlStroop,
  });
  prms.cTrlStroop += 1;
  if (dat.key_press === 27) {
    jsPsych.endExperiment();
  }
}

////////////////////////////////////////////////////////////////////////
//                      Amazon Turk Random Code                       //
////////////////////////////////////////////////////////////////////////
const randomString = generateRandomString(16);

const alphaNum = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  response_ends_trial: true,
  choices: [32],
  stimulus:
    "<h3 style='text-align: left;'>This is your participation code:</h3>" +
    randomString +
    "<h3 style='text-align: left;'>This is your participation code:</h3>" +
    "<h3 style='text-align: left;'>Please copy the code and return to the MTurk page.</h3>" +
    "<h3 style='text-align: left;'>Press the spacebar to end the experiment.</h3>",
};

////////////////////////////////////////////////////////////////////////
//                         Timeline Sentences                         //
////////////////////////////////////////////////////////////////////////
function create_timeline_variables(items) {
  const txt = items.sent.split(' ');
  let seq = [];
  let mask_type = getRandomInt(1, 2);
  for (let i = -1; i < txt.length; i++) {
    seq.push({
      item: items.item,
      num: items.num,
      word: items.word,
      cond: items.cond,
      sent: items.sent,
      word_num: i,
      length: txt.length,
      mask_type: mask_type,
    });
  }
  return seq;
}

function create_timeline(items) {
  let timeline_items = [];
  for (let i = 0; i < items.length; i++) {
    const tmp = {
      timeline: [moving_window_text],
      timeline_variables: create_timeline_variables(items[i]),
    };
    timeline_items.push(tmp);
    timeline_items.push(iti);
  }
  return timeline_items;
}

const exp_timeline_sentences = { timeline: create_timeline(items_final) };

////////////////////////////////////////////////////////////////////////
//                                Save                                //
////////////////////////////////////////////////////////////////////////
const save_sentences = {
  type: 'call-function',
  func: function () {
    let data_filename = dirName + 'data/' + expName + '_sentences_' + vpNum;
    saveData('/Common/write_data.php', data_filename, { stim: 'SentenceConflict' });
  },
  timing_post_trial: 200,
};

const save_stroop = {
  type: 'call-function',
  func: function () {
    let data_filename = dirName + 'data/' + expName + '_stroop_' + vpNum;
    saveData('/Common/write_data.php', data_filename, { stim: 'stroop' });
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
  exp.push(welcome_en);
  exp.push(resize_en);
  // exp.push(vpInfoForm_en);
  exp.push(hideMouseCursor);
  exp.push(screenInfo);
  exp.push(task_instructions1);
  exp.push(task_instructions2);

  // 1st phase (Sentences)
  exp.push(exp_timeline_sentences);
  exp.push(save_sentences);
  exp.push(task_instructions3);

  // 2nd phase (Stroop Task)
  exp.push(task_instructions4);
  exp.push(trial_timeline_stroop);
  exp.push(save_stroop);

  // end phase
  exp.push(debrief_en);
  exp.push(save_code);
  exp.push(showMouseCursor);
  exp.push(alphaNum);
  exp.push(fullscreen_off);

  return exp;
}
EXP = genExpSeq();

jsPsych.init({
  timeline: EXP,
  fullscreen: true,
  show_progress_bar: false,
  exclusions: {
    min_width: canvas_size[0],
    min_height: canvas_size[1],
  },
});
