// Flanker Task with manipulation of target discrimanibility
// Stimuli: Squares filled with small red/blue dots (varying proportions)
// Two levels of target difficulty: easy (e.g., 10 vs. 90 %) vs. hard (e.g., 37.5 vs. 62.5%)
// Task: More blue vs. more red?
//
// Trial Structure
// Central fixation cross for 500 ms
// Central stimulus until response (or 2000 ms)
// If incorrect, feedback screen for 1500 ms
// inter-trial-interval of 500 ms
//
// Block structure
// 11 blocks of 64 trials

const jsPsych = initJsPsych({ on_finish: function () {} });

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const CANVAS_COLOUR = "rgba(200, 200, 200, 1)";
const CANVAS_SIZE = [1280, 720];
const CANVAS_BORDER = "5px solid black";

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////

const PRMS = {
    screenRes: [960, 720], // minimum screen resolution requested
    nTrls: 64, // number of trials per block
    nBlks: 12, // number of blocks
    fixSize: 15, // duration of the fixation cross
    fixWidth: 5, // size of fixation cross
    fixDur: 500, // duration of the fixation cross
    fbDur: [0, 1500, 1500, 1500], // feedback duration for response type (correct, incorrect, too slow, too fast)
    tooSlow: 2000, // feedback duration for correct and incorrect trials, respectively
    tooFast: 0, // feedback duration for correct and incorrect trials, respectively
    fbText: ["", "Falsch!", "Zu langsam!", "Zu schnell!"],
    iti: 500, // duration of the inter-trial-interval
    stimFont: "110px Arial",
    fbFont: "200px Arial",
    colours: ["rgba(0, 0, 255, 0.9)", "rgba(255, 0, 0, 0.9)"],
    ratioTargetEasyT: [10, 90], // should sum to 100!
    ratioTargetHardT: [30, 70], // should sum to 100!
    ratioDistractorEasyT: [20, 80],
    ratioDistractorHardT: [20, 80],
    ratioTargetEasyD: [20, 80], // should sum to 100!
    ratioTargetHardD: [20, 80], // should sum to 100!
    ratioDistractorEasyD: [10, 90],
    ratioDistractorHardD: [30, 70],
    respKeys: ["Q", "P"],
    target: shuffle(["blue", "red"]),
    flankerEccentricity: 70,
    dotRadius: 2,
    squareSize: 30,
    dotGaps: 5,
    cBlk: 1,
    cTrl: 1,
};

const EN_DE = { blue: "blau", red: "rot" };

function calculateNumberOfDots() {
    // Required for ratio manipulation in VTS
    PRMS.nDots = 0;
    for (let rows = -PRMS.squareSize; rows <= PRMS.squareSize; rows += PRMS.dotGaps) {
        for (let cols = -PRMS.squareSize; cols <= PRMS.squareSize; cols += PRMS.dotGaps) {
            PRMS.nDots += 1;
        }
    }
}

const COUNT_DOTS = {
    type: jsPsychCallFunction,
    func: calculateNumberOfDots,
};

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
               Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.
               Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und genügend Zeit hast,
               um das Experiment durchzuführen. Wir bitten dich die nächsten ca. 30-35 Minuten konzentriert zu arbeiten.<br><br>
               Du erhältst Informationen zur Versuchspersonenstunde nach dem Experiment.
               Bei Fragen oder Problemen wende dich bitte an:<br><br>
               ruben.ellinghaus@fernuni-hagen.de<br><br>
               Drücke eine beliebige Taste, um fortzufahren`,
        align: "left",
        colour: "black",
        fontsize: 30,
    }),
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
        pad_me("mehr " + EN_DE[PRMS.target[0]], 20) +
        pad_me("mehr " + EN_DE[PRMS.target[1]], 20) +
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
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    on_start: function (trial) {
        trial.stimulus =
            generate_formatted_html({
                text: `Mini-Block ${PRMS.cBlk} von ${PRMS.nBlks}:<br><br>
               Du musst in jedem Durchgang entscheiden ob das Quadrat in der Mitte mehr blaue oder mehr rote Punkte hat.
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
function drawFixation() {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");
    ctx.lineWidth = PRMS.fixWidth;
    ctx.moveTo(-PRMS.fixSize, 0);
    ctx.lineTo(PRMS.fixSize, 0);
    ctx.stroke();
    ctx.moveTo(0, -PRMS.fixSize);
    ctx.lineTo(0, PRMS.fixSize);
    ctx.stroke();
}

