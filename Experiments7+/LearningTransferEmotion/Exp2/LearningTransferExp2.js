// Experiment closely based on Tae et al. (2021, Exp2), except transfer phase involved a hybrid free-forced task switching paradigm.
// Tae, J., Weldon, R. B., Almasi, R. C., An, C., Lee, Y., & Sohn, M. H. (2021). Stimuli with
// a positive valence can facilitate cognitive control. Memory & Cognition, 1-14.
//
// Materials: Positive/Negative/Neutral faces of 8 actors
// Positive/Negative faces used in association phase, neutral faces in transfer phase
//
// Association Phase:
// Participants were required to identify the emotion of the face
//
// Trial Structure:
// Fixation Cross 300 ms
// Face Stimulus until response (E/I keys with index fingers randomly assigned)
// Feedback (correct/incorrect) 300 ms
// Blank ITI 1000 ms
//
// Block structure:
// 16 practice trials (50% positive, 50% negative)
// 1 block of 128 trials
// global proportion 50% positive, 50% negative,
//
// Transfer phase:
// Participants presented with positive/negative images
// Two trial types
// 1) Forced to respond to either gender (male vs. female) or age (young vs. old)
// 2) Free to choose between gender or age task
// Each task mapped to one hand with index/middle fingers (Q/W/O/P) with task to hand and finger to response randomly assigned per participant
// In forced choice trials, a grey/yellow frame indicated which task to perform (free-choice trials had no frame)
//
// Block structure:
// 1 practice block of 48 trials
// 2 blocks of 240 trials (80 trials age task, 80 trials gender task, 80 trials free-choice)S
// Within each 80 trial type, each face appeared 5 times +ve, 5 times -v

const jsPsych = initJsPsych({
    on_finish: function () {
        if (PRMS.count_block >= 5) {
            window.location.assign(
                "https://uni-tuebingen.sona-systems.com/webstudy_credit.aspx?experiment_id=445&credit_token=2f494591a3114494a45867402b17dc1d&survey_code=" +
                    jsPsych.data.urlVariables().sona_id,
            );
        }
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
    n_blocks_ap: 2, // number of blocks association phase
    n_trials_ap_practice: 16, // number of trials association phase practice block
    n_trials_ap: 128, // number of trials association phase
    n_blocks_tp: 3, // number of blocks transfer phase
    n_trials_tp_practice: 48, // number of trials transfer phase
    n_trials_tp: 240, // number of trials transfer phase
    fix_dur: 300, // duration of fixation cross
    fix_size: 15, // duration of the fixation cross
    fix_width: 5, // size of fixation cross
    fix_colour: "Black", // colour of the fixation cross
    feedback_dur: 300, // duration of feedback for each type
    wait_dur: 1000, // duration following block feedback screen
    iti: 500, // duration of inter-trial-interval
    target_position: [0, 0],
    resp_keys_ap: ["E", "I"],
    resp_mapping_ap: shuffle(["positives", "negatives"]),
    resp_keys_tp: ["Q", "W", "O", "P"],
    hand_mapping_tp: shuffle(["Altersaufgabe", "Geschlechtsaufgabe"]),
    finger_mapping_tp: null,
    colour_mapping_tp: shuffle(["gelber", "grüner"]),
    frame_size: [275, 340],
    frame_width: 10,
    frame_position: [0, 0],
    trial_feedback_text: ["Falsch!", "Richtig!"],
    trial_feedback_text_font: "40px monospace",
    trial_feedback_text_colour: "Black",
    trial_feedback_text_position: [0, 0],
    block_feedback_text_size: 26,
    count_trial: 1, // count trials
    count_block: 1, // count blocks
};

if (PRMS.hand_mapping_tp[0] === "Altersaufgabe") {
    PRMS.finger_mapping_tp = shuffle(["Jung", "Alt"]).concat(shuffle(["Männlich", "Weiblich"]));
} else if (PRMS.hand_mapping_tp[0] === "Geschlechtsaufgabe") {
    PRMS.finger_mapping_tp = shuffle(["Männlich", "Weiblich"]).concat(shuffle(["Jung", "Alt"]));
}

const DE_EN = { gelber: "Yellow", grüner: "Green", Altersaufgabe: "age", Geschlechtsaufgabe: "gender" };
const TASK = { Altersaufgabe: "jung ist oder alt ist", Geschlechtsaufgabe: "männlich ist oder weiblich ist" };

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

const TASK_INSTRUCTIONS2 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    on_start: function (trial) {
        trial.stimulus = generate_formatted_html({
            text: `Im Folgenden werden Bilder von Personen gezeigt, die positive (fröhlich) oder negative
                   (wütend) Emotionen zeigen. Bitte reagiere wie folgt mit den Zeigefingern deiner Hände:<br><br>
                   "${PRMS.resp_keys_ap[0]}"-Taste: ${PRMS.resp_mapping_ap[0]} Gesicht<br>
                   "${PRMS.resp_keys_ap[1]}"-Taste: ${PRMS.resp_mapping_ap[1]} Gesicht<br><br>
                   Versuche, so schnell und akkurat wie möglich zu antworten.<br><br>
                   Drücke eine beliebige Taste, um fortzufahren.`,
            align: "left",
            colour: "black",
            fontsize: 30,
            lineheight: 1.5,
        });
    },
};

const BLOCK_START_AP = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    on_start: function (trial) {
        trial.stimulus = generate_formatted_html({
            text: `<span style = "font-weight: bold;">Block ${PRMS.count_block} von ${
                PRMS.n_blocks_ap + PRMS.n_blocks_tp
            }</span><br><br>
              Bitte reagiere wie folgt mit den Zeigefingern:<br><br>
                   "${PRMS.resp_keys_ap[0]}"-Taste: ${PRMS.resp_mapping_ap[0]} Gesicht<br>
                   "${PRMS.resp_keys_ap[1]}"-Taste: ${PRMS.resp_mapping_ap[1]} Gesicht<br><br>
                   Versuche, so schnell und akkurat wie möglich zu antworten.<br><br>
             Drücke eine beliebige Taste, um fortzufahren.</span>`,
            align: "left",
            colour: "black",
            fontsize: 30,
        });
    },
};

