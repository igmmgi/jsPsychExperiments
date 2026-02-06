// Simon task with Gabor patch embeded on background noise
const jsPsych = initJsPsych({});
const pixi_flag = true; //jsPsych.data.getURLVariable("pixi_flag") === "1" ? true : false;

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const CANVAS_COLOUR = "rgba(128, 128, 128, 1)";
const CANVAS_SIZE = [960, 1280]; // height, width
const CANVAS_BORDER = "5px solid black";

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const PRMS = {
    ntrls: 80,
    nblks: 9,
    fix_size: 30, // size of the fixation cross
    fix_width: 5, // width of fixation cross
    fix_color: "black", // colour of the fixation cross
    fix_colour: "rgba(0, 0, 0, 1)", // colour of the fixation cross
    initial_background_duration: 500,
    fixation_duration: 1000,
    too_slow: 3000, // subtract background duration + fixation duration for true too slow (3000 = 1500)
    feedback_duration: [0, 1500, 1500],
    iti: 1000,
    stim_size: "40px monospace",
    simon_pos: 600,
    feedback_size: "24px monospace",
    feedback_text_size_block: 20,
    feedback_text: ["", "Falsch", "Zu langsam!"],
    feedback_colour: "rgba(0, 0, 0, 1)", // colour of the fixation cross
    resp_keys: ["Q", "P"], // left/right
    ctrl: 1, // count trials
    cblk: 1, // count blocks
    // Gabor patch parameters
    gabor_size: 256,                 // Gabor diameter in pixels
    gabor_sf: [0.03, 0.06],          // Spatial frequency (cycles per pixel)
    gabor_phase: 0,                  // Phase offset (0-360 degrees)
    gabor_tilt: 0,                   // Tilt/rotation in degrees (0 = horizontal, 90 = vertical)
    gabor_contrast: 100,             // Contrast multiplier (100 = full contrast, can exceed 100)
    gabor_sigma: 50,                 // Gaussian envelope standard deviation (pixels)
};

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////

// response key mapping for baseline simon
const RESP_TEXT =
    generate_formatted_html({
        text: "Low" + "&emsp;".repeat(8) + "High" + "&emsp;".repeat(8),
        bold: true,
        fontsize: 26,
        lineheight: 0.5,
    }) +
    generate_formatted_html({
        text: `${PRMS.resp_keys[0]}-Taste` + "&emsp;".repeat(8) + `${PRMS.resp_keys[1]}-Taste` + "&emsp;".repeat(8),
        bold: true,
        fontsize: 26,
        lineheight: 0.5,
    }) +
    generate_formatted_html({
        text: `linker Zeigefinger` + "&emsp;".repeat(7) + `rechte Zeigefinger` + "&emsp;".repeat(7),
        bold: true,
        fontsize: 20,
        lineheight: 0.5,
    });

const PRESS_TO_CONTINUE = generate_formatted_html({
    text: `Drücke eine beliebige Taste, um fortzufahren!`,
    bold: true,
    fontsize: 26,
    align: "center",
});

const TASK_INSTRUCTIONS1 = {
    type: jsPsychHtmlKeyboardResponse,
    canvas_size: CANVAS_SIZE,
    stimulus: generate_formatted_html({
        text: `Willkommen bei unserem Experiment:<br><br>
               Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.
               Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und
               genügend Zeit hast, um das Experiment durchzuführen.
               Wir bitten dich die ca. 40 Minuten konzentriert zu arbeiten.<br><br>
               Drücke eine beliebige Taste, um fortzufahren!`,
        bold: true,
        fontsize: 26,
        align: "left",
        lineheight: 1.5,
    }),
    post_trial_gap: 1000,
};

