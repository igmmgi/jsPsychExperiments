// Simon Switch Task:
// Participants switch between color (FARBE) and form (FORM) tasks
// with a pre-trial cue. Stimuli (colored shapes) appear left or right
// of fixation, creating Simon compatibility effects.
// Responses are "Q" (left) and "P" (right) on a QWERTZ keyboard.

const jsPsych = initJsPsych({});

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const PRMS = {
    ntrls_p: 80, // number of trials in first block (practice)
    ntrls_e: 80, // number of trials in subsequent blocks
    nblks: 10,
    cue_duration: 500, // fixation + cue duration
    feedback_duration: 2000, // error feedback duration
    iti: 500, // blank inter-trial interval
    too_fast: 150,
    too_slow: 2500,
    resp_keys: ["Q", "P"],
    feedback_text: ["", "Fehler!", "Zu langsam!", "Zu schnell!"],
    background_color: "rgb(220,220,220)", // grey background
    colors_rgb: { red: "rgb(255,0,0)", green: "rgb(0,255,0)" },
    stim_size: 80, // stimulus size in pixels
    stim_eccentricity: 400, // pixels from center
    cue_fontsize: 30,
    fix_fontsize: 50,
    instruction_fontsize: 24,
    feedback_fontsize: 36,
    feedback_mapping_width: 500,
    icon_size: 24, // inline shape icon size in instructions/feedback
    ctrl: 1, // count trials
    cblk: 1, // count blocks
    previous_task: null, // track task switches
};

////////////////////////////////////////////////////////////////////////
//                    Randomized S-R Mappings                         //
////////////////////////////////////////////////////////////////////////
// Randomly assign colors to keys (per participant)
const color_mapping = shuffle(["red", "green"]);
const COLOR_KEY_MAP = {
    [color_mapping[0]]: PRMS.resp_keys[0], // first color -> Q (left)
    [color_mapping[1]]: PRMS.resp_keys[1], // second color -> P (right)
};

// Randomly assign shapes to keys (per participant)
const shape_mapping = shuffle(["circle", "triangle"]);
const SHAPE_KEY_MAP = {
    [shape_mapping[0]]: PRMS.resp_keys[0], // first shape -> Q (left)
    [shape_mapping[1]]: PRMS.resp_keys[1], // second shape -> P (right)
};

// Helper: translate key to side label
function key_to_side(key) {
    return key === PRMS.resp_keys[0] ? "links" : "rechts";
}

// Color display names for instructions
const COLOR_NAMES = { red: "Rot", green: "Grün" };
const SHAPE_NAMES = { circle: "Kreis", triangle: "Dreieck" };

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const TASK_INSTRUCTIONS1 = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
        let html = `<div style='text-align:center; font-size:${PRMS.instruction_fontsize}px; line-height:1.8;'>`;
        html += "<h2>Willkommen zum Experiment!</h2><br>";
        html += "In diesem Experiment wirst du in jedem Durchgang entweder auf die <b>Farbe</b> ";
        html += "oder die <b>Form</b> eines Objekts reagieren.<br><br>";
        html += "Vor jedem Durchgang zeigt ein Hinweisreiz an, welche Aufgabe relevant ist:<br><br>";
        html += "<b>FARBE</b> = Reagiere auf die Farbe<br>";
        html += "<b>FORM</b> = Reagiere auf die Form<br><br>";
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

        // Color mapping (Q-mapped first, P-mapped second)
        html += "<b>Farbaufgabe (FARBE):</b><br>";
        const colors_sorted = ["red", "green"].sort((a, b) => (COLOR_KEY_MAP[a] === PRMS.resp_keys[0] ? -1 : 1));
        for (let color of colors_sorted) {
            html +=
                `<span style='color:${PRMS.colors_rgb[color]}; font-weight:bold;'>` +
                COLOR_NAMES[color] +
                "</span> → " +
                '"' +
                COLOR_KEY_MAP[color] +
                '" (' +
                key_to_side(COLOR_KEY_MAP[color]) +
                ")<br>";
        }

        // Shape mapping with inline SVG icons (Q-mapped first, P-mapped second)
        const s = PRMS.icon_size;
        const shape_svgs = {
            circle: `<svg width="${s}" height="${s}" style="vertical-align:middle; margin-right:4px;"><circle cx="${s / 2}" cy="${s / 2}" r="${s / 2 - 2}" fill="grey" /></svg>`,
            triangle: `<svg width="${s}" height="${s}" style="vertical-align:middle; margin-right:4px;"><polygon points="${s / 2},2 2,${s - 2} ${s - 2},${s - 2}" fill="grey" /></svg>`,
        };

        html += "<br><b>Formaufgabe (FORM):</b><br>";
        const shapes_sorted = ["circle", "triangle"].sort((a, b) => (SHAPE_KEY_MAP[a] === PRMS.resp_keys[0] ? -1 : 1));
        for (let shape of shapes_sorted) {
            html +=
                shape_svgs[shape] +
                SHAPE_NAMES[shape] +
                " → " +
                '"' +
                SHAPE_KEY_MAP[shape] +
                '" (' +
                key_to_side(SHAPE_KEY_MAP[shape]) +
                ")<br>";
        }

        html += "<br>Reagiere so schnell und korrekt wie möglich!<br><br>";
        html += "Drücke eine beliebige Taste, um zu beginnen.";
        html += "</div>";
        return html;
    },
};

