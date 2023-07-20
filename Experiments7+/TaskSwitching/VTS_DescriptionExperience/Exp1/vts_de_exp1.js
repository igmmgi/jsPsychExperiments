// VTS Description Experience
//
// Risky vs. Safe and High vs. Low(No) reward are represented using 4 coloured
//    squares (blue, red, green, yellow), that are presentend in the background
// For example:
// Blue = Risky-High (+40 with 80%, +0 with 20%)
// Red = Risky-Low (+40 with 20%, +0 with 80%)
// Green = Safe-High (+32 with 100%)
// Yellow = Safe-Low (+8 with 100%)
//
// Two tasks: Number task vs. Letter task
// Number task ->  less than/greater than 5 with stimuli 1,2,3,4,6,7,8,9
// Letter task ->  before M/after M with stimuli A,B,C,D,W,X,Y,Z
//
// Task side (left vs. right) is constant within a participant (counter-balanced)
// Responses made with the "Q"/"W" (left hand/left task) and the "O"/"P" (right hand/right task)
// Responses within a task were spatially compatible (e.g., < 5 "Q" or "O", after M "W" or "P")
//
// 50 % of trials are forced-choice (i.e, only one task appears)
// 50 % of trials are free-choise (i.e, both tasks appear)
// 16 different trial types (see trial table)
//
// Block structure
// 2 training/practice blocks followed by 8 experimental blocks, all 128 trials
// 1st training/practice block only presented with Safe-Low/Safe-High combinations
// 2nd training/practice block only presented with Risky-Low/Risky-High combinations
//
// Trial structure
// Fixation cross for 500 ms
// Stimulus (forced/free) until response
// Feedback screen for 750 ms
//
// Payoff scheme gain
// Risky-Low  =  20% chance of +40 or 80% chance of +0
// Risky-High =  80% chance of +40 or 20% chance of +0
// Safe-Low   = 100% chance of + 8
// Safe-High  = 100% chance of +32

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////

const jsPsych = initJsPsych({
    on_finish: function () {
        window.location.assign(
            "https://uni-tuebingen.sona-systems.com/webstudy_credit.aspx?experiment_id=233&credit_token=11d96321e1494b7d8605d5b7b3ffba8c&survey_code=" +
                jsPsych.data.urlVariables().sona_id,
        );
    },
});

const CANVAS_COLOUR = "rgba(200, 200, 200, 1)";
const CANVAS_SIZE = [1280, 720];
const CANVAS_BORDER = "5px solid black";

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////

const PRMS = {
    screen_res: [960, 720], // minimum screen resolution requested
    ntrls_training: 64, // number of trials within a block
    ntrls_exp: 120, // number of trials within a block
    nblks: 10, // number of blocks
    fixSize: 15, // duration of the fixation cross
    fixWidth: 5, // size of fixation cross
    fixDur: 400, // duration of the fixation cross
    fb_dur: 750, // feedback duration for reward
    stim_font: "100px Arial",
    stim_y_offset: 10,
    fb_font_size: 128,
    numbers: [1, 2, 3, 4, 6, 7, 8, 9],
    numbers_small: [1, 2, 3, 4],
    numbers_large: [6, 7, 8, 9],
    letters: ["A", "B", "C", "D", "W", "X", "Y", "Z"],
    letters_before: ["A", "B", "C", "D"],
    letters_after: ["W", "X", "Y", "Z"],
    resp_keys_left: ["Q", "W"],
    resp_keys_right: ["O", "P"],
    rect_width: 100,
    rect_height: 100,
    rect_offset: 10,
};

const VTS_DATA = {
    ctrl: 1,
    cblk: 1,
    previous_task: "na",
    nreps: 0,
    points: 0,
};

// 2 counter balanced versions
// Version 1: number task left, letter task right
// Version 2: letter task left, number task right
const VERSION = Number(jsPsych.data.urlVariables().version);
jsPsych.data.addProperties({ version: VERSION });

