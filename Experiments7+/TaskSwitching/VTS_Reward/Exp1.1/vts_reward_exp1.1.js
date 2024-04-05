// Voluntary Task Switching paradigm with two tasks
// Task 1: Surrounding colour grid (task: more red vs. more blue?)
// Task 2: Central letter (vowel vs. consonant?)
//
// Block structure:
// 50% of trials are free choice with both task stimuli presented
// 50% of trials are forced choice (single stimulus) with 50% colour, 50% letter
// In correct trials, 50% get reward, 50% no reward
// In 50% of blocks reward is random (low efficacy), other 50% performance contingent (high efficacy)
//
// Block structure:
// 1 practice block with only correct/incorrect feedback (80 trials)
// 10 experimental blocks with 5 low, 5 high efficacy, counter-balanced (80 trials)
//
// Trial structure:
// Fixation cross (500 ms)
// Stimulus (until response)
// Feedback screens
//  if error, no points
//  if correct in low-efficacy blocks (50 % random reward)
//  if correct in high-efficacy blocks (reward if faster than condition mean)
// Reward screen (with/without reward picture)
// ITI

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
    nTrls: 4, //80, // number of trials per block
    nBlks: 11, // number of blocks
    fixSize: 15, // duration of the fixation cross
    fixWidth: 5, // size of fixation cross
    fixDur: 500, // duration of the fixation cross
    fbTextPractice: "Falsch!",
    fbText: ["Richtig! + 10 Punkte!", "Richtig, aber keine Punkte!", "Falsch! Keine Punkte!"],
    iti: 500, // duration of the inter-trial-interval
    errorDur: 1000, // duration of the error screen
    rewardDur: 1000, // duration of the reward screen
    stimFont: "110px Arial",
    fbFont: "30px Arial",
    letters: ["A", "E", "G", "I", "K", "M", "R", "U"],
    lettersVowel: ["A", "E", "I", "U"],
    lettersConsonant: ["G", "K", "M", "R"],
    colourTask: shuffle(["mehr Blau", "mehr Rot"]),
    letterTask: shuffle(["Vokal", "Konsonant"]),
    colours: ["rgba(0, 0, 255, 0.9)", "rgba(255, 0, 0, 0.9)"],
    colourTaskKeys: null, // randomly assigned below
    letterTaskKeys: null, // randomly assigned below
    ratioNormal: 80,
    respKeysLH: ["Q", "W"],
    respKeysRH: ["O", "P"],
    deactivateKeys: false, // should keys be deactivated when task not available?
    dotRadius: 1.5,
    dotEccentricity: 100,
    dotGaps: 4,
    dotBlank: 12,
    cBlk: 1,
    cTrl: 1,
};

// 4 counter balanced versions
const VERSION = Number(jsPsych.data.urlVariables().version);
jsPsych.data.addProperties({ version: VERSION });

// Version 1/3: Colour task = left hand,  Letter task = right hand
// Version 2/4: Colour task = right hand, Letter task = left hand
// Versions 1/2 vs. 3/4 counter-balanced block order type
if (VERSION === 1 || VERSION === 3) {
    PRMS.colourTaskKeys = PRMS.respKeysLH; // e.g., more red vs. more blue
    PRMS.letterTaskKeys = PRMS.respKeysRH; // e.g., vowel vs. consonant
} else if (VERSION === 2 || VERSION === 4) {
    PRMS.colourTaskKeys = PRMS.respKeysRH; // e.g., more red vs. more blue
    PRMS.letterTaskKeys = PRMS.respKeysLH; // e.g., vowel vs. consonant
}

