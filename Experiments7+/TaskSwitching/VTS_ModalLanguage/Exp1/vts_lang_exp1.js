// VTS Modal/Amodal Exp1
// B.Sc. Project: Pui Leng Choon WS2023/2024
//
// Participants presented with an auditory stimulus (1,2,3,4,6,7,8,9) spoken
// in either German (L1) or English (L2), in a male or female voice (between participants).
//
// Two tasks with two trial types: free choice vs. forced choice
// Task 1: odd/even
// Task 2: smaller/larger 5
// Task was cued by a visual target (e.g. colour1 = Task 1, colour2 = Task 2, white = free choice)
// Task was mapped to hand (random assignment) with responses within hand being
//  constant (e.g. "left finger" = odd/<5; "right finger" = even/>5)
//
// Block structure:
// Two blocks (120 trials with 60 forced trials in each task)
//    50% participants: German voice = high switch probability (75%)
//    50% participants: English voice = high switch probability (75%)
//  1 hybrid free-forced block of 80 trials
//  6 hybrid free-forced block of 160 trials
//    50% participants: German voice = high switch probability (75%)
//    50% participants: English voice = high switch probability (75%)
//
// Trial structure:
// Grey screen with central fixation cross for 500ms
// Auditory (en vs. de) number + central coloured square (white, red, blue) until response
// Correct responses -> blank inter-trial-interval for 500 ms
// Incorrect responses -> feedback "incorrect" + correct S-R mapping reminder for 2000 ms before ITI

const jsPsych = initJsPsych({});

// CANVAS
const CANVAS_COLOUR = "rgba(150, 150, 150, 1)";
const CANVAS_SIZE = [1280, 720];
const CANVAS_BORDER = "5px solid black";

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const VOICE_GENDER = shuffle(["M", "F"])[0]; // randomly selected and constant wihin single participant
const TASK_HAND_MAPPING = shuffle(["magnitude", "parity"]);
const COLOUR_TASK_MAPPING = shuffle(["Blue", "Red"]);
const TRANSLATE = { magnitude: "Kleiner/Gröser", parity: "Ungerade/Gerade", Blue: "Blaues", Red: "Rotes" };

const PRMS = {
    nblks_forced: 2,
    ntrls_forced: 16,
    nblks_hybrid: 2,
    ntrls_hybrid: 128,
    nblks: 2,
    fixation_duration: 500, // duration of fixation cross
    fixation_width: 5, // width fixation cross
    fixation_size: 20, // size of fixation
    fixation_colour: "Black", // colour of fixation cross
    calibration_duration: 1000, // interval between screens (e.g. instructions)
    wait_duration: 1000, // interval between screens (e.g. instructions)
    feedback_duration: [2000, 0], // interval between screens (e.g. instructions)
    iti: 500, // interval between screens (e.g. instructions)
    cue_size: 100,
    keys_magnitude: TASK_HAND_MAPPING[0] === "magnitude" ? ["S", "D"] : ["J", "K"],
    keys_parity: TASK_HAND_MAPPING[0] === "parity" ? ["S", "D"] : ["J", "K"],
    keys_left: ["S", "D"],
    keys_right: ["J", "K"],
    ctrl: 1, // count trials
    cblk: 1, // count blocks
};

// 2 counter balanced versions (start with near vs. far)
const VERSION = 1; // Number(jsPsych.data.urlVariables().version);
jsPsych.data.addProperties({ version: VERSION });

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const TASK_INSTRUCTIONS_1 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `Willkommen zu unserem Experiment.<br><br>
Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen. Bitte stelle sicher, 
dass du dich in einer ruhigen Umgebung befindest und genügend Zeit hast, um das Experiment durchzuführen. 
Wir bitten dich die nächsten ca. 45 Minuten
konzentriert zu arbeiten. Du wirst am Ende des Experimentes zu SONA zurückgeleitet und erhälst
somit automatisch deine VP-Stunde. Bei Fragen oder Probleme wende dich bitte an:<br><br>
pui-leng.choon@student.uni-tuebingen.de<br><br>
Drücke eine beliebige Taste, um fortzufahren.`,
        align: "left",
        color: "Black",
        fontsize: 28,
        bold: true,
        lineheight: 1.5,
    }),
};

