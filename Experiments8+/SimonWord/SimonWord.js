// B.Sc. Project DMC SimonWord
// ResearchProject 2.2
// Simon task with word stimuli presented
// to the left and right screen location. VPs
// should respond with left and right key-presses according
// to 1) living/non-living or 2) small/large

const jsPsych = initJsPsych({
    on_finish: function () {
        if (PRMS.cblk >= 8) {
            window.location.assign(
                "https://uni-tuebingen.sona-systems.com/webstudy_credit.aspx?experiment_id=701&credit_token=c2554fa2e44440acab23bc76944972b5&survey_code=" +
                jsPsych.data.urlVariables().sona_id,
            );
        }
    },
});

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const CANVAS_COLOUR = 'rgba(200, 200, 200, 1)';
const CANVAS_SIZE = [720, 1024]; // height, width (width 1024 accommodates 400px eccentricity without clipping)
const CANVAS_BORDER = '5px solid black';

////////////////////////////////////////////////////////////////////////
//                             Experiment                             //
////////////////////////////////////////////////////////////////////////
const DIR_NAME = get_dir_name();
const EXP_NAME = get_file_name();
const VP_NUM = get_time();

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const PRMS = {
  ntrls_s: 32, // number of trials in single-task blocks (must be multiple of 8)
  nTrlsP: 80, // number of trials in first mixed block (practice)
  nTrlsE: 80, // number of trials in subsequent mixed blocks
  nblks_s: 2,  // number of single-task blocks (random living/size order)
  nBlks: 10,   // number of mixed blocks
  single_task_order: shuffle(["LEBEN", "GRÖßE"]), // randomized order of single-task blocks
  fix_dur: 0, // 0 as we only presented a cue in the previous study without fixation cross
  fb_dur: [0, 2000, 2000, 2000], // error feedback 2000ms, correct feedback 0ms
  cue_dur: 750, // cue duration in ms
  iti: 500, // blank inter-trial interval
  too_fast: 150,
  too_slow: 3500,
  fb_txt: ['Richtig', 'Falsch', 'Zu langsam', 'Zu schnell'],
  fb_size: '30px monospace',
  instruction_fontsize: 24,
  wait_duration: 1000,
  ctrl: 1, // count trials
  cblk: 1, // count blocks
  resp_keys_life: [],
  resp_keys_size: [],
  fix_width: 3,
  fix_size: 15,
  stim_pos_x: 400, // eccentricity: 400 pixels
  stim_pos_y: 0,
  stim_size: '40px monospace',
  previous_task: null, // track task transitions
};

const VERSION = Number(jsPsych.data.urlVariables().version) || (Math.random() < 0.5 ? 1 : 2);
jsPsych.data.addProperties({
  version: VERSION,
  single_task_order: PRMS.single_task_order.join(","),
});

if (VERSION === 1) {
  PRMS.resp_keys_life = ['q', 'p'];
  PRMS.resp_keys_size = ['q', 'p'];
} else if (VERSION === 2) {
  PRMS.resp_keys_life = ['p', 'q'];
  PRMS.resp_keys_size = ['q', 'p'];
}

function get_task_mapping_html(task) {
  let html = "";
  if (task === "LEBEN") {
    html += "<b>Lebensaufgabe (LEBEN):</b><br>";
    if (VERSION === 1) {
      html += 'Lebendig → "Q" (linker Zeigefinger)<br>';
      html += 'Nicht Lebendig → "P" (rechter Zeigefinger)<br>';
    } else {
      html += 'Nicht Lebendig → "Q" (linker Zeigefinger)<br>';
      html += 'Lebendig → "P" (rechter Zeigefinger)<br>';
    }
  } else if (task === "GRÖßE") {
    html += "<b>Größenaufgabe (GRÖßE):</b><br>";
    html += 'Klein (kleiner als ein Fußball) → "Q" (linker Zeigefinger)<br>';
    html += 'Groß (größer als ein Fußball) → "P" (rechter Zeigefinger)<br>';
  }
  return html;
}