const TASK_INSTRUCTIONS2 = {
    type: jsPsychHtmlKeyboardResponse,
    canvas_size: CANVAS_SIZE,
    stimulus:
        generate_formatted_html({
            text: `Aufgabe:<br><br>
                   In diesem Experiment musst du XXX so schnell und so genau wie möglich reagieren.<br><br>
Es gilt die folgende Zuordnung:<br><br>`,
            bold: true,
            fontsize: 26,
            align: "left",
            lineheight: 1.5,
        }) +
        RESP_TEXT +
        "<br>" +
        PRESS_TO_CONTINUE,
    post_trial_gap: 1000,
};

const TASK_INSTRUCTIONS_BLOCK = {
    type: jsPsychHtmlKeyboardResponse,
    canvas_size: CANVAS_SIZE,
    stimulus: "",
    on_start: function (trial) {
        trial.stimulus =
            generate_formatted_html({
                text: `Block ${PRMS.cblk} von ${PRMS.nblks}<br><br>
Versuche immer möglichst schnell und genau zu antworten. Es gilt:<br><br>`,
                bold: true,
                fontsize: 26,
                align: "left",
                lineheight: 1.5,
            }) +
            RESP_TEXT +
            "<br>" +
            PRESS_TO_CONTINUE;
    },
    post_trial_gap: 1000,
};

function canvas_style(ctx) {
    ctx.fillStyle = CANVAS_COLOUR;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2); // make center (0, 0) for easier positioning!
    return ctx;
}

function clear_canvas(ctx) {
    ctx.fillStyle = CANVAS_COLOUR;
    ctx.fillRect(-ctx.canvas.width / 2, -ctx.canvas.height / 2, ctx.canvas.width, ctx.canvas.height);
    return ctx;
}

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////

function code_trial() {
    "use strict";

    let dat = jsPsych.data.get().last(1).values()[0];

    let corr_code = 0;
    let rt = dat.rt === null ? PRMS.too_slow : dat.rt;

    let comp =
        (["Q"].includes(dat.corr_resp) && dat.position < 0) || (["P"].includes(dat.corr_resp) && dat.position > 0)
            ? "comp"
            : "incomp";

    let correctKey;
    if (dat.response !== null) {
        correctKey = jsPsych.pluginAPI.compareKeys(dat.response, dat.corr_resp);
    }

    if (correctKey && rt < PRMS.too_slow) {
        corr_code = 1; // correct
    } else if (!correctKey && rt < PRMS.too_slow) {
        corr_code = 2; // choice error
    } else if (rt >= PRMS.too_slow) {
        corr_code = 3; // too slow
    }

    jsPsych.data.addDataToLastTrial({
        date: Date(),
        keyPress: dat.key_press,
        comp: comp,
        rt: rt,
        corr_code: corr_code,
        block_num: PRMS.cblk,
        trial_num: PRMS.ctrl,
    });
}

function draw_trial_feedback(c, args) {
    "use strict";
    let ctx = c.getContext("2d");
    ctx = canvas_style(ctx);

    ctx.font = PRMS.feedback_size;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = PRMS.feedback_colour;
    ctx.fillText(PRMS.feedback_text[args.corr_code - 1], 0, 0);
    if (args.corr_code !== 1) {
        let row1 = ` Low               High`;
        let row2 = `${PRMS.resp_keys[0]}-Taste         ${PRMS.resp_keys[1]}-Taste`;
        let row3 = `linker Zeigefinger  rechte Zeigefinger`;
        ctx.fillText(row1, 0, 60);
        ctx.fillText(row2, 0, 90);
        ctx.font = "18px monospace";
        ctx.fillText(row3, 0, 120);
    }
}

const TRIAL_FEEDBACK = {
    type: jsPsychCanvasKeyboardResponse,
    stimulus: function () { },
    canvas_size: CANVAS_SIZE,
    response_ends_trial: false,
    trial_duration: 0,
    on_start: function (trial) {
        let dat = jsPsych.data.get().last(1).values()[0];
        trial.trial_duration = PRMS.feedback_duration[dat.corr_code - 1];
        if (dat.corrCode !== 1) {
            trial.stimulus = function (c) {
                draw_trial_feedback(c, { corr_code: dat.corr_code });
            };
        }
    },
};

