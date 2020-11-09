// JavaScript (jsPsych) version using word-by-word presentation of items within:
// Recovery from misinterpretations during online sentence processing
// Lena M Blott, Jennifer M Rodd, Fernanda Ferreira, and Jane E Warren
//
// Experiment Overview:
// Materials consist of sentnces (garden-path) where an ambiguous
// word was disambiguated towards an unexpected meaning. For example,
// consider the following sentences:
//
// Coherent Unambiguous	 The man knew that one more (spurt) was enough to win the game of (tennis) against his rival.
// Coherent Ambiguous	 The man knew that one more (ace)   was enough to win the game of (tennis) against his rival.
//
// Experiment is split into three main phases
// Phase 1: Garden-path word-by-word presentation
// Phase 2: Stroop task
// Phase 3: Short Old/New recall test

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
const prmsWordByWord = {
  iti: 500,
  resp_key: ['Space'],
  mask_type: 2, // select 1 vs. 2
  font_size: '20px monospace',
  sentence_width: 1250,
  cTrl: 1, // count trials
};

const prmsStroop = {
  iti: 500,
  key_mapping: shuffle([1, 2])[0],
  font_size: '30px monospace',
  resp_keys: [],
  fbTxt: ['Correct', 'Incorrect'], // provide feedback during short practice block
  fbDur: [750, 750], // Only during practice block
  cBlk: 1, // count blocks
  cTrl: 1, // count trials
};

const prmsRecall = {
  iti: 500,
  resp_keys: ['Q', 'P'],
  font_size: '20px monospace',
  fbTxt: ['Correct', 'Incorrect'],
  fbDur: [750, 750], // make "Incorrect" feedback v. long to encourage proper decision
  cTrl: 1, // count trials
};

////////////////////////////////////////////////////////////////////////
//                        Instructions General                        //
////////////////////////////////////////////////////////////////////////

const exp_welcome_screen = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: generate_formatted_html({
    text: `Welcome: <br><br>The following experiment consists of three phases and will take
    approximately XXX minutes to complete. Please read the instructions
    carefully! Upon completion of the experiment, you will be provided with a
    randomly generated code which you require to confirm your participation via
    the MTurk website.<br><br>Press any key to continue!`,
    fontsize: 32,
    lineheight: 1.5,
    align: 'left',
  }),
};

////////////////////////////////////////////////////////////////////////
//                 Instructions Word-by-Word Part 1                   //
////////////////////////////////////////////////////////////////////////

const wordByWord_instructionsStart1 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: generate_formatted_html({
    text: `Part 1: This section involves reading sentences for comprehension. The words in the sentence are
      presented in a word-by-word fashion by pressing the space bar to reveal each word individually.<br>
        _____ ___ _____ ___ __ <br>
        Press ___ _____ ___ __ <br>
        Press the _____ ___ __ <br> 
        Press the space ___ __ <br><br>
        Please read the sentences carefully! <br><br> Press any key to begin a practice trial.`,
    fontsize: 32,
    lineheight: 1.5,
    align: 'left',
  }),
};

const wordByWord_instructionsStart2 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: generate_formatted_html({
    text: `Part 1: Press any key to continue with the sentence trials. <br><br>
      <b>Remember: Read the items carefully!</b>`,
    fontsize: 32,
    align: 'left',
  }),
};

const wordByWord_instructionsEnd = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: generate_formatted_html({
    text: `End of Part 1: Press any key to continue with Part 2.`,
    fontsize: 32,
    align: 'left',
  }),
};

////////////////////////////////////////////////////////////////////////
//               Stimuli/Timelines Word-by-Word Part 1                //
////////////////////////////////////////////////////////////////////////

// random item selection (see item_list.js for full item list
function select_items(items, condition, selected, n) {
  'use strict';
  return items
    .filter(function (i) {
      return (i.cond === condition) & !selected.includes(i.item);
    })
    .splice(0, n);
}

function update_selected_items(items) {
  'use strict';
  for (let i = 0; i < items.length; i++) {
    selected_items_part1.push(items[i].item);
  }
}

let selected_items_part1 = [];
const items_cu = select_items(items, 'CU', [], 24);
update_selected_items(items_cu);

const items_ca = select_items(items, 'CA', selected_items_part1, 24);
update_selected_items(items_ca);

// selected_items.sort((a, b) => a - b);
// console.log(selected_items);

const items_sentences = shuffle(items_cu.concat(items_ca));
// console.log(items_part1);

const iti_wordByWord = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  trial_duration: prmsWordByWord.iti,
  response_ends_trial: false,
  func: function () {},
};