function get_full_mapping_html() {
  return get_task_mapping_html("LEBEN") + "<br>" + get_task_mapping_html("GRÖßE");
}

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const TASK_INSTRUCTIONS1 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function () {
    let html = `<div style='text-align:center; font-size:${PRMS.instruction_fontsize}px; line-height:1.8;'>`;
    html += "<h2>Willkommen zum Experiment!</h2>";
    html += "In diesem Experiment wirst du in jedem Durchgang entweder auf die <b>Größe</b> ";
    html += "oder die <b>Belebtheit</b> eines Objekts (geschrieben als Wort) reagieren.<br><br>";
    html += "Vor jedem Durchgang zeigt ein Wort (GRÖßE od. LEBEN) an, welche Aufgabe relevant ist:<br><br>";
    html += "<b>GRÖßE</b> = Entscheide ob das Objekt kleiner oder größer als ein Fußball ist<br>";
    html += "<b>LEBEN</b> = Entscheide ob das Objekt lebendig ist oder nicht<br><br>";
    html += "Drücke eine beliebige Taste, um die Zuordnungen zu sehen.";
    html += "</div>";
    return html;
  },
};

const TASK_INSTRUCTIONS2 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function () {
    let html = `<div style='text-align:center; font-size:${PRMS.instruction_fontsize}px; line-height:1.8;'>`;
    html += "<h2>Tastenzuordnung</h2><br>";
    html += get_full_mapping_html();
    html += "<br>Bediene 'Q' mit deinem linken Zeigefinger und 'P' mit deinem rechten Zeigefinger.<br>";
    html += "Bitte reagiere so schnell und korrekt wie möglich.<br><br>";
    html += "Drücke eine beliebige Taste, um zu beginnen.";
    html += "</div>";
    return html;
  },
};

function single_block_start(task) {
  return {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
      let html = `<div style='text-align:center; font-size:${PRMS.instruction_fontsize}px; line-height:1.8;'>`;
      html += `<h2>Block ${PRMS.cblk} von ${PRMS.nBlks + PRMS.nblks_s}</h2><br>`;
      const task_name = task === "LEBEN" ? "Belebtheit (Lebendig vs. Nicht Lebendig)" : "Größe (Klein vs. Groß)";
      html += `<b>Einzelaufgabe: Reagiere in diesem Block nur auf die ${task_name}!</b><br><br>`;
      html += get_task_mapping_html(task);
      html += "<br>Drücke eine beliebige Taste, um fortzufahren.";
      html += "</div>";
      return html;
    },
  };
}

const MIXED_BLOCKS_INSTRUCTION = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function () {
    let html = `<div style='text-align:center; font-size:${PRMS.instruction_fontsize}px; line-height:1.8;'>`;
    html += "<h2>ACHTUNG!</h2><br>";
    html += "Ab jetzt wechseln sich die beiden Aufgaben (<b>LEBEN</b> und <b>GRÖßE</b>) zufällig ab.<br><br>";
    html += "Vor jedem Durchgang zeigt ein Hinweiswort an, welche Aufgabe relevant ist:<br><br>";
    html += "<b>LEBEN</b> = Entscheide ob das Objekt lebendig ist oder nicht<br>";
    html += "<b>GRÖßE</b> = Entscheide ob das Objekt kleiner oder größer als ein Fußball ist<br><br>";
    html += "Drücke eine beliebige Taste, um fortzufahren.";
    html += "</div>";
    return html;
  },
};