function draw_iti(c) {
    "use strict";
    let ctx = c.getContext("2d");
    canvas_style(ctx);
}

const ITI = {
    type: jsPsychCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_border: CANVAS_BORDER,
    canvas_size: CANVAS_SIZE,
    stimulus: draw_iti,
    response_ends_trial: false,
    trial_duration: PRMS.iti,
};

const BLOCK_FEEDBACK = {
    type: jsPsychHtmlKeyboardResponse,
    canvas_size: CANVAS_SIZE,
    stimulus: "",
    response_ends_trial: true,
    post_trial_gap: PRMS.waitDur,
    on_start: function (trial) {
        let block_dvs = calculate_block_performance({
            filter_options: { stim: "cse_sf", block_num: PRMS.cblk },
        });
        let text = block_feedback_text(PRMS.cblk, PRMS.nblks, block_dvs.mean_rt, block_dvs.error_rate);
        trial.stimulus = `<div style="font-size:${PRMS.feedback_text_size_block}px;">${text}</div>`;
    },
    on_finish: function () {
        PRMS.ctrl = 1;
        PRMS.cblk += 1;
    },
};


////////////////////////////////////////////////////////////////////////
//                             VP Stunden                             //
////////////////////////////////////////////////////////////////////////
const END_SCREEN = {
    type: jsPsychHtmlKeyboardResponse,
    response_ends_trial: true,
    choices: [" "],
    stimulus: generate_formatted_html({
        text: `Dieser Teil des Experiments ist jetzt beendet.<br><br>
             Nun folgen Informationen zur Versuchspersonenstunde auf Unipark.
             Drücke eine beliebige Taste, um die Weiterleitung zu Unipark zu starten.`,
        fontsize: 28,
        lineheight: 1.0,
        bold: false,
        align: "left",
    }),
    on_finish: function () { },
    post_trial_gap: 1000,
};

////////////////////////////////////////////////////////////////////////
//                              Save                                  //
////////////////////////////////////////////////////////////////////////
const DIR_NAME = get_dir_name();
const EXP_NAME = get_file_name();
const VP_NUM = get_time();

function save() {
    jsPsych.data.addProperties({ vpNum: VP_NUM });

    const data_fn = `${DIR_NAME}data/${EXP_NAME}_${VP_NUM}`;
    save_data_server("/Common8+/write_data.php", data_fn, { stim: "cse_sf" });
    // save_data_local(data_fn, { stim: "cse_sf" });
}

const SAVE_DATA = {
    type: jsPsychCallFunction,
    func: save,
    post_trial_gap: 1000,
};

// Generate background images using pre-generated Python images
function generateBackgroundImages() {
    return {
        low: 'images/bg_lowNoise_1920x1080.png',
        high: 'images/bg_highNoise_1920x1080.png'
    };
}

const FIX1 = {
    obj_type: "line",
    origin_center: true,
    startX: 0,
    startY: 0,
    angle: 0,
    line_length: PRMS.fix_size,
    line_width: PRMS.fix_width,
    line_color: PRMS.fix_color,
    show_start_time: PRMS.initial_background_duration
};

const FIX2 = {
    obj_type: "line",
    origin_center: true,
    startX: 0,
    startY: 0,
    angle: 90,
    line_length: PRMS.fix_size,
    line_width: PRMS.fix_width,
    line_color: PRMS.fix_color,
    show_start_time: PRMS.initial_background_duration
};

const backgroundImages = generateBackgroundImages();

// Background stimuli using generated images
const BACKGROUND_LOW = {
    obj_type: "image",
    file: backgroundImages.low,
    x: 0,
    y: 0,
    scale: 1.0,
    show_start_time: 0
};

