// ==============================================================================
// Ironic Negation in Cognitive Conflict Tasks: Experiment 1 (Simon Task)
//
// 2AFC manual response to square colour (Red vs. Blue) using 'Q' and 'P' keys
// while ignoring lateralized stimulus position (Left vs. Right visual field).
//
// Pre-registered Design: 2 (Instruction: Affirmative vs. Negation) x 2 (Congruency: Congruent vs. Incongruent)
// Split-half session architecture: 2 practice blocks (8 trials each) + 12 experimental blocks (40 trials each)
// Total trials: 496 (16 practice + 480 experimental = 120 trials per condition cell).
// ==============================================================================

"use strict";

////////////////////////////////////////////////////////////////////////
//                       Initialize jsPsych                           //
////////////////////////////////////////////////////////////////////////
const jsPsych = initJsPsych({
    on_finish: function () {
        // Optional automated redirect to Prolific completion URL
        const prolific_code = "C1OYPSA2"; // Pre-registered completion code or placeholder
        const prolific_url = `https://app.prolific.com/submissions/complete?cc=${prolific_code}`;
        // window.location.assign(prolific_url);
    },
});

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const CANVAS_COLOUR = "rgba(248, 250, 252, 1)";
const CANVAS_SIZE = [720, 1024]; // [height, width]

////////////////////////////////////////////////////////////////////////
//                             Metadata                               //
////////////////////////////////////////////////////////////////////////
const DIR_NAME = get_dir_name();
const EXP_NAME = get_file_name();
const VP_NUM = get_time();
const PARTICIPANT_ID = jsPsych.data.urlVariables().PROLIFIC_PID || jsPsych.data.urlVariables().prolific_pid || `P_${VP_NUM}`;
const SIMULATION_MODE = jsPsych.data.urlVariables().simulate || null;

////////////////////////////////////////////////////////////////////////
//                   Counterbalancing & Versions                      //
////////////////////////////////////////////////////////////////////////
// Version 1: Aff-First, Q = Red,  P = Blue
// Version 2: Aff-First, Q = Blue, P = Red
// Version 3: Neg-First, Q = Red,  P = Blue
// Version 4: Neg-First, Q = Blue, P = Red
const VERSION = Number(jsPsych.data.urlVariables().version) || Math.floor(Math.random() * 4) + 1;

const ORDER_LABEL = (VERSION === 1 || VERSION === 2) ? "Aff_First" : "Neg_First";
const KEY_MAPPING_LABEL = (VERSION === 1 || VERSION === 3) ? "Q_Red_P_Blue" : "Q_Blue_P_Red";

const KEY_MAPPING = {
    red: (KEY_MAPPING_LABEL === "Q_Red_P_Blue") ? "q" : "p",
    blue: (KEY_MAPPING_LABEL === "Q_Red_P_Blue") ? "p" : "q",
};

const PHASE1_INSTRUCTION = (ORDER_LABEL === "Aff_First") ? "Affirmative" : "Negation";
const PHASE2_INSTRUCTION = (ORDER_LABEL === "Aff_First") ? "Negation" : "Affirmative";

// Pre-registered instruction texts and post-error reminder phrases (Table 1)
const INSTRUCTION_TEXTS = {
    Affirmative: {
        full: "Focus on the square’s colour. Pay attention to whether the square is red or blue.",
        reminder: "Remember: respond to the square’s colour.",
    },
    Negation: {
        full: "Focus on the square’s colour. Do NOT pay attention to whether the square is on the left or right.",
        reminder: "Remember: do NOT respond to the square’s location.",
    },
};

jsPsych.data.addProperties({
    Participant: PARTICIPANT_ID,
    Experiment: "Simon",
    Order: ORDER_LABEL,
    OrderType: ORDER_LABEL,
    Version: VERSION,
    KeyMapping: KEY_MAPPING_LABEL,
    key_q: (KEY_MAPPING.red === "q") ? "Red" : "Blue",
    key_p: (KEY_MAPPING.red === "p") ? "Red" : "Blue",
});

