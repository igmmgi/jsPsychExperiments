// Flanker Task PES
// Stimuli: Flanker array of arrows (left/right)
// Task: In which direction does the central arrow point?
//
// Trial Structure
// Central fixation cross for 500 ms
// Central stimulus until response (or 2000 ms)
// If incorrect, feedback screen for 1500 ms
// inter-trial-interval of 500 ms
//
// Block structure
// 12 blocks of 56 trials

const jsPsych = initJsPsych({});

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const CANVAS_COLOUR = "rgba(200, 200, 200, 1)";
const CANVAS_SIZE = [720, 1280];

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////

const PRMS = {
    screenRes: [960, 720], // minimum screen resolution requested
    nTrlsPrac: 20, // number of trials per practice block
    nTrlsExp: 80,  // number of trials per experimental block
    nBlks: 14, // 2 practice + 12 experimental // number of blocks
    fixSize: 15, // duration of the fixation cross
    fixWidth: 5, // size of fixation cross
    fixDur: 500, // duration of the fixation cross
    fbDur: [750, 750, 750, 750], // feedback duration for response type (correct, incorrect, too slow, too fast)
    tooSlow: 2000, // feedback duration for correct and incorrect trials, respectively
    tooFast: 0, // feedback duration for correct and incorrect trials, respectively
    fbText: ["Richtig", "Falsch!", "Zu langsam!", "Zu schnell!"],
    iti: 750, // duration of the inter-trial-interval
    fbTxtSizeBlock: 30,
    targetError: 20,
    stepSize: 3, // 3 degree step size so it is visible
    angleDeviation: 0, // starts at 0 degrees (easiest)
    rotateFlankers: true, // if true, distractors rotate with target
    respKeys: ["Q", "P"],
    target: ["left", "right"], // do not shuffle! Q=left, P=right
    flankerEccentricity: 150,
    arrowSize: 100,
    cBlk: 1,
    cTrl: 1,
};




////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const WELCOME_INSTRUCTIONS = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: generate_formatted_html({
        text: `Willkommen zu unserem Experiment:<br><br>
               Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.
               Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und genügend Zeit hast,
               um das Experiment durchzuführen. Wir bitten dich die nächsten ca. 30-35 Minuten konzentriert zu arbeiten.<br><br>
               Du erhältst Informationen zur Versuchspersonenstunde nach dem Experiment.
               Bei Fragen oder Problemen wende dich bitte an:<br><br>
               xxx.xxx<br><br>
               Drücke eine beliebige Taste, um fortzufahren`,
        align: "left",
        colour: "black",
        fontsize: 30,
    }),
    on_start: function () {
        document.body.style.backgroundColor = CANVAS_COLOUR;
    }
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
const EN_DE = { left: "links", right: "rechts" };

const RESP_TEXT = generate_formatted_html({
    text: `${pad_me(EN_DE[PRMS.target[0]], 20) +
        pad_me(EN_DE[PRMS.target[1]], 20) +
        "<br>" +
        pad_me("(Taste-" + PRMS.respKeys[0] + ")", 20) +
        pad_me("(Taste-" + PRMS.respKeys[1] + ")", 20)
        }`,
    align: "center",
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
                text: `Mini-Block ${PRMS.cBlk} von ${PRMS.nBlks}:<br><br>
               Du musst in jedem Durchgang entscheiden in welche Richtung der mittlere Pfeil zeigt.
               Reagiere wie folgt:<br>`,
                align: "left",
                colour: "black",
                fontsize: 30,
            }) +
            RESP_TEXT +
            generate_formatted_html({
                text: `Drücke eine beliebige Taste, um fortzufahren.`,
                align: "left",
                colour: "black",
                fontsize: 30,
            });
    },
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////
function draw_fixation(c) {
    "use strict";
    let ctx = c.getContext("2d");
    ctx.translate(c.width / 2, c.height / 2);
    ctx.lineWidth = PRMS.fixWidth;
    ctx.moveTo(-PRMS.fixSize, 0);
    ctx.lineTo(PRMS.fixSize, 0);
    ctx.stroke();
    ctx.moveTo(0, -PRMS.fixSize);
    ctx.lineTo(0, PRMS.fixSize);
    ctx.stroke();
}