const TASK_INSTRUCTIONS3 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    on_start: function (trial) {
        trial.stimulus = generate_formatted_html({
            text: `<span style="font-weight: bold;">Achtung: Neue Instruktionen!</span><br><br>
                   Im Folgenden gibt es zwei Aufgaben. Jede Aufgabe wird mit einer Hand bearbeitet.<br><br>
                   ${PRMS.hand_mapping_tp[0]} <span style="color: ${DE_EN[PRMS.colour_mapping_tp[0]]};">(${
                       PRMS.colour_mapping_tp[0]
                   } Rahmen)</span> = Linke Hand: Bitte platziere hierzu Zeigefinger und
                   Mittelfinger auf die Tasten "${PRMS.resp_keys_tp[0]}" und "${PRMS.resp_keys_tp[1]}".<br><br>
                   ${PRMS.hand_mapping_tp[1]} <span style="color: ${DE_EN[PRMS.colour_mapping_tp[1]]};">(${
                       PRMS.colour_mapping_tp[1]
                   } Rahmen)</span> = Rechte Hand: Bitte platziere hierzu Zeigefinger und
                   Mittelfinger auf die Tasten "${PRMS.resp_keys_tp[2]}" und "${PRMS.resp_keys_tp[3]}".<br><br>
                   Drücke eine beliebige Taste, um fortzufahren.`,
            align: "left",
            colour: "black",
            fontsize: 30,
            lineheight: 1.5,
        });
    },
};

// prettier-ignore
const RESP_MAPPING = generate_formatted_html({
    text: `${PRMS.hand_mapping_tp[0]} = Linke Hand 
${"&emsp;".repeat(6)} 
${PRMS.hand_mapping_tp[1]} = Rechte Hand<br>
<span style="color: ${DE_EN[PRMS.colour_mapping_tp[0]]};">${PRMS.colour_mapping_tp[0]} Rahmen</span> 
${"&emsp;".repeat(14)}
<span style="color: ${DE_EN[PRMS.colour_mapping_tp[1]]};">${PRMS.colour_mapping_tp[1]} Rahmen</span><br>
 ${PRMS.finger_mapping_tp[0]}
${"&emsp;".repeat(5)}${PRMS.finger_mapping_tp[1]}
${"&emsp;".repeat(12)}
${PRMS.finger_mapping_tp[2]}
${"&emsp;".repeat(5)}${PRMS.finger_mapping_tp[3]}<br>
(${PRMS.resp_keys_tp[0]}-Taste)
${"&emsp;".repeat(4)}
(${PRMS.resp_keys_tp[1]}-Taste)
${"&emsp;".repeat(11)}
(${PRMS.resp_keys_tp[2]}-Taste)
${"&emsp;".repeat(4)}
(${PRMS.resp_keys_tp[3]}-Taste)`,
    align: "center",
    fontsize: 30,
    width: "1200px",
    bold: true,
    lineheight: 1.5,
});

