// Simon Task with emotional stimuli (flowers/spiders/neutral)

const jsPsych = initJsPsych({});

const CANVAS_COLOUR = "rgba(255, 255, 255, 1)";
const CANVAS_SIZE = [960, 720];
const CANVAS_BORDER = "5px solid black";

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const PRMS = {
    nBlks: 20,
    nTrlsP: 24, // number of trials in practice blocks
    nTrlsE: 64, // number of trials in exp blocks
    iti: 500,
    cTrl: 1, // count trials
    cBlk: 1, // count blocks
    fixWidth: 2,
    fixSize: 10,
    stimSize: "40px monospace",
    stimDur: [500, 250],
    trialDur: [2500, 1450],
    wait: 1000,
    simonPos: 200,
    nTooManyErrors: 10,
    tooManyErrorsDur: 30000,
    fbTxtSizeBlock: 20,
    respKeys: ["Q", "P"],
};

// 4 counter balanced versions?
// Version 1: negative_left/positive_right and face/nonface order
// Version 2: negative_left/positive_right and nonface/face order
// Version 3: positive_left/negative_right and face/nonface order
// Version 4: positive_left/negative_right and nonface/face order
const VERSION = Number(jsPsych.data.urlVariables().version);
jsPsych.data.addProperties({ version: VERSION });

if ([1, 2].includes(VERSION)) {
    PRMS.respEmotion = ["negative", "positive"];
} else if ([3, 4].includes(VERSION)) {
    PRMS.respEmotion = ["positive", "negative"];
}
if ([1, 3].includes(VERSION)) {
    PRMS.taskOrder = ["face", "nonface"];
} else if ([2, 4].includes(VERSION)) {
    PRMS.taskOrder = ["nonface", "face"];
}

////////////////////////////////////////////////////////////////////////
//                      Image Stimuli                                 //
////////////////////////////////////////////////////////////////////////
// random select one flower and one spider image
const FLOWER_IMAGE_NUMBER = shuffle([5, 6, 7])[0];
const SPIDER_IMAGE_NUMBER = shuffle([4, 5, 10])[0];

const IMAGES = [
    "./images/faces/happy.png",
    "./images/faces/sad.png",
    "./images/arrows/handL.png",
    "./images/arrows/handR.png",
    `./images/flowers/flower_${FLOWER_IMAGE_NUMBER}.png`,
    `./images/spiders/spider_${SPIDER_IMAGE_NUMBER}.png`,
];

const PRELOAD = {
    type: jsPsychPreload,
    auto_preload: true,
    images: IMAGES,
};
console.log(PRELOAD);

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////

const DE_EN_FACE = { negative: "TRAURIG", positive: "FRÖHLICH" };
const DE_EN_NONFACE = { negative: "SPINNE", positive: "BLUME" };

const KEYMAPPING_FACE =
    `<span style="font-weight:bold; font-size:30px";><b class="underline">LINKE Taste ("Q")</b>:</b>${"&nbsp;".repeat(
        30,
    )}
        <b class="underline">RECHTE Taste ("P"):</b><br>` +
    `Gesicht ist <b class="underline">${DE_EN_FACE[PRMS.respEmotion[0]]}</b> ${"&nbsp;".repeat(
        10,
    )} Gesicht ist <b class="underline">${DE_EN_FACE[PRMS.respEmotion[1]]}</b><br> 
        oder ${"&nbsp;".repeat(50)} oder <br> Finger zeigt nach <b class="underline">LINKS</b> ${"&nbsp;".repeat(
        10,
    )} Finger zeigt nach <b class="underline">RECHTS</b></span><br>`;

const KEYMAPPING_NONFACE =
    `<span style="font-weight:bold; font-size:30px";><b class="underline">LINKE Taste ("Q")</b>:</b>${"&nbsp;".repeat(
        30,
    )}
        <b class="underline">RECHTE Taste ("P"):</b><br>` +
    `Bild ist eine <b class="underline">${DE_EN_NONFACE[PRMS.respEmotion[0]]}</b> ${"&nbsp;".repeat(
        20,
    )} Bild ist eine <b class="underline">${DE_EN_NONFACE[PRMS.respEmotion[1]]}</b><br> 
        oder ${"&nbsp;".repeat(50)} oder <br> Finger zeigt nach <b class="underline">LINKS</b> ${"&nbsp;".repeat(
        10,
    )} Finger zeigt nach <b class="underline">RECHTS</b></span><br>`;