const TASK_INSTRUCTIONS_CALIBRATION = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `ACHTUNG! Soundkalibierung:<br><br>
    Im Folgenden werden dir auditiv Tone präsentiert.
    Bitte stelle in dieser Zeit die Lautstärke deines Soundsystems so ein, dass du deutlich den Tönen horen kannst.<br><br>
    Anmerkung: Es geht immer automatisch weiter (d.h. du musst keine Taste drücken!).<br><br>
    Bereit? Drücke eine beliebige Taste, um die Töne abzuspielen!`,
        align: "left",
        color: "Black",
        fontsize: 28,
        bold: true,
        lineheight: 1.5,
    }),
};

const TASK_INSTRUCTIONS_2 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `In diesem Experiment gibt es zwei Aufgaben. Jede Aufgabe wird mit einer Hand bearbeitet.<br><br>
${TRANSLATE[TASK_HAND_MAPPING[0]]} Aufgabe = Linke Hand: Bitte platziere hierzu den Zeigefinger und Mittelfinger auf
die Tasten "${PRMS.keys_left[0]}" und "${PRMS.keys_left[1]}".<br><br>
${TRANSLATE[TASK_HAND_MAPPING[1]]} Aufgabe = Rechte Hand: Bitte platziere hierzu den Zeigefinger und Mittelfinger auf
die Tasten "${PRMS.keys_right[0]}" und "${PRMS.keys_right[1]}".<br><br>
Drücke eine beliebige Taste, um fortzufahren.`,
        align: "left",
        color: "Black",
        fontsize: 28,
        bold: true,
        lineheight: 1.5,
    }),
};

// prettier-ignore
function create_response_mapping_text() {
    let txt;
    if (COLOUR_TASK_MAPPING[0] === "Blue" && TASK_HAND_MAPPING[0] === "magnitude") {
        txt = `<span style="color:blue">Kleiner/Größer</span> ${"&emsp;".repeat(5)} <span style="color:red">Ungerade/Gerade</span><br>
                ${PRMS.keys_magnitude[0]} Taste${"&emsp;".repeat(1)} ${PRMS.keys_magnitude[1]} Taste${"&emsp;".repeat(6)}${PRMS.keys_parity[0]} Taste${"&emsp;".repeat(1)}${PRMS.keys_parity[1]} Taste`;
    } else if (COLOUR_TASK_MAPPING[0] === "Red" && TASK_HAND_MAPPING[0] === "magnitude") {
        txt = `<span style="color:red">Kleiner/Größer</span> ${"&emsp;".repeat(5)}<span style="color:blue">Ungerade/Gerade</span><br>
                ${PRMS.keys_magnitude[0]} Taste${"&emsp;".repeat(1)} ${PRMS.keys_magnitude[1]} Taste${"&emsp;".repeat(6)}${PRMS.keys_parity[0]} Taste${"&emsp;".repeat(1)}${PRMS.keys_parity[1]} Taste`;
    } else if (COLOUR_TASK_MAPPING[0] === "Blue" && TASK_HAND_MAPPING[0] === "parity") {
        txt = `<span style="color:blue">Ungerade/Gerade</span> ${"&emsp;".repeat(5)}<span style="color:red">Kleiner/Größer</span><br>
                ${PRMS.keys_parity[0]} Taste${"&emsp;".repeat(1)} ${PRMS.keys_parity[1]} Taste${"&emsp;".repeat(6)}${PRMS.keys_magnitude[0]} Taste${"&emsp;".repeat(1)}${PRMS.keys_magnitude[1]} Taste`;
    } else if (COLOUR_TASK_MAPPING[0] === "Red" && TASK_HAND_MAPPING[0] === "parity") {
        txt = `<span style="color:red">Ungerade/Gerade</span> ${"&emsp;".repeat(5)}<span style="color:blue">Kleiner/Größer</span><br>
                ${PRMS.keys_parity[0]} Taste${"&emsp;".repeat(1)} ${PRMS.keys_parity[1]} Taste${"&emsp;".repeat(6)}${PRMS.keys_magnitude[0]} Taste${"&emsp;".repeat(1)}${PRMS.keys_magnitude[1]} Taste`;
    }

    return generate_formatted_html({
        text: txt,
        align: "center",
        color: "Black",
        fontsize: 28,
        bold: true,
        lineheight: 1.5,
    });

}

