// Pictorial Stroop Task with emotions:
// VPs respond to the emotion (happy vs. fear) of a face with task-irrelevant text written on top.

const jsPsych = initJsPsych({
    on_finish: function () {
        if (PRMS.cBlk >= 26) {
            window.location.assign(
                "https://uni-tuebingen.sona-systems.com/webstudy_credit.aspx?experiment_id=303&credit_token=a90afc63fd324e7da16a2693de91b961&survey_code=" +
                    jsPsych.data.urlVariables().sona_id,
            );
        }
    },
});

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const CANVAS_COLOUR = "rgba(255, 255, 255, 1)";
const CANVAS_SIZE = [1280, 720];
const CANVAS_BORDER = "5px solid black";

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const PRMS = {
    screenRes: [960, 720],
    nBlks: 26, // number of blocks
    fixDur: 400, // duration of fixation cross
    fixSize: 15, // duration of the fixation cross
    fixWidth: 5, // size of fixation cross
    fixColor: "Black", // colour of the fixation cross
    fbDur: [0, 2250, 2250, 2250], // duration of feedback for each type
    waitDur: 1000, // duration following ...
    iti: 500, // duration of inter-trial-interval
    tooFast: 250, // responses faster than x ms -> too fast!
    tooSlow: 2750, // response slower than x ms -> too slow!
    respKeys: ["Q", "P"],
    target_emotion: shuffle(["Angst", "Freude"]),
    target_position: [0, -20],
    frame_size: [275, 390],
    frame_position: [0, -20],
    distractor_text_emotion: ["ANGST", "FREUDE"],
    distractor_text_location: ["LINKS", "RECHTS"],
    distractor_text_font: "bold 55px monospace",
    distractor_text_position: [0, 15],
    distractor_text_colour: "Blue",
    feedback_text: ["", "Falsch!", "Zu langsam!", "Zu schnell!!"],
    feedback_text_font: "30px monospace",
    feedback_text_colour: "Black",
    feedback_text_position: [0, 0],
    fbTxtSizeBlock: 30,
    cTrl: 1, // count trials
    cBlk: 1, // count blocks
};

// 2 counter balanced versions
const VERSION = Number(jsPsych.data.urlVariables().version);
jsPsych.data.addProperties({ version: VERSION });

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const TASK_INSTRUCTIONS1 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `Willkommen zu unserem Experiment:<br><br>
           Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.
           Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und genügend Zeit hast,
           um das Experiment durchzuführen. Wir bitten dich die ca. nächsten 40 Minuten konzentriert zu arbeiten.<br><br>
           Drücke eine beliebige Taste, um fortzufahren`,
        align: "left",
        colour: "black",
        lineheight: 1.5,
        fontsize: 30,
    }),
};

const TASK_INSTRUCTIONS2_EMOTION = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `In diesem Teil des Experimentes siehst du ein Wort und Gesichter mit den Emotionen Angst oder Freude.
Bitte entscheide in jedem Durchgang so schnell und so genau wie möglich, ob das Gesicht den Ausdruck "Angst" oder "Freude" zeigt und ignoriere das Wort: <br><br>
"Q" = ${PRMS.target_emotion[0]} Gesicht &emsp; "P" = ${PRMS.target_emotion[1]} Gesicht<br><br>
Wenn kein Gesicht erscheint, dann reagiere auf das Wort: <br><br>
"Q" = ${PRMS.target_emotion[0]} Wort &emsp; "P" = ${PRMS.target_emotion[1]} Wort<br><br>
WICHTIG! Benutze hierfür die Q-Taste mit deinem linken Zeigefinger und die P-Taste mit deinem rechten Zeigefinger.<br><br>
Bitte antworte so schnell und so korrekt wie möglich!<br><br>
Drücke eine beliebige Taste, um fortzufahren.`,
        align: "left",
        colour: "black",
        fontsize: 30,
        lineheight: 1.25,
    }),
};

const TASK_INSTRUCTIONS2_LOCATION = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `In diesem Teil des Experimentes siehst du ein Wort und Gesichter mit den Emotionen Angst oder Freude.
Bitte entscheide in jedem Durchgang so schnell und so genau wie möglich, ob das Gesicht den Ausdruck "Angst" oder "Freude" zeigt und ignoriere das Wort: <br><br>
"Q" = ${PRMS.target_emotion[0]} Gesicht &emsp; "P" = ${PRMS.target_emotion[1]} Gesicht<br><br>
Wenn kein Gesicht erscheint, dann reagiere auf das Wort: <br><br>
"Q" = LINKS Wort &emsp; "P" = RECHTS Wort<br><br>
WICHTIG! Benutze hierfür die Q-Taste mit deinem linken Zeigefinger und die P-Taste mit deinem rechten Zeigefinger.<br><br>
Bitte antworte so schnell und so korrekt wie möglich!<br><br>
Drücke eine beliebige Taste, um fortzufahren.`,
        align: "left",
        colour: "black",
        fontsize: 30,
        lineheight: 1.25,
    }),
};

