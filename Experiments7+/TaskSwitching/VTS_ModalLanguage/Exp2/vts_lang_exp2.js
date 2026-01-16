// VTS Modal/Amodal Exp2
//
// "The experiment was similar to Experiment 1, except for the following changes.
// First, language was no longer associated with switch probability. That is, in each block it
// was randomly determined (i.e., set at 50%) whether a forced-trial switch versus a repetition
// stimulus was spoken in English or German. Second, following Fröber et al. (2024), hybrid
// blocks consisted of 50% forced-choice trials and 50% free-choice trials. Third, we
// implemented a global switch-probability manipulation. For half of the participants, the
// switch rate in forced-choice trials was set to (approximately) 25% in the first half of the
// experiment (independent of language) and to 75% in the second half. For the remaining
// participants, this order was reversed."

const jsPsych = initJsPsych({
    // on_finish: function () {
    //     if (PRMS.cblk >= 9) {
    //         window.location.assign(
    //             "https://uni-tuebingen.sona-systems.com/webstudy_credit.aspx?experiment_id=309&credit_token=6112ac5e16454dd5a1a3ca1983dd7095&survey_code=" +
    //                 jsPsych.data.urlVariables().sona_id,
    //         );
    //     }
    // },
});

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
const TRANSLATE = { magnitude: "Kleiner/Größer", parity: "Ungerade/Gerade", Blue: "Blaues", Red: "Rotes" };

const PRMS = {
    nblks_forced: 1, // number of initial "forced" only trial blocks
    ntrls_forced: 80, // number of trials in forced blocks
    nblks_hybrid_practice: 1, // number of hybrid blocks
    ntrls_hybrid_practice: 80, // number of hybrid blocks
    nblks_hybrid: 3, // 3 * exp blocks in each exp half
    ntrls_hybrid_exp: 144,
    nblks_total: 10, // above repeated first half/second half
    fixation_duration: 500, // duration of fixation cross
    fixation_width: 5, // width fixation cross
    fixation_size: 20, // size of fixation
    fixation_colour: "Black", // colour of fixation cross
    calibration_duration: 500, // interval between screens (e.g. instructions)
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

// Track switch probability for hybrid blocks
// Version 0: 25% switch in first half, 75% in second half
// Version 1: 75% switch in first half, 25% in second half
PRMS.switch_prob_first_half = VERSION === 0 ? 0.25 : 0.75;
PRMS.switch_prob_second_half = VERSION === 0 ? 0.75 : 0.25;


////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////

const CONTINUE = {
    text: `Drücke eine beliebige Taste, um fortzufahren.`,
    align: "left",
    color: "Black",
    fontsize: 28,
    bold: true,
    lineheight: 1.5,
};

const TASK_INSTRUCTIONS_1 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus:
        generate_formatted_html({
            text: `Willkommen zu unserem Experiment.<br><br>
Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen. Bitte stelle sicher, 
dass du dich in einer ruhigen Umgebung befindest und genügend Zeit hast, um das Experiment durchzuführen. 
Wir bitten dich die nächsten ca. 45 Minuten
konzentriert zu arbeiten. Du wirst am Ende des Experimentes zu SONA zurückgeleitet und erhälst
somit automatisch deine VP-Stunde. Bei Fragen oder Probleme wende dich bitte an:<br><br>
pui-leng.choon@student.uni-tuebingen.de<br>`,
            align: "left",
            color: "Black",
            fontsize: 28,
            bold: true,
            lineheight: 1.5,
        }) + generate_formatted_html(CONTINUE),
};

const TASK_INSTRUCTIONS_CALIBRATION = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus:
        generate_formatted_html({
            text: `ACHTUNG! Soundkalibierung:<br><br>
    Im Folgenden werden dir auditiv Tone präsentiert.
    Bitte stelle in dieser Zeit die Lautstärke deines Soundsystems so ein, dass du deutlich den Tönen horen kannst.<br><br>
    Anmerkung: Es geht immer automatisch weiter (d.h. du musst keine Taste drücken!).<br><br>
    Bereit?`,
            align: "left",
            color: "Black",
            fontsize: 28,
            bold: true,
            lineheight: 1.5,
        }) + generate_formatted_html(CONTINUE),
};