const FIXATION_CROSS = {
    type: jsPsychCanvasKeyboardResponse,
    canvas_size: CANVAS_SIZE,
    response_ends_trial: false,
    trial_duration: PRMS.fixDur,
    stimulus: draw_fixation,
};

function draw_arrow(ctx, x, y, size, angle, colour) {
    "use strict";
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle * Math.PI / 180);
    ctx.beginPath();
    ctx.moveTo(-size / 2, -size / 6);
    ctx.lineTo(size / 6, -size / 6);
    ctx.lineTo(size / 6, -size / 2);
    ctx.lineTo(size / 2, 0);
    ctx.lineTo(size / 6, size / 2);
    ctx.lineTo(size / 6, size / 6);
    ctx.lineTo(-size / 2, size / 6);
    ctx.closePath();
    ctx.fillStyle = colour;
    ctx.fill();
    ctx.restore();
}

function draw_stimulus(c, args) {
    "use strict";
    let ctx = c.getContext("2d");
    ctx.translate(c.width / 2, c.height / 2);

    let target_angle = (args.target === "right" ? 0 : 180) + args.deviation;
    let distractor_angle = args.distractor === "right" ? 0 : 180;
    if (PRMS.rotateFlankers) {
        distractor_angle += args.deviation;
    }

    // left distractor
    draw_arrow(ctx, -PRMS.flankerEccentricity, 0, PRMS.arrowSize, distractor_angle, "black");
    // right distractor
    draw_arrow(ctx, PRMS.flankerEccentricity, 0, PRMS.arrowSize, distractor_angle, "black");
    // target
    draw_arrow(ctx, 0, 0, PRMS.arrowSize, target_angle, "black");
}

const FLANKER = {
    type: jsPsychCanvasKeyboardResponse,
    canvas_size: CANVAS_SIZE,
    response_ends_trial: true,
    choices: PRMS.respKeys,
    trial_duration: PRMS.tooSlow,
    stimulus: null,
    data: {
        stim_type: "pes",
        target: jsPsych.timelineVariable("target"),
        compatibility: jsPsych.timelineVariable("compatibility"),
        correct_key: jsPsych.timelineVariable("correct_key"),
    },
    on_start: function (trial) {
        "use strict";

        let target = jsPsych.evaluateTimelineVariable("target");
        let distractor = jsPsych.evaluateTimelineVariable("distractor");

        let deviation = Math.random() < 0.5 ? PRMS.angleDeviation : -PRMS.angleDeviation;

        trial.stimulus = function (c) {
            draw_stimulus(c, { target: target, distractor: distractor, deviation: deviation });
        };
    },
    on_finish: function () {
        codeTrial();
        PRMS.cTrl += 1;
    },
};

const TRIAL_FEEDBACK = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "",
    response_ends_trial: false,
    trial_duration: 0,
    on_start: function (trial) {
        let dat = jsPsych.data.get().filter({ stim_type: "pes" }).last(1).values()[0];
        trial.trial_duration = PRMS.fbDur[dat.corr_code - 1];

        let block_type = BLOCK_CONDITIONS[PRMS.cBlk - 1];
        let feedback_text = (block_type === "feedback") ? PRMS.fbText[dat.corr_code - 1] : "";

        trial.stimulus = generate_formatted_html({
            text: `${feedback_text}`,
            align: "center",
            fontsize: 30,
            width: "1200px",
            lineheight: 1.5,
        });
    },
};

const ITI = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "",
    response_ends_trial: false,
    trial_duration: PRMS.iti,
};