////////////////////////////////////////////////////////////////////////
//                       Experiment Parameters                        //
////////////////////////////////////////////////////////////////////////
const PRMS = {
    ntrls_practice: 8,       // 8 trials per practice block
    ntrls_exp: 40,           // 40 trials per experimental block
    nblks_phase: 6,          // 6 experimental blocks per phase
    fix_dur: 500,            // 500 ms central white fixation cross
    stim_dur: 2000,          // target display until response or max 2000 ms timeout
    too_fast: 150,           // anticipatory cutoff (< 150 ms)
    too_slow: 2000,          // timeout cutoff (> 2000 ms)
    fb_dur: 2000,            // 2000 ms trial feedback duration for both practice and exp blocks
    iti_min: 400,            // uniform jitter ITI: 400 - 600 ms (mean 500 ms)
    iti_max: 600,
    fix_size: 14,
    fix_width: 3.5,
    fix_colour: "#000000",
    square_size: 90,         // 90x90 px square
    stim_pos_x: 280,         // lateral eccentricity: 280 px left/right
    colours: {
        red: "#dc2626",      // vivid Red (matches Stroop)
        blue: "#2563eb",     // vivid Royal Blue (matches Stroop)
    },
    cblk_overall: 0,         // 1 to 14
    cblk_exp: 0,             // 1 to 12
    ctrl_global: 0,          // 1 to 496
    ctrl_in_block: 0,        // 1 to 40
};

// Global state trackers
let CURRENT_PHASE = 1;
let CURRENT_INSTRUCTION = PHASE1_INSTRUCTION;
let CURRENT_BLOCK_TYPE = "Practice"; // "Practice" or "Experimental"
let previous_trial_error = 0;        // 1 if last trial was error/timeout, 0 otherwise

////////////////////////////////////////////////////////////////////////
//                    Instruction Helper Functions                    //
////////////////////////////////////////////////////////////////////////
function get_key_mapping_html() {
    const q_colour = (KEY_MAPPING.red === "q") ? "Red" : "Blue";
    const p_colour = (KEY_MAPPING.red === "p") ? "Red" : "Blue";
    const q_hex = (KEY_MAPPING.red === "q") ? PRMS.colours.red : PRMS.colours.blue;
    const p_hex = (KEY_MAPPING.red === "p") ? PRMS.colours.red : PRMS.colours.blue;

    return `
        <div class="mapping-container">
            <div class="key-box">
                <kbd>Q</kbd>
                <div class="key-finger">Left Hand (Index Finger)</div>
                <div class="key-target" style="color: ${q_hex};">&#9632; ${q_colour} Square</div>
            </div>
            <div class="key-box">
                <kbd>P</kbd>
                <div class="key-finger">Right Hand (Index Finger)</div>
                <div class="key-target" style="color: ${p_hex};">&#9632; ${p_colour} Square</div>
            </div>
        </div>
    `;
}

function get_full_instruction_box_html(framing) {
    const text = INSTRUCTION_TEXTS[framing].full;
    return `
        <div class="instruction-goal-box">
            “${text}”
        </div>
    `;
}

////////////////////////////////////////////////////////////////////////
//                       Pre-Task Instructions                        //
////////////////////////////////////////////////////////////////////////

// Consent Form & Demographics
const check_consent_form = function () {
    if (document.getElementById("consent_checkbox") && document.getElementById("consent_checkbox").checked) {
        return true;
    } else {
        alert("Please confirm your consent by checking the box to continue.");
        return false;
    }
};

const HTML_CONSENT_FORM = {
    type: jsPsychExternalHtml,
    url: "consent.html",
    cont_btn: "start_experiment",
    check_fn: check_consent_form,
    post_trial_gap: 500,
};

const DEMOGRAPHICS_FORM = {
    type: jsPsychExternalHtml,
    url: "vpInfoForm_en.html",
    cont_btn: "start",
    check_fn: function () {
        const vp_info = check_vp_info_form("en");
        if (vp_info !== false) {
            jsPsych.data.addProperties(vp_info);
            return true;
        }
        return false;
    },
    post_trial_gap: 500,
};

