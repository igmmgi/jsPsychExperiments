// Negation Task (ClinicNeg / PressNeg):
// Participants respond to the meaning of stimuli using key responses:
// - "Q" key for left response (left blue key / "Linke blaue Taste")
// - "P" key for right response (right blue key / "Rechte blaue Taste")
//
// Three stimulus types:
// 1. Linguistic ("jetzt links", "nicht links", "jetzt rechts", "nicht rechts")
// 2. Symbolic (✓←, X←, ✓→, X→)
// 3. Mixed (✓ links, X links, ✓ rechts, X rechts)
//
// 9 blocks in total:
// Each stimulus type begins with 1 practice block (8 trials), followed by 2 test blocks (48 trials each).
// Order of stimulus types is counterbalanced across 6 versions (versions 1-6).

const jsPsych = initJsPsych({});

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const CANVAS_COLOUR = 'rgba(255, 255, 255, 1)';
const CANVAS_SIZE = [1280, 720]; // [width, height]
const CANVAS_BORDER = '5px solid black';

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const PRMS = {
  screen_res: [1920, 1080],
  ntrls_practice: 8, // number of trials in practice block (blocks 1, 4, 7)
  ntrls_test: 48, // number of trials in subsequent test blocks (blocks 2, 3, 5, 6, 8, 9)
  nblks: 9, // 9 blocks total
  fix_duration: 500, // 500 ms central fixation cross
  fix_size: 50,
  feedback_duration: 500, // 500 ms feedback duration
  feedback_text_size_trial: 40,
  feedback_text_size_block: 28,
  iti: 1000, // 1000 ms inter-trial interval
  wait_duration: 1000, // 1000 ms pause between screens
  stim_size: 50,
  resp_keys: ['Q', 'P'],
  feedback_text: ['Richtig', 'Falsch'], // 0 = Richtig, 1 = Falsch
  ctrl: 1, // count trials within block
  cblk: 1, // count blocks
};

// 6 counterbalanced version orders
const BLOCK_ORDERS = {
  1: ['Linguistic', 'Symbolic', 'Mixed'],
  2: ['Linguistic', 'Mixed', 'Symbolic'],
  3: ['Symbolic', 'Linguistic', 'Mixed'],
  4: ['Symbolic', 'Mixed', 'Linguistic'],
  5: ['Mixed', 'Linguistic', 'Symbolic'],
  6: ['Mixed', 'Symbolic', 'Linguistic'],
};

let VERSION = 1;

// Symbol characters
const TICK_MARK = '&#10004;';
const CROSS_MARK = '&#10008;';
const LEFT_ARROW = '&#129144;';
const RIGHT_ARROW = '&#129146;';

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
Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.<br>
Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und genügend Zeit hast,
um das Experiment durchzuführen. Wir bitten dich die ca. nächsten 15-20 Minuten konzentriert zu arbeiten.<br><br>
Drücke eine beliebige Taste, um fortzufahren!`,
    align: 'left',
    fontsize: 30,
    width: '1200px',
    bold: true,
    lineheight: 1.5,
  }),
};

const TASK_INSTRUCTIONS_LANGUAGE = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: generate_formatted_html({
    text: `Reagiere entsprechend der Bedeutung!<br><br>
"jetzt links" &emsp;oder&emsp; "nicht rechts" &emsp;&emsp;&emsp; "jetzt rechts" &emsp;oder&emsp; "nicht links"<br><br>
Linke blaue Taste ("Q") &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; Rechte blaue Taste ("P")<br><br><br>
Es folgt zunächst ein kurzer Übungsblock (8 Durchgänge).<br><br>
Drücke eine beliebige Taste, um fortzufahren!`,
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
    text: `Reagiere entsprechend der Bedeutung!<br><br>
"${TICK_MARK}${LEFT_ARROW}" &emsp;oder&emsp; "${CROSS_MARK}${RIGHT_ARROW}" &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; "${TICK_MARK}${RIGHT_ARROW}" &emsp;oder&emsp; "${CROSS_MARK}${LEFT_ARROW}"<br><br>
Linke blaue Taste ("Q") &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; Rechte blaue Taste ("P")<br><br><br>
Es folgt zunächst ein kurzer Übungsblock (8 Durchgänge).<br><br>
Drücke eine beliebige Taste, um fortzufahren!`,
    align: 'center',
    fontsize: 30,
    width: '1200px',
    bold: true,
    lineheight: 1.5,
  }),
};

const TASK_INSTRUCTIONS_MIXED = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: generate_formatted_html({
    text: `Reagiere entsprechend der Bedeutung!<br><br>
