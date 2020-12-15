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
// Phase 1: Garden-path word-by-word presentation + Stroop items inter-mixed
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

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prmsWordByWordStroop = {
  iti: 500,
  resp_key_sentence: ['Space'],
  font_size_sentence: '30px monospace',
  fixWidth: 2,
  fixSize: 10,
  fixDur: 500,
  key_mapping_stroop: shuffle([1, 2])[0],
  font_size_stroop: '30px monospace',
  resp_keys_stroop: [],
  fbTxt: ['Correct', 'Incorrect'], // provide feedback during short practice block
  fbDur: 500,
  cBlkWordByWordStroop: 1, // count blocks
  cTrlWordByWordStroop: 1, // count trials
};

const prmsStroop = {
  fixWidth: 2,
  fixSize: 10,
  fixDur: 500,
  iti: 500,
  key_mapping: prmsWordByWordStroop.key_mapping_stroop,
  font_size: '30px monospace',
  resp_keys: [],
  fbTxt: ['Correct', 'Incorrect'], // provide feedback during short practice block
  fbDur: 500,
  cBlkStroop: 1, // count blocks
  cTrlStroop: 1, // count trials
};

const prmsRecall = {
  iti: 500,
  resp_keys: ['Q', 'P'],
  font_size: '20px monospace',
  fbTxt: ['Correct', 'Incorrect'],
  fbDur: 500,
  cTrlRecall: 1, // count trials
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
    text: `Welcome: <br><br>The following experiment consists of three parts and will take
    approximately 20-25 minutes to complete. Please read the instructions
    carefully! Upon completion of the experiment, you will be provided with a
    randomly generated code which you require to confirm your participation via
    the MTurk website.<br><br>Press any key to continue!`,
    fontsize: 32,
    lineheight: 1.5,
    align: 'left',
  }),
};

////////////////////////////////////////////////////////////////////////
//      Instructions Inter-mixed Word-byWord reading and Stroop       //
////////////////////////////////////////////////////////////////////////
let stroop_resp_mapping;
if (prmsWordByWordStroop.key_mapping_stroop === 1) {
  prmsWordByWordStroop.resp_keys_stroop = ['O', 'P', 27];
  stroop_resp_mapping = `<b><span style="color:#0000FF">xxxx</b> &#10142; Press the <b>\'O\'</b> key (right index finger) <br>
    <b><span style="color:#008000">xxxx</b> &#10142; Press the <b>\'P\'</b> key (right middle finger)<br><br>`;
} else if (prmsWordByWordStroop.key_mapping_stroop === 2) {
  prmsWordByWordStroop.resp_keys_stroop = ['P', 'O', 27];
  stroop_resp_mapping = `<b><span style="color:#008000">xxxx</b> &#10142; Press the <b>\'O\'</b> key (right index finger)<br> 
    <b><span style="color:#0000FF">xxxx</b> &#10142; Press the <b>\'P\'</b> key (right middle finger)<br><br>`;
}

const wordByWordStroop_instructionsStart1 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: generate_formatted_html({
    text:
      `Part 1: This section involves two tasks. The first task involves responding to the font color of single words. Ignore word meaning!<br><br>` +
      stroop_resp_mapping +
      `You should respond as quickly and as accurately as possible! 
      The second task involves reading sentences for comprehension. The words in the sentence are
      presented in a word-by-word fashion by pressing the space bar using your right thumb to reveal each word individually.<br>
        Please read the sentences carefully, as they are relevant later! <br><br> Press any key to begin a short block of practice trials.`,
    fontsize: 30,
    lineheight: 1.1,
    align: 'left',
  }),
};

const wordByWordStroop_instructionsStart2 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: generate_formatted_html({
    text: `Part 1: End of practice!<br><br>
      <b>Remember: Read the sentence items carefully, and respond to the font color of
      single words as quickly and as accurately as possible!</b><br><br>
      Press any key to continue!`,
    fontsize: 32,
    align: 'left',
  }),
  on_start() {
    prmsWordByWordStroop.cBlkWordByWordStroop += 1;
    prmsWordByWordStroop.cTrlWordByWordStroop = 1;
  },
};

