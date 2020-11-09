// Stroop-like task with VPs required to drag words up/down according to colour
// Standard stroop-like words are alternated with up/down type words

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
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
const prms = {
  nBlks: 4, // split into 8 "mini" blocks
  fixWidth: 3,
  fixSize: 15,
  fixDur: 750,
  fbDur: 750,
  fbFont: '60px Arial',
  waitDur: 750,
  iti: 750,
  fbTxt: ['Richtig', 'Falsch'],
  cTrl: 1, // count trials
  cBlk: 1, // count blocks
};

// practice items
const words_practice = ['xxxx', 'xxxx', 'xxxx', 'xxxx'];
const colours_practice = ['red', 'blue', 'green', 'orange'];

// up/down items
const words_up = shuffle([
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
  'Himmel',
  'Hochhaus',
  'Gipfel',
  'Stern',
  'Sonne',
  'Spitze',
  'Turm',
  'Weltall',
]);

const words_down = shuffle([
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
  'Straße',
  'Untergrund',
  'U-Boot',
  'U-Bahn',
  'Sumpf',
  'Tunnel',
  'Unterwelt',
  'Wurm',
]);

const words_up_down = words_up.concat(words_down);
const colours_up_down = ['red', 'blue', 'green', 'orange'];
// console.log(words_up_down);

// Stroop words + colours
const words_stroop = repeatArray(repeatArray(['red', 'blue', 'green', 'orange'], 3), 6);
const colours_stroop = repeatArray(
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
  3,
);
// console.log(words_stroop);
// console.log(colours_stroop);

// random response mapping
const resp_mapping_location = ['up', 'up', 'down', 'down'];
const resp_mapping_color = shuffle(['red', 'blue', 'green', 'orange']);
const resp_mapping_color_en_de = { red: 'rot', blue: 'blau', green: 'grün', orange: 'orange' };

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
      `Liebe/r Teilnehmer/in, <br><br>
      vielen Dank für Ihr Interesse an unserer Studie! Ihre Aufgabe ist folgende:
      In der Mitte des Bildschirm erscheint ein Wort, daraufhin gilt:<br><br>
      (1) Klicken Sie auf das Wort<br>
      (2) Bewegen Sie das Wort entsprechend der Farbe nach OBEN oder nach UNTEN <br><br>
      Es gilt folgende Farbzuordnung:<br><br>` +
      resp_mapping_color_en_de[resp_mapping_color[0]] +
      '/' +
      resp_mapping_color_en_de[resp_mapping_color[1]] +
      ` = \'OBEN\'<br>` +
      resp_mapping_color_en_de[resp_mapping_color[2]] +
      '/' +
      resp_mapping_color_en_de[resp_mapping_color[3]] +
      ` = \'UNTEN\'<br><br> 
      Das Experiment beginnt mit ein paar Übungsdurchgängen, um die Farbzuordnung zu lernen.<br><br>
      Drücke eine beliebige Taste, um fortzufahren!`,
    fontsize: 28,
    lineheight: 1.0,
    align: 'left',
  }),
};

const instructionsStart2 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: generate_formatted_html({
    text:
      `Ende der Übung. Erinnerung: Ihre Aufgabe ist folgende:
      In der Mitte des Bildschirm erscheint ein Wort, daraufhin gilt:<br><br>
      (1) Klicken Sie auf das Wort<br>
      (2) Bewegen Sie das Wort entsprechend der Farbe nach OBEN oder nach UNTEN <br><br>
      Es gilt folgende Farbzuordnung:<br><br>` +
      resp_mapping_color_en_de[resp_mapping_color[0]] +
      '/' +
      resp_mapping_color_en_de[resp_mapping_color[1]] +
      ` = \'OBEN\'<br>` +
      resp_mapping_color_en_de[resp_mapping_color[2]] +
      '/' +
      resp_mapping_color_en_de[resp_mapping_color[3]] +
      ` = \'UNTEN\'<br><br> +
      Das Experiment beginnt mit ein paar Übungsdurchgängen, um die Farbzuordnung zu lernen.<br><br>
      Drücke eine beliebige Taste, um fortzufahren!`,
    fontsize: 28,
    lineheight: 1.0,
    align: 'left',
  }),
};

