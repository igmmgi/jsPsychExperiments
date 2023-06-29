// Voluntary Task Switching paradigm with two tasks
// Task 1: Surrounding colour grid (task: more red vs. more blue?)
// Task 2: Central letter (task: normal vs. mirrored?)
// Two levels of difficulty within each task
// Colour task difficulty manipulation: ratio (e.g., 90/10 vs. 60/40)
// Letter task difficulty manipulation: degree of rotation
//
// Block structure:
// 50% of trials are free choice with both task stimuli presented
// 50% of trials are forced choice (single stimulus) with 50% colour, 50% letter
// Of the 50% forced task choices, 50% should be easy, 50% hard
//
// Trial structure:
// Fixation cross
// Stimulus (until response or ?)
// Feedback
// ITI

const jsPsych = initJsPsych({
    on_finish: function () {
        window.location.assign(
            "https://uni-tuebingen.sona-systems.com/webstudy_credit.aspx?experiment_id=233&credit_token=11d96321e1494b7d8605d5b7b3ffba8c&survey_code=" +
                jsPsych.data.urlVariables().sona_id,
        );
    },
});

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
    nTrls: 104, // number of trials per block
    nBlks: 8, // number of blocks
    fixSize: 15, // duration of the fixation cross
    fixWidth: 5, // size of fixation cross
    fixDur: 500, // duration of the fixation cross
    fbDur: [0, 3000], // feedback duration for correct and incorrect trials, respectively
    fbText: ["", "Falsch!"],
    iti: 750, // duration of the inter-trial-interval
    stimFont: "110px Arial",
    fbFont: "200px Arial",
    letters: ["F", "G", "L", "P", "R"],
    colourTask: shuffle(["mehr Blau", "mehr Rot"]),
    letterTask: shuffle(["Normal", "Gespiegelt"]),
    anglesEasy: [-5, 5],
    anglesNormal: [-15, 15],
    anglesHard: [-95, 95],
    colours: ["rgba(0, 0, 255, 0.9)", "rgba(255, 0, 0, 0.9)"],
    ratioEasy: 90,
    ratioNormal: 72.5,
    ratioHard: 62.5,
    respKeysLH: ["Q", "W"],
    respKeysRH: ["O", "P"],
    deactivateKeys: false, // should keys be deactivated when task not available?
    dotRadius: 1.5,
    dotEccentricity: 115,
    dotGaps: 4,
    dotBlank: 15,
    cBlk: 1,
    cTrl: 1,
};

// 4 counter balanced versions
const VERSION = Number(jsPsych.data.urlVariables().version);
jsPsych.data.addProperties({ version: VERSION });

// Version 1: Colour task = left hand,  Letter task = right hand
// Version 2: Colour task = right hand, Letter task = left hand
if ([1, 3].includes(VERSION)) {
    PRMS.colourTaskKeys = PRMS.respKeysLH; // e.g., more red vs. more blue
    PRMS.letterTaskKeys = PRMS.respKeysRH; // e.g., normal vs. mirrored
} else if ([2, 4].includes(VERSION)) {
    PRMS.colourTaskKeys = PRMS.respKeysRH; // e.g., more red vs. more blue
    PRMS.letterTaskKeys = PRMS.respKeysLH; // e.g., normal vs. mirrored
}