////////////////////////////////////////////////////////////////////////
//                         Stimulus Functions                         //
////////////////////////////////////////////////////////////////////////

// Generate SVG stimulus
function create_stimulus_html(color, shape, position) {
    const offset = position === "left" ? -PRMS.stim_eccentricity : PRMS.stim_eccentricity;
    const rgb = PRMS.colors_rgb[color];
    const size = PRMS.stim_size;

    let shape_svg;
    if (shape === "circle") {
        shape_svg = `<circle cx="${size}" cy="${size}" r="${size * 0.8}" fill="${rgb}" />`;
    } else {
        // equilateral triangle pointing up
        const h = size * 1.6;
        const w = size * 1.6;
        const x1 = size; // top
        const y1 = size - h / 2;
        const x2 = size - w / 2; // bottom-left
        const y2 = size + h / 2;
        const x3 = size + w / 2; // bottom-right
        const y3 = size + h / 2;
        shape_svg = `<polygon points="${x1},${y1} ${x2},${y2} ${x3},${y3}" fill="${rgb}" />`;
    }

    return `<div style="position:relative; display:flex; justify-content:center; align-items:center; height:${size * 2 + 20}px;">
        <svg width="${size * 2}" height="${size * 2}" style="position:relative; left:${offset}px;">
            ${shape_svg}
        </svg>
    </div>`;
}

// Generate cue + fixation display
function create_cue_html(task) {
    const cue_word = task === "FARBE" ? "FARBE" : "FORM";
    return `<div style="display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:monospace;">
        <div style="font-size:${PRMS.cue_fontsize}px; font-weight:bold; margin-bottom:10px;">${cue_word}</div>
        <div style="font-size:${PRMS.fix_fontsize}px;">+</div>
        <div style="font-size:${PRMS.cue_fontsize}px; font-weight:bold; margin-top:10px;">${cue_word}</div>
    </div>`;
}

////////////////////////////////////////////////////////////////////////
//                         Trial Generation                          //
////////////////////////////////////////////////////////////////////////
function generate_trial_table(ntrls) {
    const colors = ["red", "green"];
    const shapes = ["circle", "triangle"];
    const positions = ["left", "right"];
    const tasks = ["FARBE", "FORM"];

    // Build all 16 factorial combinations
    let base_trials = [];
    for (let color of colors) {
        for (let shape of shapes) {
            for (let position of positions) {
                for (let task of tasks) {
                    const correct_key = task === "FARBE" ? COLOR_KEY_MAP[color] : SHAPE_KEY_MAP[shape];
                    const correct_side = correct_key === PRMS.resp_keys[0] ? "left" : "right";
                    const simon_congruency = position === correct_side ? "congruent" : "incongruent";

                    // Stimulus congruency: does the irrelevant dimension map to the same response?
                    const irrelevant_key = task === "FARBE" ? SHAPE_KEY_MAP[shape] : COLOR_KEY_MAP[color];
                    const stimulus_congruency = correct_key === irrelevant_key ? "congruent" : "incongruent";

                    base_trials.push({
                        color: color,
                        shape: shape,
                        position: position,
                        task: task,
                        correct_key: correct_key,
                        simon_congruency: simon_congruency,
                        stimulus_congruency: stimulus_congruency,
                    });
                }
            }
        }
    }

    // Repeat and shuffle for balanced design
    const nreps = ntrls / base_trials.length;
    let trials = [];
    for (let r = 0; r < nreps; r++) {
        trials = trials.concat(base_trials.map((t) => ({ ...t })));
    }
    return shuffle(trials);
}