const PRESS_TO_CONTINUE = generate_formatted_html({
    text: `BEREIT?<br><br>Weiter mit der Leertaste!`,
    bold: true,
    fontsize: 26,
    align: "center",
});

function reminder() {
    return generate_formatted_html({
        text: `Beginn Block: ${PRMS.cBlk} von ${PRMS.nBlks}<br><br>Zur Erinnerung:`,
        bold: true,
        fontsize: 32,
        align: "center",
    });
}

const WELCOME = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `Herzlich willkommen zu dieser Studie und vielen Dank für deine Teilnahme!<br><br>
        Du hast im Laufe der Studie immer wieder die Gelegenheit, selbstständig Pausen zu machen.
        Die Aufgaben können alle mit der Computer-Tastatur bearbeitet werden, du benötigst nur die 
        Leertaste und die Tasten "${PRMS.respKeys[0]}" und "${PRMS.respKeys[1]}".<br><br>
        Weiter mit der Leertaste!`,
        bold: true,
        fontsize: 26,
        align: "left",
        lineheight: 1.5,
    }),
};

const TASK_INSTRUCTIONS_FACE1 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus:
        generate_formatted_html({
            text: `Das Experiment besteht aus zwei Teilen.<br>
                   In diesem Teil des Experimentes musst du auf folgende Bilder reagieren:<br><br>`,
            bold: true,
            fontsize: 26,
            align: "left",
            lineheight: 1.5,
        }) +
        `<div style="horizontal-align:middle;"><img src=${IMAGES[0]}> <img src=${IMAGES[1]}> <img src=${IMAGES[2]}> <img src=${IMAGES[3]}></div><br><br>` +
        PRESS_TO_CONTINUE,
};

const TASK_INSTRUCTIONS_FACE2 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus:
        generate_formatted_html({
            text: `In der Mitte des Bildschirms wird dir immer ein Fixationskreuz („+“) angezeigt.<br><br>
               In jedem Durchgang erscheint dann an einer zufälligen Position (rechts oder links neben diesem Fixationskreuz) entweder ein Gesicht oder eine Hand mit einem Finger, der nach rechts oder links zeigt.<br><br>
               Unabhängig von der Position der Hand oder des Gesichtes auf dem Bildschirm musst du dann in einem Durchgang wie folgt antworten:<br><br>`,
            bold: true,
            fontsize: 26,
            align: "left",
            lineheight: 1.5,
        }) +
        KEYMAPPING_FACE +
        PRESS_TO_CONTINUE,
};

const TASK_INSTRUCTIONS_FACE3 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    on_start: function (trial) {
        trial.stimulus =
            generate_formatted_html({
                text: `Versuche immer so schnell und so fehlerfrei wie möglich zu antworten!<br>
                       WICHTIG: Du erhälst Feedback (Reaktionszeit und Fehleranzahl) immer nur nach einem Block.<br>`,
                bold: true,
                fontsize: 26,
                align: "left",
                lineheight: 1.5,
            }) +
            reminder() +
            KEYMAPPING_FACE +
            PRESS_TO_CONTINUE;
    },
};

const TOO_MANY_ERRORS = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    response_ends_trial: false,
    trial_duration: PRMS.tooManyErrorsDur,
    stimulus: "",
    on_start: function (trial) {
        trial.stimulus =
            generate_formatted_html({
                text: `Zu viele Fehler (>= 10)!<br>`,
                bold: true,
                fontsize: 36,
                align: "center",
                lineheight: 1.5,
            }) +
            reminder() +
            KEYMAPPING_FACE +
            generate_formatted_html({
                text: `<br>Das Experiment wird automatisch in 30 Sekunden fortgesetzt!`,
                bold: true,
                fontsize: 26,
                align: "center",
                lineheight: 1.5,
            });
    },
};

