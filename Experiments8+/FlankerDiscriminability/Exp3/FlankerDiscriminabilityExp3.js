// ╭───────────────────────────────────────────────────────╮
// │ Flanker Task with manipulation of target/flanker      │
// │ discriminability (contrast manipulation)              │
// │ Stimuli: Standard letter flanker task with H/S letter │
// │ stimuli                                               │
// │                                                       │
// │ Trial Structure:                                      │
// │ Central fixation cross for 500 ms                     │
// │ Central stimulus until response (or 2000 ms)          │
// │ If incorrect, feedback screen for 1500 ms             │
// │ inter-trial-interval of 500 ms                        │
// │                                                       │
// │ Block structure                                       │
// │ 12 blocks of 64 trials                                │
// ╰───────────────────────────────────────────────────────╯

const jsPsych = initJsPsych({
    on_finish: function () {
        if (PRMS.cblk >= 12) {
            window.location.assign(
                "https://fernuni-hagen.sona-systems.com/webstudy_credit.aspx?experiment_id=473&credit_token=a0e390ad4be34757be8821477dad6101&survey_code=" +
                    jsPsych.data.urlVariables().sona_id,
            );
        }
    },
});

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const CANVAS_COLOUR = "rgba(0, 0, 0, 1)";
const CANVAS_SIZE = [720, 1280]; // height,width

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////

const PRMS = {
    ntrls: 64, // number of trials per block (multiple of 8)
    nblks: 12, // number of blocks
    fix_size: 10, // size of the fixation cross
    fix_width: 5, // width of fixation cross
    fix_duration: 500, // duration of the fixation cross
    fix_colour: "rgba(145, 145, 145, 1)", // colour of the fixation cross
    feedback_duration: [0, 1500, 1500, 1500], // feedback duration for response type (correct, incorrect, too slow, too fast)
    too_slow: 2000, // feedback duration for correct and incorrect trials, respectively
    too_fast: 0, // feedback duration for correct and incorrect trials, respectively
    feedback_text: ["", "Falsch!", "Zu langsam!", "Zu schnell!"],
    iti: 500, // duration of the inter-trial-interval
    stim_font: "50px Arial", // before: 110px Arial
    feedback_font: "50px Arial",
    feedback_colour: "rgba(145, 145, 145, 1)",
    colours: { mid: "rgba(145, 145, 145, 1)", low: "rgba(48, 48, 48, 1)", high: "rgba(255, 255, 255, 1)" },
    resp_keys: ["S", "H"],
    target: ["S", "H"],
    ctrl: 1,
    cblk: 1,
};

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const WELCOME_INSTRUCTIONS = {
    type: jsPsychHtmlKeyboardResponse,
    canvas_size: CANVAS_SIZE,
    stimulus: generate_formatted_html({
        text: `Willkommen zu unserem Experiment:<br><br>
Die Teilnahme ist freiwillig und Du darfst das Experiment jederzeit abbrechen.
Bitte stelle sicher, dass Du Dich in einer ruhigen Umgebung befindest und genügend Zeit hast,
um das Experiment durchzuführen. Wir bitten Dich, die nächsten ca. 30-35 Minuten konzentriert zu arbeiten.<br><br>
Informationen zur Versuchspersonenstunde erhälst Du nach dem Experiment.
Bei Fragen oder Problemen wende Dich bitte an:<br><br>
ruben.ellinghaus@fernuni-hagen.de<br><br>
Drücke eine beliebige Taste, um fortzufahren`,
        align: "left",
        color: PRMS.colours.mid,
        fontsize: 30,
        bold: false,
    }),
    on_start: function () {
        document.body.style.background = "#000000";
    },
    post_trial_gap: 1000,
};

function pad_me(str, npad) {
    let len = Math.floor((npad - str.length) / 2);
    str = " ".repeat(len) + str + " ".repeat(len);
    return str
        .split("")
        .map(function (c) {
            return c === " " ? "&nbsp;" : c;
        })
        .join("");
}