"${TICK_MARK}&nbsp;links" &emsp;oder&emsp; "${CROSS_MARK}&nbsp;rechts" &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; "${TICK_MARK}&nbsp;rechts" &emsp;oder&emsp; "${CROSS_MARK}&nbsp;links"<br><br>
Linke blaue Taste ("Q") &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; Rechte blaue Taste ("P")<br><br><br>
Es folgt zunächst ein kurzer Übungsblock (8 Durchgänge).<br><br>
Drücke eine beliebige Taste, um fortzufahren!`,
    align: 'center',
    fontsize: 30,
    width: '1200px',
    bold: true,
    lineheight: 1.5,
  }),
};

function task_instructions_test(stim_type) {
  let mapping_reminder = '';
  if (stim_type === 'Linguistic') {
    mapping_reminder = `"jetzt links" &emsp;oder&emsp; "nicht rechts" &emsp;&emsp;&emsp; "jetzt rechts" &emsp;oder&emsp; "nicht links"<br><br>Linke blaue Taste ("Q") &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; Rechte blaue Taste ("P")`;
  } else if (stim_type === 'Symbolic') {
    mapping_reminder = `"${TICK_MARK}${LEFT_ARROW}" &emsp;oder&emsp; "${CROSS_MARK}${RIGHT_ARROW}" &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; "${TICK_MARK}${RIGHT_ARROW}" &emsp;oder&emsp; "${CROSS_MARK}${LEFT_ARROW}"<br><br>Linke blaue Taste ("Q") &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; Rechte blaue Taste ("P")`;
  } else if (stim_type === 'Mixed') {
    mapping_reminder = `"${TICK_MARK}&nbsp;links" &emsp;oder&emsp; "${CROSS_MARK}&nbsp;rechts" &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; "${TICK_MARK}&nbsp;rechts" &emsp;oder&emsp; "${CROSS_MARK}&nbsp;links"<br><br>Linke blaue Taste ("Q") &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; Rechte blaue Taste ("P")`;
  }

  return {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
      text: `Ende des Übungsblocks.<br><br>