const FIXATION_CROSS = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    response_ends_trial: false,
    trial_duration: PRMS.fixDur,
    func: drawFixation,
};

function draw_square(ctx, square, pos_x, pos_y) {
    "use strict";
    let radius = PRMS.dotRadius;

    // draw central target
    let idx = 0;
    for (let rows = -PRMS.squareSize - pos_x; rows <= PRMS.squareSize - pos_x; rows += PRMS.dotGaps) {
        for (let cols = -PRMS.squareSize - pos_y; cols <= PRMS.squareSize - pos_y; cols += PRMS.dotGaps) {
            let centerX = rows;
            let centerY = cols;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = square[idx];
            ctx.fill();
            idx += 1;
        }
    }
}

function drawStimulus(args) {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");

    draw_square(ctx, args.colours_target, 0, 0);
    draw_square(ctx, args.colours_distractor, PRMS.flankerEccentricity, 0); // left flanker
    draw_square(ctx, args.colours_distractor, -PRMS.flankerEccentricity, 0); // right flanker
    draw_square(ctx, args.colours_distractor, 0, PRMS.flankerEccentricity); // bottom flanker
    draw_square(ctx, args.colours_distractor, 0, -PRMS.flankerEccentricity); // top flanker
}

const FLANKER = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    response_ends_trial: true,
    choices: null,
    trial_duration: PRMS.tooSlow,
    func: drawStimulus,
    func_args: null,
    data: {
        stim_type: "fd",
        block: jsPsych.timelineVariable("block"),
        ratio_target: jsPsych.timelineVariable("ratio_target"),
        ratio_distractor: jsPsych.timelineVariable("ratio_distractor"),
        target: jsPsych.timelineVariable("target"),
        compatibility: jsPsych.timelineVariable("compatibility"),
        correct_key: jsPsych.timelineVariable("correct_key"),
    },
    on_start: function (trial) {
        "use strict";

        console.log(trial.data);
        let ratio_target;
        if (trial.data.block === "target") {
            ratio_target = trial.data.ratio_target === "easy" ? PRMS.ratioTargetEasyT : PRMS.ratioTargetHardT;
        } else if (trial.data.block === "distractor") {
            ratio_target = trial.data.ratio_target === "easy" ? PRMS.ratioTargetEasyD : PRMS.ratioTargetHardD;
        }
        let dot_colours_target = repeatArray(CANVAS_COLOUR, Math.round(PRMS.nDots));
        if (trial.data.target === "blue") {
            dot_colours_target = shuffle(
                repeatArray(PRMS.colours[0], Math.round(PRMS.nDots * (ratio_target[1] / 100))).concat(
                    repeatArray(PRMS.colours[1], Math.round((PRMS.nDots * ratio_target[0]) / 100)),
                ),
            );
        } else if (trial.data.target === "red") {
            dot_colours_target = shuffle(
                repeatArray(PRMS.colours[1], Math.round(PRMS.nDots * (ratio_target[1] / 100))).concat(
                    repeatArray(PRMS.colours[0], Math.round((PRMS.nDots * ratio_target[0]) / 100)),
                ),
            );
        }

        let ratio_distractor;
        if (trial.data.block === "target") {
            ratio_distractor =
                trial.data.ratio_distractor === "easy" ? PRMS.ratioDistractorEasyT : PRMS.ratioDistractorHardT;
        } else if (trial.data.block === "distractor") {
            ratio_distractor =
                trial.data.ratio_distractor === "easy" ? PRMS.ratioDistractorEasyD : PRMS.ratioDistractorHardD;
        }
        let dot_colours_distractor = repeatArray(CANVAS_COLOUR, Math.round(PRMS.nDots));
        let colours_distractor =
            trial.data.compatibility === "comp" ? PRMS.colours : [PRMS.colours[1], PRMS.colours[0]];
        if (trial.data.target === "blue") {
            dot_colours_distractor = shuffle(
                repeatArray(colours_distractor[0], Math.round(PRMS.nDots * (ratio_distractor[1] / 100))).concat(
                    repeatArray(colours_distractor[1], Math.round((PRMS.nDots * ratio_distractor[0]) / 100)),
                ),
            );
        } else if (trial.data.target === "red") {
            dot_colours_distractor = shuffle(
                repeatArray(colours_distractor[1], Math.round(PRMS.nDots * (ratio_distractor[1] / 100))).concat(
                    repeatArray(colours_distractor[0], Math.round((PRMS.nDots * ratio_distractor[0]) / 100)),
                ),
            );
        }

        trial.func_args = [{ colours_target: dot_colours_target, colours_distractor: dot_colours_distractor }];
    },
    on_finish: function () {
        codeTrial();
        PRMS.cTrl += 1;
    },
};