// Phase 1 Welcome & Instructions
const PHASE1_WELCOME_INSTRUCTION = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
        return `
            <div class="instruction-card">
                <div class="instruction-header">Simon Task: Experiment 1</div>
                <p>In this experiment, a square will appear on the left or right side of the screen on each trial.</p>
                <p>Your task is to respond to the <b>colour</b> of the square as quickly and accurately as possible.</p>
                
                ${get_full_instruction_box_html(PHASE1_INSTRUCTION)}
                
                <p>Use the following keyboard keys to respond:</p>
                ${get_key_mapping_html()}
                
                <p>Please place your <b>left index finger on the Q key</b> and your <b>right index finger on the P key</b>.</p>
                <p>We will begin with a short practice block of <b>${PRMS.ntrls_practice} trials</b> with performance feedback.</p>
                
                <div class="prompt-continue">Press any key to start the practice block.</div>
            </div>
        `;
    },
    post_trial_gap: 500,
};

const PRACTICE1_END = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
        return `
            <div class="instruction-card">
                <div class="instruction-header">Practice Complete!</div>
                <p>You have finished the practice trials. You are now ready for the main experiment.</p>
                <p>The first half consists of <b>6 short blocks</b> (40 trials each). Between blocks, you can take a short rest pause.</p>
                
                ${get_full_instruction_box_html(PHASE1_INSTRUCTION)}
                ${get_key_mapping_html()}
                
                <p><b>Important:</b> On correct responses, trials will advance immediately without feedback. If you make an error or respond too slowly, a brief reminder will be shown.</p>
                
                <div class="prompt-continue">Press any key to begin Block 1 of 12.</div>
            </div>
        `;
    },
    post_trial_gap: 500,
    on_finish: function () {
        CURRENT_BLOCK_TYPE = "Experimental";
    },
};

// Pre-Block Refreshing Instruction Screen (Section 4.3: presented prior to every single block)
function create_block_intro(block_idx_in_phase, phase) {
    return {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function () {
            const framing = (phase === 1) ? PHASE1_INSTRUCTION : PHASE2_INSTRUCTION;
            const exp_blk_num = (phase === 1) ? block_idx_in_phase : (PRMS.nblks_phase + block_idx_in_phase);
            return `
                <div class="instruction-card">
                    <div class="instruction-header">Block ${exp_blk_num} of 12 (Phase ${phase})</div>
                    <p>Keep your fingers on the <b>Q</b> and <b>P</b> keys. Respond as quickly and accurately as possible.</p>
                    
                    ${get_full_instruction_box_html(framing)}
                    ${get_key_mapping_html()}
                    
                    <div class="prompt-continue">Press any key to begin this block.</div>
                </div>
            `;
        },
        post_trial_gap: 500,
        on_finish: function () {
            PRMS.cblk_overall += 1;
            PRMS.cblk_exp += 1;
            PRMS.ctrl_in_block = 0;
            previous_trial_error = 0;
            CURRENT_BLOCK_TYPE = "Experimental";
            CURRENT_PHASE = phase;
            CURRENT_INSTRUCTION = (phase === 1) ? PHASE1_INSTRUCTION : PHASE2_INSTRUCTION;
        },
    };
}

// Inter-Block Feedback & Rest Pause
const BLOCK_FEEDBACK = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "",
    response_ends_trial: true,
    post_trial_gap: 500,
    on_start: function (trial) {
        const block_dvs = calculate_block_performance({
            filter_options: { stim: "simon", block_num: PRMS.cblk_overall },
            corr_column: "corr_code",
            corr_value: 1,
            rt_column: "RT",
        });
        let text;
        if (CURRENT_BLOCK_TYPE === "Practice") {
            text = `
                <h2>Practice Block Complete</h2><br>
                <h2>Mean RT: ${block_dvs.mean_rt} ms</h2>
                <h2>Error Rate: ${block_dvs.error_rate} %</h2><br>
                <h2>Press any key to continue!</h2>
            `;
        } else {
            text = block_feedback_text(
                PRMS.cblk_exp,
                PRMS.nblks_phase * 2,
                block_dvs.mean_rt,
                block_dvs.error_rate,
                "en",
            );
        }
        trial.stimulus = `<div class="instruction-card">${text}</div>`;
    },
};

// Mid-Session Transition Screen (Section 4.3)
const MID_SESSION_TRANSITION = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
        return `
            <div class="instruction-card">
                <div class="instruction-header">Halfway Point Reached!</div>
                <p>You have completed the first half of the experiment (Phase 1).</p>
                <p>Please take an extended rest pause to relax your eyes and hands.</p>
                <p style="margin-top: 25px;">When you are refreshed and ready to read the instructions for the second half, press any key.</p>
                <div class="prompt-continue">Press any key to proceed.</div>
            </div>
        `;
    },
    post_trial_gap: 500,
};

