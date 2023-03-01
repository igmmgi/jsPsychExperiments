// Control Retrieval Exp1
// M.Sc. Project: Paul Kelber 2022
//
// Stimuli:
// Targets + distractors: coloured circles (red, green, blue, yellow)
// Contexts: Auditory (soft/loud sounds, or silence); Visual (grey/white background, or black)
// Response keys:
// "S"/"D" and "K"/"L"
//
// Targets, distractors and context randomly divided into two sets: E.g.,
// red/green targets+distractors visual; blue/yellow targets+distractors auditory
// with the above pairs randomly assigned to key pairs ("S"/"D" vs. "K"/"L")
//
// 16 different trial types from combinations of:
// 2 context modalities, 2 targets, 2 distractors, 2 context intensities
//
// Randomisation constraint:
// S-R sets and context modalities alternated from trial to trial
// Only context intensity was allowed to repeat across trials
//
// Experiment structure:
// 1 practice block followed by 14 experimental blocks (64 trials each; 16 * 4)
//
// Trial structure:
// Central fixation cross for 200 ms
// Context presented for 450 ms (During prime, prime target interval, and during target)
// Distractor (prime) for 150 ms
// Blank screen for 150 ms
// Target for 150 ms
// Blank screen until response (or 2000 ms)
// Visual feedback for 1000 ms following
//  incorrect ("Falsch")
//  too fast (<150 ms; "Zu schnell")
//  too slow ("Zu langsam")
// Blank ITI for 1000 ms
//
// Block feedback provided regarding previous block mean RT/ER
//
// Design:
// 2(Current congruency: congruent vs. incongruent) X
// 2(Previous congruency: congruent vs. incongruent) X
// 2(Context transition: repetition vs. alternation)
// with DVs being RT and ER

const jsPsych = initJsPsych({
    on_finish: function (data) {
        window.location.assign(
            "https://uni-tuebingen.sona-systems.com/webstudy_credit.aspx?experiment_id=126&credit_token=1799712d828f4e6da707bc45f70f780a&survey_code=" +
                jsPsych.data.urlVariables().sona_id,
        );
    },
});

const CANVAS_COLOUR = "rgba(0, 0, 0, 1)";
const CANVAS_SIZE = [1280, 720];
const CANVAS_BORDER = "0px solid black";

// auditory and visual contexts
const AUD_CTXS = ["../tones_exp4/silence.wav", "../tones_exp4/low.wav", "../tones_exp4/high.wav"];
const VIS_CTXS = ["rgba(0, 0, 0, 1)", "rgba(100, 100, 100, 1)", "rgba(255, 255, 255, 1)"];

const AUD_CTX_LABELS = shuffle(["Leise", "Laut"]);
const VIS_CTX_LABELS = shuffle(["Dunkel", "Hell"]);
const RESP_KEYS_CTX = ["D", "K"];

// index positions 0,1=visual context; 1,2=auditory context
const STIM_COLS = shuffle(["Red", "Green", "Blue", "Yellow"]);