const TRIAL_FEEDBACK = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    response_ends_trial: false,
    trial_duration: 0,
    on_start: function (trial) {
        let dat = jsPsych.data.get().last(1).values()[0];
        trial.trial_duration = PRMS.fbDur[dat.corrCode - 1];
        if (dat.corrCode !== 1) {
            trial.stimulus = generate_formatted_html({
                text: `${PRMS.fbText[dat.corrCode - 1]}`,
                align: "center",
                fontsize: 30,
                width: "1200px",
                lineheight: 1.5,
            });
        }
    },
};

const ITI = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    response_ends_trial: false,
    trial_duration: PRMS.iti,
};

function codeTrial() {
    "use strict";

    let dat = jsPsych.data.get().last(1).values()[0];
    dat.rt = dat.rt !== null ? dat.rt : PRMS.tooSlow;

    console.log(`-------`);
    console.log(`Block type: ${dat.block}`);
    console.log(`Compatibility: ${dat.compatibility}`);
    console.log(`Ratio Target: ${dat.ratio_target}`);
    console.log(`Ratio Distractor: ${dat.ratio_distractor}`);

    let corrCode = 0;
    let correctKey = jsPsych.pluginAPI.compareKeys(dat.key_press, dat.correct_key);

    if (correctKey && dat.rt > PRMS.tooFast && dat.rt < PRMS.tooSlow) {
        corrCode = 1; // correct
    } else if (!correctKey && dat.rt > PRMS.tooFast && dat.rt < PRMS.tooSlow) {
        corrCode = 2; // choice error
    } else if (dat.rt >= PRMS.tooSlow) {
        corrCode = 3; // too slow
    } else if (dat.rt <= PRMS.tooFast) {
        corrCode = 4; // too fast
    }
    jsPsych.data.addDataToLastTrial({
        date: Date(),
        blockNum: PRMS.cBlk,
        trialNum: PRMS.cTrl,
        corrCode: corrCode,
    });
}

const BLOCK_FEEDBACK = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    response_ends_trial: true,
    on_start: function (trial) {
        let block_dvs = calculateBlockPerformance({
            filter_options: { stim_type: "fd", blockNum: PRMS.cBlk },
        });
        let text = blockFeedbackText(PRMS.cBlk, PRMS.nBlks, block_dvs.meanRt, block_dvs.errorRate, (language = "de"));
        trial.stimulus = `<div style="font-size:${PRMS.fbTxtSizeBlock}px;">${text}</div>`;
    },
    on_finish: function () {
        PRMS.cTrl = 1;
        PRMS.cBlk += 1;
    },
};

