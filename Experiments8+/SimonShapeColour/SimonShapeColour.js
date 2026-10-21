// B.Sc. Project DMC SimonShapeColour
// Simon task with randomly generated shape outlines (rounded vs. jagged)
// made up of red and blue dots (more blue vs. more red).
// Stimuli appear left or right of screen location (Simon spatial effect).
// Participants respond with left ('Q') and right ('P') key presses.

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
const CANVAS_COLOUR = "rgba(220, 220, 220, 1)";
const CANVAS_SIZE = [720, 1024]; // height, width

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
  ntrls_p: 80, // number of trials in first mixed block (practice, multiple of 16)
  ntrls_e: 80, // number of trials in subsequent mixed blocks (multiple of 16)
  nblks_s: 2,  // number of single-task blocks (random FORM / FARBE order)
  nblks: 10,   // number of mixed blocks
  single_task_order: shuffle(["FORM", "FARBE"]), // randomized order of single-task blocks
  fix_dur: 0, // no fixation cross, cue presented directly
  fb_dur: [0, 2000, 2000, 2000], // error feedback 2000ms, correct feedback 0ms
  cue_dur: 750, // cue duration in ms
  iti: 500, // blank inter-trial interval
  too_fast: 150,
  too_slow: 3500,
  fb_txt: ["Richtig", "Falsch", "Zu langsam", "Zu schnell"],
  fb_size: "30px monospace",
  instruction_fontsize: 24,
  wait_duration: 1000,
  ctrl: 1, // count trials
  cblk: 1, // count blocks
  resp_keys: ["q", "p"],
  resp_keys_shape: {},
  resp_keys_colour: {},
  stim_pos_x: 400, // eccentricity: 400 pixels left/right from center
  stim_pos_y: 0,
  cue_size: "40px monospace",
  previous_task: null, // track task transitions (repeat vs switch)

  // Dot & Shape Parameters (easy to configure)
  n_dots: 80, // number of dots forming the shape outline
  dot_radius: 4.5, // radius of each dot in pixels
  dot_ratio: [65, 35], // [dominant_pct, non_dominant_pct] (e.g. 65% vs 35%)
  colours: {
    blue: "rgb(30, 100, 255)",
    red: "rgb(235, 40, 40)",
  },
  base_radius: 70, // base radius of shape in pixels
};

////////////////////////////////////////////////////////////////////////
//                    Randomized S-R Mappings                         //
////////////////////////////////////////////////////////////////////////
const VERSION = Number(jsPsych.data.urlVariables().version) || (Math.random() < 0.5 ? 1 : 2);

jsPsych.data.addProperties({
  version: VERSION,
  single_task_order: PRMS.single_task_order.join(","),
  dot_ratio: PRMS.dot_ratio.join("/"),
  n_dots: PRMS.n_dots,
});

if (VERSION === 1) {
  // Shape: Rounded = Q (left), Jagged = P (right)
  // Colour: More Blue = Q (left), More Red = P (right)
  PRMS.resp_keys_shape = { rounded: "q", jagged: "p" };
  PRMS.resp_keys_colour = { blue: "q", red: "p" };
} else if (VERSION === 2) {
  // Shape: Jagged = Q (left), Rounded = P (right)
  // Colour: More Blue = Q (left), More Red = P (right)
  PRMS.resp_keys_shape = { rounded: "p", jagged: "q" };
  PRMS.resp_keys_colour = { blue: "q", red: "p" };
}

function get_task_mapping_html(task) {
  let html = "";
  if (task === "FORM") {
    html += "<b>Formaufgabe (FORM):</b><br>";
    if (PRMS.resp_keys_shape.rounded === "q") {
      html += 'Abgerundet → "Q" (linker Zeigefinger)<br>';
      html += 'Zackig → "P" (rechter Zeigefinger)<br>';
    } else {
      html += 'Zackig → "Q" (linker Zeigefinger)<br>';
      html += 'Abgerundet → "P" (rechter Zeigefinger)<br>';
    }
  } else if (task === "FARBE") {
    html += "<b>Farbaufgabe (FARBE):</b><br>";
    if (PRMS.resp_keys_colour.blue === "q") {
      html += '<span style="color:blue; font-weight:bold;">Mehr Blau</span> → "Q" (linker Zeigefinger)<br>';
      html += '<span style="color:red; font-weight:bold;">Mehr Rot</span> → "P" (rechter Zeigefinger)<br>';
    } else {
      html += '<span style="color:red; font-weight:bold;">Mehr Rot</span> → "Q" (linker Zeigefinger)<br>';
      html += '<span style="color:blue; font-weight:bold;">Mehr Blau</span> → "P" (rechter Zeigefinger)<br>';
    }
  }
  return html;
}