const TASK_INSTRUCTIONS4 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    on_start: function (trial) {
        trial.stimulus =
            generate_formatted_html({
                text: `Für die ${PRMS.hand_mapping_tp[0]} ist das Bild einer Person von einem <span style="color: ${
                    DE_EN[PRMS.colour_mapping_tp[0]]
                };">${PRMS.colour_mapping_tp[0]}</span> Rahmen umgeben. Du
musst entscheiden, ob die Person ${TASK[PRMS.hand_mapping_tp[0]]}.<br><br>
Für die ${PRMS.hand_mapping_tp[1]} ist das Bild einer Person von einem <span style="color: ${
                    DE_EN[PRMS.colour_mapping_tp[1]]
                };">${PRMS.colour_mapping_tp[1]}</span> Rahmen
umgeben. Du musst entscheiden, ob die Person ${TASK[PRMS.hand_mapping_tp[1]]}.<br><br>
Bitte reagiere wie folgt:<br>`,
                align: "left",
                colour: "black",
                fontsize: 28,
                lineheight: 1.25,
            }) +
            RESP_MAPPING +
            generate_formatted_html({
                text: `Drücke eine beliebige Taste, um fortzufahren.`,
                align: "left",
                colour: "black",
                lineheight: 1.25,
                fontsize: 28,
            });
    },
};

const TASK_INSTRUCTIONS5 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    on_start: function (trial) {
        trial.stimulus = generate_formatted_html({
            text: `In jedem Durchgang muss nur eine Aufgabe bearbeitet werden.<br><br>
Bearbeite bitte die Aufgabe, die durch die Farbe des Rahmens angezeigt wird.<br><br>
Wenn kein Rahmen um das Bild platziert ist, kannst du frei aussuchen, welche Aufgabe
du bearbeitest.<br><br>
Drücke eine beliebige Taste, um fortzufahren.`,
            align: "left",
            colour: "black",
            fontsize: 30,
            lineheight: 1.5,
        });
    },
};

const BLOCK_START_TP = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    on_start: function (trial) {
        trial.stimulus =
            generate_formatted_html({
                text: `Block ${PRMS.count_block} von ${PRMS.n_blocks_ap + PRMS.n_blocks_tp}<br><br>
Entscheide selbst, welche Aufgabe du bearbeiten willst, wenn kein Rahmen um
das Bild platziert ist und bearbeite sonst die Aufgabe, welche der Rahmen anzeigt.
Es gilt:<br>`,
                align: "left",
                colour: "black",
                fontsize: 28,
                lineheight: 1.25,
            }) +
            RESP_MAPPING +
            generate_formatted_html({
                text: `Um den Block zu starten, drücke eine beliebige Taste.`,
                align: "left",
                colour: "black",
                lineheight: 1.25,
                fontsize: 28,
            });
    },
};

// pre-load images
const PRELOAD = {
    type: jsPsychPreload,
    images: [POSITIVE_IMAGES, NEGATIVE_IMAGES],
};

////////////////////////////////////////////////////////////////////////
//                              Exp Parts                             //
////////////////////////////////////////////////////////////////////////

function draw_fixation_cross() {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");
    ctx.lineWidth = PRMS.fix_width;
    ctx.strokeStyle = PRMS.fix_colour;
    ctx.moveTo(-PRMS.fix_size, 0);
    ctx.lineTo(PRMS.fix_size, 0);
    ctx.stroke();
    ctx.moveTo(0, -PRMS.fix_size);
    ctx.lineTo(0, PRMS.fix_size);
    ctx.stroke();
}

const FIXATION_CROSS = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    response_ends_trial: false,
    trial_duration: PRMS.fix_dur,
    func: draw_fixation_cross,
};

function code_trial() {
    "use strict";
    let dat = jsPsych.data.get().last(1).values()[0];
    if (dat.task_type !== "free") {
        let correct = jsPsych.pluginAPI.compareKeys(dat.key_press, dat.correct_response1) ? 1 : 0;
        jsPsych.data.addDataToLastTrial({
            date: Date(),
            block_number: PRMS.count_block,
            trial_number: PRMS.count_trial,
            responded_task: dat.task_type,
            correct: correct,
        });
    } else {
        let correct1 = jsPsych.pluginAPI.compareKeys(dat.key_press, dat.correct_response1) ? 1 : 0;
        let correct2 = jsPsych.pluginAPI.compareKeys(dat.key_press, dat.correct_response2) ? 1 : 0;
        let correct = correct1 || correct2;
        let responded_task = PRMS.resp_keys_tp.slice(0, 2).includes(dat.key_press.toUpperCase())
            ? DE_EN[PRMS.hand_mapping_tp[0]]
            : DE_EN[PRMS.hand_mapping_tp[1]];
        jsPsych.data.addDataToLastTrial({
            date: Date(),
            block_number: PRMS.count_block,
            trial_number: PRMS.count_trial,
            responded_task: responded_task,
            correct: correct,
        });
    }
}

