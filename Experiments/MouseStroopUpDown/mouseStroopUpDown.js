// Stroop-like task with VPs required to drag words up/down according to colour
// Standard stroop-like words are alternated with up/down type words

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const canvas_colour = 'rgba(200, 200, 200, 1)';
const canvas_size = [1280, 960];
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
const prms = {
  nBlks: 4,
  fixWidth: 3,
  fixSize: 15,
  fixDur: 750,
  fbDur: 750,
  fbFont: '60px Arial',
  waitDur: 750,
  iti: 750,
  fbTxt: ['Correct', 'Error', 'Too Slow', 'Too Fast'],
  cTrl: 1, // count trials
  cBlk: 1, // count blocks
};

const words_upper_de = shuffle([
  'Alpen',
  'Ballon',
  'Vogel',
  'Burg',
  'Decke',
  'Wolke',
  'Komet',
  'Krone',
  'Adler',
  'Giebel',
  'Empore',
  'Falke',
  'Höhe',
  'Hochland',
  'Berg',
  'Drachen',
  'Höhepunkt',
  'Mond',
  'Gebirge',
  'Nest',
  'Flugzeug',
  'Planet',
  'Dach',
  'Satellit',
  // 'Himmel',
  // 'Hochhaus',
  // 'Gipfel',
  // 'Stern',
  // 'Sonne',
  // 'Spitze',
  // 'Turm',
  // 'Weltall',
]);

//const words_upper_en = shuffle([
//    "alps", "balloon", "bird", "castle", "ceiling", "cloud",
//    "comet", "crown", "eagle", "gable", "gallery",
//    "hawk", "height", "highlands", "hill", "kite",
//    "maximum", "moon", "mountains", "nest", "plane",
//    "planet", "roof", "satellite", "sky", "skyscraper",
//    "summit", "star", "sun", "top", "tower", "universe"
//]);

const words_lower_de = shuffle([
  'Abgrund',
  'Schlucht',
  'Teppich',
  'Keller',
  'Klee',
  'Tiefe',
  'Graben',
  'Taucher',
  'Erdreich',
  'Fußboden',
  'Fuß',
  'Gras',
  'Grab',
  'Boden',
  'Hölle',
  'Maulwurf',
  'Maus',
  'Schienen',
  'Fluss',
  'Wurzel',
  'Gehweg',
  'Erde',
  'Sohle',
  'Stein',
  // 'Straße',
  // 'Untergrund',
  // 'U-Boot',
  // 'U-Bahn',
  // 'Sumpf',
  // 'Tunnel',
  // 'Unterwelt',
  // 'Wurm',
]);

// const words_lower_en = shuffle([
//     "abyss" , "canyon" , "carpet" ," cellar" ," clover" ,
//     "depth", "ditch"," diver" , "earth", "floor", "foot" ,
//     "grass", "grave"," ground" , "hell", "mole", "mouse" ,
//     "rails", "river"," root", "sidewalk", "soil"," sole" ,
//     "stone", "street"," subfont", "submarine", "subway" ,
//     "swamp", "tunnel"," underworld", "worm"
// ]);

const words = words_upper_de.concat(words_lower_de);
const stroops = repeatArray(['red', 'blue', 'green', 'orange'], 16);

const resp_mapping_location = ['up', 'up', 'down', 'down'];
const resp_mapping_color = shuffle(['red', 'blue', 'green', 'orange']);
const colours = ['red', 'blue', 'green', 'orange'];

const stroop_words = repeatArray(repeatArray(['red', 'blue', 'green', 'orange'], 6), 2);
const stroop_colours = repeatArray(
  repeatArray(['red', 'blue', 'green', 'orange'], 3).concat([
    'blue',
    'red',
    'red',
    'red',
    'green',
    'green',
    'blue',
    'blue',
    'orange',
    'orange',
    'orange',
    'green',
  ]),
  2,
);

// console.log(stroop_words);
// console.log(stroop_colours);

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////

const instructionsStart1 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: generate_formatted_html({
    text:
      `Welcome: Respond to the colour of the font. Ignore word meaning!<br><br>` +
      resp_mapping_color[0] +
      '/' +
      resp_mapping_color[1] +
      " = 'UP'<br>" +
      resp_mapping_color[2] +
      '/' +
      resp_mapping_color[3] +
      " = 'DOWN'<br><br>" +
      'Press any key to begin a practice block.',
    fontsize: 32,
    lineheight: 1.5,
    align: 'left',
  }),
};

function create_timeline_up_down_words(cpos) {
  'use strict';
  let t = [];
  for (let i = 0; i < words.length; i++) {
    t.push({
      word: words[i],
      colour: colours[cpos],
      word_loc: i < words_upper_de.length ? 'up' : 'down',
      resp_loc: resp_mapping_location[resp_mapping_color.findIndex((x) => x === colours[cpos])],
    });
    cpos = (cpos + 1) % 4;
  }
  // code compatibiliy
  for (let i = 0; i < t.length; i++) {
    t[i].comp = t[i].word_loc === t[i].resp_loc ? 'comp' : 'incomp';
  }
  // console.log(t);
  return t;
}