const trial_moving_window_text = {
  type: 'text-moving-window-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  mask_type: jsPsych.timelineVariable('mask_type'),
  sentence: jsPsych.timelineVariable('sent'),
  word_number: jsPsych.timelineVariable('word_num'),
  font: prmsWordByWord.font_size,
  max_width: prmsWordByWord.sentence_width,
  text_align: 'center',
  choices: prmsWordByWord.resp_key,
  data: {
    stim: 'SentenceConflict',
    item: jsPsych.timelineVariable('item'),
    cond: jsPsych.timelineVariable('cond'),
    sent: jsPsych.timelineVariable('sent'),
    word_number: jsPsych.timelineVariable('word_num'),
    length: jsPsych.timelineVariable('length'),
  },
  on_finish: function () {
    codeTrialWordByWord();
  },
};

function codeTrialWordByWord() {
  'use strict';
  let dat = jsPsych.data.get().last(1).values()[0];
  jsPsych.data.addDataToLastTrial({ date: Date(), trialNum: prmsWordByWord.cTrlSentence });
  if (dat.word_number === dat.length - 1) {
    prmsWordByWord.cTrlSentence += 1;
  }
  if (dat.key_press === 27) {
    jsPsych.endExperiment();
  }
}

function create_timeline_variables(items) {
  const txt = items.sent.split(' ');
  let seq = [];
  for (let i = -1; i < txt.length; i++) {
    seq.push({
      item: items.item,
      cond: items.cond,
      sent: items.sent,
      word_num: i,
      length: txt.length,
      mask_type: prmsWordByWord.mask_type,
    });
  }
  return seq;
}

function create_timeline(items) {
  let timeline_items = [];
  for (let i = 0; i < items.length; i++) {
    const tmp = {
      timeline: [trial_moving_window_text],
      timeline_variables: create_timeline_variables(items[i]),
    };
    timeline_items.push(tmp);
    timeline_items.push(iti_wordByWord);
  }
  return timeline_items;
}

const exp_timeline_wordByWord_practice = { timeline: create_timeline(practice_item) };
const exp_timeline_wordByWord_experiment = { timeline: create_timeline(items_sentences) };

////////////////////////////////////////////////////////////////////////
//                        Instructions Stroop Part 2                  //
////////////////////////////////////////////////////////////////////////

let stroop_resp_mapping;
if (prmsStroop.key_mapping === 1) {
  prmsStroop.resp_keys = ['Q', 'P', 27];
  stroop_resp_mapping = `<b><span style="color:#0000FF">BLUE/GREEN</b> &#10142; Press the <b>\'Q\'</b> key (left index finger) <br>
    <b><span style="color:#008000">BLUE/GREEN</b> &#10142; Press the <b>\'P\'</b> key (right index finger)<br><br>`;
} else if (prmsStroop.key_mapping === 2) {
  prmsStroop.resp_keys = ['P', 'Q', 27];
  stroop_resp_mapping = `<b><span style="color:#008000">BLUE/GREEN</b> &#10142; Press the <b>\'Q\'</b> key (left index finger)<br> 
    <b><span style="color:#0000FF">BLUE/GREEN</b> &#10142; Press the <b>\'P\'</b> key (right index finger)<br><br>`;
}

const stroop_instructionsStart1 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: generate_formatted_html({
    text:
      `Part 2: This section involves responding to font colour. Ignore word meaning! <br><br>` +
      stroop_resp_mapping +
      `You will begin with a practice block of 8 trials. Here, individual trial feedback is provided.
      Respond as quickly and as accurately as possible.<br><br> 
      Press any key to continue!`,
    fontsize: 32,
    lineheight: 1.5,
    align: 'left',
  }),
};

const stroop_instructionsStart2 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: generate_formatted_html({
    text:
      `Part 2: Continue responding to font colour. Remember: ignore word meaning! <br><br>` +
      stroop_resp_mapping +
      `You will now perform a block of 48 trials. Here, individual trial feedback is not provided.<br><br>
      Respond as quickly and as accurately as possible.<br><br> 
      Press any key to continue!`,
    fontsize: 32,
    lineheight: 1.5,
    align: 'left',
  }),
  on_start() {
    prmsStroop.cBlkStroop += 1;
  },
};

const stroop_instructionsEnd = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: generate_formatted_html({
    text: `End of Part 2: Press any key to continue with Part 3.`,
    fontsize: 32,
    align: 'left',
  }),
};

////////////////////////////////////////////////////////////////////////
//                   Stimuli/Timelines Stroop Part 2                  //
////////////////////////////////////////////////////////////////////////

const iti_stroop = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  trial_duration: prmsStroop.iti,
  response_ends_trial: false,
  func: function () {},
};