// index positions 0=visual context; 1=auditory context
const RESP_KEYS = ["Q", "W", "O", "P"];
const RESP_KEYS_SHUFFLED = shuffle([
    [RESP_KEYS[0], RESP_KEYS[1]],
    [RESP_KEYS[2], RESP_KEYS[3]],
]).flat();

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const PRMS = {
    screenRes: [960, 720], // minimum screen resolution requested
    nBlksExp: 12, // number of blocks
    nTrlsExp: 64, // number of trials per block
    fixDur: 200, // duration of fixation cross
    fixWidth: 5, // width fixation cross
    fixSize: 20, // size of fixation
    contextDur: 1000, // duration of the context stimulus
    contextPrimeISI: 50, // duration of interval between context and prime
    primeDur: 150, // duration of prime stimulus
    primeTargetISI: 150, // duration of interval between prime and target
    targetDur: 150, // duration of target stimulus
    circleRadius: 100, // size of the prime/target circles
    tooFast: 0, // response limit min
    tooSlow: 2250, // response interval timeout
    fbDur: [0, 1000, 1000, 1000], // duration of feedback for each type (correct, error, too slow, too fast)
    fbTxt: ["", "Falsch!", "Zu langsam!", "Zu schnell!"],
    fbTxtSizeTrial: 30,
    fbTxtSizeBlock: 26,
    waitBlankDur: 500, // interval between screens (e.g. instructions)
    iti: 1000, // duration of inter-trial-interval
    cTrl: 1, // count trials
    cBlk: 1, // count blocks
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
           Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest, Chrome oder Fifefox nutzt und genügend Zeit hast,
           um das Experiment durchzuführen. Wir bitten dich, in den nächsten ca. 40 Minuten konzentriert zu arbeiten.<br><br>
           Bei Fragen oder Problemen wende dich bitte an:<br><br>
           paul.kelber@student.uni-tuebingen.de<br><br>
           Drücke eine beliebige Taste, um fortzufahren`,
        align: "left",
        color: "White",
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
    Bitte stelle in dieser Zeit die Lautstärke deines Soundsystems so ein, dass du
    deutlich zwischen den zwei Tönen differenzieren kannst.<br><br>
    Anmerkung: Es geht immer automatisch weiter (d.h. du musst keine Taste drücken!).<br><br>
    Bereit? Drücke eine beliebige Taste, um die Töne abzuspielen!`,
        align: "left",
        color: "White",
        fontsize: 28,
        bold: true,
        lineheight: 1.5,
    }),
};

const TASK_INSTRUCTIONS_CHECK = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `Bitte stelle sicher, dass du die Töne und den Bildschirm während dem Experiment immer gut wahrnehmen kannst.<br>Im Laufe des Experimentes kann es zufällige Wahrnehmungschecks geben.<br><br>
    Bei diesen Checks musst du entscheiden ob der Ton leise vs. laut oder der Bildschirm dunkel (=grau) vs. hell (=weiss) ist.<br><br>
    Drücke eine beliebige Taste, um fortzufahren!`,
        align: "left",
        color: "White",
        fontsize: 28,
        bold: true,
        lineheight: 1.5,
    }),
};

const RESP_TEXT = generate_formatted_html({
    text: `In jedem Durchgang werden zwei farbige Kreise hintereinander dargeboten. 
  Deine Aufgabe ist es, so schnell und akkurat wie möglich auf die Farbe des <i>zweiten</i> Kreises zu reagieren. 
  Welche Taste Du bei welcher Farbe drücken sollst, ist unten dargestellt:<br><br>
  <span style="color: ${STIM_COLS[RESP_KEYS_SHUFFLED.indexOf(RESP_KEYS[0])]}">${
        RESP_KEYS[0]
    } Taste</span>&emsp;&emsp;<span style="color: ${STIM_COLS[RESP_KEYS_SHUFFLED.indexOf(RESP_KEYS[1])]}">${
        RESP_KEYS[1]
    } Taste</span>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<span style="color: ${
        STIM_COLS[RESP_KEYS_SHUFFLED.indexOf(RESP_KEYS[2])]
    }">${RESP_KEYS[2]} Taste</span>&emsp;&emsp;<span style="color: ${
        STIM_COLS[RESP_KEYS_SHUFFLED.indexOf(RESP_KEYS[3])]
    }">${RESP_KEYS[3]} Taste</span><br><br>
  Wenn du dir die Zuordnungen gut eingeprägt hast, kannst du eine beliebige Taste drücken.`,
    align: "center",
    color: "White",
    fontsize: 28,
    bold: true,
    lineheight: 1.5,
});