const BLOCK_START_EMOTION = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    on_start: function (trial) {
        trial.stimulus = generate_formatted_html({
            text: `Block ${PRMS.cBlk} von ${PRMS.nBlks}<br><br>
Reagiere auf die Emotion des Gesichtes wie folgt:<br><br>
"Q" = ${PRMS.target_emotion[0]} Gesicht &emsp; "P" = ${PRMS.target_emotion[1]} Gesicht<br><br>
Wenn kein Gesicht erscheint, reagiere auf das Wort wie folgt:<br><br>
"Q" = ${PRMS.target_emotion[0]} Wort &emsp; "P" = ${PRMS.target_emotion[1]} Wort<br><br>
Drücke eine beliebige Taste, um fortzufahren.`,
            align: "left",
            colour: "black",
            fontsize: 30,
        });
    },
};

const BLOCK_START_LOCATION = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    on_start: function (trial) {
        trial.stimulus = generate_formatted_html({
            text: `Block ${PRMS.cBlk} von ${PRMS.nBlks}<br><br>
Reagiere auf die Emotion des Gesichtes wie folgt:<br><br>
"Q" = ${PRMS.target_emotion[0]} Gesicht &emsp; "P" = ${PRMS.target_emotion[1]} Gesicht<br><br>
Wenn kein Gesicht erscheint, reagiere auf das Wort wie folgt:<br><br>
"Q" = LINKS Wort &emsp; "P" = RECHTS Wort<br><br>
Drücke eine beliebige Taste, um fortzufahren.`,
            align: "left",
            colour: "black",
            fontsize: 30,
        });
    },
};

// pre-load images
const PRELOAD = {
    type: jsPsychPreload,
    images: [FEAR_IMAGES, HAPPY_IMAGES], //NEWIAN: changed
};

////////////////////////////////////////////////////////////////////////
//                              Exp Parts                             //
////////////////////////////////////////////////////////////////////////

function draw_fixation_cross() {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");
    ctx.lineWidth = PRMS.fixWidth;
    ctx.strokeStyle = PRMS.fixColor;
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
    func: draw_fixation_cross,
};

function code_trial() {
    "use strict";
    let dat = jsPsych.data.get().last(1).values()[0];
    dat.rt = dat.rt !== null ? dat.rt : PRMS.tooSlow;

    let corrCode = 0;
    let correctKey = jsPsych.pluginAPI.compareKeys(dat.key_press, dat.corrResp);
    console.log(dat);

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

function draw_stimulus(args) {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");

    // image
    if (args.target !== "na") {
        const img = new Image();
        img.src = args.target;
        ctx.drawImage(img, PRMS["target_position"][0] - img.width / 2, PRMS["target_position"][1] - img.height / 2);
    }

    // draw frame around image
    if (args.draw_frame) {
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "Black";
        ctx.rect(
            -(PRMS["frame_size"][0] / 2) + PRMS["frame_position"][0],
            -PRMS["frame_size"][1] / 2 + PRMS["frame_position"][1],
            PRMS["frame_size"][0],
            PRMS["frame_size"][1],
        );
        ctx.stroke();
    }

    // text
    ctx.font = PRMS["distractor_text_font"];
    ctx.textAlign = "center";
    ctx.fillStyle = PRMS["distractor_text_colour"];
    ctx.fillText(args.distractor, PRMS["distractor_text_position"][0], PRMS["distractor_text_position"][1]);
}

// prettier-ignore
const STROOP_STIMULUS = {
  type: jsPsychStaticCanvasKeyboardResponse,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  translate_origin: true,
  stimulus_onset: [0, 250],
  clear_screen: [1, 1],
  response_ends_trial: true,
  choices: PRMS.respKeys,
  trial_duration: PRMS.tooSlow,
  func: [draw_stimulus, draw_stimulus],
  func_args: null,
  data: {
    stim: 'stroop',
    trial_type: jsPsych.timelineVariable('trial_type'),
    target: jsPsych.timelineVariable('target'),
    distractor: jsPsych.timelineVariable('distractor'),
    compatibility: jsPsych.timelineVariable('comp'),
    corrResp: jsPsych.timelineVariable('key'),
  },
  on_start: function(trial) {
    trial.func_args = [{ target: "na",              distractor: trial.data.distractor, draw_frame: false }, 
                       { target: trial.data.target, distractor: trial.data.distractor, draw_frame: true }];
  },
  on_finish: function() {
    code_trial();
    PRMS.cTrl += 1;
  },
};

function draw_feedback(args) {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");
    ctx.textAlign = "center";
    ctx.font = PRMS["feedback_text_font"];
    ctx.fillStyle = PRMS["feedback_text_colour"];
    ctx.fillText(args.feedback, PRMS["feedback_text_position"][0], PRMS["feedback_text_position"][1]);
}

const TRIAL_FEEDBACK = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    response_ends_trial: false,
    trial_duration: PRMS.tooSlow,
    func: draw_feedback,
    func_args: null,
    stimulus: "",
    response_ends_trial: false,
    trial_duration: null,
    on_start: function (trial) {
        let dat = jsPsych.data.get().last(1).values()[0];
        trial.trial_duration = PRMS.fbDur[dat.corrCode - 1];
        trial.func_args = [{ feedback: PRMS.feedback_text[dat.corrCode - 1] }];
    },
};