////////////////////////////////////////////////////////////////////////
//                        Trial Components                            //
////////////////////////////////////////////////////////////////////////

const CUE_FIXATION = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
        return create_cue_html(jsPsych.evaluateTimelineVariable("task"));
    },
    response_ends_trial: false,
    trial_duration: PRMS.cue_duration,
    data: { stim: "cue" },
};

function code_trial() {
    "use strict";
    let dat = jsPsych.data.get().last(1).values()[0];
    dat.rt = dat.rt !== null ? dat.rt : PRMS.too_slow;

    let corr_code = 0;
    let correct_key = jsPsych.pluginAPI.compareKeys(dat.response, dat.correct_key);

    if (correct_key && dat.rt > PRMS.too_fast && dat.rt < PRMS.too_slow) {
        corr_code = 1; // correct
    } else if (!correct_key && dat.rt > PRMS.too_fast && dat.rt < PRMS.too_slow) {
        corr_code = 2; // choice error
    } else if (dat.rt >= PRMS.too_slow) {
        corr_code = 3; // too slow
    } else if (dat.rt <= PRMS.too_fast) {
        corr_code = 4; // too fast
    }

    // Task transition (switch vs. repeat)
    let transition = "na";
    if (PRMS.previous_task !== null) {
        transition = PRMS.previous_task === dat.task ? "repeat" : "switch";
    }
    PRMS.previous_task = dat.task;

    jsPsych.data.addDataToLastTrial({
        date: Date(),
        block_num: PRMS.cblk,
        trial_num: PRMS.ctrl,
        corr_code: corr_code,
        transition: transition,
    });

    // Debug output
    // console.log(
    //     `B${PRMS.cblk} T${PRMS.ctrl} | task:${dat.task} trans:${transition} | ` +
    //     `${dat.color} ${dat.shape} @${dat.position} | simon:${dat.simon_congruency} stim:${dat.stimulus_congruency} | ` +
    //     `resp:${dat.response} correct:${dat.correct_key} | corr_code:${corr_code} rt:${dat.rt}`
    // );
}

const SIMON_STIMULUS = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
        return create_stimulus_html(
            jsPsych.evaluateTimelineVariable("color"),
            jsPsych.evaluateTimelineVariable("shape"),
            jsPsych.evaluateTimelineVariable("position"),
        );
    },
    trial_duration: PRMS.too_slow,
    response_ends_trial: true,
    choices: PRMS.resp_keys,
    data: {
        stim: "simon_switch",
        color: jsPsych.timelineVariable("color"),
        shape: jsPsych.timelineVariable("shape"),
        position: jsPsych.timelineVariable("position"),
        task: jsPsych.timelineVariable("task"),
        correct_key: jsPsych.timelineVariable("correct_key"),
        simon_congruency: jsPsych.timelineVariable("simon_congruency"),
        stimulus_congruency: jsPsych.timelineVariable("stimulus_congruency"),
    },
    on_finish: function () {
        code_trial();
        PRMS.ctrl += 1;
    },
};

