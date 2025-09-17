// Intermixed Simon and Flanker Task
// Standard visual Simon with left/right lateralized stimuli
// Standard visual flanker task with flankers presented before the target (150 ms SOA)
// Unpredictable task sequence but response effector (middle vs. index fingers) alternates

const jsPsych = initJsPsych({});

const pixi_flag = jsPsych.data.getURLVariable("pixi_flag") === "1" ? true : false;

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const CANVAS_COLOUR = "rgba(200, 200, 200, 1)";
const CANVAS_SIZE = [720, 960];
const CANVAS_BORDER = "5px solid black";

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const PRMS = {
    ntrls: 80,
    nblks: 9,
    fix_size: 10, // size of the fixation cross
    fix_width: 5, // width of fixation cross
    fix_duration: 500, // duration of the fixation cross
    fix_colour: "rgba(0, 0, 0, 1)", // colour of the fixation cross
    feedback_duration: [0, 1500, 1500],
    iti: 500,
    too_slow: 2750,
    stim_size: "40px monospace",
    simon_pos: 100,
    feedback_size: "24px monospace",
    feedback_text_size_block: 20,
    feedback_text: ["", "Falsch", "Zu langsam!"],
    feedback_colour: "rgba(0, 0, 0, 1)", // colour of the fixation cross
    resp_keys: ["Q", "P"], // left/right
    ctrl: 1, // count trials
    cblk: 1, // count blocks
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
function draw_fixation(c) {
    "use strict";
    let ctx = c.getContext("2d");
    ctx = canvas_style(ctx);

    ctx.lineWidth = PRMS.fix_width;
    ctx.strokeStyle = PRMS.fix_colour;
    ctx.moveTo(-PRMS.fix_size, 0);
    ctx.lineTo(PRMS.fix_size, 0);
    ctx.stroke();
    ctx.moveTo(0, -PRMS.fix_size);
    ctx.lineTo(0, PRMS.fix_size);
    ctx.stroke();
}

const FIXATION_CROSS = {
    type: jsPsychCanvasKeyboardResponse,
    stimulus: draw_fixation,
    canvas_size: CANVAS_SIZE,
    response_ends_trial: false,
    trial_duration: PRMS.fix_duration,
};

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
    stimulus: function () {},
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

function draw_stimulus(c, args) {
    "use strict";
    let ctx = c.getContext("2d");
    if (args.set_canvas) {
        ctx = canvas_style(ctx);
    } else {
        ctx = clear_canvas(ctx);
    }

    ctx.font = PRMS.stim_size;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // draw
    ctx.fillStyle = "black";
    ctx.fillText(args.stim, args.position, 0);
}

const STIMULUS = {
    type: jsPsychCanvasKeyboardResponse,
    stimulus: null,
    canvas_size: CANVAS_SIZE,
    translate_origin: true,
    response_ends_trial: true,
    choices: PRMS.resp_letters,
    trial_duration: PRMS.too_slow,
    data: {
        stim: "sg",
        freq: jsPsych.timelineVariable("freq"),
        noise: jsPsych.timelineVariable("noise"),
        position: jsPsych.timelineVariable("position"),
        comp: jsPsych.timelineVariable("comp"),
        corr_resp: jsPsych.timelineVariable("corr_resp"),
    },
    on_start: function (trial) {
        trial.stimulus = function (c) {
            trial.trial_duration = PRMS.too_slow;
            draw_stimulus(c, {
                freq: jsPsych.evaluateTimelineVariable("freq"),
                noise: jsPsych.evaluateTimelineVariable("noise"),
                position: jsPsych.evaluateTimelineVariable("position"),
                set_canvas: true,
            });
        };
    },
    on_finish: function () {
        code_trial();
        PRMS.ctrl += 1;
    },
};

// prettier-ignore
const TRIAL_TABLE = [
      { freq: "low",  noise: "low",  position: -PRMS.simon_pos, comp: "comp",   corr_resp: PRMS.resp_keys[0] },
      { freq: "low",  noise: "high", position: -PRMS.simon_pos, comp: "comp",   corr_resp: PRMS.resp_keys[0] },
      { freq: "low",  noise: "low",  position:  PRMS.simon_pos, comp: "incomp", corr_resp: PRMS.resp_keys[1] },
      { freq: "low",  noise: "high", position:  PRMS.simon_pos, comp: "incomp", corr_resp: PRMS.resp_keys[1] },
      { freq: "high", noise: "low",  position: -PRMS.simon_pos, comp: "comp",   corr_resp: PRMS.resp_keys[0] },
      { freq: "high", noise: "high", position: -PRMS.simon_pos, comp: "comp",   corr_resp: PRMS.resp_keys[0] },
      { freq: "high", noise: "low",  position:  PRMS.simon_pos, comp: "incomp", corr_resp: PRMS.resp_keys[1] },
      { freq: "high", noise: "high", position:  PRMS.simon_pos, comp: "incomp", corr_resp: PRMS.resp_keys[1] },
    ];

const TRIAL_TIMELINE = {
    timeline: [FIXATION_CROSS, STIMULUS, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIAL_TABLE,
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
    on_finish: function () {},
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

// const CENTER_X = canvas.width / 2 / window.devicePixelRatio;
// const CENTER_Y = canvas.height / 2 / window.devicePixelRatio;
// console.log(CENTER_X);
// console.log(CENTER_Y);

const GABOR_SC = 20;
const GABOR_TILT = 90;
const GABOR_CONTRAST = 1000;
const GABOR_WIDTH = 200;
const GABOR_PHASE = 0;
const GABOR_SF_LOW = 0.1;
const GABOR_SF_HIGH = 0.11;

const TOP_LEFT = {
    obj_type: "gabor",
    origin_center: true,
    tilt: GABOR_TILT,
    sf: 0.1,
    phase: GABOR_PHASE,
    width: GABOR_WIDTH,
    sc: 20,
    contrast: 10,
    startX: -PRMS.simon_pos,
    startY: -100,
    //drift: 20,
};

const TOP_RIGHT = {
    obj_type: "gabor",
    origin_center: true,
    tilt: GABOR_TILT,
    sf: 0.2,
    phase: GABOR_PHASE,
    width: GABOR_WIDTH,
    sc: GABOR_SC,
    contrast: 20,
    startX: PRMS.simon_pos,
    startY: -100,
};

const BOTTOM_LEFT = {
    obj_type: "gabor",
    origin_center: true,
    tilt: GABOR_TILT,
    sf: 0.1,
    phase: GABOR_PHASE,
    width: GABOR_WIDTH,
    sc: GABOR_SC,
    contrast: 500,
    startX: -PRMS.simon_pos,
    startY: 100,
};

const BOTTOM_RIGHT = {
    obj_type: "gabor",
    origin_center: true,
    tilt: GABOR_TILT,
    sf: 0.2,
    phase: GABOR_PHASE,
    width: GABOR_WIDTH,
    sc: GABOR_SC,
    contrast: 500,
    startX: PRMS.simon_pos,
    startY: 100,
};

const fix1 = {
    obj_type: "line",
    origin_center: true,
    startX: 0, // location in the canvas
    startY: 0,
    angle: 0,
    line_length: 20,
    line_width: 2,
    line_color: "black", // You can use the HTML color name instead of the HEX color.
};

const fix2 = {
    obj_type: "line",
    origin_center: true,
    startX: 0, // location in the canvas
    startY: 0,
    angle: 90,
    line_length: 20,
    line_width: 2,
    line_color: "black", // You can use the HTML color name instead of the HEX color.
};

const circle1 = {
    obj_type: "circle",
    origin_center: true,
    startX: 100, // location in the canvas
    startY: 100,
    angle: 90,
    radius: 60,
    line_length: 20,
    line_width: 20,
    line_color: "darkgrey", // You can use the HTML color name instead of the HEX color.
};

const dot1 = {
    obj_type: "circle",
    origin_center: true,
    startX: 100, // location in the canvas
    startY: 100,
    angle: 90,
    radius: 3,
    line_length: 20,
    line_width: 1,
    line_color: "black", // You can use the HTML color name instead of the HEX color.
    fill_color: "black", // You can use the HTML color name instead of the HEX color.
};

const circle2 = {
    obj_type: "circle",
    origin_center: true,
    startX: -100, // location in the canvas
    startY: 100,
    angle: 90,
    radius: 60,
    line_length: 20,
    line_width: 20,
    line_color: "darkgrey", // You can use the HTML color name instead of the HEX color.
};

const dot2 = {
    obj_type: "circle",
    origin_center: true,
    startX: -100, // location in the canvas
    startY: 100,
    angle: 90,
    radius: 3,
    line_length: 20,
    line_width: 1,
    line_color: "black", // You can use the HTML color name instead of the HEX color.
    fill_color: "black", // You can use the HTML color name instead of the HEX color.
};

const circle3 = {
    obj_type: "circle",
    origin_center: true,
    startX: 100, // location in the canvas
    startY: -100,
    angle: 90,
    radius: 60,
    line_length: 20,
    line_width: 20,
    line_color: "darkgrey", // You can use the HTML color name instead of the HEX color.
};

const dot3 = {
    obj_type: "circle",
    origin_center: true,
    startX: 100, // location in the canvas
    startY: -100,
    angle: 90,
    radius: 3,
    line_length: 20,
    line_width: 1,
    line_color: "red", // You can use the HTML color name instead of the HEX color.
    fill_color: "red", // You can use the HTML color name instead of the HEX color.
};

const circle4 = {
    obj_type: "circle",
    origin_center: true,
    startX: -100, // location in the canvas
    startY: -100,
    angle: 90,
    radius: 60,
    line_length: 20,
    line_width: 20,
    line_color: "darkgrey", // You can use the HTML color name instead of the HEX color.
};

const dot4 = {
    obj_type: "circle",
    origin_center: true,
    startX: -100, // location in the canvas
    startY: -100,
    angle: 90,
    radius: 3,
    line_length: 20,
    line_width: 1,
    line_color: "black", // You can use the HTML color name instead of the HEX color.
    fill_color: "black", // You can use the HTML color name instead of the HEX color.
};

const TRIAL1 = {
    type: jsPsychPsychophysics,
    pixi: pixi_flag,
    stimuli: [BOTTOM_LEFT, BOTTOM_RIGHT, TOP_RIGHT, TOP_LEFT, circle1, circle2, circle3, circle4, fix1, fix2],
    canvas_height: CANVAS_SIZE[0],
    canvas_width: CANVAS_SIZE[1],
};

const TRIAL2 = {
    type: jsPsychPsychophysics,
    pixi: pixi_flag,
    stimuli: [BOTTOM_LEFT, BOTTOM_RIGHT, TOP_RIGHT, TOP_LEFT, dot1, dot2, dot3, dot4, fix1, fix2],
    canvas_height: CANVAS_SIZE[0],
    canvas_width: CANVAS_SIZE[1],
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

    exp.push(TRIAL1);
    exp.push(TRIAL2);

    // exp.push(fullscreen(true));
    // exp.push(browser_check(CANVAS_SIZE));
    // exp.push(resize_browser());
    // exp.push(welcome_message());
    // exp.push(vp_info_form("/Common8+/vpInfoForm_de.html"));
    // exp.push(mouse_cursor(false));
    // exp.push(TASK_INSTRUCTIONS1);
    //exp.push(TASK_INSTRUCTIONS2);

    //for (let blk = 0; blk < PRMS.nblks; blk += 1) {
    //    exp.push(TASK_INSTRUCTIONS_BLOCK);
    //    let blk_timeline = TRIAL_TIMELINE;
    //    blk_timeline.sample = {
    //        type: "fixed-repetitions",
    //        size: PRMS.ntrls / TRIAL_TABLE.length,
    //    };
    //    exp.push(blk_timeline); // trials within a block
    //    exp.push(BLOCK_FEEDBACK); // show previous block performance
    //}

    //// save data
    //exp.push(SAVE_DATA);

    //// debrief
    //exp.push(mouse_cursor(true));
    //exp.push(END_SCREEN);
    //exp.push(end_message());
    //exp.push(fullscreen(false));

    return exp;
}
const EXP = genExpSeq();

// jsPsych.simulate(EXP, "data-only");
// jsPsych.simulate(EXP, "visual");
jsPsych.run(EXP);