const BLOCK_FEEDBACK = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    response_ends_trial: true,
    post_trial_gap: PRMS.waitDur,
    on_start: function (trial) {
        let block_dvs = calculateBlockPerformance({ filter_options: { stim: "stroop", blockNum: PRMS.cBlk } });
        let text = blockFeedbackText(PRMS.cBlk, PRMS.nBlks, block_dvs.meanRt, block_dvs.errorRate, (language = "de"));
        trial.stimulus = `<div style="font-size:${PRMS.fbTxtSizeBlock}px;">${text}</div>`;
    },
    on_finish: function () {
        PRMS.cTrl = 1;
        PRMS.cBlk += 1;
    },
};

function generate_trials_within_block(fear_set, happy_set, block_type) {
    let stroop_type = shuffle(
        repeatArray(["fear_comp", "fear_incomp", "happy_comp", "happy_incomp"], fear_set.length / 4),
    );
    let image_numbers = shuffle([...Array(32).keys()]);
    let trials = [];

    for (let i = 0; i < stroop_type.length; i++) {
        let tmp = {};
        if (stroop_type[i] === "fear_comp") {
            tmp.trial_type = "target";
            tmp.target = fear_set[image_numbers[i]];
            tmp.target_type = "fear";
            tmp.key = PRMS.respKeys[PRMS.target_emotion.indexOf("Angst")];
            tmp.comp = "comp";
            if (block_type === "emotion") {
                tmp.distractor = PRMS.distractor_text_emotion[0];
            } else if (block_type === "location") {
                tmp.distractor =
                    tmp.key === PRMS.respKeys[0] ? PRMS.distractor_text_location[0] : PRMS.distractor_text_location[1];
            }
        } else if (stroop_type[i] === "fear_incomp") {
            tmp.trial_type = "target";
            tmp.target = fear_set[image_numbers[i]];
            tmp.target_type = "fear";
            tmp.key = PRMS.respKeys[PRMS.target_emotion.indexOf("Angst")];
            tmp.comp = "incomp";
            if (block_type === "emotion") {
                tmp.distractor = PRMS.distractor_text_emotion[1];
            } else if (block_type === "location") {
                tmp.distractor =
                    tmp.key === PRMS.respKeys[0] ? PRMS.distractor_text_location[1] : PRMS.distractor_text_location[0];
            }
        } else if (stroop_type[i] === "happy_comp") {
            tmp.trial_type = "target";
            tmp.target = happy_set[image_numbers[i]];
            tmp.target_type = "happy";
            tmp.key = PRMS.respKeys[PRMS.target_emotion.indexOf("Freude")];
            tmp.comp = "comp";
            if (block_type === "emotion") {
                tmp.distractor = PRMS.distractor_text_emotion[1];
            } else if (block_type === "location") {
                tmp.distractor =
                    tmp.key === PRMS.respKeys[0] ? PRMS.distractor_text_location[0] : PRMS.distractor_text_location[1];
            }
        } else if (stroop_type[i] === "happy_incomp") {
            tmp.trial_type = "target";
            tmp.target = happy_set[image_numbers[i]];
            tmp.target_type = "happy";
            tmp.key = PRMS.respKeys[PRMS.target_emotion.indexOf("Freude")];
            tmp.comp = "incomp";
            if (block_type === "emotion") {
                tmp.distractor = PRMS.distractor_text_emotion[0];
            } else if (block_type === "location") {
                tmp.distractor =
                    tmp.key === PRMS.respKeys[0] ? PRMS.distractor_text_location[1] : PRMS.distractor_text_location[0];
            }
        }
        trials.push(tmp);
    }

    // add in 4 catch-type trials per block
    let tmp = {};
    if (block_type === "emotion") {
        tmp.trial_type = "distractor";
        tmp.target = "na";
        tmp.target_type = "na";
        tmp.key = PRMS.respKeys[PRMS.target_emotion.indexOf("Angst")];
        tmp.distractor = PRMS.distractor_text_emotion[0];
        trials.push(tmp);
        trials.push(tmp);
        tmp = {};
        tmp.trial_type = "distractor";
        tmp.target = "na";
        tmp.target_type = "na";
        tmp.key = PRMS.respKeys[PRMS.target_emotion.indexOf("Freude")];
        tmp.distractor = PRMS.distractor_text_emotion[1];
        trials.push(tmp);
        trials.push(tmp);
    } else if (block_type === "location") {
        tmp.trial_type = "distractor";
        tmp.target = "na";
        tmp.target_type = "na";
        tmp.key = PRMS.respKeys[0];
        tmp.distractor = PRMS.distractor_text_location[0];
        trials.push(tmp);
        trials.push(tmp);
        tmp = {};
        tmp.trial_type = "distractor";
        tmp.target = "na";
        tmp.target_type = "na";
        tmp.key = PRMS.respKeys[1];
        tmp.distractor = PRMS.distractor_text_location[1];
        trials.push(tmp);
        trials.push(tmp);
    }

    return trials;
}