const BACKGROUND_HIGH = {
    obj_type: "image",
    file: backgroundImages.high,
    x: 0,
    y: 0,
    scale: 1.0,
    show_start_time: 0
};

// Gabor stimulus definition (references PRMS for easy testing)
const GABOR_STIMULUS_LOW_SF_LEFT_POS = {
    obj_type: "gabor",
    origin_center: true,
    startX: -PRMS.simon_pos,
    startY: 0,
    endX: -PRMS.simon_pos,
    endY: 0,
    motion_end_time: PRMS.initial_background_duration + PRMS.fixation_duration,
    width: PRMS.gabor_size,
    sf: PRMS.gabor_sf[0],
    phase: PRMS.gabor_phase,
    tilt: PRMS.gabor_tilt,
    contrast: PRMS.gabor_contrast,
    sc: PRMS.gabor_sigma,
    bg_color: "transparent",
    show_start_time: PRMS.initial_background_duration + PRMS.fixation_duration
};

// Gabor stimulus definition (references PRMS for easy testing)
const GABOR_STIMULUS_LOW_SF_RIGHT_POS = {
    obj_type: "gabor",
    origin_center: true,
    startX: PRMS.simon_pos,
    startY: 0,
    endX: PRMS.simon_pos,
    endY: 0,
    motion_end_time: PRMS.initial_background_duration + PRMS.fixation_duration,
    width: PRMS.gabor_size,
    sf: PRMS.gabor_sf[0],
    phase: PRMS.gabor_phase,
    tilt: PRMS.gabor_tilt,
    contrast: PRMS.gabor_contrast,
    sc: PRMS.gabor_sigma,
    bg_color: "transparent",
    show_start_time: PRMS.initial_background_duration + PRMS.fixation_duration
};


// Gabor stimulus definition (references PRMS for easy testing)
const GABOR_STIMULUS_HIGH_SF_LEFT_POS = {
    obj_type: "gabor",
    origin_center: true,
    startX: -PRMS.simon_pos,
    startY: 0,
    endX: -PRMS.simon_pos,
    endY: 0,
    motion_end_time: PRMS.initial_background_duration + PRMS.fixation_duration,
    width: PRMS.gabor_size,
    sf: PRMS.gabor_sf[1],
    phase: PRMS.gabor_phase,
    tilt: PRMS.gabor_tilt,
    contrast: PRMS.gabor_contrast,
    sc: PRMS.gabor_sigma,
    bg_color: "transparent",
    show_start_time: PRMS.initial_background_duration + PRMS.fixation_duration
};

// Gabor stimulus definition (references PRMS for easy testing)
const GABOR_STIMULUS_HIGH_SF_RIGHT_POS = {
    obj_type: "gabor",
    origin_center: true,
    startX: PRMS.simon_pos,
    startY: 0,
    endX: PRMS.simon_pos,
    endY: 0,
    motion_end_time: PRMS.initial_background_duration + PRMS.fixation_duration,
    width: PRMS.gabor_size,
    sf: PRMS.gabor_sf[1],
    phase: PRMS.gabor_phase,
    tilt: PRMS.gabor_tilt,
    contrast: PRMS.gabor_contrast,
    sc: PRMS.gabor_sigma,
    bg_color: "transparent",
    show_start_time: PRMS.initial_background_duration + PRMS.fixation_duration
};


// Trial definitions - one per condition to avoid on_start issues
const TRIAL_LOW_NOISE_LOW_SF_LEFT = {
    type: jsPsychPsychophysics,
    pixi: pixi_flag,
    canvas: { background_color: 'transparent' },
    stimuli: [BACKGROUND_LOW, FIX1, FIX2, GABOR_STIMULUS_LOW_SF_LEFT_POS],
    response_type: "key",
    choices: PRMS.resp_keys,
    response_ends_trial: true,
    trial_duration: PRMS.too_slow,
    data: {
        stim: "sg",
        freq: "low",
        noise: "low",
        position: -PRMS.simon_pos,
        comp: "comp",
        corr_resp: PRMS.resp_keys[0]
    },
    on_finish: function () {
        code_trial();
        PRMS.ctrl += 1;
    }
};