const PERFORMANCE = {
    letter_repetition_free_rts: [],
    letter_repetition_free_avg: [],
    letter_repetition_forced_rts: [],
    letter_repetition_forced_avg: [],
    letter_switch_free_rts: [],
    letter_switch_free_avg: [],
    letter_switch_forced_rts: [],
    letter_switch_forced_avg: [],
    colour_repetition_free_rts: [],
    colour_repetition_free_avg: [],
    colour_repetition_forced_rts: [],
    colour_repetition_forced_avg: [],
    colour_switch_free_rts: [],
    colour_switch_free_avg: [],
    colour_switch_forced_rts: [],
    colour_switch_forced_avg: [],
};

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
Die Teilnahme ist freiwillig und Du darfst das Experiment jederzeit abbrechen.
Bitte stelle sicher, dass Du dich in einer ruhigen Umgebung befindest und genügend Zeit hast,
um das Experiment durchzuführen. Wir bitten dich die ca. nächsten 40 Minuten konzentriert zu arbeiten.<br><br>
Bei Fragen oder Problemen wende dich bitte an:<br><br> 
XXX<br><br>
Drücke eine beliebige Taste, um fortzufahren`,
        align: "left",
        fontsize: 30,
        width: "1200px",
        lineheight: 1.5,
    }),
};

function task_instructions1() {
    if (VERSION === 1 || VERSION === 3) {
        return generate_formatted_html({
            text: `In diesem Experiment gibt es zwei Aufgaben. Jede Aufgabe wird mit einer Hand bearbeitet.<br><br>
Farbeaufgabe = Linke Hand: Bitte platziere hierzu den Mittelfinger und Zeigefinger auf die Tasten „Q“ und „W“.<br><br>
Buchstabenaufgabe = Rechte Hand: Bitte platziere hierzu den Zeigefinger und Mittelfinger auf die Tasten „O“ und „P“.<br><br>
Drücke die „G“-Taste, um fortzufahren!`,
            align: "left",
            fontsize: 30,
            width: "1200px",
            lineheight: 1.5,
        });
    } else if (VERSION === 2 || VERSION === 4) {
        return generate_formatted_html({
            text: `In diesem Experiment gibt es zwei Aufgaben. Jede Aufgabe wird mit einer Hand bearbeitet.<br><br>
Buchstabenaufgabe = Linke Hand: Bitte platziere hierzu den Mittelfinger und Zeigefinger auf die Tasten „Q“ und „W“.<br><br>
Farbeaufgabe = Rechte Hand: Bitte platziere hierzu den Zeigefinger und Mittelfinger auf die Tasten „O“ und „P“.<br><br>
Drücke die „G“-Taste, um fortzufahren!`,
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
    choices: ["G"],
};

let RESPMAPPING;
// prettier-ignore
if (VERSION === 1 || VERSION === 3) {
  // left hand = colour, right hand = letter
  RESPMAPPING = generate_formatted_html({
    text: `Farbaufgabe = Linke Hand ${'&emsp;'.repeat(6)} Buchstabenaufgabe = Rechte Hand<br>
${PRMS.colourTask[0]} vs. ${PRMS.colourTask[1]}${'&emsp;'.repeat(12)}${PRMS.letterTask[0]} vs. ${PRMS.letterTask[1]}<br>
(${PRMS.colourTaskKeys[0]}-Taste) ${'&emsp;'.repeat(3)}(${PRMS.colourTaskKeys[1]}-Taste)${'&emsp;'.repeat(11)}(${PRMS.letterTaskKeys[0]}-Taste)${'&emsp;'.repeat(3)}(${PRMS.letterTaskKeys[1]}-Taste)`,
    align: 'center',
    fontsize: 30,
    width: '1200px',
    bold: true,
    lineheight: 1.5,
  });
} else if (VERSION === 2 || VERSION === 4) {
  // left hand = letter, right hand = colour
  RESPMAPPING = generate_formatted_html({
    text: `Buchstabenaufgabe = Linke Hand ${'&emsp;'.repeat(6)} Farbaufgabe = Rechte Hand<br>
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
            text: `Für die Buchstabenaufgabe musst Du entscheiden, ob der Buchstabe ein Vokal oder Konsonant ist.<br><br>
Für die Farbaufgabe musst Du entscheiden, ob die Mehrheit der Punkte Blau oder Rot ist.<br><br>
Es gilt:`,
            align: "left",
            fontsize: 30,
            width: "1200px",
            lineheight: 1.5,
        }) +
        RESPMAPPING +
        generate_formatted_html({
            text: `Drücke die „X“- Taste, um fortzufahren.`,
            align: "center",
            fontsize: 30,
            width: "1200px",
            lineheight: 1.5,
        }),
    choices: ["X"],
};