const RESP_MAPPING = create_response_mapping_text();

const TASK_INSTRUCTIONS_3 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus:
        generate_formatted_html({
            text: `In jedem Durchgang hörst du eine Zahl in Deutsch oder Englisch.<br><br>
Für die Kleiner/Größer Aufgabe musst du entscheiden, ob die Zahl größer oder kleiner als 5 ist.<br><br>
Für die Ungerade/Gerade Aufgabe musst du entscheiden, ob die Zahl eine gerade oder ungerade Zahl
ist. Es gilt:<br>`,
            align: "left",
            color: "Black",
            fontsize: 28,
            bold: true,
            lineheight: 1.5,
        }) +
        RESP_MAPPING +
        generate_formatted_html({
            text: `Drücke eine beliebige Taste, um fortzufahren.<br><br>`,
            align: "left",
            color: "Black",
            fontsize: 28,
            bold: true,
            lineheight: 1.5,
        }),
};

// prettier-ignore
const TASK_INSTRUCTIONS_4 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `In jedem Durchgang muss nur EINE Aufgabe bearbeitet werden.<br>
Die Farbe eines Quadrates in der Mitte des Bildschirms zeigt dir an welche Aufgabe bearbeitet werden muss:<br><br>
<span style="color:${COLOUR_TASK_MAPPING[0]}">${TRANSLATE[COLOUR_TASK_MAPPING[0]]} Quadrat → ${TRANSLATE[TASK_HAND_MAPPING[0]]} Aufgabe</span><br>
<span style="color:${COLOUR_TASK_MAPPING[1]}">${TRANSLATE[COLOUR_TASK_MAPPING[1]]} Quadrat → ${TRANSLATE[TASK_HAND_MAPPING[1]]} Aufgabe</span><br><br>
Drücke eine beliebige Taste, um fortzufahren.`,
        align: "left",
        color: "Black",
        fontsize: 28,
        bold: true,
        lineheight: 1.5,
    }),
};

const TASK_INSTRUCTIONS_5 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus:
        generate_formatted_html({
            text: `In manchen Durchgängen ist das Quadrat in der Mitte des Bildschirms <span style="color:white">weiß</span>. In dem Fall kannst du
frei entscheiden welche Aufgabe (Kleiner/Gröser oder Ungerade/Gerade) du bearbeiten willst.
Verwende hierfür einfach die jeweilige Taste:<br><br>`,
            align: "left",
            color: "Black",
            fontsize: 28,
            bold: true,
            lineheight: 1.5,
        }) +
        RESP_MAPPING +
        generate_formatted_html({
            text: `Drücke eine beliebige Taste, um fortzufahren`,
            align: "left",
            color: "Black",
            fontsize: 28,
            bold: true,
            lineheight: 1.5,
        }),
};

const AUDITORY_STIMULI = [
    "./tones/DE_F_1.mp3",
    "./tones/DE_F_2.mp3",
    "./tones/DE_F_3.mp3",
    "./tones/DE_F_4.mp3",
    "./tones/DE_F_6.mp3",
    "./tones/DE_F_7.mp3",
    "./tones/DE_F_8.mp3",
    "./tones/DE_F_9.mp3",
    "./tones/DE_M_1.mp3",
    "./tones/DE_M_2.mp3",
    "./tones/DE_M_3.mp3",
    "./tones/DE_M_4.mp3",
    "./tones/DE_M_6.mp3",
    "./tones/DE_M_7.mp3",
    "./tones/DE_M_8.mp3",
    "./tones/DE_M_9.mp3",
    "./tones/EN_F_1.mp3",
    "./tones/EN_F_2.mp3",
    "./tones/EN_F_3.mp3",
    "./tones/EN_F_4.mp3",
    "./tones/EN_F_6.mp3",
    "./tones/EN_F_7.mp3",
    "./tones/EN_F_8.mp3",
    "./tones/EN_F_9.mp3",
    "./tones/EN_M_1.mp3",
    "./tones/EN_M_2.mp3",
    "./tones/EN_M_3.mp3",
    "./tones/EN_M_4.mp3",
    "./tones/EN_M_6.mp3",
    "./tones/EN_M_7.mp3",
    "./tones/EN_M_8.mp3",
    "./tones/EN_M_9.mp3",
];