const RESP_TEXT_BLOCK = generate_formatted_html({
    text: `
  Deine Aufgabe ist es, so schnell und akkurat wie möglich auf die Farbe des <i>zweiten</i> Kreises zu reagieren. Es gilt: <br/><br/>
  <span style="color: ${STIM_COLS[RESP_KEYS_SHUFFLED.indexOf(RESP_KEYS[0])]}">${
        RESP_KEYS[0]
    } Taste</span>&emsp;&emsp;<span style="color: ${STIM_COLS[RESP_KEYS_SHUFFLED.indexOf(RESP_KEYS[1])]}">${
        RESP_KEYS[1]
    } Taste</span>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<span style="color: ${
        STIM_COLS[RESP_KEYS_SHUFFLED.indexOf(RESP_KEYS[2])]
    }">${RESP_KEYS[2]} Taste</span>&emsp;&emsp;<span style="color: ${
        STIM_COLS[RESP_KEYS_SHUFFLED.indexOf(RESP_KEYS[3])]
    }">${RESP_KEYS[3]} Taste</span><br><br>
    Drücke eine beliebige Taste, um fortzufahren!`,
    align: "center",
    color: "White",
    fontsize: 28,
    bold: true,
    lineheight: 1.5,
});

const RESP_TEXT_TRIAL = generate_formatted_html({
    text: `<span style="color: ${STIM_COLS[RESP_KEYS_SHUFFLED.indexOf(RESP_KEYS[0])]}">${
        RESP_KEYS[0]
    } Taste</span>&emsp;&emsp;<span style="color: ${STIM_COLS[RESP_KEYS_SHUFFLED.indexOf(RESP_KEYS[1])]}">${
        RESP_KEYS[1]
    } Taste</span>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<span style="color: ${
        STIM_COLS[RESP_KEYS_SHUFFLED.indexOf(RESP_KEYS[2])]
    }">${RESP_KEYS[2]} Taste</span>&emsp;&emsp;<span style="color: ${
        STIM_COLS[RESP_KEYS_SHUFFLED.indexOf(RESP_KEYS[3])]
    }">${RESP_KEYS[3]} Taste</span>`,
    align: "center",
    color: "White",
    fontsize: 28,
    bold: true,
    lineheight: 1.5,
});

const TASK_INSTRUCTIONS_RESP_MAPPING = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: RESP_TEXT,
};

////////////////////////////////////////////////////////////////////////
//               Preload Tones and Calibration Routine                //
////////////////////////////////////////////////////////////////////////
const PRELOAD = {
    type: jsPsychPreload,
    audio: AUD_CTXS,
};

////////////////////////////////////////////////////////////////////////
//                         Timeline Variables                         //
////////////////////////////////////////////////////////////////////////
// audio calibration
const TRIALS_CALIBRATION = [{ audio: AUD_CTXS[1] }, { audio: AUD_CTXS[2] }];

// context check
// prettier-ignore
const TRIALS_CONTEXT_CHECK = [
    { blk: "check", ctx_mod: "vis", intensity: "l", ctx_col: VIS_CTXS[1], ctx_sound: AUD_CTXS[0], prime_col: "na", target_col: "na", comp: "na" },
    { blk: "check", ctx_mod: "vis", intensity: "h", ctx_col: VIS_CTXS[2], ctx_sound: AUD_CTXS[0], prime_col: "na", target_col: "na", comp: "na" },
    { blk: "check", ctx_mod: "aud", intensity: "l", ctx_col: VIS_CTXS[0], ctx_sound: AUD_CTXS[1], prime_col: "na", target_col: "na", comp: "na" },
    { blk: "check", ctx_mod: "aud", intensity: "h", ctx_col: VIS_CTXS[0], ctx_sound: AUD_CTXS[2], prime_col: "na", target_col: "na", comp: "na" },
];