function get_full_mapping_html() {
  return get_task_mapping_html("FORM") + "<br>" + get_task_mapping_html("FARBE");
}

////////////////////////////////////////////////////////////////////////
//                      Shape & Dot Generators                        //
////////////////////////////////////////////////////////////////////////

// Helper: Distribute dots evenly along any closed polyline/spline using cumulative arc length
function distribute_dots_along_path(path_points, num_dots) {
  const cum_lens = [0];
  for (let i = 1; i < path_points.length; i++) {
    const dx = path_points[i].x - path_points[i - 1].x;
    const dy = path_points[i].y - path_points[i - 1].y;
    cum_lens.push(cum_lens[cum_lens.length - 1] + Math.hypot(dx, dy));
  }
  const total_len = cum_lens[cum_lens.length - 1];

  const dots = [];
  for (let d = 0; d < num_dots; d++) {
    const target_len = (d / num_dots) * total_len;
    let idx = 0;
    while (idx < path_points.length - 2 && cum_lens[idx + 1] < target_len) {
      idx++;
    }
    const seg_len = cum_lens[idx + 1] - cum_lens[idx];
    const frac = seg_len > 0 ? (target_len - cum_lens[idx]) / seg_len : 0;
    const x = path_points[idx].x + frac * (path_points[idx + 1].x - path_points[idx].x);
    const y = path_points[idx].y + frac * (path_points[idx + 1].y - path_points[idx].y);
    dots.push({ x, y });
  }
  return dots;
}

// Generates dots along a smooth, multi-lobed organic rounded contour (amoeba/cloud/clover/peanut)
// Guarantees pronounced rounded lobes without collapsing into a plain circle
function generate_rounded_outline(cx, cy, base_radius, num_dots) {
  // Choose 2 distinct low-frequency harmonic modes:
  // 2 (peanut/dumbbell), 3 (clover/trefoil), 4 (quad-lobe), 5 (penta-lobe)
  const available_modes = [2, 3, 4, 5];
  const idx1 = Math.floor(Math.random() * available_modes.length);
  const m1 = available_modes.splice(idx1, 1)[0];
  const idx2 = Math.floor(Math.random() * available_modes.length);
  const m2 = available_modes[idx2];

  const amp1 = base_radius * (0.18 + Math.random() * 0.12); // primary lobe amplitude (18% - 30%)
  const amp2 = base_radius * (0.08 + Math.random() * 0.10); // secondary lobe amplitude (8% - 18%)
  const phase1 = Math.random() * Math.PI * 2;
  const phase2 = Math.random() * Math.PI * 2;

  const res = 240;
  const points = [];
  for (let i = 0; i <= res; i++) {
    const theta = (i / res) * Math.PI * 2;
    const r = base_radius + amp1 * Math.sin(m1 * theta + phase1) + amp2 * Math.cos(m2 * theta + phase2);
    points.push({
      x: cx + r * Math.cos(theta),
      y: cy + r * Math.sin(theta),
    });
  }

  return distribute_dots_along_path(points, num_dots);
}

// Generates dots along a craggy, fractured jagged polygon (crystal/shard)
// Breaks radial symmetry: uses an irregular base polygon with sharp edge-normal zig-zags
function generate_jagged_outline(cx, cy, base_radius, num_dots) {
  const n_base = 6 + Math.floor(Math.random() * 3); // 6, 7, or 8 base vertices for richer facets
  const weights = [];
  let w_sum = 0;
  for (let i = 0; i < n_base; i++) {
    const w = 0.75 + Math.random() * 0.60;
    weights.push(w);
    w_sum += w;
  }

  let a = Math.random() * Math.PI * 2;
  const base_pts = [];
  for (let i = 0; i < n_base; i++) {
    a += (weights[i] / w_sum) * Math.PI * 2;
    const r = base_radius * (0.78 + Math.random() * 0.40); // 0.78 to 1.18
    base_pts.push({
      x: cx + r * Math.cos(a),
      y: cy + r * Math.sin(a),
    });
  }

  // Subdivide each edge with sharp perpendicular zig-zag displacements
  const jagged_pts = [];
  for (let i = 0; i < n_base; i++) {
    const p1 = base_pts[i];
    const p2 = base_pts[(i + 1) % n_base];
    jagged_pts.push(p1);

    const sub = 2 + Math.floor(Math.random() * 3); // 2, 3, or 4 segments (1 to 3 sharp teeth per edge)
    const edge_dx = p2.x - p1.x;
    const edge_dy = p2.y - p1.y;
    const edge_len = Math.hypot(edge_dx, edge_dy);
    const nx = -edge_dy / edge_len;
    const ny = edge_dx / edge_len;

    for (let k = 1; k < sub; k++) {
      const t = k / sub + (Math.random() - 0.5) * 0.10;
      let direction = k % 2 === 1 ? 1 : -1;
      if (Math.random() < 0.20) {
        direction = -direction;
      }
      const max_off = Math.min(0.48 * edge_len, 0.42 * base_radius);
      const offset = direction * (0.35 * max_off + Math.random() * 0.65 * max_off);
      const mid_x = p1.x + t * edge_dx + nx * offset;
      const mid_y = p1.y + t * edge_dy + ny * offset;
      jagged_pts.push({ x: mid_x, y: mid_y });
    }
  }
  jagged_pts.push(jagged_pts[0]); // close polygon
  return distribute_dots_along_path(jagged_pts, num_dots);
}