const TASK_INSTRUCTIONS3 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `In jedem Durchgang muss nur eine Aufgabe bearbeitet werden.<br><br>
Wenn nur eine Aufgabe präsentiert wird, dann bearbeite bitte diese. <br><br>
Wenn beide Aufgaben präsentiert werden, kannst Du dir frei aussuchen, welche Du bearbeitest.<br><br>
Drücke die „T“- Taste, um fortzufahren.`,
        align: "left",
        fontsize: 30,
        width: "1200px",
        lineheight: 1.5,
    }),
    choices: ["T"],
};

const TASK_INSTRUCTIONS4 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `In manchen Durchgängen erhälst Du +10 Punkte, wenn die Aufgabe richtig bearbeitet wurde.<br><br>
Je mehr Punkte Du sammelst, desto kürzer wird das Experiment! 
Du erfährst nach dem ${PRMS.nBlks} Block, wieviele der restlichen Blöcke aufgrund deiner Punktzahl wegfallen.<br><br>
Des Weiteren werden die 20% aller Personen mit den höchsten Gesamtpunktzahlen einen 10€ Gutschein
von Osiander oder der deutschen Bahn erhalten.<br><br>
Drücke die „K“- Taste, um fortzufahren.`,
        align: "left",
        fontsize: 30,
        width: "1200px",
        lineheight: 1.5,
    }),
    choices: ["K"],
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
                text: `Start Block ${PRMS.cBlk} von ${PRMS.nBlks + 3}<br><br>
Entscheide selbst welche Aufgabe du bearbeiten willst, wenn beide Aufgaben verfügbar sind. Bearbeite sonst die Aufgabe, die präsentiert ist. Es gilt:`,
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

const average = (arr) => arr.reduce((p, c) => p + c, 0) / arr.length;

// prettier-ignore
function calculate_previous_block_performance() {
  PERFORMANCE.letter_repetition_free_avg   = average(PERFORMANCE.letter_repetition_free_rts);
  PERFORMANCE.letter_repetition_free_rts   = [];
  PERFORMANCE.letter_repetition_forced_avg = average(PERFORMANCE.letter_repetition_forced_rts);
  PERFORMANCE.letter_repetition_forced_rts = [];
  PERFORMANCE.letter_switch_free_avg       = average(PERFORMANCE.letter_switch_free_rts);
  PERFORMANCE.letter_switch_free_rts       = [];
  PERFORMANCE.letter_switch_forced_avg     = average(PERFORMANCE.letter_switch_forced_rts);
  PERFORMANCE.letter_switch_forced_rts     = [];
  PERFORMANCE.colour_repetition_free_avg   = average(PERFORMANCE.colour_repetition_free_rts);
  PERFORMANCE.colour_repetition_free_rts   = [];
  PERFORMANCE.colour_repetition_forced_avg = average(PERFORMANCE.colour_repetition_forced_rts);
  PERFORMANCE.colour_repetition_forced_rts = [];
  PERFORMANCE.colour_switch_free_avg       = average(PERFORMANCE.colour_switch_free_rts);
  PERFORMANCE.colour_switch_free_rts       = [];
  PERFORMANCE.colour_switch_forced_avg     = average(PERFORMANCE.colour_switch_forced_rts);
  PERFORMANCE.colour_switch_forced_rts     = [];
}