function calculateNumberOfDots() {
    // Required for ratio manipulation in VTS
    PRMS.nDots = 0;
    for (let rows = -PRMS.dotEccentricity; rows <= PRMS.dotEccentricity; rows += PRMS.dotGaps) {
        for (let cols = -PRMS.dotEccentricity; cols <= PRMS.dotEccentricity; cols += PRMS.dotGaps) {
            if (
                (rows > -PRMS.dotGaps * PRMS.dotBlank) &
                (rows < PRMS.dotGaps * PRMS.dotBlank) &
                (cols > -PRMS.dotGaps * PRMS.dotBlank) &
                (cols < PRMS.dotGaps * PRMS.dotBlank)
            ) {
                continue;
            }
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
           um das Experiment durchzuführen. Wir bitten dich die ca. nächsten 40 Minuten konzentriert zu arbeiten.<br><br>
           Du erhältst den Code für Versuchspersonenstunden und weitere Anweisungen am Ende des Experiments.
           Bei Fragen oder Problemen wende dich bitte an:<br><br>
           Experiment.TaskSwitching@gmail.com<br><br>
           Drücke eine beliebige Taste, um fortzufahren`,
        align: "left",
        fontsize: 30,
        width: "1200px",
        lineheight: 1.5,
    }),
};

function task_instructions1() {
    if ([1, 3].includes(VERSION)) {
        return generate_formatted_html({
            text: `In diesem Experiment gibt es zwei Aufgaben. Jede Aufgabe wird mit einer Hand bearbeitet.<br><br>
             Farben Aufgabe = Linke Hand: Bitte platziere hierzu den Zeigefinger und Mittelfinger auf die Tasten „Q“ und „W“.<br><br>
             Buchstaben Aufgabe = Rechte Hand: Bitte platziere hierzu den Zeigefinger und Mittelfinger auf die Tasten „O“ und „P“.<br><br>
             Drücke eine beliebige Taste, um fortzufahren!`,
            align: "left",
            fontsize: 30,
            width: "1200px",
            lineheight: 1.5,
        });
    } else if ([2, 4].includes(VERSION)) {
        return generate_formatted_html({
            text: `In diesem Experiment gibt es zwei Aufgaben. Jede Aufgabe wird mit einer Hand bearbeitet.<br><br>
             Buchstaben Aufgabe = Linke Hand: Bitte platziere hierzu den Zeigefinger und Mittelfinger auf die Tasten „Q“ und „W“.<br><br>
             Farben Aufgabe = Rechte Hand: Bitte platziere hierzu den Zeigefinger und Mittelfinger auf die Tasten „O“ und „P“.<br><br>
             Drücke eine beliebige Taste, um fortzufahren!`,
            align: "left",
            fontsize: 30,
            width: "1200px",
            lineheight: 1.5,
        });
    }
}

const TASK_INSTRUCTIONS_TEXT = task_instructions1();

const TASK_INSTRUCTIONS1 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: TASK_INSTRUCTIONS_TEXT,
};

let RESPMAPPING;
// prettier-ignore
if ([1, 3].includes(VERSION)) {
    // left hand = colour, right hand = letter
    RESPMAPPING = generate_formatted_html({
        text: `Farbaufgabe = Linke Hand ${'&emsp;'.repeat(6)} Buchstabeaufgabe = Rechte Hand<br>
           ${PRMS.colourTask[0]} vs. ${PRMS.colourTask[1]}${'&emsp;'.repeat(12)}${PRMS.letterTask[0]} vs. ${PRMS.letterTask[1]}<br>
           (${PRMS.colourTaskKeys[0]}-Taste) ${'&emsp;'.repeat(3)}(${PRMS.colourTaskKeys[1]}-Taste)${'&emsp;'.repeat(11)}(${PRMS.letterTaskKeys[0]}-Taste)${'&emsp;'.repeat(3)}(${PRMS.letterTaskKeys[1]}-Taste)`,
        align: 'center',
        fontsize: 30,
        width: '1200px',
        bold: true,
        lineheight: 1.5,
    });
} else if ([2, 4].includes(VERSION)) {
    // left hand = letter, right hand = colour
    RESPMAPPING = generate_formatted_html({
        text: `Buchstabeaufgabe = Linke Hand ${'&emsp;'.repeat(6)} Farbaufgabe = Rechte Hand<br>
           ${PRMS.letterTask[0]} vs. ${PRMS.letterTask[1]}${'&emsp;'.repeat(12)}${PRMS.colourTask[0]} vs. ${PRMS.colourTask[1]}<br>
           (${PRMS.letterTaskKeys[0]}-Taste) ${'&emsp;'.repeat(3)}(${PRMS.letterTaskKeys[1]}-Taste)${'&emsp;'.repeat(11)}(${PRMS.colourTaskKeys[0]}-Taste)${'&emsp;'.repeat(3)}(${PRMS.colourTaskKeys[1]}-Taste)`,
        align: 'center',
        fontsize: 30,
        width: '1200px',
        bold: true,
        lineheight: 1.5,
    });
}

const TASK_INSTRUCTIONS2 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus:
        generate_formatted_html({
            text: `Für die Buchstaben Aufgabe musst du entscheiden, ob der Buchstabe normal ist oder gespiegelt (Beispiel: R wäre normal und Я gespiegelt).<br><br>
             Für die Farben Aufgabe musst du entscheiden, ob die Mehrheit der Kreise Blau oder Rot ist.<br>
             Es gilt:`,
            align: "left",
            fontsize: 30,
            width: "1200px",
            lineheight: 1.5,
        }) +
        RESPMAPPING +
        generate_formatted_html({
            text: `Drücke eine beliebige Taste um fortzufahren.`,
            align: "center",
            fontsize: 30,
            width: "1200px",
            lineheight: 1.5,
        }),
};

const TASK_INSTRUCTIONS3 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `In jedem Durchgang muss nur eine Aufgabe bearbeitet werden.<br><br>
           Wenn nur eine Aufgabe präsentiert wird, dann bearbeite bitte diese <br><br>
           Wenn beide Aufgaben präsentiert werden, kannst du dir frei aussuchen, welche du bearbeitest.<br><br>
           Drücke eine beliebige Taste um fortzufahren.`,
        align: "left",
        fontsize: 30,
        width: "1200px",
        lineheight: 1.5,
    }),
};

const BLOCK_START = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    on_start: function (trial) {
        trial.stimulus =
            generate_formatted_html({
                text: `Start Block ${PRMS.cBlk} von ${PRMS.nBlks}<br><br>
               Entscheide selbst welche Aufgabe du bearbeiten willst, wenn beide Aufgaben verfügbar sind und bearbeite sonst die Aufgabe welche präsentiert ist. Es gilt:`,
                align: "left",
                fontsize: 30,
                width: "1200px",
                lineheight: 1.5,
            }) +
            RESPMAPPING +
            generate_formatted_html({
                text: `Um den Block zu starten, drücke eine beliebige Taste.`,
                align: "center",
                fontsize: 30,
                width: "1200px",
                lineheight: 1.5,
            });
    },
};

const BLOCK_END = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    on_start: function (trial) {
        trial.stimulus = generate_formatted_html({
            text: `Ende Block ${PRMS.cBlk} von ${PRMS.nBlks}<br><br>
             Kurze Pause.<br><br>
             Wenn du bereit für den nächsten Block bist, dann drücke eine beliebige Taste.`,
            align: "left",
            fontsize: 30,
            width: "1200px",
            lineheight: 1.5,
        });
    },
    on_finish: function () {
        PRMS.cBlk += 1;
        PRMS.cTrl = 1;
    },
};

const TASK_INSTRUCTIONS_RESPMAPPING = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: RESPMAPPING,
};

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
        if (dat.error === 1) {
            trial.trial_duration = PRMS.cBlk === 1 ? PRMS.fbDur[dat.error] + 1 : PRMS.fbDur[dat.error];
            trial.stimulus =
                generate_formatted_html({
                    text: `${PRMS.fbText[dat.error]}`,
                    align: "center",
                    fontsize: 30,
                    width: "1200px",
                    lineheight: 1.5,
                }) + RESPMAPPING;
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

function drawStimulus(args) {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");

    // draw colour dors
    let radius = PRMS.dotRadius;
    let idx = 0;
    for (let rows = -PRMS.dotEccentricity; rows <= PRMS.dotEccentricity; rows += PRMS.dotGaps) {
        for (let cols = -PRMS.dotEccentricity; cols <= PRMS.dotEccentricity; cols += PRMS.dotGaps) {
            if (
                (rows > -PRMS.dotGaps * PRMS.dotBlank) &
                (rows < PRMS.dotGaps * PRMS.dotBlank) &
                (cols > -PRMS.dotGaps * PRMS.dotBlank) &
                (cols < PRMS.dotGaps * PRMS.dotBlank)
            ) {
                continue;
            }
            let centerX = rows;
            let centerY = cols;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = args.colours[idx];
            ctx.fill();
            idx += 1;
        }
    }

    // draw letter
    ctx.font = PRMS.stimFont;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "black";
    ctx.save();
    if (args.letter_orientation === "Normal") {
        ctx.scale(1, 1);
        ctx.rotate((args.letter_angle * Math.PI) / 180);
    } else if (args.letter_orientation === "Gespiegelt") {
        ctx.scale(1, -1);
        ctx.rotate(((180 - args.letter_angle) * Math.PI) / 180);
    }
    ctx.fillText(args.letter, 0, 5);
    ctx.restore();
}

const VTS = {
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
        stim_type: "vtstd",
        trial_type: jsPsych.timelineVariable("trial_type"),
        free_forced: jsPsych.timelineVariable("free_forced"),
        forced_task: jsPsych.timelineVariable("forced_task"),
        colour_diff: jsPsych.timelineVariable("colour_diff"),
        letter_diff: jsPsych.timelineVariable("letter_diff"),
    },
    on_start: function (trial) {
        "use strict";

        // letter task
        trial.data.letter = "";
        trial.data.letter_orientation = "na";
        trial.data.letter_angle = "na";
        trial.data.corr_resp_letter = "na";

        if (trial.data.letter_diff != "na") {
            trial.data.letter = shuffle(PRMS.letters)[0];
            trial.data.letter_orientation = shuffle(["Normal", "Gespiegelt"])[0];
            if (trial.data.letter_diff === "easy") {
                trial.data.letter_angle = shuffle(PRMS.anglesEasy)[0];
            } else if (trial.data.letter_diff === "normal") {
                trial.data.letter_angle = shuffle(PRMS.anglesNormal)[0];
            } else if (trial.data.letter_diff === "hard") {
                trial.data.letter_angle = shuffle(PRMS.anglesHard)[0];
            }

            // code correct letter response key
            trial.data.corr_resp_letter = PRMS.letterTaskKeys[PRMS.letterTask.indexOf(trial.data.letter_orientation)];
        }

        // colour task
        trial.data.colour_more = "na";
        trial.data.corr_resp_colour = "na";
        let dot_colours = repeatArray(CANVAS_COLOUR, Math.round(PRMS.nDots));
        if (trial.data.colour_diff !== "na") {
            let ratio;
            if (trial.data.colour_diff === "easy") {
                ratio = PRMS.ratioEasy;
            } else if (trial.data.colour_diff === "normal") {
                ratio = PRMS.ratioNormal;
            } else if (trial.data.colour_diff === "hard") {
                ratio = PRMS.ratioHard;
            }

            trial.data.colour_more = shuffle(["mehr Blau", "mehr Rot"])[0];
            let colour_order;
            if (trial.data.colour_more === "mehr Blau") {
                colour_order = [0, 1];
            } else if (trial.data.colour_more === "mehr Rot") {
                colour_order = [1, 0];
            }

            dot_colours = shuffle(
                repeatArray(PRMS.colours[colour_order[0]], Math.round(PRMS.nDots * (ratio / 100))).concat(
                    repeatArray(PRMS.colours[colour_order[1]], Math.round((PRMS.nDots * (100 - ratio)) / 100)),
                ),
            );

            // code letter response
            trial.data.corr_resp_colour = PRMS.colourTaskKeys[PRMS.colourTask.indexOf(trial.data.colour_more)];
        }

        // activate response keys
        if (PRMS.deactivateKeys) {
            // only available task keys activated
            if ((trial.data.letter !== "") & (trial.data.colour_more !== "na")) {
                trial.choices = PRMS.letterTaskKeys.concat(PRMS.colourTaskKeys);
            } else if ((trial.data.letter !== "") & (trial.data.colour_more === "na")) {
                trial.choices = PRMS.letterTaskKeys;
            } else if ((trial.data.letter === "") & (trial.data.colour_more !== "na")) {
                trial.choices = PRMS.colourTaskKeys;
            }
        } else {
            trial.choices = PRMS.letterTaskKeys.concat(PRMS.colourTaskKeys);
        }

        trial.func_args = [
            {
                trial_type: jsPsych.timelineVariable("trial_type"),
                letter: trial.data.letter,
                letter_orientation: trial.data.letter_orientation,
                letter_diff: trial.data.letter_diff,
                letter_angle: trial.data.letter_angle,
                colour_more: trial.data.colour_more,
                colours: dot_colours,
            },
        ];
    },
    on_finish: function () {
        codeTrial();
    },
};

function codeTrial() {
    "use strict";

    let dat = jsPsych.data.get().last(1).values()[0];

    // which task did they perform?
    let respondedLetter = PRMS.letterTaskKeys.includes(dat.key_press.toUpperCase());
    let respondedColour = PRMS.colourTaskKeys.includes(dat.key_press.toUpperCase());

    let error = 0;
    if (respondedLetter & (dat.key_press.toUpperCase() !== dat.corr_resp_letter)) {
        error = 1;
    } else if (respondedColour & (dat.key_press.toUpperCase() !== dat.corr_resp_colour)) {
        error = 1;
    }

    jsPsych.data.addDataToLastTrial({
        date: Date(),
        respondedLetter: respondedLetter,
        respondedColour: respondedColour,
        error: error,
        blockNum: PRMS.cBlk,
        trialNum: PRMS.cTrl,
    });

    PRMS.cTrl += 1;
}

// const BLOCK_FEEDBACK = {
//   type: jsPsychHtmlKeyboardResponseCanvas,
//   canvas_colour: CANVAS_COLOUR,
//   canvas_size: CANVAS_SIZE,
//   canvas_border: CANVAS_BORDER,
//   stimulus: '',
//   response_ends_trial: true,
//   on_start: function (trial) {
//     let block_dvs_forced_letter_easy = calculateBlockPerformance({
//       filter_options: {
//         stim_type: 'vtstd',
//         blockNum: PRMS.cBlk,
//         respondedLetter: true,
//         free_forced: 'forced',
//         letter_diff: 'easy',
//       },
//       corrColumn: 'error',
//       corrValue: 0,
//     });
//
//     let block_dvs_forced_letter_hard = calculateBlockPerformance({
//       filter_options: {
//         stim_type: 'vtstd',
//         blockNum: PRMS.cBlk,
//         respondedLetter: true,
//         free_forced: 'forced',
//         letter_diff: 'hard',
//       },
//       corrColumn: 'error',
//       corrValue: 0,
//     });
//
//     let block_dvs_forced_colour_easy = calculateBlockPerformance({
//       filter_options: {
//         stim_type: 'vtstd',
//         blockNum: PRMS.cBlk,
//         respondedColour: true,
//         free_forced: 'forced',
//         colour_diff: 'easy',
//       },
//       corrColumn: 'error',
//       corrValue: 0,
//     });
//
//     let block_dvs_forced_colour_hard = calculateBlockPerformance({
//       filter_options: {
//         stim_type: 'vtstd',
//         blockNum: PRMS.cBlk,
//         respondedColour: true,
//         free_forced: 'forced',
//         colour_diff: 'hard',
//       },
//       corrColumn: 'error',
//       corrValue: 0,
//     });
//
//     let fbText = `Block ${PRMS.cBlk}<br>
//     Letter easy: ${block_dvs_forced_letter_easy.meanRt} ms / ${block_dvs_forced_letter_easy.errorRate} %<br>
//     Letter hard: ${block_dvs_forced_letter_hard.meanRt} ms / ${block_dvs_forced_letter_hard.errorRate} %<br>
//     Colour easy: ${block_dvs_forced_colour_easy.meanRt} ms / ${block_dvs_forced_colour_easy.errorRate} %<br>
//     Colour hard: ${block_dvs_forced_colour_hard.meanRt} ms / ${block_dvs_forced_colour_hard.errorRate} %<br>`;
//
//     trial.stimulus = `<div style="font-size:${PRMS.fbTxtSizeBlock}px;">${fbText}</div>`;
//   },
//   on_finish: function () {
//     PRMS.cTrl = 1;
//     PRMS.cBlk += 1;
//   },
// };

// prettier-ignore
function trial_table() {
    if ([1, 2].includes(VERSION)) {
        return [
            { trial_type: 1, free_forced: 'free', forced_task: 'na', colour_diff: 'hard', letter_diff: 'normal' },
            { trial_type: 2, free_forced: 'free', forced_task: 'na', colour_diff: 'hard', letter_diff: 'normal' },
            { trial_type: 3, free_forced: 'free', forced_task: 'na', colour_diff: 'easy', letter_diff: 'normal' },
            { trial_type: 4, free_forced: 'free', forced_task: 'na', colour_diff: 'easy', letter_diff: 'normal' },
            { trial_type: 5, free_forced: 'forced', forced_task: 'letter', colour_diff: 'na', letter_diff: 'normal' },
            { trial_type: 6, free_forced: 'forced', forced_task: 'letter', colour_diff: 'na', letter_diff: 'normal' },
            { trial_type: 7, free_forced: 'forced', forced_task: 'colour', colour_diff: 'hard', letter_diff: 'na' },
            { trial_type: 8, free_forced: 'forced', forced_task: 'colour', colour_diff: 'easy', letter_diff: 'na' },
        ];
    } else if ([3, 4].includes(VERSION)) {
        return [
            { trial_type: 1, free_forced: 'free', forced_task: 'na', colour_diff: 'normal', letter_diff: 'hard' },
            { trial_type: 2, free_forced: 'free', forced_task: 'na', colour_diff: 'normal', letter_diff: 'hard' },
            { trial_type: 3, free_forced: 'free', forced_task: 'na', colour_diff: 'normal', letter_diff: 'easy' },
            { trial_type: 4, free_forced: 'free', forced_task: 'na', colour_diff: 'normal', letter_diff: 'easy' },
            { trial_type: 5, free_forced: 'forced', forced_task: 'letter', colour_diff: 'na', letter_diff: 'hard' },
            { trial_type: 6, free_forced: 'forced', forced_task: 'letter', colour_diff: 'na', letter_diff: 'easy' },
            { trial_type: 7, free_forced: 'forced', forced_task: 'colour', colour_diff: 'normal', letter_diff: 'na' },
            { trial_type: 8, free_forced: 'forced', forced_task: 'colour', colour_diff: 'normal', letter_diff: 'na' },
        ];
    }
}

const TRIAL_TABLE = trial_table();

// prettier-ignore
const TRIAL_TIMELINE = {
    timeline: [FIXATION_CROSS, VTS, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIAL_TABLE
};

////////////////////////////////////////////////////////////////////////
//                              VP Stunden                            //
////////////////////////////////////////////////////////////////////////

const END_SCREEN = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    response_ends_trial: true,
    choices: [" "],
    stimulus: generate_formatted_html({
        text: `Im nächsten Fenster wirst Du zunächst aufgefordert Deine E-Mail-Adresse für die Gutscheinvergabe anzugeben.
        Falls Du zu den 10% Personen mit der höchsten Gesamtpunktzahl gehörst, kannst Du nach Abschluss der Erhebung 
        wahlweise einen 10€-Gutschein von der Deutschen Bahn oder Osiander erhalten.<br><br>
        Drücke die Leertaste, um fortzufahren`,
        align: "left",
        fontsize: 30,
        width: "1200px",
        lineheight: 1.5,
    }),
};

const EMAIL_OPTION = {
    type: jsPsychSurveyText,
    questions: [
        {
            prompt: `Bitte gebe deine E-Mail Adresse ein wenn Du am Gewinnspiel teilnehmen willst.<br>
            Ansonsten lasse das Feld einfach frei und klicke ''Weiter''`,
            placeholder: "email@email",
            columns: 50,
            required: false,
            name: "email",
        },
    ],
    button_label: "Weiter",
    on_finish: function () {
        let dat = jsPsych.data.get().last(1).values()[0];
        jsPsych.data.addProperties({ email: dat.response.email });
    },
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
    saveData("/Common/write_data.php", data_fn, { stim_type: "vtstd" });
    // saveDataLocal(data_fn, { stim_type: 'vtstd' });

    const code_fn = `${DIR_NAME}code/${EXP_NAME}`;
    saveRandomCode("/Common/write_code.php", code_fn, RANDOM_STRING);
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
    exp.push(TASK_INSTRUCTIONS1);
    exp.push(TASK_INSTRUCTIONS2);
    exp.push(TASK_INSTRUCTIONS3);

    for (let blk = 0; blk < PRMS.nBlks; blk += 1) {
        exp.push(BLOCK_START);
        let blk_timeline;
        blk_timeline = { ...TRIAL_TIMELINE };
        blk_timeline.sample = {
            type: "fixed-repetitions",
            size: PRMS.nTrls / TRIAL_TABLE.length,
        };
        exp.push(blk_timeline); // trials within a block
        if (blk < PRMS.nBlks - 1) {
            exp.push(BLOCK_END);
        }
    }

    // debrief
    exp.push(mouseCursor(true));
    exp.push(END_SCREEN);
    exp.push(EMAIL_OPTION);

    // save data
    exp.push(SAVE_DATA);

    exp.push(end_message());
    exp.push(fullscreen(false));

    return exp;
}
const EXP = genExpSeq();

jsPsych.run(EXP);