const REMINDER_FACE = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    on_start: function (trial) {
        trial.stimulus = reminder() + KEYMAPPING_FACE + PRESS_TO_CONTINUE;
    },
};

const TASK_INSTRUCTIONS_NONFACE1 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus:
        generate_formatted_html({
            text: `Das Experiment besteht aus zwei Teilen.<br>
                   In diesem Teil des Experimentes musst du auf folgende Bilder reagieren:<br>`,
            bold: true,
            fontsize: 26,
            align: "left",
            lineheight: 1.5,
        }) +
        `<div style="horizontal-align:middle;"><img src=${IMAGES[4]} width=150> <img src=${IMAGES[5]} width=150> <img src=${IMAGES[2]}> <img src=${IMAGES[3]}></div><br><br>` +
        PRESS_TO_CONTINUE,
};

const TASK_INSTRUCTIONS_NONFACE2 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus:
        generate_formatted_html({
            text: `In der Mitte des Bildschirms wird dir immer ein Fixationskreuz („+“) angezeigt.<br><br>
               In jedem Durchgang erscheint dann an einer zufälligen Position (rechts oder links neben diesem Fixationskreuz) entweder ein Bild oder eine Hand mit einem Finger, der nach rechts oder links zeigt.<br><br>
               Unabhängig von der Position der Hand oder des Bildes auf dem Bildschirm musst du dann in einem Durchgang wie folgt antworten:`,
            bold: true,
            fontsize: 26,
            align: "left",
            lineheight: 1.5,
        }) +
        KEYMAPPING_NONFACE +
        PRESS_TO_CONTINUE,
};

const TASK_INSTRUCTIONS_NONFACE3 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    on_start: function (trial) {
        trial.stimulus =
            generate_formatted_html({
                text: `Versuche immer so schnell und so fehlerfrei wie möglich zu antworten!<br>
                       WICHTIG: Du erhälst Feedback (Reaktionszeit und Fehleranzahl) immer nur nach einem Block.<br>`,
                bold: true,
                fontsize: 26,
                align: "left",
                lineheight: 1.5,
            }) +
            reminder() +
            KEYMAPPING_NONFACE +
            PRESS_TO_CONTINUE;
    },
};

const REMINDER_NONFACE = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    on_start: function (trial) {
        trial.stimulus = reminder() + KEYMAPPING_NONFACE + PRESS_TO_CONTINUE;
    },
};

const HALF_WAY = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `Jetzt beginnt der zweite Testteil.<br><br>
          *** ACHTUNG: NEUE INSTRUKTIONEN *** <br><br>
          BEREIT?<br>Weiter mit der Leertaste!<br>`,
        bold: true,
        fontsize: 40,
        align: "center",
        lineheight: 2,
    }),
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////
function draw_stimulus(args) {
    "use strict";
    // Fixation cross is constant
    let ctx = document.getElementById("canvas").getContext("2d");
    ctx.beginPath();
    ctx.lineWidth = PRMS.fixWidth;
    ctx.moveTo(-PRMS.fixSize, 0);
    ctx.lineTo(PRMS.fixSize, 0);
    ctx.moveTo(0, -PRMS.fixSize);
    ctx.lineTo(0, PRMS.fixSize);
    ctx.stroke();

    if (args.target !== "") {
        // draw lateral image
        let img = new Image();
        img.onload = function () {
            // console.log("Image loaded");
            let xoffset = args.position === "left" ? -PRMS.simonPos : PRMS.simonPos;
            ctx.drawImage(img, -img.width / 2 + xoffset, -img.height / 2);
        };
        img.src = args.target;
        // let xoffset = args.position === "left" ? -PRMS.simonPos : PRMS.simonPos;
        // ctx.drawImage(img, -img.width / 2 + xoffset, -img.height / 2);
    }
}