// response keys
const RESP_TEXT = generate_formatted_html({
    text: `${
        pad_me(PRMS.target[0], 20) +
        pad_me(PRMS.target[1], 20) +
        "<br>" +
        pad_me(PRMS.resp_keys[0] + "-Taste", 20) +
        pad_me(PRMS.resp_keys[1] + "-Taste", 20)
    }`,
    align: "center",
    color: PRMS.colours.mid,
    fontsize: 30,
    bold: true,
    lineheight: 1.5,
});

const TASK_INSTRUCTIONS = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "",
    on_start: function (trial) {
        trial.stimulus =
            generate_formatted_html({
                text: `Mini-Block ${PRMS.cblk} von ${PRMS.nblks}:<br><br>
               Du musst in jedem Durchgang entscheiden, ob der Buchstabe in der Mitte ein ${PRMS.target[0]} oder ein ${PRMS.target[1]} ist.
               Reagiere wie folgt:<br>`,
                align: "left",
                color: PRMS.colours.mid,
                fontsize: 30,
                bold: false,
            }) +
            RESP_TEXT +
            generate_formatted_html({
                text: `Drücke eine beliebige Taste, um fortzufahren.`,
                align: "left",
                color: PRMS.colours.mid,
                fontsize: 30,
            });
    },
    post_trial_gap: 1000,
};

function canvas_style(ctx) {
    ctx.fillStyle = CANVAS_COLOUR;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2); // make center (0, 0) for easier positioning!
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

function draw_flanker(c, args) {
    "use strict";
    let ctx = c.getContext("2d");
    ctx = canvas_style(ctx);

    ctx.font = PRMS.stim_font;
    ctx.textAlign = "center";

    // draw target
    ctx.fillStyle = PRMS.colours[args.target_intensity];
    ctx.fillText(`  ${args.target}  `, 0, 20);

    // draw flanker
    ctx.fillStyle = PRMS.colours[args.flanker_intensity];
    ctx.fillText(`${args.flanker}${args.flanker}   ${args.flanker}${args.flanker}`, 0, 20);
}

const FLANKER = {
    type: jsPsychCanvasKeyboardResponse,
    stimulus: null,
    canvas_size: CANVAS_SIZE,
    response_ends_trial: true,
    choices: PRMS.resp_keys,
    trial_duration: PRMS.too_slow,
    data: {
        stim_type: "fd",
        block: jsPsych.timelineVariable("block"),
        target: jsPsych.timelineVariable("target"),
        target_intensity: jsPsych.timelineVariable("target_intensity"),
        flanker: jsPsych.timelineVariable("flanker"),
        flanker_intensity: jsPsych.timelineVariable("flanker_intensity"),
        compatibility: jsPsych.timelineVariable("comp"),
        correct_key: jsPsych.timelineVariable("correct_key"),
    },
    on_start: function (trial) {
        "use strict";
        trial.stimulus = function (c) {
            draw_flanker(c, {
                target: jsPsych.evaluateTimelineVariable("target"),
                target_intensity: jsPsych.evaluateTimelineVariable("target_intensity"),
                flanker: jsPsych.evaluateTimelineVariable("flanker"),
                flanker_intensity: jsPsych.evaluateTimelineVariable("flanker_intensity"),
            });
        };
    },
    on_finish: function () {
        code_trial();
        PRMS.ctrl += 1;
    },
};

function draw_trial_feedback(c, args) {
    "use strict";
    let ctx = c.getContext("2d");
    ctx = canvas_style(ctx);

    ctx.font = PRMS.feedback_font;
    ctx.textAlign = "center";

    // draw target
    ctx.fillStyle = PRMS.feedback_colour;
    ctx.fillText(`${args.feedback_text}`, 0, 15);
}