const ITI = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    response_ends_trial: false,
    trial_duration: PRMS.iti,
};

const TRIAL_TIMELINE = {
    timeline: [FIXATION_CROSS, STROOP_STIMULUS, TRIAL_FEEDBACK, ITI],
};

////////////////////////////////////////////////////////////////////////
//                              Save                                  //
////////////////////////////////////////////////////////////////////////
const DIR_NAME = getDirName();
const EXP_NAME = getFileName();
const VP_NUM = getTime();

function save() {
    jsPsych.data.addProperties({ vpNum: VP_NUM });

    const data_fn = `${DIR_NAME}data/version${VERSION}/${EXP_NAME}_${VP_NUM}`;
    saveData("/Common7+/write_data.php", data_fn, { stim: "stroop" });
    // saveDataLocal(data_fn, { stim: 'stroop' });
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
    exp.push(PRELOAD);
    exp.push(resize_browser());
    exp.push(welcome_message());
    exp.push(vpInfoForm("/Common7+/vpInfoForm_de_copyright.html"));
    exp.push(mouseCursor(false));
    exp.push(TASK_INSTRUCTIONS1);

    let blk_type;
    if (VERSION === 1) {
        blk_type = repeatArray(["emotion"], PRMS.nBlks / 2).concat(repeatArray(["location"], PRMS.nBlks / 2));
    } else if (VERSION === 2) {
        blk_type = repeatArray(["location"], PRMS.nBlks / 2).concat(repeatArray(["emotion"], PRMS.nBlks / 2));
    }

    for (let blk = 0; blk < PRMS.nBlks; blk += 1) {
        if (blk_type[blk] === "emotion") {
            if (blk === 0) {
                exp.push(TASK_INSTRUCTIONS2_EMOTION);
            }
            exp.push(BLOCK_START_EMOTION);
        } else if (blk_type[blk] === "location") {
            if (blk === 0) {
                exp.push(TASK_INSTRUCTIONS2_LOCATION);
            }
            exp.push(BLOCK_START_LOCATION);
        }
        let blk_timeline = deepCopy(TRIAL_TIMELINE);
        blk_timeline.timeline_variables = generate_trials_within_block(FEAR_IMAGES, HAPPY_IMAGES, blk_type[blk]);
        blk_timeline.sample = { type: "fixed-repetitions", size: 1 };
        exp.push(blk_timeline); // trials within a block
        exp.push(BLOCK_FEEDBACK); // show previous block performance
    }

    exp.push(SAVE_DATA);

    // debrief
    exp.push(mouseCursor(true));
    exp.push(end_message());
    exp.push(fullscreen(false));

    return exp;
}
const EXP = genExpSeq();

jsPsych.run(EXP);