function draw_stimulus_ap(args) {
    let ctx = document.getElementById("canvas").getContext("2d");

    // image
    const img = new Image();
    img.src = args.image;
    ctx.drawImage(img, PRMS.target_position[0] - img.width / 2, PRMS.target_position[1] - img.height / 2);
}

// prettier-ignore
const FACE_STIMULUS_AP = {
  type: jsPsychStaticCanvasKeyboardResponse,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  translate_origin: true,
  response_ends_trial: true,
  choices: PRMS.resp_keys_ap,
  func: draw_stimulus_ap,
  func_args: null,
  data: {
    stim: 'lt',
    exp_phase: jsPsych.timelineVariable("exp_phase"),
    task_type: jsPsych.timelineVariable("task_type"),
    image: jsPsych.timelineVariable("image"),
    emotion: jsPsych.timelineVariable("emotion"),
    proportion: jsPsych.timelineVariable("proportion"),
    correct_response1: jsPsych.timelineVariable('correct_response1'),
    correct_response2: jsPsych.timelineVariable('correct_response2'),
  },
  on_start: function(trial) {
    trial.func_args = [{ image: trial.data.image }];
  },
  on_finish: function() {
    code_trial();
    PRMS.count_trial += 1;
  },
};

function draw_stimulus_tp(args) {
    let ctx = document.getElementById("canvas").getContext("2d");

    // image
    const img = new Image();
    img.src = args.image;
    ctx.drawImage(img, PRMS.target_position[0] - img.width / 2, PRMS.target_position[1] - img.height / 2);

    // draw frame if not free choice
    if (args.task_type !== "free") {
        ctx.beginPath();
        ctx.lineWidth = PRMS.frame_width;
        if (args.task_type === "age" && PRMS.hand_mapping_tp[0] === "Altersaufgabe") {
            ctx.strokeStyle = `${DE_EN[PRMS.colour_mapping_tp[0]]}`;
        } else if (args.task_type === "age" && PRMS.hand_mapping_tp[1] === "Altersaufgabe") {
            ctx.strokeStyle = `${DE_EN[PRMS.colour_mapping_tp[1]]}`;
        } else if (args.task_type === "gender" && PRMS.hand_mapping_tp[0] === "Geschlechtsaufgabe") {
            ctx.strokeStyle = `${DE_EN[PRMS.colour_mapping_tp[0]]}`;
        } else if (args.task_type === "gender" && PRMS.hand_mapping_tp[1] === "Geschlechtsaufgabe") {
            ctx.strokeStyle = `${DE_EN[PRMS.colour_mapping_tp[1]]}`;
        }
        ctx.rect(
            -(PRMS.frame_size[0] / 2) + PRMS.frame_position[0],
            -PRMS.frame_size[1] / 2 + PRMS.frame_position[1],
            PRMS.frame_size[0],
            PRMS.frame_size[1],
        );
        ctx.stroke();
    }
}

// prettier-ignore
const FACE_STIMULUS_TP = {
  type: jsPsychStaticCanvasKeyboardResponse,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  translate_origin: true,
  response_ends_trial: true,
  choices: PRMS.resp_keys_tp,
  func: draw_stimulus_tp,
  func_args: null,
  data: {
    stim: 'lt',
    exp_phase: jsPsych.timelineVariable("exp_phase"),
    task_type: jsPsych.timelineVariable("task_type"),
    image: jsPsych.timelineVariable("image"),
    emotion: jsPsych.timelineVariable("emotion"),
    proportion: jsPsych.timelineVariable("proportion"),
    correct_response1: jsPsych.timelineVariable('correct_response1'),
    correct_response2: jsPsych.timelineVariable('correct_response2'),
  },
  on_start: function(trial) {
    trial.func_args = [{ image: trial.data.image, task_type:  trial.data.task_type}];
  },
  on_finish: function() {
    code_trial();
    PRMS.count_trial += 1;
  },
};