const TRIAL_FEEDBACK = {
    type: jsPsychCanvasKeyboardResponse,
    stimulus: draw_iti,
    canvas_size: CANVAS_SIZE,
    response_ends_trial: false,
    trial_duration: 0,
    on_start: function (trial) {
        let dat = jsPsych.data.get().last(1).values()[0];
        trial.trial_duration = PRMS.feedback_duration[dat.corr_code - 1];
        if (dat.corrCode !== 1) {
            trial.stimulus = function (c) {
                draw_trial_feedback(c, { feedback_text: PRMS.feedback_text[dat.corr_code - 1] });
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

    // console.log(`-------`);
    // console.log(`block: ${dat.block}`);
    // console.log(`target: ${dat.target}`);
    // console.log(`target_intensity: ${dat.target_intensity}`);
    // console.log(`flanker: ${dat.target}`);
    // console.log(`flanker_intensity: ${dat.flanker_intensity}`);
    // console.log(`rt: ${dat.rt}`);
    // console.log(`compatibility: ${dat.compatibility}`);
    // console.log(`corr_code: ${dat.rt}`);

    jsPsych.data.addDataToLastTrial({
        date: Date(),
        block_num: PRMS.cblk,
        trial_num: PRMS.ctrl,
        corr_code: corr_code,
    });
}

const BLOCK_FEEDBACK = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "",
    response_ends_trial: true,
    on_start: function (trial) {
        let block_dvs = calculate_block_performance({
            filter_options: { stim_type: "fd", block_num: PRMS.cblk },
        });
        let text = block_feedback_text(
            PRMS.cblk,
            PRMS.nblks,
            block_dvs.mean_rt,
            block_dvs.error_rate,
            (language = "de"),
        );
        trial.stimulus = `<div style="color: ${PRMS.colours.mid}; font-size:30px;">${text}</div>`;
    },
    on_finish: function () {
        PRMS.ctrl = 1;
        PRMS.cblk += 1;
    },
    post_trial_gap: 1000,
};

// prettier-ignore
const TRIAL_TABLE_TARGET = [
  { block: "target", target_intensity: "low",  flanker_intensity: "mid", target: PRMS.target[0], flanker: PRMS.target[0], comp: "comp",   correct_key: PRMS.resp_keys[PRMS.target.indexOf(PRMS.target[0])]},
  { block: "target", target_intensity: "low",  flanker_intensity: "mid", target: PRMS.target[1], flanker: PRMS.target[1], comp: "comp",   correct_key: PRMS.resp_keys[PRMS.target.indexOf(PRMS.target[1])]},
  { block: "target", target_intensity: "low",  flanker_intensity: "mid", target: PRMS.target[0], flanker: PRMS.target[1], comp: "incomp", correct_key: PRMS.resp_keys[PRMS.target.indexOf(PRMS.target[0])]},
  { block: "target", target_intensity: "low",  flanker_intensity: "mid", target: PRMS.target[1], flanker: PRMS.target[0], comp: "incomp", correct_key: PRMS.resp_keys[PRMS.target.indexOf(PRMS.target[1])]},
  { block: "target", target_intensity: "high", flanker_intensity: "mid", target: PRMS.target[0], flanker: PRMS.target[0], comp: "comp",   correct_key: PRMS.resp_keys[PRMS.target.indexOf(PRMS.target[0])]},
  { block: "target", target_intensity: "high", flanker_intensity: "mid", target: PRMS.target[1], flanker: PRMS.target[1], comp: "comp",   correct_key: PRMS.resp_keys[PRMS.target.indexOf(PRMS.target[1])]},
  { block: "target", target_intensity: "high", flanker_intensity: "mid", target: PRMS.target[0], flanker: PRMS.target[1], comp: "incomp", correct_key: PRMS.resp_keys[PRMS.target.indexOf(PRMS.target[0])]},
  { block: "target", target_intensity: "high", flanker_intensity: "mid", target: PRMS.target[1], flanker: PRMS.target[0], comp: "incomp", correct_key: PRMS.resp_keys[PRMS.target.indexOf(PRMS.target[1])]},
];

// prettier-ignore
const TRIAL_TABLE_DISTRACTOR = [
  { block: "distractor", target_intensity: "mid", flanker_intensity: "low",  target: PRMS.target[0], flanker: PRMS.target[0], comp: "comp",   correct_key: PRMS.resp_keys[PRMS.target.indexOf(PRMS.target[0])] },
  { block: "distractor", target_intensity: "mid", flanker_intensity: "low",  target: PRMS.target[1], flanker: PRMS.target[1], comp: "comp",   correct_key: PRMS.resp_keys[PRMS.target.indexOf(PRMS.target[1])] },
  { block: "distractor", target_intensity: "mid", flanker_intensity: "low",  target: PRMS.target[0], flanker: PRMS.target[1], comp: "incomp", correct_key: PRMS.resp_keys[PRMS.target.indexOf(PRMS.target[0])] },
  { block: "distractor", target_intensity: "mid", flanker_intensity: "low",  target: PRMS.target[1], flanker: PRMS.target[0], comp: "incomp", correct_key: PRMS.resp_keys[PRMS.target.indexOf(PRMS.target[1])] },
  { block: "distractor", target_intensity: "mid", flanker_intensity: "high", target: PRMS.target[0], flanker: PRMS.target[0], comp: "comp",   correct_key: PRMS.resp_keys[PRMS.target.indexOf(PRMS.target[0])] },
  { block: "distractor", target_intensity: "mid", flanker_intensity: "high", target: PRMS.target[1], flanker: PRMS.target[1], comp: "comp",   correct_key: PRMS.resp_keys[PRMS.target.indexOf(PRMS.target[1])] },
  { block: "distractor", target_intensity: "mid", flanker_intensity: "high", target: PRMS.target[0], flanker: PRMS.target[1], comp: "incomp", correct_key: PRMS.resp_keys[PRMS.target.indexOf(PRMS.target[0])] },
  { block: "distractor", target_intensity: "mid", flanker_intensity: "high", target: PRMS.target[1], flanker: PRMS.target[0], comp: "incomp", correct_key: PRMS.resp_keys[PRMS.target.indexOf(PRMS.target[1])] },
];

const TRIAL_TIMELINE_TARGET = {
    timeline: [FIXATION_CROSS, FLANKER, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIAL_TABLE_TARGET,
};

const TRIAL_TIMELINE_DISTRACTOR = {
    timeline: [FIXATION_CROSS, FLANKER, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIAL_TABLE_DISTRACTOR,
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
        color: PRMS.colours.mid,
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
    jsPsych.data.addProperties({ vp_num: VP_NUM });

    const data_fn = `${DIR_NAME}data/${EXP_NAME}_${VP_NUM}`;
    save_data_server("/Common8+/write_data.php", data_fn, { stim_type: "fd" });
    // save_data_local(data_fn, { stim_type: "fd" });
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
    exp.push(browser_check(CANVAS_SIZE));
    exp.push(resize_browser());
    exp.push(welcome_message());
    exp.push(vp_info_form("/Common8+/vpInfoForm_de.html"));
    exp.push(mouse_cursor(false));

    exp.push(WELCOME_INSTRUCTIONS);
    exp.push(TASK_INSTRUCTIONS);

    // alternating block types with random assignment of starting order
    let blk_type = repeat_array(shuffle(["target", "distractor"]), PRMS.nblks / 2);

    for (let blk = 0; blk < PRMS.nblks; blk += 1) {
        let blk_timeline;
        if (blk_type[blk] === "target") {
            blk_timeline = { ...TRIAL_TIMELINE_TARGET };
            blk_timeline.sample = {
                type: "fixed-repetitions",
                size: PRMS.ntrls / TRIAL_TABLE_TARGET.length,
            };
        } else if (blk_type[blk] === "distractor") {
            blk_timeline = { ...TRIAL_TIMELINE_DISTRACTOR };
            blk_timeline.sample = {
                type: "fixed-repetitions",
                size: PRMS.ntrls / TRIAL_TABLE_DISTRACTOR.length,
            };
        }
        exp.push(blk_timeline); // trials within a block
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
const EXP = generate_exp();

// jsPsych.simulate(EXP, "data-only");
// jsPsych.simulate(EXP, "visual");
jsPsych.run(EXP);