// Phase 2 Welcome & Alternative Instruction Framing
const PHASE2_WELCOME_INSTRUCTION = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
        return `
            <div class="instruction-card">
                <div class="instruction-header">Phase 2: New Instructions</div>
                <p style="font-size: 18px; font-weight: 600;">ATTENTION: The instructions for the second half of the experiment are DIFFERENT!</p>
                <p>Please read the following instructions carefully:</p>
                
                ${get_full_instruction_box_html(PHASE2_INSTRUCTION)}
                
                <p>Note: Your response key mappings remain <b>EXACTLY THE SAME</b> as before:</p>
                ${get_key_mapping_html()}
                
                <p>We will now complete a short practice block of <b>${PRMS.ntrls_practice} trials</b> under this new instruction framing.</p>
                <div class="prompt-continue">Press any key to start Practice Block 2.</div>
            </div>
        `;
    },
    post_trial_gap: 500,
    on_finish: function () {
        CURRENT_PHASE = 2;
        CURRENT_INSTRUCTION = PHASE2_INSTRUCTION;
        CURRENT_BLOCK_TYPE = "Practice";
        PRMS.cblk_overall += 1;
        PRMS.ctrl_in_block = 0;
    },
};

const PRACTICE2_END = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
        return `
            <div class="instruction-card">
                <div class="instruction-header">Practice Complete!</div>
                <p>You are now ready to continue with the remaining <b>6 blocks</b> of the experiment under this instruction framing.</p>
                
                ${get_full_instruction_box_html(PHASE2_INSTRUCTION)}
                ${get_key_mapping_html()}
                
                <p>Respond as quickly and accurately as possible.</p>
                <div class="prompt-continue">Press any key to begin Block 7 of 12.</div>
            </div>
        `;
    },
    post_trial_gap: 500,
    on_finish: function () {
        CURRENT_BLOCK_TYPE = "Experimental";
    },
};

////////////////////////////////////////////////////////////////////////
//                       Stimulus & Trial Coding                      //
////////////////////////////////////////////////////////////////////////

function code_trial() {
    const dat = jsPsych.data.get().last(1).values()[0];
    const rt = (dat.rt !== null) ? Math.round(dat.rt) : PRMS.too_slow;
    const response_key = (dat.response !== null) ? dat.response.toLowerCase() : "NA";
    const required_key = dat.required_key.toLowerCase();
    const is_correct_key = (response_key === required_key);

    let corr_code = 0; // 1 = Correct, 2 = Choice error, 3 = Timeout, 4 = Too fast
    let is_correct = 0;

    if (is_correct_key && rt >= PRMS.too_fast && rt < PRMS.too_slow && dat.response !== null) {
        corr_code = 1;
        is_correct = 1;
    } else if (!is_correct_key && rt >= PRMS.too_fast && rt < PRMS.too_slow && dat.response !== null) {
        corr_code = 2;
        is_correct = 0;
    } else if (dat.response === null || rt >= PRMS.too_slow) {
        corr_code = 3;
        is_correct = 0;
    } else if (rt < PRMS.too_fast) {
        corr_code = 4;
        is_correct = 0;
    }

    const post_error = previous_trial_error;
    previous_trial_error = (corr_code !== 1) ? 1 : 0;

    PRMS.ctrl_global += 1;
    PRMS.ctrl_in_block += 1;

    const trial_bin = (CURRENT_BLOCK_TYPE === "Practice")
        ? "Practice"
        : (PRMS.ctrl_in_block <= 10 ? "Early" : "Late");

    jsPsych.data.addDataToLastTrial({
        Participant: PARTICIPANT_ID,
        Experiment: "Simon",
        Order: ORDER_LABEL,
        OrderType: ORDER_LABEL,
        Phase: CURRENT_PHASE,
        KeyMapping: KEY_MAPPING_LABEL,
        BlockType: CURRENT_BLOCK_TYPE,
        Block: PRMS.cblk_overall,
        ExperimentalBlock: (CURRENT_BLOCK_TYPE === "Practice") ? "NA" : PRMS.cblk_exp,
        TrialInBlock: PRMS.ctrl_in_block,
        GlobalTrial: PRMS.ctrl_global,
        Instruction: CURRENT_INSTRUCTION,
        Congruency: dat.congruency,
        TrialBin: trial_bin,
        Stimulus: dat.stim_desc,
        TargetFeature: dat.target_feature,
        Distractor: dat.distractor_feature,
        RequiredKey: required_key,
        ResponseKey: response_key,
        Correct: is_correct,
        RT: rt,
        PostError: post_error,
        corr_code: corr_code,
        block_num: PRMS.cblk_overall,
    });

    if (jsPsych.pluginAPI.compareKeys(dat.response, "escape")) {
        jsPsych.endExperiment("Experiment aborted by participant.");
    }
}