// Experiment trials
// prettier-ignore
const TRIALS_EXP = [
    { blk: "exp", ctx_mod: "vis", intensity: "l", ctx_col: VIS_CTXS[1], ctx_sound: AUD_CTXS[0], prime_col: STIM_COLS[0], target_col: STIM_COLS[0], comp: "comp",   correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[0])] },
    { blk: "exp", ctx_mod: "vis", intensity: "l", ctx_col: VIS_CTXS[1], ctx_sound: AUD_CTXS[0], prime_col: STIM_COLS[1], target_col: STIM_COLS[1], comp: "comp",   correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[1])] },
    { blk: "exp", ctx_mod: "vis", intensity: "l", ctx_col: VIS_CTXS[1], ctx_sound: AUD_CTXS[0], prime_col: STIM_COLS[1], target_col: STIM_COLS[0], comp: "incomp", correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[0])] },
    { blk: "exp", ctx_mod: "vis", intensity: "l", ctx_col: VIS_CTXS[1], ctx_sound: AUD_CTXS[0], prime_col: STIM_COLS[0], target_col: STIM_COLS[1], comp: "incomp", correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[1])] },
    { blk: "exp", ctx_mod: "vis", intensity: "h", ctx_col: VIS_CTXS[2], ctx_sound: AUD_CTXS[0], prime_col: STIM_COLS[0], target_col: STIM_COLS[0], comp: "comp",   correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[0])] },
    { blk: "exp", ctx_mod: "vis", intensity: "h", ctx_col: VIS_CTXS[2], ctx_sound: AUD_CTXS[0], prime_col: STIM_COLS[1], target_col: STIM_COLS[1], comp: "comp",   correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[1])] },
    { blk: "exp", ctx_mod: "vis", intensity: "h", ctx_col: VIS_CTXS[2], ctx_sound: AUD_CTXS[0], prime_col: STIM_COLS[1], target_col: STIM_COLS[0], comp: "incomp", correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[0])] },
    { blk: "exp", ctx_mod: "vis", intensity: "h", ctx_col: VIS_CTXS[2], ctx_sound: AUD_CTXS[0], prime_col: STIM_COLS[0], target_col: STIM_COLS[1], comp: "incomp", correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[1])] },
    { blk: "exp", ctx_mod: "aud", intensity: "l", ctx_col: VIS_CTXS[0], ctx_sound: AUD_CTXS[1], prime_col: STIM_COLS[0], target_col: STIM_COLS[0], comp: "comp",   correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[0])] },
    { blk: "exp", ctx_mod: "aud", intensity: "l", ctx_col: VIS_CTXS[0], ctx_sound: AUD_CTXS[1], prime_col: STIM_COLS[1], target_col: STIM_COLS[1], comp: "comp",   correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[1])] },
    { blk: "exp", ctx_mod: "aud", intensity: "l", ctx_col: VIS_CTXS[0], ctx_sound: AUD_CTXS[1], prime_col: STIM_COLS[1], target_col: STIM_COLS[0], comp: "incomp", correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[0])] },
    { blk: "exp", ctx_mod: "aud", intensity: "l", ctx_col: VIS_CTXS[0], ctx_sound: AUD_CTXS[1], prime_col: STIM_COLS[0], target_col: STIM_COLS[1], comp: "incomp", correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[1])] },
    { blk: "exp", ctx_mod: "aud", intensity: "h", ctx_col: VIS_CTXS[0], ctx_sound: AUD_CTXS[2], prime_col: STIM_COLS[0], target_col: STIM_COLS[0], comp: "comp",   correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[0])] },
    { blk: "exp", ctx_mod: "aud", intensity: "h", ctx_col: VIS_CTXS[0], ctx_sound: AUD_CTXS[2], prime_col: STIM_COLS[1], target_col: STIM_COLS[1], comp: "comp",   correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[1])] },
    { blk: "exp", ctx_mod: "aud", intensity: "h", ctx_col: VIS_CTXS[0], ctx_sound: AUD_CTXS[2], prime_col: STIM_COLS[1], target_col: STIM_COLS[0], comp: "incomp", correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[0])] },
    { blk: "exp", ctx_mod: "aud", intensity: "h", ctx_col: VIS_CTXS[0], ctx_sound: AUD_CTXS[2], prime_col: STIM_COLS[0], target_col: STIM_COLS[1], comp: "incomp", correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[1])] },

    { blk: "exp", ctx_mod: "vis", intensity: "l", ctx_col: VIS_CTXS[1], ctx_sound: AUD_CTXS[0], prime_col: STIM_COLS[2], target_col: STIM_COLS[2], comp: "comp",   correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[2])] },
    { blk: "exp", ctx_mod: "vis", intensity: "l", ctx_col: VIS_CTXS[1], ctx_sound: AUD_CTXS[0], prime_col: STIM_COLS[3], target_col: STIM_COLS[3], comp: "comp",   correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[3])] },
    { blk: "exp", ctx_mod: "vis", intensity: "l", ctx_col: VIS_CTXS[1], ctx_sound: AUD_CTXS[0], prime_col: STIM_COLS[3], target_col: STIM_COLS[2], comp: "incomp", correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[2])] },
    { blk: "exp", ctx_mod: "vis", intensity: "l", ctx_col: VIS_CTXS[1], ctx_sound: AUD_CTXS[0], prime_col: STIM_COLS[2], target_col: STIM_COLS[3], comp: "incomp", correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[3])] },
    { blk: "exp", ctx_mod: "vis", intensity: "h", ctx_col: VIS_CTXS[2], ctx_sound: AUD_CTXS[0], prime_col: STIM_COLS[2], target_col: STIM_COLS[2], comp: "comp",   correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[2])] },
    { blk: "exp", ctx_mod: "vis", intensity: "h", ctx_col: VIS_CTXS[2], ctx_sound: AUD_CTXS[0], prime_col: STIM_COLS[3], target_col: STIM_COLS[3], comp: "comp",   correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[3])] },
    { blk: "exp", ctx_mod: "vis", intensity: "h", ctx_col: VIS_CTXS[2], ctx_sound: AUD_CTXS[0], prime_col: STIM_COLS[3], target_col: STIM_COLS[2], comp: "incomp", correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[2])] },
    { blk: "exp", ctx_mod: "vis", intensity: "h", ctx_col: VIS_CTXS[2], ctx_sound: AUD_CTXS[0], prime_col: STIM_COLS[2], target_col: STIM_COLS[3], comp: "incomp", correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[3])] },
    { blk: "exp", ctx_mod: "aud", intensity: "l", ctx_col: VIS_CTXS[0], ctx_sound: AUD_CTXS[1], prime_col: STIM_COLS[2], target_col: STIM_COLS[2], comp: "comp",   correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[2])] },
    { blk: "exp", ctx_mod: "aud", intensity: "l", ctx_col: VIS_CTXS[0], ctx_sound: AUD_CTXS[1], prime_col: STIM_COLS[3], target_col: STIM_COLS[3], comp: "comp",   correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[3])] },
    { blk: "exp", ctx_mod: "aud", intensity: "l", ctx_col: VIS_CTXS[0], ctx_sound: AUD_CTXS[1], prime_col: STIM_COLS[3], target_col: STIM_COLS[2], comp: "incomp", correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[2])] },
    { blk: "exp", ctx_mod: "aud", intensity: "l", ctx_col: VIS_CTXS[0], ctx_sound: AUD_CTXS[1], prime_col: STIM_COLS[2], target_col: STIM_COLS[3], comp: "incomp", correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[3])] },
    { blk: "exp", ctx_mod: "aud", intensity: "h", ctx_col: VIS_CTXS[0], ctx_sound: AUD_CTXS[2], prime_col: STIM_COLS[2], target_col: STIM_COLS[2], comp: "comp",   correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[2])] },
    { blk: "exp", ctx_mod: "aud", intensity: "h", ctx_col: VIS_CTXS[0], ctx_sound: AUD_CTXS[2], prime_col: STIM_COLS[3], target_col: STIM_COLS[3], comp: "comp",   correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[3])] },
    { blk: "exp", ctx_mod: "aud", intensity: "h", ctx_col: VIS_CTXS[0], ctx_sound: AUD_CTXS[2], prime_col: STIM_COLS[3], target_col: STIM_COLS[2], comp: "incomp", correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[2])] },
    { blk: "exp", ctx_mod: "aud", intensity: "h", ctx_col: VIS_CTXS[0], ctx_sound: AUD_CTXS[2], prime_col: STIM_COLS[2], target_col: STIM_COLS[3], comp: "incomp", correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[3])] }
];