const BLOCK_END = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    on_start: function (trial) {
        let dat = jsPsych.data.get();
        let nReward = dat.select("reward").values.filter(function (x) {
            return x === true;
        }).length;
        trial.stimulus = generate_formatted_html({
            text: `Ende Block ${PRMS.cBlk} von ${PRMS.nBlks + 3}<br><br>
Dein aktueller Punktestand beträgt: POINTS: ${nReward * 10}! <br><br>
Kurze Pause.<br><br>
Wenn Du bereit für den nächsten Block bist, dann drücke eine beliebige Taste.`,
            align: "left",
            fontsize: 30,
            width: "1200px",
            lineheight: 1.5,
        });
    },
    on_finish: function () {
        PRMS.cBlk += 1;
        PRMS.cTrl = 1;
        calculate_previous_block_performance();
    },
};

const TASK_INSTRUCTIONS_RESPMAPPING = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: RESPMAPPING,
};

const REWARD_IMAGES = [`images/treasure_box.png`, `images/blank.png`];

const PRELOAD = {
    type: jsPsychPreload,
    images: REWARD_IMAGES,
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
    ctx.fillText(args.letter, 0, 5);
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
        stim_type: "vtsr",
        block_type: jsPsych.timelineVariable("block_type"),
        trial_type: jsPsych.timelineVariable("trial_type"),
        free_forced: jsPsych.timelineVariable("free_forced"),
        forced_task: jsPsych.timelineVariable("forced_task"),
    },
    on_start: function (trial) {
        "use strict";

        // letter task
        trial.data.letter = "";
        trial.data.corr_resp_letter = "na";

        if ((trial.data.forced_task === "na") | (trial.data.forced_task === "letter")) {
            trial.data.letter = shuffle(PRMS.letters)[0];
            if (PRMS.lettersVowel.includes(trial.data.letter)) {
                trial.data.corr_resp_letter = PRMS.letterTaskKeys[PRMS.letterTask.indexOf("Vokal")];
            } else if (PRMS.lettersConsonant.includes(trial.data.letter)) {
                trial.data.corr_resp_letter = PRMS.letterTaskKeys[PRMS.letterTask.indexOf("Konsonant")];
            }
        }

        // colour task
        trial.data.colour_more = "";
        trial.data.corr_resp_colour = "na";
        let dot_colours = repeatArray(CANVAS_COLOUR, Math.round(PRMS.nDots));
        if ((trial.data.forced_task === "na") | (trial.data.forced_task === "colour")) {
            let ratio = PRMS.ratioNormal;
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
    let responseTask = respondedLetter ? "letter" : "colour";

    // was it switch vs. repetition
    let repetitionSwitch;
    if (PRMS.cTrl === 1) {
        repetitionSwitch = "na";
    } else {
        let dat2 = jsPsych.data.get().last(6).values()[0];
        repetitionSwitch = responseTask === dat2.responseTask ? "repetition" : "switch";
    }

    // 1 = correct practice
    // 2 = incorrect practice
    // 11 = correct with reward experimental blocks
    // 12 = correct with no reward experimental blocks
    // 13 = incorrect with no reward experimental blocks
    let correctResponse = true;
    if (
        respondedLetter & (dat.key_press.toUpperCase() !== dat.corr_resp_letter) ||
        respondedColour & (dat.key_press.toUpperCase() !== dat.corr_resp_colour)
    ) {
        correctResponse = false;
    }

    let corrCode;
    if (dat.block_type === "practice" && correctResponse) {
        corrCode = 1;
    } else if (dat.block_type === "practice" && !correctResponse) {
        corrCode = 2;
    } else if (dat.block_type !== "practice" && correctResponse) {
        corrCode = 11;
    } else if (dat.block_type !== "practice" && !correctResponse) {
        corrCode = 13;
    }

    // store data to calculate performance based reward
    let performance_reward;
    if (responseTask === "letter" && repetitionSwitch === "repetition" && dat.free_forced === "free") {
        PERFORMANCE.letter_repetition_free_rts.push(dat.rt);
        performance_reward = dat.rt < PERFORMANCE.letter_repetition_free_avg; // mean from previous block
    } else if (responseTask === "letter" && repetitionSwitch === "repetition" && dat.free_forced === "forced") {
        PERFORMANCE.letter_repetition_forced_rts.push(dat.rt);
        performance_reward = dat.rt < PERFORMANCE.letter_repetition_forced_avg; // mean from previous block
    } else if (responseTask === "letter" && repetitionSwitch === "switch" && dat.free_forced === "free") {
        PERFORMANCE.letter_switch_free_rts.push(dat.rt);
        performance_reward = dat.rt < PERFORMANCE.letter_switch_free_avg; // mean from previous block
    } else if (responseTask === "letter" && repetitionSwitch === "switch" && dat.free_forced === "forced") {
        PERFORMANCE.letter_switch_forced_rts.push(dat.rt);
        performance_reward = dat.rt < PERFORMANCE.letter_switch_forced_avg; // mean from previous block
    } else if (responseTask === "colour" && repetitionSwitch === "repetition" && dat.free_forced === "free") {
        PERFORMANCE.colour_repetition_free_rts.push(dat.rt);
        performance_reward = dat.rt < PERFORMANCE.colour_repetition_free_avg; // mean from previous block
    } else if (responseTask === "colour" && repetitionSwitch === "repetition" && dat.free_forced === "forced") {
        PERFORMANCE.colour_repetition_forced_rts.push(dat.rt);
        performance_reward = dat.rt < PERFORMANCE.colour_repetition_forced_avg; // mean from previous block
    } else if (responseTask === "colour" && repetitionSwitch === "switch" && dat.free_forced === "free") {
        PERFORMANCE.colour_switch_free_rts.push(dat.rt);
        performance_reward = dat.rt < PERFORMANCE.colour_switch_free_avg; // mean from previous block
    } else if (responseTask === "colour" && repetitionSwitch === "switch" && dat.free_forced === "forced") {
        PERFORMANCE.colour_switch_forced_rts.push(dat.rt);
        performance_reward = dat.rt < PERFORMANCE.colour_switch_forced_avg; // mean from previous block
    }

    let reward;
    if (dat.block_type === "practice" || corrCode === 13) {
        reward = false;
    } else if (dat.block_type === "low_efficacy") {
        // random reward
        reward = Math.random() < 0.5;
        if (!reward) {
            corrCode = 12; // correct, but no reward
        }
    } else if (dat.block_type === "high_efficacy") {
        reward = performance_reward;
    }

    // store data to calculate performance based reward
    if (responseTask === "letter" && repetitionSwitch === "repetition" && dat.free_forced === "free") {
        PERFORMANCE.letter_repetition_free_rts.push(dat.rt);
    } else if (responseTask === "letter" && repetitionSwitch === "repetition" && dat.free_forced === "forced") {
        PERFORMANCE.letter_repetition_forced_rts.push(dat.rt);
    } else if (responseTask === "letter" && repetitionSwitch === "switch" && dat.free_forced === "free") {
        PERFORMANCE.letter_switch_free_rts.push(dat.rt);
    } else if (responseTask === "letter" && repetitionSwitch === "switch" && dat.free_forced === "forced") {
        PERFORMANCE.letter_switch_forced_rts.push(dat.rt);
    } else if (responseTask === "colour" && repetitionSwitch === "repetition" && dat.free_forced === "free") {
        PERFORMANCE.colour_repetition_free_rts.push(dat.rt);
    } else if (responseTask === "colour" && repetitionSwitch === "repetition" && dat.free_forced === "forced") {
        PERFORMANCE.colour_repetition_forced_rts.push(dat.rt);
    } else if (responseTask === "colour" && repetitionSwitch === "switch" && dat.free_forced === "free") {
        PERFORMANCE.colour_switch_free_rts.push(dat.rt);
    } else if (responseTask === "colour" && repetitionSwitch === "switch" && dat.free_forced === "forced") {
        PERFORMANCE.colour_switch_forced_rts.push(dat.rt);
    }

    jsPsych.data.addDataToLastTrial({
        date: Date(),
        responseTask: responseTask,
        corrCode: corrCode,
        reward: reward,
        performance_reward: performance_reward,
        blockNum: PRMS.cBlk,
        trialNum: PRMS.cTrl,
    });

    PRMS.cTrl += 1;
}

const TRIAL_FEEDBACK = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    response_ends_trial: false,
    stimulus: "",
    trial_duration: 0,
    on_start: function (trial) {
        let dat = jsPsych.data.get().last(1).values()[0];
        if (dat.block_type === "practice" && dat.corrCode == 2) {
            trial.trial_duration = PRMS.errorDur;
            trial.stimulus =
                generate_formatted_html({
                    text: PRMS.fbTextPractice,
                    align: "center",
                    fontsize: 30,
                    width: "1200px",
                    lineheight: 1.5,
                    bold: true,
                }) + RESPMAPPING;
        } else if (dat.corrCode === 13) {
            // error during experimental block
            trial.trial_duration = PRMS.errorDur;
            trial.stimulus =
                generate_formatted_html({
                    text: PRMS.fbText[dat.corrCode - 11],
                    align: "center",
                    fontsize: 30,
                    width: "1200px",
                    lineheight: 1.5,
                    bold: true,
                }) + RESPMAPPING;
        }
    },
};