function create_timeline_stroop_words() {
  'use strict';
  let t = [];
  for (let i = 0; i < stroop_words.length; i++) {
    t.push({
      word: stroop_words[i],
      colour: stroop_colours[i],
      word_loc: 'na',
      resp_loc: resp_mapping_location[resp_mapping_color.findIndex((x) => x === stroop_colours[i])],
    });
  }
  // code compatibiliy
  for (let i = 0; i < t.length; i++) {
    t[i].comp = t[i].word === t[i].colour ? 'comp' : 'incomp';
  }
  // console.log(t);
  return t;
}

function intermix_stroop_up_down_timelines(blk) {
  'use strict';
  let stroop_timeline = shuffle(create_timeline_stroop_words());
  let up_down_timeline = shuffle(create_timeline_up_down_words(blk));
  let t = [];
  for (let i = 0; i < stroop_timeline.length; i++) {
    t.push(stroop_timeline[i]);
    t.push(up_down_timeline[i]);
  }
  // console.log(t);
  return t;
}

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

function drawFeedback() {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  let dat = jsPsych.data.get().last(1).values()[0];
  ctx.font = prms.fbFont;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';
  ctx.fillText(prms.fbTxt[dat.error], dat.end_x, dat.end_y);
}

const fixation_cross = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  trial_duration: 500,
  translate_origin: true,
  func: drawFixation,
};

function codeTrial() {
  'use strict';
  let dat = jsPsych.data.get().last(1).values()[0];
  // console.log(dat);
  let error = dat.resp_loc === dat.end_loc ? 0 : 1;
  // console.log('Trial Error: ', error);

  jsPsych.data.addDataToLastTrial({ date: Date(), error: error, blockNum: prms.cBlk, trialNum: prms.cTrl });
  prms.cTrl += 1;
  if (dat.key_press === 27) {
    jsPsych.endExperiment();
  }
}

const trial_stimulus = {
  type: 'mouse-drag-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  word: jsPsych.timelineVariable('word'),
  colour: jsPsych.timelineVariable('colour'),
  scale_factor: null,
  data: {
    stim: 'mouse_stroop',
    word: jsPsych.timelineVariable('word'),
    colour: jsPsych.timelineVariable('colour'),
    word_loc: jsPsych.timelineVariable('word_loc'),
    resp_loc: jsPsych.timelineVariable('resp_loc'),
    comp: jsPsych.timelineVariable('comp'),
  },
  on_start: function (trial) {
    let dat = jsPsych.data.get().last(1).values()[0];
    trial.scale_factor = dat.scale_factor;
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
  trial_duration: 500,
  translate_origin: false,
  func: drawFeedback,
};

function blockFeedbackTxt(filter_options) {
  'use strict';
  let dat = jsPsych.data.get().filter({ ...filter_options, blockNum: prms.cBlk });
  let nTotal = dat.count();
  let nError = dat.select('error').values.filter(function (x) {
    return x === 1;
  }).length;
  dat = jsPsych.data.get().filter({ ...filter_options, blockNum: prms.cBlk, error: 0 });
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
    '<H2>Press any key to continue the experiment!</H2>';
  prms.cBlk += 1;
  return blockFbTxt;
}

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
  type: 'html-keyboard-response',
  stimulus: '',
  response_ends_trial: true,
  post_trial_gap: prms.waitDur,
  on_start: function (trial) {
    trial.stimulus = blockFeedbackTxt({ stim: 'mouse_stroop' });
  },
};

const trial_timeline = {
  timeline: [fixation_cross, trial_stimulus, trial_feedback, iti],
  randomize_order: true,
  repetitions: 1,
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
  exp.push(instructionsStart1);

  for (let blk = 0; blk < prms.nBlks; blk += 1) {
    let blk_timeline = { ...trial_timeline };
    blk_timeline.timeline_variables = intermix_stroop_up_down_timelines(blk);
    blk_timeline.randomize_order = false; // randomized earlier
    exp.push(blk_timeline); // trials within a block
    exp.push(block_feedback); // show previous block performance
  }
  exp.push(debrief_en);
  exp.push(fullscreen_off);

  return exp;
}
const EXP = genExpSeq();
const filename = dirName + 'data/' + expName + '_' + genVpNum();

jsPsych.init({
  timeline: EXP,
  fullscreen_mode: true,
  show_progress_bar: false,
  on_finish: function () {
    saveData('/Common/write_data_json.php', filename, { stim: 'mouse_stroop' }, (filetype = 'json'));
  },
});