////////////////////////////////////////////////////////////////////////
//                         Trial Parts                                //
////////////////////////////////////////////////////////////////////////

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
    trial_duration: PRMS.contextDur,
    func: draw_note, // some visual feedback
};

const WAIT_BLANK = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    trial_duration: PRMS.iti,
    response_ends_trial: false,
};

function draw_fixation() {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");
    ctx.strokeStyle = "White";
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
    func: draw_fixation,
};

const CONTEXT = {
    type: jsPsychStaticCanvasSoundKeyboardResponse,
    canvas_colour: jsPsych.timelineVariable("ctx_col"),
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    sound: jsPsych.timelineVariable("ctx_sound"),
    trial_duration: 0,
    response_ends_trial: false,
};

const CONTEXT_450 = {
    type: jsPsychStaticCanvasSoundKeyboardResponse,
    canvas_colour: jsPsych.timelineVariable("ctx_col"),
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    sound: jsPsych.timelineVariable("ctx_sound"),
    trial_duration: 450,
    response_ends_trial: false,
};

function draw_check_question(args) {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");
    ctx.font = "50px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    let question;
    let answers;
    if (args.ctx_mod == "aud") {
        question = "Leise oder Laut?";
        answers = `${args.labels[0]}: ${RESP_KEYS_CTX[0]}-Taste      ${args.labels[1]}: ${RESP_KEYS_CTX[1]}-Taste`;
    } else if ((args.ctx_mod = "vis")) {
        question = "Dunkel oder Hell?";
        answers = `${args.labels[0]}: ${RESP_KEYS_CTX[0]}-Taste      ${args.labels[1]}: ${RESP_KEYS_CTX[1]}-Taste`;
    }
    ctx.fillText(question, 0, 0);
    ctx.fillText(answers, 0, 100);
}