// prettier-ignore
const TRIAL_TABLE_TARGET = [
  { block: "target", ratio_target: "easy", ratio_distractor: "easy", distractor: PRMS.target[0], target: PRMS.target[0], compatibility: "comp",   correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[0])] },
  { block: "target", ratio_target: "easy", ratio_distractor: "easy", distractor: PRMS.target[0], target: PRMS.target[1], compatibility: "incomp", correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[1])] },
  { block: "target", ratio_target: "easy", ratio_distractor: "easy", distractor: PRMS.target[1], target: PRMS.target[0], compatibility: "incomp", correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[0])] },
  { block: "target", ratio_target: "easy", ratio_distractor: "easy", distractor: PRMS.target[1], target: PRMS.target[1], compatibility: "comp",   correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[1])] },
  { block: "target", ratio_target: "hard", ratio_distractor: "easy", distractor: PRMS.target[0], target: PRMS.target[0], compatibility: 'comp',   correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[0])] },
  { block: "target", ratio_target: "hard", ratio_distractor: "easy", distractor: PRMS.target[0], target: PRMS.target[1], compatibility: 'incomp', correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[1])] },
  { block: "target", ratio_target: "hard", ratio_distractor: "easy", distractor: PRMS.target[1], target: PRMS.target[0], compatibility: 'incomp', correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[0])] },
  { block: "target", ratio_target: "hard", ratio_distractor: "easy", distractor: PRMS.target[1], target: PRMS.target[1], compatibility: 'comp',   correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[1])] },
  { block: "target", ratio_target: "easy", ratio_distractor: "hard", distractor: PRMS.target[0], target: PRMS.target[0], compatibility: "comp",   correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[0])] },
  { block: "target", ratio_target: "easy", ratio_distractor: "hard", distractor: PRMS.target[0], target: PRMS.target[1], compatibility: "incomp", correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[1])] },
  { block: "target", ratio_target: "easy", ratio_distractor: "hard", distractor: PRMS.target[1], target: PRMS.target[0], compatibility: "incomp", correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[0])] },
  { block: "target", ratio_target: "easy", ratio_distractor: "hard", distractor: PRMS.target[1], target: PRMS.target[1], compatibility: "comp",   correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[1])] },
  { block: "target", ratio_target: "hard", ratio_distractor: "hard", distractor: PRMS.target[0], target: PRMS.target[0], compatibility: 'comp',   correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[0])] },
  { block: "target", ratio_target: "hard", ratio_distractor: "hard", distractor: PRMS.target[0], target: PRMS.target[1], compatibility: 'incomp', correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[1])] },
  { block: "target", ratio_target: "hard", ratio_distractor: "hard", distractor: PRMS.target[1], target: PRMS.target[0], compatibility: 'incomp', correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[0])] },
  { block: "target", ratio_target: "hard", ratio_distractor: "hard", distractor: PRMS.target[1], target: PRMS.target[1], compatibility: 'comp',   correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[1])] },
];

// prettier-ignore
const TRIAL_TABLE_DISTRACTOR = [
  { block: "distractor", ratio_target: "easy", ratio_distractor: "easy", distractor: PRMS.target[0], target: PRMS.target[0], compatibility: "comp",   correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[0])] },
  { block: "distractor", ratio_target: "easy", ratio_distractor: "easy", distractor: PRMS.target[0], target: PRMS.target[1], compatibility: "incomp", correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[1])] },
  { block: "distractor", ratio_target: "easy", ratio_distractor: "easy", distractor: PRMS.target[1], target: PRMS.target[0], compatibility: "incomp", correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[0])] },
  { block: "distractor", ratio_target: "easy", ratio_distractor: "easy", distractor: PRMS.target[1], target: PRMS.target[1], compatibility: "comp",   correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[1])] },
  { block: "distractor", ratio_target: "hard", ratio_distractor: "easy", distractor: PRMS.target[0], target: PRMS.target[0], compatibility: 'comp',   correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[0])] },
  { block: "distractor", ratio_target: "hard", ratio_distractor: "easy", distractor: PRMS.target[0], target: PRMS.target[1], compatibility: 'incomp', correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[1])] },
  { block: "distractor", ratio_target: "hard", ratio_distractor: "easy", distractor: PRMS.target[1], target: PRMS.target[0], compatibility: 'incomp', correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[0])] },
  { block: "distractor", ratio_target: "hard", ratio_distractor: "easy", distractor: PRMS.target[1], target: PRMS.target[1], compatibility: 'comp',   correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[1])] },
  { block: "distractor", ratio_target: "easy", ratio_distractor: "hard", distractor: PRMS.target[0], target: PRMS.target[0], compatibility: "comp",   correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[0])] },
  { block: "distractor", ratio_target: "easy", ratio_distractor: "hard", distractor: PRMS.target[0], target: PRMS.target[1], compatibility: "incomp", correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[1])] },
  { block: "distractor", ratio_target: "easy", ratio_distractor: "hard", distractor: PRMS.target[1], target: PRMS.target[0], compatibility: "incomp", correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[0])] },
  { block: "distractor", ratio_target: "easy", ratio_distractor: "hard", distractor: PRMS.target[1], target: PRMS.target[1], compatibility: "comp",   correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[1])] },
  { block: "distractor", ratio_target: "hard", ratio_distractor: "hard", distractor: PRMS.target[0], target: PRMS.target[0], compatibility: 'comp',   correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[0])] },
  { block: "distractor", ratio_target: "hard", ratio_distractor: "hard", distractor: PRMS.target[0], target: PRMS.target[1], compatibility: 'incomp', correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[1])] },
  { block: "distractor", ratio_target: "hard", ratio_distractor: "hard", distractor: PRMS.target[1], target: PRMS.target[0], compatibility: 'incomp', correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[0])] },
  { block: "distractor", ratio_target: "hard", ratio_distractor: "hard", distractor: PRMS.target[1], target: PRMS.target[1], compatibility: 'comp',   correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[1])] },
];