function drawReward(args) {
    "use strict";
    if (args.corrCode === 13) {
        return;
    }
    let ctx = document.getElementById("canvas").getContext("2d");

    // draw text
    ctx.font = PRMS.fbFont;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "black";

    ctx.fillText(PRMS.fbText[args.corrCode - 11], 0, -105);

    // draw image
    let img = new Image();

    if (args.corrCode === 11) {
        img.src = REWARD_IMAGES[0];
    } else {
        img.src = REWARD_IMAGES[1];
    }

    // draw image
    const size = 8;
    const width = img.width;
    const height = img.height;
    ctx.drawImage(img, -width / size / 2, -height / size / 2 + 35, width / size, height / size);
}

const TRIAL_REWARD = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    response_ends_trial: false,
    trial_duration: PRMS.rewardDur,
    func: drawReward,
    func_args: null,
    on_start: function (trial) {
        let dat = jsPsych.data.get().last(2).values()[0];
        trial.func_args = [{ corrCode: dat.corrCode }];
        if (dat.corrCode === 13) {
            trial_duration = 0;
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

// prettier-ignore
const TRIAL_TABLE_PRACTICE = [
    { block_type: "practice", trial_type: 1, free_forced: 'free',   forced_task: 'na' },
    { block_type: "practice", trial_type: 2, free_forced: 'free',   forced_task: 'na' },
    { block_type: "practice", trial_type: 3, free_forced: 'forced', forced_task: 'letter' },
    { block_type: "practice", trial_type: 4, free_forced: 'forced', forced_task: 'colour' },
  ];

// prettier-ignore
const TRIAL_TIMELINE_PRACTICE = {
    timeline: [FIXATION_CROSS, VTS, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIAL_TABLE_PRACTICE
  };

// prettier-ignore
const TRIAL_TABLE_LOW_EFFICACY = [
    { block_type: "low_efficacy", trial_type: 1, free_forced: 'free',   forced_task: 'na' },
    { block_type: "low_efficacy", trial_type: 2, free_forced: 'free',   forced_task: 'na' },
    { block_type: "low_efficacy", trial_type: 3, free_forced: 'forced', forced_task: 'letter' },
    { block_type: "low_efficacy", trial_type: 4, free_forced: 'forced', forced_task: 'colour' },
  ];

// prettier-ignore
const TRIAL_TIMELINE_LOW_EFFICACY = {
    timeline: [FIXATION_CROSS, VTS, TRIAL_FEEDBACK, TRIAL_REWARD, ITI],
    timeline_variables: TRIAL_TABLE_LOW_EFFICACY
  };

// prettier-ignore
const TRIAL_TABLE_HIGH_EFFICACY = [
    { block_type: "high_efficacy", trial_type: 1, free_forced: 'free',   forced_task: 'na' },
    { block_type: "high_efficacy", trial_type: 2, free_forced: 'free',   forced_task: 'na' },
    { block_type: "high_efficacy", trial_type: 3, free_forced: 'forced', forced_task: 'letter' },
    { block_type: "high_efficacy", trial_type: 4, free_forced: 'forced', forced_task: 'colour' },
  ];

// prettier-ignore
const TRIAL_TIMELINE_HIGH_EFFICACY = {
    timeline: [FIXATION_CROSS, VTS, TRIAL_FEEDBACK, TRIAL_REWARD, ITI],
    timeline_variables: TRIAL_TABLE_HIGH_EFFICACY
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
        text: `Glückwunsch! Durch deinen Punktestand hat sich das Experiment verkürzt und ist nach ein paar weiteren Klicks vorbei.<br>
Im nächsten Fenster wirst Du zunächst aufgefordert Deine E-Mail-Adresse für die Gutscheinvergabe anzugeben.
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
const VP_NUM = getTime();

function save() {
    jsPsych.data.addProperties({ vpNum: VP_NUM });
    saveData("/Common/write_data.php", `${DIR_NAME}data/version${VERSION}/${EXP_NAME}_${VP_NUM}`, {
        stim_type: "vtsr",
    });
    // saveDataLocal(data_fn, { stim_type: "vtsr" });
}

const SAVE_DATA = {
    type: jsPsychCallFunction,
    func: save,
    post_trial_gap: 3000,
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
    "use strict";

    let exp = [];

    // setup
    // exp.push(fullscreen(true));
    // exp.push(browser_check(CANVAS_SIZE));
    // exp.push(resize_browser());
    // exp.push(welcome_message());
    // exp.push(vpInfoForm("/Common7+/vpInfoForm_de.html"));
    // exp.push(mouseCursor(false));

    exp.push(COUNT_DOTS);
    exp.push(PRELOAD);

    // // instructions
    // exp.push(WELCOME_INSTRUCTIONS);
    // exp.push(TASK_INSTRUCTIONS1);
    // exp.push(TASK_INSTRUCTIONS2);
    // exp.push(TASK_INSTRUCTIONS3);
    // exp.push(TASK_INSTRUCTIONS4);

    // // practice block without reward feedback
    // let blk_timeline;
    // blk_timeline = { ...TRIAL_TIMELINE_PRACTICE };
    // blk_timeline.sample = {
    //     type: "fixed-repetitions",
    //     size: PRMS.nTrls / TRIAL_TABLE_PRACTICE.length,
    // };
    // exp.push(blk_timeline);

    let blk_type;
    if (VERSION === 1 || VERSION === 2) {
        blk_type = repeatArray(["low_efficacy", "high_efficacy"], (PRMS.nBlks - 1) / 2);
    } else if (VERSION === 3 || VERSION === 4) {
        blk_type = repeatArray(["high_efficacy", "low_efficacy"], (PRMS.nBlks - 1) / 2);
    }

    for (let blk = 0; blk < PRMS.nBlks - 1; blk += 1) {
        exp.push(BLOCK_START);
        let blk_timeline;
        if (blk_type[blk] === "low_efficacy") {
            blk_timeline = { ...TRIAL_TIMELINE_LOW_EFFICACY };
            blk_timeline.sample = {
                type: "fixed-repetitions",
                size: PRMS.nTrls / TRIAL_TABLE_LOW_EFFICACY.length,
            };
        } else if (blk_type[blk] === "high_efficacy") {
            blk_timeline = { ...TRIAL_TIMELINE_HIGH_EFFICACY };
            blk_timeline.sample = {
                type: "fixed-repetitions",
                size: PRMS.nTrls / TRIAL_TABLE_HIGH_EFFICACY.length,
            };
        }
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