////////////////////////////////////////////////////////////////////////
//                     Trial Timelines + Stimuli                      //
////////////////////////////////////////////////////////////////////////

function create_timeline_practice() {
  'use strict';
  let t = [];
  for (let i = 0; i < words_practice.length; i++) {
    t.push({
      word: words_practice[i],
      colour: colours_practice[i],
      word_loc: 'na',
      resp_loc: resp_mapping_location[resp_mapping_color.findIndex((x) => x === colours_practice[i])],
      comp: 'na',
    });
  }
  t = repeatArray(t, 4); // 16 practice trials
  // console.log(t);
  return t;
}

function create_timeline_up_down_words(cpos) {
  'use strict';
  let t = [];
  for (let i = 0; i < words_up_down.length; i++) {
    t.push({
      word: words_up_down[i],
      colour: colours_up_down[cpos],
      word_loc: i < words_up.length ? 'up' : 'down',
      resp_loc: resp_mapping_location[resp_mapping_color.findIndex((x) => x === colours_up_down[cpos])],
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
  for (let i = 0; i < words_stroop.length; i++) {
    t.push({
      word: words_stroop[i],
      colour: colours_stroop[i],
      word_loc: 'na',
      resp_loc: resp_mapping_location[resp_mapping_color.findIndex((x) => x === colours_stroop[i])],
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
  return [t.splice(0, 72), t];
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
    ' von ' +
    prms.nBlks * 2 +
    '</H1>' +
    '<H1>Mittelwert RT: ' +
    Math.round(dat.select('end_rt').mean()) +
    ' ms </H1>' +
    '<H1>Fehler Rate: ' +
    Math.round((nError / nTotal) * 100) +
    ' %</H1>' +
    '<H2>Drucken Sie eine beliebige Taste um fortzufahren!</H2>';
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

// For VP Stunden
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
      `Vielen Dank für Ihre Teilnahme.<br><br>
      Wenn Sie Versuchspersonenstunden benötigen, kopieren Sie den folgenden zufällig generierten Code und
      senden Sie diesen zusammen mit Ihrer Matrikelnummer per Email mit dem Betreff 'Versuchpersonenstunde' an:<br><br>
        hiwipibio@gmail.com 
        Code: ` +
      randomString +
      `<br><br>Drücken Sie die Leertaste, um fortzufahren!`,
    fontsize: 28,
    lineheight: 1.0,
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
    saveData('/Common/write_data.php', data_filename, { stim: 'mouse_stroop' });
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
  exp.push(instructionsStart1);

  // practice block with "xxxx" stimuli
  let blk_timeline = { ...trial_timeline };
  blk_timeline.timeline_variables = create_timeline_practice();
  blk_timeline.randomize_order = true;
  exp.push(blk_timeline); // trials within a block

  // end of practice/start of real experiment
  exp.push(instructionsStart2);

  // split balanced 144 trials across blocks two blocks
  let timeline_variables = [];
  for (let blk = 0; blk < prms.nBlks; blk += 1) {
    let tmp = intermix_stroop_up_down_timelines(blk);
    timeline_variables.push(tmp[0], tmp[1]);
  }

  for (let blk = 0; blk < timeline_variables.length; blk += 1) {
    let blk_timeline = { ...trial_timeline };
    blk_timeline.timeline_variables = timeline_variables[blk];
    // console.log(blk_timeline);
    blk_timeline.randomize_order = false; // randomized earlier
    exp.push(blk_timeline); // trials within a block
    exp.push(block_feedback); // show previous block performance
  }

  // save data
  exp.push(save_data);
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
  fullscreen_mode: true,
  show_progress_bar: false,
  exclusions: {
    min_width: canvas_size[0],
    min_height: canvas_size[1],
  },
});