const PRELOAD = {
    type: jsPsychPreload,
    audio: AUDITORY_STIMULI,
};

function create_trial_table_auditory_calibrartion() {
    auditory_files = [];
    for (let i = 0; i < AUDITORY_STIMULI.length; i++) {
        auditory_files.push({ audio: AUDITORY_STIMULI[i] });
    }
    return auditory_files;
}

const TRIALS_CALIBRATION = create_trial_table_auditory_calibrartion();

function draw_note() {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");
    ctx.textBaseline = "middle";
    ctx.font = "100px monospace";
    ctx.strokeText("\u{1F3A7}", -50, 0); // unicode symbol for headphones + sound
}

const AUDIO_CALIBRATION = {
    type: jsPsychStaticCanvasSoundKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    sound: jsPsych.timelineVariable("audio"),
    trial_duration: PRMS.calibration_duration,
    func: draw_note, // some visual feedback
};

const WAIT_BLANK = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    trial_duration: PRMS.wait_duration,
    response_ends_trial: false,
};

const TRIAL_TIMELINE_CALIBRATION = {
    timeline: [AUDIO_CALIBRATION, WAIT_BLANK],
    timeline_variables: TRIALS_CALIBRATION,
    sample: {
        type: "fixed-repetitions",
        size: 1,
    },
};

function draw_fixation() {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");
    ctx.strokeStyle = PRMS.fixation_colour;
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
    func: draw_fixation,
};

function draw_task_cue(args) {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");
    ctx.fillStyle = args.task_cue_colour;
    ctx.fillRect(-PRMS.cue_size / 2, -PRMS.cue_size / 2, PRMS.cue_size, PRMS.cue_size);
}

const SOUND_STIMULUS = {
    type: jsPsychStaticCanvasSoundKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    sound: null,
    trial_duration: 0,
    response_ends_trial: false,
    on_start: function (trial) {
        let language;
        let sound_file;
        let repetition_switch;
        if (PRMS.ctrl === 1) {
            // first trial of every block
            repetition_switch = "na";
            language = shuffle(["DE", "EN"])[0];
            sound_file = `./tones/${language}_${VOICE_GENDER}_${jsPsych.timelineVariable("number")}.mp3`;
        } else {
            let dat = jsPsych.data.get().last(3).values()[0];
            repetition_switch = dat.task === jsPsych.timelineVariable("task") ? "rep" : "switch";
            if (VERSION === 1) {
                if (repetition_switch === "rep") {
                    language = Math.random() <= 0.75 ? "DE" : "EN";
                } else if (repetition_switch === "switch") {
                    language = Math.random() <= 0.25 ? "DE" : "EN";
                }
            } else if (VERSION === 2) {
                if (repetition_switch === "rep") {
                    language = Math.random() <= 0.75 ? "EN" : "DE";
                } else if (repetition_switch === "switch") {
                    language = Math.random() <= 0.25 ? "EN" : "DE";
                }
            }
            sound_file = `./tones/${language}_${VOICE_GENDER}_${jsPsych.timelineVariable("number")}.mp3`;
        }
        trial.sound = sound_file;
        trial.data = {
            sound_file: sound_file,
            repetition_switch: repetition_switch,
        };
    },
};

function code_trial() {
    "use strict";

    let dat = jsPsych.data.get().last(2).values()[0];
    let repetition_switch = dat.repetition_switch;

    dat = jsPsych.data.get().last(1).values()[0];
    let correct = jsPsych.pluginAPI.compareKeys(dat.key_press, dat.correct_key) ? 1 : 0;

    jsPsych.data.addDataToLastTrial({
        date: Date(),
        blockNum: PRMS.cblk,
        trialNum: PRMS.ctrl,
        repetition_switch: repetition_switch,
        correct: correct,
    });
}