const wordByWordStroop_instructionsEnd = {
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
//               Stimuli/Timelines Phase 1                            //
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
// console.log(items_sentences);

const iti_wordByWordStroop = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  trial_duration: prmsWordByWordStroop.iti,
  response_ends_trial: false,
  func: function () {},
};

const trial_center_text = {
  type: 'text-word-by-word-center-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  sentence: jsPsych.timelineVariable('sent'),
  word_number: jsPsych.timelineVariable('word_num'),
  font: prmsWordByWordStroop.font_size_sentence,
  choices: prmsWordByWordStroop.resp_key_sentence,
  data: {
    stim: 'SentenceStroop',
    corrResp: prmsWordByWordStroop.resp_key_sentence,
    item: jsPsych.timelineVariable('item'),
    cond: jsPsych.timelineVariable('cond'),
    sent: jsPsych.timelineVariable('sent'),
    crit_pos: jsPsych.timelineVariable('crit_pos'),
    dis_pos: jsPsych.timelineVariable('dis_pos'),
    word_number: jsPsych.timelineVariable('word_num'),
    length: jsPsych.timelineVariable('length'),
    colour: 'black',
    error: 0,
  },
  on_finish: function () {
    codeTrialWordByWord();
  },
};

function codeTrialWordByWord() {
  'use strict';
  let dat = jsPsych.data.get().last(1).values()[0];
  jsPsych.data.addDataToLastTrial({
    date: Date(),
    blockNum: prmsWordByWordStroop.cBlkWordByWordStroop,
    trialNum: prmsWordByWordStroop.cTrlWordByWordStroop,
  });
  if (dat.word_number === dat.length - 1) {
    prmsWordByWordStroop.cTrlWordByWordStroop += 1;
  }
  if (dat.key_press === 27) {
    jsPsych.endExperiment();
  }
}

function create_timeline_variables_sentence(items) {
  const txt = items.sent.split(' ');
  let seq = [];
  for (let i = -1; i < txt.length; i++) {
    seq.push({
      item: items.item,
      cond: items.cond,
      sent: items.sent,
      crit_pos: items.crit_pos,
      dis_pos: items.dis_pos,
      word_num: i,
      length: txt.length,
      mask_type: prmsWordByWordStroop.mask_type,
    });
  }
  return seq;
}

function create_timeline_sentence(items) {
  let timeline_items = [];
  for (let i = 0; i < items.length; i++) {
    const tmp = {
      timeline: [trial_center_text],
      timeline_variables: create_timeline_variables_sentence(items[i]),
    };
    timeline_items.push(tmp);
    timeline_items.push(iti_wordByWordStroop);
  }
  return timeline_items;
}

function drawFixation() {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  ctx.lineWidth = prmsWordByWordStroop.fixWidth;
  ctx.moveTo(-prmsWordByWordStroop.fixSize, 0);
  ctx.lineTo(prmsWordByWordStroop.fixSize, 0);
  ctx.stroke();
  ctx.moveTo(0, -prmsWordByWordStroop.fixSize);
  ctx.lineTo(0, prmsWordByWordStroop.fixSize);
  ctx.stroke();
}

const fixation_cross = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  trial_duration: prmsWordByWordStroop.fixDur,
  translate_origin: true,
  response_ends_trial: false,
  func: drawFixation,
};

function drawStroop(args) {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');

  // draw word
  ctx.font = prmsWordByWordStroop.font_size_stroop;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = args.colour;
  ctx.fillText(args.word, 0, 0);
}

function drawStroopFeedback() {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  let dat = jsPsych.data.get().last(1).values()[0];
  ctx.font = prmsWordByWordStroop.font_size_stroop;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';
  ctx.fillText(prmsWordByWordStroop.fbTxt[dat.error], 0, 0);
}