function drawStroop(args) {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');

  // draw word
  ctx.font = prmsStroop.font_size;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = args.colour;
  ctx.fillText(args.word, 0, 0);
}

function drawStroopFeedback() {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  let dat = jsPsych.data.get().last(1).values()[0];
  ctx.font = prmsStroop.font_size;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';
  ctx.fillText(prmsStroop.fbTxt[dat.error], 0, 0);
}

function codeTrialStroop() {
  'use strict';
  let dat = jsPsych.data.get().last(1).values()[0];
  let error = dat.key_press !== jsPsych.pluginAPI.convertKeyCharacterToKeyCode(dat.corrResp) ? 1 : 0;
  // console.log('Trial Error: ', error);

  jsPsych.data.addDataToLastTrial({
    date: Date(),
    error: error,
    blockNum: prmsStroop.cBlkStroop,
    trialNum: prmsStroop.cTrlStroop,
  });
  prmsStroop.cTrlStroop += 1;
  if (dat.key_press === 27) {
    jsPsych.endExperiment();
  }
}

const trial_feedback_stroop = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  translate_origin: true,
  response_ends_trial: false,
  func: [drawStroopFeedback],
  on_start: function (trial) {
    let dat = jsPsych.data.get().last(1).values()[0];
    trial.trial_duration = prmsStroop.fbDur[dat.error];
  },
};

const stroop_stimulus = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  translate_origin: true,
  choices: prmsStroop.resp_keys,
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
    codeTrialStroop();
  },
};

const exp_timeline_stroop_practice = {
  timeline: [stroop_stimulus, trial_feedback_stroop, iti_stroop],
  timeline_variables: [
    { word: 'BLUE', colour: 'blue', comp: 'comp', corrResp: prmsStroop.resp_keys[0] },
    { word: 'BLUE', colour: 'green', comp: 'incomp', corrResp: prmsStroop.resp_keys[1] },
    { word: 'GREEN', colour: 'green', comp: 'comp', corrResp: prmsStroop.resp_keys[1] },
    { word: 'GREEN', colour: 'blue', comp: 'incomp', corrResp: prmsStroop.resp_keys[0] },
  ],
  sample: {
    type: 'fixed-repetitions',
    size: 2,
  },
};

const exp_timeline_stroop_experiment = {
  timeline: [stroop_stimulus, iti_stroop],
  timeline_variables: [
    { word: 'BLUE', colour: 'blue', comp: 'comp', corrResp: prmsStroop.resp_keys[0] },
    { word: 'BLUE', colour: 'green', comp: 'incomp', corrResp: prmsStroop.resp_keys[1] },
    { word: 'GREEN', colour: 'green', comp: 'comp', corrResp: prmsStroop.resp_keys[1] },
    { word: 'GREEN', colour: 'blue', comp: 'incomp', corrResp: prmsStroop.resp_keys[0] },
  ],
  sample: {
    type: 'fixed-repetitions',
    size: 12,
  },
};

////////////////////////////////////////////////////////////////////////
//                     Instructions Recall part 3                     //
////////////////////////////////////////////////////////////////////////

const recall_instructionsStart = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: generate_formatted_html({
    text: `Part 3: In the final phase of the experiment, you will be presentend with complete sentences.
    Your task is to indicate whether the presented sentence appeared during Part 1 of the experiment. The
    keys required to indicate your response are indicated below the sentences.<br><br>
    Press any key to continue!`,
    fontsize: 32,
    lineheight: 1.5,
    align: 'left',
  }),
};

////////////////////////////////////////////////////////////////////////
//                  Stimuli/Timelines Recall Part 3                   //
////////////////////////////////////////////////////////////////////////

function repeat_item_recall_phase(items) {
  'use strict';
  for (let i = 0; i < items.length; i++) {
    items[i].repeat = i < items.length / 2 ? true : false;
  }
}

function create_recall_items(items_org, items) {
  'use strict';
  for (let i = 0; i < items.length; i++) {
    if (items[i].repeat) {
      items[i].test_sent = items[i].sent;
      items[i].test_answer = true;
    } else {
      for (let j = 0; j < items_org.length; j++) {
        if ((items_cu[i].item === items_org[j].item) & (items_org[j].cond !== items[i].cond)) {
          items[i].test_sent = items_org[j].sent;
          items[i].answer = false;
        }
      }
    }
  }
  return items;
}

repeat_item_recall_phase(items_cu);
repeat_item_recall_phase(items_ca);

// items for third phase (Recall)
const items_cu_recall = create_recall_items(items, items_cu);
const items_ca_recall = create_recall_items(items, items_ca);
const items_recall = shuffle(items_cu_recall.concat(items_ca_recall));