function codeTrial() {
    "use strict";

    let dat = jsPsych.data.get().filter({ stim_type: "pes" }).last(1).values()[0];
    dat.rt = dat.rt !== null ? dat.rt : PRMS.tooSlow;

    // console.log(`-------`);
    // console.log(`Compatibility: ${dat.compatibility}`);
    // console.log(`Ratio: ${dat.ratio}`);

    let corrCode = 0;
    let correctKey = jsPsych.pluginAPI.compareKeys(dat.response, dat.correct_key);

    if (correctKey && dat.rt > PRMS.tooFast && dat.rt < PRMS.tooSlow) {
        corrCode = 1; // correct
    } else if (!correctKey && dat.rt > PRMS.tooFast && dat.rt < PRMS.tooSlow) {
        corrCode = 2; // choice error
    } else if (dat.rt >= PRMS.tooSlow) {
        corrCode = 3; // too slow
    } else if (dat.rt <= PRMS.tooFast) {
        corrCode = 4; // too fast
    }
    let current_angle = PRMS.angleDeviation;

    // Adaptive angle adjustment
    if (corrCode === 1) { // correct -> harder -> increase angle
        PRMS.angleDeviation = Math.min(90, PRMS.angleDeviation + PRMS.stepSize);
    } else if (corrCode === 2) { // incorrect -> easier -> decrease angle
        let stepUp = PRMS.stepSize * ((100 - PRMS.targetError) / PRMS.targetError);
        PRMS.angleDeviation = Math.max(0, PRMS.angleDeviation - stepUp);
    }

    jsPsych.data.addDataToLastTrial({
        date: Date(),
        blockNum: PRMS.cBlk,
        trialNum: PRMS.cTrl,
        corr_code: corrCode,
        angle_deviation: current_angle,
        block_type: BLOCK_CONDITIONS[PRMS.cBlk - 1],
    });
}

const BLOCK_FEEDBACK = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "",
    response_ends_trial: true,
    on_start: function (trial) {
        let block_dvs = calculate_block_performance({
            filter_options: { stim_type: "pes", blockNum: PRMS.cBlk },
        });
        let text = block_feedback_text(PRMS.cBlk, PRMS.nBlks, block_dvs.mean_rt, block_dvs.error_rate, (language = "de"));
        trial.stimulus = `<div style="font-size:${PRMS.fbTxtSizeBlock}px;">${text}</div>`;
    },
    on_finish: function () {
        PRMS.cTrl = 1;
        PRMS.cBlk += 1;
    },
};

// prettier-ignore
const TRIAL_TABLE = [
    { distractor: PRMS.target[0], target: PRMS.target[0], compatibility: "comp", correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[0])] },
    { distractor: PRMS.target[0], target: PRMS.target[1], compatibility: "incomp", correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[1])] },
    { distractor: PRMS.target[1], target: PRMS.target[0], compatibility: "incomp", correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[0])] },
    { distractor: PRMS.target[1], target: PRMS.target[1], compatibility: "comp", correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[1])] },
];

// prettier-ignore
const TRIAL_TIMELINE = {
    timeline: [FIXATION_CROSS, FLANKER, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIAL_TABLE
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
    save_data_server("/Common8+/write_data.php", data_fn, { stim_type: "pes" });
    // save_data_local(data_fn, { stim_type: 'pes' });
}

const SAVE_DATA = {
    type: jsPsychCallFunction,
    func: save,
    post_trial_gap: 1000,
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////

const BLOCK_CONDITIONS = shuffle(["feedback", "no_feedback"]).concat(
    shuffle(repeat_array(["feedback", "no_feedback"], 6))
);

function genExpSeq() {
    "use strict";

    let exp = [];

    exp.push(fullscreen(true));
    exp.push(browser_check([PRMS.screenRes[1], PRMS.screenRes[0]]));
    exp.push(resize_browser());
    exp.push(welcome_message());
    exp.push(vp_info_form("/Common8+/vpInfoForm_de.html"));
    exp.push(mouse_cursor(false));

    exp.push(WELCOME_INSTRUCTIONS);
    exp.push(TASK_INSTRUCTIONS);

    for (let blk = 0; blk < PRMS.nBlks; blk += 1) {
        let blk_timeline = { ...TRIAL_TIMELINE };
        let nTrls = (blk < 2) ? PRMS.nTrlsPrac : PRMS.nTrlsExp;
        blk_timeline.sample = {
            type: "fixed-repetitions",
            size: nTrls / TRIAL_TABLE.length,
        };
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
const EXP = genExpSeq();

jsPsych.run(EXP);