function draw_feedback(args) {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");
    ctx.textAlign = "center";
    ctx.font = PRMS.trial_feedback_text_font;
    ctx.fillStyle = PRMS.trial_feedback_text_colour;
    ctx.fillText(args.feedback, PRMS.trial_feedback_text_position[0], PRMS.trial_feedback_text_position[1]);
}

const TRIAL_FEEDBACK = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    response_ends_trial: false,
    trial_duration: PRMS.feedback_dur,
    func: draw_feedback,
    func_args: null,
    stimulus: "",
    on_start: function (trial) {
        let dat = jsPsych.data.get().last(1).values()[0];
        trial.func_args = [{ feedback: PRMS.trial_feedback_text[dat.correct] }];
    },
};

const BLOCK_FEEDBACK = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    response_ends_trial: true,
    post_trial_gap: 0,
    on_start: function (trial) {
        let block_dvs = calculateBlockPerformance({
            filter_options: { stim: "lt", block_number: PRMS.count_block },
            corrColumn: "correct",
        });
        let text = blockFeedbackText(
            PRMS.count_block,
            PRMS.n_blocks_ap + PRMS.n_blocks_tp,
            block_dvs.meanRt,
            block_dvs.errorRate,
            (language = "de"),
        );
        trial.stimulus = `<div style="font-size:${PRMS.fbTxtSizeBlock}px;">${text}</div>`;
    },
    on_finish: function () {
        PRMS.count_trial = 1;
        PRMS.count_block += 1;
    },
};

function draw_iti() {}

const ITI = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    translate_origin: true,
    response_ends_trial: false,
    trial_duration: PRMS.iti,
    func: draw_iti,
    func_args: null,
};

// prettier-ignore
const TRIAL_TABLE_AP = [
    { exp_phase: "association", task_type: "emotion", image: POSITIVE_IMAGES[0], emotion: "positive", gender: "f", age: "o", correct_response1: PRMS.resp_keys_ap[PRMS.resp_mapping_ap.indexOf("positives")], correct_response2: "na"},
    { exp_phase: "association", task_type: "emotion", image: POSITIVE_IMAGES[1], emotion: "positive", gender: "m", age: "o", correct_response1: PRMS.resp_keys_ap[PRMS.resp_mapping_ap.indexOf("positives")], correct_response2: "na"},
    { exp_phase: "association", task_type: "emotion", image: POSITIVE_IMAGES[2], emotion: "positive", gender: "f", age: "o", correct_response1: PRMS.resp_keys_ap[PRMS.resp_mapping_ap.indexOf("positives")], correct_response2: "na"},
    { exp_phase: "association", task_type: "emotion", image: POSITIVE_IMAGES[3], emotion: "positive", gender: "m", age: "o", correct_response1: PRMS.resp_keys_ap[PRMS.resp_mapping_ap.indexOf("positives")], correct_response2: "na"},
    { exp_phase: "association", task_type: "emotion", image: POSITIVE_IMAGES[4], emotion: "positive", gender: "m", age: "y", correct_response1: PRMS.resp_keys_ap[PRMS.resp_mapping_ap.indexOf("positives")], correct_response2: "na"},
    { exp_phase: "association", task_type: "emotion", image: POSITIVE_IMAGES[5], emotion: "positive", gender: "f", age: "y", correct_response1: PRMS.resp_keys_ap[PRMS.resp_mapping_ap.indexOf("positives")], correct_response2: "na"},
    { exp_phase: "association", task_type: "emotion", image: POSITIVE_IMAGES[6], emotion: "positive", gender: "f", age: "y", correct_response1: PRMS.resp_keys_ap[PRMS.resp_mapping_ap.indexOf("positives")], correct_response2: "na"},
    { exp_phase: "association", task_type: "emotion", image: POSITIVE_IMAGES[7], emotion: "positive", gender: "m", age: "y", correct_response1: PRMS.resp_keys_ap[PRMS.resp_mapping_ap.indexOf("positives")], correct_response2: "na"},
    { exp_phase: "association", task_type: "emotion", image: NEGATIVE_IMAGES[0], emotion: "negative", gender: "f", age: "o", correct_response1: PRMS.resp_keys_ap[PRMS.resp_mapping_ap.indexOf("negatives")], correct_response2: "na"},
    { exp_phase: "association", task_type: "emotion", image: NEGATIVE_IMAGES[1], emotion: "negative", gender: "m", age: "o", correct_response1: PRMS.resp_keys_ap[PRMS.resp_mapping_ap.indexOf("negatives")], correct_response2: "na"},
    { exp_phase: "association", task_type: "emotion", image: NEGATIVE_IMAGES[2], emotion: "negative", gender: "f", age: "o", correct_response1: PRMS.resp_keys_ap[PRMS.resp_mapping_ap.indexOf("negatives")], correct_response2: "na"},
    { exp_phase: "association", task_type: "emotion", image: NEGATIVE_IMAGES[3], emotion: "negative", gender: "m", age: "o", correct_response1: PRMS.resp_keys_ap[PRMS.resp_mapping_ap.indexOf("negatives")], correct_response2: "na"},
    { exp_phase: "association", task_type: "emotion", image: NEGATIVE_IMAGES[4], emotion: "negative", gender: "m", age: "y", correct_response1: PRMS.resp_keys_ap[PRMS.resp_mapping_ap.indexOf("negatives")], correct_response2: "na"},
    { exp_phase: "association", task_type: "emotion", image: NEGATIVE_IMAGES[5], emotion: "negative", gender: "f", age: "y", correct_response1: PRMS.resp_keys_ap[PRMS.resp_mapping_ap.indexOf("negatives")], correct_response2: "na"},
    { exp_phase: "association", task_type: "emotion", image: NEGATIVE_IMAGES[6], emotion: "negative", gender: "f", age: "y", correct_response1: PRMS.resp_keys_ap[PRMS.resp_mapping_ap.indexOf("negatives")], correct_response2: "na"},
    { exp_phase: "association", task_type: "emotion", image: NEGATIVE_IMAGES[7], emotion: "negative", gender: "m", age: "y", correct_response1: PRMS.resp_keys_ap[PRMS.resp_mapping_ap.indexOf("negatives")], correct_response2: "na"},
];

