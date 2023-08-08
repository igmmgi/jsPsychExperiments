// Voluntary Task Switching paradigm with two tasks
// Task 1: letter (vowel vs. consonant?)
// Task 2: colour (more red vs. more blue?)
//
// At the start of each trial participants can either choice freely which
// task to perform (free choice), or are forced to select either the <letter>
// or the colour task (forced choice). 50/50 proportions of free vs. forced choice.
// Task choice is always made with the left hand using the "Q"/"W" keys (left hand) with
// side (letter left/colour right vs. colour left/letter right) randomly assigned per
// participant. Task response (vowel vs. consonant or more red vs. more blue) was made
// with the "O"/"P" keys (right hand). The specific S-R mappings (e.g., vowel -> left, blue -> right)
// were randonly assigned on a per participant basis.
//
// Block structure:
// 8 blocks of 80 trials
// 50% of trials are free choice with both task stimuli presented
// 50% of trials are forced choice (single stimulus) with 50% colour, 50% letter
//
// Trial structure:
// Task choice screen with two tasks (free choice) or a single task (forced choice) displayed
// Following task selection, a surrounding rectangle indicated task choice (250 ms)
// Respective task shown (no deadline)
// Feedback screen (750ms) with the following options:
// In correct trials, it was randomly determined if reward would be received or not (50/50 probability)
// Reward = Full treasure box + message "Corrrect + 10 points!"
// No Reward = Empty treasure box + message "Corrrect, but no points!"
// In error trials, No treasure box + message "Error! No points!"
// Blank inter-trial-interval for 500 ms

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
    nTrls: 8, // number of trials per block
    nBlks: 1, // number of blocks
    taskSelectionDur: 250, // duration of the task selection screen
    fbText: ["Correct! +10 points!", "Correct! But no points!", "Error! No points!"],
    iti: 500, // duration of the inter-trial-interval
    feedbackDur: [750, 750, 750], // duration of the reward screen
    stimFont: "110px Arial",
    fbFont: "30px Arial",
    letters: ["A", "E", "I", "U", "G", "K", "M", "R"],
    lettersVowel: ["A", "E", "I", "U"],
    lettersConsonant: ["G", "K", "M", "R"],
    taskSide: shuffle(["Letter", "Colour"]),
    ColourTask: shuffle(["mehr Blau", "mehr Rot"]),
    LetterTask: shuffle(["Vokal", "Konsonant"]),
    colours: ["rgba(0, 0, 255, 0.9)", "rgba(255, 0, 0, 0.9)"],
    ratioNormal: 80,
    respKeysLH: ["Q", "W"],
    respKeysRH: ["O", "P"],
    deactivateKeys: false, // should keys be deactivated when task not available?
    dotRadius: 1.5,
    dotEccentricity: 100,
    dotGaps: 4,
    dotBlank: 12,
    taskChoicePosX: 200,
    taskChoiceImageScale: 10,
    rewardImageScale: 8,
    cBlk: 1,
    cTrl: 1,
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
               um das Experiment durchzuführen. Wir bitten dich die ca. nächsten 45 Minuten konzentriert zu arbeiten.<br><br>
               Bei Fragen oder Problemen wende dich bitte an:<br><br> 
               magdalena.trassl@student.uni-tuebingen.de<br><br>
               Drücke eine beliebige Taste, um fortzufahren`,
        align: "left",
        fontsize: 30,
        width: "1200px",
        lineheight: 1.5,
    }),
};

const TASK_INSTRUCTIONS1 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `In diesem Experiment gibt es zwei Aufgaben. Mit der linken Hand wird zunächst die Aufgabe ausgewählt und mit der rechten Hand wird die Aufgabe bearbeitet.<br><br>
              Auswahl der Aufgabe = Linke Hand:<br><br> 
              Bearbeitung der Aufgabe = Rechte Hand:<br><br><br>
              Drücke die "G"-Taste, um fortzufahren!`,
        align: "left",
        fontsize: 30,
        width: "1200px",
        lineheight: 1.5,
    }),
    choices: ["G"],
};

const RESPMAPPING = `<html>
<head>
   <style>
      .container {
	background-color: ${CANVAS_COLOUR};
	width: 1000px;
	margin: 10px auto;
	display: grid;
	grid-template-rows: 50px 80px 20px 80px;
	grid-template-columns: 220px 220px 80px 220px 220px;
}
.header1{
  grid-column: 1/3;
	font-size: 22px;
	font-weight: bold;
	color: black;
  text-align: center;
}
.header2{
  grid-column: 4/6;
	font-size: 22px;
	font-weight: bold;
	color: black;
  text-align: center;
}
.itemL {
	font-size: 22px;
	font-weight: bold;
	color: black;
  text-align: center;
}
.itemR {
  grid-column: 4/6;
	font-size: 22px;
	font-weight: bold;
	color: black;
  text-align: center;
}
</style>
</head>
<body>
<div class="container">
	<div class="header1 header--1">Auswahl der Aufgabe = Linke Hand</div>
	<div class="header2 header--2">Bearbeitung der Aufgabe = Rechte Hand</div>
	<div class="itemL item--3">Linke Aufgabe<br>(${PRMS.taskSide[0]})<br>${PRMS.respKeysLH[0]}</div>
	<div class="itemL item--4">Rechte Aufgabe<br>(${PRMS.taskSide[1]})<br>${PRMS.respKeysLH[1]}</div>
	<div class="itemL item--5"></div>
	<div class="itemR item--6">${PRMS.taskSide[0]}-Aufgabe:<br>${PRMS[PRMS.taskSide[0] + "Task"][0]} ${"&emsp;".repeat(2)}${
    PRMS[PRMS.taskSide[0] + "Task"][1]
}<br>${PRMS.respKeysRH[0]} ${"&emsp;".repeat(5)}${PRMS.respKeysRH[1]}<br></div>
	<div class="item item--7"></div>
	<div class="item item--8"></div>
	<div class="item item--9"></div>
	<div class="item item--10"></div>