const TRIAL_LOW_NOISE_LOW_SF_RIGHT = {
    type: jsPsychPsychophysics,
    pixi: pixi_flag,
    canvas: { background_color: 'transparent' },
    stimuli: [BACKGROUND_LOW, FIX1, FIX2, GABOR_STIMULUS_LOW_SF_RIGHT_POS],
    response_type: "key",
    choices: PRMS.resp_keys,
    response_ends_trial: true,
    trial_duration: PRMS.too_slow,
    data: {
        stim: "sg",
        freq: "low",
        noise: "low",
        position: PRMS.simon_pos,
        comp: "incomp",
        corr_resp: PRMS.resp_keys[0]
    },
    on_finish: function () {
        code_trial();
        PRMS.ctrl += 1;
    }
};

const TRIAL_LOW_NOISE_HIGH_SF_LEFT = {
    type: jsPsychPsychophysics,
    pixi: pixi_flag,
    canvas: { background_color: 'transparent' },
    stimuli: [BACKGROUND_LOW, FIX1, FIX2, GABOR_STIMULUS_HIGH_SF_LEFT_POS],
    response_type: "key",
    choices: PRMS.resp_keys,
    response_ends_trial: true,
    trial_duration: PRMS.too_slow,
    data: {
        stim: "sg",
        freq: "low",
        noise: "high",
        position: -PRMS.simon_pos,
        comp: "comp",
        corr_resp: PRMS.resp_keys[1]
    },
    on_finish: function () {
        code_trial();
        PRMS.ctrl += 1;
    }
};

const TRIAL_LOW_NOISE_HIGH_SF_RIGHT = {
    type: jsPsychPsychophysics,
    pixi: pixi_flag,
    canvas: { background_color: 'transparent' },
    stimuli: [BACKGROUND_LOW, FIX1, FIX2, GABOR_STIMULUS_HIGH_SF_RIGHT_POS],
    response_type: "key",
    choices: PRMS.resp_keys,
    response_ends_trial: true,
    trial_duration: PRMS.too_slow,
    data: {
        stim: "sg",
        freq: "low",
        noise: "high",
        position: PRMS.simon_pos,
        comp: "incomp",
        corr_resp: PRMS.resp_keys[1]
    },
    on_finish: function () {
        code_trial();
        PRMS.ctrl += 1;
    }
};

const TRIAL_HIGH_NOISE_LOW_SF_LEFT = {
    type: jsPsychPsychophysics,
    pixi: pixi_flag,
    canvas: { background_color: 'transparent' },
    stimuli: [BACKGROUND_HIGH, FIX1, FIX2, GABOR_STIMULUS_LOW_SF_LEFT_POS],
    response_type: "key",
    choices: PRMS.resp_keys,
    response_ends_trial: true,
    trial_duration: PRMS.too_slow,
    data: {
        stim: "sg",
        freq: "high",
        noise: "low",
        position: -PRMS.simon_pos,
        comp: "comp",
        corr_resp: PRMS.resp_keys[0]
    },
    on_finish: function () {
        code_trial();
        PRMS.ctrl += 1;
    }
};

const TRIAL_HIGH_NOISE_LOW_SF_RIGHT = {
    type: jsPsychPsychophysics,
    pixi: pixi_flag,
    canvas: { background_color: 'transparent' },
    stimuli: [BACKGROUND_HIGH, FIX1, FIX2, GABOR_STIMULUS_LOW_SF_RIGHT_POS],
    response_type: "key",
    choices: PRMS.resp_keys,
    response_ends_trial: true,
    trial_duration: PRMS.too_slow,
    data: {
        stim: "sg",
        freq: "high",
        noise: "low",
        position: PRMS.simon_pos,
        comp: "incomp",
        corr_resp: PRMS.resp_keys[0]
    },
    on_finish: function () {
        code_trial();
        PRMS.ctrl += 1;
    }
};