// 500 ms Fixation Cross Screen
const FIXATION_CROSS = {
    type: jsPsychCanvasKeyboardResponse,
    canvas_size: CANVAS_SIZE,
    response_ends_trial: false,
    trial_duration: PRMS.fix_dur,
    choices: "NO_KEYS",
    stimulus: function (c) {
        const ctx = c.getContext("2d");
        ctx.fillStyle = CANVAS_COLOUR;
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.translate(c.width / 2, c.height / 2);

        ctx.lineWidth = PRMS.fix_width;
        ctx.strokeStyle = PRMS.fix_colour;
        ctx.beginPath();
        ctx.moveTo(-PRMS.fix_size, 0);
        ctx.lineTo(PRMS.fix_size, 0);
        ctx.moveTo(0, -PRMS.fix_size);
        ctx.lineTo(0, PRMS.fix_size);
        ctx.stroke();
    },
};

// Target Display (until response or 2000 ms timeout)
const SIMON_STIMULUS = {
    type: jsPsychCanvasKeyboardResponse,
    canvas_size: CANVAS_SIZE,
    trial_duration: PRMS.stim_dur,
    response_ends_trial: true,
    choices: ["q", "p", "escape"],
    stimulus: function (c) {
        const ctx = c.getContext("2d");
        ctx.fillStyle = CANVAS_COLOUR;
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.translate(c.width / 2, c.height / 2);

        // Retain central fixation cross
        ctx.lineWidth = PRMS.fix_width;
        ctx.strokeStyle = PRMS.fix_colour;
        ctx.beginPath();
        ctx.moveTo(-PRMS.fix_size, 0);
        ctx.lineTo(PRMS.fix_size, 0);
        ctx.moveTo(0, -PRMS.fix_size);
        ctx.lineTo(0, PRMS.fix_size);
        ctx.stroke();

        // Render lateralized coloured square
        const color = jsPsych.evaluateTimelineVariable("color");
        const position = jsPsych.evaluateTimelineVariable("position");
        const hex = PRMS.colours[color];
        const offset_x = (position === "left") ? -PRMS.stim_pos_x : PRMS.stim_pos_x;

        ctx.fillStyle = hex;
        ctx.fillRect(offset_x - PRMS.square_size / 2, -PRMS.square_size / 2, PRMS.square_size, PRMS.square_size);
    },
    data: {
        stim: "simon",
        stim_desc: jsPsych.timelineVariable("stim_desc"),
        color: jsPsych.timelineVariable("color"),
        target_feature: jsPsych.timelineVariable("target_feature"),
        position: jsPsych.timelineVariable("position"),
        distractor_feature: jsPsych.timelineVariable("distractor_feature"),
        required_key: jsPsych.timelineVariable("required_key"),
        congruency: jsPsych.timelineVariable("congruency"),
    },
    on_finish: function () {
        code_trial();
    },
};