// Feedback: blank after correct, informative after error
const TRIAL_FEEDBACK = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "",
    response_ends_trial: false,
    trial_duration: 0,
    on_start: function (trial) {
        let dat = jsPsych.data.get().last(1).values()[0];
        if (dat.corr_code === 1) {
            // Correct: just a short blank
            trial.trial_duration = PRMS.iti;
            trial.stimulus = "";
        } else {
            // Error: show feedback with correct mapping (spatially compatible)
            trial.trial_duration = PRMS.feedback_duration;
            let feedback_msg = PRMS.feedback_text[dat.corr_code - 1];

            // Build spatially compatible mapping: left-key option on left, right-key option on right
            let left_label, right_label;
            if (dat.task === "FARBE") {
                // Find which color maps to Q (left) and which to P (right)
                for (let color of ["red", "green"]) {
                    const label = `<span style="color:${PRMS.colors_rgb[color]}; font-weight:bold;">${COLOR_NAMES[color]}</span>`;
                    if (COLOR_KEY_MAP[color] === PRMS.resp_keys[0]) {
                        left_label = label;
                    } else {
                        right_label = label;
                    }
                }
            } else {
                // Find which shape maps to Q (left) and which to P (right)
                const s = PRMS.icon_size;
                const shape_svgs = {
                    circle: `<svg width="${s}" height="${s}" style="vertical-align:middle;"><circle cx="${s / 2}" cy="${s / 2}" r="${s / 2 - 2}" fill="grey" /></svg>`,
                    triangle: `<svg width="${s}" height="${s}" style="vertical-align:middle;"><polygon points="${s / 2},2 2,${s - 2} ${s - 2},${s - 2}" fill="grey" /></svg>`,
                };
                for (let shape of ["circle", "triangle"]) {
                    const label = shape_svgs[shape] + " " + SHAPE_NAMES[shape];
                    if (SHAPE_KEY_MAP[shape] === PRMS.resp_keys[0]) {
                        left_label = label;
                    } else {
                        right_label = label;
                    }
                }
            }

            let mapping_html =
                `<div style="display:flex; justify-content:space-between; align-items:center; width:${PRMS.feedback_mapping_width}px; margin:20px auto 0;">` +
                '<div style="text-align:center;"><div style="margin-bottom:10px;">"Q"</div>' +
                left_label +
                "</div>" +
                '<div style="text-align:center;"><div style="margin-bottom:10px;">"P"</div>' +
                right_label +
                "</div>" +
                "</div>";

            trial.stimulus =
                `<div style="font-size:${PRMS.feedback_fontsize}px; text-align:center;">` +
                "<b>" +
                feedback_msg +
                "</b>" +
                mapping_html +
                "</div>";
        }
    },
};

const BLOCK_FEEDBACK = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "",
    response_ends_trial: true,
    on_start: function (trial) {
        let block_dvs = calculate_block_performance({
            filter_options: { stim: "simon_switch", block_num: PRMS.cblk },
        });
        trial.stimulus = block_feedback_text(PRMS.cblk, PRMS.nblks, block_dvs.mean_rt, block_dvs.error_rate, "de");
    },
    on_finish: function () {
        PRMS.ctrl = 1;
        PRMS.cblk += 1;
        PRMS.previous_task = null; // reset transition tracking for new block
    },
};

////////////////////////////////////////////////////////////////////////
//                              Save                                  //
////////////////////////////////////////////////////////////////////////
const DIR_NAME = get_dir_name();
const EXP_NAME = get_file_name();
const VP_NUM = get_time();

function save() {
    jsPsych.data.addProperties({ vp_num: VP_NUM });

    // // Add S-R mapping info to all data
    // jsPsych.data.addProperties({
    //     color_key_red: COLOR_KEY_MAP["red"],
    //     color_key_green: COLOR_KEY_MAP["green"],
    //     shape_key_circle: SHAPE_KEY_MAP["circle"],
    //     shape_key_triangle: SHAPE_KEY_MAP["triangle"],
    // });

    const fn = `${DIR_NAME}data/${EXP_NAME}_${VP_NUM}`;
    save_data_server("/Common8+/write_data.php", fn, { stim: "simon_switch" });
    // save_data_local(fn, { stim: "simon_switch" });
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

    // Set background color
    exp.push({
        type: jsPsychCallFunction,
        func: function () {
            document.body.style.backgroundColor = PRMS.background_color;
        },
    });

    exp.push(fullscreen(true));
    exp.push(browser_check([720, 960]));
    exp.push(resize_browser());
    exp.push(welcome_message());
    exp.push(vp_info_form());
    exp.push(mouse_cursor(false));
    exp.push(TASK_INSTRUCTIONS1);
    exp.push(TASK_INSTRUCTIONS2);

    for (let blk = 0; blk < PRMS.nblks; blk += 1) {
        let blk_timeline = {
            timeline: [CUE_FIXATION, SIMON_STIMULUS, TRIAL_FEEDBACK],
            timeline_variables: generate_trial_table(blk === 0 ? PRMS.ntrls_p : PRMS.ntrls_e),
        };
        exp.push(blk_timeline);
        exp.push(BLOCK_FEEDBACK);
    }

    exp.push(SAVE_DATA);
    exp.push(end_message());
    exp.push(mouse_cursor(true));
    exp.push(fullscreen(false));

    return exp;
}

const EXP = generate_exp();

// jsPsych.simulate(EXP, "data-only");
// jsPsych.simulate(EXP, "visual");
jsPsych.run(EXP);