// Have order relate to condition
// Risky-Low -> Risky-High -> Safe-Low -> Safe-High
const COLOURS = shuffle(["Red", "Blue", "Green", "Yellow"]);

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
           um das Experiment durchzuführen. Wir bitten dich die ca. nächsten 35 Minuten konzentriert zu arbeiten.<br><br>
           Bei Fragen oder Problemen wende dich bitte an:<br><br>
           lis.fischer@student.uni-tuebingen.de<br><br>
           Drücke eine beliebige Taste, um fortzufahren`,
        align: "left",
        fontsize: 30,
        width: "1200px",
        bold: true,
        lineheight: 1.5,
    }),
};

function task_instructions1() {
    if (VERSION === 1) {
        return generate_formatted_html({
            text: `In diesem Experiment gibt es zwei Aufgaben. Jede Aufgabe wird mit einer Hand bearbeitet.<br><br>
             Zahlenaufgabe = Linke Hand: Bitte platziere hierzu den Mittelfinger und Zeigefinger auf die Tasten „Q“ und „W“.<br><br>
             Buchstabenaufgabe = Rechte Hand: Bitte platziere hierzu den Zeigefinger und Mittelfinger auf die Tasten „O“ und „P“.<br><br>
             Drücke eine beliebige Taste, um fortzufahren`,
            align: "left",
            fontsize: 30,
            width: "1200px",
            lineheight: 1.5,
            bold: true,
        });
    } else if (VERSION === 2) {
        return generate_formatted_html({
            text: `In diesem Experiment gibt es zwei Aufgaben. Jede Aufgabe wird mit einer Hand bearbeitet.<br><br>
             Buchstabenaufgabe = Linke Hand: Bitte platziere hierzu den Mittelfinger und Zeigefinger auf die Tasten „Q“ und „W“.<br><br>
             Zahlenaufgabe = Rechte Hand: Bitte platziere hierzu den Zeigefinger und Mittelfinger auf die Tasten „O“ und „P“.<br><br>
             Drücke eine beliebige Taste, um fortzufahren`,
            align: "left",
            fontsize: 30,
            width: "1200px",
            lineheight: 1.5,
            bold: true,
        });
    }
}

const TASK_INSTRUCTIONS1 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    on_start: function (trial) {
        trial.stimulus = task_instructions1();
    },
};

const RESPMAPPING_V1 = generate_formatted_html({
    text: `Zahlenaufgabe&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Buchstabenaufgabe<br>
          "${PRMS.resp_keys_left[0]}" (< 5) "${PRMS.resp_keys_left[1]}" (> 5) &emsp;&emsp;&emsp;&emsp; "${PRMS.resp_keys_right[0]}" (vor M) "${PRMS.resp_keys_right[1]}" (nach M)`,
    align: "center",
    fontsize: 30,
    width: "1200px",
    bold: true,
    lineheight: 1.5,
});

const RESPMAPPING_V2 = generate_formatted_html({
    text: `Buchstabenaufgabe&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Zahlenaufgabe<br>
          "${PRMS.resp_keys_left[0]}" (vor M) "${PRMS.resp_keys_left[1]}" (nach M) &emsp;&emsp;&emsp;&emsp; "${PRMS.resp_keys_right[0]}" (< 5) "${PRMS.resp_keys_right[1]}" (> 5)`,
    align: "center",
    fontsize: 30,
    width: "1200px",
    bold: true,
    lineheight: 1.5,
});

const TASK_INSTRUCTIONS_MAPPING = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    on_start: function (trial) {
        let resp_text = VERSION === 1 ? RESPMAPPING_V1 : RESPMAPPING_V2;
        trial.stimulus =
            resp_text +
            generate_formatted_html({
                text: `Drücke eine beliebige Taste, um fortzufahren.`,
                align: "center",
                fontsize: 30,
                width: "1200px",
                bold: true,
                lineheight: 1.5,
            });
    },
};

const TASK_INSTRUCTIONS2 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `In manchen Durchgängen erhälst Du Punkte, wenn die Aufgabe richtig bearbeitet wurde.<br><br>
               Dein Ziel ist es, so viele Punkte wie möglich zu sammeln.<br>
               Die 10% aller Personen mit den höchsten Gesamtpunktzahlen werden einen 10€ Gutschein von
               Osiander oder der deutschen Bahn erhalten.<br><br>
               Drücke eine beliebige Taste, um fortzufahren.`,
        align: "left",
        fontsize: 30,
        width: "1200px",
        lineheight: 1.5,
        bold: true,
    }),
};

const TASK_INSTRUCTIONS3 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `In manchen Durchgängen erhälst Du Punkte, wenn die Aufgabe richtig bearbeitet wurde.<br><br>
               Dein Ziel ist es, so viele Punkte wie möglich zu sammeln.<br>
               Die 10% aller Personen mit den höchsten Gesamtpunktzahlen werden einen 10€ Gutschein von
               Osiander oder der deutschen Bahn erhalten.<br><br>
               Drücke eine beliebige Taste, um fortzufahren.`,
        align: "left",
        fontsize: 30,
        width: "1200px",
        lineheight: 1.5,
        bold: true,
    }),
};

////////////////////////////////////////////////////////////////////////
//                      Experiment                                    //
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

function draw_stimulus(args) {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");

    // // x=0, y=0 markers
    // ctx.lineWidth = 5;
    // ctx.beginPath();
    // ctx.lineTo(0, CANVAS_SIZE[0] / 2);
    // ctx.lineTo(0, -CANVAS_SIZE[0] / 2);
    // ctx.stroke();
    // ctx.beginPath();
    // ctx.lineTo(CANVAS_SIZE[1] / 2, 0);
    // ctx.lineTo(-CANVAS_SIZE[1] / 2, 0);
    // ctx.lineTo(1000, 0);
    // ctx.lineTo(-1000, 0);
    // ctx.stroke();

    // outer frames
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.rect(0 - (PRMS.rect_width + PRMS.rect_offset), 0 - PRMS.rect_height / 2, PRMS.rect_height, PRMS.rect_width);
    ctx.rect(0 + PRMS.rect_offset, 0 - PRMS.rect_height / 2, PRMS.rect_height, PRMS.rect_width);
    ctx.stroke();

    // draw left colour rectangle and stimulus
    if (args.stim_left !== "na") {
        ctx.fillStyle = args.colour_left;
        ctx.fillRect(
            0 - (PRMS.rect_width + PRMS.rect_offset),
            0 - PRMS.rect_height / 2,
            PRMS.rect_height,
            PRMS.rect_width,
        );
        ctx.fillStyle = "Black";
        ctx.font = PRMS.stim_font;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(args.stim_left, 0 - (PRMS.rect_width / 2 + PRMS.rect_offset), PRMS.stim_y_offset);
    }

    // draw right colour rectangle and stimulus
    if (args.stim_right !== "na") {
        ctx.fillStyle = args.colour_right;
        ctx.fillRect(0 + PRMS.rect_offset, 0 - PRMS.rect_height / 2, PRMS.rect_height, PRMS.rect_width);
        ctx.fillStyle = "Black";
        ctx.font = PRMS.stim_font;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(args.stim_right, 0 + (PRMS.rect_width / 2 + PRMS.rect_offset), PRMS.stim_y_offset);
    }
}

function codeTrial() {
    "use strict";

    let dat = jsPsych.data.get().last(1).values()[0];

    // Which hand/colour did they respond with/to?
    let response_hand;
    let response_colour;
    if (PRMS.resp_keys_left.includes(dat.key_press.toUpperCase())) {
        response_hand = "left";
        response_colour = dat.colour_left;
    } else if (PRMS.resp_keys_right.includes(dat.key_press.toUpperCase())) {
        response_hand = "right";
        response_colour = dat.colour_right;
    }

    // Was response correct?
    let response_task;
    let correct = 0;
    if ((VERSION === 1 && response_hand === "left") || (VERSION === 2 && response_hand === "right")) {
        response_task = "number";
        correct = jsPsych.pluginAPI.compareKeys(dat.key_press, dat.correct_key_number) * 1;
    } else if ((VERSION === 1 && response_hand === "right") || (VERSION === 2 && response_hand === "left")) {
        response_task = "letter";
        correct = jsPsych.pluginAPI.compareKeys(dat.key_press, dat.correct_key_letter) * 1;
    }

    let colour_idx = COLOURS.indexOf(response_colour);

    // Was it a repeat or repetition of task?
    let transition = "na";
    if (VTS_DATA.previous_task !== "na") {
        transition = response_task === VTS_DATA.previous_task ? "repeat" : "switch";
    }
    VTS_DATA.nreps = transition === "repeat" ? VTS_DATA.nreps + 1 : 0;

    // Reward dependent on correct/incorerct + random colour index
    let reward = 0;
    if (correct === 1) {
        if (colour_idx === 0) {
            reward = Math.random() <= 0.2 ? 40 : 0;
        } else if (colour_idx === 1) {
            reward = Math.random() <= 0.8 ? 40 : 0;
        } else if (colour_idx === 2) {
            reward = 8;
        } else if (colour_idx === 3) {
            reward = 32;
        }
    }
    VTS_DATA.points += reward;

    // console.log("##########################");
    // console.log("Response hand: ", response_hand);
    // console.log("Response task: ", response_task);
    // console.log("Response colour: ", response_colour);
    // console.log("Colour idx: ", colour_idx);
    // console.log("Transition: ", transition);
    // console.log("Rep Counter: ", VTS_DATA.nreps);
    // console.log("RT: ", dat.rt);
    // console.log("Correct: ", correct);

    jsPsych.data.addDataToLastTrial({
        date: Date(),
        block: VTS_DATA.cblk,
        trial: VTS_DATA.ctrl,
        response_hand: response_hand,
        response_task: response_task,
        response_colour: response_colour,
        colour_idx: colour_idx,
        transition: transition,
        nresp: VTS_DATA.nreps,
        reward: reward,
        points: VTS_DATA.points,
        correct: correct,
    });

    // Update vts_data for next trial
    VTS_DATA.ctrl++;
    VTS_DATA.previous_task = response_task;
}

const VTS = {
    type: jsPsychStaticCanvasKeyboardResponse,
    stimulus: "VTS",
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    response_ends_trial: true,
    choices: [],
    trial_duration: null,
    func: draw_stimulus,
    func_args: null,
    data: {
        stim: "vts_de",
        block_type: jsPsych.timelineVariable("block_type"),
        condition: jsPsych.timelineVariable("condition"),
        task: jsPsych.timelineVariable("task"),
        letter_risky_safe: jsPsych.timelineVariable("letter_risky_safe"),
        number_risky_safe: jsPsych.timelineVariable("number_risky_safe"),
        letter_outcome: jsPsych.timelineVariable("letter_outcome"),
        number_outcome: jsPsych.timelineVariable("number_outcome"),
    },
    on_start: function (trial) {
        "use strict";
        // stimuli
        let [letter, number] = ["na", "na"];
        if (["both", "number"].includes(trial.data.task)) {
            number = PRMS.numbers[getRandomInt(0, PRMS.numbers.length - 1)];
        }
        if (["both", "letter"].includes(trial.data.task)) {
            letter = PRMS.letters[getRandomInt(0, PRMS.letters.length - 1)];
        }

        let [stim_left, stim_right] = ["na", "na"];
        let [colour_left, colour_right] = ["na", "na"];
        let [correct_key_number, correct_key_letter] = ["na", "na"];
        if (VERSION === 1) {
            [stim_left, stim_right] = [number, letter];
            if (PRMS.numbers_small.includes(stim_left)) {
                correct_key_number = PRMS.resp_keys_left[0];
                trial.choices = trial.choices.concat(PRMS.resp_keys_left);
            } else if (PRMS.numbers_large.includes(stim_left)) {
                correct_key_number = PRMS.resp_keys_left[1];
                trial.choices = trial.choices.concat(PRMS.resp_keys_left);
            }
            if (PRMS.letters_before.includes(stim_right)) {
                correct_key_letter = PRMS.resp_keys_right[0];
                trial.choices = trial.choices.concat(PRMS.resp_keys_right);
            } else if (PRMS.letters_after.includes(stim_right)) {
                correct_key_letter = PRMS.resp_keys_right[1];
                trial.choices = trial.choices.concat(PRMS.resp_keys_right);
            }
            if (trial.data.number_risky_safe === "risky" && trial.data.number_outcome === "low") {
                colour_left = COLOURS[0];
            } else if (trial.data.number_risky_safe === "risky" && trial.data.number_outcome === "high") {
                colour_left = COLOURS[1];
            } else if (trial.data.number_risky_safe === "safe" && trial.data.number_outcome === "low") {
                colour_left = COLOURS[2];
            } else if (trial.data.number_risky_safe === "safe" && trial.data.number_outcome === "high") {
                colour_left = COLOURS[3];
            }
            if (trial.data.letter_risky_safe === "risky" && trial.data.letter_outcome === "low") {
                colour_right = COLOURS[0];
            } else if (trial.data.letter_risky_safe === "risky" && trial.data.letter_outcome === "high") {
                colour_right = COLOURS[1];
            } else if (trial.data.letter_risky_safe === "safe" && trial.data.letter_outcome === "low") {
                colour_right = COLOURS[2];
            } else if (trial.data.letter_risky_safe === "safe" && trial.data.letter_outcome === "high") {
                colour_right = COLOURS[3];
            }
        } else if (VERSION === 2) {
            [stim_left, stim_right] = [letter, number];
            if (PRMS.numbers_small.includes(stim_right)) {
                correct_key_number = PRMS.resp_keys_right[0];
                trial.choices = trial.choices.concat(PRMS.resp_keys_right);
            } else if (PRMS.numbers_large.includes(stim_right)) {
                correct_key_number = PRMS.resp_keys_right[1];
                trial.choices = trial.choices.concat(PRMS.resp_keys_right);
            }
            if (PRMS.letters_before.includes(stim_left)) {
                correct_key_letter = PRMS.resp_keys_left[0];
                trial.choices = trial.choices.concat(PRMS.resp_keys_left);
            } else if (PRMS.letters_after.includes(stim_left)) {
                correct_key_letter = PRMS.resp_keys_left[1];
                trial.choices = trial.choices.concat(PRMS.resp_keys_left);
            }

            if (trial.data.number_risky_safe === "risky" && trial.data.number_outcome === "low") {
                colour_right = COLOURS[0];
            } else if (trial.data.number_risky_safe === "risky" && trial.data.number_outcome === "high") {
                colour_right = COLOURS[1];
            } else if (trial.data.number_risky_safe === "safe" && trial.data.number_outcome === "low") {
                colour_right = COLOURS[2];
            } else if (trial.data.number_risky_safe === "safe" && trial.data.number_outcome === "high") {
                colour_right = COLOURS[3];
            }
            if (trial.data.letter_risky_safe === "risky" && trial.data.letter_outcome === "low") {
                colour_left = COLOURS[0];
            } else if (trial.data.letter_risky_safe === "risky" && trial.data.letter_outcome === "high") {
                colour_left = COLOURS[1];
            } else if (trial.data.letter_risky_safe === "safe" && trial.data.letter_outcome === "low") {
                colour_left = COLOURS[2];
            } else if (trial.data.letter_risky_safe === "safe" && trial.data.letter_outcome === "high") {
                colour_left = COLOURS[3];
            }
        }

        trial.func_args = [
            { stim_left: stim_left, stim_right: stim_right, colour_left: colour_left, colour_right: colour_right },
        ];
        trial.data = {
            ...trial.data,
            letter: letter,
            number: number,
            stim_left: stim_left,
            stim_right: stim_right,
            colour_left: colour_left,
            colour_right: colour_right,
            correct_key_number: correct_key_number,
            correct_key_letter: correct_key_letter,
        };
    },
    on_finish: function () {
        codeTrial();
    },
};

// Risky-Low  =  20% chance of +40 or 80% chance of +0
// Risky-High =  80% chance of +40 or 20% chance of +0
// Safe-Low   = 100% chance of + 8
// Safe-High  = 100% chance of +32
// Risky-Low -> Risky-High -> Safe-Low -> Safe-High

const TRIAL_FEEDBACK = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    trial_duration: PRMS.fb_dur,
    response_ends_trial: false,
    on_start: function (trial) {
        let dat = jsPsych.data.get().last(1).values()[0];
        if (dat.correct === 1) {
            trial.stimulus = `<div style="font-size:${PRMS.fb_font_size}px;">+${dat.reward}</div>`;
        } else {
            trial.stimulus = `<div style="font-size:${PRMS.fb_font_size}px;">FALSCH!</div>`;
        }
    },
};

const BLOCK_START = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    on_start: function (trial) {
        let resp_text = VERSION === 1 ? RESPMAPPING_V1 : RESPMAPPING_V2;
        trial.stimulus =
            generate_formatted_html({
                text: `Start Block ${VTS_DATA.cblk} von ${PRMS.nblks}<br><br>
               Entscheide selbst welche Aufgabe du bearbeiten willst, wenn beide Aufgaben verfügbar sind. Bearbeite sonst die Aufgabe, die präsentiert ist. Es gilt:`,
                align: "left",
                fontsize: 30,
                width: "1200px",
                lineheight: 1.5,
                bold: true,
            }) +
            resp_text +
            generate_formatted_html({
                text: `Um den Block zu starten, drücke eine beliebige Taste.`,
                align: "center",
                fontsize: 30,
                width: "1200px",
                lineheight: 1.5,
                bold: true,
            });
    },
};

const BLOCK_FEEDBACK = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    trial_duration: null,
    response_ends_trial: true,
    on_start: function (trial) {
        trial.stimulus = generate_formatted_html({
            text: `Ende Block ${VTS_DATA.cblk} von ${PRMS.nblks} (Points: ${VTS_DATA.points})<br><br>
                   Drücke eine beliebige Taste um fortzufahren.`,
            align: "center",
            fontsize: 30,
            width: "1200px",
            bold: true,
            lineheight: 1.5,
        });
    },
    on_finish: function () {
        VTS_DATA.cblk++;
    },
};

// prettier-ignore
const TRIAL_TABLE_TRAINING_SAFE = [
  { block_type: "training", condition: "forced_safe",  task: "letter", letter_risky_safe: "safe",  number_risky_safe: "na",    letter_outcome: "low",  number_outcome: "na"},
  { block_type: "training", condition: "forced_safe",  task: "number", letter_risky_safe: "na",    number_risky_safe: "safe",  letter_outcome: "na",   number_outcome: "low"},
  { block_type: "training", condition: "forced_safe",  task: "letter", letter_risky_safe: "safe",  number_risky_safe: "na",    letter_outcome: "high", number_outcome: "na"},
  { block_type: "training", condition: "forced_safe",  task: "number", letter_risky_safe: "na",    number_risky_safe: "safe",  letter_outcome: "na",   number_outcome: "high"},
];
// console.table(TRIAL_TABLE_TRAINING_SAFE);

// prettier-ignore
const TRIAL_TABLE_TRAINING_RISKY = [
  { block_type: "training", condition: "forced_risky", task: "letter", letter_risky_safe: "risky", number_risky_safe: "na",    letter_outcome: "low",  number_outcome: "na"},
  { block_type: "training", condition: "forced_risky", task: "number", letter_risky_safe: "na",    number_risky_safe: "risky", letter_outcome: "na",   number_outcome: "low"},
  { block_type: "training", condition: "forced_risky", task: "letter", letter_risky_safe: "risky", number_risky_safe: "na",    letter_outcome: "high", number_outcome: "na"},
  { block_type: "training", condition: "forced_risky", task: "number", letter_risky_safe: "na",    number_risky_safe: "risky", letter_outcome: "na",   number_outcome: "high"},
];
// console.table(TRIAL_TABLE_TRAINING_RISKY);

// prettier-ignore
const TRIAL_TABLE_EXP = [
  { block_type: "exp", condition: "forced_safe",        task: "letter", letter_risky_safe: "safe",  number_risky_safe: "na",    letter_outcome: "low",  number_outcome: "na"},
  { block_type: "exp", condition: "forced_safe",        task: "number", letter_risky_safe: "na",    number_risky_safe: "safe",  letter_outcome: "na",   number_outcome: "low"},
  { block_type: "exp", condition: "forced_risky",       task: "letter", letter_risky_safe: "risky", number_risky_safe: "na",    letter_outcome: "low",  number_outcome: "na"},
  { block_type: "exp", condition: "forced_risky",       task: "number", letter_risky_safe: "na",    number_risky_safe: "risky", letter_outcome: "na",   number_outcome: "low"},
  { block_type: "exp", condition: "forced_safe",        task: "letter", letter_risky_safe: "safe",  number_risky_safe: "na",    letter_outcome: "high", number_outcome: "na"},
  { block_type: "exp", condition: "forced_safe",        task: "number", letter_risky_safe: "na",    number_risky_safe: "safe",  letter_outcome: "na",   number_outcome: "high"},
  { block_type: "exp", condition: "forced_risky",       task: "letter", letter_risky_safe: "risky", number_risky_safe: "na",    letter_outcome: "high", number_outcome: "na"},
  { block_type: "exp", condition: "forced_risky",       task: "number", letter_risky_safe: "na",    number_risky_safe: "risky", letter_outcome: "na",   number_outcome: "high"},
  { block_type: "exp", condition: "unequal_safe_risky", task: "both",   letter_risky_safe: "safe",  number_risky_safe: "risky", letter_outcome: "low",  number_outcome: "high"},
  { block_type: "exp", condition: "unequal_safe_risky", task: "both",   letter_risky_safe: "safe",  number_risky_safe: "risky", letter_outcome: "high", number_outcome: "low"},
  { block_type: "exp", condition: "unequal_safe_risky", task: "both",   letter_risky_safe: "risky", number_risky_safe: "safe",  letter_outcome: "low",  number_outcome: "high"},
  { block_type: "exp", condition: "unequal_safe_risky", task: "both",   letter_risky_safe: "risky", number_risky_safe: "safe",  letter_outcome: "high", number_outcome: "low"},
  { block_type: "exp", condition: "equal_safe_risky",   task: "both",   letter_risky_safe: "safe",  number_risky_safe: "risky", letter_outcome: "low",  number_outcome: "low"},
  { block_type: "exp", condition: "equal_safe_risky",   task: "both",   letter_risky_safe: "safe",  number_risky_safe: "risky", letter_outcome: "high", number_outcome: "high"},
  { block_type: "exp", condition: "equal_safe_risky",   task: "both",   letter_risky_safe: "risky", number_risky_safe: "safe",  letter_outcome: "low",  number_outcome: "low"},
  { block_type: "exp", condition: "equal_safe_risky",   task: "both",   letter_risky_safe: "risky", number_risky_safe: "safe",  letter_outcome: "high", number_outcome: "high"},
  { block_type: "exp", condition: "unequal_safe_risky", task: "both",   letter_risky_safe: "safe",  number_risky_safe: "risky", letter_outcome: "low",  number_outcome: "high"},
  { block_type: "exp", condition: "unequal_safe_risky", task: "both",   letter_risky_safe: "safe",  number_risky_safe: "risky", letter_outcome: "high", number_outcome: "low"},
  { block_type: "exp", condition: "unequal_safe_risky", task: "both",   letter_risky_safe: "risky", number_risky_safe: "safe",  letter_outcome: "low",  number_outcome: "high"},
  { block_type: "exp", condition: "unequal_safe_risky", task: "both",   letter_risky_safe: "risky", number_risky_safe: "safe",  letter_outcome: "high", number_outcome: "low"},
  { block_type: "exp", condition: "equal_safe_risky",   task: "both",   letter_risky_safe: "safe",  number_risky_safe: "risky", letter_outcome: "low",  number_outcome: "low"},
  { block_type: "exp", condition: "equal_safe_risky",   task: "both",   letter_risky_safe: "safe",  number_risky_safe: "risky", letter_outcome: "high", number_outcome: "high"},
  { block_type: "exp", condition: "equal_safe_risky",   task: "both",   letter_risky_safe: "risky", number_risky_safe: "safe",  letter_outcome: "low",  number_outcome: "low"},
  { block_type: "exp", condition: "equal_safe_risky",   task: "both",   letter_risky_safe: "risky", number_risky_safe: "safe",  letter_outcome: "high", number_outcome: "high"},
];
// console.table(TRIAL_TABLE_FACE_BLOCK);

const TRIAL_TIMELINE_TRAINING_SAFE = {
    timeline: [FIXATION_CROSS, VTS, TRIAL_FEEDBACK],
    timeline_variables: TRIAL_TABLE_TRAINING_SAFE,
};

const TRIAL_TIMELINE_TRAINING_RISKY = {
    timeline: [FIXATION_CROSS, VTS, TRIAL_FEEDBACK],
    timeline_variables: TRIAL_TABLE_TRAINING_RISKY,
};

const TRIAL_TIMELINE_EXP = {
    timeline: [FIXATION_CROSS, VTS, TRIAL_FEEDBACK],
    timeline_variables: TRIAL_TABLE_EXP,
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
    saveData("/Common/write_data.php", data_fn, { stim: "vts_de" });
    // saveDataLocal('/Common/write_data.php', { stim: 'vts_de' });
}

const SAVE_DATA = {
    type: jsPsychCallFunction,
    func: save,
    post_trial_gap: 3000,
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

    exp.push(WELCOME_INSTRUCTIONS);
    exp.push(TASK_INSTRUCTIONS1);
    exp.push(TASK_INSTRUCTIONS_MAPPING);
    exp.push(TASK_INSTRUCTIONS2);

    for (let blk = 0; blk < PRMS.nblks; blk++) {
        exp.push(BLOCK_START);

        let blk_timeline;
        if (blk === 0) {
            blk_timeline = { ...TRIAL_TIMELINE_TRAINING_SAFE };
        } else if (blk === 1) {
            blk_timeline = { ...TRIAL_TIMELINE_TRAINING_RISKY };
        } else {
            blk_timeline = { ...TRIAL_TIMELINE_EXP };
        }
        let ntrls = [0, 1].includes(blk) ? PRMS.ntrls_training : PRMS.ntrls_exp;
        blk_timeline.sample = {
            type: "fixed-repetitions",
            size: ntrls / blk_timeline.timeline_variables.length,
        };
        exp.push(blk_timeline); // trials within a block
        exp.push(BLOCK_FEEDBACK);
    }

    // debrief
    exp.push(mouseCursor(true));
    exp.push(END_SCREEN);
    exp.push(EMAIL_OPTION);

    // save data
    exp.push(SAVE_DATA);

    // debrief
    exp.push(mouseCursor(true));
    exp.push(end_message());
    exp.push(fullscreen(false));

    return exp;
}
const EXP = genExpSeq();

jsPsych.run(EXP);