const BLOCK_START = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function () {
    let html = `<div style='text-align:center; font-size:${PRMS.instruction_fontsize}px; line-height:1.8;'>`;
    html += `<h2>Block ${PRMS.cblk} von ${PRMS.nBlks + PRMS.nblks_s}</h2><br>`;
    html += get_full_mapping_html();
    html += "<br>Versuche weiterhin so schnell und so genau wie möglich zu reagieren.<br><br>";
    html += "Drücke eine beliebige Taste, um fortzufahren.";
    html += "</div>";
    return html;
  },
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////
const FIXATION_CROSS = {
  type: jsPsychCanvasKeyboardResponse,
  canvas_size: CANVAS_SIZE,
  trial_duration: PRMS.fix_dur,
  response_ends_trial: false,
  choices: "NO_KEYS",
  stimulus: function (c) {
    let ctx = c.getContext('2d');
    ctx.translate(c.width / 2, c.height / 2);
    ctx.lineWidth = PRMS.fix_width;
    ctx.moveTo(-PRMS.fix_size, 0);
    ctx.lineTo(PRMS.fix_size, 0);
    ctx.stroke();
    ctx.moveTo(0, -PRMS.fix_size);
    ctx.lineTo(0, PRMS.fix_size);
    ctx.stroke();
  },
};

const WORD_CUE = {
  type: jsPsychCanvasKeyboardResponse,
  canvas_size: CANVAS_SIZE,
  trial_duration: PRMS.cue_dur,
  response_ends_trial: false,
  choices: "NO_KEYS",
  stimulus: function (c) {
    let ctx = c.getContext('2d');
    ctx.translate(c.width / 2, c.height / 2);
    ctx.font = PRMS.stim_size;
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(jsPsych.evaluateTimelineVariable('cue'), 0, 0);
  },
};

function code_trial() {
  'use strict';
  let dat = jsPsych.data.get().last(1).values()[0];
  let corrCode = 0;

  let rt = dat.rt !== null ? dat.rt : PRMS.too_slow;
  let comp =
    (dat.position === 'left' && dat.corrResp.toLowerCase() === 'q') || (dat.position === 'right' && dat.corrResp.toLowerCase() === 'p')
      ? 'comp'
      : 'incomp';

  let correctKey = jsPsych.pluginAPI.compareKeys(dat.response, dat.corrResp);

  if (correctKey && rt > PRMS.too_fast && rt < PRMS.too_slow) {
    corrCode = 1; // correct
  } else if (!correctKey && rt > PRMS.too_fast && rt < PRMS.too_slow) {
    corrCode = 2; // choice error
  } else if (rt >= PRMS.too_slow) {
    corrCode = 3; // too slow
  } else if (rt <= PRMS.too_fast) {
    corrCode = 4; // too fast
  }

  // Task transition (switch vs. repeat)
  let transition = 'na';
  if (PRMS.previous_task !== null) {
    transition = PRMS.previous_task === dat.cue ? 'repeat' : 'switch';
  }
  PRMS.previous_task = dat.cue;

  jsPsych.data.addDataToLastTrial({
    date: Date(),
    comp: comp,
    rt: rt,
    corrCode: corrCode,
    corr_code: corrCode,
    blockNum: PRMS.cblk,
    block_num: PRMS.cblk,
    trialNum: PRMS.ctrl,
    trial_num: PRMS.ctrl,
    transition: transition,
  });
  PRMS.ctrl += 1;
  if (jsPsych.pluginAPI.compareKeys(dat.response, 'escape')) {
    jsPsych.endExperiment();
  }
}

const WORD_STIMULUS = {
  type: jsPsychCanvasKeyboardResponse,
  canvas_size: CANVAS_SIZE,
  trial_duration: PRMS.too_slow,
  response_ends_trial: true,
  choices: ['q', 'p', 'escape'],
  stimulus: function (c) {
    let ctx = c.getContext('2d');
    ctx.translate(c.width / 2, c.height / 2);
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = PRMS.stim_size;

    let pos = jsPsych.evaluateTimelineVariable('position');
    let word = jsPsych.evaluateTimelineVariable('word');
    let cue = jsPsych.evaluateTimelineVariable('cue');

    if (pos === 'left') {
      ctx.fillText(word, -PRMS.stim_pos_x, PRMS.stim_pos_y);
      ctx.fillText(cue, 0, 0);
    } else if (pos === 'right') {
      ctx.fillText(word, PRMS.stim_pos_x, PRMS.stim_pos_y);
      ctx.fillText(cue, 0, 0);
    }
  },
  data: {
    stim: 'SimonWord',
    cue: jsPsych.timelineVariable('cue'),
    task: jsPsych.timelineVariable('cue'),
    word: jsPsych.timelineVariable('word'),
    size: jsPsych.timelineVariable('size'),
    life: jsPsych.timelineVariable('life'),
    position: jsPsych.timelineVariable('position'),
    corrResp: jsPsych.timelineVariable('corrResp'),
    correct_key: jsPsych.timelineVariable('corrResp'),
    block_type: jsPsych.timelineVariable('block_type'),
  },
  on_finish: function () {
    code_trial();
  },
};