const TRIAL_HIGH_NOISE_HIGH_SF_LEFT = {
    type: jsPsychPsychophysics,
    pixi: pixi_flag,
    canvas: { background_color: 'transparent' },
    stimuli: [BACKGROUND_HIGH, FIX1, FIX2, GABOR_STIMULUS_HIGH_SF_LEFT_POS],
    response_type: "key",
    choices: PRMS.resp_keys,
    response_ends_trial: true,
    trial_duration: PRMS.too_slow,
    data: {
        stim: "sg",
        freq: "high",
        noise: "high",
        position: -PRMS.simon_pos,
        comp: "comp",
        corr_resp: PRMS.resp_keys[1]
    },
    on_finish: function () {
        code_trial();
        PRMS.ctrl += 1;
    }
};

const TRIAL_HIGH_NOISE_HIGH_SF_RIGHT = {
    type: jsPsychPsychophysics,
    pixi: pixi_flag,
    canvas: { background_color: 'transparent' },
    stimuli: [BACKGROUND_HIGH, FIX1, FIX2, GABOR_STIMULUS_HIGH_SF_RIGHT_POS],
    response_type: "key",
    choices: PRMS.resp_keys,
    response_ends_trial: true,
    trial_duration: PRMS.too_slow,
    data: {
        stim: "sg",
        freq: "high",
        noise: "high",
        position: PRMS.simon_pos,
        comp: "incomp",
        corr_resp: PRMS.resp_keys[1]
    },
    on_finish: function () {
        code_trial();
        PRMS.ctrl += 1;
    }
};




////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
    "use strict";

    let exp = [];

    exp.push(fullscreen(true));
    exp.push(browser_check(CANVAS_SIZE));
    exp.push(resize_browser());
    exp.push(welcome_message());
    exp.push(vp_info_form("/Common8+/vpInfoForm_de.html"));
    exp.push(mouse_cursor(false));
    exp.push(TASK_INSTRUCTIONS1);
    exp.push(TASK_INSTRUCTIONS2);

    // Create nblks blocks, each with a different shuffle order
    for (let blk = 0; blk < PRMS.nblks; blk++) {
        // Create shuffled trial array for this block
        const trialArray = jsPsych.randomization.repeat(
            [
                TRIAL_LOW_NOISE_LOW_SF_LEFT,
                TRIAL_HIGH_NOISE_LOW_SF_LEFT,
                TRIAL_LOW_NOISE_LOW_SF_RIGHT,
                TRIAL_HIGH_NOISE_LOW_SF_RIGHT,
                TRIAL_LOW_NOISE_HIGH_SF_LEFT,
                TRIAL_HIGH_NOISE_HIGH_SF_LEFT,
                TRIAL_LOW_NOISE_HIGH_SF_RIGHT,
                TRIAL_HIGH_NOISE_HIGH_SF_RIGHT
            ],
            PRMS.ntrls / 8
        );

        // Interleave with ITI
        const timelineWithITI = [];
        for (let trial of trialArray) {
            timelineWithITI.push(trial);
            timelineWithITI.push(TRIAL_FEEDBACK);
            timelineWithITI.push(ITI);
        }

        exp.push({ timeline: timelineWithITI });
        exp.push(BLOCK_FEEDBACK); // show previous block performance
    }

    // save data
    exp.push(SAVE_DATA);

    // debrief
    exp.push(mouse_cursor(true));
    exp.push(END_SCREEN);
    exp.push(end_message());
    exp.push(fullscreen(false));

    return exp;
}
const EXP = genExpSeq();

// jsPsych.simulate(EXP, "data-only");
// jsPsych.simulate(EXP, "visual");
jsPsych.run(EXP);
