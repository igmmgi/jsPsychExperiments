// Simon Task with manipulation of stimulus eccentricity
// Stimuli: Squares (red vs. blue)
// Two levels of eccentricity (manipulated blockwise)
// Task: blue vs. red?
//
// Trial Structure
// Cental fixation cross for 500 ms
// Lateral stimulus until response (or 2000 ms)
// If incorrect, feedback screen for 1500 ms
// inter-trial-interval of 500 ms
//
// Block structure
// 12 blocks of 56 trials
// Alternating blocks of near/far eccentricity (counterbalanced across participants)

const jsPsych = initJsPsych({});

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
    nTrls: 56, // number of trials per block
    nBlks: 12, // number of blocks
    fixSize: 15, // duration of the fixation cross
    fixWidth: 5, // size of fixation cross
    fixDur: 500, // duration of the fixation cross
    fbDur: [0, 1500, 1500, 1500], // feedback duration for response type (correct, incorrect, too slow, too fast)
    tooSlow: 2000, // response limit slow
    tooFast: 0, // response limit fast
    fbText: ["", "Falsch!", "Zu langsam!", "Zu schnell!"],
    iti: 500, // duration of the inter-trial-interval
    stimFont: "110px Arial",
    fbFont: "200px Arial",
    colours: ["rgba(0, 0, 255, 0.9)", "rgba(255, 0, 0, 0.9)"],
    respKeys: ["Q", "P"],
    target: shuffle(["blue", "red"]),
    eccentricity: [75, 350],
    size: 50,
    cBlk: 1,
    cTrl: 1,
};

const EN_DE = { blue: "blau", red: "rot" };