function code_trial_check() {
    "use strict";

    let dat = jsPsych.data.get().last(1).values()[0];

    let corrCode = 0;
    let correctKey = jsPsych.pluginAPI.compareKeys(dat.key_press, dat.correct_key);

    if (correctKey) {
        corrCode = 1; // correct
    } else if (!correctKey) {
        corrCode = 2; // choice error
    }

    jsPsych.data.addDataToLastTrial({
        date: Date(),
        blockNum: PRMS.cBlk,
        trialNum: PRMS.cTrl,
        corrCode: corrCode,
    });
}

const CONTEXT_CHECK = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    trial_duration: null,
    func: draw_check_question,
    func_args: null,
    response_ends_trial: true,
    data: {
        stim: "cr2_check",
        blk: jsPsych.timelineVariable("blk"),
        ctx_mod: jsPsych.timelineVariable("ctx_mod"),
        intensity: jsPsych.timelineVariable("intensity"),
        ctx_col: jsPsych.timelineVariable("ctx_col"),
        ctx_sound: jsPsych.timelineVariable("ctx_sound"),
        prime_col: jsPsych.timelineVariable("prime_col"),
        target_col: jsPsych.timelineVariable("target_col"),
        comp: jsPsych.timelineVariable("comp"),
        correct_key: null,
    },
    on_start: function (trial) {
        let labels;
        if (trial.data.ctx_mod === "vis") {
            labels = shuffle(VIS_CTX_LABELS);
            if (trial.data.intensity === "h") {
                trial.data.correct_key = RESP_KEYS_CTX[VIS_CTX_LABELS.indexOf("Hell")];
            } else if (trial.data.intensity === "l") {
                trial.data.correct_key = RESP_KEYS_CTX[VIS_CTX_LABELS.indexOf("Dunkel")];
            }
        } else if (trial.data.ctx_mod === "aud") {
            labels = shuffle(AUD_CTX_LABELS);
            if (trial.data.intensity === "h") {
                trial.data.correct_key = RESP_KEYS_CTX[AUD_CTX_LABELS.indexOf("Laut")];
            } else if (trial.data.intensity === "l") {
                trial.data.correct_key = RESP_KEYS_CTX[AUD_CTX_LABELS.indexOf("Leise")];
            }
        }
        trial.func_args = [{ ctx_mod: jsPsych.timelineVariable("ctx_mod"), labels: labels }];
    },
    on_finish: function () {
        code_trial_check();
    },
};