function code_trial() {
    "use strict";

    let dat = jsPsych.data.get().last(1).values()[0];

    if (dat.rt === null) {
        dat.rt = dat.trial_duration; // no response
    }

    let comp;
    if (
        (dat.position === "left" && dat.corrResp === PRMS.respKeys[0]) ||
        (dat.position === "right" && dat.corrResp === PRMS.respKeys[1])
    ) {
        comp = "comp";
    } else {
        comp = "incomp";
    }

    let correctKey;
    if (dat.response !== null) {
        correctKey = jsPsych.pluginAPI.compareKeys(dat.key_press, dat.corrResp);
    }

    let corrCode = 0;
    if (correctKey && dat.rt < dat.trial_duration) {
        corrCode = 1; // correct
    } else if (!correctKey && dat.rt < dat.trial_duration) {
        corrCode = 2; // choice error
    } else if (dat.rt >= dat.trial_duration) {
        corrCode = 3; // too slow
    }

    jsPsych.data.addDataToLastTrial({
        date: Date(),
        comp: comp,
        corrCode: corrCode,
        blockNum: PRMS.cBlk,
        trialNum: PRMS.cTrl,
    });
}

const STIMULUS = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    response_ends_trial: false,
    choices: PRMS.respKeys,
    clear_screen: [1, 1],
    stimulus_onset: null,
    trial_duration: null,
    func: [draw_stimulus, draw_stimulus],
    func_args: [
        {
            target: jsPsych.timelineVariable("target"),
            position: jsPsych.timelineVariable("position"),
        },
        { target: "", position: "" },
    ],
    data: {
        stim: "simon_emotion",
        block_type: jsPsych.timelineVariable("block_type"),
        pic_type: jsPsych.timelineVariable("pic_type"),
        target: jsPsych.timelineVariable("target"),
        valance: jsPsych.timelineVariable("valance"),
        position: jsPsych.timelineVariable("position"),
        corrResp: jsPsych.timelineVariable("corrResp"),
    },
    on_start: function (trial) {
        // different trial/stimulus durations within practice blocks
        if (PRMS.cBlk === 1 || PRMS.cBlk === PRMS.nBlks / 2 + 1) {
            trial.trial_duration = PRMS.trialDur[0];
            trial.data["trial_duration"] = PRMS.trialDur[0];
            trial.stimulus_onset = [0, PRMS.stimDur[0]];
        } else {
            trial.trial_duration = PRMS.trialDur[1];
            trial.data["trial_duration"] = PRMS.trialDur[1];
            trial.stimulus_onset = [0, PRMS.stimDur[1]];
        }
    },
    on_finish: function () {
        code_trial();
        PRMS.cTrl += 1;
    },
};

function calculateBlockPerformance({
    filter_options = {},
    rtColumn = "rt",
    corrColumn = "corrCode",
    corrValue = 1,
} = {}) {
    let dat = jsPsych.data.get().filter(filter_options);
    let nError = dat.select(corrColumn).values.filter(function (x) {
        return x !== corrValue;
    }).length;
    let meanRt = Math.round(dat.select(rtColumn).mean());

    return { meanRt: meanRt, nError: nError };
}

function blockFeedbackText(cBlk, nBlks, meanRt, nError) {
    return (
        "<h2>Ende Block: " +
        cBlk +
        " von " +
        nBlks +
        "</h2><br>" +
        "<h2>Mittlere Reaktionszeit: " +
        meanRt +
        " ms </h2>" +
        "<h2>Anzahl der Fehler: " +
        nError +
        "</h2><br>" +
        "<h2>Drücke eine beliebige Taste, um fortzufahren!</h2>"
    );
}

const BLOCK_FEEDBACK = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    response_ends_trial: true,
    post_trial_gap: PRMS.waitDur,
    on_start: function (trial) {
        let block_dvs = calculateBlockPerformance({ filter_options: { stim: "simon_emotion", blockNum: PRMS.cBlk } });
        let text = blockFeedbackText(PRMS.cBlk, PRMS.nBlks, block_dvs.meanRt, block_dvs.nError);
        trial.stimulus = `<div style="font-size:${PRMS.fbTxtSizeBlock}px;">${text}</div>`;
    },
    on_finish: function () {
        PRMS.cTrl = 1;
        PRMS.cBlk += 1;
    },
};