const TASK_INSTRUCTIONS_2 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus:
        generate_formatted_html({
            text: `In diesem Experiment gibt es zwei Aufgaben. Jede Aufgabe wird mit einer Hand bearbeitet.<br><br>
${TRANSLATE[TASK_HAND_MAPPING[0]]} Aufgabe = Linke Hand: Bitte platziere hierzu den Zeigefinger und Mittelfinger auf
die Tasten "${PRMS.keys_left[0]}" und "${PRMS.keys_left[1]}".<br><br>
${TRANSLATE[TASK_HAND_MAPPING[1]]} Aufgabe = Rechte Hand: Bitte platziere hierzu den Zeigefinger und Mittelfinger auf
die Tasten "${PRMS.keys_right[0]}" und "${PRMS.keys_right[1]}".<br><br>`,
            align: "left",
            color: "Black",
            fontsize: 28,
            bold: true,
            lineheight: 1.5,
        }) + generate_formatted_html(CONTINUE),
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
        generate_formatted_html(CONTINUE),
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
<span style="color:${COLOUR_TASK_MAPPING[1]}">${TRANSLATE[COLOUR_TASK_MAPPING[1]]} Quadrat → ${TRANSLATE[TASK_HAND_MAPPING[1]]} Aufgabe</span><br><br>`,
        align: "left",
        color: "Black",
        fontsize: 28,
        bold: true,
        lineheight: 1.5,
        }) + generate_formatted_html(CONTINUE),
};

const TASK_INSTRUCTIONS_5 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus:
        generate_formatted_html({
            text: `***Achtung: Neue Instruktionen!***<br><br>`,
            align: "center",
            color: "Black",
            fontsize: 38,
            bold: true,
            lineheight: 1.5,
        }) + generate_formatted_html(CONTINUE),
};

const TASK_INSTRUCTIONS_6 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus:
        generate_formatted_html({
            text: `In manchen Durchgängen ist das Quadrat in der Mitte des Bildschirms <span style="color:blue">Blau</span> und <span style="color:red">Rot</span>. In dem Fall kannst du
