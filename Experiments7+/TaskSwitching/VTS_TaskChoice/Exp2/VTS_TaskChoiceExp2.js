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

const jsPsych = initJsPsych({
    on_finish: function () {
        window.location.assign(
            "https://uni-tuebingen.sona-systems.com/webstudy_credit.aspx?experiment_id=138&credit_token=bc4d282bd626463f8acd249ceb8f145f&survey_code=" +
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
    screen_res: [960, 720], // minimum screen resolution requested
    n_trials: 80, // number of trials per block
    n_blocks: 8, // number of blocks
    fixSize: 15, // duration of the fixation cross
    fixWidth: 5, // size of fixation cross
    task_selection_duration: 500, // duration of the task selection screen
    feedback_text: ["Correct! +10 points!", "Correct! But no points!", "Error! No points!"],
    iti: 500, // duration of the inter-trial-interval
    feedback_duration: [750, 750, 750], // duration of the reward screen
    stimulus_font: "110px Arial",
    feedback_font: "40px Arial",
    letters: ["A", "E", "I", "U", "G", "T", "M", "R"],
    letters_vowels: ["A", "E", "I", "U"],
    letters_consonant: ["G", "T", "M", "R"],
    task_side: ["Letter", "Colour"],
    Colour_task: shuffle(["mehr Blau", "mehr Rot"]),
    Letter_task: shuffle(["Vokal", "Konsonant"]),
    colours: ["rgba(0, 0, 255, 0.9)", "rgba(255, 0, 0, 0.9)"],
    ratio_normal: 80,
    response_keys_lh: ["S", "D"],
    response_keys_rh: ["K", "L"],
    dot_radius: 1.5,
    dot_eccentricity: 100,
    dot_gap: 4,
    dot_blank: 12,
    task_choice_pos_x: 150,
    task_choice_image_scale: 10,
    reward_image_scale: 8,
    block: 1,
    trial: 1,
};

function calculate_number_of_dots() {
    // required for ratio manipulation
    PRMS.n_dots = 0;
    for (let rows = -PRMS.dot_eccentricity; rows <= PRMS.dot_eccentricity; rows += PRMS.dot_gap) {
        for (let cols = -PRMS.dot_eccentricity; cols <= PRMS.dot_eccentricity; cols += PRMS.dot_gap) {
            if (
                (rows > -PRMS.dot_gap * PRMS.dot_blank) &
                (rows < PRMS.dot_gap * PRMS.dot_blank) &
                (cols > -PRMS.dot_gap * PRMS.dot_blank) &
                (cols < PRMS.dot_gap * PRMS.dot_blank)
            ) {
                continue;
            }
            PRMS.n_dots += 1;
        }
    }
}

const COUNT_DOTS = {
    type: jsPsychCallFunction,
    func: calculate_number_of_dots,
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
              Auswahl der Aufgabe = Linke Hand: Bitte platziere hierzu den Mittelfinger und Zeigefinger auf den Tasten "S" und "D".<br><br> 
              Bearbeitung der Aufgabe = Rechte Hand: Bitte platziere hierzu den Zeigefinger und Mittelfinger auf den Tasten "K" und "L".<br><br><br>
              Drücke die "G"-Taste, um fortzufahren!`,
        align: "left",
        fontsize: 30,
        width: "1200px",
        lineheight: 1.5,
    }),
    choices: ["G"],
};

// TO DO: move to separate CSS file?
const RESPONSE_MAPPING = `<html>
<head>
   <style>
      .container {
	background-color: ${CANVAS_COLOUR};
	width: 1000px;
	margin: 10px auto;
	display: grid;
	grid-template-rows: 50px 100px 20px 80px;
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
	<div class="itemL item--3">Linke Aufgabe<br>${PRMS.response_keys_lh[0]}</div>
	<div class="itemL item--4">Rechte Aufgabe<br>${PRMS.response_keys_lh[1]}</div>
	<div class="itemR item--6">${PRMS.task_side[0]}-Aufgabe:<br>${PRMS[PRMS.task_side[0] + "_task"][0]} ${"&emsp;".repeat(
    2,
)}${PRMS[PRMS.task_side[0] + "_task"][1]}<br>${PRMS.response_keys_rh[0]} ${"&emsp;".repeat(5)}${
    PRMS.response_keys_rh[1]
}<br></div>
<div class="itemR item--11">${PRMS.task_side[1]}-Aufgabe:<br>${PRMS[PRMS.task_side[1] + "_task"][0]} ${"&emsp;".repeat(
    2,
)}${PRMS[PRMS.task_side[1] + "_task"][1]}<br>${PRMS.response_keys_rh[0]} ${"&emsp;".repeat(5)} ${
    PRMS.response_keys_rh[1]
}<br></div>
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
        RESPONSE_MAPPING +
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
           Je mehr Punkte Du gewinnst, desto kürzer wird das Experiment! Du erfährst nach dem ${PRMS.n_blocks}. Block, wie viele der restlichen Blöcke aufgrund deiner Punktzahl wegfallen.<br><br>
           Des Weiteren werden die 15% aller Personen mit den höchsten Gesamtpunktzahlen einen 10€ Gutschein von Osiander oder der deutschen Bahn erhalten.<br><br>
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
                text: `Start Block ${PRMS.block} von ${PRMS.n_blocks + 3}<br><br>
                       Wähle selbst, welche Aufgabe du bearbeiten willst, wenn beide Aufgaben verfügbar sind. Wähle und bearbeite sonst die Aufgabe, die präsentiert ist.<br><br>`,
                align: "left",
                fontsize: 30,
                width: "1200px",
                lineheight: 1.5,
            }) +
            RESPONSE_MAPPING +
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
        let n_reward = dat.select("reward").values.filter(function (x) {
            return x === true;
        }).length;
        trial.stimulus = generate_formatted_html({
            text: `Ende Block ${PRMS.block} von ${PRMS.n_blocks + 3}<br><br>
             Dein aktueller Punktestand beträgt: ${n_reward * 10}! <br><br>
             Kurze Pause.<br><br>
             Wenn Du bereit für den nächsten Block bist, dann drücke eine beliebige Taste.`,
            align: "left",
            fontsize: 30,
            width: "1200px",
            lineheight: 1.5,
        });
    },
    on_finish: function () {
        PRMS.block += 1;
        PRMS.trial = 1;
    },
};

const IMAGES = [`images/Correct_NORew.JPG`, `images/CorrectReward.JPG`, `images/CueBox.JPG`, `images/Error.JPG`];

const PRELOAD = {
    type: jsPsychPreload,
    images: IMAGES,
};

function draw_task_choice(args) {
    let ctx = document.getElementById("canvas").getContext("2d");

    // draw fixation cross
    ctx.lineWidth = PRMS.fixWidth;
    ctx.moveTo(-PRMS.fixSize, 0);
    ctx.lineTo(PRMS.fixSize, 0);
    ctx.stroke();
    ctx.moveTo(0, -PRMS.fixSize);
    ctx.lineTo(0, PRMS.fixSize);
    ctx.stroke();

    // draw text
    ctx.font = PRMS.feedback_font;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "black";
    ctx.font = "50px Arial";

    let draw_image = [false, false];
    let draw_text = [false, false];

    if (args.free_forced == "free") {
        draw_text = [1, 1];
        draw_image = [true, true];
    } else if (args.free_forced == "forced") {
        draw_text[PRMS.task_side.indexOf(args.forced_task)] = true;
        draw_image[PRMS.task_side.indexOf(args.forced_task)] = true;
    }

    // image
    let img = new Image();
    img.src = IMAGES[2];
    const size = PRMS.task_choice_image_scale;
    const width = img.width;
    const height = img.height;

    if (draw_image[0]) {
        ctx.drawImage(img, -width / size / 2 - PRMS.task_choice_pos_x, -height / size / 2, width / size, height / size);
    }
    if (draw_image[1]) {
        ctx.drawImage(img, -width / size / 2 + PRMS.task_choice_pos_x, -height / size / 2, width / size, height / size);
    }

    // rectangle
    if (args.draw_rectangle) {
        let dat = jsPsych.data.get().last(1).values()[0];
        ctx.beginPath();
        ctx.lineWidth = 10;
        if (dat.key_press == PRMS.response_keys_lh[0].toLowerCase()) {
            ctx.rect(-width / size / 2 - PRMS.task_choice_pos_x, -height / size / 2, width / size, height / size);
        } else if (dat.key_press == PRMS.response_keys_lh[1].toLowerCase()) {
            ctx.rect(-width / size / 2 + PRMS.task_choice_pos_x, -height / size / 2, width / size, height / size);
        }
        ctx.stroke();
    }

    // text
    if (draw_text[0]) {
        ctx.fillText(PRMS.task_side[0], -PRMS.task_choice_pos_x, 35);
    }
    if (draw_text[1]) {
        ctx.fillText(PRMS.task_side[1], PRMS.task_choice_pos_x, 35);
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
    func: draw_task_choice,
    func_args: null,
    data: {
        stim_type: "vts",
        free_forced: jsPsych.timelineVariable("free_forced"),
        forced_task: jsPsych.timelineVariable("forced_task"),
    },
    on_start: function (trial) {
        "use strict";

        // shuffle trial-by-trial basis of task selection side
        shuffle(PRMS.task_side);

        if (trial.data.free_forced == "free") {
            trial.choices = PRMS.response_keys_lh;
        } else if (trial.data.free_forced == "forced") {
            trial.choices = [PRMS.response_keys_lh[PRMS.task_side.indexOf(trial.data.forced_task)]];
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
    trial_duration: PRMS.task_selection_duration,
    func: draw_task_choice,
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
        code_trial_task_selection();
    },
};

function code_trial_task_selection() {
    "use strict";

    let dat = jsPsych.data.get().last(2).values()[0];

    // Which task did they choose?
    let selected_task;
    if (dat.key_press == PRMS.response_keys_lh[0].toLowerCase()) {
        selected_task = PRMS.task_side[0];
    } else if (dat.key_press == PRMS.response_keys_lh[1].toLowerCase()) {
        selected_task = PRMS.task_side[1];
    }

    jsPsych.data.addDataToLastTrial({
        date: Date(),
        selected_task: selected_task,
        rt: dat.rt,
        key_press: dat.key_press,
        corrCode: 1,
        reward: false,
        trial_phase: "task_selection",
        block_num: PRMS.block,
        trial_num: PRMS.trial,
        letter: "na",
        corr_resp_letter: "na",
        colour_more: "na",
        corr_resp_colour: "na",
    });
}

function draw_stimulus(args) {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");

    // draw colour dots
    let radius = PRMS.dot_radius;
    let idx = 0;
    for (let rows = -PRMS.dot_eccentricity; rows <= PRMS.dot_eccentricity; rows += PRMS.dot_gap) {
        for (let cols = -PRMS.dot_eccentricity; cols <= PRMS.dot_eccentricity; cols += PRMS.dot_gap) {
            if (
                (rows > -PRMS.dot_gap * PRMS.dot_blank) &
                (rows < PRMS.dot_gap * PRMS.dot_blank) &
                (cols > -PRMS.dot_gap * PRMS.dot_blank) &
                (cols < PRMS.dot_gap * PRMS.dot_blank)
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
        ctx.font = PRMS.stimulus_font;
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
    choices: PRMS.response_keys_rh,
    trial_duration: null,
    func: draw_stimulus,
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

        let dot_colours = repeatArray(CANVAS_COLOUR, Math.round(PRMS.n_dots));

        if (dat.selected_task == "Letter") {
            trial.data.letter = shuffle(PRMS.letters)[0];
            if (PRMS.letters_vowels.includes(trial.data.letter)) {
                trial.data.corr_resp_letter = PRMS.response_keys_rh[PRMS.Letter_task.indexOf("Vokal")];
            } else if (PRMS.letters_consonant.includes(trial.data.letter)) {
                trial.data.corr_resp_letter = PRMS.response_keys_rh[PRMS.Letter_task.indexOf("Konsonant")];
            }
        } else if (dat.selected_task == "Colour") {
            let ratio = PRMS.ratio_normal;
            trial.data.colour_more = shuffle(["mehr Blau", "mehr Rot"])[0];
            let colour_order;
            if (trial.data.colour_more === "mehr Blau") {
                colour_order = [0, 1];
            } else if (trial.data.colour_more === "mehr Rot") {
                colour_order = [1, 0];
            }
            dot_colours = shuffle(
                repeatArray(PRMS.colours[colour_order[0]], Math.round(PRMS.n_dots * (ratio / 100))).concat(
                    repeatArray(PRMS.colours[colour_order[1]], Math.round((PRMS.n_dots * (100 - ratio)) / 100)),
                ),
            );
            trial.data.corr_resp_colour = PRMS.response_keys_rh[PRMS.Colour_task.indexOf(trial.data.colour_more)];
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
        code_trial_task_execution();
    },
};

function code_trial_task_execution() {
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
        block_num: PRMS.block,
        trial_num: PRMS.trial,
    });

    PRMS.trial += 1;
}

function draw_reward(args) {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");
    console.log(args);

    // draw text
    ctx.font = PRMS.feedback_font;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "black";

    ctx.fillText(PRMS.feedback_text[args.corrCode - 1], 0, 100);

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
    const size = PRMS.reward_image_scale;
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
    func: draw_reward,
    func_args: null,
    on_start: function (trial) {
        let dat = jsPsych.data.get().last(1).values()[0];
        trial.trial_duration = PRMS.feedback_duration[dat.corrCode - 1];
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

const TRIAL_TIMELINE = {
    timeline: [TASK_CHOICE_SELECTION, TASK_CHOICE_FEEDBACK, VTS, TRIAL_REWARD, ITI],
    timeline_variables: TRIAL_TABLE,
};

////////////////////////////////////////////////////////////////////////
//                           Questionnaires                           //
////////////////////////////////////////////////////////////////////////
const SCALE1 = ["Trifft gar nicht zu", "", "", "", "Trifft voll und ganz zu"];

// prettier-ignore
const QUESTIONS1 = [
  { prompt: 'Ich habe mein Leben selbst in der Hand.',                                             name: 'q1.1', labels: SCALE1, required: true },
  { prompt: 'Wenn ich mich anstrenge, werde ich auch Erfolg haben.',                               name: 'q1.2', labels: SCALE1, required: true },
  { prompt: 'Egal ob privat oder im Beruf: Mein Leben wird zum großen Teil von anderen bestimmt.', name: 'q1.3', labels: SCALE1, required: true }, 
  { prompt: 'Meine Pläne werden oft vom Schicksal durchkreuzt.',                                   name: 'q1.4', labels: SCALE1, required: true },
];

const QUESTIONNAIRE1 = {
    type: jsPsychSurveyLikert,
    preamble:
        "Die folgenden Aussagen können mehr oder weniger auf Dich zutreffen.<br>Bitte gib bei jeder Aussage an, inwieweit diese auf Dich persönlich zutrifft.",
    questions: QUESTIONS1,
    scale_width: 400,
    button_label: "Weiter",
    post_trial_gap: 1000,
    on_finish: function () {
        let dat = jsPsych.data.get().last(1).values()[0];
        for (const [key, val] of Object.entries(dat.response)) {
            jsPsych.data.addProperties({ [key]: val + 1 });
        }
    },
};

const SCALE2 = ["gar nicht", "etwas", "sehr", "komplett"];

// prettier-ignore
const QUESTIONS2 = [
  { prompt: 'Wie sehr hattest du das Gefühl, dass die Belohnung von deiner Auswahl abhing?', name: 'q2.1', labels: SCALE2, required: true },
];

const QUESTIONNAIRE2 = {
    type: jsPsychSurveyLikert,
    questions: QUESTIONS2,
    scale_width: 400,
    button_label: "Weiter",
    post_trial_gap: 1000,
    on_finish: function () {
        let dat = jsPsych.data.get().last(1).values()[0];
        for (const [key, val] of Object.entries(dat.response)) {
            jsPsych.data.addProperties({ [key]: val + 1 });
        }
    },
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
        text: `Glückwunsch! Durch deinen Punktestand hat sich das Experiment verkürzt und ist nach ein paar
               weiteren Klicks vorbei. Wir werden dir noch einige Fragen stellen und du kannst deine
               Email-Adresse für die Gutscheinvergabe angeben. Falls Du zu den 15% Personen mit der höchsten
               Gesamtpunktzahl gehörst, kannst Du nach Abschluss der Erhebung wahlweise einen 10€ Gutschein
               von der Deutschen Bahn oder Osiander erhalten.<br><br>
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
    saveData("/Common/write_data.php", `${DIR_NAME}data/${EXP_NAME}_${VP_NUM}`, {
        stim_type: "vts_tcr",
    });
    //saveDataLocal(`${DIR_NAME}data/${EXP_NAME}_${VP_NUM}`, { stim_type: "vts_tcr" });
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
function gen_exp_seq() {
    "use strict";

    let exp = [];

    // setup
    exp.push(fullscreen(true));
    exp.push(browser_check(PRMS.screen_res));
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

    for (let blk = 0; blk < PRMS.n_blocks; blk += 1) {
        exp.push(BLOCK_START);
        let blk_timeline;
        blk_timeline = { ...TRIAL_TIMELINE };
        blk_timeline.sample = {
            type: "fixed-repetitions",
            size: PRMS.n_trials / TRIAL_TABLE.length,
        };
        exp.push(blk_timeline); // trials within a block
        if (blk < PRMS.n_blocks - 1) {
            exp.push(BLOCK_END);
        }
        exp.push(SAVE_DATA_BLOCKWISE);
    }

    // debrief
    exp.push(mouseCursor(true));
    exp.push(END_SCREEN);

    // short questionnaires
    exp.push(QUESTIONNAIRE1);
    exp.push(QUESTIONNAIRE2);

    exp.push(EMAIL_OPTION);

    // save data
    exp.push(SAVE_DATA);

    exp.push(end_message());
    exp.push(fullscreen(false));

    return exp;
}
const EXP = gen_exp_seq();

jsPsych.run(EXP);