const TRIAL_FEEDBACK = {
  type: jsPsychCanvasKeyboardResponse,
  canvas_size: CANVAS_SIZE,
  response_ends_trial: false,
  choices: "NO_KEYS",
  stimulus: function (c) {
    let ctx = c.getContext('2d');
    ctx.translate(c.width / 2, c.height / 2);
    let dat = jsPsych.data.get().last(1).values()[0];
    if (dat && dat.corrCode && PRMS.fb_dur[dat.corrCode - 1] > 0) {
      ctx.font = PRMS.fb_size;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'black';
      ctx.fillText(PRMS.fb_txt[dat.corrCode - 1], 0, 0);
    }
  },
  on_start: function (trial) {
    let dat = jsPsych.data.get().last(1).values()[0];
    trial.trial_duration = (dat && dat.corrCode) ? PRMS.fb_dur[dat.corrCode - 1] : 0;
  },
};

const ITI = {
  type: jsPsychCanvasKeyboardResponse,
  canvas_size: CANVAS_SIZE,
  trial_duration: PRMS.iti,
  response_ends_trial: false,
  choices: "NO_KEYS",
  stimulus: function (c) { },
};

const BLOCK_FEEDBACK = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '',
  response_ends_trial: true,
  post_trial_gap: PRMS.wait_duration,
  on_start: function (trial) {
    let block_dvs = calculate_block_performance({
      filter_options: { stim: 'SimonWord', blockNum: PRMS.cblk },
      corr_column: "corrCode",
    });
    let text = block_feedback_text(PRMS.cblk, PRMS.nBlks + PRMS.nblks_s, block_dvs.mean_rt, block_dvs.error_rate, "de");
    trial.stimulus = `<div style="max-width:960px; margin:auto;">${text}</div>`;
  },
  on_finish: function () {
    PRMS.ctrl = 1;
    PRMS.cblk += 1;
    PRMS.previous_task = null;
  },
};

////////////////////////////////////////////////////////////////////////
//                         Trial Generation                           //
////////////////////////////////////////////////////////////////////////
const WORDS = {
  living: {
    small: ['Spinne', 'Ameise', 'Mücke', 'Schnecke', 'Wespe'],
    large: ['Kamel', 'Delfin', 'Elefant', 'Zebra', 'Esel'],
  },
  nonliving: {
    small: ['Armband', 'Socke', 'Perle', 'Zigarre', 'Löffel'],
    large: ['Eisberg', 'Sofa', 'Tuba', 'Asteroid', 'Kanu'],
  },
};

function generate_single_task_trial_table(ntrls, task) {
  const trials_per_cell = Math.floor(ntrls / 8);
  let trials = [];

  for (let life of ["living", "nonliving"]) {
    for (let size of ["small", "large"]) {
      for (let position of ["left", "right"]) {
        let available_words = shuffle([...WORDS[life][size]]);
        let chosen_words = [];
        while (chosen_words.length < trials_per_cell) {
          if (available_words.length === 0) {
            available_words = shuffle([...WORDS[life][size]]);
          }
          chosen_words.push(available_words.pop());
        }

        for (let word of chosen_words) {
          const corrResp =
            task === "LEBEN"
              ? life === "living"
                ? PRMS.resp_keys_life[0]
                : PRMS.resp_keys_life[1]
              : size === "small"
                ? PRMS.resp_keys_size[0]
                : PRMS.resp_keys_size[1];

          trials.push({
            cue: task,
            word: word,
            size: size,
            life: life,
            position: position,
            corrResp: corrResp,
            block_type: "single",
          });
        }
      }
    }
  }
  return shuffle(trials);
}