// Assigns dominant and non-dominant dot colours based on PRMS.dot_ratio
function create_dot_colours(num_dots, target_colour, ratio) {
  const dominant_count = Math.round(num_dots * (ratio[0] / 100));
  const non_dominant_count = num_dots - dominant_count;

  const col_target = target_colour === "blue" ? PRMS.colours.blue : PRMS.colours.red;
  const col_other = target_colour === "blue" ? PRMS.colours.red : PRMS.colours.blue;

  let colours = [];
  for (let i = 0; i < dominant_count; i++) {
    colours.push(col_target);
  }
  for (let i = 0; i < non_dominant_count; i++) {
    colours.push(col_other);
  }
  return shuffle(colours);
}

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const TASK_INSTRUCTIONS1 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function () {
    let html = `<div style='text-align:center; font-size:${PRMS.instruction_fontsize}px; line-height:1.8;'>`;
    html += "<h2>Willkommen zum Experiment!</h2>";
    html += "In diesem Experiment wirst du in jedem Durchgang entweder auf die <b>Form</b> ";
    html += "oder die <b>Farbe</b> einer Punktfigur reagieren.<br><br>";
    html += "Die Figuren bestehen aus kleinen roten und blauen Punkten.<br><br>";
    html += "Vor jedem Durchgang zeigt ein Hinweiswort (FORM od. FARBE) in der Mitte des Bildschirms an, welche Aufgabe relevant ist:<br><br>";
    html += "<b>FORM</b> = Entscheide, ob die Umrissform <b>abgerundet</b> oder <b>zackig</b> ist<br>";
    html += "<b>FARBE</b> = Entscheide, ob die Figur aus <b>mehr blauen</b> oder <b>mehr roten</b> Punkten besteht<br><br>";
    html += "Drücke eine beliebige Taste, um die Tastenzuordnungen zu sehen.";
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
      html += `<h2>Block ${PRMS.cblk} von ${PRMS.nblks + PRMS.nblks_s}</h2><br>`;
      const task_name = task === "FORM" ? "Form (Abgerundet vs. Zackig)" : "Farbe (Mehr Blau vs. Mehr Rot)";
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
    html += "Ab jetzt wechseln sich die beiden Aufgaben (<b>FORM</b> und <b>FARBE</b>) zufällig ab.<br><br>";
    html += "Vor jedem Durchgang zeigt ein Hinweiswort an, welche Aufgabe relevant ist:<br><br>";
    html += "<b>FORM</b> = Entscheide, ob die Figur abgerundet oder zackig ist<br>";
    html += "<b>FARBE</b> = Entscheide, ob die Figur mehr blaue oder mehr rote Punkte enthält<br><br>";
    html += "Drücke eine beliebige Taste, um fortzufahren.";
    html += "</div>";
    return html;
  },
};