function codeTrialWordByWordStroop() {
  'use strict';
  let dat = jsPsych.data.get().last(1).values()[0];
  let error = dat.key_press !== jsPsych.pluginAPI.convertKeyCharacterToKeyCode(dat.corrResp) ? 1 : 0;
  // console.log('Trial Error: ', error);

  jsPsych.data.addDataToLastTrial({
    date: Date(),
    error: error,
    blockNum: prmsWordByWordStroop.cBlkWordByWordStroop,
    trialNum: prmsWordByWordStroop.cTrlWordByWordStroop,
  });
  prmsWordByWordStroop.cTrlWordByWordStroop += 1;
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
  trial_duration: prmsWordByWordStroop.fbDur,
  response_ends_trial: false,
  func: [drawStroopFeedback],
};

const stroop_stimulus_wordByWord = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  translate_origin: true,
  choices: prmsWordByWordStroop.resp_keys_stroop,
  func: [drawStroop],
  func_args: [{ word: jsPsych.timelineVariable('word'), colour: jsPsych.timelineVariable('colour') }],
  data: {
    stim: 'SentenceStroop',
    item: jsPsych.timelineVariable('item'),
    word: jsPsych.timelineVariable('word'),
    sent: jsPsych.timelineVariable('word'),
    colour: jsPsych.timelineVariable('colour'),
    cond: jsPsych.timelineVariable('cond'),
    corrResp: jsPsych.timelineVariable('corrResp'),
    crit_pos: 0,
    dis_pos: 0,
    word_number: 0,
    length: 1,
  },
  on_finish: function () {
    codeTrialWordByWordStroop();
  },
};

const stroops = [
  { item: 1, word: 'blue', colour: 'blue', cond: 'comp', corrResp: prmsWordByWordStroop.resp_keys_stroop[0] },
  { item: 2, word: 'blue', colour: 'green', cond: 'incomp', corrResp: prmsWordByWordStroop.resp_keys_stroop[1] },
  { item: 3, word: 'green', colour: 'green', cond: 'comp', corrResp: prmsWordByWordStroop.resp_keys_stroop[1] },
  { item: 4, word: 'green', colour: 'blue', cond: 'incomp', corrResp: prmsWordByWordStroop.resp_keys_stroop[0] },
];

const stroop_stimuli_practice = shuffle(repeatArray(stroops, 3));
// console.log(stroop_stimuli_practice);

const stroop_stimuli_exp = shuffle(repeatArray(stroops, 24));
// console.log(stroop_stimuli_practice);

function create_timeline_sentencestroop(sentences, stroops, nstroops) {
  let timeline = [];
  let nstroop;
  for (let i = 0; i < sentences.length; i++) {
    // Always start with X Stroop trials
    if (i == 0) {
      nstroop = nstroops.splice(0, 1);
      for (let i = 0; i < nstroop; i++) {
        const tmp = {
          timeline: [fixation_cross, stroop_stimulus_wordByWord, trial_feedback_stroop, iti_wordByWordStroop],
          timeline_variables: stroops.splice(0, 1),
        };
        timeline.push(tmp);
        timeline.push(iti_wordByWordStroop);
      }
    }
    const tmp = {
      timeline: [trial_center_text],
      timeline_variables: create_timeline_variables_sentence(sentences[i]),
    };
    timeline.push(tmp);
    timeline.push(iti_wordByWordStroop);

    // Intervening Stroops
    nstroop = nstroops.splice(0, 1);
    for (let j = 0; j < nstroop; j++) {
      const tmp = {
        timeline: [fixation_cross, stroop_stimulus_wordByWord, trial_feedback_stroop, iti_wordByWordStroop],
        timeline_variables: stroops.splice(0, 1),
      };
      timeline.push(tmp);
      timeline.push(iti_wordByWordStroop);
    }
  }
  return timeline;
}

const timeline_practice = {
  timeline: create_timeline_sentencestroop(practice_items, stroop_stimuli_practice, shuffle([2, 2, 2, 3, 3])),
};
// console.log(timeline_practice);

// prettier-ignore
const timeline_exp = {
    timeline: create_timeline_sentencestroop(
        items_sentences,
        stroop_stimuli_exp,
        shuffle([ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, ]),
    ),
};
// console.log(timeline_exp);