const IF_TOO_MANY_ERRORS = {
    timeline: [TOO_MANY_ERRORS],
    conditional_function: function () {
        let block_dvs = calculateBlockPerformance({
            filter_options: { stim: "simon_emotion", blockNum: PRMS.cBlk - 1 },
        });
        return block_dvs.nError >= PRMS.nTooManyErrors;
    },
};

const WAIT_BLANK = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    func: function () {},
    trial_duration: PRMS.wait,
    response_ends_trial: false,
};

// prettier-ignore
const TRIAL_TABLE_FACE_BLOCK = [
    { block_type: "face", pic_type: "face_happy", target: IMAGES[0], valance: "positive",          position: "left",  corrResp: PRMS.respKeys[PRMS.respEmotion.indexOf("positive")] },
    { block_type: "face", pic_type: "face_happy", target: IMAGES[0], valance: "positive",          position: "right", corrResp: PRMS.respKeys[PRMS.respEmotion.indexOf("positive")] },
    { block_type: "face", pic_type: "face_sad",   target: IMAGES[1], valance: "negative",          position: "left",  corrResp: PRMS.respKeys[PRMS.respEmotion.indexOf("negative")] },
    { block_type: "face", pic_type: "face_sad",   target: IMAGES[1], valance: "negative",          position: "right", corrResp: PRMS.respKeys[PRMS.respEmotion.indexOf("negative")] },
    { block_type: "face", pic_type: "hand_left",  target: IMAGES[2], valance: PRMS.respEmotion[0], position: "left",  corrResp: PRMS.respKeys[0] },
    { block_type: "face", pic_type: "hand_left",  target: IMAGES[2], valance: PRMS.respEmotion[0], position: "right", corrResp: PRMS.respKeys[0] },
    { block_type: "face", pic_type: "hand_right", target: IMAGES[3], valance: PRMS.respEmotion[1], position: "left",  corrResp: PRMS.respKeys[1] },
    { block_type: "face", pic_type: "hand_right", target: IMAGES[3], valance: PRMS.respEmotion[1], position: "right", corrResp: PRMS.respKeys[1] },
];
// console.table(TRIAL_TABLE_FACE_BLOCK);

// prettier-ignore
const TRIAL_TABLE_NONFACE_BLOCK = [
    { block_type: "nonface", pic_type: "flower",     target: IMAGES[4], valance: "positive",          position: "left",  corrResp: PRMS.respKeys[PRMS.respEmotion.indexOf("positive")] },
    { block_type: "nonface", pic_type: "flower",     target: IMAGES[4], valance: "positive",          position: "right", corrResp: PRMS.respKeys[PRMS.respEmotion.indexOf("positive")] },
    { block_type: "nonface", pic_type: "spider",     target: IMAGES[5], valance: "negative",          position: "left",  corrResp: PRMS.respKeys[PRMS.respEmotion.indexOf("negative")] },
    { block_type: "nonface", pic_type: "spider",     target: IMAGES[5], valance: "negative",          position: "right", corrResp: PRMS.respKeys[PRMS.respEmotion.indexOf("negative")] },
    { block_type: "nonface", pic_type: "hand_left",  target: IMAGES[2], valance: PRMS.respEmotion[0], position: "left",  corrResp: PRMS.respKeys[0] },
    { block_type: "nonface", pic_type: "hand_left",  target: IMAGES[2], valance: PRMS.respEmotion[0], position: "right", corrResp: PRMS.respKeys[0] },
    { block_type: "nonface", pic_type: "hand_right", target: IMAGES[3], valance: PRMS.respEmotion[1], position: "left",  corrResp: PRMS.respKeys[1] },
    { block_type: "nonface", pic_type: "hand_right", target: IMAGES[3], valance: PRMS.respEmotion[1], position: "right", corrResp: PRMS.respKeys[1] },
];
// console.table(TRIAL_TABLE_NONFACE_BLOCK);

const TRIAL_TIMELINE_FACE_BLOCK = {
    timeline: [STIMULUS],
    timeline_variables: TRIAL_TABLE_FACE_BLOCK,
};