function generate_trial_table(ntrls) {
  let base_trials = [];
  for (let cue of ["LEBEN", "GRÖßE"]) {
    for (let life of ["living", "nonliving"]) {
      for (let size of ["small", "large"]) {
        for (let word of WORDS[life][size]) {
          for (let position of ["left", "right"]) {
            const corrResp =
              cue === "LEBEN"
                ? life === "living"
                  ? PRMS.resp_keys_life[0]
                  : PRMS.resp_keys_life[1]
                : size === "small"
                  ? PRMS.resp_keys_size[0]
                  : PRMS.resp_keys_size[1];

            base_trials.push({
              cue: cue,
              word: word,
              size: size,
              life: life,
              position: position,
              corrResp: corrResp,
              block_type: "mixed",
            });
          }
        }
      }
    }
  }

  if (ntrls < base_trials.length) {
    return shuffle(base_trials).slice(0, ntrls);
  }

  const nreps = ntrls / base_trials.length;
  let trials = [];
  for (let r = 0; r < nreps; r++) {
    trials = trials.concat(base_trials.map((t) => ({ ...t })));
  }
  return shuffle(trials);
}

function trial_timeline(timeline_variables) {
  return {
    timeline: PRMS.fix_dur > 0
      ? [FIXATION_CROSS, WORD_CUE, WORD_STIMULUS, TRIAL_FEEDBACK, ITI]
      : [WORD_CUE, WORD_STIMULUS, TRIAL_FEEDBACK, ITI],
    timeline_variables: timeline_variables,
  };
}

////////////////////////////////////////////////////////////////////////
//                              Save                                  //
////////////////////////////////////////////////////////////////////////
function save() {
  jsPsych.data.addProperties({ vpNum: VP_NUM });
  const fn = `${DIR_NAME}data/${EXP_NAME}_${VP_NUM}`;
  save_data_server("/Common8+/write_data.php", fn, { stim: "SimonWord" });
  // save_data_local(fn, { stim: "SimonWord" });
}

const SAVE_DATA = {
  type: jsPsychCallFunction,
  func: save,
  post_trial_gap: 1000,
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function generate_exp() {
  'use strict';

  let exp = [];

  exp.push(fullscreen(true));
  exp.push(welcome_message("de_du"));
  exp.push(resize_browser("de_du"));
  exp.push(vp_info_form("/Common8+/vpInfoForm_de.html"));
  exp.push(mouse_cursor(false));
  exp.push(browser_check(CANVAS_SIZE));
  exp.push(TASK_INSTRUCTIONS1);
  exp.push(TASK_INSTRUCTIONS2);

  // Single-task blocks (randomized order)
  for (let s = 0; s < PRMS.nblks_s; s++) {
    const single_task = PRMS.single_task_order[s];
    exp.push(single_block_start(single_task));
    exp.push(trial_timeline(generate_single_task_trial_table(PRMS.ntrls_s, single_task)));
    exp.push(BLOCK_FEEDBACK);
  }

  // Transition to mixed blocks (if single-task blocks were run)
  if (PRMS.nblks_s > 0) {
    exp.push(MIXED_BLOCKS_INSTRUCTION);
  }

  // Mixed-task blocks
  for (let blk = 0; blk < PRMS.nBlks; blk += 1) {
    exp.push(BLOCK_START);
    exp.push(trial_timeline(generate_trial_table(blk === 0 ? PRMS.nTrlsP : PRMS.nTrlsE)));
    exp.push(BLOCK_FEEDBACK);
  }

  exp.push(SAVE_DATA);
  exp.push(end_message("de_du"));
  exp.push(mouse_cursor(true));
  exp.push(fullscreen(false));

  return exp;
}

const EXP = generate_exp();

jsPsych.run(EXP);