const iti_recall = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  trial_duration: prmsRecall.iti,
  response_ends_trial: false,
  func: function () {},
};

function codeTrialRecall() {
  'use strict';
  let dat = jsPsych.data.get().last(1).values()[0];
  let error = 0;
  if (dat.repeat) {
    if (dat.key_press !== jsPsych.pluginAPI.convertKeyCharacterToKeyCode(prmsRecall.resp_keys[0])) {
      error = 1;
    }
  } else if (!dat.repeat) {
    if (dat.key_press !== jsPsych.pluginAPI.convertKeyCharacterToKeyCode(prmsRecall.resp_keys[1])) {
      error = 1;
    }
  }
  console.log('Trial Error: ', error);

  jsPsych.data.addDataToLastTrial({
    date: Date(),
    error: error,
    trialNum: prmsRecall.cTrlRecall,
  });
  prmsRecall.cTrlRecall += 1;
  if (dat.key_press === 27) {
    jsPsych.endExperiment();
  }
}

function drawRecallSentence(args) {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');

  // draw sentence
  ctx.font = prmsRecall.font_size;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';
  ctx.fillText(args.sent, 0, 0);

  // show keys
  ctx.font = '25px monospace';
  ctx.fillText("Old: 'Q' Key", -150, 50);
  ctx.fillText("New: 'P' Key", 150, 50);
}

function drawRecallFeedback() {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  let dat = jsPsych.data.get().last(1).values()[0];
  ctx.font = prmsRecall.font_size;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';
  ctx.fillText(prmsRecall.fbTxt[dat.error], 0, 0);
}

const trial_recall = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  translate_origin: true,
  func: [drawRecallSentence],
  choices: prmsRecall.resp_keys,
  func_args: [{ sent: jsPsych.timelineVariable('sent') }],
  data: {
    stim: 'SentenceRecall',
    item: jsPsych.timelineVariable('item'),
    cond: jsPsych.timelineVariable('cond'),
    sent: jsPsych.timelineVariable('sent'),
    repeat: jsPsych.timelineVariable('repeat'),
  },
  on_finish: function () {
    codeTrialRecall();
  },
};

const trial_feedback_recall = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  translate_origin: true,
  response_ends_trial: false,
  func: [drawRecallFeedback],
  on_start: function (trial) {
    let dat = jsPsych.data.get().last(1).values()[0];
    trial.trial_duration = prmsRecall.fbDur[dat.error];
  },
};

const exp_timeline_recall = {
  timeline: [trial_recall, trial_feedback_recall, iti_recall],
  timeline_variables: items_recall,
  sample: {
    type: 'fixed-repetitions',
    size: 12,
  },
};

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
  stimulus: generate_formatted_html({
    text:
      'This is your participation code: <br><br>' +
      '<b>' +
      randomString +
      '</b>' +
      '<br><br>Please copy the code and return to the MTurk page. <br><br>Press the spacebar to end the experiment.',
    fontsize: 32,
  }),
};

////////////////////////////////////////////////////////////////////////
//                                Save                                //
////////////////////////////////////////////////////////////////////////
const save_wordByWord = {
  type: 'call-function',
  func: function () {
    let data_filename = dirName + 'data/' + expName + '_wordByWord_' + vpNum;
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

const save_recall = {
  type: 'call-function',
  func: function () {
    let data_filename = dirName + 'data/' + expName + '_recall_' + vpNum;
    saveData('/Common/write_data.php', data_filename, { stim: 'SentenceRecall' });
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
  exp.push(vpInfoForm_en);
  exp.push(hideMouseCursor);
  exp.push(screenInfo);

  // start experiment
  exp.push(exp_welcome_screen);

  // Phase 1: word-by-word garden path sentences
  exp.push(wordByWord_instructionsStart1);
  exp.push(exp_timeline_wordByWord_practice);
  exp.push(wordByWord_instructionsStart2);
  exp.push(exp_timeline_wordByWord_experiment);
  exp.push(save_wordByWord);
  exp.push(wordByWord_instructionsEnd);

  // Phase 2: Stroop task
  exp.push(stroop_instructionsStart1);
  exp.push(exp_timeline_stroop_practice);
  exp.push(stroop_instructionsStart2);
  exp.push(exp_timeline_stroop_experiment);
  exp.push(save_stroop);
  exp.push(stroop_instructionsEnd);

  // 3rd phase (Sentence Recognition/Memory phase)
  exp.push(recall_instructionsStart);
  exp.push(exp_timeline_recall);
  exp.push(save_recall);

  // end phase
  exp.push(save_code);
  exp.push(showMouseCursor);
  exp.push(alphaNum);
  exp.push(debrief_en);
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