const TRIAL_TIMELINE_AP = {
    timeline: [FIXATION_CROSS, FACE_STIMULUS_AP, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIAL_TABLE_AP,
};

// prettier-ignore
const TRIAL_TABLE_TP = [
  { exp_phase: "transfer", task_type: "gender", image: POSITIVE_IMAGES[0], emotion: "positive", gender: "f", age: "o", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Weiblich")], correct_response2: "na"},
  { exp_phase: "transfer", task_type: "gender", image: POSITIVE_IMAGES[1], emotion: "positive", gender: "m", age: "o", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Männlich")], correct_response2: "na"},
  { exp_phase: "transfer", task_type: "gender", image: POSITIVE_IMAGES[2], emotion: "positive", gender: "f", age: "o", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Weiblich")], correct_response2: "na"},
  { exp_phase: "transfer", task_type: "gender", image: POSITIVE_IMAGES[3], emotion: "positive", gender: "m", age: "o", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Männlich")], correct_response2: "na"},
  { exp_phase: "transfer", task_type: "gender", image: POSITIVE_IMAGES[4], emotion: "positive", gender: "m", age: "y", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Männlich")], correct_response2: "na"},
  { exp_phase: "transfer", task_type: "gender", image: POSITIVE_IMAGES[5], emotion: "positive", gender: "f", age: "y", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Weiblich")], correct_response2: "na"},
  { exp_phase: "transfer", task_type: "gender", image: POSITIVE_IMAGES[6], emotion: "positive", gender: "f", age: "y", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Weiblich")], correct_response2: "na"},
  { exp_phase: "transfer", task_type: "gender", image: POSITIVE_IMAGES[7], emotion: "positive", gender: "m", age: "y", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Männlich")], correct_response2: "na"},
  { exp_phase: "transfer", task_type: "age",    image: POSITIVE_IMAGES[0], emotion: "positive", gender: "f", age: "o", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Alt")],      correct_response2: "na"},
  { exp_phase: "transfer", task_type: "age",    image: POSITIVE_IMAGES[1], emotion: "positive", gender: "m", age: "o", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Alt")],      correct_response2: "na"},
  { exp_phase: "transfer", task_type: "age",    image: POSITIVE_IMAGES[2], emotion: "positive", gender: "f", age: "o", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Alt")],      correct_response2: "na"},
  { exp_phase: "transfer", task_type: "age",    image: POSITIVE_IMAGES[3], emotion: "positive", gender: "m", age: "o", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Alt")],      correct_response2: "na"},
  { exp_phase: "transfer", task_type: "age",    image: POSITIVE_IMAGES[4], emotion: "positive", gender: "m", age: "y", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Jung")],     correct_response2: "na"},
  { exp_phase: "transfer", task_type: "age",    image: POSITIVE_IMAGES[5], emotion: "positive", gender: "f", age: "y", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Jung")],     correct_response2: "na"},
  { exp_phase: "transfer", task_type: "age",    image: POSITIVE_IMAGES[6], emotion: "positive", gender: "f", age: "y", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Jung")],     correct_response2: "na"},
  { exp_phase: "transfer", task_type: "age",    image: POSITIVE_IMAGES[7], emotion: "positive", gender: "m", age: "y", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Jung")],     correct_response2: "na"},
  { exp_phase: "transfer", task_type: "free",   image: POSITIVE_IMAGES[0], emotion: "positive", gender: "f", age: "o", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Weiblich")], correct_response2: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Alt")]},
  { exp_phase: "transfer", task_type: "free",   image: POSITIVE_IMAGES[1], emotion: "positive", gender: "m", age: "o", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Männlich")], correct_response2: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Alt")]},
  { exp_phase: "transfer", task_type: "free",   image: POSITIVE_IMAGES[2], emotion: "positive", gender: "f", age: "o", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Weiblich")], correct_response2: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Alt")]},
  { exp_phase: "transfer", task_type: "free",   image: POSITIVE_IMAGES[3], emotion: "positive", gender: "m", age: "o", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Männlich")], correct_response2: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Alt")]},
  { exp_phase: "transfer", task_type: "free",   image: POSITIVE_IMAGES[4], emotion: "positive", gender: "m", age: "y", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Männlich")], correct_response2: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Jung")]},
  { exp_phase: "transfer", task_type: "free",   image: POSITIVE_IMAGES[5], emotion: "positive", gender: "f", age: "y", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Weiblich")], correct_response2: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Jung")]},
  { exp_phase: "transfer", task_type: "free",   image: POSITIVE_IMAGES[6], emotion: "positive", gender: "f", age: "y", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Weiblich")], correct_response2: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Jung")]},
  { exp_phase: "transfer", task_type: "free",   image: POSITIVE_IMAGES[7], emotion: "positive", gender: "m", age: "y", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Männlich")], correct_response2: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Jung")]},
  { exp_phase: "transfer", task_type: "gender", image: NEGATIVE_IMAGES[0], emotion: "negative", gender: "f", age: "o", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Weiblich")], correct_response2: "na"},
  { exp_phase: "transfer", task_type: "gender", image: NEGATIVE_IMAGES[1], emotion: "negative", gender: "m", age: "o", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Männlich")], correct_response2: "na"},
  { exp_phase: "transfer", task_type: "gender", image: NEGATIVE_IMAGES[2], emotion: "negative", gender: "f", age: "o", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Weiblich")], correct_response2: "na"},
  { exp_phase: "transfer", task_type: "gender", image: NEGATIVE_IMAGES[3], emotion: "negative", gender: "m", age: "o", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Männlich")], correct_response2: "na"},
  { exp_phase: "transfer", task_type: "gender", image: NEGATIVE_IMAGES[4], emotion: "negative", gender: "m", age: "y", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Männlich")], correct_response2: "na"},
  { exp_phase: "transfer", task_type: "gender", image: NEGATIVE_IMAGES[5], emotion: "negative", gender: "f", age: "y", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Weiblich")], correct_response2: "na"},
  { exp_phase: "transfer", task_type: "gender", image: NEGATIVE_IMAGES[6], emotion: "negative", gender: "f", age: "y", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Weiblich")], correct_response2: "na"},
  { exp_phase: "transfer", task_type: "gender", image: NEGATIVE_IMAGES[7], emotion: "negative", gender: "m", age: "y", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Männlich")], correct_response2: "na"},
  { exp_phase: "transfer", task_type: "age",    image: NEGATIVE_IMAGES[0], emotion: "negative", gender: "f", age: "o", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Alt")],      correct_response2: "na"},
  { exp_phase: "transfer", task_type: "age",    image: NEGATIVE_IMAGES[1], emotion: "negative", gender: "m", age: "o", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Alt")],      correct_response2: "na"},
  { exp_phase: "transfer", task_type: "age",    image: NEGATIVE_IMAGES[2], emotion: "negative", gender: "f", age: "o", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Alt")],      correct_response2: "na"},
  { exp_phase: "transfer", task_type: "age",    image: NEGATIVE_IMAGES[3], emotion: "negative", gender: "m", age: "o", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Alt")],      correct_response2: "na"},
  { exp_phase: "transfer", task_type: "age",    image: NEGATIVE_IMAGES[4], emotion: "negative", gender: "m", age: "y", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Jung")],     correct_response2: "na"},
  { exp_phase: "transfer", task_type: "age",    image: NEGATIVE_IMAGES[5], emotion: "negative", gender: "f", age: "y", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Jung")],     correct_response2: "na"},
  { exp_phase: "transfer", task_type: "age",    image: NEGATIVE_IMAGES[6], emotion: "negative", gender: "f", age: "y", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Jung")],     correct_response2: "na"},
  { exp_phase: "transfer", task_type: "age",    image: NEGATIVE_IMAGES[7], emotion: "negative", gender: "m", age: "y", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Jung")],     correct_response2: "na"},
  { exp_phase: "transfer", task_type: "free",   image: NEGATIVE_IMAGES[0], emotion: "negative", gender: "f", age: "o", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Weiblich")], correct_response2: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Alt")]}, 
  { exp_phase: "transfer", task_type: "free",   image: NEGATIVE_IMAGES[1], emotion: "negative", gender: "m", age: "o", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Männlich")], correct_response2: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Alt")]}, 
  { exp_phase: "transfer", task_type: "free",   image: NEGATIVE_IMAGES[2], emotion: "negative", gender: "f", age: "o", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Weiblich")], correct_response2: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Alt")]}, 
  { exp_phase: "transfer", task_type: "free",   image: NEGATIVE_IMAGES[3], emotion: "negative", gender: "m", age: "o", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Männlich")], correct_response2: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Alt")]}, 
  { exp_phase: "transfer", task_type: "free",   image: NEGATIVE_IMAGES[4], emotion: "negative", gender: "m", age: "y", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Männlich")], correct_response2: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Jung")]},
  { exp_phase: "transfer", task_type: "free",   image: NEGATIVE_IMAGES[5], emotion: "negative", gender: "f", age: "y", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Weiblich")], correct_response2: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Jung")]},
  { exp_phase: "transfer", task_type: "free",   image: NEGATIVE_IMAGES[6], emotion: "negative", gender: "f", age: "y", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Weiblich")], correct_response2: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Jung")]},
  { exp_phase: "transfer", task_type: "free",   image: NEGATIVE_IMAGES[7], emotion: "negative", gender: "m", age: "y", correct_response1: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Männlich")], correct_response2: PRMS.resp_keys_tp[PRMS.finger_mapping_tp.indexOf("Jung")]},
];
console.log(TRIAL_TABLE_TP);

const TRIAL_TIMELINE_TP = {
    timeline: [FIXATION_CROSS, FACE_STIMULUS_TP, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIAL_TABLE_TP,
};

////////////////////////////////////////////////////////////////////////
//                              Save                                  //
////////////////////////////////////////////////////////////////////////
const DIR_NAME = getDirName();
const EXP_NAME = getFileName();
const VP_NUM = getTime();

function save() {
    jsPsych.data.addProperties({ vpNum: VP_NUM });

    const data_fn = `${DIR_NAME}data/${EXP_NAME}_${VP_NUM}`;
    saveData("/Common7+/write_data.php", data_fn, { stim: "lt" });
    //saveDataLocal(data_fn, { stim: "lt" });
}

const SAVE_DATA = {
    type: jsPsychCallFunction,
    func: save,
    post_trial_gap: PRMS.wait_dur,
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
    exp.push(vpInfoForm("/Common7+/vpInfoForm_de_copyright.html"));
    exp.push(mouseCursor(false));

    // general instructions
    exp.push(TASK_INSTRUCTIONS1);

    // association phase
    exp.push(TASK_INSTRUCTIONS2);

    for (let blk = 0; blk < PRMS.n_blocks_ap; blk += 1) {
        exp.push(BLOCK_START_AP);
        let blk_timeline;
        blk_timeline = { ...TRIAL_TIMELINE_AP };
        blk_timeline.sample = {
            type: "fixed-repetitions",
            size: (blk === 0 ? PRMS.n_trials_ap_practice : PRMS.n_trials_ap) / TRIAL_TABLE_AP.length,
        };
        exp.push(blk_timeline); // trials within a block
        exp.push(BLOCK_FEEDBACK); // show previous block performance
    }

    // transfer phase
    exp.push(TASK_INSTRUCTIONS3);
    exp.push(TASK_INSTRUCTIONS4);
    exp.push(TASK_INSTRUCTIONS5);

    for (let blk = 0; blk < PRMS.n_blocks_tp; blk += 1) {
        exp.push(BLOCK_START_TP);
        let blk_timeline;
        blk_timeline = { ...TRIAL_TIMELINE_TP };
        blk_timeline.sample = {
            type: "fixed-repetitions",
            size: (blk === 0 ? PRMS.n_trials_tp_practice : PRMS.n_trials_tp) / TRIAL_TABLE_TP.length,
        };
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