const TRIAL_TIMELINE_NONFACE_BLOCK = {
    timeline: [STIMULUS],
    timeline_variables: TRIAL_TABLE_NONFACE_BLOCK,
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
    saveData("/Common/write_data.php", data_fn, { stim: "simon_emotion" });
    // saveDataLocal('/Common/write_data.php', { stim: 'simon_emotion' });
}

const SAVE_DATA = {
    type: jsPsychCallFunction,
    func: save,
    post_trial_gap: 3000,
};

////////////////////////////////////////////////////////////////////////
//                              PROLIFIC                              //
////////////////////////////////////////////////////////////////////////
const PROLIFIC = {
    type: jsPsychHtmlKeyboardResponse,
    response_ends_trial: true,
    choices: [" "],
    stimulus: generate_formatted_html({
        text: `Super, du bist am Ende des Experiments!
               Vielen Dank für deine Teilnahme :)<br><br>
               Über folgenden Link geht es zurück zu Prolific:<br><br>
               https://app.prolific.co/submissions/complete?cc=CM9XC6KL<br><br>
               Drücke die Leertaste, um das Experiment abzuschließen!`,
        align: "left",
        fontsize: 30,
        width: "1200px",
        lineheight: 1.5,
    }),
    on_finish: function () {
        window.location.replace("https://app.prolific.co/submissions/complete?cc=CM9XC6KL");
    },
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
    exp.push(vpInfoForm("/Common7+/vpInfoForm_de.html"));
    exp.push(mouseCursor(false));
    exp.push(PRELOAD);
    exp.push(WELCOME);

    let blk_type = repeatArray(PRMS.taskOrder[0], PRMS.nBlks / 2).concat(
        repeatArray(PRMS.taskOrder[1], PRMS.nBlks / 2),
    );

    for (let blk = 0; blk < PRMS.nBlks; blk += 1) {
        // Is task changing?
        if (blk === PRMS.nBlks / 2) {
            exp.push(HALF_WAY);
        }
        // Main task instructions
        if ([0, PRMS.nBlks / 2].includes(blk) && blk_type[blk] === "face") {
            exp.push(TASK_INSTRUCTIONS_FACE1);
            exp.push(TASK_INSTRUCTIONS_FACE2);
            exp.push(TASK_INSTRUCTIONS_FACE3);
        } else if ([0, PRMS.nBlks / 2].includes(blk) && blk_type[blk] === "nonface") {
            exp.push(TASK_INSTRUCTIONS_NONFACE1);
            exp.push(TASK_INSTRUCTIONS_NONFACE2);
            exp.push(TASK_INSTRUCTIONS_NONFACE3);
        }
        // Simple reminder at start of block
        if (blk_type[blk] === "face") {
            exp.push(REMINDER_FACE);
        } else if (blk_type[blk] === "nonface") {
            exp.push(REMINDER_NONFACE);
        }
        exp.push(WAIT_BLANK);

        let blk_timeline;
        if (blk_type[blk] === "face") {
            blk_timeline = { ...TRIAL_TIMELINE_FACE_BLOCK };
        } else if (blk_type[blk] === "nonface") {
            blk_timeline = { ...TRIAL_TIMELINE_NONFACE_BLOCK };
        }

        blk_timeline.sample = {
            type: "fixed-repetitions",
            size: [0, 1, PRMS.nBlks / 2, PRMS.nBlks / 2 + 1].includes(blk) ? PRMS.nTrlsP / 8 : PRMS.nTrlsE / 8,
        };
        exp.push(blk_timeline); // trials within a block
        exp.push(BLOCK_FEEDBACK); // show previous block performance
        exp.push(IF_TOO_MANY_ERRORS);
    }

    // save data
    exp.push(SAVE_DATA);

    // debrief
    exp.push(mouseCursor(true));
    exp.push(end_message());
    exp.push(fullscreen(false));
    exp.push(PROLIFIC);

    return exp;
}
const EXP = genExpSeq();

jsPsych.run(EXP);