// Feedback Screen (Section 4.4):
// Correct trials -> Completely skipped (advances immediately to ITI)
// Error / Timeout trials -> 1000 ms red alert + post-error reminder phrase
const TRIAL_FEEDBACK = {
    timeline: [
        {
            type: jsPsychCanvasKeyboardResponse,
            canvas_size: CANVAS_SIZE,
            response_ends_trial: false,
            choices: "NO_KEYS",
            trial_duration: PRMS.fb_dur,
            stimulus: function (c) {
                const dat = jsPsych.data.get().last(1).values()[0];
                const ctx = c.getContext("2d");
                ctx.fillStyle = CANVAS_COLOUR;
                ctx.fillRect(0, 0, c.width, c.height);
                ctx.translate(c.width / 2, c.height / 2);

                const reminder_text = INSTRUCTION_TEXTS[CURRENT_INSTRUCTION].reminder;
                const alert_txt = (dat.corr_code === 3) ? "Too Slow! Please respond faster" : "Incorrect!";
                ctx.font = "bold 32px sans-serif";
                ctx.fillStyle = "#000000";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(alert_txt, 0, -30);

                ctx.font = "bold 24px sans-serif";
                ctx.fillStyle = "#000000";
                ctx.fillText(`“${reminder_text}”`, 0, 25);
            },
        },
    ],
    conditional_function: function () {
        const dat = jsPsych.data.get().last(1).values()[0];
        return dat.corr_code !== 1;
    },
};

// Inter-Trial Interval (Blank screen, 400-600 ms uniform jitter)
const ITI = {
    type: jsPsychCanvasKeyboardResponse,
    canvas_size: CANVAS_SIZE,
    response_ends_trial: false,
    choices: "NO_KEYS",
    stimulus: function (c) {
        const ctx = c.getContext("2d");
        ctx.fillStyle = CANVAS_COLOUR;
        ctx.fillRect(0, 0, c.width, c.height);
    },
    on_start: function (trial) {
        trial.trial_duration = Math.floor(Math.random() * (PRMS.iti_max - PRMS.iti_min + 1)) + PRMS.iti_min;
    },
};

////////////////////////////////////////////////////////////////////////
//                       Trial Table Generation                       //
////////////////////////////////////////////////////////////////////////

function generate_simon_trial_table(ntrials) {
    const colours = ["red", "blue"];
    const positions = ["left", "right"];
    const base_trials = [];

    for (const color of colours) {
        for (const pos of positions) {
            const req_key = KEY_MAPPING[color];
            // Simon congruency: Congruent when required key side matches visual location
            const is_congruent = (req_key === "q" && pos === "left") || (req_key === "p" && pos === "right");
            const congruency = is_congruent ? "Congruent" : "Incongruent";

            const cap_color = color.charAt(0).toUpperCase() + color.slice(1);
            const cap_pos = pos.charAt(0).toUpperCase() + pos.slice(1);

            base_trials.push({
                stim_desc: `${cap_color}_square_on_${cap_pos}`,
                color: color,
                target_feature: cap_color,
                position: pos,
                distractor_feature: cap_pos,
                required_key: req_key,
                congruency: congruency,
            });
        }
    }

    const n_reps = ntrials / base_trials.length;
    let trials = [];
    for (let r = 0; r < n_reps; r++) {
        trials = trials.concat(base_trials.map((t) => ({ ...t })));
    }
    return shuffle(trials);
}

function create_simon_block_timeline(ntrials) {
    return {
        timeline: [FIXATION_CROSS, SIMON_STIMULUS, TRIAL_FEEDBACK, ITI],
        timeline_variables: generate_simon_trial_table(ntrials),
    };
}

////////////////////////////////////////////////////////////////////////
//                              Save Data                             //
////////////////////////////////////////////////////////////////////////
function save() {
    jsPsych.data.addProperties({ vp_num: VP_NUM });
    const data_fn = `${DIR_NAME}data/${EXP_NAME}_${VP_NUM}`;
    if (typeof save_data_server === "function") {
        save_data_server("/Common8+/write_data.php", data_fn, { stim: "simon" });
    }
    if (SIMULATION_MODE && typeof save_data_local === "function") {
        save_data_local(data_fn, { stim: "simon" });
    }
}

const SAVE_DATA = {
    type: jsPsychCallFunction,
    func: save,
    post_trial_gap: 500,
};