// prettier-ignore
const TRIAL_TIMELINE_TARGET = {
    timeline: [FIXATION_CROSS, FLANKER, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIAL_TABLE_TARGET
};

// prettier-ignore
const TRIAL_TIMELINE_DISTRACTOR = {
    timeline: [FIXATION_CROSS, FLANKER, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIAL_TABLE_DISTRACTOR
};

////////////////////////////////////////////////////////////////////////
//                             VP Stunden                             //
////////////////////////////////////////////////////////////////////////
const END_SCREEN = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
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
};

////////////////////////////////////////////////////////////////////////
//                              Save                                  //
////////////////////////////////////////////////////////////////////////
const DIR_NAME = getDirName();
const EXP_NAME = getFileName();
const VP_NUM = getTime();

function save() {
    jsPsych.data.addProperties({ vpNum: VP_NUM });

    const data_fn = `${DIR_NAME}data/${EXP_NAME}_${VP_NUM}`;
    saveData("/Common/write_data.php", data_fn, { stim_type: "fd" });
    // saveDataLocal(data_fn, { stim_type: 'fd' });
}

const SAVE_DATA = {
    type: jsPsychCallFunction,
    func: save,
    post_trial_gap: 1000,
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
    "use strict";

    let exp = [];

    exp.push(fullscreen(true));
    exp.push(browser_check(PRMS.screenRes));
    exp.push(resize_browser());
    exp.push(welcome_message());
    exp.push(vpInfoForm("/Common7+/vpInfoForm_de.html"));
    exp.push(mouseCursor(false));

    exp.push(WELCOME_INSTRUCTIONS);
    exp.push(COUNT_DOTS);
    exp.push(TASK_INSTRUCTIONS);

    let blk_type = repeatArray(shuffle(["target", "distractor"]), PRMS.nBlks / 2);

    for (let blk = 0; blk < PRMS.nBlks; blk += 1) {
        let blk_timeline;
        if (blk_type[blk] === "target") {
            blk_timeline = { ...TRIAL_TIMELINE_TARGET };
            blk_timeline.sample = {
                type: "fixed-repetitions",
                size: PRMS.nTrls / TRIAL_TABLE_TARGET.length,
            };
        } else if (blk_type[blk] === "distractor") {
            blk_timeline = { ...TRIAL_TIMELINE_DISTRACTOR };
            blk_timeline.sample = {
                type: "fixed-repetitions",
                size: PRMS.nTrls / TRIAL_TABLE_DISTRACTOR.length,
            };
        }
        exp.push(blk_timeline); // trials within a block
        exp.push(BLOCK_FEEDBACK); // show previous block performance
    }

    // save data
    exp.push(SAVE_DATA);

    // debrief
    exp.push(mouseCursor(true));
    exp.push(END_SCREEN);
    exp.push(end_message());
    exp.push(fullscreen(false));

    return exp;
}
const EXP = genExpSeq();

jsPsych.run(EXP);