const BLOCK_START = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function () {
    let html = `<div style='text-align:center; font-size:${PRMS.instruction_fontsize}px; line-height:1.8;'>`;
    html += `<h2>Block ${PRMS.cblk} von ${PRMS.nblks + PRMS.nblks_s}</h2><br>`;
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
const TASK_CUE = {
  type: jsPsychCanvasKeyboardResponse,
  canvas_size: CANVAS_SIZE,
  trial_duration: PRMS.cue_dur,
  response_ends_trial: false,
  choices: "NO_KEYS",
  stimulus: function (c) {
    let ctx = c.getContext("2d");
    ctx.translate(c.width / 2, c.height / 2);
    ctx.font = PRMS.cue_size;
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(jsPsych.evaluateTimelineVariable("cue"), 0, 0);
  },
};

function code_trial() {
  "use strict";
  let dat = jsPsych.data.get().last(1).values()[0];
  let corrCode = 0;

  let rt = dat.rt !== null ? dat.rt : PRMS.too_slow;
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
  let transition = "na";
  if (PRMS.previous_task !== null) {
    transition = PRMS.previous_task === dat.task ? "repeat" : "switch";
  }
  PRMS.previous_task = dat.task;

  jsPsych.data.addDataToLastTrial({
    date: Date(),
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
  if (jsPsych.pluginAPI.compareKeys(dat.response, "escape")) {
    jsPsych.endExperiment();
  }
}

const SHAPE_STIMULUS = {
  type: jsPsychCanvasKeyboardResponse,
  canvas_size: CANVAS_SIZE,
  trial_duration: PRMS.too_slow,
  response_ends_trial: true,
  choices: ["q", "p", "escape"],
  stimulus: function (c) {
    let ctx = c.getContext("2d");
    ctx.translate(c.width / 2, c.height / 2);

    let pos = jsPsych.evaluateTimelineVariable("position");
    let cue = jsPsych.evaluateTimelineVariable("cue");
    let shape = jsPsych.evaluateTimelineVariable("shape");
    let colour = jsPsych.evaluateTimelineVariable("colour");

    // Draw central task cue
    ctx.font = PRMS.cue_size;
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(cue, 0, 0);

    // Calculate stimulus x offset
    const offset_x = pos === "left" ? -PRMS.stim_pos_x : PRMS.stim_pos_x;
    const offset_y = PRMS.stim_pos_y;

    // Generate outline dots
    const dots =
      shape === "rounded"
        ? generate_rounded_outline(offset_x, offset_y, PRMS.base_radius, PRMS.n_dots)
        : generate_jagged_outline(offset_x, offset_y, PRMS.base_radius, PRMS.n_dots);

    // Generate dot colours
    const dot_colours = create_dot_colours(PRMS.n_dots, colour, PRMS.dot_ratio);

    // Draw all dots
    for (let i = 0; i < dots.length; i++) {
      ctx.beginPath();
      ctx.arc(dots[i].x, dots[i].y, PRMS.dot_radius, 0, Math.PI * 2);
      ctx.fillStyle = dot_colours[i];
      ctx.fill();
    }
  },
  data: {
    stim: "SimonShapeColour",
    task: jsPsych.timelineVariable("task"),
    cue: jsPsych.timelineVariable("cue"),
    shape: jsPsych.timelineVariable("shape"),
    colour: jsPsych.timelineVariable("colour"),
    position: jsPsych.timelineVariable("position"),
    corrResp: jsPsych.timelineVariable("corrResp"),
    correct_key: jsPsych.timelineVariable("corrResp"),
    comp: jsPsych.timelineVariable("comp"),
    simon_congruency: jsPsych.timelineVariable("comp"),
    stim_congruency: jsPsych.timelineVariable("stim_congruency"),
    block_type: jsPsych.timelineVariable("block_type"),
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
    let ctx = c.getContext("2d");
    ctx.translate(c.width / 2, c.height / 2);
    let dat = jsPsych.data.get().last(1).values()[0];
    if (dat && dat.corrCode && PRMS.fb_dur[dat.corrCode - 1] > 0) {
      ctx.font = PRMS.fb_size;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "black";
      ctx.fillText(PRMS.fb_txt[dat.corrCode - 1], 0, 0);
    }
  },
  on_start: function (trial) {
    let dat = jsPsych.data.get().last(1).values()[0];
    trial.trial_duration = dat && dat.corrCode ? PRMS.fb_dur[dat.corrCode - 1] : 0;
  },
};

const ITI = {
  type: jsPsychCanvasKeyboardResponse,
  canvas_size: CANVAS_SIZE,
  trial_duration: PRMS.iti,
  response_ends_trial: false,
  choices: "NO_KEYS",
  stimulus: function (c) {},
};

const BLOCK_FEEDBACK = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: "",
  response_ends_trial: true,
  post_trial_gap: PRMS.wait_duration,
  on_start: function (trial) {
    let block_dvs = calculate_block_performance({
      filter_options: { stim: "SimonShapeColour", blockNum: PRMS.cblk },
      corr_column: "corrCode",
    });
    let text = block_feedback_text(PRMS.cblk, PRMS.nblks + PRMS.nblks_s, block_dvs.mean_rt, block_dvs.error_rate, "de");
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

// Single-task trial table: 2 shapes × 2 colours × 2 positions = 8 base trials
function generate_single_task_trial_table(ntrls, task) {
  const shapes = ["rounded", "jagged"];
  const colours = ["blue", "red"];
  const positions = ["left", "right"];

  let base_trials = [];
  for (let shape of shapes) {
    for (let colour of colours) {
      for (let position of positions) {
        const corrResp = task === "FORM" ? PRMS.resp_keys_shape[shape] : PRMS.resp_keys_colour[colour];
        const irrelevantResp = task === "FORM" ? PRMS.resp_keys_colour[colour] : PRMS.resp_keys_shape[shape];
        const comp =
          (position === "left" && corrResp.toLowerCase() === "q") || (position === "right" && corrResp.toLowerCase() === "p")
            ? "comp"
            : "incomp";
        const stim_congruency = corrResp === irrelevantResp ? "congruent" : "incongruent";

        base_trials.push({
          task: task,
          cue: task,
          shape: shape,
          colour: colour,
          position: position,
          corrResp: corrResp,
          correct_key: corrResp,
          comp: comp,
          simon_congruency: comp,
          stim_congruency: stim_congruency,
          block_type: "single",
        });
      }
    }
  }

  const nreps = Math.floor(ntrls / base_trials.length);
  let trials = [];
  for (let r = 0; r < nreps; r++) {
    trials = trials.concat(base_trials.map((t) => ({ ...t })));
  }
  return shuffle(trials);
}

// Mixed-task trial table: 2 tasks × 2 shapes × 2 colours × 2 positions = 16 base trials
function generate_trial_table(ntrls) {
  const tasks = ["FORM", "FARBE"];
  const shapes = ["rounded", "jagged"];
  const colours = ["blue", "red"];
  const positions = ["left", "right"];

  let base_trials = [];
  for (let task of tasks) {
    for (let shape of shapes) {
      for (let colour of colours) {
        for (let position of positions) {
          const corrResp = task === "FORM" ? PRMS.resp_keys_shape[shape] : PRMS.resp_keys_colour[colour];
          const irrelevantResp = task === "FORM" ? PRMS.resp_keys_colour[colour] : PRMS.resp_keys_shape[shape];
          const comp =
            (position === "left" && corrResp.toLowerCase() === "q") || (position === "right" && corrResp.toLowerCase() === "p")
              ? "comp"
              : "incomp";
          const stim_congruency = corrResp === irrelevantResp ? "congruent" : "incongruent";

          base_trials.push({
            task: task,
            cue: task,
            shape: shape,
            colour: colour,
            position: position,
            corrResp: corrResp,
            correct_key: corrResp,
            comp: comp,
            simon_congruency: comp,
            stim_congruency: stim_congruency,
            block_type: "mixed",
          });
        }
      }
    }
  }

  if (ntrls < base_trials.length) {
    return shuffle(base_trials).slice(0, ntrls);
  }

  const nreps = Math.floor(ntrls / base_trials.length);
  let trials = [];
  for (let r = 0; r < nreps; r++) {
    trials = trials.concat(base_trials.map((t) => ({ ...t })));
  }
  return shuffle(trials);
}

function trial_timeline(timeline_variables) {
  return {
    timeline: [TASK_CUE, SHAPE_STIMULUS, TRIAL_FEEDBACK, ITI],
    timeline_variables: timeline_variables,
  };
}

////////////////////////////////////////////////////////////////////////
//                              Save                                  //
////////////////////////////////////////////////////////////////////////
function save() {
  jsPsych.data.addProperties({ vpNum: VP_NUM });
  const fn = `${DIR_NAME}data/${EXP_NAME}_${VP_NUM}`;
  save_data_server("/Common8+/write_data.php", fn, { stim: "SimonShapeColour" });
  // save_data_local(fn, { stim: "SimonShapeColour" });
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
  "use strict";

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

  // Transition to mixed blocks
  if (PRMS.nblks_s > 0) {
    exp.push(MIXED_BLOCKS_INSTRUCTION);
  }

  // Mixed-task blocks
  for (let blk = 0; blk < PRMS.nblks; blk += 1) {
    exp.push(BLOCK_START);
    exp.push(trial_timeline(generate_trial_table(blk === 0 ? PRMS.ntrls_p : PRMS.ntrls_e)));
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