////////////////////////////////////////////////////////////////////////
//                            End Screen                              //
////////////////////////////////////////////////////////////////////////
const END_SCREEN = {
    type: jsPsychHtmlKeyboardResponse,
    response_ends_trial: true,
    choices: [" "],
    stimulus: function () {
        return `
            <div class="instruction-card">
                <div class="instruction-header">Experiment Completed!</div>
                <p>Thank you very much for your participation in this study!</p>
                <p>Your data have been successfully saved.</p>
                
                <div style="background-color: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; padding: 20px; margin: 25px 0;">
                    <p style="margin: 0; font-size: 18px; color: #0f172a;">Your Prolific Completion Code is: <b style="color: #2563eb;">C1OYPSA2</b></p>
                </div>
                
                <p>Press the <b>SPACEBAR</b> to complete the study.</p>
            </div>
        `;
    },
    on_finish: function () {
        window.location.replace("https://app.prolific.com/submissions/complete?cc=C1OYPSA2");
    },
    post_trial_gap: 500,
};

////////////////////////////////////////////////////////////////////////
//                    Assemble Full Experiment                        //
////////////////////////////////////////////////////////////////////////
function generate_exp() {
    const exp = [];

    // Pre-experimental checks and consent
    exp.push(fullscreen(true, "en"));
    exp.push(browser_check(CANVAS_SIZE));
    exp.push(resize_browser("en"));
    exp.push(welcome_message("en"));
    exp.push(HTML_CONSENT_FORM);
    exp.push(DEMOGRAPHICS_FORM);
    exp.push(mouse_cursor(false));

    // -------------------------------------------------------------
    // Phase 1 (First Instruction Framing)
    // -------------------------------------------------------------
    exp.push(PHASE1_WELCOME_INSTRUCTION);

    // Practice Block 1 (8 trials)
    exp.push({
        timeline: [FIXATION_CROSS, SIMON_STIMULUS, TRIAL_FEEDBACK, ITI],
        timeline_variables: generate_simon_trial_table(PRMS.ntrls_practice),
        on_timeline_start: function () {
            CURRENT_BLOCK_TYPE = "Practice";
            CURRENT_PHASE = 1;
            CURRENT_INSTRUCTION = PHASE1_INSTRUCTION;
            PRMS.cblk_overall = 1;
            PRMS.ctrl_in_block = 0;
            previous_trial_error = 0;
        },
    });

    exp.push(BLOCK_FEEDBACK);
    exp.push(PRACTICE1_END);

    // 6 Main Experimental Blocks of Phase 1 (Blocks 1–6)
    for (let blk = 1; blk <= PRMS.nblks_phase; blk++) {
        exp.push(create_block_intro(blk, 1));
        exp.push(create_simon_block_timeline(PRMS.ntrls_exp));
        exp.push(BLOCK_FEEDBACK);
    }

    // -------------------------------------------------------------
    // Mid-Session Transition & Phase 2 (Alternative Framing)
    // -------------------------------------------------------------
    exp.push(MID_SESSION_TRANSITION);
    exp.push(PHASE2_WELCOME_INSTRUCTION);

    // Practice Block 2 (8 trials) under Phase 2 instruction
    exp.push({
        timeline: [FIXATION_CROSS, SIMON_STIMULUS, TRIAL_FEEDBACK, ITI],
        timeline_variables: generate_simon_trial_table(PRMS.ntrls_practice),
        on_timeline_start: function () {
            CURRENT_BLOCK_TYPE = "Practice";
            CURRENT_PHASE = 2;
            CURRENT_INSTRUCTION = PHASE2_INSTRUCTION;
            PRMS.ctrl_in_block = 0;
            previous_trial_error = 0;
        },
    });

    exp.push(BLOCK_FEEDBACK);
    exp.push(PRACTICE2_END);

    // 6 Main Experimental Blocks of Phase 2 (Blocks 7–12)
    for (let blk = 1; blk <= PRMS.nblks_phase; blk++) {
        exp.push(create_block_intro(blk, 2));
        exp.push(create_simon_block_timeline(PRMS.ntrls_exp));
        exp.push(BLOCK_FEEDBACK);
    }

    // -------------------------------------------------------------
    // Post-Experimental: Save & Debrief
    // -------------------------------------------------------------
    exp.push(SAVE_DATA);
    exp.push(mouse_cursor(true));
    exp.push(END_SCREEN);
    exp.push(fullscreen(false, "en"));

    return exp;
}

const EXP = generate_exp();

if (SIMULATION_MODE) {
    jsPsych.simulate(EXP, SIMULATION_MODE);
} else {
    jsPsych.run(EXP);
}