<div class="itemR item--11">${PRMS.taskSide[1]}-Aufgabe:<br>${PRMS[PRMS.taskSide[1] + "Task"][0]} ${"&emsp;".repeat(
    2,
)}${PRMS[PRMS.taskSide[1] + "Task"][1]}<br>${PRMS.respKeysRH[0]} ${"&emsp;".repeat(5)} ${PRMS.respKeysRH[1]}<br></div>
	</div>
</body>
</html>`;

const TASK_INSTRUCTIONS2 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus:
        generate_formatted_html({
            text: `Für die Buchstabenaufgabe musst Du entscheiden, ob der Buchstabe ein Vokal oder Konsonant ist.<br><br>
             Für die Farbaufgabe musst Du entscheiden, ob die Mehrheit der Punkte Blau oder Rot ist.`,
            align: "left",
            fontsize: 30,
            width: "1200px",
            lineheight: 1.5,
        }) +
        RESPMAPPING +
        generate_formatted_html({
            text: `Drücke die "X"- Taste, um fortzufahren.`,
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
               Wenn nur eine Aufgabe präsentiert wird, wähle diese bitte mit der linken Hand aus und bearbeite sie.<br><br>
               Wenn beide Aufgaben präsentiert werden, kannst Du dir frei aussuchen, welche Du bearbeitest.<br><br>
               Drücke die "T"- Taste, um fortzufahren.`,
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
        text: `Zu Beginn des Experimentes hast du 0 Punkte.<br><br>
           In manchen Durchgängen kannst du + 10 Punkte für eine korrekte Antwort gewinnen. In Durchgängen mit Fehler bekommst Du keine Punkte.
           Je mehr Punkte Du gewinnst, desto kürzer wird das Experiment! Du erfährst nach dem ${PRMS.nBlks} Block, wie viele der restlichen Blöcke aufgrund deiner Punktzahl wegfallen.<br><br>
           Des Weiteren werden die 20% aller Personen mit den höchsten Gesamtpunktzahlen einen 10 % Gutschein von Osiander oder der deutschen Bahn erhalten.<br><br>
           Drücke die "K"- Taste, um fortzufahren.`,
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
                       Wähle selbst, welche Aufgabe du bearbeiten willst, wenn beide Aufgaben verfügbar sind. Wähle und bearbeite sonst die Aufgabe, die präsentiert ist.<br><br>`,
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
    },
};

const IMAGES = [`images/Correct_NORew.JPG`, `images/CorrectReward.JPG`, `images/CueBox.JPG`, `images/Error.JPG`];

const PRELOAD = {
    type: jsPsychPreload,
    images: IMAGES,
};

function drawTaskChoice(args) {
    let ctx = document.getElementById("canvas").getContext("2d");

    // draw text
    ctx.font = PRMS.fbFont;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "black";
    ctx.font = "50px Arial";

    let drawImage = [false, false];
    let drawText = [false, false];

    if (args.free_forced == "free") {
        drawText = [1, 1];
        drawImage = [true, true];
    } else if (args.free_forced == "forced") {
        drawText[PRMS.taskSide.indexOf(args.forced_task)] = true;
        drawImage[PRMS.taskSide.indexOf(args.forced_task)] = true;
    }

    // text
    if (drawText[0]) {
        ctx.fillText(PRMS.taskSide[0], -PRMS.taskChoicePosX, 100);
    }
    if (drawText[1]) {
        ctx.fillText(PRMS.taskSide[1], PRMS.taskChoicePosX, 100);
    }

    // image
    let img = new Image();
    img.src = IMAGES[2];
    const size = PRMS.taskChoiceImageScale;
    const width = img.width;
    const height = img.height;

    if (drawImage[0]) {
        ctx.drawImage(img, -width / size / 2 - PRMS.taskChoicePosX, -height / size / 2, width / size, height / size);
    }
    if (drawImage[1]) {
        ctx.drawImage(img, -width / size / 2 + PRMS.taskChoicePosX, -height / size / 2, width / size, height / size);
    }

    // rectangle
    if (args.draw_rectangle) {
        let dat = jsPsych.data.get().last(1).values()[0];
        ctx.beginPath();
        ctx.lineWidth = 10;
        if (dat.key_press == PRMS.respKeysLH[0].toLowerCase()) {
            ctx.rect(-width / size / 2 - PRMS.taskChoicePosX, -height / size / 2, width / size, height / size + 50);
        } else if (dat.key_press == PRMS.respKeysLH[1].toLowerCase()) {
            ctx.rect(-width / size / 2 + PRMS.taskChoicePosX, -height / size / 2, width / size, height / size + 50);
        }
        ctx.stroke();
    }
}

const TASK_CHOICE_SELECTION = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    response_ends_trial: true,
    choices: null,
    trial_duration: PRMS.tooSlow,
    func: drawTaskChoice,
    func_args: null,
    data: {
        stim_type: "vts",
        free_forced: jsPsych.timelineVariable("free_forced"),
        forced_task: jsPsych.timelineVariable("forced_task"),
    },
    on_start: function (trial) {
        "use strict";

        if (trial.data.free_forced == "free") {
            trial.choices = PRMS.respKeysLH;
        } else if (trial.data.free_forced == "forced") {
            trial.choices = [PRMS.respKeysLH[PRMS.taskSide.indexOf(trial.data.forced_task)]];
        }

        trial.func_args = [
            {
                free_forced: jsPsych.timelineVariable("free_forced"),
                forced_task: jsPsych.timelineVariable("forced_task"),
                draw_rectangle: false,
            },
        ];
    },
};

const TASK_CHOICE_FEEDBACK = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    response_ends_trial: false,
    choices: null,
    trial_duration: PRMS.taskSelectionDur,
    func: drawTaskChoice,
    func_args: null,
    data: {
        stim_type: "vts_tcr",
        free_forced: jsPsych.timelineVariable("free_forced"),
        forced_task: jsPsych.timelineVariable("forced_task"),
    },
    on_start: function (trial) {
        "use strict";
        trial.func_args = [
            {
                free_forced: jsPsych.timelineVariable("free_forced"),
                forced_task: jsPsych.timelineVariable("forced_task"),
                draw_rectangle: true,
            },
        ];
    },
    on_finish: function () {
        codeTrialTaskSelection();
    },
};

function codeTrialTaskSelection() {
    "use strict";

    let dat = jsPsych.data.get().last(2).values()[0];

    // Which task did they choose?
    let selected_task;
    if (dat.key_press == PRMS.respKeysLH[0].toLowerCase()) {
        selected_task = PRMS.taskSide[0];
    } else if (dat.key_press == PRMS.respKeysLH[1].toLowerCase()) {
        selected_task = PRMS.taskSide[1];
    }

    jsPsych.data.addDataToLastTrial({
        date: Date(),
        selected_task: selected_task,
        rt: dat.rt,
        key_press: dat.key_press,
        corrCode: 1,
        reward: false,
        trial_phase: "task_selection",
        block_num: PRMS.cBlk,
        trial_num: PRMS.cTrl,
        letter: "na",
        corr_resp_letter: "na",
        colour_more: "na",
        corr_resp_colour: "na",
    });
}

function drawStimulus(args) {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");

    // draw colour dots
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
    if (args.letter !== "na") {
        ctx.font = PRMS.stimFont;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black";
        ctx.fillText(args.letter, 0, 5);
    }
}

const VTS = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    response_ends_trial: true,
    choices: PRMS.respKeysRH,
    trial_duration: null,
    func: drawStimulus,
    func_args: null,
    data: {
        stim_type: "vts_tcr",
        free_forced: jsPsych.timelineVariable("free_forced"),
        forced_task: jsPsych.timelineVariable("forced_task"),
    },
    on_start: function (trial) {
        "use strict";

        let dat = jsPsych.data.get().last(1).values()[0];

        trial.data.letter = "na";
        trial.data.corr_resp_letter = "na";
        trial.data.colour_more = "na";
        trial.data.corr_resp_colour = "na";

        let dot_colours = repeatArray(CANVAS_COLOUR, Math.round(PRMS.nDots));

        if (dat.selected_task == "Letter") {
            trial.data.letter = shuffle(PRMS.letters)[0];
            if (PRMS.lettersVowel.includes(trial.data.letter)) {
                trial.data.corr_resp_letter = PRMS.respKeysRH[PRMS.LetterTask.indexOf("Vokal")];
            } else if (PRMS.lettersConsonant.includes(trial.data.letter)) {
                trial.data.corr_resp_letter = PRMS.respKeysRH[PRMS.LetterTask.indexOf("Konsonant")];
            }
        } else if (dat.selected_task == "Colour") {
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
            trial.data.corr_resp_colour = PRMS.respKeysRH[PRMS.ColourTask.indexOf(trial.data.colour_more)];
        }

        trial.func_args = [
            {
                letter: trial.data.letter,
                colour_more: trial.data.colour_more,
                colours: dot_colours,
            },
        ];
    },
    on_finish: function () {
        codeTrialTaskExecution();
    },
};

function codeTrialTaskExecution() {
    "use strict";

    let dat = jsPsych.data.get().last(1).values()[0];

    // which task did they choose?
    let correct;
    let corr_code;
    let reward;
    let selected_task;
    if (dat.corr_resp_colour !== "na") {
        correct = jsPsych.pluginAPI.compareKeys(dat.corr_resp_colour, dat.key_press);
        selected_task = "Colour";
    } else if (dat.corr_resp_letter !== "na") {
        correct = jsPsych.pluginAPI.compareKeys(dat.corr_resp_letter, dat.key_press);
        selected_task = "Letter";
    }

    if (correct) {
        if (Math.random() < 0.5) {
            corr_code = 1;
            reward = true;
        } else {
            corr_code = 2;
            reward = false;
        }
    } else {
        corr_code = 3;
        reward = false;
    }

    jsPsych.data.addDataToLastTrial({
        date: Date(),
        selected_task: selected_task,
        corrCode: corr_code,
        reward: reward,
        trial_phase: "task_execution",
        block_num: PRMS.cBlk,
        trial_num: PRMS.cTrl,
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
        if (dat.corrCode === 3) {
            trial.trial_duration = PRMS.feedbackDur[dat.corrCode - 1];
            trial.stimulus =
                generate_formatted_html({
                    text: PRMS.fbText[dat.corrCode - 1],
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
    let ctx = document.getElementById("canvas").getContext("2d");
    console.log(args);

    // draw text
    ctx.font = PRMS.fbFont;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "black";

    ctx.fillText(PRMS.fbText[args.corrCode - 1], 0, 100);

    // draw image
    let img = new Image();

    if (args.corrCode === 1) {
        img.src = IMAGES[1];
    } else if (args.corrCode === 2) {
        img.src = IMAGES[0];
    } else if (args.corrCode === 3) {
        img.src = IMAGES[3];
    }

    // draw image
    const size = PRMS.rewardImageScale;
    const width = img.width;
    const height = img.height;
    ctx.drawImage(img, -width / size / 2, -height / size / 2 - 50, width / size, height / size);
}

const TRIAL_REWARD = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    response_ends_trial: false,
    trial_duration: null,
    func: drawReward,
    func_args: null,
    on_start: function (trial) {
        let dat = jsPsych.data.get().last(1).values()[0];
        trial.trial_duration = PRMS.feedbackDur[dat.corrCode - 1];
        trial.func_args = [{ corrCode: dat.corrCode }];
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
const TRIAL_TABLE = [
    { free_forced: 'free',   forced_task: 'na' },
    { free_forced: 'free',   forced_task: 'na' },
    { free_forced: 'forced', forced_task: 'Letter' },
    { free_forced: 'forced', forced_task: 'Colour' },
];

// prettier-ignore
const TRIAL_TIMELINE = {
    timeline: [TASK_CHOICE_SELECTION, TASK_CHOICE_FEEDBACK, VTS, TRIAL_REWARD, ITI],
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
    jsPsych.data.addProperties({ vp_num: VP_NUM });
    //saveData("/Common/write_data.php", `${DIR_NAME}data/${EXP_NAME}_${VP_NUM}`, {
    //    stim_type: "vts_tcr",
    //});
    saveDataLocal(`${DIR_NAME}data/${EXP_NAME}_${VP_NUM}`, { stim_type: "vts_tcr" });
}

const SAVE_DATA = {
    type: jsPsychCallFunction,
    func: save,
    post_trial_gap: 3000,
};

function save_blockwise() {
    jsPsych.data.addProperties({ vpNum: VP_NUM });
    saveData("/Common/write_data.php", `${DIR_NAME}data/blockwise/${EXP_NAME}_${VP_NUM}`, {
        stim_type: "vts_tcr",
    });
}

const SAVE_DATA_BLOCKWISE = {
    type: jsPsychCallFunction,
    func: save_blockwise,
    post_trial_gap: 1000,
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
    "use strict";

    let exp = [];

    // setup
    exp.push(fullscreen(true));
    exp.push(browser_check(PRMS.screenRes));
    exp.push(resize_browser());
    exp.push(welcome_message());
    exp.push(vpInfoForm("/Common7+/vpInfoForm_de.html"));
    exp.push(mouseCursor(false));

    exp.push(COUNT_DOTS);
    exp.push(PRELOAD);

    // instructions
    exp.push(WELCOME_INSTRUCTIONS);
    exp.push(TASK_INSTRUCTIONS1);
    exp.push(TASK_INSTRUCTIONS2);
    exp.push(TASK_INSTRUCTIONS3);
    exp.push(TASK_INSTRUCTIONS4);

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
        exp.push(SAVE_DATA_BLOCKWISE);
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