const TASK_CUE_STIMULUS = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    response_ends_trial: true,
    trial_duration: null,
    choices: null,
    func: draw_task_cue,
    func_args: null,
    data: {
        stim_type: "stcs",
        task: jsPsych.timelineVariable("task"),
        task_cue: jsPsych.timelineVariable("task_cue"),
        correct_key: jsPsych.timelineVariable("correct_key"),
    },
    on_start: function (trial) {
        trial.choices = jsPsych.timelineVariable("task") === "magnitude" ? PRMS.keys_magnitude : PRMS.keys_parity;
        trial.func_args = [{ task_cue_colour: jsPsych.timelineVariable("task_cue") }];
    },
    on_finish: function () {
        code_trial();
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
        trial.trial_duration = PRMS.feedback_duration[dat.correct];
        if (dat.correct !== 1) {
            trial.stimulus =
                generate_formatted_html({
                    text: "FALSCH!",
                    align: "center",
                    fontsize: 30,
                    bold: true,
                }) +
                generate_formatted_html({
                    text: create_response_mapping_text(),
                    align: "center",
                    fontsize: 30,
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

function create_trial_table_forced_block() {
    trials = [];
    let stimuli = [1, 2, 3, 4, 6, 7, 8, 9];
    let correct_key;
    for (let i = 0; i < stimuli.length; i++) {
        for (let j = 0; j < TASK_HAND_MAPPING.length; j++) {
            if (TASK_HAND_MAPPING[j] === "magnitude") {
                correct_key = stimuli[i] < 5 ? PRMS.keys_magnitude[0] : PRMS.keys_magnitude[1];
            } else if (TASK_HAND_MAPPING[j] === "parity") {
                correct_key = [1, 3, 7, 9].includes(stimuli[i]) ? PRMS.keys_parity[0] : PRMS.keys_parity[1];
            }
            trials.push({
                task_type: "forced",
                task: TASK_HAND_MAPPING[j],
                task_cue: COLOUR_TASK_MAPPING[j],
                number: stimuli[i],
                correct_key: correct_key,
            });
        }
    }
    return trials;
}
const TRIAL_TABLE_FORCED = create_trial_table_forced_block();
console.table(TRIAL_TABLE_FORCED);

const BLOCK_FEEDBACK = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    response_ends_trial: true,
    on_start: function (trial) {
        let block_dvs = calculateBlockPerformance({
            filter_options: { stim_type: "stcs", blockNum: PRMS.cblk },
            corrColumn: "correct",
        });
        let text = blockFeedbackText(PRMS.cblk, PRMS.nblks, block_dvs.meanRt, block_dvs.errorRate, (language = "de"));
        trial.stimulus = `<div style="font-size:${PRMS.fbTxtSizeBlock}px;">${text}</div>`;
    },
    on_finish: function () {
        PRMS.ctrl = 1;
        PRMS.cblk += 1;
    },
};

// prettier-ignore
const TRIAL_TIMELINE_FORCED = {
  timeline: [FIXATION_CROSS, SOUND_STIMULUS, TASK_CUE_STIMULUS, TRIAL_FEEDBACK, ITI],
  timeline_variables: TRIAL_TABLE_FORCED,
  sample: {
    type: "fixed-repetitions",
    size: PRMS.ntrls_forced / TRIAL_TABLE_FORCED.length,
  }
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
    "use strict";

    let exp = [];

    exp.push(fullscreen(true));
    exp.push(browser_check(CANVAS_SIZE));
    exp.push(PRELOAD);
    exp.push(resize_browser());
    exp.push(welcome_message());
    exp.push(vpInfoForm("/Common7+/vpInfoForm_de.html"));
    exp.push(mouseCursor(false));

    // audio calibration
    exp.push(TASK_INSTRUCTIONS_CALIBRATION);
    exp.push(TRIAL_TIMELINE_CALIBRATION);

    // instructions
    exp.push(TASK_INSTRUCTIONS_1);
    exp.push(TASK_INSTRUCTIONS_2);
    exp.push(TASK_INSTRUCTIONS_3);
    exp.push(TASK_INSTRUCTIONS_4);
    exp.push(TASK_INSTRUCTIONS_5);

    for (let blk = 0; blk < PRMS.nblks_forced; blk += 1) {
        let blk_timeline = { ...TRIAL_TIMELINE_FORCED };
        blk_timeline.sample = {
            type: "fixed-repetitions",
            size: PRMS.ntrls_forced / TRIAL_TABLE_FORCED.length,
        };
        exp.push(blk_timeline); // trials within a block
        exp.push(BLOCK_FEEDBACK); // show previous block performance
    }

    exp.push(TRIAL_TIMELINE_FORCED);

    return exp;
}
const EXP = genExpSeq();

jsPsych.run(EXP);