const TRIAL_FEEDBACK_CHECK = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    trial_duration: null,
    response_ends_trial: false,
    on_start: function (trial) {
        let dat = jsPsych.data.get().last(1).values()[0];
        trial.trial_duration = PRMS.fbDur[dat.corrCode - 1];
        trial.stimulus = `<div style="font-size:${PRMS.fbTxtSizeTrial}px; color:White;">${
            PRMS.fbTxt[dat.corrCode - 1]
        }</div>`;
    },
};

const CONTEXT_PRIME_ISI = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: jsPsych.timelineVariable("ctx_col"),
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    trial_duration: PRMS.contextPrimeISI,
    response_ends_trial: false,
};

function draw_prime(args) {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");
    ctx.fillStyle = args.colour;
    ctx.beginPath();
    ctx.arc(0, 0, PRMS.circleRadius, 0, 2 * Math.PI);
    ctx.fill();
}

const PRIME = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: jsPsych.timelineVariable("ctx_col"),
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    response_ends_trial: true,
    trial_duration: PRMS.primeDur,
    func: draw_prime,
    func_args: [{ colour: jsPsych.timelineVariable("prime_col") }],
};

const PRIME_TARGET_ISI = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: jsPsych.timelineVariable("ctx_col"),
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    trial_duration: PRMS.primeTargetISI,
    response_ends_trial: false,
};

function draw_target(args) {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");
    ctx.fillStyle = args.colour;
    ctx.beginPath();
    ctx.arc(0, 0, PRMS.circleRadius, 0, 2 * Math.PI);
    ctx.fill();
}

function code_trial_exp() {
    "use strict";

    let dat = jsPsych.data.get().last(1).values()[0];
    dat.rt = dat.rt !== null ? dat.rt : PRMS.tooSlow;

    let corrCode = 0;
    let correctKey = jsPsych.pluginAPI.compareKeys(dat.key_press, dat.correct_key);

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

const TARGET = {
    type: jsPsychStaticCanvasKeyboardResponseEdit,
    canvas_colour: jsPsych.timelineVariable("ctx_col"),
    canvas_colour_off: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    response_ends_trial: true,
    stimulus_duration: PRMS.targetDur,
    trial_duration: PRMS.tooSlow,
    func: draw_target,
    func_args: [{ colour: jsPsych.timelineVariable("target_col") }],
    data: {
        stim: "cr2",
        blk: jsPsych.timelineVariable("blk"),
        ctx_mod: jsPsych.timelineVariable("ctx_mod"),
        intensity: jsPsych.timelineVariable("intensity"),
        ctx_col: jsPsych.timelineVariable("ctx_col"),
        ctx_sound: jsPsych.timelineVariable("ctx_sound"),
        prime_col: jsPsych.timelineVariable("prime_col"),
        target_col: jsPsych.timelineVariable("target_col"),
        comp: jsPsych.timelineVariable("comp"),
        correct_key: jsPsych.timelineVariable("correct_key"),
    },
    on_finish: function () {
        code_trial_exp();
        PRMS.cTrl += 1;
    },
};

const TRIAL_FEEDBACK_EXP = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    trial_duration: 0,
    response_ends_trial: false,
    on_start: function (trial) {
        let dat = jsPsych.data.get().last(1).values()[0];
        if (dat.corrCode !== 1) {
            trial.trial_duration = PRMS.fbDur[dat.corrCode - 1];
            trial.stimulus =
                `<div style="font-size:${PRMS.fbTxtSizeTrial}px; color:White;">${PRMS.fbTxt[dat.corrCode - 1]}</div>` +
                RESP_TEXT_TRIAL;
        }
    },
};

const ITI = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    trial_duration: PRMS.iti,
    response_ends_trial: false,
};