frei entscheiden welche Aufgabe (Kleiner/Größer oder Ungerade/Gerade) du bearbeiten willst.
Verwende hierfür einfach die jeweilige Taste:<br><br>`,
            align: "left",
            color: "Black",
            fontsize: 28,
            bold: true,
            lineheight: 1.5,
        }) +
        RESP_MAPPING +
        generate_formatted_html(CONTINUE),
};

function generate_tone_list() {
    let tone_list = [];
    let language = ["DE", "EN"];
    let stimuli = [1, 2, 3, 4, 6, 7, 8, 9];
    for (i = 0; i < language.length; i++) {
        for (j = 0; j < stimuli.length; j++) {
            tone_list.push(`./tones/${language[i]}_${VOICE_GENDER}_${stimuli[j]}.mp3`);
        }
    }
    return tone_list;
}

const AUDITORY_STIMULI = generate_tone_list();
// console.log(AUDITORY_STIMULI);

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
    if (args.task_cue === "both") {
        ctx.fillStyle = COLOUR_TASK_MAPPING[1];
        ctx.fillRect(-PRMS.cue_size / 2, -PRMS.cue_size / 2, PRMS.cue_size, PRMS.cue_size);
        ctx.fillStyle = COLOUR_TASK_MAPPING[0];
        ctx.fillRect(-PRMS.cue_size / 2, -PRMS.cue_size / 2, PRMS.cue_size / 2, PRMS.cue_size);
    } else {
        ctx.fillStyle = args.task_cue;
        ctx.fillRect(-PRMS.cue_size / 2, -PRMS.cue_size / 2, PRMS.cue_size, PRMS.cue_size);
    }
}

const SOUND_STIMULUS = {
    type: jsPsychStaticCanvasSoundKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    sound: null,
    trial_duration: 0,
    response_ends_trial: false,
    data: {
        stim_type: "stcs_sound",
        block_type: jsPsych.timelineVariable("block_type"),
        task_type: jsPsych.timelineVariable("task_type"),
        task: jsPsych.timelineVariable("task"),
        task_cue: jsPsych.timelineVariable("task_cue"),
        number: jsPsych.timelineVariable("number"),
    },
    on_start: function (trial) {
        // Note: For hybrid blocks with forced trials, the task will be overridden in TASK_CUE_STIMULUS
        // This sound stimulus just needs the number, which is already correct
        let language = shuffle(["DE", "EN"])[0];
        let sound_file = `./tones/${language}_${VOICE_GENDER}_${jsPsych.timelineVariable("number")}.mp3`;
        trial.sound = sound_file;
        trial.data.sound_file = sound_file;
    },
};

function code_trial() {
    "use strict";

    let dat_n1 = PRMS.ctrl > 1 ? jsPsych.data.get().last(6).values()[0] : null; // previous trial
    let sound_file = jsPsych.data.get().last(2).values()[0].sound_file; // sound
    let dat_n = jsPsych.data.get().last(1).values()[0]; // current trial

    // Which task was selected?
    let selected_task = PRMS.keys_left.includes(dat_n.key_press.toUpperCase())
        ? TASK_HAND_MAPPING[0]
        : TASK_HAND_MAPPING[1];

    // Was the task a repetition or switch?
    let repetition_switch;
    if (PRMS.ctrl === 1) {
        repetition_switch = "na";
    } else {
        repetition_switch = dat_n1.selected_task === selected_task ? "rep" : "switch";
    }

    // Was the response correct?
    let correct_key;
    if (selected_task === "magnitude") {
        correct_key = dat_n.number < 5 ? PRMS.keys_magnitude[0] : PRMS.keys_magnitude[1];
    } else if (selected_task === "parity") {
        correct_key = [1, 3, 7, 9].includes(dat_n.number) ? PRMS.keys_parity[0] : PRMS.keys_parity[1];
    }

    let correct = jsPsych.pluginAPI.compareKeys(dat_n.key_press, correct_key) ? 1 : 0;

    // let check = {
    //     sound_file: sound_file,
    //     number: dat_n.number,
    //     task: dat_n.task,
    //     repetition_switch: repetition_switch,
    //     selected_task: selected_task,
    //     correct: correct,
    // };
    // console.log(check);

    jsPsych.data.addDataToLastTrial({
        date: Date(),
        blockNum: PRMS.cblk,
        trialNum: PRMS.ctrl,
        sound_file: sound_file,
        repetition_switch: repetition_switch,
        selected_task: selected_task,
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
        block_type: jsPsych.timelineVariable("block_type"),
        task_type: jsPsych.timelineVariable("task_type"),
        task: jsPsych.timelineVariable("task"),
        task_cue: jsPsych.timelineVariable("task_cue"),
        number: jsPsych.timelineVariable("number"),
    },
    on_start: function (trial) {
        // For hybrid blocks with forced trials, dynamically determine task based on switch probability
        if (trial.data.block_type === "hybrid" && trial.data.task_type === "forced") {
            // Determine which half of experiment we're in
            let is_first_half = PRMS.cblk <= PRMS.nblks_total / 2;
            let switch_prob = is_first_half ? PRMS.switch_prob_first_half : PRMS.switch_prob_second_half;
            
            // Get previous trial's selected task (if not first trial)
            // In on_start, previous TASK_CUE_STIMULUS is at last(3) (after ITI and TRIAL_FEEDBACK)
            let previous_selected_task = null;
            if (PRMS.ctrl > 1) {
                let previous_trial_data = jsPsych.data.get().last(3).values()[0];
                if (previous_trial_data && previous_trial_data.selected_task) {
                    previous_selected_task = previous_trial_data.selected_task;
                }
            }
            
            // Determine if this forced trial should be a switch or repetition
            let should_switch;
            if (previous_selected_task === null) {
                should_switch = Math.random() < 0.5; // First trial of block - random
            } else {
                should_switch = Math.random() < switch_prob; // Use switch probability
            }
            
            // Determine the required task
            let required_task;
            if (previous_selected_task === null) {
                // First trial - keep original task from timeline variable
                required_task = trial.data.task;
            } else {
                if (should_switch) { // Switch to the other task
                    required_task = previous_selected_task === TASK_HAND_MAPPING[0] 
                        ? TASK_HAND_MAPPING[1] 
                        : TASK_HAND_MAPPING[0];
                } else { // Repeat the same task
                    required_task = previous_selected_task;
                }
            }
            
            // Override task and task_cue
            trial.data.task = required_task;
            let task_index = TASK_HAND_MAPPING.indexOf(required_task);
            trial.data.task_cue = COLOUR_TASK_MAPPING[task_index];
        }
        
        // Set choices based on task type
        if (trial.data.task === "free") {
            trial.choices = PRMS.keys_magnitude.concat(PRMS.keys_parity);
        } else {
            trial.choices = trial.data.task === "magnitude" ? PRMS.keys_magnitude : PRMS.keys_parity;
        }
        trial.func_args = [{ task_cue: trial.data.task_cue }];
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
    for (let i = 0; i < stimuli.length; i++) {
        for (let j = 0; j < TASK_HAND_MAPPING.length; j++) {
            trials.push({
                block_type: "forced",
                task_type: "forced",
                task: TASK_HAND_MAPPING[j],
                task_cue: COLOUR_TASK_MAPPING[j],
                number: stimuli[i],
            });
        }
    }
    return trials;
}
const TRIAL_TABLE_FORCED = create_trial_table_forced_block();
//console.table(TRIAL_TABLE_FORCED);

function create_trial_table_hybrid_block() {
    trials = [];
    let stimuli = [1, 2, 3, 4, 6, 7, 8, 9];
    let task_type = ["forced", "free"];
    for (let i = 0; i < stimuli.length; i++) {
        for (let j = 0; j < TASK_HAND_MAPPING.length; j++) {
            for (let k = 0; k < task_type.length; k++) {
                trials.push({
                    block_type: "hybrid",
                    task_type: task_type[k],
                    task: task_type[k] === "forced" ? TASK_HAND_MAPPING[j] : "free",
                    task_cue: task_type[k] === "forced" ? COLOUR_TASK_MAPPING[j] : "both",
                    number: stimuli[i],
                });
            }
        }
    }
    return trials;
}
const TRIAL_TABLE_HYBRID = create_trial_table_hybrid_block();
//console.table(TRIAL_TABLE_HYBRID);

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

const TRIAL_TIMELINE_FORCED = {
    timeline: [FIXATION_CROSS, SOUND_STIMULUS, TASK_CUE_STIMULUS, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIAL_TABLE_FORCED,
};

const TRIAL_TIMELINE_HYBRID = {
    timeline: [FIXATION_CROSS, SOUND_STIMULUS, TASK_CUE_STIMULUS, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIAL_TABLE_HYBRID,
};

////////////////////////////////////////////////////////////////////////
//                             VP Stunden                             //
////////////////////////////////////////////////////////////////////////
const HALF_TIME = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    response_ends_trial: true,
    choices: [" "],
    stimulus: generate_formatted_html({
        text: `Dieser Teil des Experiments ist jetzt beendet.`,
        fontsize: 28,
        lineheight: 1.0,
        bold: false,
        align: "left",
    }),
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
    saveData("/Common7+/write_data.php", data_fn, { stim_type: "stcs" });
    // saveDataLocal(data_fn, { stim_type: "stcs" });
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
    exp.push(browser_check(CANVAS_SIZE));
    exp.push(PRELOAD);
    exp.push(resize_browser());
    exp.push(welcome_message());
    exp.push(vpInfoForm("/Common7+/vpInfoForm_de.html"));
    exp.push(mouseCursor(false));

    // welcome instructions
    exp.push(TASK_INSTRUCTIONS_1);

    // audio calibration
    exp.push(TASK_INSTRUCTIONS_CALIBRATION);
    exp.push(TRIAL_TIMELINE_CALIBRATION);

    // instructions;
    exp.push(TASK_INSTRUCTIONS_2);
    exp.push(TASK_INSTRUCTIONS_3);
    exp.push(TASK_INSTRUCTIONS_4);

    // practice forced block
    let blk_timeline = { ...TRIAL_TIMELINE_FORCED };
    blk_timeline.sample = {
      type: "fixed-repetitions",
      size: PRMS.ntrls_forced / TRIAL_TABLE_FORCED.length,
    };
    exp.push(blk_timeline); // trials within a block
    exp.push(BLOCK_FEEDBACK); // show previous block performance

    // practice hybrid block
    blk_timeline = { ...TRIAL_TIMELINE_HYBRID };
    blk_timeline.sample = {
      type: "fixed-repetitions",
      size: PRMS.ntrls_hybrid_practice / TRIAL_TABLE_HYBRID.length,
    };
    exp.push(blk_timeline); // trials within a block
    exp.push(BLOCK_FEEDBACK); // show previous block performance

    // exp hybrid blocks
    for (let blk = 0; blk < PRMS.nblks_hybrid; blk += 1) {
        blk_timeline = { ...TRIAL_TIMELINE_HYBRID };
        blk_timeline.sample = {
            type: "fixed-repetitions",
            size: PRMS.ntrls_hybrid_exp / TRIAL_TABLE_HYBRID.length,
        };
        exp.push(blk_timeline);   // trials within a block
        exp.push(BLOCK_FEEDBACK); // show previous block performance
    }

    // First half complete
    exp.push(HALF_TIME);

    // Second half = first half with alternative switch rate (25% vs 75%)

    // practice forced block
    blk_timeline = { ...TRIAL_TIMELINE_FORCED };
    blk_timeline.sample = {
      type: "fixed-repetitions",
      size: PRMS.ntrls_forced / TRIAL_TABLE_FORCED.length,
    };
    exp.push(blk_timeline); // trials within a block
    exp.push(BLOCK_FEEDBACK); // show previous block performance

    // practice hybrid block
    blk_timeline = { ...TRIAL_TIMELINE_HYBRID };
    blk_timeline.sample = {
      type: "fixed-repetitions",
      size: PRMS.ntrls_hybrid_practice / TRIAL_TABLE_HYBRID.length,
    };
    exp.push(blk_timeline); // trials within a block
    exp.push(BLOCK_FEEDBACK); // show previous block performance

    // exp hybrid blocks
    for (let blk = 0; blk < PRMS.nblks_hybrid; blk += 1) {
        blk_timeline = { ...TRIAL_TIMELINE_HYBRID };
        blk_timeline.sample = {
            type: "fixed-repetitions",
            size: PRMS.ntrls_hybrid_exp / TRIAL_TABLE_HYBRID.length,
        };
        exp.push(blk_timeline);   // trials within a block
        exp.push(BLOCK_FEEDBACK); // show previous block performance
    }

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