// 2 counter balanced versions (start with near vs. far)
const VERSION = Number(jsPsych.data.urlVariables().version);
jsPsych.data.addProperties({ version: VERSION });

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
               xxx@xxx<br><br>
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
        pad_me(EN_DE[PRMS.target[0]], 20) +
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
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    on_start: function (trial) {
        trial.stimulus =
            generate_formatted_html({
                text: `Mini-Block ${PRMS.cblk} von ${PRMS.nBlks}:<br><br>
               Du musst in jedem Durchgang entscheiden ob das Quadrat blau oder rot ist.
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
    ctx.lineWidth = PRMS.fixation_width;
    ctx.moveTo(-PRMS.fixation_size, 0);
    ctx.lineTo(PRMS.fixation_size, 0);
    ctx.stroke();
    ctx.moveTo(0, -PRMS.fixation_size);
    ctx.lineTo(0, PRMS.fixation_size);
    ctx.stroke();
}

const FIXATION_CROSS = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    response_ends_trial: false,
    trial_duration: PRMS.fixation_duration,
    func: drawFixation,
};

function drawStimulus(args) {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");

    // draw fixation with stimulus
    ctx.lineWidth = PRMS.fixation_width;
    ctx.moveTo(-PRMS.fixation_size, 0);
    ctx.lineTo(PRMS.fixation_size, 0);
    ctx.stroke();
    ctx.moveTo(0, -PRMS.fixation_size);
    ctx.lineTo(0, PRMS.fixation_size);
    ctx.stroke();

    // draw colour square
    ctx.fillStyle = args.colour;
    ctx.fillRect(args.position_x - PRMS.size / 2, -PRMS.size / 2, PRMS.size, PRMS.size);
}

const SIMON = {
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
        stim_type: "sar",
        eccentricity: jsPsych.timelineVariable("eccentricity"),
        position: jsPsych.timelineVariable("position"),
        position_x: jsPsych.timelineVariable("position_x"),
        target: jsPsych.timelineVariable("target"),
        compatibility: jsPsych.timelineVariable("compatibility"),
        correct_key: jsPsych.timelineVariable("correct_key"),
    },
    on_start: function (trial) {
        "use strict";
        trial.func_args = [{ position_x: trial.data.position_x, colour: trial.data.target }];
    },
    on_finish: function () {
        codeTrial();
        PRMS.ctrl += 1;
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
        blockNum: PRMS.cblk,
        trialNum: PRMS.ctrl,
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
            filter_options: { stim_type: "sar", blockNum: PRMS.cblk },
        });
        let text = blockFeedbackText(PRMS.cblk, PRMS.nBlks, block_dvs.meanRt, block_dvs.errorRate, (language = "de"));
        trial.stimulus = `<div style="font-size:${PRMS.fbTxtSizeBlock}px;">${text}</div>`;
    },
    on_finish: function () {
        PRMS.ctrl = 1;
        PRMS.cblk += 1;
    },
};

// prettier-ignore
const TRIAL_TABLE_NEAR = [
  { eccentricity: "near", position: "left",  position_x: -PRMS.eccentricity[0], target: PRMS.target[0], compatibility: "comp",   correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[0])] },
  { eccentricity: "near", position: "left",  position_x: -PRMS.eccentricity[0], target: PRMS.target[1], compatibility: "incomp", correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[1])] },
  { eccentricity: "near", position: "right", position_x: PRMS.eccentricity[0],  target: PRMS.target[0], compatibility: "incomp", correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[0])] },
  { eccentricity: "near", position: "right", position_x: PRMS.eccentricity[0],  target: PRMS.target[1], compatibility: "comp",   correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[1])] },
];

// prettier-ignore
const TRIAL_TABLE_FAR = [
  { eccentricity: 'far', position: 'left',  position_x: -PRMS.eccentricity[1], target: PRMS.target[0], compatibility: 'comp',   correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[0])] },
  { eccentricity: 'far', position: 'left',  position_x: -PRMS.eccentricity[1], target: PRMS.target[1], compatibility: 'incomp', correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[1])] },
  { eccentricity: 'far', position: 'right', position_x: PRMS.eccentricity[1],  target: PRMS.target[0], compatibility: 'incomp', correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[0])] },
  { eccentricity: 'far', position: 'right', position_x: PRMS.eccentricity[1],  target: PRMS.target[1], compatibility: 'comp',   correct_key: PRMS.respKeys[PRMS.target.indexOf(PRMS.target[1])] },
];

// prettier-ignore
const TRIAL_TIMELINE_NEAR = {
  timeline: [FIXATION_CROSS, SIMON, TRIAL_FEEDBACK, ITI],
  timeline_variables: TRIAL_TABLE_NEAR
};

// prettier-ignore
const TRIAL_TIMELINE_FAR = {
  timeline: [FIXATION_CROSS, SIMON, TRIAL_FEEDBACK, ITI],
  timeline_variables: TRIAL_TABLE_FAR
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

function save() {
    const vpNum = getTime();
    jsPsych.data.addProperties({ vpNum: vpNum });

    const data_fn = `${DIR_NAME}data/version${VERSION}/${EXP_NAME}_${vpNum}`;
    saveData("/Common/write_data.php", data_fn, { stim_type: "sar" });
    // saveDataLocal(data_fn, { stim_type: 'sar' });
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
    exp.push(TASK_INSTRUCTIONS);

    let blk_type;
    if (VERSION === 1) {
        blk_type = repeatArray(["near", "far"], PRMS.nBlks / 2);
    } else if (VERSION === 2) {
        blk_type = repeatArray(["far", "near"], PRMS.nBlks / 2);
    }

    for (let blk = 0; blk < PRMS.nBlks; blk += 1) {
        let blk_timeline;
        if (blk_type[blk] === "near") {
            blk_timeline = { ...TRIAL_TIMELINE_NEAR };
        } else if (blk_type[blk] === "far") {
            blk_timeline = { ...TRIAL_TIMELINE_FAR };
        }
        blk_timeline.sample = {
            type: "fixed-repetitions",
            size: PRMS.nTrls / TRIAL_TABLE_NEAR.length,
        };
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