const TASK_INSTRUCTIONS_BLOCK_START = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    on_start: function (trial) {
        trial.stimulus =
            generate_formatted_html({
                text: `Block ${PRMS.cBlk} von ${PRMS.nBlksExp}`,
                fontsize: 30,
                color: "white",
                align: "left",
                width: "1200px",
                bold: true,
                lineheight: 1.5,
            }) +
            generate_formatted_html({
                text: RESP_TEXT_BLOCK,
                align: "center",
                fontsize: 30,
                width: "1200px",
                bold: true,
                lineheight: 1.5,
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
        let block_dvs = calculateBlockPerformance({ filter_options: { stim: "cr2", blockNum: PRMS.cBlk } });
        let text = blockFeedbackText(
            PRMS.cBlk,
            PRMS.nBlksExp,
            block_dvs.meanRt,
            block_dvs.errorRate,
            (language = "de"),
        );
        trial.stimulus = `<div style="font-size:${PRMS.fbTxtSizeBlock}px; color:White;">${text}</div>`;
    },
    on_finish: function () {
        PRMS.cTrl = 1;
        PRMS.cBlk += 1;
    },
};

////////////////////////////////////////////////////////////////////////
//                         Trial Timelines                            //
////////////////////////////////////////////////////////////////////////

const TRIAL_TIMELINE_CALIBRATION = {
    timeline: [AUDIO_CALIBRATION, WAIT_BLANK],
    timeline_variables: TRIALS_CALIBRATION,
    sample: {
        type: "alternate-groups",
        groups: [
            [0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1],
        ], // each 5 times
    },
};

const TRIAL_TIMELINE_CHECK = {
    timeline: [FIXATION_CROSS, CONTEXT_450, CONTEXT_CHECK, TRIAL_FEEDBACK_CHECK, ITI],
    timeline_variables: TRIALS_CONTEXT_CHECK,
    sample: {
        type: "fixed-repetitions",
        size: 3, // repeat each combination 3 times
    },
};

const TRIAL_TIMELINE_EXP = {
    timeline: [FIXATION_CROSS, CONTEXT, CONTEXT_PRIME_ISI, PRIME, PRIME_TARGET_ISI, TARGET, TRIAL_FEEDBACK_EXP, ITI],
    timeline_variables: TRIALS_EXP,
};

////////////////////////////////////////////////////////////////////////
//                              Save                                  //
////////////////////////////////////////////////////////////////////////
const DIR_NAME = getDirName();
const EXP_NAME = getFileName();

function save() {
    const vpNum = getTime();
    jsPsych.data.addProperties({ vpNum: vpNum });

    const data_fn = `${DIR_NAME}data/${EXP_NAME}_${vpNum}`;
    saveData("/Common/write_data.php", data_fn, [{ stim: "cr2" }, { stim: "cr2_check" }]);
    // saveDataLocal(data_fn, [{ stim: 'cr2'}, {stim:'cr2_check' }]);
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
    exp.push(vpInfoForm("/Common7+/vpInfoForm_de.html"));
    exp.push(mouseCursor(false));

    exp.push(WELCOME_INSTRUCTIONS);
    exp.push(WAIT_BLANK);

    // audio calibration
    exp.push(TASK_INSTRUCTIONS_CALIBRATION);
    exp.push(WAIT_BLANK);
    exp.push(TRIAL_TIMELINE_CALIBRATION);

    // check block
    exp.push(TASK_INSTRUCTIONS_CHECK);
    exp.push(WAIT_BLANK);
    exp.push(TRIAL_TIMELINE_CHECK);

    // start of experiment blocks
    exp.push(TASK_INSTRUCTIONS_RESP_MAPPING);
    exp.push(WAIT_BLANK);

    for (let blk = 0; blk < PRMS.nBlksExp; blk++) {
        // manipulation instructions at very start or half way
        exp.push(TASK_INSTRUCTIONS_BLOCK_START);
        exp.push(WAIT_BLANK); // blank before 1st trial start

        let blk_timeline = { ...TRIAL_TIMELINE_EXP };
        blk_timeline.sample = {
            type: "alternate-groups",
            groups: [
                repeatArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], PRMS.nTrlsExp / TRIALS_EXP.length),
                repeatArray(
                    [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
                    PRMS.nTrlsExp / TRIALS_EXP.length,
                ),
            ],
            randomize_group_order: true,
        };
        exp.push(blk_timeline);

        // After the break of block 5
        if (blk === 4) {
            exp.push(TRIAL_TIMELINE_CHECK);
        }

        // between block feedback
        exp.push(BLOCK_FEEDBACK);
        exp.push(WAIT_BLANK);
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