Nun folgen 2 Testblöcke mit jeweils 48 Durchgängen.<br>
Reagiere weiterhin so schnell und so genau wie möglich!<br><br><br>
${mapping_reminder}<br><br><br>
Drücke eine beliebige Taste, um fortzufahren!`,
      align: 'center',
      fontsize: 30,
      width: '1200px',
      bold: true,
      lineheight: 1.5,
    }),
  };
}

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////
const FIXATION_CROSS = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: `<div style="font-size:${PRMS.fix_size}px;">+</div>`,
  response_ends_trial: false,
  trial_duration: PRMS.fix_duration,
};

// prettier-ignore
const AFFNEGS_LANGUAGE = [
  `<div style="font-size:${PRMS.stim_size}px;">jetzt links</div>`,
  `<div style="font-size:${PRMS.stim_size}px;">jetzt rechts</div>`,
  `<div style="font-size:${PRMS.stim_size}px;">nicht links</div>`,
  `<div style="font-size:${PRMS.stim_size}px;">nicht rechts</div>`,
];

// prettier-ignore
const AFFNEGS_SYMBOLS = [
  `<div style="font-size:${PRMS.stim_size}px;">${TICK_MARK}${LEFT_ARROW}</div>`,
  `<div style="font-size:${PRMS.stim_size}px;">${TICK_MARK}${RIGHT_ARROW}</div>`,
  `<div style="font-size:${PRMS.stim_size}px;">${CROSS_MARK}${LEFT_ARROW}</div>`,
  `<div style="font-size:${PRMS.stim_size}px;">${CROSS_MARK}${RIGHT_ARROW}</div>`,
];

// prettier-ignore
const AFFNEGS_MIXED = [
  `<div style="font-size:${PRMS.stim_size}px;">${TICK_MARK}&nbsp;links</div>`,
  `<div style="font-size:${PRMS.stim_size}px;">${TICK_MARK}&nbsp;rechts</div>`,
  `<div style="font-size:${PRMS.stim_size}px;">${CROSS_MARK}&nbsp;links</div>`,
  `<div style="font-size:${PRMS.stim_size}px;">${CROSS_MARK}&nbsp;rechts</div>`,
];

const WAIT = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: '',
  response_ends_trial: false,
  trial_duration: PRMS.wait_duration,
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

function code_trial() {
  'use strict';
  let dat = jsPsych.data.get().last(1).values()[0];
  let key = dat.response !== undefined ? dat.response : dat.key_press;

  let correct_key = jsPsych.pluginAPI.compareKeys(key, dat.corr_resp);
  let corr_code = correct_key ? 1 : 2; // 1 = correct, 2 = error
  let error = correct_key ? 0 : 1;
  let is_practice = [1, 4, 7].includes(PRMS.cblk);

  jsPsych.data.addDataToLastTrial({
    date: Date(),
    block_num: PRMS.cblk,
    trial_num: PRMS.ctrl,
    block_type: is_practice ? 'practice' : 'test',
    response: key,
    corr_code: corr_code,
    error: error,
  });
}
const codeTrial = code_trial;

const AFFNEG_STIMULUS = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: jsPsych.timelineVariable('stimulus'),
  trial_duration: null,
  response_ends_trial: true,
  choices: PRMS.resp_keys,
  data: {
    stim: 'affneg',
    stim_type: jsPsych.timelineVariable('type'),
    affneg: jsPsych.timelineVariable('affneg'),
    side: jsPsych.timelineVariable('side'),
    corr_resp: jsPsych.timelineVariable('corr_resp'),
  },
  on_finish: function () {
    code_trial();
    PRMS.ctrl += 1;
  },
};

const TRIAL_FEEDBACK = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: '',
  response_ends_trial: false,
  trial_duration: PRMS.feedback_duration,
  on_start: function (trial) {
    let dat = jsPsych.data.get().last(1).values()[0];
    trial.stimulus = `<div style="font-size:${PRMS.feedback_text_size_trial}px;">${PRMS.feedback_text[dat.error]}</div>`;
  },
};

const BLOCK_FEEDBACK = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: '',
  response_ends_trial: true,
  on_start: function (trial) {
    let block_dvs = calculate_block_performance({
      filter_options: { stim: 'affneg', block_num: PRMS.cblk },
      corr_column: 'error',
      corr_value: 0,
    });
    let is_practice = [1, 4, 7].includes(PRMS.cblk);
    let block_header = is_practice
      ? `Block ${PRMS.cblk} von ${PRMS.nblks} (Übungsblock)`
      : `Block ${PRMS.cblk} von ${PRMS.nblks}`;

    trial.stimulus =
      `<div style="font-size:${PRMS.feedback_text_size_block}px; text-align:center; line-height:1.5;">` +
      `<h2>${block_header}</h2><br>` +
      `<h2>Mittlere Reaktionszeit: ${block_dvs.mean_rt} ms</h2>` +
      `<h2>Fehlerrate: ${block_dvs.error_rate} %</h2><br>` +
      `<h2>Drücke eine beliebige Taste, um fortzufahren!</h2>` +
      `</div>`;
  },
  on_finish: function () {
    PRMS.ctrl = 1;
    PRMS.cblk += 1;
  },
};

// prettier-ignore
const TRIAL_TIMELINE_LANGUAGE = {
  timeline: [FIXATION_CROSS, AFFNEG_STIMULUS, TRIAL_FEEDBACK, ITI],
  timeline_variables: [
    { type: 'linguistic', affneg: 'jetzt', stimulus: AFFNEGS_LANGUAGE[0], side: 'links', corr_resp: PRMS.resp_keys[0] },
    { type: 'linguistic', affneg: 'jetzt', stimulus: AFFNEGS_LANGUAGE[1], side: 'rechts', corr_resp: PRMS.resp_keys[1] },
    { type: 'linguistic', affneg: 'nicht', stimulus: AFFNEGS_LANGUAGE[2], side: 'links', corr_resp: PRMS.resp_keys[1] },
    { type: 'linguistic', affneg: 'nicht', stimulus: AFFNEGS_LANGUAGE[3], side: 'rechts', corr_resp: PRMS.resp_keys[0] },
  ],
};

// prettier-ignore
const TRIAL_TIMELINE_SYMBOLIC = {
  timeline: [FIXATION_CROSS, AFFNEG_STIMULUS, TRIAL_FEEDBACK, ITI],
  timeline_variables: [
    { type: 'symbolic', affneg: 'jetzt', stimulus: AFFNEGS_SYMBOLS[0], side: 'links', corr_resp: PRMS.resp_keys[0] },
    { type: 'symbolic', affneg: 'jetzt', stimulus: AFFNEGS_SYMBOLS[1], side: 'rechts', corr_resp: PRMS.resp_keys[1] },
    { type: 'symbolic', affneg: 'nicht', stimulus: AFFNEGS_SYMBOLS[2], side: 'links', corr_resp: PRMS.resp_keys[1] },
    { type: 'symbolic', affneg: 'nicht', stimulus: AFFNEGS_SYMBOLS[3], side: 'rechts', corr_resp: PRMS.resp_keys[0] },
  ],
};

// prettier-ignore
const TRIAL_TIMELINE_MIXED = {
  timeline: [FIXATION_CROSS, AFFNEG_STIMULUS, TRIAL_FEEDBACK, ITI],
  timeline_variables: [
    { type: 'mixed', affneg: 'jetzt', stimulus: AFFNEGS_MIXED[0], side: 'links', corr_resp: PRMS.resp_keys[0] },
    { type: 'mixed', affneg: 'jetzt', stimulus: AFFNEGS_MIXED[1], side: 'rechts', corr_resp: PRMS.resp_keys[1] },
    { type: 'mixed', affneg: 'nicht', stimulus: AFFNEGS_MIXED[2], side: 'links', corr_resp: PRMS.resp_keys[1] },
    { type: 'mixed', affneg: 'nicht', stimulus: AFFNEGS_MIXED[3], side: 'rechts', corr_resp: PRMS.resp_keys[0] },
  ],
};

function get_block_timeline(stim_type, is_practice) {
  let base_timeline;
  if (stim_type === 'Linguistic') {
    base_timeline = TRIAL_TIMELINE_LANGUAGE;
  } else if (stim_type === 'Symbolic') {
    base_timeline = TRIAL_TIMELINE_SYMBOLIC;
  } else if (stim_type === 'Mixed') {
    base_timeline = TRIAL_TIMELINE_MIXED;
  }

  return {
    timeline: base_timeline.timeline,
    timeline_variables: base_timeline.timeline_variables,
    sample: {
      type: 'fixed-repetitions',
      size: is_practice ? PRMS.ntrls_practice / 4 : PRMS.ntrls_test / 4,
    },
  };
}

////////////////////////////////////////////////////////////////////////
//                              Save                                  //
////////////////////////////////////////////////////////////////////////
const DIR_NAME = get_dir_name();
const EXP_NAME = get_file_name();

function save() {
  const vp_num = get_time();
  jsPsych.data.addProperties({ vp_num: vp_num });

  const fn = `${DIR_NAME}data/version${VERSION}/${EXP_NAME}_${vp_num}`;
  try {
    save_data_server('/Common8+/write_data.php', fn, { stim: 'affneg' });
  } catch (err) {
    console.warn('save_data_server not available', err);
  }
  const local_fn = `${EXP_NAME}_v${VERSION}_${vp_num}`;
  save_data_local(local_fn, { stim: 'affneg' });
}

const SAVE_DATA = {
  type: jsPsychCallFunction,
  func: save,
  post_trial_gap: 1000,
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function gen_exp_seq(options) {
  'use strict';
  const enable_fullscreen = options && options.fullscreen !== undefined ? options.fullscreen : true;

  let exp = [];

  if (enable_fullscreen) {
    exp.push(fullscreen(true));
  }
  exp.push(browser_check([CANVAS_SIZE[1], CANVAS_SIZE[0]]));
  exp.push(welcome_message());
  exp.push(mouse_cursor(false));
  exp.push(WELCOME_INSTRUCTIONS);
  exp.push(WAIT);

  const stim_order = BLOCK_ORDERS[VERSION];

  for (let i = 0; i < stim_order.length; i += 1) {
    const stim_type = stim_order[i];

    // 1. Task instruction for the current stimulus type (practice)
    if (stim_type === 'Linguistic') {
      exp.push(TASK_INSTRUCTIONS_LANGUAGE);
    } else if (stim_type === 'Symbolic') {
      exp.push(TASK_INSTRUCTIONS_SYMBOLIC);
    } else if (stim_type === 'Mixed') {
      exp.push(TASK_INSTRUCTIONS_MIXED);
    }
    exp.push(WAIT);

    // Practice block (8 trials, or 4 in debug)
    exp.push(get_block_timeline(stim_type, true));
    exp.push(BLOCK_FEEDBACK);
    exp.push(WAIT);

    // Transition instruction to test blocks
    exp.push(task_instructions_test(stim_type));
    exp.push(WAIT);

    // Test block 1 (48 trials, or 4 in debug)
    exp.push(get_block_timeline(stim_type, false));
    exp.push(BLOCK_FEEDBACK);
    exp.push(WAIT);

    // Test block 2 (48 trials, or 4 in debug)
    exp.push(get_block_timeline(stim_type, false));
    exp.push(BLOCK_FEEDBACK);
    exp.push(WAIT);
  }

  // Save experiment data
  exp.push(SAVE_DATA);

  // Debriefing and wrap-up
  exp.push(mouse_cursor(true));
  exp.push(end_message());
  if (enable_fullscreen) {
    exp.push(fullscreen(false));
  }

  return exp;
}

// Start experiment after GUI options are submitted
function start_experiment(settings) {
  VERSION = settings.version;
  if (settings.is_debug) {
    PRMS.ntrls_practice = 4;
    PRMS.ntrls_test = 4;
  } else {
    PRMS.ntrls_practice = 8;
    PRMS.ntrls_test = 48;
  }
  PRMS.ctrl = 1;
  PRMS.cblk = 1;

  jsPsych.data.addProperties({
    version: VERSION,
    code: settings.code,
    age_years: settings.age_years,
    age_months: settings.age_months,
    gender: settings.gender,
    handedness: settings.handedness,
    mode: settings.mode,
  });

  // Remove setup GUI from DOM
  const vpInfoWrapper = document.getElementById('vpInfoWrapper');
  if (vpInfoWrapper) {
    vpInfoWrapper.remove();
  }

  // Generate sequence and run
  const EXP = gen_exp_seq({ fullscreen: settings.fullscreen });
  jsPsych.run(EXP);
}

// Initialise GUI and handlers
function init_gui() {
  const url_vars = jsPsych.data.urlVariables();

  // Pre-fill from URL parameters if given
  const versionEl = document.getElementById('version');
  if (versionEl && url_vars.version && [1, 2, 3, 4, 5, 6].includes(Number(url_vars.version))) {
    versionEl.value = url_vars.version;
  }
  const modeEl = document.getElementById('mode');
  if (modeEl && url_vars.debug === '1') {
    modeEl.value = 'debug';
  }

  // Quick fill button for testing/development
  const quickFillBtn = document.getElementById('quick_fill');
  if (quickFillBtn) {
    quickFillBtn.addEventListener('click', function () {
      const codeEl = document.getElementById('code');
      if (codeEl) codeEl.value = 'TEST_' + Math.floor(Math.random() * 1000);
      const ageYEl = document.getElementById('age_years');
      if (ageYEl) ageYEl.value = 10;
      const ageMEl = document.getElementById('age_months');
      if (ageMEl) ageMEl.value = 6;
      const maleEl = document.getElementById('male');
      if (maleEl) maleEl.checked = true;
      const rightEl = document.getElementById('right');
      if (rightEl) rightEl.checked = true;
      const consentEl = document.getElementById('consent_checkbox');
      if (consentEl) consentEl.checked = true;
      if (modeEl) modeEl.value = 'debug';
    });
  }

  // Automated bypass if skip_pretest=1 in URL
  if (url_vars.skip_pretest === '1') {
    start_experiment({
      version: Number(url_vars.version) || 1,
      code: 'AUTO_' + get_time(),
      age_years: 10,
      age_months: 0,
      gender: 'na',
      handedness: 'right',
      mode: url_vars.debug === '1' ? 'debug' : 'standard',
      is_debug: url_vars.debug === '1',
      fullscreen: false,
    });
    return;
  }

  // Start button handler
  const startBtn = document.getElementById('start');
  if (startBtn) {
    startBtn.addEventListener('click', function () {
      const vpInfo = check_vp_info_form_clinic();
      if (vpInfo !== false) {
        start_experiment(vpInfo);
      }
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init_gui);
} else {
  init_gui();
}