////////////////////////////////////////////////////////////////////////
//                        Instructions Stroop Part 2                  //
////////////////////////////////////////////////////////////////////////

const stroop_instructionsStart1 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: generate_formatted_html({
    text:
      `Part 2: This section involves responding to font colour. Ignore word meaning! <br><br>` +
      stroop_resp_mapping +
      `You will now perform a block of 48 trials. 
       Respond as quickly and as accurately as possible.<br><br> 
    Press any key to continue!`,
    fontsize: 32,
    lineheight: 1.5,
    align: 'left',
  }),
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

const iti_stroop = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  trial_duration: prmsStroop.iti,
  response_ends_trial: false,
  func: function () {},
};

const stroop_stimulus = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  translate_origin: true,
  choices: prmsWordByWordStroop.resp_keys_stroop,
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

// prettier-ignore
const exp_timeline_stroop_experiment = {
  timeline: [fixation_cross, stroop_stimulus, trial_feedback_stroop, iti_stroop],
  timeline_variables: [
    { word: 'blue',  colour: 'blue',  comp: 'comp',   corrResp: prmsWordByWordStroop.resp_keys_stroop[0] },
    { word: 'blue',  colour: 'green', comp: 'incomp', corrResp: prmsWordByWordStroop.resp_keys_stroop[1] },
    { word: 'green', colour: 'green', comp: 'comp',   corrResp: prmsWordByWordStroop.resp_keys_stroop[1] },
    { word: 'green', colour: 'blue',  comp: 'incomp', corrResp: prmsWordByWordStroop.resp_keys_stroop[0] },
  ],
  sample: {
    type: 'fixed-repetitions',
    size: 12,
  },
};

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

////////////////////////////////////////////////////////////////////////
//                     Instructions Recall Phase 3                     //
////////////////////////////////////////////////////////////////////////

const recall_instructionsStart = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: generate_formatted_html({
    text: `Part 3: In the final part of the experiment, you will be presentend with complete sentences.
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
    items[i].repeat = i % 2 ? true : false; // present 50% of items in phase 3
  }
}

function create_recall_items(items_org, items) {
  'use strict';
  for (let i = 0; i < items.length; i++) {
    if (items[i].repeat) {
      items[i].test_sent = items[i].sent;
      items[i].answer = true;
    } else {
      for (let j = 0; j < items_org.length; j++) {
        if ((items_cu[i].item === items_org[j].item) & (items_org[j].cond !== items[i].cond)) {
          items[i].test_sent = items_org[j].sent;
          items[i].answer = false;
        }
      }
    }
  }
  // console.log(items);
  return items;
}

repeat_item_recall_phase(items_cu);
// console.log(items_cu);
repeat_item_recall_phase(items_ca);
// console.log(items_ca);

// items for third phase (Recall)
const items_cu_recall = create_recall_items(items, items_cu);
const items_ca_recall = create_recall_items(items, items_ca);
const items_recall = shuffle(items_cu_recall.splice(0, 12).concat(items_ca_recall.splice(0, 12)));
// console.log(items_recall);

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
  // console.log('Trial Error: ', error);

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
  trial_duration: prmsRecall.fbDur,
  func: [drawRecallFeedback],
};

const exp_timeline_recall = {
  timeline: [trial_recall, trial_feedback_recall, iti_recall],
  timeline_variables: items_recall,
  sample: {
    type: 'fixed-repetitions',
    size: 1,
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
const save_sentencestroop = {
  type: 'call-function',
  func: function () {
    console.log('here');
    let data_filename = dirName + 'data/' + expName + '_sentencestroop_' + vpNum;
    saveData('/Common/write_data.php', data_filename, { stim: 'SentenceStroop' });
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
  exp.push(wordByWordStroop_instructionsStart1);
  exp.push(timeline_practice);
  exp.push(wordByWordStroop_instructionsStart2);
  exp.push(timeline_exp);
  exp.push(save_sentencestroop);
  exp.push(wordByWordStroop_instructionsEnd);

  // Phase 2: Stroop task
  exp.push(stroop_instructionsStart1);
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
